// Instantiates a new Superconductor visualization
// Paramaters:
//	visualization: the URL to the visualization engine
//	canvas: the DOM element of the canvas object to render the visualization in
function Superconductor(visualization, canvas, cfg, cb) {
	this.init.apply(this, arguments);
}

//Use initialization method rather than constructor to facilitate monkey-patched backends
Superconductor.prototype.init = function (visualization, canvas, cfg, callback) {
    var sc = this;

    callback = callback || function(err, _sc) {
        if(err) {
            _sc.console.error('sc construction err', err);
        }
    };

    Superconductor.prototype.setupConsole.call(this);
    this.makeEvented(this);

    // Merge user-supplied config flags with our defaults (to fill in any missing flags)
    this.cfg = Superconductor.utils.extend({
        ignoreGL: false,
        antialias: true,
        camera: (cfg||{}).camera ? cfg.camera : new Superconductor.Cameras.Camera3d()
    }, cfg);

    this.camera = this.cfg.camera;
	this.glr = new GLRunner(canvas, this.camera, this.cfg);
    this.makeEvented(this.glr);

 	try {
		sc.clr = new CLRunner(sc.glr, sc.cfg);
        sc.makeEvented(sc.clr)
 	} catch(e) {		// Print out a slightly nicer error message than if the exception was total uncaught
		sc.console.error('[Superconductor]', 'Error initializing WebCL', e);
		return callback(e || 'could not create clrunner');
	}

	// A map of objects for the fields in the visualized data that can be used to get/set values
	// This in only defined after loadData() is called.
	sc.data = null;

	this.loadVisualization(visualization, function(err) {
        callback(err, sc)
	});
};


Superconductor.prototype.setupConsole = function () {
    var that = this;
    that.console = {};
    ['debug', 'error', 'log', 'warn'].forEach(function (lbl) {
        that.console[lbl] = function () {
            if (that.cfg[lbl]) {
                console[lbl].apply(console, Array.prototype.slice.call(arguments, 0));
            }
        };
    });
}


// Loads JSON non-flat tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadData = function(url, callback) {

	var sc = this;
	var startTime = new Date().getTime();

    sc.console.debug("Beginning JSON data loading (from URL)...", url);

    sc.downloadJSON(url, function (err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

        try {
    		var jsonTime = new Date().getTime();
    		sc.console.debug('fetch + JSON time', jsonTime - startTime, 'ms');

    		sc.clr.loadData(data);
    		sc.console.debug('flattening + overhead time', (new Date().getTime()) - jsonTime, 'ms');

    		sc.data = sc.clr.proxyData;
    		sc.console.debug('total time', new Date().getTime() - startTime, 'ms');

    		return callback(null);
        } catch (e) {
            return callback(e || {msg: 'failed loadData'});
        }
    });
};

// Loads flat JSON tree data from the remote url and loads it into the visualization,
// calling callback when finished. The visualization is able to be started at this point.
Superconductor.prototype.loadDataFlat = function(url, callback) {
	sc.console.debug("Beginning data loading (from URL)...", url);
	var sc = this;
	var startTime = new Date().getTime();
	sc.downloadJSON(url, function(err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

		sc.console.debug('fetch + flat JSON time', new Date().getTime() - startTime, 'ms');
		sc.clr.loadDataFlat(data);
		sc.data = sc.clr.proxyData;
		sc.console.debug('total time', new Date().getTime() - startTime, 'ms');
		return callback(sc.data ? null : 'could not find data');
	});
};

//if optNumMaxWorkers not provided, will try for sc.optNumMaxWorkers, else use a default
Superconductor.prototype.loadDataFlatMt = function(url, callback, optNumMaxWorkers) {
    if (!optNumMaxWorkers) optNumMaxWorkers = this.optNumMaxWorkers;
	var intoGPU = !this.cfg.ignoreCL;
	var intoCPU = this.cfg.ignoreCL;
    var sc = this;
	sc.console.debug("Beginning data loading (from URL)...", url);
    var sc = this;
    var startTime = new Date().getTime();
    sc.downloadJSON(url, function (err, data) {
        if (err) return callback(err);
        if (!data) return callback({msg: 'no data'});

        try {
            sc.clr.loadDataFlatMt(url, data, optNumMaxWorkers,
            	intoGPU === false ? false : true,
            	intoCPU === true ? true : false,
            	function () {
    				sc.data = sc.clr.proxyData;
    				sc.console.debug("total time", new Date().getTime() - startTime, "ms");
    				callback(sc.data ? null : 'could not find data');
            });
        } catch (e) {
            callback(e || {msg: 'malformed digest'});
        }
    });
};


