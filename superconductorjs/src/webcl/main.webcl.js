//web workers + webgl backends
//Note: webgl may be used without workers

Superconductor.prototype.init = (function () {

	var original = Superconductor.prototype.init;

	return function (visualization, canvas, cfg, cb) {
        // Merge user-supplied config flags with our defaults (to fill in any missing flags)
        cfg = Superconductor.utils.extend({
            ignoreCL: false
        }, cfg);

		original.call(this, visualization, canvas, cfg, cb);
	};

}());
