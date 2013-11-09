function SCException(message, data) {
    this.message = message;
    this.data = data || null;
    this.toString = function() {
        var errString = this.message;
        if (this.data) {
            errString += " (additional data: " + this.data + ")";
        }
        return errString;
    };
}

function Superconductor(visualization, canvas, cfg) {
    if (!cfg) cfg = {};
    this.cfg = {
        ignoreCL: cfg.hasOwnProperty("ignoreCL") ? cfg.ignoreCL : false,
        webworkerLayout: cfg.hasOwnProperty("webworkerLayout") ? cfg.webworkerLayout : false,
        numWorkers: cfg.hasOwnProperty("numWorkers") ? cfg.numWorkers : 4
    };
    for (i in cfg) this.cfg[i] = cfg[i];
    this.glr = new GLRunner(canvas, this.cfg);
    try {
        this.clr = new CLRunner(this.glr, this.cfg);
    } catch (e) {
        console.error("[Superconductor]", "Error initializing WebCL");
        if (e.line && e.sourceURL) {
            console.error("[Superconductor]", "At location " + e.sourceURL + ":" + e.line);
        }
        console.error("[Superconductor] Exception:", e);
        throw e;
    }
    this.loadVisualization(visualization);
    this.data = null;
}

Superconductor.prototype.readyToStart = function() {
    return this.glr.readyToRender() && this.clr.readyToLayout();
};

Superconductor.prototype.loadData = function(url, callback) {
    console.debug("Beginning JSON data loading (from URL)...", url);
    var that = this;
    var startTime = new Date().getTime();
    this.loadWithAjax(url, function(responseText) {
        function flatten(data) {
            window.data = data;
            var jsonTime = new Date().getTime();
            console.log("fetch + JSON time", jsonTime - startTime, "ms");
            that.clr.loadData(window.data);
            console.log("flattening + overhead time", new Date().getTime() - jsonTime, "ms");
            that.data = that.clr.proxyData;
            console.log("total time", new Date().getTime() - startTime, "ms");
            callback(data);
        }
        if (responseText === null) {
            console.error("Empty response");
            return;
        }
        var obj;
        try {
            obj = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON parse err (trying eval instead):", e);
            try {
                eval.call(that.clr, responseText);
                obj = data;
            } catch (e) {
                console.error("eval failed", e);
                throw e;
            }
        }
        flatten(obj);
    }, true);
};

Superconductor.prototype.loadDataFlat = function(url, callback) {
    console.debug("Beginning data loading (from URL)...", url);
    var that = this;
    var startTime = new Date().getTime();
    that.loadScript(url, function() {
        console.log("fetch + flat JSON time", new Date().getTime() - startTime, "ms");
        that.clr.loadDataFlat(window.data);
        that.data = that.clr.proxyData;
        console.log("total time", new Date().getTime() - startTime, "ms");
        callback();
    });
};

Superconductor.prototype.loadDataFlatMt = function(url, callback, optNumMaxWorkers) {
    if (!optNumMaxWorkers) optNumMaxWorkers = this.optNumMaxWorkers;
    var intoGPU = !this.cfg.ignoreCL;
    var intoCPU = this.cfg.ignoreCL;
    console.debug("Beginning data loading (from URL)...", url);
    var that = this;
    var startTime = new Date().getTime();
    that.loadScript(url, function() {
        that.clr.loadDataFlatMt(url, window.data, optNumMaxWorkers, intoGPU === false ? false : true, intoCPU === true ? true : false, function() {
            that.data = that.clr.proxyData;
            console.log("total time", new Date().getTime() - startTime, "ms");
            callback();
        });
    });
};

Superconductor.prototype.loadDataObj = function(json, callback) {
    console.debug("Beginning data loading (from in-memory JSON) ...", json);
    var that = this;
    setTimeout(function() {
        that.clr.loadData(json);
        that.data = that.clr.proxyData;
        callback();
    }, 0);
};

Superconductor.prototype.startVisualization = function() {
    if (!this.readyToStart()) {
        console.debug("Superconductor asked to start visualization, but it is not in a state where it can do so");
        return;
    }
    this.layoutAndRender();
    this.setupInteraction();
};

Superconductor.prototype.layoutAndRender = function() {
    if (this.cfg.ignoreCL) {
        this.glr.resetCanvas();
        this.clr._gen_runTraversals();
        this.clr.runRenderTraversal();
    } else {
        var startT = new Date().getTime();
        this.clr.layout();
        var startRenderT = new Date().getTime();
        console.log("Layout", startRenderT - startT, "ms");
        this.glr.renderFrame();
        var endT = new Date().getTime();
        console.log("Render", endT - startRenderT, "ms");
        console.log("TOTAL", endT - startT, "ms");
    }
};

Superconductor.prototype.outstandingRender = false;

Superconductor.prototype.layoutAndRenderAsync = function(cb) {
    var sc = this;
    if (this.outstandingRender) return setTimeout(function(cb) {
        sc.layoutAndRenderAsync(cb);
    }, 10, cb);
    this.outstandingRender = true;
    function finish() {
        sc.outstandingRender = false;
        cb();
    }
    if (this.cfg.ignoreCL) {
        this.glr.resetCanvas();
        var clr = this.clr;
        this.clr._gen_runTraversalsAsync(function() {
            clr.runRenderTraversalAsync(finish);
        });
    } else {
        var startT = new Date().getTime();
        this.clr.layoutAsync(function() {
            var startRenderT = new Date().getTime();
            console.log("Layout", startRenderT - startT, "ms");
            this.glr.renderFrame();
            var endT = new Date().getTime();
            console.log("Render", endT - startRenderT, "ms");
            console.log("TOTAL", endT - startT, "ms");
            finish();
        });
    }
};

Superconductor.prototype.loadVisualization = function(url) {
    var that = this;
    this.loadWithAjax(url, function(responseText) {
        if (responseText === null) {
            return;
        }
        that.clr.loadLayoutEngine(responseText);
    }, false);
};

Superconductor.prototype.loadScript = function(url, callback) {
    var async = typeof callback === "function" ? true : false;
    this.loadWithAjax(url, function(responseText) {
        if (responseText === null) {
            return;
        }
        eval.call(this.clr, responseText);
        if (typeof callback === "function") {
            callback();
        }
    }, async);
};

Superconductor.prototype.loadWithAjax = function(url, callback, async) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState != 4) {
            return;
        }
        if (httpRequest.status != 200) {
            callback(null);
            return;
        }
        callback(httpRequest.responseText);
    };
    if (typeof async !== "undefined" && async) {
        httpRequest.open("GET", url, true);
    } else {
        httpRequest.open("GET", url, false);
    }
    httpRequest.send(null);
};

Superconductor.prototype.setupInteraction = function() {
    var glr = this.glr;
    var scroll_amount = .1;
    document.onkeydown = function(e) {
        var event = window.event || e;
        if (event.keyCode == 187) {
            glr.movePosition(0, 0, scroll_amount);
        } else if (event.keyCode == 189) {
            glr.movePosition(0, 0, -scroll_amount);
        } else if (event.keyCode == 37) {
            glr.movePosition(-scroll_amount, 0, 0);
        } else if (event.keyCode == 39) {
            glr.movePosition(scroll_amount, 0, 0);
        } else if (event.keyCode == 38) {
            glr.movePosition(0, scroll_amount, 0);
        } else if (event.keyCode == 40) {
            glr.movePosition(0, -scroll_amount, 0);
        } else if (event.keyCode == 80) {
            console.debug("Current position: ");
            console.debug(glr.position);
        }
        glr.renderFrame();
    };
};

J3DIHasCSSMatrix = false;

J3DIHasCSSMatrixCopy = false;

J3DIMatrix4 = function(m) {
    if (J3DIHasCSSMatrix) this.$matrix = new WebKitCSSMatrix(); else this.$matrix = new Object();
    if (typeof m == "object") {
        if ("length" in m && m.length >= 16) {
            this.load(m);
            return;
        } else if (m instanceof J3DIMatrix4) {
            this.load(m);
            return;
        }
    }
    this.makeIdentity();
};

J3DIMatrix4.prototype.load = function() {
    if (arguments.length == 1 && typeof arguments[0] == "object") {
        var matrix;
        if (arguments[0] instanceof J3DIMatrix4) {
            matrix = arguments[0].$matrix;
            this.$matrix.m11 = matrix.m11;
            this.$matrix.m12 = matrix.m12;
            this.$matrix.m13 = matrix.m13;
            this.$matrix.m14 = matrix.m14;
            this.$matrix.m21 = matrix.m21;
            this.$matrix.m22 = matrix.m22;
            this.$matrix.m23 = matrix.m23;
            this.$matrix.m24 = matrix.m24;
            this.$matrix.m31 = matrix.m31;
            this.$matrix.m32 = matrix.m32;
            this.$matrix.m33 = matrix.m33;
            this.$matrix.m34 = matrix.m34;
            this.$matrix.m41 = matrix.m41;
            this.$matrix.m42 = matrix.m42;
            this.$matrix.m43 = matrix.m43;
            this.$matrix.m44 = matrix.m44;
            return;
        } else matrix = arguments[0];
        if ("length" in matrix && matrix.length >= 16) {
            this.$matrix.m11 = matrix[0];
            this.$matrix.m12 = matrix[1];
            this.$matrix.m13 = matrix[2];
            this.$matrix.m14 = matrix[3];
            this.$matrix.m21 = matrix[4];
            this.$matrix.m22 = matrix[5];
            this.$matrix.m23 = matrix[6];
            this.$matrix.m24 = matrix[7];
            this.$matrix.m31 = matrix[8];
            this.$matrix.m32 = matrix[9];
            this.$matrix.m33 = matrix[10];
            this.$matrix.m34 = matrix[11];
            this.$matrix.m41 = matrix[12];
            this.$matrix.m42 = matrix[13];
            this.$matrix.m43 = matrix[14];
            this.$matrix.m44 = matrix[15];
            return;
        }
    }
    this.makeIdentity();
};

J3DIMatrix4.prototype.getAsArray = function() {
    return [ this.$matrix.m11, this.$matrix.m12, this.$matrix.m13, this.$matrix.m14, this.$matrix.m21, this.$matrix.m22, this.$matrix.m23, this.$matrix.m24, this.$matrix.m31, this.$matrix.m32, this.$matrix.m33, this.$matrix.m34, this.$matrix.m41, this.$matrix.m42, this.$matrix.m43, this.$matrix.m44 ];
};

J3DIMatrix4.prototype.getAsFloat32Array = function() {
    if (J3DIHasCSSMatrixCopy) {
        var array = new Float32Array(16);
        this.$matrix.copy(array);
        return array;
    }
    return new Float32Array(this.getAsArray());
};

J3DIMatrix4.prototype.setUniform = function(ctx, loc, transpose) {
    if (J3DIMatrix4.setUniformArray == undefined) {
        J3DIMatrix4.setUniformWebGLArray = new Float32Array(16);
        J3DIMatrix4.setUniformArray = new Array(16);
    }
    if (J3DIHasCSSMatrixCopy) this.$matrix.copy(J3DIMatrix4.setUniformWebGLArray); else {
        J3DIMatrix4.setUniformArray[0] = this.$matrix.m11;
        J3DIMatrix4.setUniformArray[1] = this.$matrix.m12;
        J3DIMatrix4.setUniformArray[2] = this.$matrix.m13;
        J3DIMatrix4.setUniformArray[3] = this.$matrix.m14;
        J3DIMatrix4.setUniformArray[4] = this.$matrix.m21;
        J3DIMatrix4.setUniformArray[5] = this.$matrix.m22;
        J3DIMatrix4.setUniformArray[6] = this.$matrix.m23;
        J3DIMatrix4.setUniformArray[7] = this.$matrix.m24;
        J3DIMatrix4.setUniformArray[8] = this.$matrix.m31;
        J3DIMatrix4.setUniformArray[9] = this.$matrix.m32;
        J3DIMatrix4.setUniformArray[10] = this.$matrix.m33;
        J3DIMatrix4.setUniformArray[11] = this.$matrix.m34;
        J3DIMatrix4.setUniformArray[12] = this.$matrix.m41;
        J3DIMatrix4.setUniformArray[13] = this.$matrix.m42;
        J3DIMatrix4.setUniformArray[14] = this.$matrix.m43;
        J3DIMatrix4.setUniformArray[15] = this.$matrix.m44;
        J3DIMatrix4.setUniformWebGLArray.set(J3DIMatrix4.setUniformArray);
    }
    ctx.uniformMatrix4fv(loc, transpose, J3DIMatrix4.setUniformWebGLArray);
};

J3DIMatrix4.prototype.makeIdentity = function() {
    this.$matrix.m11 = 1;
    this.$matrix.m12 = 0;
    this.$matrix.m13 = 0;
    this.$matrix.m14 = 0;
    this.$matrix.m21 = 0;
    this.$matrix.m22 = 1;
    this.$matrix.m23 = 0;
    this.$matrix.m24 = 0;
    this.$matrix.m31 = 0;
    this.$matrix.m32 = 0;
    this.$matrix.m33 = 1;
    this.$matrix.m34 = 0;
    this.$matrix.m41 = 0;
    this.$matrix.m42 = 0;
    this.$matrix.m43 = 0;
    this.$matrix.m44 = 1;
};

J3DIMatrix4.prototype.transpose = function() {
    var tmp = this.$matrix.m12;
    this.$matrix.m12 = this.$matrix.m21;
    this.$matrix.m21 = tmp;
    tmp = this.$matrix.m13;
    this.$matrix.m13 = this.$matrix.m31;
    this.$matrix.m31 = tmp;
    tmp = this.$matrix.m14;
    this.$matrix.m14 = this.$matrix.m41;
    this.$matrix.m41 = tmp;
    tmp = this.$matrix.m23;
    this.$matrix.m23 = this.$matrix.m32;
    this.$matrix.m32 = tmp;
    tmp = this.$matrix.m24;
    this.$matrix.m24 = this.$matrix.m42;
    this.$matrix.m42 = tmp;
    tmp = this.$matrix.m34;
    this.$matrix.m34 = this.$matrix.m43;
    this.$matrix.m43 = tmp;
};

J3DIMatrix4.prototype.invert = function() {
    if (J3DIHasCSSMatrix) {
        this.$matrix = this.$matrix.inverse();
        return;
    }
    var det = this._determinant4x4();
    if (Math.abs(det) < 1e-8) return null;
    this._makeAdjoint();
    this.$matrix.m11 /= det;
    this.$matrix.m12 /= det;
    this.$matrix.m13 /= det;
    this.$matrix.m14 /= det;
    this.$matrix.m21 /= det;
    this.$matrix.m22 /= det;
    this.$matrix.m23 /= det;
    this.$matrix.m24 /= det;
    this.$matrix.m31 /= det;
    this.$matrix.m32 /= det;
    this.$matrix.m33 /= det;
    this.$matrix.m34 /= det;
    this.$matrix.m41 /= det;
    this.$matrix.m42 /= det;
    this.$matrix.m43 /= det;
    this.$matrix.m44 /= det;
};

