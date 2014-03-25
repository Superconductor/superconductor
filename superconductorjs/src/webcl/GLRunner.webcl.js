GLRunner.prototype.init = (function () {
    var initOld = GLRunner.prototype.init;
    var initNew = function (canvas, cfg) {

    	cfg = cfg || {};
    	cfg.ignoreGL = cfg.hasOwnProperty('ignoreGL') ? cfg.ignoreGL : false;
		cfg.antialias = cfg.hasOwnProperty("antialias") ? cfg.antialias : true;

		if (!cfg.ignoreCL && !cfg.ignoreGL) {
			this.canvas = canvas;
			this.cfg = cfg;
		    this.initCLGL();    
		} else {
			initOld.call(this, canvas, cfg);
		}
		
    };
    return initNew;
}());

//GL setup that is independent of CL usage
GLRunner.prototype.init_GLCore = function () {
	this.loadGLProgram();
	this.perspective = {};
	this.updateView({fov: 60, nearPlane: 1, farPlane: 20});
	this.position = {};
	this.rotation = {x: 0, y: 0, z: 0};
	this.setPosition(-this.canvas.width/(2 * 45), this.canvas.height/45, -10); //FIXME magic numbers..
	this.setRotation(0, 180, 180);
	this.setW(1);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.enable(this.gl.BLEND);
	this.gl.clearColor(0, 0, 0, 0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.disable(this.gl.CULL_FACE);
	this.vbo_size = 0;
	this.num_vertices = 0;
	this.vbo = null;
};

//CLGL interop mode
GLRunner.prototype.initCLGL = function () {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl = this.canvas.getContext("experimental-webgl", {
		antialias: this.cfg.antialias,
		premultipliedAlpha: false,
		preserveDrawingBuffer: true
	});
	if (!this.gl) throw new SCException('need WebGL');
	this.context = this.gl;

	this.init_GLCore();
};



// Links up the VBO to the shaders. The VBO must have been allocated at this point.
GLRunner.prototype.linkVBO = function() {
	if(this.vbo == null && this.debug_vbo == null)
		throw("Error: Attempted to set shader VBO source, but a valid VBO has not been initialized yet.");
	
    var pos_attr_loc = this.gl.getAttribLocation(this.program, "a_position");
    this.gl.enableVertexAttribArray(pos_attr_loc);
    this.gl.vertexAttribPointer(pos_attr_loc, this.vertexAndColor.numVertexComponents, 
    	this.gl.FLOAT, false, this.vertexAndColor.sizeTotal, 0);

    var color_attr_loc = this.gl.getAttribLocation(this.program, "a_color");
    this.gl.enableVertexAttribArray(color_attr_loc);
    this.gl.vertexAttribPointer(color_attr_loc, this.vertexAndColor.numColorsComponents, 
    	this.gl.UNSIGNED_BYTE, true, this.vertexAndColor.sizeTotal, this.vertexAndColor.sizeVertexCompontent);
};


// Reads the desired size of the VBO from the last run, then allocates a VBO
// at least big enough to hold all the render data
GLRunner.prototype.reallocateVBO = function(numRequestedVertices) {
    if(numRequestedVertices <= 0) {
        throw new SCException("Error: GLRunner asked to reallocateVBO to size " + numRequestedVertices);
    }
    
    this.num_vertices = numRequestedVertices;
    var requested_size = this.num_vertices * this.vertexAndColor.sizeTotal;
    
    if (this.vbo_size < requested_size 
      || this.vbo_size - requested_size > this.vbo_size * .25) {

        console.debug("Expand VBO:", this.vbo_size, "=>",requested_size, 
            "(" + this.num_vertices + " vertices)");

        if (this.vbo != null) {
            console.debug("Delete old VBO");
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            this.gl.deleteBuffer(this.vbo);
        }
        
        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
        this.vbo_size = Math.ceil(requested_size * 1.25);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vbo_size, 
            this.gl.DYNAMIC_DRAW); //support recycling
        this.linkVBO();
        
    } else {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    }
    
    return this.vbo;
};



// Loads all the shaders, compiles and links the OpenGL program
// Side-effect of assigning program and shader member variables
GLRunner.prototype.loadGLProgram = function() {
    this.program = this.gl.createProgram();

    this.vertex_shader   = this.loadShader(this.vertexShaderSource, this.gl.VERTEX_SHADER);
    this.gl.attachShader(this.program, this.vertex_shader);

    this.fragment_shader = this.loadShader(this.fragmentShaderSource, this.gl.FRAGMENT_SHADER);
    this.gl.attachShader(this.program, this.fragment_shader);

    this.gl.linkProgram(this.program);
    if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
        console.error("Error: Could not link program. " + this.gl.getProgramInfoLog(this.program));
        this.gl.deleteProgram(this.program);
        return null;
    }

    this.gl.validateProgram(this.program);
    if(!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
        console.error("Error: WebGL could not validate the program.");
        this.gl.deleteProgram(this.program);
        return null;
    }

    this.gl.useProgram(this.program);
};

