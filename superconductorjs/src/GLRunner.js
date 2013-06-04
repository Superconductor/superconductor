// Manages the rendering of the visualization
// canvas is the DOM element of the canvas to render to
function GLRunner(canvas, cfg) {

	cfg = cfg ? cfg : {};
	this.cfg = {
		ignoreCL: cfg.hasOwnProperty('ignoreCL') ? cfg.ignoreCL : false,
		antialias: cfg.hasOwnProperty('antialias') ? cfg.antialias : true
	};
	for (i in cfg) this.cfg[i] = cfg[i];

	//========== !CL + !GL

	if (cfg.ignoreCL) { //TODO GL rendering mode with non-CL layout?
		var context = canvas.getContext('2d');
        this.context = context;
		var pos = [0, 0, 0];
		this.position = {
			x: function () { return pos[0]; },
			y: function () { return pos[1]; },
			z: function () { return pos[2]; }
		};
		this.movePosition = function (x,y,z) {
			pos[0] += x;
			pos[1] += y;
			pos[2] += z;
		};
		this.resetCanvas = function () {
			console.log('reset');
			canvas.width = canvas.width;
            context.translate(5, canvas.height * 0.9);
            context.scale(.0027, .0016);
		};
		window.rgb = function (r,g,b) {
			return (255 << 24) + ((r & 255)<<16) + ((g & 255)<<8) + (b & 255);
		};
		window.rgba = function (r,g,b, a) {
			return ((a & 255) << 24) + ((r & 255)<<16) + ((g & 255)<<8) + (b & 255);
		};
		window.lerpColor = function (start_color, end_color, fk) {
			if(fk >= 1) { return end_color; }
			var  red_start = (start_color >> 16) & 255;
			var green_start = (start_color >> 8) & 255;
			var blue_start = start_color & 255;

			var red_end = (end_color >> 16) & 255;
			var green_end = (end_color >> 8) & 255;
			var blue_end = end_color & 255;

			var red_blended   = (((1 - fk) * red_start)   + (fk * red_end)) & 255;
			var green_blended = (((1 - fk) * green_start) + (fk * green_end)) & 255;
			var blue_blended  = (((1 - fk) * blue_start)  + (fk * blue_end)) & 255;
		
			return (red_blended << 16) + (green_blended << 8) + blue_blended;
		};		
		window.Rectangle_draw = function (_, _, _, x, y, w, h, color) {
			context.beginPath();
			context.rect(x, -y, w, -h);
			context.fillStyle = 'rgba(' + ((color>>16)&255) + ',' + ((color>>8)&255) + ',' + (color&255) + ','+ ((color>>24)&255) + ')';
			context.fill();
			context.closePath();
		};
		window.RectangleZ_draw = function (_,_,_, x, y, w, h, _, color) {
			window.Rectangle_draw(0,0,0, x, y, w, h, color);
		}					
		window.RectangleOutline_draw = function (_, _, _, x, y, w, h, color) {					
			context.beginPath();
			context.lineWidth = 3;
			context.strokeStyle = 'rgba(' + ((color>>16)&255) + ',' + ((color>>8)&255) + ',' + (color&255) + ','+ ((color>>24)&255) + ')';
			context.strokeRect(x, -y, w, -h);
			context.closePath();
		};	
		//ignore these
		["Line_size", "Line_draw", "RectangleOutline_size","Rectangle_size","paintStart","RectangleZ_size", "glBufferMacro"]
			.forEach(function (name) {  window[name] = function () {};  });
	} else { //FIXME throw exn or implement for other cases

	//=========== CL + GL

		this.canvas = canvas;
		this.canvas.width  = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;
	 
		this.gl = this.canvas.getContext("experimental-webgl", {antialias: this.cfg.antialias, premultipliedAlpha: false});
		this.context = this.gl;
		this.loadGLProgram();
	 
		// Current perspective values
		this.perspective = {};
		this.updateView({
			fov: 60.0,
			nearPlane: 1.0,
			farPlane: 20.0
		});
	 
		// Current scene position
		this.position = {};
		this.rotation = {x: 0.0, y: 0.0, z: 0.0};
		this.setPosition(-5.14, -3.8, -7.5);
		 this.setRotation(0, 0, 0);
		this.setW(10000.0);
	 
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.enable(this.gl.BLEND);
		this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.disable(this.gl.CULL_FACE);
	 
		this.vbo_size = 0;
		this.num_vertices = 0;
		this.vbo = null;
	} //CL+GL
 }
 


// Returns a bool indicating whether GLRunner is a state where it is able to start rendering
GLRunner.prototype.readyToRender = function() {
	// Technically, we need to have the vbo allocated before we can render, but since that only
	// happens when reallocateVBO() is called by CLRunner after running at least one layout 
	// traversal, and because this function is checked before allow the visualization to start,
	// if we predicate on that, the entire visualization will never start.
	return true;
};


