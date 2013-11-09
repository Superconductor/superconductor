// Manages the layout and vertex generation of the visualization
// glr is the GLRunner object resposible for rendering the visualization
// ignoreCL = true => use this just for data flattening 
function CLRunner(glr, cfg) {
	if (!cfg) cfg = {};
	this.cfg = {
			ignoreCL: cfg.hasOwnProperty('ignoreCL') ? cfg.ignoreCL : false,
			webworkerLayout: cfg.hasOwnProperty('webworkerLayout') ? cfg.webworkerLayout : false,
			numWorkers : cfg.hasOwnProperty('numWorkers') ? cfg.numWorkers : 4,
			minParallelLayoutLevelLength: cfg.hasOwnProperty('minParallelLayoutLevelLength') ? cfg.minParallelLayoutLevelLength : 1000
		};	
	for (i in cfg) this.cfg[i] = cfg[i];

	this.glr = glr;

	if (!this.cfg.ignoreCL) {
		
		if(!webcl) {
			throw new SCException('WebCL does not appear to be supported in your browser');
		}
		
		this.cl = webcl;
	
		var platforms = this.cl.getPlatforms();
		if(platforms.length === 0) {
			throw new SCException('No platforms available');
		}
		var platform = platforms[0];
	
		this.devices = platform.getDevices(this.cl.DEVICE_TYPE_GPU);
		if(this.devices.length === 0) {
			throw new SCException('No devices available');
		}

		// FIXME: Remove this once all of our systems get updated to the latest github WebCL rev
		// If this version of the WebCL platform uses the new CL/GL sharing with extensions use that
		if(typeof this.cl.getExtension != 'undefined') {
			var extension = null;
			extension = this.cl.getExtension('KHR_GL_SHARING');
			if (extension === null) {
				throw new SCException('Could not create a shared CL/GL context using the WebCL extension system');
			}
			
			this.context = extension.createContext({platform: platform, devices: this.devices, deviceType: this.cl.DEVICE_TYPE_GPU, sharedContext: null});
		} else { 	// Otherwise, use the old style CL/GL sharing
			this.context = this.cl.createContext({platform: platform, devices: this.devices, deviceType: this.cl.DEVICE_TYPE_GPU, sharedContext: null});
		}
		

		if(this.context == null) {
			throw new SCException('Could not create a shared WebCL context');
		}
	
		this.queue = this.context.createCommandQueue(this.devices, null);
		if(this.queue == null) {
			throw new SCException('Could not create a WebCL command queue');
		}	

		// The WebCL buffer created from a WebGL vbo
		this.clVBO = null;
	}

	// A map of CLDataWrapper objects for each input field in the grammar
	this.proxyData = {};

}


CLRunner.prototype.readyToLayout = function() {
	var kernelsLoaded = this.cfg.ignoreCL ? true : (typeof(this.program) !== 'undefined');
	var dataLoaded = (typeof(this.tree_size) !== 'undefined');
	return (kernelsLoaded && dataLoaded);
};