J3DIMatrix4.prototype.translate = function(x, y, z) {
    if (typeof x == "object" && "length" in x) {
        var t = x;
        x = t[0];
        y = t[1];
        z = t[2];
    } else {
        if (x == undefined) x = 0;
        if (y == undefined) y = 0;
        if (z == undefined) z = 0;
    }
    if (J3DIHasCSSMatrix) {
        this.$matrix = this.$matrix.translate(x, y, z);
        return;
    }
    var matrix = new J3DIMatrix4();
    matrix.$matrix.m41 = x;
    matrix.$matrix.m42 = y;
    matrix.$matrix.m43 = z;
    this.multiply(matrix);
};

J3DIMatrix4.prototype.scale = function(x, y, z) {
    if (typeof x == "object" && "length" in x) {
        var t = x;
        x = t[0];
        y = t[1];
        z = t[2];
    } else {
        if (x == undefined) x = 1;
        if (z == undefined) {
            if (y == undefined) {
                y = x;
                z = x;
            } else z = 1;
        } else if (y == undefined) y = x;
    }
    if (J3DIHasCSSMatrix) {
        this.$matrix = this.$matrix.scale(x, y, z);
        return;
    }
    var matrix = new J3DIMatrix4();
    matrix.$matrix.m11 = x;
    matrix.$matrix.m22 = y;
    matrix.$matrix.m33 = z;
    this.multiply(matrix);
};

J3DIMatrix4.prototype.rotate = function(angle, x, y, z) {
    if (typeof x == "object" && "length" in x) {
        var t = x;
        x = t[0];
        y = t[1];
        z = t[2];
    } else {
        if (arguments.length == 1) {
            x = 0;
            y = 0;
            z = 1;
        } else if (arguments.length == 3) {
            this.rotate(angle, 1, 0, 0);
            this.rotate(x, 0, 1, 0);
            this.rotate(y, 0, 0, 1);
            return;
        }
    }
    if (J3DIHasCSSMatrix) {
        this.$matrix = this.$matrix.rotateAxisAngle(x, y, z, angle);
        return;
    }
    angle = angle / 180 * Math.PI;
    angle /= 2;
    var sinA = Math.sin(angle);
    var cosA = Math.cos(angle);
    var sinA2 = sinA * sinA;
    var len = Math.sqrt(x * x + y * y + z * z);
    if (len == 0) {
        x = 0;
        y = 0;
        z = 1;
    } else if (len != 1) {
        x /= len;
        y /= len;
        z /= len;
    }
    var mat = new J3DIMatrix4();
    if (x == 1 && y == 0 && z == 0) {
        mat.$matrix.m11 = 1;
        mat.$matrix.m12 = 0;
        mat.$matrix.m13 = 0;
        mat.$matrix.m21 = 0;
        mat.$matrix.m22 = 1 - 2 * sinA2;
        mat.$matrix.m23 = 2 * sinA * cosA;
        mat.$matrix.m31 = 0;
        mat.$matrix.m32 = -2 * sinA * cosA;
        mat.$matrix.m33 = 1 - 2 * sinA2;
        mat.$matrix.m14 = mat.$matrix.m24 = mat.$matrix.m34 = 0;
        mat.$matrix.m41 = mat.$matrix.m42 = mat.$matrix.m43 = 0;
        mat.$matrix.m44 = 1;
    } else if (x == 0 && y == 1 && z == 0) {
        mat.$matrix.m11 = 1 - 2 * sinA2;
        mat.$matrix.m12 = 0;
        mat.$matrix.m13 = -2 * sinA * cosA;
        mat.$matrix.m21 = 0;
        mat.$matrix.m22 = 1;
        mat.$matrix.m23 = 0;
        mat.$matrix.m31 = 2 * sinA * cosA;
        mat.$matrix.m32 = 0;
        mat.$matrix.m33 = 1 - 2 * sinA2;
        mat.$matrix.m14 = mat.$matrix.m24 = mat.$matrix.m34 = 0;
        mat.$matrix.m41 = mat.$matrix.m42 = mat.$matrix.m43 = 0;
        mat.$matrix.m44 = 1;
    } else if (x == 0 && y == 0 && z == 1) {
        mat.$matrix.m11 = 1 - 2 * sinA2;
        mat.$matrix.m12 = 2 * sinA * cosA;
        mat.$matrix.m13 = 0;
        mat.$matrix.m21 = -2 * sinA * cosA;
        mat.$matrix.m22 = 1 - 2 * sinA2;
        mat.$matrix.m23 = 0;
        mat.$matrix.m31 = 0;
        mat.$matrix.m32 = 0;
        mat.$matrix.m33 = 1;
        mat.$matrix.m14 = mat.$matrix.m24 = mat.$matrix.m34 = 0;
        mat.$matrix.m41 = mat.$matrix.m42 = mat.$matrix.m43 = 0;
        mat.$matrix.m44 = 1;
    } else {
        var x2 = x * x;
        var y2 = y * y;
        var z2 = z * z;
        mat.$matrix.m11 = 1 - 2 * (y2 + z2) * sinA2;
        mat.$matrix.m12 = 2 * (x * y * sinA2 + z * sinA * cosA);
        mat.$matrix.m13 = 2 * (x * z * sinA2 - y * sinA * cosA);
        mat.$matrix.m21 = 2 * (y * x * sinA2 - z * sinA * cosA);
        mat.$matrix.m22 = 1 - 2 * (z2 + x2) * sinA2;
        mat.$matrix.m23 = 2 * (y * z * sinA2 + x * sinA * cosA);
        mat.$matrix.m31 = 2 * (z * x * sinA2 + y * sinA * cosA);
        mat.$matrix.m32 = 2 * (z * y * sinA2 - x * sinA * cosA);
        mat.$matrix.m33 = 1 - 2 * (x2 + y2) * sinA2;
        mat.$matrix.m14 = mat.$matrix.m24 = mat.$matrix.m34 = 0;
        mat.$matrix.m41 = mat.$matrix.m42 = mat.$matrix.m43 = 0;
        mat.$matrix.m44 = 1;
    }
    this.multiply(mat);
};

J3DIMatrix4.prototype.multiply = function(mat) {
    if (J3DIHasCSSMatrix) {
        this.$matrix = this.$matrix.multiply(mat.$matrix);
        return;
    }
    var m11 = mat.$matrix.m11 * this.$matrix.m11 + mat.$matrix.m12 * this.$matrix.m21 + mat.$matrix.m13 * this.$matrix.m31 + mat.$matrix.m14 * this.$matrix.m41;
    var m12 = mat.$matrix.m11 * this.$matrix.m12 + mat.$matrix.m12 * this.$matrix.m22 + mat.$matrix.m13 * this.$matrix.m32 + mat.$matrix.m14 * this.$matrix.m42;
    var m13 = mat.$matrix.m11 * this.$matrix.m13 + mat.$matrix.m12 * this.$matrix.m23 + mat.$matrix.m13 * this.$matrix.m33 + mat.$matrix.m14 * this.$matrix.m43;
    var m14 = mat.$matrix.m11 * this.$matrix.m14 + mat.$matrix.m12 * this.$matrix.m24 + mat.$matrix.m13 * this.$matrix.m34 + mat.$matrix.m14 * this.$matrix.m44;
    var m21 = mat.$matrix.m21 * this.$matrix.m11 + mat.$matrix.m22 * this.$matrix.m21 + mat.$matrix.m23 * this.$matrix.m31 + mat.$matrix.m24 * this.$matrix.m41;
    var m22 = mat.$matrix.m21 * this.$matrix.m12 + mat.$matrix.m22 * this.$matrix.m22 + mat.$matrix.m23 * this.$matrix.m32 + mat.$matrix.m24 * this.$matrix.m42;
    var m23 = mat.$matrix.m21 * this.$matrix.m13 + mat.$matrix.m22 * this.$matrix.m23 + mat.$matrix.m23 * this.$matrix.m33 + mat.$matrix.m24 * this.$matrix.m43;
    var m24 = mat.$matrix.m21 * this.$matrix.m14 + mat.$matrix.m22 * this.$matrix.m24 + mat.$matrix.m23 * this.$matrix.m34 + mat.$matrix.m24 * this.$matrix.m44;
    var m31 = mat.$matrix.m31 * this.$matrix.m11 + mat.$matrix.m32 * this.$matrix.m21 + mat.$matrix.m33 * this.$matrix.m31 + mat.$matrix.m34 * this.$matrix.m41;
    var m32 = mat.$matrix.m31 * this.$matrix.m12 + mat.$matrix.m32 * this.$matrix.m22 + mat.$matrix.m33 * this.$matrix.m32 + mat.$matrix.m34 * this.$matrix.m42;
    var m33 = mat.$matrix.m31 * this.$matrix.m13 + mat.$matrix.m32 * this.$matrix.m23 + mat.$matrix.m33 * this.$matrix.m33 + mat.$matrix.m34 * this.$matrix.m43;
    var m34 = mat.$matrix.m31 * this.$matrix.m14 + mat.$matrix.m32 * this.$matrix.m24 + mat.$matrix.m33 * this.$matrix.m34 + mat.$matrix.m34 * this.$matrix.m44;
    var m41 = mat.$matrix.m41 * this.$matrix.m11 + mat.$matrix.m42 * this.$matrix.m21 + mat.$matrix.m43 * this.$matrix.m31 + mat.$matrix.m44 * this.$matrix.m41;
    var m42 = mat.$matrix.m41 * this.$matrix.m12 + mat.$matrix.m42 * this.$matrix.m22 + mat.$matrix.m43 * this.$matrix.m32 + mat.$matrix.m44 * this.$matrix.m42;
    var m43 = mat.$matrix.m41 * this.$matrix.m13 + mat.$matrix.m42 * this.$matrix.m23 + mat.$matrix.m43 * this.$matrix.m33 + mat.$matrix.m44 * this.$matrix.m43;
    var m44 = mat.$matrix.m41 * this.$matrix.m14 + mat.$matrix.m42 * this.$matrix.m24 + mat.$matrix.m43 * this.$matrix.m34 + mat.$matrix.m44 * this.$matrix.m44;
    this.$matrix.m11 = m11;
    this.$matrix.m12 = m12;
    this.$matrix.m13 = m13;
    this.$matrix.m14 = m14;
    this.$matrix.m21 = m21;
    this.$matrix.m22 = m22;
    this.$matrix.m23 = m23;
    this.$matrix.m24 = m24;
    this.$matrix.m31 = m31;
    this.$matrix.m32 = m32;
    this.$matrix.m33 = m33;
    this.$matrix.m34 = m34;
    this.$matrix.m41 = m41;
    this.$matrix.m42 = m42;
    this.$matrix.m43 = m43;
    this.$matrix.m44 = m44;
};

J3DIMatrix4.prototype.divide = function(divisor) {
    this.$matrix.m11 /= divisor;
    this.$matrix.m12 /= divisor;
    this.$matrix.m13 /= divisor;
    this.$matrix.m14 /= divisor;
    this.$matrix.m21 /= divisor;
    this.$matrix.m22 /= divisor;
    this.$matrix.m23 /= divisor;
    this.$matrix.m24 /= divisor;
    this.$matrix.m31 /= divisor;
    this.$matrix.m32 /= divisor;
    this.$matrix.m33 /= divisor;
    this.$matrix.m34 /= divisor;
    this.$matrix.m41 /= divisor;
    this.$matrix.m42 /= divisor;
    this.$matrix.m43 /= divisor;
    this.$matrix.m44 /= divisor;
};

J3DIMatrix4.prototype.ortho = function(left, right, bottom, top, near, far) {
    var tx = (left + right) / (left - right);
    var ty = (top + bottom) / (top - bottom);
    var tz = (far + near) / (far - near);
    var matrix = new J3DIMatrix4();
    matrix.$matrix.m11 = 2 / (left - right);
    matrix.$matrix.m12 = 0;
    matrix.$matrix.m13 = 0;
    matrix.$matrix.m14 = 0;
    matrix.$matrix.m21 = 0;
    matrix.$matrix.m22 = 2 / (top - bottom);
    matrix.$matrix.m23 = 0;
    matrix.$matrix.m24 = 0;
    matrix.$matrix.m31 = 0;
    matrix.$matrix.m32 = 0;
    matrix.$matrix.m33 = -2 / (far - near);
    matrix.$matrix.m34 = 0;
    matrix.$matrix.m41 = tx;
    matrix.$matrix.m42 = ty;
    matrix.$matrix.m43 = tz;
    matrix.$matrix.m44 = 1;
    this.multiply(matrix);
};

J3DIMatrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
    var matrix = new J3DIMatrix4();
    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = -(far + near) / (far - near);
    var D = -(2 * far * near) / (far - near);
    matrix.$matrix.m11 = 2 * near / (right - left);
    matrix.$matrix.m12 = 0;
    matrix.$matrix.m13 = 0;
    matrix.$matrix.m14 = 0;
    matrix.$matrix.m21 = 0;
    matrix.$matrix.m22 = 2 * near / (top - bottom);
    matrix.$matrix.m23 = 0;
    matrix.$matrix.m24 = 0;
    matrix.$matrix.m31 = A;
    matrix.$matrix.m32 = B;
    matrix.$matrix.m33 = C;
    matrix.$matrix.m34 = -1;
    matrix.$matrix.m41 = 0;
    matrix.$matrix.m42 = 0;
    matrix.$matrix.m43 = D;
    matrix.$matrix.m44 = 0;
    this.multiply(matrix);
};

J3DIMatrix4.prototype.perspective = function(fovy, aspect, zNear, zFar) {
    var top = Math.tan(fovy * Math.PI / 360) * zNear;
    var bottom = -top;
    var left = aspect * bottom;
    var right = aspect * top;
    this.frustum(left, right, bottom, top, zNear, zFar);
};

