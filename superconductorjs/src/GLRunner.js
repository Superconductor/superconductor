// Manages the rendering of the visualization
function GLRunner(canvas, camera, cfg) {
	Superconductor.prototype.setupConsole.call(this);

	this.canvas = canvas;
	this.camera = camera;
	this.cfg = Superconductor.utils.extend({
		ignoreGL: false,
		antialias: true
	}, cfg);

	this.init.apply(this, arguments);
}

//Use initialization method rather than constructor to facilitate monkey-patched backends
GLRunner.prototype.init = function (canvas, camera, cfg) {
    this.initCanvas();
};


if (typeof module != 'undefined') {
    var glbl = (function () { return this; })();
    ['mat4', 'vec3', 'vec4', 'glMatrix']
        .forEach(function (name) {
            glbl[name] = module.exports[name];
        });
}

 //Common functions (e.g., painting)
 //May be copied into a worker so must not contain open variables (unless other env)
 //Different backends will augment
 GLRunner.prototype.env = {
	lerpColor: function (start_color, end_color, fk) {
		if(fk >= 1) { return end_color; }
		var  red_start = (start_color >> 24) & 255;
		var green_start = (start_color >> 16) & 255;
		var blue_start = start_color >> 8 & 255;

		var red_end = (end_color >> 24) & 255;
		var green_end = (end_color >> 16) & 255;
		var blue_end = (end_color >> 8) & 255;

		var red_blended   = (((1 - fk) * red_start)   + (fk * red_end)) & 255;
		var green_blended = (((1 - fk) * green_start) + (fk * green_end)) & 255;
		var blue_blended  = (((1 - fk) * blue_start)  + (fk * blue_end)) & 255;

		return (red_blended << 24) + (green_blended << 16) + (blue_blended << 8) + 255;
	},
    rgb: function(r, g, b) {
        return ((r|0 & 255) << 24) + ((g|0 & 255) << 16) + ((b|0 & 255) << 8) + 255;
    },
    rgba: function(r, g, b, a) {
        return (((r|0) & 255) << 24) + (((g|0) & 255) << 16) + (((b|0) & 255) << 8) + ((a|0) & 255);
    },
    Circle_size: function () { return 50; },
    CircleZ_size: function () { return 50; },

	ArcZ_size: function (x, y, z, radius, alpha, sectorAng, w, colorRgb) {

		//circle
		if (sectorAng >= 360)
			return 50;

		//skip small
		//TODO what if zoomed in? Line?
		if (w < 0.001 || sectorAng < 0.02)
			return 0;

		var NUM_VERT_ARC = 20;

		return sectorAng >= 180 ? NUM_VERT_ARC * 6
			: sectorAng >= 90 ? NUM_VERT_ARC * 4
		 	: sectorAng >= 45 ? NUM_VERT_ARC * 3
			: sectorAng >= 25 ? NUM_VERT_ARC * 2
			:  NUM_VERT_ARC;
	},

	Arc_size: function (x, y, radius, alpha, sectorAng, w, colorRgb) {
		return ArcZ_size(x, y, 0, radius, alpha, sectorAng, w, colorRGB);
	},
	Rectangle_size: function () { return 6; },
	RectangleOutline_size: function () { return 12; },
	RectangleOutlineZ_size: function () { return 12; },
	Line3D_size: function () { return 6; },
	Line_size: function () { return 6; },
	RectangleZ_size: function () { return 6; },
	PI: function () { return 3.14768; },
	clamp: function (v, a, b) { return Math.max(Math.min(v, b), a); },
	cos: function (v) { return Math.cos(v); },
	sin: function (v) { return Math.sin(v); },
	floor: function (v) { return Math.floor(v); },
	abs: function (v) { return Math.abs(v); },
	min: function (a,b) { return Math.min(a,b); },
	max: function (a,b) { return Math.max(a,b); },
	dist: function (a,b) { return Math.sqrt((a-b)*(a-b)); },
	mod: function (a, b) { return a % b; },
	fmod: function (a, b) { return a % b; }
};

//Package env for constructing a worker
GLRunner.prototype.envStr = function () {

	function exportGlobal (name, val) {
		return typeof(val) == "function" ?
			(val.toString().replace(/^function/, "function " + name))
			: ("" + name + " = " + JSON.stringify(val));
	}
	var res = "";

	for (i in this.env)
		res += exportGlobal(i, this.env[i]) + ";\n";
	return res;
};