//Same as loadData except acts on a JSON tree already in memory
//use async interface to allow non-blocking workers in the future
//JSON * ( err * sc -> () ) -> ()
Superconductor.prototype.loadDataObj = function (json, callback) {
    var sc = this;
	sc.console.debug("Beginning data loading (from in-memory JSON) ...");

	setTimeout(function () {
		try {
			sc.clr.loadData(json);
			sc.data = sc.clr.proxyData;
			callback(sc.data ? null : 'could not find data');
		} catch (e) {
			callback(e, sc);
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
        sc.console.warn('outstanding render, will retry layoutAndRenderAsync later');
        return;
    } else {
        sc.layoutAndRenderAsync_q.currentEpoch.push(cb);
    }

    //layout, call currentEpoch CBs, move next into current, repeat as necessary
    function loop () {

        sc.console.log('layout event');

        var startT = new Date().getTime();
        sc.clr.layoutAsync(function (err) {
            if (err) {
                sc.console.error('SC internal error', err);
            }
            try {
                if (!err && !sc.cfg.ignoreGL) {
                    var preRenderT = new Date().getTime();
                    sc.clr.glr.renderFrame();
                    sc.console.debug("paint time", (new Date().getTime() - preRenderT), 'ms');
                }
                var durT = (new Date().getTime() - startT);
                sc.console.debug('layoutAndRenderAsync: ', durT, 'ms');
            } catch (e) {
                err = e || 'render error';
            }

            var log = sc.layoutAndRenderAsync_q.log;
            if (log.length > 20) log.shift();
            log.push(durT);
            var sum = 0; for (var i = 0; i < log.length; i++) sum += log[i];
            log.sort();
            sc.console.debug('Running average', sum/log.length, 'ms',
                'median', log[Math.round(log.length / 2)]);

            sc.layoutAndRenderAsync_q.currentEpoch.forEach(function (cb) {
                try {
                    cb(err);
                } catch (e) {
                    sc.console.error('layout frame callback error', e);
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
Superconductor.prototype.loadVisualization = function(url, callback) {
	var sc = this;

	sc.loadWithAjax(url, function(err, responseText) {
			if (err) {
                return callback(err);
            }

			sc.clr.loadLayoutEngine(responseText, callback);
		}, false);
};



// Load remote JSON and pass to callback node-style
// url * (err * json -> ()) -> ()
Superconductor.prototype.downloadJSON = function (url, cb) {
    var sc = this;
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
        var obj = xhr.response;
        if (typeof(xhr.response) == 'string') {
            try {
                sc.console.warn('warning: client does not support xhr json');
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
	var scroll_amount = 0.1;

    var scr = this;
	document.onkeydown = function(e) {
		var event = window.event || e;

        // FIXME: This doesn't work if we're using a Camera2d instead of Camera3d
		if(event.keyCode == 187) {					// '=' key
            scr.camera.position.z += scroll_amount;
		} else if(event.keyCode == 189) {			// '-' key
            scr.camera.position.z -= scroll_amount;
		} else if(event.keyCode == 37) {			// left-arrow key
            scr.camera.position.x -= scroll_amount;
		} else if(event.keyCode == 39) {			// right-arrow key
            scr.camera.position.x += scroll_amount;
		} else if(event.keyCode == 38) {			// up-arrow key
            scr.camera.position.y += scroll_amount;
		} else if(event.keyCode == 40) {			// down-arrow key
            scr.camera.position.y -= scroll_amount;
		} else if(event.keyCode == 80) {			// 'p' key
			sc.console.debug("Current position:", scr.camera.position);
		}

		scr.glr.renderFrame();
	};
};

if (typeof(module) != 'undefined') {
    module.exports = Superconductor;
}