J3DIMatrix4.prototype.lookat = function(eyex, eyey, eyez, centerx, centery, centerz, upx, upy, upz) {
    if (typeof eyez == "object" && "length" in eyez) {
        var t = eyez;
        upx = t[0];
        upy = t[1];
        upz = t[2];
        t = eyey;
        centerx = t[0];
        centery = t[1];
        centerz = t[2];
        t = eyex;
        eyex = t[0];
        eyey = t[1];
        eyez = t[2];
    }
    var matrix = new J3DIMatrix4();
    var zx = eyex - centerx;
    var zy = eyey - centery;
    var zz = eyez - centerz;
    var mag = Math.sqrt(zx * zx + zy * zy + zz * zz);
    if (mag) {
        zx /= mag;
        zy /= mag;
        zz /= mag;
    }
    var yx = upx;
    var yy = upy;
    var yz = upz;
    xx = yy * zz - yz * zy;
    xy = -yx * zz + yz * zx;
    xz = yx * zy - yy * zx;
    yx = zy * xz - zz * xy;
    yy = -zx * xz + zz * xx;
    yx = zx * xy - zy * xx;
    mag = Math.sqrt(xx * xx + xy * xy + xz * xz);
    if (mag) {
        xx /= mag;
        xy /= mag;
        xz /= mag;
    }
    mag = Math.sqrt(yx * yx + yy * yy + yz * yz);
    if (mag) {
        yx /= mag;
        yy /= mag;
        yz /= mag;
    }
    matrix.$matrix.m11 = xx;
    matrix.$matrix.m12 = xy;
    matrix.$matrix.m13 = xz;
    matrix.$matrix.m14 = 0;
    matrix.$matrix.m21 = yx;
    matrix.$matrix.m22 = yy;
    matrix.$matrix.m23 = yz;
    matrix.$matrix.m24 = 0;
    matrix.$matrix.m31 = zx;
    matrix.$matrix.m32 = zy;
    matrix.$matrix.m33 = zz;
    matrix.$matrix.m34 = 0;
    matrix.$matrix.m41 = 0;
    matrix.$matrix.m42 = 0;
    matrix.$matrix.m43 = 0;
    matrix.$matrix.m44 = 1;
    matrix.translate(-eyex, -eyey, -eyez);
    this.multiply(matrix);
};

J3DIMatrix4.prototype.decompose = function(_translate, _rotate, _scale, _skew, _perspective) {
    if (this.$matrix.m44 == 0) return false;
    var translate, rotate, scale, skew, perspective;
    var translate = _translate == undefined || !("length" in _translate) ? new J3DIVector3() : _translate;
    var rotate = _rotate == undefined || !("length" in _rotate) ? new J3DIVector3() : _rotate;
    var scale = _scale == undefined || !("length" in _scale) ? new J3DIVector3() : _scale;
    var skew = _skew == undefined || !("length" in _skew) ? new J3DIVector3() : _skew;
    var perspective = _perspective == undefined || !("length" in _perspective) ? new Array(4) : _perspective;
    var matrix = new J3DIMatrix4(this);
    matrix.divide(matrix.$matrix.m44);
    var perspectiveMatrix = new J3DIMatrix4(matrix);
    perspectiveMatrix.$matrix.m14 = 0;
    perspectiveMatrix.$matrix.m24 = 0;
    perspectiveMatrix.$matrix.m34 = 0;
    perspectiveMatrix.$matrix.m44 = 1;
    if (perspectiveMatrix._determinant4x4() == 0) return false;
    if (matrix.$matrix.m14 != 0 || matrix.$matrix.m24 != 0 || matrix.$matrix.m34 != 0) {
        var rightHandSide = [ matrix.$matrix.m14, matrix.$matrix.m24, matrix.$matrix.m34, matrix.$matrix.m44 ];
        var inversePerspectiveMatrix = new J3DIMatrix4(perspectiveMatrix);
        inversePerspectiveMatrix.invert();
        var transposedInversePerspectiveMatrix = new J3DIMatrix4(inversePerspectiveMatrix);
        transposedInversePerspectiveMatrix.transpose();
        transposedInversePerspectiveMatrix.multVecMatrix(perspective, rightHandSide);
        matrix.$matrix.m14 = matrix.$matrix.m24 = matrix.$matrix.m34 = 0;
        matrix.$matrix.m44 = 1;
    } else {
        perspective[0] = perspective[1] = perspective[2] = 0;
        perspective[3] = 1;
    }
    translate[0] = matrix.$matrix.m41;
    matrix.$matrix.m41 = 0;
    translate[1] = matrix.$matrix.m42;
    matrix.$matrix.m42 = 0;
    translate[2] = matrix.$matrix.m43;
    matrix.$matrix.m43 = 0;
    var row0 = new J3DIVector3(matrix.$matrix.m11, matrix.$matrix.m12, matrix.$matrix.m13);
    var row1 = new J3DIVector3(matrix.$matrix.m21, matrix.$matrix.m22, matrix.$matrix.m23);
    var row2 = new J3DIVector3(matrix.$matrix.m31, matrix.$matrix.m32, matrix.$matrix.m33);
    scale[0] = row0.vectorLength();
    row0.divide(scale[0]);
    skew[0] = row0.dot(row1);
    row1.combine(row0, 1, -skew[0]);
    scale[1] = row1.vectorLength();
    row1.divide(scale[1]);
    skew[0] /= scale[1];
    skew[1] = row1.dot(row2);
    row2.combine(row0, 1, -skew[1]);
    skew[2] = row1.dot(row2);
    row2.combine(row1, 1, -skew[2]);
    scale[2] = row2.vectorLength();
    row2.divide(scale[2]);
    skew[1] /= scale[2];
    skew[2] /= scale[2];
    var pdum3 = new J3DIVector3(row1);
    pdum3.cross(row2);
    if (row0.dot(pdum3) < 0) {
        for (i = 0; i < 3; i++) {
            scale[i] *= -1;
            row[0][i] *= -1;
            row[1][i] *= -1;
            row[2][i] *= -1;
        }
    }
    rotate[1] = Math.asin(-row0[2]);
    if (Math.cos(rotate[1]) != 0) {
        rotate[0] = Math.atan2(row1[2], row2[2]);
        rotate[2] = Math.atan2(row0[1], row0[0]);
    } else {
        rotate[0] = Math.atan2(-row2[0], row1[1]);
        rotate[2] = 0;
    }
    var rad2deg = 180 / Math.PI;
    rotate[0] *= rad2deg;
    rotate[1] *= rad2deg;
    rotate[2] *= rad2deg;
    return true;
};

J3DIMatrix4.prototype._determinant2x2 = function(a, b, c, d) {
    return a * d - b * c;
};

J3DIMatrix4.prototype._determinant3x3 = function(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
    return a1 * this._determinant2x2(b2, b3, c2, c3) - b1 * this._determinant2x2(a2, a3, c2, c3) + c1 * this._determinant2x2(a2, a3, b2, b3);
};

J3DIMatrix4.prototype._determinant4x4 = function() {
    var a1 = this.$matrix.m11;
    var b1 = this.$matrix.m12;
    var c1 = this.$matrix.m13;
    var d1 = this.$matrix.m14;
    var a2 = this.$matrix.m21;
    var b2 = this.$matrix.m22;
    var c2 = this.$matrix.m23;
    var d2 = this.$matrix.m24;
    var a3 = this.$matrix.m31;
    var b3 = this.$matrix.m32;
    var c3 = this.$matrix.m33;
    var d3 = this.$matrix.m34;
    var a4 = this.$matrix.m41;
    var b4 = this.$matrix.m42;
    var c4 = this.$matrix.m43;
    var d4 = this.$matrix.m44;
    return a1 * this._determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) - b1 * this._determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) + c1 * this._determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) - d1 * this._determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
};

J3DIMatrix4.prototype._makeAdjoint = function() {
    var a1 = this.$matrix.m11;
    var b1 = this.$matrix.m12;
    var c1 = this.$matrix.m13;
    var d1 = this.$matrix.m14;
    var a2 = this.$matrix.m21;
    var b2 = this.$matrix.m22;
    var c2 = this.$matrix.m23;
    var d2 = this.$matrix.m24;
    var a3 = this.$matrix.m31;
    var b3 = this.$matrix.m32;
    var c3 = this.$matrix.m33;
    var d3 = this.$matrix.m34;
    var a4 = this.$matrix.m41;
    var b4 = this.$matrix.m42;
    var c4 = this.$matrix.m43;
    var d4 = this.$matrix.m44;
    this.$matrix.m11 = this._determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
    this.$matrix.m21 = -this._determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
    this.$matrix.m31 = this._determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
    this.$matrix.m41 = -this._determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
    this.$matrix.m12 = -this._determinant3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
    this.$matrix.m22 = this._determinant3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
    this.$matrix.m32 = -this._determinant3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
    this.$matrix.m42 = this._determinant3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);
    this.$matrix.m13 = this._determinant3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
    this.$matrix.m23 = -this._determinant3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
    this.$matrix.m33 = this._determinant3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
    this.$matrix.m43 = -this._determinant3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);
    this.$matrix.m14 = -this._determinant3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
    this.$matrix.m24 = this._determinant3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
    this.$matrix.m34 = -this._determinant3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
    this.$matrix.m44 = this._determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);
};

J3DIVector3 = function(x, y, z) {
    this.load(x, y, z);
};

J3DIVector3.prototype.load = function(x, y, z) {
    if (typeof x == "object" && "length" in x) {
        this[0] = x[0];
        this[1] = x[1];
        this[2] = x[2];
    } else if (typeof x == "number") {
        this[0] = x;
        this[1] = y;
        this[2] = z;
    } else {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
    }
};

J3DIVector3.prototype.getAsArray = function() {
    return [ this[0], this[1], this[2] ];
};

J3DIVector3.prototype.getAsFloat32Array = function() {
    return new Float32Array(this.getAsArray());
};

J3DIVector3.prototype.vectorLength = function() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
};

J3DIVector3.prototype.divide = function(divisor) {
    this[0] /= divisor;
    this[1] /= divisor;
    this[2] /= divisor;
};

J3DIVector3.prototype.cross = function(v) {
    this[0] = this[1] * v[2] - this[2] * v[1];
    this[1] = -this[0] * v[2] + this[2] * v[0];
    this[2] = this[0] * v[1] - this[1] * v[0];
};

J3DIVector3.prototype.dot = function(v) {
    return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
};

J3DIVector3.prototype.combine = function(v, ascl, bscl) {
    this[0] = ascl * this[0] + bscl * v[0];
    this[1] = ascl * this[1] + bscl * v[1];
    this[2] = ascl * this[2] + bscl * v[2];
};

J3DIVector3.prototype.multVecMatrix = function(matrix) {
    var x = this[0];
    var y = this[1];
    var z = this[2];
    this[0] = matrix.$matrix.m41 + x * matrix.$matrix.m11 + y * matrix.$matrix.m21 + z * matrix.$matrix.m31;
    this[1] = matrix.$matrix.m42 + x * matrix.$matrix.m12 + y * matrix.$matrix.m22 + z * matrix.$matrix.m32;
    this[2] = matrix.$matrix.m43 + x * matrix.$matrix.m13 + y * matrix.$matrix.m23 + z * matrix.$matrix.m33;
    var w = matrix.$matrix.m44 + x * matrix.$matrix.m14 + y * matrix.$matrix.m24 + z * matrix.$matrix.m34;
    if (w != 1 && w != 0) {
        this[0] /= w;
        this[1] /= w;
        this[2] /= w;
    }
};

J3DIVector3.prototype.toString = function() {
    return "[" + this[0] + "," + this[1] + "," + this[2] + "]";
};

function GLRunner(canvas, cfg) {
    cfg = cfg ? cfg : {};
    this.cfg = {
        ignoreCL: cfg.hasOwnProperty("ignoreCL") ? cfg.ignoreCL : false,
        antialias: cfg.hasOwnProperty("antialias") ? cfg.antialias : true
    };
    for (i in cfg) this.cfg[i] = cfg[i];
    if (cfg.ignoreCL) {
        var context = canvas.getContext("2d");
        this.context = context;
        var pos = [ 0, 0, 0 ];
        this.position = {
            x: function() {
                return pos[0];
            },
            y: function() {
                return pos[1];
            },
            z: function() {
                return pos[2];
            }
        };
        this.movePosition = function(x, y, z) {
            pos[0] += x;
            pos[1] += y;
            pos[2] += z;
        };
        this.resetCanvas = function() {
            console.log("reset");
            canvas.width = canvas.width;
            context.translate(5, canvas.height * .9);
            context.scale(.0027, .0016);
        };
        window.rgb = function(r, g, b) {
            return (255 << 24) + ((r & 255) << 16) + ((g & 255) << 8) + (b & 255);
        };
        window.rgba = function(r, g, b, a) {
            return ((a & 255) << 24) + ((r & 255) << 16) + ((g & 255) << 8) + (b & 255);
        };
        window.lerpColor = function(start_color, end_color, fk) {
            if (fk >= 1) {
                return end_color;
            }
            var red_start = start_color >> 16 & 255;
            var green_start = start_color >> 8 & 255;
            var blue_start = start_color & 255;
            var red_end = end_color >> 16 & 255;
            var green_end = end_color >> 8 & 255;
            var blue_end = end_color & 255;
            var red_blended = (1 - fk) * red_start + fk * red_end & 255;
            var green_blended = (1 - fk) * green_start + fk * green_end & 255;
            var blue_blended = (1 - fk) * blue_start + fk * blue_end & 255;
            return (red_blended << 16) + (green_blended << 8) + blue_blended;
        };
        window.Rectangle_draw = function(_, _, _, x, y, w, h, color) {
            context.beginPath();
            context.rect(x, -y, w, -h);
            context.fillStyle = "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + (color >> 24 & 255) + ")";
            context.fill();
            context.closePath();
        };
        window.RectangleZ_draw = function(_, _, _, x, y, w, h, _, color) {
            window.Rectangle_draw(0, 0, 0, x, y, w, h, color);
        };
        window.RectangleOutline_draw = function(_, _, _, x, y, w, h, color) {
            context.beginPath();
            context.lineWidth = 3;
            context.strokeStyle = "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + (color >> 24 & 255) + ")";
            context.strokeRect(x, -y, w, -h);
            context.closePath();
        };
        [ "Line_size", "Line_draw", "RectangleOutline_size", "Rectangle_size", "paintStart", "RectangleZ_size", "glBufferMacro" ].forEach(function(name) {
            window[name] = function() {};
        });
    } else {
        this.canvas = canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.gl = this.canvas.getContext("experimental-webgl", {
            antialias: this.cfg.antialias,
            premultipliedAlpha: false
        });
        this.context = this.gl;
        this.loadGLProgram();
        this.perspective = {};
        this.updateView({
            fov: 60,
            nearPlane: 1,
            farPlane: 20
        });
        this.position = {};
        this.rotation = {
            x: 0,
            y: 0,
            z: 0
        };
        this.setPosition(-5.14, -3.8, -7.5);
        this.setRotation(0, 0, 0);
        this.setW(1e4);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.vbo_size = 0;
        this.num_vertices = 0;
        this.vbo = null;
    }
}

