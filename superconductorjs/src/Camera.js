/** Cameras are responsible for setting, manipulating and reporting our position in a scene. */
 Superconductor.Cameras = (function() {
    'use strict';


    function Camera3d(args) {
        args = Superconductor.utils.extend(true, {
            'position': {x: 0.0, y: 0.0, z: 0.0},
            'rotation': {x: 0.0, y: 0.0, z: 0.0},
            'lens': {fov: 60, near: 1, far: 20, aspect: 1.0}
        }, args);

        // old default position: -this.canvas.width/(2 * 45), this.canvas.height/45, -10
        this.position = args.position;
        this.rotation = args.rotation;

        this.fov = args.lens.fov;
        this.near = args.lens.near;
        this.far = args.lens.far;
        this.aspect = args.lens.aspect;
    };

    /** Sets the lens and position attributes based off the size of a <canvas> element. */
    Camera3d.prototype.fromCanvas = function(canvas) {
        this.lensFromCanvas(canvas);
        this.positionFromCanvas(canvas);
        return this;
    };


    /** Sets the camera's lens parameters to sane defaults based off a <canvas> element. */
    Camera3d.prototype.lensFromCanvas = function(canvas) {
        this.aspect = canvas.width / canvas.height;
        return this;
    };


    /** Sets the camera's position to a sane default based off a <canvas> element. */
    Camera3d.prototype.positionFromCanvas = function(canvas) {
        this.position = {x: -1 * canvas.width/(2 * 45), y: canvas.height/45, z: -10};
        return this;
    };


    /** Get the 4x4 transformation matrix representing the camera perspective and position */
    Camera3d.prototype.getMatrix = function() {
        var glMatrix = typeof module == 'undefiend' ? mat4 : module.exports.glMatrix;
        var mat4 = typeof module == 'undefiend' ? mat4 : module.exports.mat4;
        var vec3 = typeof module == 'undefiend' ? vec3 : module.exports.vec3;

        var projct_mat = mat4.create(); //new J3DIMatrix4();
        mat4.perspective(projct_mat, glMatrix.toRadian(this.fov), this.aspect, this.near, this.far)

        mat4.translate(projct_mat, projct_mat, vec3.fromValues(this.position.x, this.position.y, this.position.z));

        mat4.rotateX(projct_mat, projct_mat, glMatrix.toRadian(this.rotation.x));
        mat4.rotateY(projct_mat, projct_mat, glMatrix.toRadian(this.rotation.y));
        mat4.rotateZ(projct_mat, projct_mat, glMatrix.toRadian(this.rotation.z));

        return projct_mat;
    };



    function Camera2d(bounds) {
        bounds = Superconductor.utils.extend({
            left: 0,
            right: 1,
            bottom: 1,
            top: 0
        }, bounds);

        this.fromBounds(bounds.left, bounds.right, bounds.bottom, bounds.top);
    };


    Camera2d.prototype.fromBounds = function(left, right, bottom,  top) {
        this.width = right - left;
        this.height = bottom - top;
        this.center = {
            x: left + (this.width/2),
            y: top + (this.height/2)
        };
    };


    Camera2d.prototype.fromCanvas = function(canvas) {
        this.fromBounds(0, canvas.width, canvas.height, 0);
    };


    Camera2d.prototype.getMatrix = function() {
        var projct_mat = mat4.create(); //new J3DIMatrix4();
        // Choose arbitrary near and far planes (0, 20)
        // We purposelly swap and negate the top and bottom arguments so that the matrix follows
        // HTML-style coordinates (top-left corner at 0,0) vs. than GL coordinates (bottom-left 0,0)
        mat4.ortho(projct_mat, this.center.x - (this.width / 2), this.center.x + (this.width / 2),
            -this.center.y - (this.height / 2), -this.center.y + (this.height / 2), -1, 10);

        return projct_mat;
    };


    /** Takes an (x,y) world coordinate and returns the translation into device coordinates */
    Camera2d.prototype.deviceCoords = function(x, y, w) {
        var matrix = this.getMatrix();
        // We need to flip 'y' to match what our shader does
        var worldCoords = vec4.fromValues(x, -1 * y, 0, w);
        var screenCoords = vec4.create();
        vec4.transformMat4(screenCoords, worldCoords, matrix);

        return {
          'x': screenCoords[0],
          'y': screenCoords[1],
          'w': screenCoords[3]
        };
    }


    /** Given (x,y, w) coordinates in world space, transforms them to coordinates for a canvas */
    Camera2d.prototype.canvasCoords = function(x, y, w, canvas) {
        var deviceCoords = this.deviceCoords(x, y, w);
        // We need to flip 'y' because GL puts (0,0) at the bottom-left, and <canvas> puts it at
        // the top-left.
        var canvasCoords = {
            'x': (deviceCoords.x / deviceCoords.w),
            'y': ((deviceCoords.y / deviceCoords.w) * -1)
        };

        // Translate x and y from being in [-1, 1] to [0, 1]
        canvasCoords.x = (canvasCoords.x + 1) / 2;
        canvasCoords.y = (canvasCoords.y + 1) / 2;

        canvasCoords.x = canvasCoords.x * canvas.clientWidth;
        canvasCoords.y = canvasCoords.y * canvas.clientHeight;

        return canvasCoords;
    }


    return {
        'Camera3d': Camera3d,
        'Camera2d': Camera2d
    };

})();
