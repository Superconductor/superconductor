CLRunner.prototype.init = (function () {
    var initOld = CLRunner.prototype.init;

    //////////

    var CreateContext = function (webcl, gl, platform, devices) {
        if (typeof webcl.enableExtension == "function") { 
            webcl.enableExtension("KHR_GL_SHARING");
            return webcl.createContext(gl, devices);
        } else {
            console.debug("[cl.js] Detected old WebCL platform.");
            var extension = webcl.getExtension("KHR_GL_SHARING");
            if (extension === null) {
                throw new Error("Could not create a shared CL/GL context using the WebCL extension system");
            }
            return extension.createContext({
                platform: platform,
                devices: devices,
                deviceType: cl.DEVICE_TYPE_GPU,
                sharedContext: null
            });
        }
    }

    var CreateCL = function (webcl, glr) { // -> {devices, context, queue}

        if (typeof(webcl) === "undefined") {
            throw new Error("WebCL does not appear to be supported in your browser");
        } else if (webcl === null) {
            throw new Error("Can't access WebCL object");
        }

        var platforms = webcl.getPlatforms();
        if (platforms.length === 0) {
            throw new Error("Can't find any WebCL platforms");
        }
        var platform = platforms[0];

        //sort by number of compute units and use first non-failing device
        var devices = platform.getDevices(webcl.DEVICE_TYPE_ALL).map(function (d) {
            var workItems = d.getInfo(webcl.DEVICE_MAX_WORK_ITEM_SIZES);
            return {
                device: d,
                computeUnits: workItems.reduce(function (a, b) { return a * b})
            };
        });
        devices.sort(function (a, b) { return b.computeUnits - a.computeUnits; });

        var deviceWrapper;
        var err = devices.length ? 
            null : new Error("No WebCL devices of specified type (" + webcl.DEVICE_TYPE_GPU + ") found");
        for (var i = 0; i < devices.length; i++) {          
            var wrapped = devices[i];
            try {
                wrapped.context = CreateContext(webcl, glr.gl, platform, [wrapped.device]);
                if (wrapped.context === null) {
                    throw Error("Error creating WebCL context");
                }
                wrapped.queue = wrapped.context.createCommandQueue(wrapped.device, null);
            } catch (e) {
                console.debug("Skipping device due to error", i, wrapped, e);
                err = e;
                continue;
            }           
            deviceWrapper = wrapped;
            break;
        }
        if (!deviceWrapper) {
            throw err;
        }

        console.debug("Device", deviceWrapper);
        
        return {
            devices: [deviceWrapper.device],
            context: deviceWrapper.context,
            queue: deviceWrapper.queue
        }
    }

    //////////////

    var initNew = function (glr, cfg) {
        
        if (!cfg) cfg = {};
        cfg.ignoreCL = cfg.hasOwnProperty('ignoreCL') ? cfg.ignoreCL : false;
        initOld.call(this, glr, cfg);

        if (cfg.ignoreCL) return;

        this.cl = webcl;
        var clObj = new CreateCL(webcl, glr);
        var self = this;
        ['devices', 'context', 'queue'].forEach(function (lbl) {
            self[lbl] = clObj[lbl];
        });
        this.clVBO = null;
    };
    return initNew;
}());


CLRunner.prototype.runRenderTraversalAsync = (function () {
    var original = CLRunner.prototype.runRenderTraversalAsync;

    var patch = function (cb) {
        if (this.cfg.ignoreCL) return original.call(this, cb);
        
        try {
            var clr = this;
            var glVBO = clr.glr.reallocateVBO(this.getRenderBufferSize());               
            clr.setVBO(glVBO);

            var lastVisitNum = 0;
            var pfx = "_gen_run_visit_";
            for (;this[pfx + (lastVisitNum + 1)]; lastVisitNum++) ;
            var renderTraversal = pfx + lastVisitNum;
            var fnPair = this[renderTraversal];
            var travFn = fnPair[0];
            var visitFn = clr[fnPair[1]];

            this.queue.enqueueAcquireGLObjects([this.clVBO]);

            var preT = new Date().getTime();
            fnPair.call(clr, clr.clVBO);
            clr.queue.enqueueReleaseGLObjects([clr.clVBO]);
            clr.queue.finish();
            var startT = new Date().getTime();
            console.debug("render pass", startT - preT, "ms");

            return cb();            

        } catch (e) {
            return cb({msg: 'pre render err', v: e})
        }
    };

    return patch;
}());


//////


CLRunner.prototype.buildKernels = function(cb) {
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
        return cb(new SCException("Could not build kernels"))
    }
    try {
        this._gen_getKernels(cb); //FIXME why cb here and at end?
    } catch (e) {
        console.error('could not gen_getKernels', e);
        return cb(e);
    }
    return cb(); //FIXME why cb also at gen_getKernels?
};


CLRunner.prototype.loadLayoutEngine = (function () {
    var old = CLRunner.prototype.loadLayoutEngine;

    var patch = function (engineSource, cb) {
        var clr = this;
        old.call(clr, engineSource, function (err, data) {
            if (err) return cb(err);
            if (!clr.cfg.ignoreCL) {
                clr.buildKernels(cb);
            } else {
                return cb(null, data);
            }
        });
    };
    return patch;
}());



CLRunner.prototype.runTraversalsAsync = (function () {
    var old = CLRunner.prototype.runTraversalsAsync;

    var patch = function (cb) {
        var clr = this;
        if (clr.cfg.ignoreCL) return old.call(clr, cb);

        var visits = [];
        var pfx = "_gen_run_visit_";
        for (var i = 0; clr[pfx + (i + 1)]; i++) {
            visits.push(pfx + i);
        }

        return (function loop (step) {        
            if (step == visits.length) { 
                return cb.call(clr);
            } else {
                var fnName = visits[step];
                clr[fnName].call(clr);
                return loop(step + 1);
            }
        }(0));

    };
    return patch;
}());

//////

CLRunner.prototype.__vboPool = [];
CLRunner.prototype.allocVbo = function (size, optBase) {
    if (this.__vboPool.length > 0) {
        var el = this.__vboPool.pop();
        if (el.buffer.byteLength >= 4 * size) {
            var view = (new Float32Array(el.buffer)).subarray(0, size);
            if (optBase) view.set(optBase);
            return view;
        }
    }
    console.debug('allocing vbo copy', size);
    return optBase ? new Float32Array(optBase) : new Float32Array(size);
};
CLRunner.prototype.freeVbo = function (vbo) {
    this.__vboPool.push(vbo);
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


/*

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
    
    console.debug("Selector compile time:", new Date().getTime() - startT, 'ms');
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
        console.debug("applied", count, "instances of CSS properties");
    } catch (e) {
        console.error("Error checking run of WebCL selectors: " + e.message);
        //console.error("Inputs:", {fullSource: kernelSrc, selSource: src });
        console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
        console.error("Build log: ", this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
        throw {error: e};
    }
    
    var endT = new Date().getTime();
    console.debug("Selector create instance time:", runStartT - startT, "ms, Selector compute time", endT - runStartT, 'ms');    
};

CLRunner.prototype.setAndRunSelectors = function (selectors) {
    if (this.cfg.ignoreCL) throw new SCException('Function only for CL-enabled use');
    var startT = new Date().getTime();
    this.setSelectors(selectors);
    this.runSelectors();
    console.debug("Total selectors time", new Date().getTime() - startT, 'ms');
};


*/