GLRunner.prototype.readyToRender = function() {
    return true;
};

GLRunner.prototype.vertexAndColor = {
    numVertexComponents: 4,
    sizeVertexCompontent: 4 * Float32Array.BYTES_PER_ELEMENT,
    numColorsComponents: 4,
    sizeColorComponents: 4 * Float32Array.BYTES_PER_ELEMENT,
    sizeTotal: (4 + 4) * Float32Array.BYTES_PER_ELEMENT
};

GLRunner.prototype.renderFrame = function() {
    if (!this.readyToRender()) {
        console.error("GLRunner was asked to render a frame, but it's not yet ready to render");
        return;
    }
    if (this.cfg.ignoreCL) {
        console.log("rerun last pass");
    } else {
        console.debug("## Rendering a frame ##");
        this.gl.finish();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.num_vertices);
        var error = this.gl.getError();
        if (error != this.gl.NONE) {
            console.error("WebGL error detected after rendering: " + error);
        }
    }
};

GLRunner.prototype.reallocateVBO = function(numRequestedVertices) {
    if (numRequestedVertices <= 0) {
        throw new SCException("Error: GLRunner asked to reallocateVBO to size " + numRequestedVertices);
    }
    this.num_vertices = numRequestedVertices;
    var requested_size = this.num_vertices * this.vertexAndColor.sizeTotal;
    if (this.vbo_size < requested_size || this.vbo_size - requested_size > this.vbo_size * .25) {
        console.debug("VBO size of " + this.vbo_size + " is not within range for requested size of " + requested_size + " (" + this.num_vertices + " vertices). Reallocating VBO.");
        if (this.vbo != null) {
            console.debug("Deleting old VBO");
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.deleteBuffer(this.vbo);
        }
        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.vbo_size = Math.ceil(requested_size * 1.25);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vbo_size, this.gl.STATIC_DRAW);
        this.linkVBO();
    } else {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    }
    return this.vbo;
};

GLRunner.prototype.linkVBO = function() {
    if (this.vbo == null && this.debug_vbo == null) {
        console.error("Error: Attempted to set shader VBO source, but a valid VBO has not been initialized yet.");
        return null;
    }
    var pos_attr_loc = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(pos_attr_loc);
    this.gl.vertexAttribPointer(pos_attr_loc, this.vertexAndColor.numVertexComponents, this.gl.FLOAT, false, this.vertexAndColor.sizeTotal, 0);
    var color_attr_loc = this.gl.getAttribLocation(this.program, "a_color");
    this.gl.enableVertexAttribArray(color_attr_loc);
    this.gl.vertexAttribPointer(color_attr_loc, this.vertexAndColor.numColorsComponents, this.gl.FLOAT, false, this.vertexAndColor.sizeTotal, this.vertexAndColor.sizeVertexCompontent);
};

GLRunner.prototype.loadGLProgram = function() {
    this.program = this.gl.createProgram();
    this.vertex_shader = this.loadShader(this.vertexShaderSource, this.gl.VERTEX_SHADER);
    this.gl.attachShader(this.program, this.vertex_shader);
    this.fragment_shader = this.loadShader(this.fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.gl.attachShader(this.program, this.fragment_shader);
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error("Error: Could not link program. " + this.gl.getProgramInfoLog(this.program));
        this.gl.deleteProgram(this.program);
        return null;
    }
    this.gl.validateProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
        console.error("Error: WebGL could not validate the program.");
        this.gl.deleteProgram(this.program);
        return null;
    }
    this.gl.useProgram(this.program);
};

GLRunner.prototype.loadShader = function(shaderSource, shaderType) {
    var shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error("Error: Could not compile shader. " + this.gl.getShaderInfoLog(shader));
        console.debug("Shader source: " + shaderSource);
        this.gl.deleteShader(shader);
        return null;
    }
    if (!this.gl.isShader(shader)) {
        console.error("Error: WebGL is reporting that the specified shader is not a valid shader.");
        console.debug("Shader source: " + shaderSource);
        return null;
    }
    return shader;
};

GLRunner.prototype.updateView = function(perspective) {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    if (perspective !== undefined) {
        for (var key in perspective) {
            this.perspective[key] = perspective[key];
        }
    }
    this.perspective.aspect = this.canvas.width / this.canvas.height;
    var projct_m_location = this.gl.getUniformLocation(this.program, "u_projection_matrix");
    var projct_mat = new J3DIMatrix4();
    projct_mat.perspective(this.perspective.fov, this.perspective.aspect, this.perspective.nearPlane, this.perspective.farPlane);
    projct_mat.setUniform(this.gl, projct_m_location, false);
};

GLRunner.prototype.setPosition = function(xPos, yPos, zPos) {
    this.position = {
        x: xPos,
        y: yPos,
        z: zPos
    };
    this.updateModelView();
};

GLRunner.prototype.movePosition = function(x, y, z) {
    this.setPosition(this.position.x + x, this.position.y + y, this.position.z + z);
};

GLRunner.prototype.setRotation = function(xDeg, yDeg, zDeg) {
    this.rotation = {
        x: xDeg,
        y: yDeg,
        z: zDeg
    };
    this.updateModelView();
};

GLRunner.prototype.rotate = function(xDeg, yDeg, zDeg) {
    this.rotation.x += xDeg;
    this.rotation.y += yDeg;
    this.rotation.z += zDeg;
};

GLRunner.prototype.updateModelView = function() {
    var mv_mat = new J3DIMatrix4();
    mv_mat.translate(this.position.x, this.position.y, this.position.z);
    mv_mat.rotate(this.rotation.x, 1, 0, 0);
    mv_mat.rotate(this.rotation.y, 0, 1, 0);
    mv_mat.rotate(this.rotation.z, 0, 0, 1);
    var mv_m_location = this.gl.getUniformLocation(this.program, "u_modelview_matrix");
    mv_mat.setUniform(this.gl, mv_m_location, false);
};

GLRunner.prototype.setW = function(w) {
    this.vertex_w = w;
    var w_location = this.gl.getUniformLocation(this.program, "u_w");
    this.gl.uniform1f(w_location, this.vertex_w);
};

GLRunner.prototype.glContextLostListener = function(event) {
    console.error("*** WebGL context lost event received. Message: " + event.statusMessage);
    console.error("OpenGL error code: " + this.gl.getError());
};

GLRunner.prototype.glContextRestoredListener = function(event) {
    console.debug("*** WebGL context restored event received. Message: " + event.statusMessage);
};

GLRunner.prototype.glContextCreationErrorListener = function(event) {
    console.error("*** WebGL context creation error event received. Message: " + event.statusMessage);
};

GLRunner.prototype.vertexShaderSource = "precision mediump float;\n\nattribute vec4 a_position;\nattribute vec4 a_color;\n\nuniform float u_w;\n\nuniform mat4 u_projection_matrix;\nuniform mat4 u_modelview_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n	vec4 pos = vec4(a_position.x, a_position.y, a_position.z, u_w);\n	gl_Position = u_projection_matrix * u_modelview_matrix * pos;\n	v_color = a_color;\n}";

GLRunner.prototype.fragmentShaderSource = "precision mediump float;\nvarying vec4 v_color;\n\nvoid main() {\n	gl_FragColor = v_color;\n}";

function CLDataWrapper(clr, hostBuffer, clBuffer) {
    if (clr.cfg.ignoreCL) {
        this.get = function(index) {
            return hostBuffer[index];
        };
        this.set = function(index, value) {
            hostBuffer[index] = value;
            return value;
        };
        this.__defineGetter__("length", function() {
            return hostBuffer.length;
        });
    } else {
        this.get = function(index) {
            var target = new hostBuffer.constructor(1);
            var itemOffset = hostBuffer.byteOffset + hostBuffer.BYTES_PER_ELEMENT * index;
            clr.queue.enqueueReadBuffer(clBuffer, true, itemOffset, target.byteLength, target);
            return target[0];
        };
        this.set = function(index, value) {
            var target = new hostBuffer.constructor(1);
            target[0] = value;
            var itemOffset = hostBuffer.byteOffset + hostBuffer.BYTES_PER_ELEMENT * index;
            clr.queue.enqueueWriteBuffer(clBuffer, true, itemOffset, target.byteLength, target);
            return value;
        };
        this.__defineGetter__("length", function() {
            return hostBuffer.length;
        });
    }
}

function CLRunner(glr, cfg) {
    if (!cfg) cfg = {};
    this.cfg = {
        ignoreCL: cfg.hasOwnProperty("ignoreCL") ? cfg.ignoreCL : false,
        webworkerLayout: cfg.hasOwnProperty("webworkerLayout") ? cfg.webworkerLayout : false,
        numWorkers: cfg.hasOwnProperty("numWorkers") ? cfg.numWorkers : 4,
        minParallelLayoutLevelLength: cfg.hasOwnProperty("minParallelLayoutLevelLength") ? cfg.minParallelLayoutLevelLength : 1e3
    };
    for (i in cfg) this.cfg[i] = cfg[i];
    this.glr = glr;
    if (!this.cfg.ignoreCL) {
        if (!webcl) {
            throw new SCException("WebCL does not appear to be supported in your browser");
        }
        this.cl = webcl;
        var platforms = this.cl.getPlatforms();
        if (platforms.length === 0) {
            throw new SCException("No platforms available");
        }
        var platform = platforms[0];
        this.devices = platform.getDevices(this.cl.DEVICE_TYPE_GPU);
        if (this.devices.length === 0) {
            throw new SCException("No devices available");
        }
        if (typeof this.cl.getExtension != "undefined") {
            var extension = null;
            extension = this.cl.getExtension("KHR_GL_SHARING");
            if (extension === null) {
                throw new SCException("Could not create a shared CL/GL context using the WebCL extension system");
            }
            this.context = extension.createContext({
                platform: platform,
                devices: this.devices,
                deviceType: this.cl.DEVICE_TYPE_GPU,
                hint: null,
                shareGroup: 1
            });
        } else {
            this.context = this.cl.createContext({
                platform: platform,
                devices: this.devices,
                deviceType: this.cl.DEVICE_TYPE_GPU,
                shareGroup: 1,
                hint: null
            });
        }
        if (this.context == null) {
            throw new SCException("Could not create a shared WebCL context");
        }
        this.queue = this.context.createCommandQueue(this.devices, null);
        if (this.queue == null) {
            throw new SCException("Could not create a WebCL command queue");
        }
        this.clVBO = null;
    }
    this.proxyData = {};
}

CLRunner.prototype.readyToLayout = function() {
    var kernelsLoaded = this.cfg.ignoreCL ? true : typeof this.program !== "undefined";
    var dataLoaded = typeof this.tree_size !== "undefined";
    return kernelsLoaded && dataLoaded;
};

CLRunner.prototype.computeReadWriteSets = function() {
    if (!this.hasOwnProperty("visit_0")) throw new SCException("Did not previously run loadLayoutEngine()");
    var clr = this;
    var getLastVisitNum = function() {
        var lastVisitNum = 0;
        while (true) {
            if (clr["visit_" + (lastVisitNum + 1)]) {
                lastVisitNum++;
            } else {
                return lastVisitNum;
            }
        }
    };
    var getNodeVisitors = function(visitNum) {
        var res = [];
        for (var i in clr) if (i.match("visit_[a-z]*_" + visitNum)) res.push(clr[i]);
        return res;
    };
    var arrayToSet = function(arr) {
        var res = [];
        arr.forEach(function(v) {
            if (res.indexOf(v) == -1) res.push(v);
        });
        return res;
    };
    var getFldsWrites = function(fn) {
        var fnStr = fn.toString();
        var selfHits = [].concat(fnStr.match(/this\.fld_[a-zA-Z0-9_]*\[index\] =/g)).filter(function(v) {
            return v;
        }).map(function(v) {
            return v.slice("this.".length, v.indexOf("["));
        });
        var childHits = [].concat(fnStr.match(/this\.fld_[a-zA-Z0-9_]*\[((current_node)|(this\.GetAbsoluteIndex\(this\.fld_[a-z_]*\[index\], index\)))\] =/g)).filter(function(v) {
            return v;
        }).map(function(v) {
            return v.slice("this.".length, v.indexOf("["));
        });
        return {
            self: arrayToSet(selfHits),
            child: arrayToSet(childHits)
        };
    };
    var getFldsReads = function(fn) {
        var lines = fn.toString().split("\n").filter(function(l) {
            return l.indexOf(" = ") != -1;
        });
        var loopLines = lines.filter(function(l) {
            return l.indexOf(" for ") != -1;
        });
        var nonLoopLines = lines.filter(function(l) {
            return l.indexOf(" for ") == -1;
        });
        var nonLoopLinesRhs = nonLoopLines.map(function(line) {
            return line.split(" = ")[1];
        }).filter(function(l) {
            if (l.indexOf(" = ") != -1) throw "double assign!";
            return true;
        });
        var selfHits = nonLoopLinesRhs.reduce(function(acc, line) {
            var matches = [].concat(line.match(/this\.fld_[a-zA-Z0-9_]*\[index/g)).filter(function(v) {
                return v;
            }).map(function(v) {
                return v.slice("this.".length, v.indexOf("["));
            });
            return acc.concat(matches);
        }, [ "displayname" ]);
        var childHits = nonLoopLinesRhs.reduce(function(acc, line) {
            var matches = [].concat(line.match(/this\.fld_[a-zA-Z0-9_]*\[((current_node)|(this\.GetAbsol))/g)).filter(function(v) {
                return v;
            }).map(function(v) {
                return v.slice("this.".length, v.indexOf("["));
            });
            return acc.concat(matches);
        }, []);
        if (loopLines.length > 0) {
            childHits.push("right_siblings");
            selfHits = selfHits.concat(loopLines.map(function(line) {
                return line.split("=")[3].match("this.fld_[a-zA-Z0-9_]*")[0].slice("this.".length);
            }));
        }
        selfHits = selfHits.concat(nonLoopLines.map(function(line) {
            return line.split(" = ")[0];
        }).filter(function(l) {
            return l.indexOf("GetAbsoluteIndex") != -1;
        }).map(function(l) {
            return l.slice(l.indexOf("(") + "(this.".length, l.indexOf("index") - 1);
        }));
        return {
            self: arrayToSet(selfHits),
            child: arrayToSet(childHits)
        };
    };
    var visitFields = [];
    var mx = getLastVisitNum();
    var reducer = function(hits) {
        return hits.reduce(function(acc, writes) {
            return {
                self: arrayToSet(acc.self.concat(writes.self)),
                child: arrayToSet(acc.child.concat(writes.child))
            };
        }, {
            self: [],
            child: []
        });
    };
    for (var i = 0; i <= mx; i++) {
        var writes = reducer(getNodeVisitors(i).map(getFldsWrites));
        var reads = reducer(getNodeVisitors(i).map(getFldsReads));
        var any = [];
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
            returnViews: returnViews
        });
    }
    return visitFields;
};