//Maybe workers; pure canvas
//Use initialization method rather than constructor to facilitate monkey-patched backends
//FIXME pos should use context transforms
GLRunner.prototype.initCanvas = function () {

	this.context = this.canvas.getContext("2d");
	var canvas = this.canvas;
	var context = this.context;

    //sets context in case multiple renderers
    this.startRender = function () {
        if (!window.sc) window.sc = {};
        window.sc.context = this.context;
    }


	//Retina support
	var devicePixelRatio = window.devicePixelRatio || 1;
	var w = canvas.clientWidth;
	var h = canvas.clientHeight;
	canvas.width = w;
	canvas.height = h;
	canvas.style.width = w / devicePixelRatio;
	canvas.style.height = h / devicePixelRatio;

	// FIXME
	this.console.error("FIXME: Canvas renderer code not updated for use with Camera object");
	var pos = [ 0, 0, 1.0, 20 ];
	this.position = {};
	this.position.__defineGetter__("x", function () { return pos[0]; });
	this.position.__defineGetter__("y", function () { return pos[1]; });
	this.position.__defineGetter__("z", function () { return pos[2]; });
	this.movePosition = function(x, y, z) {
		pos[0] += x;
		pos[1] += y;
		pos[2] += z;
	};
	this.setW = function (w) {
		pos[3] = w;
	}
    this.__defineGetter__("vertex_w", function () { //needed for 2D camera
        return pos[3];
    });

	for (var i in this.env)
		window[i] = this.env[i];

	//TODO implement
	window.Arc_draw = function () { }
	window.ArcZ_draw = function () { }
	window.Circle_draw = function () { }
	window.CircleZ_draw = function () { }

	//FIXME optimize use of paths
	window.Rectangle_draw = function(_, _, _, x, y, w, h, color) {
		window.sc.context.beginPath();
		window.sc.context.rect(pos[2] * pos[3] * (pos[0] + x), pos[2] * pos[3] * (pos[1] + y), pos[2] * pos[3] * w, pos[2] * pos[3] * h);
        window.sc.context.fillStyle = "rgba(" + ((color >> 24) & 255) + "," + ((color >> 16) & 255) + "," + ((color >> 8) & 255) + "," + (color & 255)/255 + ")";
		window.sc.context.fill();
	};
	window.RectangleZ_draw = function(_, _, _, x, y, w, h, _, color) {
		window.Rectangle_draw(0, 0, 0, x, y, w, h, color);
	};
	window.RectangleOutline_draw = function(_, _, _, x, y, w, h, thickness, color) {
		window.sc.context.beginPath();
		window.sc.context.lineWidth = thickness * pos[2] * pos[3];
        window.sc.context.strokeStyle = "rgba(" + (color >> 24 & 255) + "," + ((color >> 16) & 255) + "," + ((color >> 8) & 255) + "," + (color & 255)/255 + ")";
		window.sc.context.strokeRect(pos[2] * pos[3] * (pos[0] + x), pos[2] * pos[3] * (pos[1] + y), pos[2] * pos[3] * w, pos[2] * pos[3] * h);
	};

	window.GetAbsoluteIndex = function (rel, ref) { return rel == 0 ? 0 : (rel + ref); } ;
	window.Line_draw = function (_, _, _, x1, y1, x2, y2, thickness, color) {
		window.sc.context.beginPath();
		window.sc.context.lineWidth = thickness * pos[2] * pos[3];
        window.sc.context.strokeStyle = "rgba(" + (color >> 24 & 255) + "," + ((color >> 16) & 255) + "," + ((color >> 8) & 255) + "," + (color & 255)/255 + ")";
		window.sc.context.moveTo(pos[2] * pos[3] * (pos[0] + x1), pos[2] * pos[3] * (pos[1] + y1));
		window.sc.context.lineTo(pos[2] * pos[3] * (pos[0] + x2), pos[2] * pos[3] * (pos[1] + y2));
		window.sc.context.stroke();

	}
	window.Line3D_draw = function (_, _, _, x1, y1, z1, x2, y2, z2, thickness, color) {
		window.Line_draw(0, 0, 0, x1, y1, x2, y2, thickness, color);
	}

	var nop = function () { };
	var kills = [ "Arc_size", "ArcZ_size", "Circle_size", "CircleZ_size", "Line_size", "Line3D_size", "RectangleOutline_size", "Rectangle_size", "paintStart", "RectangleZ_size", "glBufferMacro" ];
	kills.forEach(function(fnName) {
		window[fnName] = nop; });
};


GLRunner.prototype.renderFrame = function() {
	//FIXME rerun last pass because camera may have moved
	throw new Error("Tried to render a frame, but Canvas renderer imlicitly renders objects");
};


// Sets the W attribute of the vertices drawn
GLRunner.prototype.setW = function(w) {
	if (this.cfg.ignoreGL) {
		this.console.warn('setW not implemented for non-GL backends');
		return;
	}

	this.vertex_w = 20 / w;

	var w_location = this.gl.getUniformLocation(this.program, "u_w");
	this.gl.uniform1f(w_location, this.vertex_w);
};
