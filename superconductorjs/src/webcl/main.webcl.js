//web workers + webgl backends
//Note: webgl may be used without workers

Superconductor.prototype.init = (function () {

	var original = Superconductor.prototype.init;

	var patch = function (visualization, canvas, cfg, cb) {
		if (!cfg) cfg = {};
		cfg.ignoreCL = cfg.hasOwnProperty('ignoreCL') ? cfg.ignoreCL : false;
		original.call(this, visualization, canvas, cfg, cb);		
	};

	return patch;
}());




			