//Reflect, for each visit, what fields it will read/write (can overlap)
//FIXME have compiler emit
CLRunner.prototype.computeReadWriteSets = function() {
// => { writes: {self: [ str ], child: [ str ]}, reads: {self: [ str ], child: [ str ]}}

	if (!this.hasOwnProperty('visit_0')) throw new SCException('Did not previously run loadLayoutEngine()');
  	
  	var clr = this;
  	
  	//======== determine fields
	var getLastVisitNum = function () {	// => int			
			var lastVisitNum = 0;
			while (true) {
				if (clr["visit_" + (lastVisitNum + 1)]) {
					lastVisitNum++;
				} else {
					return lastVisitNum;
				}
			}
		};
	
	var getNodeVisitors = function (visitNum) { // => [ fn ]
		var res = [];
		for (var i in clr)
			if (i.match("visit_[a-z]*_" + visitNum))
				res.push(clr[i]);
		return res;
	};
	
	var arrayToSet = function (arr) { // => [ 'a ]
		var res = [];		
		arr.forEach(function (v) { if (res.indexOf(v) == -1) res.push(v); });
		return res;		
	}
	
	var getFldsWrites = function (fn) { // => [ str ]  
        var fnStr = fn.toString(); 
        var selfHits = 
        	[].concat(fnStr.match(
        	/this\.fld_[a-zA-Z0-9_]*\[index\] =/g))
        	.filter(function (v) { return v; }) //kill null if no matches
        	.map(function(v) { return v.slice("this.".length, v.indexOf("[")); });
        var childHits = 
        	[].concat(fnStr.match(
        	/this\.fld_[a-zA-Z0-9_]*\[((current_node)|(this\.GetAbsoluteIndex\(this\.fld_[a-z_]*\[index\], index\)))\] =/g))
        	.filter(function (v) { return v; }) //kill null if no matches
        	.map(function(v) { return v.slice("this.".length, v.indexOf("[")); });
        return {self: arrayToSet(selfHits), child: arrayToSet(childHits)};
	};
	var getFldsReads = function (fn) { // => [ str]
		var lines = 
			fn.toString()
				.split("\n")
				.filter(function (l) { return l.indexOf(" = ") != -1; }) //only asgns
		var loopLines = lines.filter(function (l) { return l.indexOf(" for ") != -1; });
		var nonLoopLines = lines.filter(function (l) { return l.indexOf(" for ") == -1; });
		var nonLoopLinesRhs = 
				nonLoopLines
				.map(function (line) { return line.split(" = ")[1]; })
				.filter(function (l) { //sanity check, FIXME remove
					if (l.indexOf(" = ") != -1) throw 'double assign!'; 
					return true; })
					
		var selfHits =
			nonLoopLinesRhs
				.reduce(function (acc, line) {
					var matches = 
						[].concat(line.match(/this\.fld_[a-zA-Z0-9_]*\[index/g))
						.filter(function (v) { return v; })
						.map(function (v) { return v.slice("this.".length, v.indexOf("[")); });
					return acc.concat(matches); }, ["displayname"]);				
		
		var childHits = 
			nonLoopLinesRhs.reduce(function (acc, line) {
				var matches = 
					[].concat(line.match(/this\.fld_[a-zA-Z0-9_]*\[((current_node)|(this\.GetAbsol))/g))
					.filter(function (v) { return v; })
					.map(function (v) { return v.slice("this.".length, v.indexOf("[")); });
				return acc.concat(matches); }, []);						

		//loops: idx reads
		if (loopLines.length > 0) {
			childHits.push("right_siblings");			
			selfHits = selfHits.concat(
				loopLines.map(function (line) {
					return line.split("=")[3].match("this.fld_[a-zA-Z0-9_]*")[0].slice("this.".length);
				}));
		}
	
		//child writes: ptr read
		selfHits = selfHits.concat(										
			nonLoopLines
				.map(function (line) { return line.split(" = ")[0]; })
				.filter(function (l) { return l.indexOf("GetAbsoluteIndex") != -1; })
				.map(function (l) { return l.slice(l.indexOf("(")+"(this.".length, l.indexOf("index")-1); }));
				
		return {self: arrayToSet(selfHits), child: arrayToSet(childHits)};
	};	
	//=======
	
	var visitFields = [];	
	var mx = getLastVisitNum();
	var reducer = function (hits) {
		return hits
			.reduce(function (acc, writes) {
				return {
					self: arrayToSet(acc.self.concat(writes.self)),
					child: arrayToSet(acc.child.concat(writes.child)) };
			}, {self: [], child: []}); };
	for (var i = 0; i <= mx; i++) {
		var writes = reducer(getNodeVisitors(i).map(getFldsWrites));
		var reads = reducer(getNodeVisitors(i).map(getFldsReads));
		
		var any = []
		any = any.concat(reads.child);
		any = any.concat(writes.child);
		any = any.concat(reads.self);
		any = any.concat(writes.self);
		any = arrayToSet(any);
		
		var returnViews = [];		
		returnViews = returnViews.concat(writes.self);
		returnViews = returnViews.concat(writes.child);
		returnViews = arrayToSet(returnViews);
				
		visitFields.push({
			writes: writes, 
			reads: reads,
			any: any,
			returnViews: returnViews});	
	}
	
	return visitFields;
			  		
}; // computeReadWriteSets		  		
			  		
CLRunner.prototype.makeLayoutWorker = function (engineSource) {

	if (!this.hasOwnProperty('visit_0')) throw new SCException('Did not previously run loadLayoutEngine()');

	var workerFn = function () {
	
		var that = this;

		function GetAbsoluteIndex (rel, ref) {
			if (rel == 0) return 0;
			if (ref < that.levelLength) { //self row
				return rel + ref;
			} else { //child row
				return rel + ref /* next child: 1 */;
			}
		}

	    onmessage = function(m) {
	    	try {
	    		//INPUT SCHEMA HERE
				for (var i in m.data.buffers) that[i] = m.data.buffers[i];
				that.visitorNum = m.data.visitorNum;
				that.startOffset = m.data.startOffset;
				that.endOffset = m.data.endOffset;
				that.levelLength = m.data.levelLength;
				that.tree_size = m.data.tree_size;

				//TODO WRITE BUFFERS
				
				var fn = this["visit_" + m.data.visitorNum];				
				for (var i = 0; i < m.data.span; i++) {
					fn(i, m.data.tree_size);
				}
				
				var transferables = m.data.returnViews.map(function (i) { return that[i].buffer; });
				
				var writes = {};
				m.data.returnViews.forEach(function (fld) { writes[fld] = that[fld]; });

				pm = that.webkitPostMessage || that.postMessage; //HACK				
				pm({res: 'done', writes: writes}, transferables);
			} catch (e) {
				postMessage({err: e.toString()});
			}        		
        };

	};
	
	var workerStr = engineSource + " ; " + workerFn.toString().slice("function () {".length, -1);

	var workerBlob = window.URL.createObjectURL(new Blob([ workerStr ], {
		type: "text/javascript"
	}));

	return workerBlob;
};

CLRunner.prototype.runKernelRange = function (visitorNum, lvl, nextLvlLen, startIdx, endIdx, cb) {
	var clr = this;
	
	var t0 = new Date().getTime();

	//============== buffers for each field: make new & copy data
	var buffers = {};

	//1. make buffer for each field: this + next level (if exists & used) 
	//FIXME precompute
	var any = this.readWriteSets[visitorNum].any;

	function memcpy(dst, dstOffset, src, srcOffset, length) {
//		console.log('memcpy', dst.byteLength, dstOffset, src.byteLength, srcOffset, length);
	  var dstU8 = new Uint8Array(dst, dstOffset, length);
	  var srcU8 = new Uint8Array(src, srcOffset, length);
	  dstU8.set(srcU8);
	};
	any.forEach(function (i) {
		var numElts = lvl.length + 
			((clr.readWriteSets[visitorNum].reads.child.indexOf(i) != -1 
			  || clr.readWriteSets[visitorNum].writes.child.indexOf(i) != -1) ? 
				nextLvlLen : 0);
		var buff = new (clr[i].constructor)(numElts);
		buffers[i] = buff;
	});
		
	//2. copy data in if needed
	any.forEach(function (i) {
		var buff = buffers[i];	
		if (clr.readWriteSets[visitorNum].reads.self.indexOf(i) != -1) {
			memcpy(
				buff.buffer, 0, 
				clr[i].buffer, clr[i].byteOffset + lvl.start_idx * buff.constructor.BYTES_PER_ELEMENT, 
				lvl.length * buff.constructor.BYTES_PER_ELEMENT);
		}
		if (nextLvlLen && (clr.readWriteSets[visitorNum].reads.child.indexOf(i) != -1)) {
			memcpy(
				buff.buffer, lvl.length * buff.constructor.BYTES_PER_ELEMENT,
				clr[i].buffer, clr[i].byteOffset + (lvl.start_idx + lvl.length) * buff.constructor.BYTES_PER_ELEMENT,
				nextLvlLen * buff.constructor.BYTES_PER_ELEMENT);
		}	
	});
	
	//3. transferable objects
	var transferableObjects = [];
	for (var i in buffers) transferableObjects.push(buffers[i].buffer);
	
	//=====
	
	//TODO locality?
	var w = this.freeLayoutWorkers.pop();
	if (!w) throw 'no free worker';
	this.busyLayoutWorkers.push(w);

	w.onmessage = function (m) { 
		clr.busyLayoutWorkers.splice(clr.busyLayoutWorkers.indexOf(w),1)
		clr.freeLayoutWorkers.push(w);
		for (var i in m.data.writes) {
			var buff = m.data.writes[i];
			if (clr.readWriteSets[visitorNum].writes.self.indexOf(i) != -1) {
				memcpy(
					clr[i].buffer, clr[i].byteOffset + lvl.start_idx * clr[i].constructor.BYTES_PER_ELEMENT, 
					buff.buffer, 0, 
					lvl.length * clr[i].constructor.BYTES_PER_ELEMENT);
			}
			if (nextLvlLen && clr.readWriteSets[visitorNum].writes.child.indexOf(i) != -1) {
				memcpy(
					clr[i].buffer, clr[i].byteOffset + (lvl.start_idx + lvl.length) * clr[i].constructor.BYTES_PER_ELEMENT,
					buff.buffer, lvl.length * clr[i].constructor.BYTES_PER_ELEMENT,
					nextLvlLen * clr[i].constructor.BYTES_PER_ELEMENT);
				//FIXME only copy relevant subset of children
				//  need to get interval info from parser
				/// currently obscured due to unique child names
				if (false && clr[i][lvl.start_idx + lvl.length] != buff[lvl.length]) { throw 'mismatch!'; }
			}	
		}
		cb(m); 
	};
	w.postMessage = w.webkitPostMessage || w.postMessage; //HACK
	w.postMessage({
			buffers: buffers, 
			visitorNum: visitorNum,
			startOffset: startIdx - lvl.start_idx, //relative to level start
			endOffset: (startIdx - lvl.start_idx) + (endIdx - startIdx), //relative to level start
			levelLength: lvl.length, 		
			tree_size: this.tree_size,
			returnViews: this.readWriteSets[visitorNum].returnViews},
		transferableObjects);
};

// Given the Javascript source of a layout engine, evals that source in this context and then
// finishes preperations of the layout engine
CLRunner.prototype.loadLayoutEngine = function(engineSource) {
    eval(engineSource);
	if (this.cfg.webworkerLayout) {
		this.readWriteSets = this.computeReadWriteSets();
		this.layoutWorkerBlob = this.makeLayoutWorker(engineSource);
		
		console.log('making layout workers', this.cfg.numWorkers);
		this.freeLayoutWorkers = [];
		this.busyLayoutWorkers = [];
		for (var i = 0; i < this.cfg.numWorkers; i++)
			this.freeLayoutWorkers.push(new Worker(this.layoutWorkerBlob));
	}	
	if (!this.cfg.ignoreCL) {
		this.buildKernels();
	}
};


// Fully lays out the loaded data, asks the GLRunner to allocate a buffer of appropriate size, then
// writes vertex data for this layout
CLRunner.prototype.layout = function() {
	if(!this.readyToLayout()) {
		console.debug("CLRunner asked to run layout, but it is not ready to layout");
		return;
	}

	this.runTraversals();
	if (!this.cfg.ignoreCL) {
		this.setVBO(this.glr.reallocateVBO(this.getRenderBufferSize()));
	}
	this.runRenderTraversal();
};

CLRunner.prototype.layoutAsync = function(cb) {
	if(!this.readyToLayout()) {
		console.debug("CLRunner asked to run layout, but it is not ready to layout");
		return;
	}

	this.runTraversalsAsync(function () {
		if (!this.cfg.ignoreCL) {
			//FIXME async
			this.setVBO(this.glr.reallocateVBO(this.getRenderBufferSize()));
		}
		this.runRenderTraversalAsync(cb);	
	});
};

CLRunner.prototype.setVBO = function(glVBO) {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');

	try {
		if(this.clVBO != null) {
			// There seems to be a bug/undocumented feature where this method isn't defined...
			if(typeof(this.clVBO.release) !== 'undefined') {
				this.clVBO.release();
			}
		}
		this.clVBO = this.context.createFromGLBuffer(this.cl.MEM_WRITE_ONLY, glVBO);
	} catch(e) {
		console.error("Error creating a shared OpenCL buffer from a WebGL buffer: " + e.message);
	}
};


	
CLRunner.prototype.treeSize = function (data) {
	var res = 1;
	if (data.children) {
		for (var i in data.children) {
			var c = data.children[i];
			if (c instanceof Array) {
				for (var j = 0; j < c.length; j++) {
					res += this.treeSize(c[j]);
				}
			} else res += this.treeSize(c);
		}
	}
	return res;		
};
	
CLRunner.prototype.flattenEdges = function(res, node, nodeCont, absIdx, level, leftmostChildIdx) {

	if (node.children) {
		var rollCount = 0;
		
		for (var lbl in node.children) {
			var c = node.children[lbl];
			
			// FIXME 'class' is a reserved word. Rename field in JSON to something else.
			var fld = 'fld_' + node.class.toLowerCase() + "_child_" + lbl.toLowerCase() + "_leftmost_child";
			if (!this[fld]) {
				console.error("Flattening EXN: input data provides child+fld that was not declared in grammar:", fld);				
				throw ("could not fld " + fld + " (" + lbl + ")");
			}
			this[fld][absIdx] = leftmostChildIdx + rollCount - absIdx; //relative to node				
			
			
			if (c instanceof Array) {				
				for (var ci = 0; ci < c.length - 1; ci++) {	
					var childIdx = leftmostChildIdx + rollCount + ci;
					this.right_siblings[childIdx] = 1; //relative
				}
				if (c.length > 0) {
					//FIXME default zero, skip?
					var lastChildIdx = leftmostChildIdx + rollCount + c.length - 1;
					this.right_siblings[lastChildIdx] = 0;
				}
				for (var ci = 0; ci < c.length; ci++) {
					this.parent[leftmostChildIdx + rollCount + ci] = absIdx;
				}
				if (c.length > 0) {
					this.left_siblings[leftmostChildIdx + rollCount] = rollCount ? 1 : 0;
				}
				for (var ci = 1; ci < c.length; ci++) {
					this.left_siblings[leftmostChildIdx + rollCount + ci] = 1;
				}
				rollCount += c.length;
			} else {
				//FIXME default zero, skip?
				var childIdx = leftmostChildIdx + rollCount;
				this.right_siblings[childIdx] = 0;			
				this.parent[childIdx] = absIdx;
				this.left_siblings[childIdx] = rollCount ? 1 : 0;
				rollCount++;
			}
		}
	}
};

CLRunner.prototype.tokens = [];
CLRunner.prototype.tokenize = function (str) {
	// var clean = str.toLowerCase(); //TODO coerce?

	var idx = this.tokens.indexOf(str);
	if (idx != -1) return idx;
	
	this.tokens.push(str);
	return this.tokens.length - 1;
};

CLRunner.prototype.ignoredParseFields = {};
CLRunner.prototype.warnedParseFields = {}
CLRunner.prototype.flattenNode = function(res, node, nodeCont, absIdx, level, leftmostChildIdx) {

	this.flattenEdges(res, node, nodeCont, absIdx, level, leftmostChildIdx);
	
	for (var i in node) {
		if (i == 'children') continue; 
		else if (i == 'class') {
			var ntype = this.classToToken(node['class']);
			this.grammartokens_buffer_1[absIdx] = ntype;
			continue;
		} else if (i == 'id') {
			var clean = ("" + node[i]).toLowerCase();
			this.id[absIdx] = this.tokenize(clean);
		} else {
			var j = i.toLowerCase();
			if (i.indexOf("_") != -1) {
				if (!this.warnedParseFields[i]) {
					console.warn("Flattener: stripping '_' from input field", i);
					this.warnedParseFields[i] = true;
				}
				j = j.replace("_","");
			}
			var fld = 'fld_' + node.class.toLowerCase() + "_" + j;
			if (this[fld]) {
				this[fld][absIdx] = node[i]; //ignore extra user inputs
				continue;
			}
			fld = 'fld_' + this.classToIFace(node['class']) + "_" + j;
			if (this[fld]) {
				this[fld][absIdx] = node[i]; //ignore extra user inputs
				continue;
			}
			if (!this.ignoredParseFields[j]) {
				console.warn("Flattener: could not find field ", j, " in schema, tried class and interface ", fld);
				this.ignoredParseFields[j] = true;
			}
		}			
	}
};


CLRunner.prototype.flatten = function (data, treeSize) {
	var res = {treeSize: treeSize, levels: [], proxy: this.proxyData};	
	var level = [{k:'root',v: data, mult: false, parentIdx: -1}];
	var nextLevel = [];
	var absIdx = 0;

	while (level.length != 0) {
		res.levels.push({start_idx: absIdx, length: level.length});
		var leftmostChildIdx = absIdx + level.length;

		for (var i = 0; i < level.length; i++) {

			var nodeCont = level[i];				
			var node = nodeCont.v;

			this.flattenNode(res, node, nodeCont, absIdx, level, leftmostChildIdx);															
			if (node.children) for (var j in node.children) {
				var c = node.children[j];
				if (c instanceof Array) {
				for (var k = 0; k < c.length; k++) 
					nextLevel.push({k: k, v: c[k], mult: true, i: k, parentIdx: absIdx});							
				leftmostChildIdx += c.length;
				} else {
				nextLevel.push({k: j, v: c, mult: false, parentIdx: absIdx});
				leftmostChildIdx++;
				}
			}
			absIdx++;
		}			
		level = nextLevel;
		nextLevel = [];		
	}

	return res;
};	
	

// This function takes in the tree-like JSON data representing our tree, then allocates the CPU-side
// typed arrays which will hold the flattened data, flattens & splits the JSON into the typed 
// arrays, then allocates the GPU memory, creates proxy objects (for interacting with GPU data,) and
// and transfers the CPU-side data to the GPU.
CLRunner.prototype.loadData = function(data, skipProxies) {
	// We read the tree size from the JSON file
	this.tree_size = this.treeSize(data);
	
	// _gen_allocateHostBuffers takes in an int representing the number of nodes in the tree,
	// and allocates all the TypedArrays CPU-side
	this._gen_allocateHostBuffers(this.tree_size); //was superconductor.clr._gen
	this._gen_allocateHostProxies(this.tree_size);
	
	// Takes the tree-like JSON data, and the size of the tree, and flattens + structures splits the
	// tree and writes it to the CPU-side TypedArrays. 
	var t0 = (new Date()).getTime();
	var fd = this.flatten(data, this.tree_size);
	var t1 = (new Date()).getTime();
	console.log('flattening', t1 - t0, 'ms');
	
	// We copy the number of levels from the flattened data for use when doing GPU traversals
	this.levels = fd.levels;

	if (!this.cfg.ignoreCL) {
	
	
		console.log('tree size', this.tree_size);
	

	
		//FIXME skip as implicit to flatten
		//this._gen_copyHostBuffers(data, this.tree_size);
		
		// This allocates memory on the GPU
		this._gen_allocateClBuffers();
		
		console.log('cl alloc', this.tree_size);
	

		// This creates the Javascript proxy objects
		this._gen_allocateProxyObjects();
	
		console.log('proxy alloc');
	

		// This transfers the CPU-side TypedArrays to the GPU
		var t2 = (new Date()).getTime();
		this._gen_transferTree();
		

		var t3 = (new Date()).getTime();
		console.log('GPU transfer time', t3 - t2, 'ms');
	
	} else {
	
		// This creates the Javascript proxy objects
		if (!(skipProxies)) 
			this._gen_allocateProxyObjects();	

	}
};


//Convert typed or untyped array into a sparse format that condenses zeros
//Optionally specify minimum size to block a sequence of zeros
//returns original array size, constructor, dictionary of zeros (mapping start to length), 
// and dense values (dictionary mapping start to an array of values)
// [number] => {len: int, optTypeName: arrayTypeName, zeros: {start: length}, dense: {start: [ number] }}
CLRunner.prototype.deflate = function (arr, minBlockSize /* optional */) {
	var res = {zeros: {}, dense: {}, len: arr.length};
	
	try {
		res.optTypeName = arr.constructor.toString().split(" ")[1].split("(")[0]; //function Float32Array(...
	} catch (e) {
		res.optTypeName = null;
	}
	
	if (!minBlockSize) minBlockSize = 64;
	
	for (var i = 0; i < arr.length; i++) {
		var zeroCount = 0;
		for (var j = i; j < arr.length; j++) {
			if (arr[j] == 0) {
				zeroCount++;
			} else break;
		}
		if (zeroCount >= minBlockSize) {
			res.zeros[i] = zeroCount;
			i += zeroCount - 1;
			continue;
		} else {
			var denseCount = 0;
			for (var j = i; j < Math.min(arr.length, i + minBlockSize); j++) {
				if ((arr[j] == 0) && (j - i >= minBlockSize)) break;
				else denseCount++;
			}			
			var sub = [];
			for (var k = 0; k < denseCount; k++) sub.push(arr[i + k]);
			//FIXME: for above, sub = arr.slice(i, i + denseCount) crashes node for stringifying the result
			res.dense[i] = sub;
			i += denseCount - 1;
			continue;						
		}
	}
			
	return res;
}

CLRunner.prototype.deflateMT = function(arr, minBlockSize, minFileSize) {
    var deflated = this.deflate(arr, minBlockSize);
    var makeChunk = function () {  return {dense: {}, optTypeName: deflated.optTypeName}; }
    
    if (!minFileSize) minFileSize = 1 * 1e3;
    var res = [];
    var firstChunk = makeChunk();
    for (var i in deflated) if (i != "dense") firstChunk[i] = deflated[i];
    res.push(firstChunk);
    var counter = 0;
    var chunk = firstChunk;
    var q = [];
    q.push(deflated);
    while (q.length > 0) {
        var item = q.shift();
        var startIdx = -1;
        for (var i in item.dense) {
            startIdx = i;
            break;
        }
        if (startIdx == -1) continue;
        var denseArray = item.dense[startIdx];
        var enqueue = []; //put deferred subchunks at start of q (order-preserving)
        if (counter + denseArray.length < minFileSize) {
            counter += denseArray.length;
            chunk.dense[startIdx] = denseArray;
        } else {
            var cutoff = minFileSize - counter;
            var pre = [];
            for (var i = 0; i < cutoff; i++) pre.push(denseArray[i]);
            chunk.dense[startIdx] = pre;
            var post = [];
            for (var i = cutoff; i < denseArray.length; i++) post.push(denseArray[i]);
            var postQItem = makeChunk();
            postQItem.dense[1 * startIdx + cutoff] = post;
            enqueue.push(postQItem);
            counter = 0;
            chunk = makeChunk();
            res.push(chunk);
        }
        for (var i in item.dense) {
            if (i != startIdx) {
                var otherItem = makeChunk();
                otherItem.dense[i] = item.dense[i];
                enqueue.push(otherItem);
            }
        }
        while (enqueue.length > 0) q.unshift(enqueue.pop());
    }
    for (var i = 0; i < res.length; i++) {
        var chunk = res[i];
        var min = null;
        var max = null;
        for (var j in chunk.dense) {
            min = min == null ? j : Math.min(min, j);
            max = max == null ? j : Math.max(max, 1 * j + chunk.dense[j].length);
        }
        chunk.min = min;
        chunk.max = max;
    }
    return res;
};


//inflate spArr into denseArr (destructive)
//offset denotes where denseSubArr starts relative to denseArr
//pure: safe to copy source into a worker and call
CLRunner.prototype.inflateChunk = function (spArr, denseSubArr, offset) {
	if (spArr.dense) {
		for (var lbl in spArr.dense) {
			var start = 1 * lbl; //toInt
			var buff = spArr.dense[lbl];
			var len = buff.length;
			for (var i = 0; i < len; i++) {
				denseSubArr[start + i - offset] = buff[i];			
			}
		}
	}
	if (spArr.zeros && (denseSubArr.constructor == Array)) {
		//typed arrays are already zeroed out
		for (var lbl in spArr.zeros) {
			var start = 1 * lbl;
			var end = start + spArr.zeros[lbl];
			for (var i = start; i < end; i++) denseSubArr[i  - offset] = 0;
		}
	}
}

// {len: int, optTypeName /* optional */: string} * /* optional*/ {arrType: arrConstructor, ...} -> Array
//Create the backing array for a sparse array
//If provided, use the specified typed array constructor
//nativeConstructors is an optional lookup table for Array, Float32Array, etc.
//  typically use 'window'; if not supplied, returns an Array type
CLRunner.prototype.allocArray = function (spArr, nativeConstructors) {
	var alloc = Array;
	if (spArr.optTypeName && nativeConstructors && nativeConstructors[spArr.optTypeName]) {
		alloc = nativeConstructors[spArr.optTypeName];
	}
	return new alloc(spArr.len);
};

//inflate(deflate(arr)) == arr
//nativeConstructors is an optional lookup table for Array, Float32Array, etc.
//  typically use 'window'; if not supplied, returns an Array type
CLRunner.prototype.inflate = function (spArr, nativeConstructors) {
	var res = this.allocArray(spArr, nativeConstructors);
	this.inflateChunk(spArr, res, 0);
	return res;
}

//overlap: whether to overlap sending to the GPU or not
// if not, must copy big GPU buffer later
CLRunner.prototype.inflateMt = function (file, data, nativeConstructors, maxNumWorkers, intoGPU, intoCPU, cb) {	
	maxNumWorkers = maxNumWorkers ? maxNumWorkers : 4;

	var bufferNames = data.bufferLabels;
	for (var i in bufferNames) {
		var lbl = bufferNames[i];		
		this[lbl] = this.allocArray(data.buffersInfo[lbl], nativeConstructors);
	}

	var q = []; //nfo objects to process
	var summaryMap = {};
	for (var i = 0; i < data.summary.length; i++) {
		q.push(data.summary[i]);
		summaryMap[data.summary[i].uniqueID] = data.summary[i];
	}
	
    var workerFn = function() {
    	var global = self;
        onmessage = function(m) {
            var url = m.data;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                	var spArr = null;

                	try { 
                		spArr = JSON.parse(xhr.responseText);
                    } catch (e) {
                        postMessage({
                            error: "could not parse JSON :: " + e.toString(),
                            url: url
                        });
                    	return;
                    }
                    
                    try {
                        
						var min = Number.MAX_VALUE;
						var max = 0;
						if (spArr.dense) {
							for (var lbl in spArr.dense) {
								var start = 1 * lbl;
								var end = start + spArr.dense[lbl].length;
								min = Math.min(min, start);
								max = Math.max(max, end);
							}
						}
						if (min == Number.MAX_VALUE) min = 0;                            
						
						var len = max - min;
						var dense;
						if (false) {
							//TODO no idea why this does not work in Safari (worker phenomena?)
							var arrConstructor = global[spArr.optTypeName];
							dense = new arrConstructor(len);
						} else {
							switch (spArr.optTypeName) {
								case "Int32Array":
									dense = new Int32Array(len);
									break;
								case "Float32Array":
									dense = new Float32Array(len);
									break;
								default:
									throw 'unknown arr type' + spArr.optTypeName;
							}
						}
	
						inflateChunk(spArr, dense, min);
						postMessage({
							postTime: new Date().getTime(),
							nfo: spArr.nfo,
							start: min,
							end: max,
							dense: dense
						});
                        
                    } catch (e) {
                        postMessage({
                            error: e.toString() + "::" + spArr.optTypeName + "::" + self[spArr.optTypeName],
                            spArr: spArr,
                            url: url
                        });
                    }
                }
            };
            xhr.send(null);
        };
    };
	
    var parser = function() {
        var inflateFnStr = "function inflateChunk" + CLRunner.prototype.inflateChunk.toString().substr("function".length).slice(0, -1) + " } ";
        var workerStr = inflateFnStr + workerFn.toString().substr("function () {".length).slice(0, -1);
        var workerBlob = window.URL.createObjectURL(new Blob([ workerStr ], {
            type: "text/javascript"
        }));
        var toUrl = function(rootFile, nfo) {
            return rootFile.split(".json")[0] + nfo.uniqueID + ".json";
        };
        var count = 0;
        return function(q, rootFile, cb) {
        	count++;
            var worker = new Worker(workerBlob);
            worker.onmessage = function(m) {
                if (m.error) {
                    console.error("worker err", m.error);
                    worker.terminate();
                }
                cb.call(worker, m.data);
                if (q.length > 0) worker.postMessage(toUrl(rootFile, q.shift())); else worker.terminate();
            };
            worker.spawn = function() {
                if (q.length > 0) worker.postMessage(toUrl(rootFile, q.shift())); else console.warn("worker init on empty q; slow init?");
            };
            worker.name = count;
            return worker;
        };
    }();
    var ready = 0;
    var numLaunch = Math.min(maxNumWorkers, q.length);
    var that = this;
    var parsers = [];
    var memCopyTime = 0;
    var messagePassTime = 0;
    var that = this;
    if (intoGPU) this._gen_allocateClBuffers();
    var launchTime = new Date().getTime();
    for (var t = 0; t < numLaunch; t++) {
        parsers.push(parser(q, file, function(chunk) {
        
        	messagePassTime += new Date().getTime() - chunk.postTime;
        	
			var t0 = new Date().getTime();
			if (intoGPU) {
				that.queue.enqueueWriteBuffer( //FIXME make non-blocking or, if allowable, do in worker
					that['cl_' + chunk.nfo.bufferLabel], true, chunk.start * chunk.dense.BYTES_PER_ELEMENT, 
					chunk.dense.byteLength, chunk.dense);
			} 
			if (intoCPU) {
				var dense = that[chunk.nfo.bufferLabel];
				dense.set(chunk.dense, chunk.start);
			}			
			var endTime = new Date().getTime();
			memCopyTime += (endTime - t0);
            
            ready++;
            if (ready == data.summary.length) {
            	console.log('memcpy time (' + (intoGPU ? 'GPU' : 'no GPU' ) + ',' + (intoCPU? 'CPU' : 'no CPU') + ')', memCopyTime, 'ms');
            	console.log('messagePassTime time (may include memcpy time)', messagePassTime, 'ms');
            	console.log(parsers.length, 'all worker launch-to-reduce time', endTime - launchTime, 'ms');
                cb(null, "done");
            }
        }));
    }
	for (var p = 0; p < parsers.length; p++) parsers[p].spawn();

}