CLRunner.prototype.makeLayoutWorker = function(engineSource) {
    if (!this.hasOwnProperty("visit_0")) throw new SCException("Did not previously run loadLayoutEngine()");
    var workerFn = function() {
        var that = this;
        function GetAbsoluteIndex(rel, ref) {
            if (rel == 0) return 0;
            if (ref < that.levelLength) {
                return rel + ref;
            } else {
                return rel + ref;
            }
        }
        onmessage = function(m) {
            try {
                for (var i in m.data.buffers) that[i] = m.data.buffers[i];
                that.visitorNum = m.data.visitorNum;
                that.startOffset = m.data.startOffset;
                that.endOffset = m.data.endOffset;
                that.levelLength = m.data.levelLength;
                that.tree_size = m.data.tree_size;
                var fn = this["visit_" + m.data.visitorNum];
                for (var i = 0; i < m.data.span; i++) {
                    fn(i, m.data.tree_size);
                }
                var transferables = m.data.returnViews.map(function(i) {
                    return that[i].buffer;
                });
                var writes = {};
                m.data.returnViews.forEach(function(fld) {
                    writes[fld] = that[fld];
                });
                pm = that.webkitPostMessage || that.postMessage;
                pm({
                    res: "done",
                    writes: writes
                }, transferables);
            } catch (e) {
                postMessage({
                    err: e.toString()
                });
            }
        };
    };
    var workerStr = engineSource + " ; " + workerFn.toString().slice("function () {".length, -1);
    var workerBlob = window.URL.createObjectURL(new Blob([ workerStr ], {
        type: "text/javascript"
    }));
    return workerBlob;
};

CLRunner.prototype.runKernelRange = function(visitorNum, lvl, nextLvlLen, startIdx, endIdx, cb) {
    var clr = this;
    var t0 = new Date().getTime();
    var buffers = {};
    var any = this.readWriteSets[visitorNum].any;
    function memcpy(dst, dstOffset, src, srcOffset, length) {
        var dstU8 = new Uint8Array(dst, dstOffset, length);
        var srcU8 = new Uint8Array(src, srcOffset, length);
        dstU8.set(srcU8);
    }
    any.forEach(function(i) {
        var numElts = lvl.length + (clr.readWriteSets[visitorNum].reads.child.indexOf(i) != -1 || clr.readWriteSets[visitorNum].writes.child.indexOf(i) != -1 ? nextLvlLen : 0);
        var buff = new clr[i].constructor(numElts);
        buffers[i] = buff;
    });
    any.forEach(function(i) {
        var buff = buffers[i];
        if (clr.readWriteSets[visitorNum].reads.self.indexOf(i) != -1) {
            memcpy(buff.buffer, 0, clr[i].buffer, clr[i].byteOffset + lvl.start_idx * buff.constructor.BYTES_PER_ELEMENT, lvl.length * buff.constructor.BYTES_PER_ELEMENT);
        }
        if (nextLvlLen && clr.readWriteSets[visitorNum].reads.child.indexOf(i) != -1) {
            memcpy(buff.buffer, lvl.length * buff.constructor.BYTES_PER_ELEMENT, clr[i].buffer, clr[i].byteOffset + (lvl.start_idx + lvl.length) * buff.constructor.BYTES_PER_ELEMENT, nextLvlLen * buff.constructor.BYTES_PER_ELEMENT);
        }
    });
    var transferableObjects = [];
    for (var i in buffers) transferableObjects.push(buffers[i].buffer);
    var w = this.freeLayoutWorkers.pop();
    if (!w) throw "no free worker";
    this.busyLayoutWorkers.push(w);
    w.onmessage = function(m) {
        clr.busyLayoutWorkers.splice(clr.busyLayoutWorkers.indexOf(w), 1);
        clr.freeLayoutWorkers.push(w);
        for (var i in m.data.writes) {
            var buff = m.data.writes[i];
            if (clr.readWriteSets[visitorNum].writes.self.indexOf(i) != -1) {
                memcpy(clr[i].buffer, clr[i].byteOffset + lvl.start_idx * clr[i].constructor.BYTES_PER_ELEMENT, buff.buffer, 0, lvl.length * clr[i].constructor.BYTES_PER_ELEMENT);
            }
            if (nextLvlLen && clr.readWriteSets[visitorNum].writes.child.indexOf(i) != -1) {
                memcpy(clr[i].buffer, clr[i].byteOffset + (lvl.start_idx + lvl.length) * clr[i].constructor.BYTES_PER_ELEMENT, buff.buffer, lvl.length * clr[i].constructor.BYTES_PER_ELEMENT, nextLvlLen * clr[i].constructor.BYTES_PER_ELEMENT);
                if (false && clr[i][lvl.start_idx + lvl.length] != buff[lvl.length]) {
                    throw "mismatch!";
                }
            }
        }
        cb(m);
    };
    w.postMessage = w.webkitPostMessage || w.postMessage;
    w.postMessage({
        buffers: buffers,
        visitorNum: visitorNum,
        startOffset: startIdx - lvl.start_idx,
        endOffset: startIdx - lvl.start_idx + (endIdx - startIdx),
        levelLength: lvl.length,
        tree_size: this.tree_size,
        returnViews: this.readWriteSets[visitorNum].returnViews
    }, transferableObjects);
};

CLRunner.prototype.loadLayoutEngine = function(engineSource) {
    eval(engineSource);
    if (this.cfg.webworkerLayout) {
        this.readWriteSets = this.computeReadWriteSets();
        this.layoutWorkerBlob = this.makeLayoutWorker(engineSource);
        console.log("making layout workers", this.cfg.numWorkers);
        this.freeLayoutWorkers = [];
        this.busyLayoutWorkers = [];
        for (var i = 0; i < this.cfg.numWorkers; i++) this.freeLayoutWorkers.push(new Worker(this.layoutWorkerBlob));
    }
    if (!this.cfg.ignoreCL) {
        this.buildKernels();
    }
};

