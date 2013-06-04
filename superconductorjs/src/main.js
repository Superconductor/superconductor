// Instantiates a new Superconductor visualization
// Paramaters:
//	visualization: the URL to the visualization engine
//	canvas: the DOM element of the canvas object to render the visualization in
function Superconductor(visualization, canvas, cfg) {

	if (!cfg) cfg = {};
	this.cfg = {
			ignoreCL: cfg.hasOwnProperty('ignoreCL') ? cfg.ignoreCL : false,
			webworkerLayout: cfg.hasOwnProperty('webworkerLayout') ? cfg.webworkerLayout : false,
			numWorkers : cfg.hasOwnProperty('numWorkers') ? cfg.numWorkers : 4
		};
	for (i in cfg) this.cfg[i] = cfg[i];


	this.glr = new GLRunner(canvas, this.cfg); 
 	try {
		this.clr = new CLRunner(this.glr, this.cfg);
 	} catch(e) {		// Print out a slightly nicer error message than if the exception was total uncaught
		console.error('[Superconductor]', 'Error initializing WebCL');
		if(e.line && e.sourceURL) {
			console.error('[Superconductor]', 'At location ' + e.sourceURL + ':' + e.line);
		}
		console.error('[Superconductor] Exception:', e);
		
		throw e;
	}
	
	this.loadVisualization(visualization);

	// A map of objects for the fields in the visualized data that can be used to get/set values
	// This in only defined after loadData() is called.
	this.data = null;
}


// Returns a bool indicating whether Superconductor is a state where it is able to start the
// visualization. This is false when, for example, data hasn't been loaded into the visualization.
Superconductor.prototype.readyToStart = function() {
	return (this.glr.readyToRender() && this.clr.readyToLayout());
};


// Loads JSON non-flat tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadData = function(url, callback) {
	console.debug("Beginning JSON data loading (from URL)...", url);

	var that = this;
	var startTime = new Date().getTime();
	
	this.loadWithAjax(url, function(responseText) {

			function flatten (data) {
				window.data = data;
				
				var jsonTime = new Date().getTime();
				console.log('fetch + JSON time', jsonTime - startTime, 'ms');	
		
				that.clr.loadData(window.data);
				console.log('flattening + overhead time', (new Date().getTime()) - jsonTime, 'ms');
				
				that.data = that.clr.proxyData;
				console.log('total time', new Date().getTime() - startTime, 'ms');	
		
				callback(data);

			}

			if(responseText === null) {
				console.error('Empty response');
				return;
			}

			var obj;
			try {
				obj = JSON.parse(responseText);
			} catch (e) {
				console.error('JSON parse err (trying eval instead):', e);				
				try {
					eval.call(that.clr, responseText);
					obj = data;
				} catch (e) {
					console.error('eval failed', e);
					throw e;
				}
			}
			flatten(obj);
		}, true);
};

// Loads flat JSON tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadDataFlat = function(url, callback) {
	console.debug("Beginning data loading (from URL)...", url);

	var that = this;
	var startTime = new Date().getTime();
	that.loadScript(url, function(){
		console.log('fetch + flat JSON time', new Date().getTime() - startTime, 'ms');	
		that.clr.loadDataFlat(window.data);
		that.data = that.clr.proxyData;
		console.log('total time', new Date().getTime() - startTime, 'ms');	
		callback();
	});
};

//if optNumMaxWorkers not provided, will try for sc.optNumMaxWorkers, else use a default
Superconductor.prototype.loadDataFlatMt = function(url, callback, optNumMaxWorkers) {
    if (!optNumMaxWorkers) optNumMaxWorkers = this.optNumMaxWorkers;
	var intoGPU = !this.cfg.ignoreCL;
	var intoCPU = this.cfg.ignoreCL;    
	console.debug("Beginning data loading (from URL)...", url);
    var that = this;
    var startTime = new Date().getTime();
    that.loadScript(url, function() {
        that.clr.loadDataFlatMt(url, window.data, optNumMaxWorkers, 
        	intoGPU === false ? false : true, 
        	intoCPU === true ? true : false, 
        	function () {
				that.data = that.clr.proxyData;
				console.log("total time", new Date().getTime() - startTime, "ms");
				callback();        
        });
    });
};


//Same as loadData except acts on a JSON tree already in memory
//use async interface to allow non-blocking workers in the future
Superconductor.prototype.loadDataObj = function (json, callback) {
	console.debug("Beginning data loading (from in-memory JSON) ...", json);
	var that = this;
	setTimeout(function () {
		that.clr.loadData(json);
		that.data = that.clr.proxyData;
		callback();
	}, 0);
};