//find typed array constructors in window
CLRunner.prototype.getArrayConstructors = function () {
	var cNames = ["Int8Array", "Int16Array", "Int32Array","Uint8Array", "Uint16Array", "Uint32Array", "Float32Array", "Float64Array"];
	var res = {};
	for (var i = 0; i < cNames.length; i++) 
		if (window[cNames[i]]) 
			res[cNames[i]] = window[cNames[i]];
	return res;
}

//if !doTransfer, assume CLBuffers and transfer already happened
CLRunner.prototype.loadDataFlatFinish = function (doTransfer) {
	var t0 = new Date().getTime();
	this._gen_allocateHostProxies(this.tree_size);	
    if (doTransfer) this._gen_allocateClBuffers();
	this._gen_allocateProxyObjects();	
	var t1 = new Date().getTime();
	if (doTransfer) this._gen_transferTree();
    console.log("overhead:", new Date().getTime() - t0, "ms (gpu transfer sub-time:", new Date().getTime() - t1, "ms)");
}

//Similar to loadData except fetch pre-flattened buffers (incl. tree size + tree levels info)
CLRunner.prototype.loadDataFlat = function (data) {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');

	function getBufferNames(obj) {
		var res = [];
		for (var i in obj)
			if (i.indexOf("_buffer_1") != -1)
				res.push(i);
		return res;
	}
	var bufferNames = getBufferNames(data);
	
	if (bufferNames.length == 0) throw new SCException('received no buffers');
	if (!data.tree_size) throw new SCException('no tree size');
	if (!data.levels) throw new SCException('no tree level info');
	if (!data.tokens) throw new SCException('no tree token info');

	this.tree_size = data.tree_size;
	this.levels = data.levels;	
	this.tokens = data.tokens; //merge?

	
	//copy flat json => typed arrays.
	var constructors = this.getArrayConstructors();			
	for (var lbl in data) {
		if (!lbl.match("_buffer_1")) continue;
		this[lbl] = this.inflate(data[lbl], constructors);
	}
	this.loadDataFlatFinish(true);
};