// Loads and compiles a shader given from source and type of shader, and returns it
GLRunner.prototype.loadShader = function(shaderSource, shaderType) {
    var shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);

    if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error("Error: Could not compile shader. " + this.gl.getShaderInfoLog(shader));
        console.debug("Shader source: " + shaderSource);
        this.gl.deleteShader(shader);
        return null;
    }

    if(!this.gl.isShader(shader)) {
        console.error("Error: WebGL is reporting that the specified shader is not a valid shader.");
        console.debug("Shader source: " + shaderSource);
        return null;
    }

    return shader;
};

//VBO vertex data representation
GLRunner.prototype.vertexAndColor = {
    numVertexComponents: 3,
    sizeVertexCompontent: 3 * Float32Array.BYTES_PER_ELEMENT,
    numColorsComponents: 4,
    sizeColorComponent: 4 * Uint8Array.BYTES_PER_ELEMENT,
    sizeTotal: 3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT
};

GLRunner.prototype.renderFrame = function() {
    if (!this.cfg.ignoreGL) {   
        console.debug("## Rendering a frame ##");   
        this.gl.finish();
    
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.num_vertices);
        
        var error = this.gl.getError();
        if(error != this.gl.NONE) {
            console.error("WebGL error detected after rendering: " + error);
        }
    }
};


// Sets the viewport and perspective of the scene based off the current canvas size and, optionally,
// the perspective argument. This function should be called after any resizing of the canvas.
// perspective is an optional map with 0 or more of the following fields:
//  fov: the field-of-view along the y axis
//  nearPlane: the near clipping plane
//  farPlane: the far clipping plane
GLRunner.prototype.updateView = function(perspective) {
    this.canvas.width = this.canvas.clientWidth * (window.devicePixelRatio || 1);
    this.canvas.height = this.canvas.clientHeight * (window.devicePixelRatio || 1);

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    if(perspective !== undefined) {
        for(var key in perspective) {
            this.perspective[key] = perspective[key];
        }
    }
    // Always set the aspect ratio based off the current canvas size; overwrite value if it was set
    // in perspective
    this.perspective.aspect = this.canvas.width / this.canvas.height;

    var projct_m_location = this.gl.getUniformLocation(this.program, "u_projection_matrix");
    var projct_mat = new J3DIMatrix4();
    projct_mat.perspective(this.perspective.fov, this.perspective.aspect, this.perspective.nearPlane, this.perspective.farPlane);
    projct_mat.setUniform(this.gl, projct_m_location, false);
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

//VBO vertex data representation
GLRunner.prototype.vertexAndColor = {
    numVertexComponents: 3,
    sizeVertexCompontent: 3 * Float32Array.BYTES_PER_ELEMENT,
    numColorsComponents: 4,
    sizeColorComponent: 4 * Uint8Array.BYTES_PER_ELEMENT,
    sizeTotal: 3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT
};

// Updates the ModelView matrix to the current values and loads it onto the device
GLRunner.prototype.updateModelView = function() {
	if (this.cfg.ignoreGL) {
		console.warn('updateModelView not implemented for non-GL backends');
		return;
	}

	var mv_mat = new J3DIMatrix4();

	mv_mat.translate(this.position.x, this.position.y, this.position.z);

    mv_mat.rotate(this.rotation.x, 1.0, 0, 0);
    mv_mat.rotate(this.rotation.y, 0, 1.0, 0);
    mv_mat.rotate(this.rotation.z, 0, 0, 1.0);

	var mv_m_location = this.gl.getUniformLocation(this.program, "u_modelview_matrix");
	mv_mat.setUniform(this.gl, mv_m_location, false);
};



// precision mediump float;
// 
// attribute vec3 a_position;
// attribute vec4 a_color;
// 
// uniform float u_w;
// 
// uniform mat4 u_projection_matrix;
// uniform mat4 u_modelview_matrix;
// 
// varying vec4 v_color;
// 
// void main() {
//  vec4 pos = vec4(a_position.x, a_position.y, a_position.z, u_w);
//  gl_Position = u_projection_matrix * u_modelview_matrix * pos;
//  v_color = a_color;
// }
GLRunner.prototype.vertexShaderSource = "precision mediump float;\n\nattribute vec3 a_position;\nattribute vec4 a_color;\n\nuniform float u_w;\n\nuniform mat4 u_projection_matrix;\nuniform mat4 u_modelview_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n   vec4 pos = vec4(a_position.x, a_position.y, a_position.z, u_w);\n   gl_Position = u_projection_matrix * u_modelview_matrix * pos;\n v_color = a_color;\n}";

// precision mediump float;
// varying vec4 v_color;
// 
// void main() {
//  gl_FragColor = v_color; 
// }
GLRunner.prototype.fragmentShaderSource = "precision mediump float;\nvarying vec4 v_color;\n\nvoid main() {\n   gl_FragColor = v_color.abgr; \n}";
