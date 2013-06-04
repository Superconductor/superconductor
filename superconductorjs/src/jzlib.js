/*

	Flatten and optionally compress a SC json file (or object) into several formats:
		'flat': naive; flatten buffers into dense arrays
		'sparse': represent long spans of zero as a dictionary
			min span is configurable (minBlockSize)
		'sparseMT': like 'sparse' but also split into multiple files for parallel parsing; 
			configurable: min span (minBlockSize) & file size (minFileSize)

	commandline interface is in flattener.js

	exports compress:: 
		  file.json | jsonObj
		* kbindings.js 
		* 'flat' | 'sparse' | 'sparseMT'
		* null | { opt minBlockSize: int, opt minFileSize: int}
		* output.json
		* ( error * ret -> () )
		=>
		()
*/

var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
var Seq = require('seq');

var clr = require('./CLRunner.js');

function chainRead(file,ret,prop) {
	return function () {
		var continuation = this;
		//console.log('reading', file);
		fs.readFile(file, 'ascii', function (err, str) {
			if (err) continuation(err);
			else {
				ret[prop] = str;
				continuation()
			}
		});	  
	};
}
function chainWrite(file,src) {
	return function () {
		fs.writeFile(file, typeof(src) == 'function' ? src() : src, this);
	};
}


//grep for *_buffer_ arrays
function getBuffers(flattener) {
	var res = [];
	for (var i in flattener)
		if (i.indexOf("_buffer_1") != -1)
			res.push(i);
	return res;
}