CLRunner.prototype.layout = function() {
    if (!this.readyToLayout()) {
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
    if (!this.readyToLayout()) {
        console.debug("CLRunner asked to run layout, but it is not ready to layout");
        return;
    }
    this.runTraversalsAsync(function() {
        if (!this.cfg.ignoreCL) {
            this.setVBO(this.glr.reallocateVBO(this.getRenderBufferSize()));
        }
        this.runRenderTraversalAsync(cb);
    });
};

CLRunner.prototype.setVBO = function(glVBO) {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    try {
        if (this.clVBO != null) {
            if (typeof this.clVBO.release !== "undefined") {
                this.clVBO.release();
            }
        }
        this.clVBO = this.context.createFromGLBuffer(this.cl.MEM_WRITE_ONLY, glVBO);
    } catch (e) {
        console.error("Error creating a shared OpenCL buffer from a WebGL buffer: " + e.message);
    }
};

CLRunner.prototype.treeSize = function(data) {
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
            var fld = "fld_" + node.class.toLowerCase() + "_child_" + lbl.toLowerCase() + "_leftmost_child";
            if (!this[fld]) {
                console.error("Flattening EXN: input data provides child+fld that was not declared in grammar:", fld);
                throw "could not fld " + fld + " (" + lbl + ")";
            }
            this[fld][absIdx] = leftmostChildIdx + rollCount - absIdx;
            if (c instanceof Array) {
                for (var ci = 0; ci < c.length - 1; ci++) {
                    var childIdx = leftmostChildIdx + rollCount + ci;
                    this.right_siblings[childIdx] = 1;
                }
                if (c.length > 0) {
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

CLRunner.prototype.tokenize = function(str) {
    var idx = this.tokens.indexOf(str);
    if (idx != -1) return idx;
    this.tokens.push(str);
    return this.tokens.length - 1;
};

CLRunner.prototype.ignoredParseFields = {};

CLRunner.prototype.warnedParseFields = {};

CLRunner.prototype.flattenNode = function(res, node, nodeCont, absIdx, level, leftmostChildIdx) {
    this.flattenEdges(res, node, nodeCont, absIdx, level, leftmostChildIdx);
    for (var i in node) {
        if (i == "children") continue; else if (i == "class") {
            var ntype = this.classToToken(node["class"]);
            this.grammartokens_buffer_1[absIdx] = ntype;
            continue;
        } else if (i == "id") {
            var clean = ("" + node[i]).toLowerCase();
            this.id[absIdx] = this.tokenize(clean);
        } else {
            var j = i.toLowerCase();
            if (i.indexOf("_") != -1) {
                if (!this.warnedParseFields[i]) {
                    console.warn("Flattener: stripping '_' from input field", i);
                    this.warnedParseFields[i] = true;
                }
                j = j.replace("_", "");
            }
            var fld = "fld_" + node.class.toLowerCase() + "_" + j;
            if (this[fld]) {
                this[fld][absIdx] = node[i];
                continue;
            }
            fld = "fld_" + this.classToIFace(node["class"]) + "_" + j;
            if (this[fld]) {
                this[fld][absIdx] = node[i];
                continue;
            }
            if (!this.ignoredParseFields[j]) {
                console.warn("Flattener: could not find field ", j, " in schema, tried class and interface ", fld);
                this.ignoredParseFields[j] = true;
            }
        }
    }
};

CLRunner.prototype.flatten = function(data, treeSize) {
    var res = {
        treeSize: treeSize,
        levels: [],
        proxy: this.proxyData
    };
    var level = [ {
        k: "root",
        v: data,
        mult: false,
        parentIdx: -1
    } ];
    var nextLevel = [];
    var absIdx = 0;
    while (level.length != 0) {
        res.levels.push({
            start_idx: absIdx,
            length: level.length
        });
        var leftmostChildIdx = absIdx + level.length;
        for (var i = 0; i < level.length; i++) {
            var nodeCont = level[i];
            var node = nodeCont.v;
            this.flattenNode(res, node, nodeCont, absIdx, level, leftmostChildIdx);
            if (node.children) for (var j in node.children) {
                var c = node.children[j];
                if (c instanceof Array) {
                    for (var k = 0; k < c.length; k++) nextLevel.push({
                        k: k,
                        v: c[k],
                        mult: true,
                        i: k,
                        parentIdx: absIdx
                    });
                    leftmostChildIdx += c.length;
                } else {
                    nextLevel.push({
                        k: j,
                        v: c,
                        mult: false,
                        parentIdx: absIdx
                    });
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

CLRunner.prototype.loadData = function(data, skipProxies) {
    this.tree_size = this.treeSize(data);
    this._gen_allocateHostBuffers(this.tree_size);
    this._gen_allocateHostProxies(this.tree_size);
    var t0 = new Date().getTime();
    var fd = this.flatten(data, this.tree_size);
    var t1 = new Date().getTime();
    console.log("flattening", t1 - t0, "ms");
    this.levels = fd.levels;
    if (!this.cfg.ignoreCL) {
        console.log("tree size", this.tree_size);
        this._gen_allocateClBuffers();
        console.log("cl alloc", this.tree_size);
        this._gen_allocateProxyObjects();
        console.log("proxy alloc");
        var t2 = new Date().getTime();
        this._gen_transferTree();
        var t3 = new Date().getTime();
        console.log("GPU transfer time", t3 - t2, "ms");
    } else {
        if (!skipProxies) this._gen_allocateProxyObjects();
    }
};

CLRunner.prototype.deflate = function(arr, minBlockSize) {
    var res = {
        zeros: {},
        dense: {},
        len: arr.length
    };
    try {
        res.optTypeName = arr.constructor.toString().split(" ")[1].split("(")[0];
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
                if (arr[j] == 0 && j - i >= minBlockSize) break; else denseCount++;
            }
            var sub = [];
            for (var k = 0; k < denseCount; k++) sub.push(arr[i + k]);
            res.dense[i] = sub;
            i += denseCount - 1;
            continue;
        }
    }
    return res;
};

CLRunner.prototype.deflateMT = function(arr, minBlockSize, minFileSize) {
    var deflated = this.deflate(arr, minBlockSize);
    var makeChunk = function() {
        return {
            dense: {},
            optTypeName: deflated.optTypeName
        };
    };
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
        var enqueue = [];
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

CLRunner.prototype.inflateChunk = function(spArr, denseSubArr, offset) {
    if (spArr.dense) {
        for (var lbl in spArr.dense) {
            var start = 1 * lbl;
            var buff = spArr.dense[lbl];
            var len = buff.length;
            for (var i = 0; i < len; i++) {
                denseSubArr[start + i - offset] = buff[i];
            }
        }
    }
    if (spArr.zeros && denseSubArr.constructor == Array) {
        for (var lbl in spArr.zeros) {
            var start = 1 * lbl;
            var end = start + spArr.zeros[lbl];
            for (var i = start; i < end; i++) denseSubArr[i - offset] = 0;
        }
    }
};

CLRunner.prototype.allocArray = function(spArr, nativeConstructors) {
    var alloc = Array;
    if (spArr.optTypeName && nativeConstructors && nativeConstructors[spArr.optTypeName]) {
        alloc = nativeConstructors[spArr.optTypeName];
    }
    return new alloc(spArr.len);
};

CLRunner.prototype.inflate = function(spArr, nativeConstructors) {
    var res = this.allocArray(spArr, nativeConstructors);
    this.inflateChunk(spArr, res, 0);
    return res;
};

CLRunner.prototype.inflateMt = function(file, data, nativeConstructors, maxNumWorkers, intoGPU, intoCPU, cb) {
    maxNumWorkers = maxNumWorkers ? maxNumWorkers : 4;
    var bufferNames = data.bufferLabels;
    for (var i in bufferNames) {
        var lbl = bufferNames[i];
        this[lbl] = this.allocArray(data.buffersInfo[lbl], nativeConstructors);
    }
    var q = [];
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
                                throw "unknown arr type" + spArr.optTypeName;
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
                that.queue.enqueueWriteBuffer(that["cl_" + chunk.nfo.bufferLabel], true, chunk.start * chunk.dense.BYTES_PER_ELEMENT, chunk.dense.byteLength, chunk.dense);
            }
            if (intoCPU) {
                var dense = that[chunk.nfo.bufferLabel];
                dense.set(chunk.dense, chunk.start);
            }
            var endTime = new Date().getTime();
            memCopyTime += endTime - t0;
            ready++;
            if (ready == data.summary.length) {
                console.log("memcpy time (" + (intoGPU ? "GPU" : "no GPU") + "," + (intoCPU ? "CPU" : "no CPU") + ")", memCopyTime, "ms");
                console.log("messagePassTime time (may include memcpy time)", messagePassTime, "ms");
                console.log(parsers.length, "all worker launch-to-reduce time", endTime - launchTime, "ms");
                cb(null, "done");
            }
        }));
    }
    for (var p = 0; p < parsers.length; p++) parsers[p].spawn();
};

CLRunner.prototype.getArrayConstructors = function() {
    var cNames = [ "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Float32Array", "Float64Array" ];
    var res = {};
    for (var i = 0; i < cNames.length; i++) if (window[cNames[i]]) res[cNames[i]] = window[cNames[i]];
    return res;
};

CLRunner.prototype.loadDataFlatFinish = function(doTransfer) {
    var t0 = new Date().getTime();
    this._gen_allocateHostProxies(this.tree_size);
    if (doTransfer) this._gen_allocateClBuffers();
    this._gen_allocateProxyObjects();
    var t1 = new Date().getTime();
    if (doTransfer) this._gen_transferTree();
    console.log("overhead:", new Date().getTime() - t0, "ms (gpu transfer sub-time:", new Date().getTime() - t1, "ms)");
};

CLRunner.prototype.loadDataFlat = function(data) {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    function getBufferNames(obj) {
        var res = [];
        for (var i in obj) if (i.indexOf("_buffer_1") != -1) res.push(i);
        return res;
    }
    var bufferNames = getBufferNames(data);
    if (bufferNames.length == 0) throw new SCException("received no buffers");
    if (!data.tree_size) throw new SCException("no tree size");
    if (!data.levels) throw new SCException("no tree level info");
    if (!data.tokens) throw new SCException("no tree token info");
    this.tree_size = data.tree_size;
    this.levels = data.levels;
    this.tokens = data.tokens;
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
    this.inflateMt(digestFile, data, constructors, optNumMaxWorkers, intoGPU, intoCPU, function() {
        that.loadDataFlatFinish(false);
        cb();
    });
};

CLRunner.prototype.buildKernels = function() {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    var kernels = "";
    for (var i = 0; i < this.kernelHeaders.length; i++) {
        kernels += this.kernelHeaders[i];
    }
    for (var i = 0; i < this.kernelSource.length; i++) {
        kernels += this.kernelSource[i];
    }
    this.program = this.context.createProgram(kernels);
    try {
        this.program.build(this.devices);
    } catch (e) {
        console.error("Error loading WebCL kernels: " + e.message);
        console.error("Inputs:", {
            headers: this.kernelHeaders,
            source: this.kernelSource
        });
        console.error("Build status: " + this.program.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
        window.clSource = kernels;
        console.error("Source:\n" + kernels);
        return null;
    }
    this._gen_getKernels();
};

CLRunner.prototype.runTraversals = function() {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    try {
        this._gen_runTraversals();
    } catch (e) {
        console.error("Error running OpenCL tree traversals: " + e.message);
    }
};

CLRunner.prototype.runRenderTraversal = function() {
    var renderTraversal = "_gen_run_visit_0";
    for (var i = 1; this["_gen_run_visit_" + i]; i++) {
        renderTraversal = "_gen_run_visit_" + i;
    }
    if (this.cfg.ignoreCL) {
        this[renderTraversal]();
    } else {
        try {
            this[renderTraversal](this.clVBO);
            this.queue.finish();
        } catch (e) {
            console.error("Error running OpenCL render traversal: " + e.message);
            console.error(e);
        }
    }
};

CLRunner.prototype.runRenderTraversalAsync = function(cb) {
    var renderTraversal = "_gen_run_visit_0";
    for (var i = 1; this["_gen_run_visit_" + i]; i++) {
        renderTraversal = "_gen_run_visit_" + i;
    }
    if (this.cfg.ignoreCL) {
        this[renderTraversal](null, cb);
    } else {
        try {
            this[renderTraversal](this.clVBO);
            this.queue.finish();
            cb();
        } catch (e) {
            console.error("Error running OpenCL render traversal: " + e.message);
            console.error(e);
        }
    }
};

CLRunner.prototype.traverseAsync = function(direction, kernel, cb) {
    if (direction != "topDown" && direction != "bottomUp") throw "unknown direction";
    var s0 = new Date().getTime();
    var finish = function() {
        console.log("multicore", direction, new Date().getTime() - s0, "ms");
        cb();
    };
    if (this.cfg.ignoreCL && this.cfg.webworkerLayout) {
        var clr = this;
        var getVisitNum = function(fn) {
            for (var num = 0; true; num++) if (clr["visit_" + num] == fn) return num;
        };
        var seqLvl = function(lvl) {
            var startIdx = lvl.start_idx;
            var endIdx = startIdx + lvl.length;
            for (var idx = startIdx; idx < endIdx; idx++) {
                kernel.call(clr, idx, clr.tree_size, clr.float_buffer_1, clr.int_buffer_1, clr.grammartokens_buffer_1, clr.nodeindex_buffer_1);
            }
        };
        var visitNum = getVisitNum(kernel);
        if (this.hasOwnProperty("visit_" + (visitNum + 1))) {
            function runLevel(lvl) {
                var chunksReady = 0;
                var workerDone = function() {
                    if (++chunksReady == chunks) {
                        var more = direction == "topDown" ? lvl + 1 < clr.levels.length : lvl - 1 >= 0;
                        if (more) {
                            chunksReady = 0;
                            runLevel(lvl + (direction == "topDown" ? 1 : -1));
                        } else finish();
                    }
                };
                if (clr.levels[lvl].length > clr.cfg.minParallelLayoutLevelLength) {
                    var startIdx = clr.levels[lvl].start_idx;
                    var endIdx = startIdx + clr.levels[lvl].length;
                    var chunk = Math.round(clr.levels[lvl].length / clr.cfg.numWorkers) + 1;
                    var chunks = 0;
                    for (var next = startIdx; next < endIdx; next += chunk) chunks++;
                    chunksReady = 0;
                    for (var next = startIdx; next < endIdx; next += chunk) {
                        clr.runKernelRange(visitNum, clr.levels[lvl], clr.levels.length > lvl + 1 ? clr.levels[lvl + 1].length : 0, next, Math.min(endIdx, next + chunk), workerDone);
                    }
                } else {
                    seqLvl(clr.levels[lvl]);
                    chunks = 1;
                    workerDone();
                }
            }
            runLevel(direction == "topDown" ? 0 : this.levels.length - 1);
        } else {
            if (direction == "topDown") {
                for (var i = 0; i < this.levels.length; i++) seqLvl(this.levels[i]);
            } else {
                for (var i = this.levels.length - 1; i >= 0; i--) seqLvl(this.levels[i]);
            }
            finish();
        }
    } else {
        if (direction == "topDown") this.topDownTraversal(kernel); else this.bottomUpTraversal(kernel);
        finish();
    }
};

CLRunner.prototype.topDownTraversalAsync = function(kernel, cb) {
    this.traverseAsync("topDown", kernel, cb);
};

CLRunner.prototype.bottomUpTraversalAsync = function(kernel, cb) {
    this.traverseAsync("bottomUp", kernel, cb);
};

CLRunner.prototype.topDownTraversal = function(kernel) {
    var s0 = new Date().getTime();
    if (this.cfg.ignoreCL && this.cfg.webworkerLayout) {
        throw "Multicore traversals require async invocation";
    } else if (this.cfg.ignoreCL) {
        for (var i = 0; i < this.levels.length; i++) {
            var startIdx = this.levels[i].start_idx;
            var endIdx = startIdx + this.levels[i].length;
            for (var idx = startIdx; idx < endIdx; idx++) {
                kernel.call(this, idx, this.tree_size, this.float_buffer_1, this.int_buffer_1, this.grammartokens_buffer_1, this.nodeindex_buffer_1);
            }
        }
    } else {
        var types = WebCLKernelArgumentTypes;
        for (var i = 0; i < this.levels.length; i++) {
            kernel.setArg(0, this.levels[i]["start_idx"], types.UINT);
            var globalWorkSize = new Int32Array(1);
            globalWorkSize[0] = this.levels[i]["length"];
            this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
            this.queue.finish();
        }
    }
    console.log(this.cfg.ignoreCL ? "CPU" : "GPU", "topDown pass", new Date().getTime() - s0, "ms");
};

CLRunner.prototype.bottomUpTraversal = function(kernel) {
    var s0 = new Date().getTime();
    if (this.cfg.ignoreCL) {
        for (var i = this.levels.length - 1; i >= 0; i--) {
            var startIdx = this.levels[i].start_idx;
            var endIdx = startIdx + this.levels[i].length;
            for (var idx = startIdx; idx < endIdx; idx++) {
                kernel.call(this, idx, this.tree_size, this.float_buffer_1, this.int_buffer_1, this.grammartokens_buffer_1, this.nodeindex_buffer_1);
            }
        }
    } else {
        var types = WebCLKernelArgumentTypes;
        for (var i = this.levels.length - 1; i >= 0; i--) {
            kernel.setArg(0, this.levels[i]["start_idx"], types.UINT);
            var globalWorkSize = new Int32Array(1);
            globalWorkSize[0] = this.levels[i]["length"];
            this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
            this.queue.finish();
        }
    }
    console.log(this.cfg.ignoreCL ? "CPU" : "GPU", "bottomUp pass", new Date().getTime() - s0, "ms");
};

CLRunner.prototype.selectorEngine = function selectorsCL(sels, IdToks) {
    var clr = this;
    var PredTokens = {
        "*": 0
    };
    var OpTokens = {
        " ": 0,
        ">": 1,
        "+": 2
    };
    if (!IdToks) IdToks = [];
    if (IdToks.indexOf("") == -1) IdToks.push("");
    var StarTok = PredTokens["*"];
    var NoIdTok = IdToks.indexOf("");
    function parsePredicate(predStr) {
        var hashIdx = predStr.indexOf("#");
        return {
            tag: hashIdx == -1 ? predStr : hashIdx > 0 ? predStr.substring(0, hashIdx) : "*",
            id: hashIdx == -1 ? "" : predStr.substring(1 + hashIdx)
        };
    }
    function parsePredicates(predsStr) {
        var res = [];
        var selsRaw = predsStr.split(",");
        for (var si = 0; si < selsRaw.length; si++) {
            var sel = [];
            var sibs = selsRaw[si].trim().split("+");
            for (var sibi = 0; sibi < sibs.length; sibi++) {
                if (sibi > 0) sel.push({
                    combinator: "+"
                });
                var pars = sibs[sibi].trim().split(">");
                for (var pi = 0; pi < pars.length; pi++) {
                    if (pi > 0) sel.push({
                        combinator: ">"
                    });
                    var des = pars[pi].trim().split(" ");
                    for (var di = 0; di < des.length; di++) {
                        if (di > 0) sel.push({
                            combinator: " "
                        });
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
        if (valStr.length == 0) throw "Bad CSS selector property value (it was empty): " + valStr;
        if (valStr[0] == "#") {
            try {
                var code = valStr.slice(1);
                if (code.length == 3) {
                    code = code[0] + code[0] + code[1] + code[1] + code[2] + code[2];
                }
                if (code.length == 6) {
                    code = "FF" + code;
                }
                return parseInt(code, 16);
            } catch (e) {
                throw "Bad hex color conversion on CSS property value " + valStr;
            }
        } else if (valStr.slice(0, 4) == "rgb(" && valStr.slice(-1) == ")") {
            try {
                var code = valStr.slice(4);
                code = code.slice(0, code.length - 1);
                colors = code.split(",").map(function(s) {
                    return parseInt(s.trim());
                });
                return colors[0] * 256 * 256 + colors[1] * 256 + colors[2];
            } catch (e) {
                throw "Bad RGB color conversion on CSS property value " + valStr;
            }
        } else {
            try {
                var val = parseFloat(valStrRaw);
                if (val != Math.round(val)) val = val + "f";
                return val;
            } catch (e) {
                throw "Failed parse of CSS property value (believed to be a number): " + valStr;
            }
        }
    }
    function parseProperties(propsStr) {
        var res = {};
        var props = collapse(propsStr, /( ;)|(; )|(;;)/g, ";").trim().split(";");
        for (var i = 0; i < props.length; i++) {
            if (props[i] == "") continue;
            var pair = props[i].trim().split(":");
            var lhs = pair[0].trim().toLowerCase();
            if (!window.superconductor.clr[lhs]) throw "CSS property does not exist: " + pair[0];
            res[lhs] = parseVal(pair[1]);
        }
        return res;
    }
    function collapse(str, before, after) {
        var raw = str.replace(before, after);
        var rawOld;
        do {
            rawOld = raw;
            raw = raw.replace(before, after);
        } while (rawOld != raw);
        return raw;
    }
    function parse(css) {
        var res = [];
        var selsRaw = collapse(css, /  |\t|\n|\r/g, " ").split("}");
        for (var si = 0; si < selsRaw.length; si++) {
            if (selsRaw[si].indexOf("{") == -1) continue;
            var pair = selsRaw[si].split("{");
            var selRaw = pair[0];
            var propsRaw = pair[1];
            res.push({
                predicates: parsePredicates(selRaw),
                properties: parseProperties(propsRaw)
            });
        }
        return res;
    }
    function tokenizePred(pred) {
        if (pred.tag) {
            if (pred.tag == "*") pred.tag = StarTok; else pred.tag = clr.classToToken(pred.tag.toUpperCase());
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
            op.combinator = OpTokens[" "];
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
                for (var t = 1; t < pred.length; t += 2) {
                    tokenizeOp(pred[t]);
                    tokenizePred(pred[t + 1]);
                }
            }
        }
        return selsTok;
    }
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
        }
        return a * Math.pow(2, 30) + b * Math.pow(2, 24) + c * Math.pow(2, 12) + line;
    }
    function addSel(hash, sel, pred, lbl, hit) {
        var lookup = pred[pred.length - 1][lbl];
        var arr = hash[lookup];
        if (!arr) {
            arr = [];
            hash[lookup] = arr;
        }
        arr.push(hit);
    }
    function hash(selsTok) {
        var idHash = {};
        var tagHash = {};
        var star = [];
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
                    addSel(idHash, sel, pred, "id", hit);
                } else if (lastP.tag != StarTok) {
                    addSel(tagHash, sel, pred, "tag", hit);
                } else {
                    star.push(hit);
                }
            }
        }
        var sorter = function(a, b) {
            return a.specificity - b.specificity;
        };
        for (var i in idHash) idHash[i].sort(sorter);
        for (var i in tagHash) tagHash[i].sort(sorter);
        return {
            idHash: idHash,
            tagHash: tagHash,
            star: star
        };
    }
    function makeMatcher(hashes) {
        var preParams = "unsigned int tree_size, __global float* float_buffer_1, __global int* int_buffer_1, __global GrammarTokens* grammartokens_buffer_1, __global NodeIndex* nodeindex_buffer_1, __global int* selectors_buffer";
        var preArgs = "tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, selectors_buffer";
        var makeOuterLoopHelpers = function() {
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
            var makeGetNumSel = function(hashName, hash) {
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
            res += makeGetNumSel("Id", hashes.idHash);
            res += makeGetNumSel("Tag", hashes.tagHash);
            var makeGetSpecSels = function(sels) {
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
            var makeGetSpec = function(hashName, hash) {
                var res = "";
                res += "unsigned int getSpec" + hashName + "(unsigned int token, unsigned int offset) {\n";
                res += "  switch (token) {\n";
                for (var i in hash) {
                    res += "    case " + i + ":\n";
                    var sels = hash[i];
                    if (sels.length == 0) throw "Internal selector compiler error: expected to find sels";
                    res += makeGetSpecSels(sels);
                    res += "      break;\n";
                }
                res += "    default: //should be unreachable\n";
                res += "      return 0;\n";
                res += "  }\n";
                res += "}\n";
                return res;
            };
            res += makeGetSpec("Id", hashes.idHash);
            res += makeGetSpec("Tag", hashes.tagHash);
            res += "unsigned int getSpecStar(unsigned int offset) {\n";
            res += makeGetSpecSels(hashes.star);
            res += "}\n";
            var makeMatchSelector_ijSels = function(hashName, selsName, sels) {
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
                        for (var p = sel.pred.length - 2; p >= 1; p -= 2) {
                            var op = sel.pred[p];
                            var pred = sel.pred[p - 1];
                            switch (op.combinator) {
                              case OpTokens[" "]:
                                res += "  //' '\n";
                                res += "  matched = 0;\n";
                                res += "  while (!matched) {\n";
                                res += "    if (nextNodeIdx == 0) return 0;\n";
                                res += "    nextNodeIdx = parent(nextNodeIdx);\n";
                                res += "    matched = matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx);\n";
                                res += "  }\n";
                                res += "  nextSib = 0;\n";
                                break;

                              case OpTokens[">"]:
                                res += "  //'>'\n";
                                res += "  if (nextNodeIdx == 0) return 0;\n";
                                res += "  nextNodeIdx = parent(nextNodeIdx);\n";
                                res += "  if (!matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx)) return 0;\n";
                                res += "  nextSib = 0;\n";
                                break;

                              case OpTokens["+"]:
                                res += "  //'+'\n";
                                res += "  if (left_siblings(nextNodeIdx - nextSib) == 0) return 0;\n";
                                res += "  nextSib++;\n";
                                res += "  if (!matchPredicate(" + preArgs + ", " + pred.tag + ", " + pred.id + ", nextNodeIdx - nextSib)) return 0;\n";
                                break;

                              default:
                                console.error("unknown combinator", op.combinator);
                                throw "err";
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
            var makeMatchSelector_ij = function(hashName, hash) {
                var res = "";
                for (var i in hash) {
                    var sels = hash[i];
                    res += makeMatchSelector_ijSels(hashName, i, sels);
                }
                return res;
            };
            res += makeMatchSelector_ij("Id", hashes.idHash);
            res += makeMatchSelector_ij("Tag", hashes.tagHash);
            res += makeMatchSelector_ijSels("Star", "", hashes.star);
            var makeMatchSelectorSels = function(hashName, selsName, sels) {
                var res = "";
                res += "      switch (offset) {\n";
                for (var j = 0; j < sels.length; j++) {
                    res += "        case " + j + ":\n";
                    res += "          if (matchSelector" + hashName + "_" + selsName + "_" + j + "(" + preArgs + ", nodeindex)) {\n";
                    res += "            return applySelector" + hashName + "_" + selsName + "_" + j + "(" + preArgs + ", nodeindex);\n";
                    res += "          } else { return 0; }\n";
                    res += "          break;\n";
                }
                res += "        default: //should be unreachable\n";
                res += "          return 0;\n";
                res += "      }\n";
                return res;
            };
            var makeMatchSelector = function(hashName, hash) {
                var res = "";
                res += "unsigned int matchSelector" + hashName + "(" + preParams + ", unsigned int token, unsigned int offset, unsigned int nodeindex) {\n";
                res += "  switch (token) {\n";
                for (var i in hash) {
                    res += "    case " + i + ":\n";
                    var sels = hash[i];
                    if (sels.length == 0) throw "Internal selector compiler error: expected to find sels";
                    res += makeMatchSelectorSels(hashName, i, sels);
                    res += "      break;\n";
                }
                res += "    default: //should be unreachable\n";
                res += "      return 0;\n";
                res += "  }\n";
                res += "}\n";
                return res;
            };
            res += makeMatchSelector("Id", hashes.idHash);
            res += makeMatchSelector("Tag", hashes.tagHash);
            res += "unsigned int matchSelectorStar(" + preParams + ", unsigned int offset, unsigned int nodeindex) {\n";
            res += makeMatchSelectorSels("Star", "", hashes.star);
            res += "}\n";
            return res;
        };
        var matchNodeGPU = function(indexName, indent) {
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
            return src.replace(/\n/g, "\n" + indent);
        };
        return function(kernelName) {
            var src = "";
            src += makeOuterLoopHelpers();
            src += "__kernel void " + kernelName + " (unsigned int start_idx, unsigned int tree_size, __global float* float_buffer_1, __global int* int_buffer_1, __global GrammarTokens* grammartokens_buffer_1, __global NodeIndex* nodeindex_buffer_1, __global int* selectors_buffer) {\n";
            src += "  unsigned int nodeindex = get_global_id(0) + start_idx;\n";
            src += matchNodeGPU("nodeindex");
            src += "}";
            return src;
        };
    }
    console.log("loading selector engine (GPU)");
    var ast = parse(sels);
    var selsTok = tokenize(ast);
    var hashes = hash(selsTok);
    var res = {
        kernelMaker: makeMatcher(hashes),
        ir: {
            ast: ast,
            selsTok: selsTok,
            hashes: hashes
        }
    };
    return res;
};

CLRunner.prototype.setSelectors = function(selectors) {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    var startT = new Date().getTime();
    var srcName = "seEngine" + Math.round(Math.random() * 1e6);
    var src = this.selectorEngine(selectors, this.tokens).kernelMaker(srcName);
    var headers = "";
    headers += "typedef unsigned int GrammarTokens;\n";
    headers += "typedef unsigned int NodeIndex;\n";
    headers += this.offsets;
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
        throw {
            error: e
        };
    }
    console.log("Selector compile time:", new Date().getTime() - startT, "ms");
};

CLRunner.prototype.runSelectors = function() {
    var startT = new Date().getTime();
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    var kernel = this.selKernel;
    if (!kernel) throw "no selectors; call setSelectors";
    this._gen_setKernelArguments(kernel);
    if (!this.cl_selectors_buffer) {
        this.selectors_buffer = new Int32Array(this.grammartokens_buffer_1.length);
        this.cl_selectors_buffer = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.selectors_buffer.byteLength);
    }
    kernel.setArg(6, this.cl_selectors_buffer);
    var globalWorkSize = new Int32Array(1);
    globalWorkSize[0] = this.tree_size;
    var runStartT = new Date().getTime();
    try {
        this.queue.enqueueNDRangeKernel(kernel, null, globalWorkSize, null);
        this.queue.finish();
    } catch (e) {
        console.error("Error running WebCL selectors: " + e.message);
        console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
        console.error("Build log: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
        throw {
            error: e
        };
    }
    try {
        this.queue.enqueueReadBuffer(this.cl_selectors_buffer, true, 0, this.selectors_buffer.byteLength, this.selectors_buffer);
        var count = 0;
        for (var i = 0; i < this.selectors_buffer.length; i++) count += this.selectors_buffer[i];
        console.log("applied", count, "instances of CSS properties");
    } catch (e) {
        console.error("Error checking run of WebCL selectors: " + e.message);
        console.error("Build status: " + this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_STATUS));
        console.error("Build log: ", this.programSelectors.getBuildInfo(this.devices[0], this.cl.PROGRAM_BUILD_LOG));
        throw {
            error: e
        };
    }
    var endT = new Date().getTime();
    console.log("Selector create instance time:", runStartT - startT, "ms, Selector compute time", endT - runStartT, "ms");
};

CLRunner.prototype.setAndRunSelectors = function(selectors) {
    if (this.cfg.ignoreCL) throw new SCException("Function only for CL-enabled use");
    var startT = new Date().getTime();
    this.setSelectors(selectors);
    this.runSelectors();
    console.log("Total selectors time", new Date().getTime() - startT, "ms");
};

try {
    exports.CLRunner = CLRunner;
} catch (e) {}

CLRunner.prototype.kernelHeaders = [ "// This file contains defines and functions used by all Superconductor generated OpenCL kernel code.\n// It should always be preprended to any generated kernel source before compiling the CL kernels.`\n\n\n// The type we store the tokens enum as\ntypedef int GrammarTokens;\n\n// The type of a relative-offset index in the tree\ntypedef int NodeIndex;\n\n// VBO HACK\n#define glBufferMacro(index) glBuffer\n\n\n#define PI() M_PI_F\n#define floatToInt(v) ((int)(v))\n\n\n// WARNING: Need to have previously declared the following before using this macro:\n// int step = 0;\n// unsigned int prev_child_idx = NULL;\n\n// Loop over all the children of this node contained in child_field_name\n// this_node_index: the index of the parent node\n// child_field_name: name of the field holding the leftmost child we want to loop over\n//	e.g., top_child_child_leftmost_child\n// step: name of the variable this macro creates to hold the current loop count\n#define SFORLOOPALIAS_OCL(parent_node_index, child_field_name, step) \\\n	do { \\\n	step = 0; \\\n	prev_child_idx = 0; \\\n	for(unsigned int current_node = GetAbsoluteIndex(child_field_name(parent_node_index), parent_node_index); \\\n		current_node != 0; current_node = GetAbsoluteIndex(right_siblings(current_node), current_node)) { \\\n		step++;\n\n#define SFORLOOPALIAS_OCL_END() prev_child_idx = current_node; \\\n	} } while(false);\n\n#define PREV_OCL() prev_child_idx\n\n#define STEP() step\ntypedef struct {\n	float4 vertex;\n	float4 color;\n} VertexAndColor;\n\n\n///////////////////////////////////////////////////////////////////////////////\n// Drawing function declarations\n///////////////////////////////////////////////////////////////////////////////\n\n\n// All angles are in degrees unless otherwise noted\n\nint ArcZ_size(float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb);\nint ArcZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb);\n\nint Arc_size(float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb);\nint Arc_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb);\n\nint CircleZ_size(float x, float y, float z, float radius, int colorRgb);\nint CircleZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, int colorRgb);\n\nint Circle_size(float x, float y, float radius, int colorRgb);\nint Circle_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, int colorRgb);\n\nint Rectangle_size(float x, float y, float w, float h, int colorRgb);\nint Rectangle_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb);\n\nint RectangleOutline_size(float x, float y, float w, float h, int colorRgb);\nint RectangleOutline_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb);\n\nint RectangleZ_size(float x, float y, float w, float h, float z, int rgb_col);\nint RectangleZ_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \n	float x, float y, float w, float h, float z, int rgb_col);\n\nint Line3D_size(float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color);\nint Line3D_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \n  float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color);\n\nint Line_size(float x1, float y1, float x2, float y2, float thickness, int rgb_color);\nint Line_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \n  float x1, float y1, float x2, float y2, float thickness, int rgb_color);\n\n///////////////////////////////////////////////////////////////////////////////\n// Constants which control the generated vertices\n///////////////////////////////////////////////////////////////////////////////\n\n\n// Z value of all coordinates -- constant since we're drawing 2D.\n#define Z_VALUE 0.0f\n// W value of all coordinates -- found by trial and error because WTF.\n#define W_VALUE 10000.0f\n// Max number of vertices to use when drawing a circle.\n#define NUM_VERT_CIRCLE 50\n// Max number of vertices to use when drawing a circle.\n#define NUM_VERT_ARC 20\n// The width when drawing outline-style objects\n#define BORDER_WIDTH 200\n\n\n///////////////////////////////////////////////////////////////////////////////\n// Helper function declarations\n///////////////////////////////////////////////////////////////////////////////\n\n\n// Converts a point on a circle to x & y coordinates.\n// The point is given as radians from the '3' position, the radius, and x/y \n// coords of the center of the circle.\nfloat2 AngleToCoord(float angle, float radius, int x, int y);\n\n// Radians <-> degrees\nfloat DegToRad(int degrees);\nfloat DegToRadf(float degrees);\n\n// Extract OpenGL-style floating point color component from a 32-bit int\nfloat getAlphaComponent8B(int rgb_color);\nfloat getRedComponent8B(int rgb_color);\nfloat getGreenComponent8B(int rgb_color);\nfloat getBlueComponent8B(int rgb_color);\n\n// Same as above, but leave the color as a 8-bit wide int instead of converting\n// to a float.\nint igetAlphaComponent8B(int rgb_color);\nint igetRedComponent8B(int rgb_color);\nint igetGreenComponent8B(int rgb_color);\nint igetBlueComponent8B(int rgb_color);\n\n// Linear interpolation of two colors\n// Blends start_color with end_color according to k (0 = all start color, \n// 1023 = all end color).\nint lerpColor(int start_color, int end_color, float k);\n\n\n// Pack rgb with an alpha of 255\nint rgb (int r, int g, int b);\n\n// Pack rgba into argb format\nint rgba (int r, int g, int b, int a);\n\n// Obtain the absolute index of a node given a starting node and relative offset\n// (this is the format indices are stored in Superconductor.)\nint GetAbsoluteIndex(unsigned int relative_index, unsigned int reference_node);\n\n// Wrapper for atan2 to placate some OpenCL compilers\nfloat atan2_wrap(float x, float y);\n\n\n///////////////////////////////////////////////////////////////////////////////\n// Drawing function definitions\n///////////////////////////////////////////////////////////////////////////////\n\n\nint Arc_size(float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb) {\n	return ArcZ_size(x, y, Z_VALUE, radius, alpha, sectorAng, w, colorRgb);\n}\n\nint ArcZ_size(float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb) {\n	if(sectorAng >= 360) {\n		return CircleZ_size(x, y, z, radius, colorRgb);\n	}\n\n	// Don't render tiny arcs\n	if(w < 0.001f || sectorAng < 0.02f) {\n		return 0;\n	}\n	\n	int reqSize = 0;\n\n	// If it's really big arc, give it more vertices.\n	if(sectorAng >= 180) {\n		reqSize = NUM_VERT_ARC * 6;\n	} else if(sectorAng >= 90) {\n		reqSize = NUM_VERT_ARC * 4;\n	} else if(sectorAng >= 45) {\n		reqSize = NUM_VERT_ARC * 3;\n	} else if(sectorAng >= 25) {\n		reqSize = NUM_VERT_ARC * 2;\n	} else {\n		reqSize = NUM_VERT_ARC;\n	}\n	\n	if(reqSize < 6) {\n		return 6;\n	} else {\n		return reqSize;\n	}\n}\n\nint Arc_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb) {\n	return ArcZ_draw(gl_buffer, buf_index, num_vertices, x, y, Z_VALUE, radius, alpha, sectorAng, w, colorRgb);\n}\n\nint ArcZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb) {\n	if(num_vertices < 6) {\n		return 1;\n	}\n	\n	// If this is really a circle and not an arc, we can draw this more\n	// efficently with another algorithm, so hand off generation to a function\n	// which implements that.\n	if(sectorAng >= 360) {\n		return CircleZ_draw(gl_buffer, buf_index, num_vertices, x, y, z, radius, colorRgb);\n	}\n\n	float4 gl_color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));\n\n	float start_ang = DegToRadf(alpha) - DegToRadf(sectorAng / 2.0f);\n	float end_ang = DegToRadf(alpha) + DegToRadf(sectorAng / 2.0f);\n	int inner_radius = radius - w;\n\n	// We need to reserve two vertices for our degenerate triangles\n	num_vertices -= 2;\n\n	// We want to end make sure to actually end at end_ang. Since the angle\n	// being drawn is computed as start_ang + i * angle_increment, where i is\n	// 0-based, we really want to end at start_ang + (i + 1) * angle_increment.\n	// Since i = num_vertices / 2, calculate angle_increment using\n	// num_vertices - 2.\n	float angle_increment = fabs(end_ang - start_ang) / ((num_vertices - 2) / 2);\n\n	VertexAndColor inner_vertex;\n	inner_vertex.color = gl_color;\n	inner_vertex.vertex.zw = (float2)(z, W_VALUE);\n	VertexAndColor outer_vertex;\n	outer_vertex.color = gl_color;\n	outer_vertex.vertex.zw = (float2)(z, W_VALUE);\n\n	for(int i = 0; i < (num_vertices / 2); i++) {\n		float current_angle = start_ang + (i * angle_increment);\n\n		inner_vertex.vertex.xy = AngleToCoord(current_angle, inner_radius, x, y);\n		outer_vertex.vertex.xy = AngleToCoord(current_angle, radius, x, y);\n\n		// Duplicate the first vertex\n		if(i == 0) {\n			gl_buffer[buf_index] = outer_vertex;\n			buf_index++;\n		}\n\n		gl_buffer[buf_index] = outer_vertex;\n		buf_index++;\n\n		gl_buffer[buf_index] = inner_vertex;\n		buf_index++;\n	}\n\n	// Duplicate the last vertex\n	gl_buffer[buf_index] = inner_vertex;\n\n	// If we have an odd num_vertices, duplicate the last vertex twice to noop it\n	if(num_vertices % 2 == 1) {\n		buf_index++;\n		gl_buffer[buf_index] = inner_vertex;\n	}\n\n	return 1;\n}\n\n\nint Circle_size(float x, float y, float radius, int colorRgb) {\n	return NUM_VERT_CIRCLE;\n}\n\nint CircleZ_size(float x, float y, float z, float radius, int colorRgb) {\n	return NUM_VERT_CIRCLE;\n}\n\nint Circle_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, int colorRgb) {\n	return CircleZ_draw(gl_buffer, buf_index, num_vertices, x, y, Z_VALUE, radius, colorRgb);\n}\n\n\nint CircleZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, int colorRgb) {\n	float4 gl_color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));\n	\n	// Take one off to reserve an extra vertex for the degenerate triangle\n	num_vertices -= 1;\n\n	// Algorithm:\n	//	Place num_vertices points evenly spaced around the perimeter of the\n	//	the circle, each labelled with an increasing numeric label (clockwise/\n	//	counter-clockwise doesn't matter.) Let 'a' be the first vertex, 0, and 'b'\n	//	'b' be the last vertex.\n	//	Place the vertices into the buffer as follows:\n	//		a, a+1, b, a+2, b-1,...,a+n, b-m\n	//		while b-m > a+n\n	//\n	//	Robust for both odd and even num_vertices. Only requirement is\n	//	num vertices >= 3 so we can make at least one triangle\n	VertexAndColor vert;\n	vert.color = gl_color;\n	vert.vertex.zw =  (float2)(z, W_VALUE);\n\n	const float angle_increment = (2* M_PI_F) / num_vertices;\n\n	// Place the first vertex at angle 0\n	vert.vertex.xy = AngleToCoord(0.0f, radius, x, y);\n	gl_buffer[buf_index] = vert;\n	buf_index++;\n\n	// a_index starts at 1 because we just wrote one above\n	uchar a_index = 1;\n	// Use num_vertices -1, because num_vertices is 1-based and the index should\n	// be 0-based.\n	uchar b_index = num_vertices - 1;\n\n	// There's probably room for optimization here...\n	while(b_index >= a_index) {\n		// Place a_index\n		vert.vertex.xy = AngleToCoord(a_index * angle_increment, radius, x, y);\n		gl_buffer[buf_index] = vert;\n		a_index++;\n		buf_index++;\n\n		// Place b_index\n		// ...but first, make sure the loop invariant still holds since we're\n		// writing two vertices at a time.\n		if(b_index >= a_index) {\n			vert.vertex.xy = AngleToCoord(b_index * angle_increment, radius, x, y);\n			gl_buffer[buf_index] = vert;\n			b_index--;\n			buf_index++;\n		}\n	}\n\n	// Finally, duplicate the last vertex\n	gl_buffer[buf_index] = vert;\n\n	return 1;\n}\n\n\nint Rectangle_size(float x, float y, float w, float h, int colorRgb) {\n	return 6;\n}\n\n\nint Rectangle_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb) {\n	// 6 is the minimum # of vertices to draw a rect\n\n	VertexAndColor vert;\n	vert.color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));\n	vert.vertex.zw = (float2)(Z_VALUE, W_VALUE);\n\n	// Draw lower-left corner\n	vert.vertex.xy = (float2)(x , y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n	// Duplicate it to create a degenerate triangle\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw upper-left corner\n	vert.vertex.xy = (float2)(x, y + h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw lower-right corner\n	vert.vertex.xy = (float2)(x + w, y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw upper-right corner\n	vert.vertex.xy = (float2)(x + w, y + h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n	// Duplicate the last vertex\n	gl_buffer[buffer_offset] = vert;\n\n	// If there's remaining vertex space, tough shit, that's an error.\n\n	return 1;\n}\n\nint RectangleZ_size(float x, float y, float w, float h, float z, int rgb_color) { return 6; }\nint RectangleZ_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \nfloat x, float y, float w, float h, float z, int rgb_color) {\n	// 6 is the minimum # of vertices to draw a rect\n\n	VertexAndColor vert;\n	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));\n	vert.vertex.zw = (float2)(Z_VALUE + z, W_VALUE);\n\n	// Draw lower-left corner\n	vert.vertex.xy = (float2)(x , -y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n	// Duplicate it to create a degenerate triangle\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw upper-left corner\n	vert.vertex.xy = (float2)(x, -y - h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw lower-right corner\n	vert.vertex.xy = (float2)(x + w, -y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Draw upper-right corner\n	vert.vertex.xy = (float2)(x + w, -y - h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n	// Duplicate the last vertex\n	gl_buffer[buffer_offset] = vert;\n\n	// If there's remaining vertex space, tough shit, that's an error.\n\n	return 1;\n}\n\n\n\n\nint RectangleOutline_size(float x, float y, float w, float h, int colorRgb) { \n	return 12; \n}\n\n\n// Requires 12 vertices\nint RectangleOutline_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb) { \n	VertexAndColor vert;\n	vert.color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));\n	vert.vertex.zw = (float2)(Z_VALUE + 100, W_VALUE);\n\n	// Draw trapazoids in the following order: left, top, right, bottom\n\n	// Left trapazoid\n	vert.vertex.xy = (float2)(x , y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n	// Duplicate first vertex to create degenerate triangle\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + BORDER_WIDTH);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x, y + h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + h - BORDER_WIDTH);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n\n	// Top trapazoid\n	vert.vertex.xy = (float2)(x + w, y + h);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x + w - BORDER_WIDTH, y + h - BORDER_WIDTH);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n\n	// Right trapazoid\n	vert.vertex.xy = (float2)(x + w, y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x + w - BORDER_WIDTH, y + BORDER_WIDTH);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n\n	// Bottom trapazoid\n	vert.vertex.xy = (float2)(x, y);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + BORDER_WIDTH);\n	gl_buffer[buffer_offset] = vert;\n	buffer_offset++;\n\n	// Duplicate the last vertex\n	gl_buffer[buffer_offset] = vert;\n\n	return 1; \n}\n\n\n#define SETVERT(x,y,z) \\\n	vert.vertex.zw = (float2)(z, W_VALUE); \\\n	vert.vertex.xy = (float2)(x, y); \\\n	gl_buffer[buffer_offset] = vert; \\\n	buffer_offset++;\n\nint Line_size(float x1, float y1, float x2, float y2, float thickness, int rgb_color) { return 6; }\nint Line_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \n  float x1, float y1, float x2, float y2, float thickness, int rgb_color) {\n\n	//float thickness = 0.1f;\n\n	VertexAndColor vert;\n	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));\n\n	//face A\n	SETVERT(x2 + thickness,-y2,0.0f);\n	SETVERT(x2 + thickness,-y2,0.0f);\n	SETVERT(x2 - thickness,-y2,0.0f);\n	SETVERT(x1 + thickness,-y1,0.0f);\n	SETVERT(x1 - thickness,-y1,0.0f);\n	SETVERT(x1 - thickness,-y1,0.0f);\n	\n	return 1;\n}\n#undef SETVERT\n\n\n#define SETVERT(x,y,z) \\\n	vert.vertex.zw = (float2)(z, W_VALUE); \\\n	vert.vertex.xy = (float2)(x, y); \\\n	gl_buffer[buffer_offset] = vert; \\\n	buffer_offset++;\n\nint Line3D_size(float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color) { return 6; }\nint Line3D_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, \nfloat x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color) {\n\n	VertexAndColor vert;\n	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));\n\n	//face A\n	SETVERT(x2 + thickness,-y2,z2);\n	SETVERT(x2 + thickness,-y2,z2);\n	SETVERT(x2 - thickness,-y2,z2);\n	SETVERT(x1 + thickness,-y1,z1);\n	SETVERT(x1 - thickness,-y1,z1);\n	SETVERT(x1 - thickness,-y1,z1);\n	\n	return 1;\n}\n#undef SETVERT\n\n\n///////////////////////////////////////////////////////////////////////////////\n// Helper function definitions\n///////////////////////////////////////////////////////////////////////////////\n\n\nfloat2 AngleToCoord(float angle, float radius, int x, int y) {\n	return (float2)((radius * cos(angle)) + x, (radius * sin(angle)) + y);\n	\n}\n\n\nfloat DegToRad(int degrees) {\n	return M_PI_F * degrees / 180;\n}\nfloat DegToRadf(float degrees) {\n	return M_PI_F * degrees / 180.0f;\n}\n\n\nfloat getAlphaComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 24;\n	rgb_color = rgb_color & 255;\n	return (rgb_color / 255.0f);\n}\nfloat getRedComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 16;\n	rgb_color = rgb_color & 255;\n	return (rgb_color / 255.0f);\n}\nfloat getGreenComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 8;\n	rgb_color = rgb_color & 255;\n	return (rgb_color / 255.0f);\n}\nfloat getBlueComponent8B(int rgb_color) {\n	rgb_color = rgb_color & 255;\n	return (rgb_color / 255.0f);\n}\n\n\nint igetAlphaComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 24;\n	return rgb_color & 255;\n}\nint igetRedComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 16;\n	return rgb_color & 255;\n}\nint igetGreenComponent8B(int rgb_color) {\n	rgb_color = rgb_color >> 8;\n	return rgb_color & 255;\n}\nint igetBlueComponent8B(int rgb_color) {\n	return rgb_color & 255;\n}\n\n\nint GetAbsoluteIndex(unsigned int relative_index, unsigned int reference_node) {\n	if (relative_index == 0) {\n		return 0;\n	}\n\n	return reference_node + relative_index;\n}\n\n\nfloat atan2_wrap(float x, float y) {\n	return (float) atan2(x, y);\n}\n\n\nint lerpColor(int start_color, int end_color, float fk) {\n	if(fk >= 1) {\n		return end_color;\n	}\n\n	int   alpha_start = igetAlphaComponent8B(start_color);\n	int   red_start = igetRedComponent8B(start_color);\n	int green_start = igetGreenComponent8B(start_color);\n	int  blue_start = igetBlueComponent8B(start_color);\n\n	int   alpha_end = igetAlphaComponent8B(end_color);\n	int   red_end = igetRedComponent8B(end_color);\n	int green_end = igetGreenComponent8B(end_color);\n	int  blue_end = igetBlueComponent8B(end_color);\n\n	int alpha_blended   = ((1 - fk) * alpha_start)   + (fk * alpha_end);\n	int red_blended   = ((1 - fk) * red_start)   + (fk * red_end);\n	int green_blended = ((1 - fk) * green_start) + (fk * green_end);\n	int blue_blended  = ((1 - fk) * blue_start)  + (fk * blue_end);\n	\n	int result = 0;\n	\n	int alpha = alpha_blended & 255;\n	int red = red_blended & 255;\n	int green = green_blended & 255;\n	int blue = blue_blended & 255;\n	\n	result = (result | ((alpha & 255) << 24));\n	result = (result | ((red & 255) << 16));\n	result = (result | ((green & 255) << 8));\n	result = (result | (blue & 255));\n\n	return result;\n	// return 0;\n}\n\nint rgb(int r, int g, int b) {\n	int res = 255 << 24;\n	res = res | ((r & 255) << 16);\n	res = res | ((g & 255) << 8);\n	res = res | (b & 255);\n	return res;\n}\n\nint rgba(int r, int g, int b, int a) {\n	int res = (a & 255) << 24;\n	res = res | ((r & 255) << 16);\n	res = res | ((g & 255) << 8);\n	res = res | (b & 255);\n	return res;\n}\n\n" ];