// Starts up visualization. Should not be called directly; will be called when Superconductor has
// sufficient data to begin.
Superconductor.prototype.startVisualization = function() {
	if(!this.readyToStart()) {
		console.debug("Superconductor asked to start visualization, but it is not in a state where it can do so");
		return;
	}

	this.layoutAndRender();

	this.setupInteraction();
};


// Calculates the layout of the data and renders it
Superconductor.prototype.layoutAndRender = function() {
	if (this.cfg.ignoreCL) {
        this.glr.resetCanvas();
		this.clr._gen_runTraversals();
		this.clr.runRenderTraversal();
	} else {
		var startT = new Date().getTime();
		this.clr.layout();
		var startRenderT = new Date().getTime();
		console.log("Layout", startRenderT - startT, 'ms');
		this.glr.renderFrame();
		var endT = new Date().getTime();;
		console.log("Render", endT - startRenderT, 'ms');
		console.log("TOTAL", endT - startT, 'ms');	
	}

};

// Calculates the layout of the data and renders it
Superconductor.prototype.outstandingRender = false;
Superconductor.prototype.layoutAndRenderAsync = function(cb) {

	var sc = this;
    if (this.outstandingRender) 
    	return setTimeout(function (cb) { sc.layoutAndRenderAsync(cb); }, 10, cb);

	this.outstandingRender = true;
	function finish () { sc.outstandingRender = false; cb(); }


	if (this.cfg.ignoreCL) {
        this.glr.resetCanvas();
        var clr = this.clr;
		this.clr._gen_runTraversalsAsync(function () {
			clr.runRenderTraversalAsync(finish);
		});		
	} else {
		var startT = new Date().getTime();
		this.clr.layoutAsync(function () {
			var startRenderT = new Date().getTime();
			console.log("Layout", startRenderT - startT, 'ms');
			this.glr.renderFrame(); //FIXME make async
			var endT = new Date().getTime();;
			console.log("Render", endT - startRenderT, 'ms');
			console.log("TOTAL", endT - startT, 'ms');
			finish();			
		});
	}

};
 


// Load the remote Javascript file at url and eval it. If the optional argument callback is 
// provided, the request will be fetched asychronously and callback will be called when done.
Superconductor.prototype.loadVisualization = function(url) {
	var that = this;

	this.loadWithAjax(url, function(responseText) {
			if(responseText === null) {
				return;
			}

			that.clr.loadLayoutEngine(responseText);
		}, false);
};


// Load the remote Javascript file at url and eval it. If the optional argument callback is 
// provided, the request will be fetched asychronously and callback will be called when done.
Superconductor.prototype.loadScript = function(url, callback) {
	var async = (typeof(callback) === 'function') ? true : false;
	this.loadWithAjax(url, function(responseText) {
			if(responseText === null) {
				return;
			}

			eval.call(this.clr, responseText);

			if(typeof(callback) === 'function') {
				callback();
			}
		}, async);
};


// A simple wrapper for doing AJAX calls. Loads the resource at url and then calls callback, which 
// should be a function of the form `function(responseText)`. If there is an error fetching the
// resource, responseText will be null. If the optional argument asyc is true, fetch the data 
// asynchronously.
Superconductor.prototype.loadWithAjax = function(url, callback, async) {
	var httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = function() {
		if(httpRequest.readyState != 4) {
			return;
		}

		// An error was encountered with the request, so call the callback with responseText = null
		if(httpRequest.status != 200) {
			callback(null);
			return;
		}

		// If no errors, just call callback normally
		callback(httpRequest.responseText);
	};

	if(typeof(async) !== 'undefined' && async) {
		httpRequest.open('GET', url, true);
	} else {
		httpRequest.open('GET', url, false);
	}
	
	httpRequest.send(null);
};


Superconductor.prototype.setupInteraction = function() {
	var glr = this.glr;

	var scroll_amount = 0.1;

	document.onkeydown = function(e) {
		var event = window.event || e;

		if(event.keyCode == 187) {					// '=' key
			glr.movePosition(0, 0, scroll_amount);
		} else if(event.keyCode == 189) {			// '-' key
			glr.movePosition(0, 0, -scroll_amount);
		} else if(event.keyCode == 37) {			// left-arrow key
			glr.movePosition(- scroll_amount, 0, 0);
		} else if(event.keyCode == 39) {			// right-arrow key
			glr.movePosition(scroll_amount, 0, 0);
		} else if(event.keyCode == 38) {			// up-arrow key
			glr.movePosition(0, scroll_amount, 0);
		} else if(event.keyCode == 40) {			// down-arrow key
			glr.movePosition(0, -scroll_amount, 0);
		} else if(event.keyCode == 80) {			// 'p' key
			console.debug("Current position: ");
			console.debug(glr.position);
		}


		glr.renderFrame();
	};
};