//jsonFilePath: JSON or str (file)
//mode == 'flat' | 'sparse' | 'sparseMT'
//opts: if sparse or sparseMT, {minBlockSize: int, ...}, where int means num bytes per dense block
//opts: if sparseMT, {minFileSize: int, ...}, where int means num bytes per file
exports.compress = function (jsonFilePath, kbindingsFilePath, mode, opts, outputFileJSON, cb) {
	
	if (!jsonFilePath || !kbindingsFilePath || !outputFileJSON) throw "Missing args";	
	
	var useSparse = mode == 'sparse' || mode == 'sparseMT';
	var useSparseMT = mode == 'sparseMT'; 
	var minBlockSize = (opts && opts.minBlockSize) ? opts.minBlockSize : 2048; //2048 for benchmarks
	var minFileSize = (opts && opts.minFileSize) ? opts.minFileSize : (100 * 1024); //100 * 1024 for benchmarks

	//at each stage, add result to ret
	var ret = {error: 'not initialized', outputFileJSON: outputFileJSON}; 
	
	Seq()
			//get json if provided it as a file
			.seq(function () {
				if (typeof(jsonFilePath) == 'string') {
					chainRead(jsonFilePath, ret, 'treeStr').call(this);
				} else this();
			})
			.seq(function () {
				if (typeof(jsonFilePath) == 'string') {
					try {
			  			ret.treeJSON = JSON.parse(ret.treeStr);
			  		} catch (e) {
			  			console.log('cannot parse, try via JSONP for data');
			  			delete data;
			  			eval(ret.treeStr);
			  			ret.treeJSON = data;
			  			delete data;
			  		}
			  	} else {
			  		ret.treeJSON = jsonFilePath;
			  	}
			  	this();
			})
			.seq(chainRead(kbindingsFilePath, ret, 'kbindingsSrc'))
			.seq(function () {
				var prefix = 'function kbindings () {';
				var suffix = '}';
	
				var localK = null;
				try {
					localK = kbindings;
				} catch (e) {}
	
				eval(prefix + ret.kbindingsSrc + suffix);
				ret.kbindingsFn = kbindings;
	
				if (localK) kbindings = localK; //restore global
				else delete kbindings;
	
				this();
			})
			.seq(function () {
				var flattener = new clr.CLRunner(null, {ignoreCL: true});
				ret.kbindingsFn.apply(flattener, []); //extend clr
	
				flattener.loadData(ret.treeJSON, true);
				
				var bufferLabels = getBuffers(flattener);
				ret.bufferLabels = bufferLabels;
				
				//JSON
				var tCompress = (new Date()).getTime();
				var jsonBuffers = {tree_size: flattener.tree_size, levels: flattener.levels, tokens: flattener.tokens};
				var orig = 0.0; //useSparse
				var after = 0.0; //useSparse
				for (var i = 0; i < bufferLabels.length; i++) {
					var lbl = bufferLabels[i];
					var buff = flattener[lbl];
					if (useSparse) {
						jsonBuffers[lbl] = flattener[useSparseMT ? 'deflateMT' : 'deflate'](buff, minBlockSize, minFileSize);	
									
						var spArr = useSparseMT ? flattener.deflate(buff, minBlockSize) : jsonBuffers[lbl];
						var sum = 0;
						for (var idx in spArr.dense) {
							sum += spArr.dense[idx].length;
						}
						orig += buff.length;
						after += sum;				
						//console.log(buff.length, 'down to', sum, ' => decreased', Math.round(100 - 100 * (sum + 0.0) / buff.length),'%');
					} else {				
						var arr = new Array(buff.length);
						for (var j = 0; j < buff.length; j++) {
						  arr[j] = buff[j];
						}
						jsonBuffers[lbl] = arr;
					}
				}
	
				if (useSparse) console.log(orig, 'down to', after, ' => decreased', Math.round(100 - 100 * (after) / orig),'%');
				var tDoneCompress = (new Date()).getTime();
				console.log('compressed', tDoneCompress - tCompress,'ms');
	
				ret.flatJSON = jsonBuffers;
				this();
			})
			.seq(function () {
				//split each buffer into files and record a summary
				if (useSparseMT) {
					var summary = [];
					ret.summary = summary;
					var outgoing = 0;
					for (var lblIdx = 0; lblIdx < ret.bufferLabels.length; lblIdx++) {
						var lbl = ret.bufferLabels[lblIdx];
						outgoing += ret.flatJSON[lbl].length;
					}
	
	
					ret.buffersInfo = {};
					var done = 0;
					var dataID = 0;				
					for (var lblIdx = 0; lblIdx < ret.bufferLabels.length; lblIdx++){ 
						var lbl = ret.bufferLabels[lblIdx];
						var buffMT = ret.flatJSON[lbl];
						for (var fileIdx = 0; fileIdx < buffMT.length; fileIdx++) {
							dataID++;
							
							var file = buffMT[fileIdx];
							var nfo = {bufferLabel: lbl, fileIdx:  fileIdx, uniqueID: dataID, nFiles: buffMT.length};
	
							file.nfo = nfo;						
							summary.push(nfo);
							
							if (fileIdx == 0) {
								ret.buffersInfo[lbl] = {
									optTypeName: file.optTypeName, 
									len: file.len, 
									startID: dataID,
									numFiles: buffMT.length
								};
							}
											
							var str = JSON.stringify(file);
							var cont = this;
							fs.writeFile(
								outputFileJSON.split(".json")[0] + dataID + ".json", 
								str, 
								function (err) {
									if (err && done != -1) {
										done = -1;
										cont(err);
									}
									if (err) return;
	
									done++;
									if (done == outgoing) 
										cont();
								});
						}
					}			
				} else {
					var t0 = (new Date()).getTime();			
					var treeFlatJSON = "data = " + JSON.stringify(ret.flatJSON) + ";"; //untyped...
					console.log('stringify',(new Date()).getTime() - t0, 'ms');
					console.log('writing', outputFileJSON);
					fs.writeFile(outputFileJSON, treeFlatJSON, this);
				}
			})
			.seq(function(){
				if (useSparseMT) {
					var out = {bufferLabels: ret.bufferLabels, buffersInfo: ret.buffersInfo};
					for (var i in ret.flatJSON) out[i] = ret.flatJSON[i];
					for (var lblIdx in ret.bufferLabels) delete out[ret.bufferLabels[lblIdx]];
					out.summary = ret.summary;
					console.log('writing', outputFileJSON, 'num files: ', 1 + ret.summary.length);
					fs.writeFile(outputFileJSON, "this.data = " + JSON.stringify(out) + ";", this);
				} else this();
			})
			.seq(function () {
				console.log('done compress', outputFileJSON);
				cb(null, ret);
			})
			.catch(function (err) {
				console.log("bad run: ", err);
				cb({error: err});
			});
}


