// Instantiates a new Superconductor visualization
// Paramaters:
//	visualization: the URL to the visualization engine
//	canvas: the DOM element of the canvas object to render the visualization in
function Superconductor(visualization, canvas, cfg, cb) {
	this.init(visualization, canvas, cfg, cb);	
}

//Use initialization method rather than constructor to facilitate monkey-patched backends
Superconductor.prototype.init = function (visualization, canvas, cfg, cb) {

	if (!cfg) cfg = {};
	this.cfg = {
			ignoreGL: cfg.hasOwnProperty('ignoreGL') ? cfg.ignoreGL : false,
        	antialias: cfg.hasOwnProperty("antialias") ? cfg.antialias : true			
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
		return cb(e || 'could not create clrunner');
	}
	
	// A map of objects for the fields in the visualized data that can be used to get/set values
	// This in only defined after loadData() is called.
	this.data = null;

	var sc = this;
	this.loadVisualization(visualization, function (err) {
		(cb || function (err) {if (err) console.error('sc construction err', err); })(err, sc);
	});
}


// Loads JSON non-flat tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadData = function(url, callback) {
	console.debug("Beginning JSON data loading (from URL)...", url);

	var that = this;
	var startTime = new Date().getTime();

    this.downloadJSON(url, function (err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

        try {
    		var jsonTime = new Date().getTime();
    		console.debug('fetch + JSON time', jsonTime - startTime, 'ms');	

    		that.clr.loadData(data);
    		console.debug('flattening + overhead time', (new Date().getTime()) - jsonTime, 'ms');
    		
    		that.data = that.clr.proxyData;
    		console.debug('total time', new Date().getTime() - startTime, 'ms');	

    		return callback(null);
        } catch (e) {
            return callback(e || {msg: 'failed loadData'});
        }
    });
};

// Loads flat JSON tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadDataFlat = function(url, callback) {
	console.debug("Beginning data loading (from URL)...", url);

	var that = this;
	var startTime = new Date().getTime();
	this.downloadJSON(url, function(err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

		console.debug('fetch + flat JSON time', new Date().getTime() - startTime, 'ms');	
		that.clr.loadDataFlat(data);
		that.data = that.clr.proxyData;
		console.debug('total time', new Date().getTime() - startTime, 'ms');	
		return callback(that.data ? null : 'could not find data');
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
    this.downloadJSON(url, function (err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

        try {
            that.clr.loadDataFlatMt(url, data, optNumMaxWorkers, 
            	intoGPU === false ? false : true, 
            	intoCPU === true ? true : false, 
            	function () {
    				that.data = that.clr.proxyData;
    				console.debug("total time", new Date().getTime() - startTime, "ms");
    				callback(that.data ? null : 'could not find data');        
            });
        } catch (e) {
            callback(e || {msg: 'malformed digest'});
        }
    });
};


//Same as loadData except acts on a JSON tree already in memory
//use async interface to allow non-blocking workers in the future
Superconductor.prototype.loadDataObj = function (json, callback) {
	console.debug("Beginning data loading (from in-memory JSON) ...");
	var that = this;
	setTimeout(function () {
		try {
			that.clr.loadData(json);
			that.data = that.clr.proxyData;
			callback(that.data ? null : 'could not find data');
		} catch (e) {
			callback(e);
		}
	}, 0);
};


// Starts up visualization. Should not be called directly; will be called when Superconductor has
// sufficient data to begin.
Superconductor.prototype.startVisualization = function() {
	this.layoutAndRender();
	this.setupInteraction();
};


// Calculates the layout of the data and renders it
// NOTE: potentially non-blocking
Superconductor.prototype.layoutAndRender = function() {
	this.layoutAndRenderAsync(function(){});
};

Superconductor.prototype.layoutAndRenderAsync = function(cb) {

    var sc = this;

    if (!sc.layoutAndRenderAsync_q) {
        sc.layoutAndRenderAsync_q = {
            currentEpoch: [],            
            nextEpoch: [],
            log: []
        };
    }

    if (sc.layoutAndRenderAsync_q.currentEpoch.length) {
        sc.layoutAndRenderAsync_q.nextEpoch.push(cb);
        console.warn('outstanding render, will retry layoutAndRenderAsync later');
        return;
    } else {
        sc.layoutAndRenderAsync_q.currentEpoch.push(cb);
    }

    //layout, call currentEpoch CBs, move next into current, repeat as necessary
    function loop () {

        console.log('layout event');

        var startT = new Date().getTime();  
        sc.clr.layoutAsync(function (err) {
            if (err) {
                console.error('SC internal error', err);
            }
            try {
                if (!err && !sc.cfg.ignoreGL) {
                    var preRenderT = new Date().getTime();
                    sc.clr.glr.renderFrame();
                    console.debug("paint time", (new Date().getTime() - preRenderT), 'ms');
                }
                var durT = (new Date().getTime() - startT);
                console.debug('layoutAndRenderAsync: ', durT, 'ms');
            } catch (e) {
                err = e || 'render error';
            }
            
            var log = sc.layoutAndRenderAsync_q.log;
            if (log.length > 20) log.shift();
            log.push(durT);
            var sum = 0; for (var i = 0; i < log.length; i++) sum += log[i];
            log.sort();
            console.debug('Running average', sum/log.length, 'ms', 
                'median', log[Math.round(log.length / 2)]);
            
            sc.layoutAndRenderAsync_q.currentEpoch.forEach(function (cb) {
                try {
                    cb(err);
                } catch (e) {
                    console.error('layout frame callback error', e);
                }
            });

            sc.layoutAndRenderAsync_q.currentEpoch = sc.layoutAndRenderAsync_q.nextEpoch;
            sc.layoutAndRenderAsync_q.nextEpoch = [];
            if (sc.layoutAndRenderAsync_q.currentEpoch.length) {
                setTimeout(loop, 1);
            }
        });
    }
    loop();

};
 


// Load the remote Javascript file at url and eval it. If the optional argument callback is 
// provided, the request will be fetched asychronously and callback will be called when done.
Superconductor.prototype.loadVisualization = function(url, cb) {
	var that = this;
	cb = cb || function () {};

	this.loadWithAjax(url, function(err, responseText) {
			if (err) return cb(err);
			that.clr.loadLayoutEngine(responseText, cb);
		}, false);
};



// Load remote JSON and pass to callback node-style
// url * (err * json -> ()) -> ()
Superconductor.prototype.downloadJSON = function (url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
        var obj = xhr.response;
        if (typeof(xhr.response) == 'string') {
            try {
                console.warn('warning: client does not support xhr json');
                obj = JSON.parse(xhr.response);
                if (!obj) throw {msg: 'invalid json string', val: xhr.response};
            } catch (e) {
                return cb(e || 'could not parse json');
            }
        }
        cb(xhr.status == 200 ? null : {
            msg: "bad ajax status",
            val: xhr.status
        }, obj);
	};
	xhr.send();
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
			callback({msg: 'bad status', val: httpRequest.status});
			return;
		}

		// If no errors, just call callback normally
		callback(null, httpRequest.responseText);
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