// Description of the format of each data point in the vbo
GLRunner.prototype.vertexAndColor = {
	numVertexComponents: 4,
	sizeVertexCompontent: 4 * Float32Array.BYTES_PER_ELEMENT,

	numColorsComponents: 4,
	sizeColorComponents: 4 * Float32Array.BYTES_PER_ELEMENT,

	sizeTotal: (4 + 4) * Float32Array.BYTES_PER_ELEMENT
};


 GLRunner.prototype.renderFrame = function() {
 	if(!this.readyToRender()) {
 		console.error("GLRunner was asked to render a frame, but it's not yet ready to render");
 		return;
 	}
	if (this.cfg.ignoreCL) {
		console.log('rerun last pass');
	} else {

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


// Reads the desired size of the VBO from the last run of the CL traversals, then allocates a VBO
// at least big enough to hold all the render data
GLRunner.prototype.reallocateVBO = function(numRequestedVertices) {
	if(numRequestedVertices <= 0) {
		throw new SCException("Error: GLRunner asked to reallocateVBO to size " + numRequestedVertices);
	}
	this.num_vertices = numRequestedVertices;
	var requested_size = this.num_vertices * this.vertexAndColor.sizeTotal;

	if(this.vbo_size < requested_size || (this.vbo_size - requested_size) > (this.vbo_size * 0.25)) {
		console.debug("VBO size of " + this.vbo_size + " is not within range for requested size of " +
			requested_size + " (" + this.num_vertices + " vertices). Reallocating VBO.");
		if(this.vbo != null) {
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


// Links up the VBO to the shaders. The VBO must have been allocated at this point.
GLRunner.prototype.linkVBO = function() {
	if(this.vbo == null && this.debug_vbo == null) {
		console.error("Error: Attempted to set shader VBO source, but a valid VBO has not been initialized yet.");
		return null;
	}
	
	var pos_attr_loc = this.gl.getAttribLocation(this.program, "a_position");
	this.gl.enableVertexAttribArray(pos_attr_loc);
	this.gl.vertexAttribPointer(pos_attr_loc, this.vertexAndColor.numVertexComponents, this.gl.FLOAT, false,
		this.vertexAndColor.sizeTotal, 0);


	var color_attr_loc = this.gl.getAttribLocation(this.program, "a_color");
	this.gl.enableVertexAttribArray(color_attr_loc);
	this.gl.vertexAttribPointer(color_attr_loc, this.vertexAndColor.numColorsComponents, this.gl.FLOAT, false,
		this.vertexAndColor.sizeTotal, this.vertexAndColor.sizeVertexCompontent);
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


// Sets the viewport and perspective of the scene based off the current canvas size and, optionally,
// the perspective argument. This function should be called after any resizing of the canvas.
// perspective is an optional map with 0 or more of the following fields:
//	fov: the field-of-view along the y axis
//	nearPlane: the near clipping plane
//	farPlane: the far clipping plane
GLRunner.prototype.updateView = function(perspective) {
	this.canvas.width  = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;

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


// Sets the object translation to (x, y, z)
GLRunner.prototype.setPosition = function(xPos, yPos, zPos) {
	this.position = {x: xPos, y: yPos, z: zPos};
    this.updateModelView();
};


// Moves the scene by (x, y, z) relative to the current position
GLRunner.prototype.movePosition = function(x, y, z) {
	this.setPosition(this.position.x + x, this.position.y + y, this.position.z + z);
};


// Sets the object rotation
GLRunner.prototype.setRotation = function(xDeg, yDeg, zDeg) {
    this.rotation = {x: xDeg, y: yDeg, z: zDeg};
    this.updateModelView();
};


GLRunner.prototype.rotate = function(xDeg, yDeg, zDeg) {
    this.rotation.x += xDeg;
    this.rotation.y += yDeg;
    this.rotation.z += zDeg;
};


// Updates the ModelView matrix to the current values and loads it onto the device
GLRunner.prototype.updateModelView = function() {
	var mv_mat = new J3DIMatrix4();

	mv_mat.translate(this.position.x, this.position.y, this.position.z);

    mv_mat.rotate(this.rotation.x, 1.0, 0, 0);
    mv_mat.rotate(this.rotation.y, 0, 1.0, 0);
    mv_mat.rotate(this.rotation.z, 0, 0, 1.0);

	var mv_m_location = this.gl.getUniformLocation(this.program, "u_modelview_matrix");
	mv_mat.setUniform(this.gl, mv_m_location, false);
};


// Sets the W attribute of the vertices drawn
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



// precision mediump float;

// attribute vec4 a_position;
// attribute vec4 a_color;

// uniform float u_w;

// uniform mat4 u_projection_matrix;
// uniform mat4 u_modelview_matrix;

// varying vec4 v_color;

// void main() {
// 	vec4 pos = vec4(a_position.x, a_position.y, a_position.z, u_w);
// 	gl_Position = u_projection_matrix * u_modelview_matrix * pos;
// 	v_color = a_color;
// }
GLRunner.prototype.vertexShaderSource = "precision mediump float;\n\nattribute vec4 a_position;\nattribute vec4 a_color;\n\nuniform float u_w;\n\nuniform mat4 u_projection_matrix;\nuniform mat4 u_modelview_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n\tvec4 pos = vec4(a_position.x, a_position.y, a_position.z, u_w);\n\tgl_Position = u_projection_matrix * u_modelview_matrix * pos;\n\tv_color = a_color;\n}";


// precision mediump float;
// varying vec4 v_color;

// void main() {
// 	gl_FragColor = v_color;
// }
GLRunner.prototype.fragmentShaderSource = "precision mediump float;\nvarying vec4 v_color;\n\nvoid main() {\n\tgl_FragColor = v_color;\n}";