CLRunner.prototype.loadDataFlatMt = function(digestFile, digestData, optNumMaxWorkers, intoGPU, intoCPU, cb) {

	var data = digestData;
    var bufferNames = data.bufferLabels;
    
    if (bufferNames.length == 0) throw new SCException("received no buffers");
    if (!data.tree_size) throw new SCException("no tree size");
    if (!data.levels) throw new SCException("no tree level info");
    if (!data.tokens) throw new SCException("no tree token info");
    if (!data.summary) throw new SCException("no tree summary info");
    this.tree_size = data.tree_size;
    this.levels = data.levels;
    this.tokens = data.tokens;
    
	var constructors = this.getArrayConstructors();			

	var that = this;		
	this.inflateMt(digestFile, data, constructors, optNumMaxWorkers, intoGPU, intoCPU, function () {
		that.loadDataFlatFinish(false);
		cb();
	});
};

CLRunner.prototype.buildKernels = function() {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');

	var kernels = "";

	// Build the kernel up from the arrays of static OpenCL code (headers) and visualization-
	// specific OpenCL code (source). These need to be put into arrays of substrings because
	// there's a limit on the size of string literals in Javascript source.
	for(var i = 0; i < this.kernelHeaders.length; i++) {
		kernels += this.kernelHeaders[i];
	}

	for(var i = 0; i < this.kernelSource.length; i++) {
		kernels += this.kernelSource[i];
	}

	this.program = this.context.createProgram(kernels);
	try {
		this.program.build(this.devices);
	} catch(e) {
		console.error("Error loading WebCL kernels: " + e.message);
		console.error("Inputs:", {headers: this.kernelHeaders, source: this.kernelSource});
		console.error("Build status: " + this.program.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
		// console.error("Build log: " + this.program.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
		window.clSource = kernels;
		console.error("Source:\n" + kernels);
		return null;
	}
	this._gen_getKernels();
};


CLRunner.prototype.runTraversals = function() {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');

	try {
		this._gen_runTraversals();
	} catch(e) {
		console.error("Error running OpenCL tree traversals: " + e.message);
	}
};


CLRunner.prototype.runRenderTraversal = function() {
	// Find the render pass, which will be the last visit pass which exists (HACKY AS SHIT)
	var renderTraversal = '_gen_run_visit_0';
	for(var i = 1; this['_gen_run_visit_' + i]; i++) {
		renderTraversal = '_gen_run_visit_' + i;
	}

	if (this.cfg.ignoreCL) {
		this[renderTraversal]();
	} else {
 
		try {
			this.queue.enqueueAcquireGLObjects([this.clVBO]);
			this[renderTraversal](this.clVBO);
			this.queue.enqueueReleaseGLObjects([this.clVBO]);
			this.queue.finish();
		} catch(e) {
			console.error("Error running OpenCL render traversal: " + e.message);
			console.error(e);
		}	
	}
};


CLRunner.prototype.runRenderTraversalAsync = function(cb) {
	// Find the render pass, which will be the last visit pass which exists (HACKY AS SHIT)
	var renderTraversal = '_gen_run_visit_0';
	for(var i = 1; this['_gen_run_visit_' + i]; i++) {
		renderTraversal = '_gen_run_visit_' + i;
	}
	
	if (this.cfg.ignoreCL) {
		this[renderTraversal](null, cb);
	} else {
		//FIXME async
		try {
			this.queue.enqueueAcquireGLObjects([this.clVBO]);	
			this[renderTraversal](this.clVBO);	
			this.queue.enqueueReleaseGLObjects([this.clVBO]);

			this.queue.finish();
			cb();
		} catch(e) {
			console.error("Error running OpenCL render traversal: " + e.message);
			console.error(e);
		}
	}
}


CLRunner.prototype.traverseAsync = function(direction, kernel, cb) {

	if (direction != "topDown" && direction != "bottomUp") throw "unknown direction";

	var s0 = new Date().getTime();	
	
	var finish = function () {
		console.log('multicore', direction, new Date().getTime() - s0, 'ms');
		cb(); 
	};
	
	if (this.cfg.ignoreCL && this.cfg.webworkerLayout) {
		var clr = this;
		var getVisitNum = function (fn) {	// => int			
			for (var num = 0; true; num++)
				if (clr["visit_" + num] == fn) return num;
		};
		
		var seqLvl = function (lvl) {
			var startIdx = lvl.start_idx;
			var endIdx = startIdx + lvl.length;
			for (var idx = startIdx; idx < endIdx; idx++) {
				kernel.call(clr, idx, clr.tree_size, 
				clr.float_buffer_1, clr.int_buffer_1, clr.grammartokens_buffer_1, clr.nodeindex_buffer_1);
			}				
		}
				
		var visitNum = getVisitNum(kernel);
		if (this.hasOwnProperty("visit_" + (visitNum + 1))) {
			function runLevel (lvl) {

				var chunksReady = 0;
				var workerDone = function () { 
					if (++chunksReady == chunks) {
						var more = 
							direction == "topDown" ? (lvl + 1 < clr.levels.length)
							: (lvl - 1 >= 0);					
						if (more) {
							chunksReady = 0; //reset
							runLevel(lvl + (direction == "topDown" ? 1 : -1));
						} else finish();
					}
				};
				
				if (clr.levels[lvl].length > clr.cfg.minParallelLayoutLevelLength) {
					var startIdx = clr.levels[lvl].start_idx;
					var endIdx = startIdx + clr.levels[lvl].length;				
					var chunk = Math.round(clr.levels[lvl].length / clr.cfg.numWorkers) + 1

					var chunks = 0;
					for (var next = startIdx; next < endIdx; next += chunk) chunks++;
					chunksReady = 0;					
					for (var next = startIdx; next < endIdx; next += chunk) {
						clr.runKernelRange(
							visitNum, 
							clr.levels[lvl], (clr.levels.length > lvl + 1) ? clr.levels[lvl+1].length : 0, 
							next, Math.min(endIdx, next + chunk), 
							workerDone);											
					}
				} else { 
					seqLvl(clr.levels[lvl]); 
					//finish
					chunks = 1; 
					workerDone();
				}
				
			};
			runLevel(direction == "topDown" ? 0 : (this.levels.length - 1));
		} else { 
			//render pass needs globals
			if (direction == "topDown") {
				for (var i = 0; i < this.levels.length; i++) 
					seqLvl(this.levels[i]); 
			} else {
				for (var i = this.levels.length - 1; i >= 0; i--) 
					seqLvl(this.levels[i]); 
			}
			finish();
		}
	} else {
		if (direction == "topDown") this.topDownTraversal(kernel);
		else this.bottomUpTraversal(kernel);
		finish();
	}
};

CLRunner.prototype.topDownTraversalAsync = function(kernel, cb) {
	this.traverseAsync("topDown",kernel, cb);	
};

CLRunner.prototype.bottomUpTraversalAsync = function(kernel, cb) {
	this.traverseAsync("bottomUp", kernel, cb);	
};


CLRunner.prototype.topDownTraversal = function(kernel) {
	var s0 = new Date().getTime();	
	if (this.cfg.ignoreCL && this.cfg.webworkerLayout) {
		throw 'Multicore traversals require async invocation';
	} else if (this.cfg.ignoreCL) {
		for (var i = 0; i < this.levels.length; i++) {
			var startIdx = this.levels[i].start_idx;
			var endIdx = startIdx + this.levels[i].length;
			for (var idx = startIdx; idx < endIdx; idx++) {
				kernel.call(this, idx, this.tree_size, 
				this.float_buffer_1, this.int_buffer_1, this.grammartokens_buffer_1, this.nodeindex_buffer_1);
			}
		}
	} else {
		var types = WebCLKernelArgumentTypes;
		for(var i = 0; i < this.levels.length; i++) {
			kernel.setArg(0, this.levels[i]["start_idx"], types.UINT);
			var globalWorkSize = new Int32Array(1);
			globalWorkSize[0] = this.levels[i]["length"];
			this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
			this.queue.finish();
		}
	}
	console.log(this.cfg.ignoreCL ? 'CPU' : 'GPU', 'topDown pass', new Date().getTime() - s0, 'ms');
};


CLRunner.prototype.bottomUpTraversal = function(kernel) {
    var s0 = new Date().getTime();
	if (this.cfg.ignoreCL) {
		for (var i = this.levels.length - 1; i >= 0; i--) {
			var startIdx = this.levels[i].start_idx;
			var endIdx = startIdx + this.levels[i].length;
			for (var idx = startIdx; idx < endIdx; idx++) {
				kernel.call(this, idx, this.tree_size, 
				this.float_buffer_1, this.int_buffer_1, this.grammartokens_buffer_1, this.nodeindex_buffer_1);
			}
		}
	} else {
		var types = WebCLKernelArgumentTypes;
		for(var i = this.levels.length - 1; i >= 0; i--) {
			kernel.setArg(0, this.levels[i]["start_idx"], types.UINT);
			var globalWorkSize = new Int32Array(1);
			globalWorkSize[0] = this.levels[i]["length"];
			this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
			this.queue.finish();
		}	
 	}
	console.log(this.cfg.ignoreCL ? 'CPU' : 'GPU', 'bottomUp pass', new Date().getTime() - s0, 'ms');

};


//================
CLRunner.prototype.selectorEngine = function selectorsCL(sels, IdToks /* optional */) {
	var clr = this;

	var PredTokens = {'*': 0};
	var OpTokens = {' ': 0, '>': 1, '+': 2};

	if (!IdToks) IdToks = [];	
	if (IdToks.indexOf('') == -1) IdToks.push('');

	var StarTok = PredTokens['*'];
	var NoIdTok = IdToks.indexOf('');
	
	//phase 0: parsing
    /////////////
    function parsePredicate(predStr) {
      var hashIdx = predStr.indexOf('#');
      return {
        tag: hashIdx == -1 ? predStr
            : hashIdx > 0 ? predStr.substring(0, hashIdx)
            : '*',
        id: hashIdx == -1 ? '' :  predStr.substring(1 + hashIdx)
      };      
    }
    function parsePredicates(predsStr) {
      var res = [];
      var selsRaw = predsStr.split(",");
      for (var si = 0; si < selsRaw.length; si++) {
        var sel = [];
        var sibs = selsRaw[si].trim().split("+");
        for (var sibi = 0; sibi < sibs.length; sibi++) {
          if (sibi > 0) sel.push({combinator: '+'});
          var pars = sibs[sibi].trim().split(">");
          for (var pi = 0; pi < pars.length; pi++) {
            if (pi > 0) sel.push({combinator: '>'});
            var des = pars[pi].trim().split(" ");
            for (var di = 0; di < des.length; di++) {
              if (di > 0) sel.push({combinator: ' '});
              sel.push(parsePredicate(des[di]));              
            }
          }
        }
        if (sel.length > 0) res.push(sel); 
      }
      return res;    
    }
    
    
    function parseVal(valStrRaw) {
    	var valStr = valStrRaw.toLowerCase().trim();
    	if (valStr.length == 0) throw 'Bad CSS selector property value (it was empty): ' + valStr;
		if (valStr[0] == '#') {
			try {
				var code = valStr.slice(1);
				if (code.length == 3)  {
					code = code[0] + code[0] + code[1] + code[1] + code[2] + code[2];
				}
				if (code.length == 6){
					// Hex colors are always full opacity
					code = 'FF' + code;					
				}
				return parseInt(code, 16);
			} catch (e) {
				throw 'Bad hex color conversion on CSS property value ' + valStr;
			}
			
		}  else if ((valStr.slice(0,4) == "rgb(") && (valStr.slice(-1) == ")")) {
			try {
				var code = valStr.slice(4);
				code = code.slice(0, code.length - 1);
				colors = code.split(",").map(function (s) { return parseInt(s.trim()); });
				return colors[0] * (256*256) + colors[1] * 256 + colors[2];
			} catch (e) {
				throw 'Bad RGB color conversion on CSS property value ' + valStr;
			}
		}  else { 
			try {
				var val = parseFloat(valStrRaw);
				if (val != Math.round(val)) val = val + "f";
				return val;
			} catch (e) {
				throw 'Failed parse of CSS property value (believed to be a number): ' + valStr;
			}
		}
    }
    
    function parseProperties(propsStr) {
      var res = {};
      var props = collapse(propsStr,/( ;)|(; )|(;;)/g,';').trim().split(";");
      for (var i = 0; i < props.length; i++) {
		if (props[i] == "") continue;
		var pair = props[i].trim().split(":");
		var lhs = pair[0].trim().toLowerCase();
		if (!window.superconductor.clr[lhs]) throw 'CSS property does not exist: ' + pair[0];
		res[lhs] = parseVal(pair[1]);
      }
      return res;
    }
    
    function collapse(str,before,after) {
      var raw = str.replace(before,after);
      var rawOld;
      do {
        rawOld = raw;
        raw = raw.replace(before,after);
      } while (rawOld != raw);
      return raw;
    }
    
    function parse(css) {
      var res = [];      
      var selsRaw = collapse(css,/  |\t|\n|\r/g,' ').split("}");
      for (var si = 0; si < selsRaw.length; si++) {
        if (selsRaw[si].indexOf("{") == -1) continue;
        var pair = selsRaw[si].split("{");
        var selRaw = pair[0];
        var propsRaw = pair[1];
        res.push(
          {predicates: parsePredicates(selRaw),
           properties: parseProperties(propsRaw)});
                
      }
      return res;
    }
      
	
	
	
	//phase 1: tokenization
	function tokenizePred(pred) {
	  if (pred.tag) {
	    if (pred.tag == '*') pred.tag = StarTok;
	    else pred.tag = clr.classToToken(pred.tag.toUpperCase());
	  } else {
	    pred.tag = 0;
	  }
	  
	  if (pred.id) {
	  	var idClean = pred.id.toLowerCase();
	  	var idx = IdToks.indexOf(idClean);
	    if (idx == -1) {
	      IdToks.push(idClean);
	      idx = IdToks.indexOf(idClean);
	    }
	    pred.id = idx;
	  } else {
	    pred.id = NoIdTok;
	  }	  
	}
	
	function tokenizeOp(op) {
	  if (op.combinator) {
	    op.combinator = OpTokens[op.combinator];
	  } else {
	  	op.combinator = OpTokens[' '];
	  }
	}


	function tokenize(sels) {	
		var selsTok = jQuery.extend(true, [], sels);
		for (var s = 0; s < selsTok.length; s++) {
			var sel = selsTok[s];
			sel.raw = sels[s];
			for (var p = 0; p < sel.predicates.length; p++) {
			  var pred = sel.predicates[p];
			  pred.raw = sel.raw.predicates[p];
			  tokenizePred(pred[0]);		  
			  for (var t = 1; t < pred.length; t+=2) {
				tokenizeOp(pred[t]);
				tokenizePred(pred[t+1]);  
			  }
			}
		}
		return selsTok;
	}

    /////////////
    //TODO: include classes, inline style
    function specificity(pred, line) {
      var a = 0;
      var b = 0;
      var c = 0;
      for (var i = 0; i < pred.length; i += 2) {
        var p = pred[i];
        if (p.id != NoIdTok) {
          a++;
        }
        if (p.tag != StarTok) c++;
        //no classes for now..
      }
      return a * Math.pow(2,30) + b * Math.pow(2,24) + c * Math.pow(2,12) + line;
    }
    
    function addSel(hash, sel, pred, lbl, hit) {
      var lookup = pred[ pred.length - 1][lbl];
      var arr = hash[lookup];
      if (!arr) {
        arr = [];
        hash[lookup] = arr;
      }
      arr.push(hit);
    }
    
    function hash(selsTok) {      
      //map last tag and ID to selectors (tagged with priority)
      //use lexical ordering for specificity (later > earlier)
      var idHash = {};
      var tagHash = {};
      var star = []
      for (var i = 0; i < selsTok.length; i++) {
        var sel = selsTok[i];
        for (var ps = 0; ps < sel.predicates.length; ps++) {
          var pred = sel.predicates[ps];
          var lastP = pred[pred.length - 1];
          var hit = {
            propList: i,
            pred: pred, 
            specificity: specificity(pred, i),
            properties: sel.properties 
          };
          if (lastP.id != NoIdTok) {
            addSel(idHash, sel, pred, 'id', hit);
          } else if (lastP.tag != StarTok) {
            addSel(tagHash, sel, pred, 'tag', hit);
          } else {
            star.push(hit);
          }          
        }
      }
      var sorter = function (a,b) { return a.specificity - b.specificity; };
      for (var i in idHash) idHash[i].sort(sorter);
      for (var i in tagHash) tagHash[i].sort(sorter);
      //star is implicitly already lowest-to-highest
      return {idHash: idHash, tagHash: tagHash, star: star};      
    }
    
	function makeMatcher(hashes) {
            		  
      var preParams = "unsigned int tree_size, __global float* float_buffer_1, __global int* int_buffer_1, __global GrammarTokens* grammartokens_buffer_1, __global NodeIndex* nodeindex_buffer_1, __global int* selectors_buffer";
      var preArgs = "tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, selectors_buffer";
	  
	  var makeOuterLoopHelpers = function () {
	  
	    res = "";
	    
	    res += "unsigned int matchPredicate(" + preParams + ", unsigned int tagTok, unsigned int idTok, unsigned int nodeindex) {\n";
	    res += "  if (idTok != " + NoIdTok + ") { \n";
	    res += "    if (idTok != id(nodeindex)) return 0;\n";
	    res += "  }\n";
	    res += "  if (tagTok != " + StarTok + ") { \n";
	    res += "    if (tagTok != displayname(nodeindex)) return 0;\n";
	    res += "  }\n";
	    res += "  return 1;\n";
	    res += "}\n"; 
	    
	    var makeGetNumSel = function (hashName, hash) {
	        var res = "";
            res += "unsigned int getNumSel" + hashName + "(unsigned int token) {\n";
            res += "  switch (token) {\n";
            for (var i in hash) {
                res += "    case " + i + ":\n";
                res += "      return " + hash[i].length + ";\n";
                res += "      break;\n";
            }	    
            res += "    default:\n";
            res += "      return 0;\n";
            res += "  }\n";
            res += "}\n";	
            return res;    
	    };
	    res += makeGetNumSel('Id', hashes.idHash);
	    res += makeGetNumSel('Tag', hashes.tagHash);


		var makeGetSpecSels = function (sels) {
			var res = "";

			res += "      switch (offset) {\n";
			for (var j = 0; j < sels.length; j++) {
				res += "        case " + j + ":\n";
				res += "          return " + sels[j].specificity + ";\n";
				res += "          break;\n";
			}
			res += "        default: //should be unreachable\n";
			res += "          return 0;\n";
			res += "      }\n";

            return res;
		};

        var makeGetSpec = function (hashName, hash) {
            var res = "";
            res += "unsigned int getSpec" + hashName + "(unsigned int token, unsigned int offset) {\n";
            res += "  switch (token) {\n";
            for (var i in hash) {
                res += "    case " + i + ":\n";
                var sels = hash[i];
                if (sels.length == 0) throw 'Internal selector compiler error: expected to find sels';
                res += makeGetSpecSels(sels);
                res += "      break;\n";
            }
            res += "    default: //should be unreachable\n";
            res += "      return 0;\n";
            res += "  }\n";
            res += "}\n";        
            return res;
        };
	    res += makeGetSpec('Id', hashes.idHash);
	    res += makeGetSpec('Tag', hashes.tagHash);
	    
	    res += "unsigned int getSpecStar(unsigned int offset) {\n";
	    res += makeGetSpecSels(hashes.star);
	    res += "}\n";
	    
	    
	    var makeMatchSelector_ijSels = function (hashName, selsName, sels) {
	    	var res = "";
	    	
	    	    for (var j = 0; j < sels.length; j++) {
                    var sel = sels[j];
                    res += "unsigned int matchSelector" + hashName + "_" + selsName + "_" + j + "(" + preParams + ", unsigned int nodeindex) {\n";
                    var lastPred = sel.pred[sel.pred.length - 1];
                    res += "  if (!matchPredicate(" + preArgs + ", " + lastPred.tag + ", " + lastPred.id + ", nodeindex))\n";
                    res += "    return 0;\n";
                    if (sel.pred.length != 1) {
                        res += "  if (nodeindex == 0) return 0;\n";
                        res += "  unsigned int nextNodeIdx = nodeindex;\n";
                        res += "  unsigned int nextSib = 0;\n";
                        res += "  unsigned int matched = 0;\n";
                        for (var p = sel.pred.length - 2; p >= 1; p-=2) {
                            var op = sel.pred[p];
                            var pred = sel.pred[p - 1];
                            switch (op.combinator) {
                                case OpTokens[' ']:
                                    res += "  //' '\n";
                                    res += "  matched = 0;\n";
                                    res += "  while (!matched) {\n";
                                    res += "    if (nextNodeIdx == 0) return 0;\n";
                                    res += "    nextNodeIdx = parent(nextNodeIdx);\n";
                                    res += "    matched = matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx);\n";
                                    res += "  }\n";
                                    res += "  nextSib = 0;\n";
                                    break;
                                //=====================
                                case OpTokens['>']:
                                    res += "  //'>'\n";
                                    res += "  if (nextNodeIdx == 0) return 0;\n";
                                    res += "  nextNodeIdx = parent(nextNodeIdx);\n";
                                    res += "  if (!matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx)) return 0;\n";
                                    res += "  nextSib = 0;\n";
                                    break;
                                //=====================
                                case OpTokens['+']:   
                                    res += "  //'+'\n";           
                                    res += "  if (left_siblings(nextNodeIdx - nextSib) == 0) return 0;\n";
                                    res += "  nextSib++;\n";
                                    res += "  if (!matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx - nextSib)) return 0;\n";
                                    break;
                                //=====================
                                default:
                                    console.error('unknown combinator', op.combinator);
                                    throw 'err';                
                            }
                        }	            
                    }
                    res += "  return 1;\n";
                    res += "}\n";
                    res += "unsigned int applySelector" + hashName + "_" + selsName + "_" + j + "(" + preParams + ", unsigned int nodeindex) {\n";
                    var count = 0;
                    for (var p in sel.properties) {
                        res += "  " + p + "(nodeindex) = " + sel.properties[p] + ";\n";
                        count++;
                    }	            
                    res += "  return " + count + ";\n";
                    res += "}\n";
                }
            return res;
	    };
	
        var makeMatchSelector_ij = function (hashName, hash) {
            var res = "";        
            for (var i in hash) {
                var sels = hash[i];
                res += makeMatchSelector_ijSels(hashName, i, sels);
            }	
            return res;
        };    
	    res += makeMatchSelector_ij('Id', hashes.idHash);
	    res += makeMatchSelector_ij('Tag', hashes.tagHash);
	    res += makeMatchSelector_ijSels('Star', "", hashes.star);
        
        var makeMatchSelectorSels = function (hashName, selsName, sels) {
        	var res = "";

			res += "      switch (offset) {\n";
			for (var j = 0; j < sels.length; j++) {
				res += "        case " + j + ":\n";
				res += "          if (matchSelector" + hashName + "_" + selsName + "_" + j + "(" + preArgs + ", nodeindex)) {\n";
				res += "            return applySelector" + hashName + "_" + selsName + "_" + j + "(" + preArgs + ", nodeindex);\n";
//				res += "            return 1;\n";  //count num matches instead
				res += "          } else { return 0; }\n";
				res += "          break;\n";
			}
			res += "        default: //should be unreachable\n";
			res += "          return 0;\n";
			res += "      }\n";        	
        	
        	return res;
        };
        
        var makeMatchSelector = function (hashName, hash) {
            var res = "";
            res += "unsigned int matchSelector" + hashName + "(" + preParams + ", unsigned int token, unsigned int offset, unsigned int nodeindex) {\n";
            res += "  switch (token) {\n";
            for (var i in hash) {
                res += "    case " + i + ":\n";
                var sels = hash[i];
                if (sels.length == 0) throw 'Internal selector compiler error: expected to find sels';
                res += makeMatchSelectorSels(hashName, i, sels);
                res += "      break;\n";
            }
            res += "    default: //should be unreachable\n";
            res += "      return 0;\n";
            res += "  }\n";	    
            res += "}\n";
            return res;
	    }	    
	    res += makeMatchSelector('Id', hashes.idHash);
	    res += makeMatchSelector('Tag', hashes.tagHash);
	    
	    res += "unsigned int matchSelectorStar(" + preParams + ", unsigned int offset, unsigned int nodeindex) {\n";
	    res += makeMatchSelectorSels("Star", "", hashes.star);
	    res += "}\n";



	    return res;
	  };

	  var matchNodeGPU = function (indexName, indent) {
	    if (!indent) indent = "  ";
	  
	    var src = "\n";
	    src += "unsigned int nodeid = id(" + indexName + ");\n";
	    src += "unsigned int numSelId = getNumSelId(nodeid);\n";
	    src += "unsigned int tagid = displayname(" + indexName + ");\n";
	    src += "unsigned int numSelTag = getNumSelTag(tagid);\n";
	    src += "unsigned int numSelStar = " + hashes.star.length + ";\n";
	    src += "unsigned int curId = 0;\n";
	    src += "unsigned int curTag = 0;\n";
	    src += "unsigned int curStar = 0;\n";
	    src += "unsigned int matches = 0;\n";
	    src += "while (curId != numSelId || curTag != numSelTag || curStar != numSelStar) {\n";
	    src += "  unsigned int tryId = (curId == numSelId) ? 0 : \n";
	    src += "      ( (curTag != numSelTag) && (getSpecId(nodeid, curId) >= getSpecTag(tagid, curTag))) ? 0 :\n";
	    src += "      ( (curStar != numSelStar) && (getSpecId(nodeid, curId) >= getSpecStar(curStar))) ? 0 : 1;\n";
	    src += "  if (tryId) {\n";
	    src += "    matches += matchSelectorId(" + preArgs + ", nodeid, curId, " + indexName + ");\n";	    
	    src += "    curId++;\n";
	    src += "  } else if ((curTag != numSelTag) && ((curStar == numSelStar) || (getSpecTag(tagid, curTag) >= getSpecStar(curStar)))) {\n";
	    src += "    matches += matchSelectorTag(" + preArgs + ", tagid, curTag, " + indexName + ");\n";	    
	    src += "    curTag++;\n";	
	    src += "  } else { \n";
	    src += "    matches += matchSelectorStar(" + preArgs + ", curStar, " + indexName + ");\n";
	    src += "    curStar++;\n";
	    src += "  }\n";
	    src += "}\n";
        src += "selectors_buffer[" + indexName + "] = matches;\n";
	    return src.replace(/\n/g,"\n" + indent);
	
	  };
	
	  return function (kernelName) {
	    var src = "";
	    
	    src += makeOuterLoopHelpers();
	    
	    src += "__kernel void " + kernelName + " (unsigned int start_idx, unsigned int tree_size, __global float* float_buffer_1, __global int* int_buffer_1, __global GrammarTokens* grammartokens_buffer_1, __global NodeIndex* nodeindex_buffer_1, __global int* selectors_buffer) {\n";
	    src += "  unsigned int nodeindex = get_global_id(0) + start_idx;\n";
	    src += matchNodeGPU("nodeindex");
	    src += "}";
	    return src;

	  };
	}
	
	///////////////

    console.log("loading selector engine (GPU)");
    var ast = parse(sels);
	var selsTok = tokenize(ast);
	var hashes = hash(selsTok);
    var res = {
        kernelMaker: makeMatcher(hashes),
        ir: {ast: ast, selsTok: selsTok, hashes: hashes}
    };
    return res;
};
//================

CLRunner.prototype.setSelectors = function (selectors) {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');
	
	var startT = new Date().getTime();
	
    var srcName = "seEngine" + Math.round(Math.random() * 1000000); //TODO remove (helps with stale instr cache platform bug)
	var src = this.selectorEngine(selectors, this.tokens).kernelMaker(srcName);
//    console.log(src);
	
	var headers = "";
	headers += "typedef unsigned int GrammarTokens;\n";		
	headers += "typedef unsigned int NodeIndex;\n";		
	headers += this.offsets;//tokens: "enum zzz {abc=4, asdf, fdas};\n";
	var kernelSrc = headers + "  " + src;

	try {				
		this.programSelectors = this.context.createProgram(kernelSrc);	
		this.programSelectors.build(this.devices[0]);
		this.selKernel = this.programSelectors.createKernel(srcName);
	} catch (e) {
		console.error("Error loading WebCL selectors: " + e.message);
		console.error("Inputs:", {
			fullSource: kernelSrc,
			selSource: src
		});
		console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
		console.error(kernelSrc);
		console.error("Build log: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
		throw {error: e};
	}			
	
	console.log("Selector compile time:", new Date().getTime() - startT, 'ms');
};

CLRunner.prototype.runSelectors = function () {

	var startT = new Date().getTime();

	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');

	var kernel = this.selKernel;
	if (!kernel) throw 'no selectors; call setSelectors';

	this._gen_setKernelArguments(kernel);
	
	if (!this.cl_selectors_buffer) { //FIXME remove this debugging buffer (entry per node)
		this.selectors_buffer = new Int32Array(this.grammartokens_buffer_1.length);
		this.cl_selectors_buffer = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.selectors_buffer.byteLength);
	}	
	kernel.setArg(6, this.cl_selectors_buffer); //FIXME remove hardcoding
	
	var globalWorkSize = new Int32Array(1);
	globalWorkSize[0] = this.tree_size;
	
	var runStartT = new Date().getTime();


	try {
		this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
		this.queue.finish();
	} catch (e) {
		console.error("Error running WebCL selectors: " + e.message);
		//console.error("Inputs:", {fullSource: kernelSrc, selSource: src });
		console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
		console.error("Build log: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
		throw {error: e};
	}  

	//FIXME remove (debugging)	
	try {
		this.queue.enqueueReadBuffer(this.cl_selectors_buffer, true, 0, this.selectors_buffer.byteLength, this.selectors_buffer);
		var count = 0;
		for (var i = 0; i < this.selectors_buffer.length; i++) count += this.selectors_buffer[i];
		console.log("applied", count, "instances of CSS properties");
	} catch (e) {
		console.error("Error checking run of WebCL selectors: " + e.message);
		//console.error("Inputs:", {fullSource: kernelSrc, selSource: src });
		console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
		console.error("Build log: ", this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
		throw {error: e};
	}
    
    var endT = new Date().getTime();
    console.log("Selector create instance time:", runStartT - startT, "ms, Selector compute time", endT - runStartT, 'ms');    
};

CLRunner.prototype.setAndRunSelectors = function (selectors) {
	if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');
	var startT = new Date().getTime();
	this.setSelectors(selectors);
	this.runSelectors();
	console.log("Total selectors time", new Date().getTime() - startT, 'ms');
};
		
		
try {
	exports.CLRunner = CLRunner;
} catch (e) {
	//not being run as a node module; ignore
}


