this._gen_getKernels = function() {
	this._gen_kernel_visit_0 = this.program.createKernel("visit_0");
	this._gen_kernel_visit_1 = this.program.createKernel("visit_1");
	this._gen_kernel_visit_2 = this.program.createKernel("visit_2");
};


this._gen_allocateClBuffers = function() {
	this.cl_int_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.int_buffer_1.byteLength);
	this.cl_float_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.float_buffer_1.byteLength);
	this.cl_grammartokens_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.grammartokens_buffer_1.byteLength);
	this.cl_nodeindex_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.nodeindex_buffer_1.byteLength);
};


this._gen_transferTree = function() {
	this.queue.enqueueWriteBuffer(this.cl_int_buffer_1, true, 0, this.int_buffer_1.byteLength, this.int_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_float_buffer_1, true, 0, this.float_buffer_1.byteLength, this.float_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_grammartokens_buffer_1, true, 0, this.grammartokens_buffer_1.byteLength, this.grammartokens_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_nodeindex_buffer_1, true, 0, this.nodeindex_buffer_1.byteLength, this.nodeindex_buffer_1);
};


this._gen_retrieveTree = function() {
	this.queue.enqueueReadBuffer(this.cl_int_buffer_1, true, 0, this.int_buffer_1.byteLength, this.int_buffer_1);
	this.queue.enqueueReadBuffer(this.cl_float_buffer_1, true, 0, this.float_buffer_1.byteLength, this.float_buffer_1);
	this.queue.enqueueReadBuffer(this.cl_grammartokens_buffer_1, true, 0, this.grammartokens_buffer_1.byteLength, this.grammartokens_buffer_1);
	this.queue.enqueueReadBuffer(this.cl_nodeindex_buffer_1, true, 0, this.nodeindex_buffer_1.byteLength, this.nodeindex_buffer_1);
};


this._gen_setKernelArguments = function(kernel) {
if (typeof webcl.enableExtension == "function") {
	kernel.setArg(0, new Uint32Array([0]));	// start_idx (default to 0)
	kernel.setArg(1, new Uint32Array([this.tree_size]));
} else {
	console.debug("Legacy set args");
	var types = window.WebCLKernelArgumentTypes;
	kernel.setArg(0, 0, types.UINT);	// start_idx (default to 0)
	kernel.setArg(1, this.tree_size, types.UINT);
}
	kernel.setArg(2, this.cl_int_buffer_1);
	kernel.setArg(3, this.cl_float_buffer_1);
	kernel.setArg(4, this.cl_grammartokens_buffer_1);
	kernel.setArg(5, this.cl_nodeindex_buffer_1);
};


this._gen_runTraversals = function() {
	this._gen_run_visit_0();
	this._gen_run_visit_1();
};


this._gen_run_visit_0 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_0);
	this.topDownTraversal(this._gen_kernel_visit_0);
};


this._gen_run_visit_1 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_1);
	this.bottomUpTraversal(this._gen_kernel_visit_1);
};


this._gen_run_visit_2 = function(clVBO) {
	this._gen_setKernelArguments(this._gen_kernel_visit_2);
	this._gen_kernel_visit_2.setArg(6, clVBO);
	this.topDownTraversal(this._gen_kernel_visit_2);
};


// Defines all the typed array buffers which will store data locally before
// sending it to the CL device, then populates them with data
this._gen_allocateHostBuffers = function(treeSize) {
	this.INT_BUFFER_1_SIZE = 105;
	this.int_buffer_1 = new Int32Array(this.INT_BUFFER_1_SIZE * treeSize);
	this.FLOAT_BUFFER_1_SIZE = 67;
	this.float_buffer_1 = new Float32Array(this.FLOAT_BUFFER_1_SIZE * treeSize);
	this.GRAMMARTOKENS_BUFFER_1_SIZE = 2;
	this.grammartokens_buffer_1 = new Int32Array(this.GRAMMARTOKENS_BUFFER_1_SIZE * treeSize);
	this.NODEINDEX_BUFFER_1_SIZE = 7;
	this.nodeindex_buffer_1 = new Int32Array(this.NODEINDEX_BUFFER_1_SIZE * treeSize);
};

this._gen_allocateHostProxies = function (treeSize) {
	this.displayname = this.grammartokens_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_generator_angle = this.float_buffer_1.subarray(treeSize * 46, (treeSize * 46) + treeSize);
	this.fld_generator_child_childs_count = this.int_buffer_1.subarray(treeSize * 72, (treeSize * 72) + treeSize);
	this.fld_generator_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_generator_childs_angle_init = this.float_buffer_1.subarray(treeSize * 59, (treeSize * 59) + treeSize);
	this.fld_generator_childs_angle_last = this.float_buffer_1.subarray(treeSize * 60, (treeSize * 60) + treeSize);
	this.fld_generator_childs_depth_init = this.int_buffer_1.subarray(treeSize * 89, (treeSize * 89) + treeSize);
	this.fld_generator_childs_depth_last = this.int_buffer_1.subarray(treeSize * 90, (treeSize * 90) + treeSize);
	this.fld_generator_childs_height_init = this.float_buffer_1.subarray(treeSize * 57, (treeSize * 57) + treeSize);
	this.fld_generator_childs_height_last = this.float_buffer_1.subarray(treeSize * 58, (treeSize * 58) + treeSize);
	this.fld_generator_childs_idx_init = this.int_buffer_1.subarray(treeSize * 81, (treeSize * 81) + treeSize);
	this.fld_generator_childs_idx_last = this.int_buffer_1.subarray(treeSize * 82, (treeSize * 82) + treeSize);
	this.fld_generator_childs_increment_init = this.float_buffer_1.subarray(treeSize * 51, (treeSize * 51) + treeSize);
	this.fld_generator_childs_increment_last = this.float_buffer_1.subarray(treeSize * 52, (treeSize * 52) + treeSize);
	this.fld_generator_childs_isfirst_init = this.int_buffer_1.subarray(treeSize * 73, (treeSize * 73) + treeSize);
	this.fld_generator_childs_isfirst_last = this.int_buffer_1.subarray(treeSize * 74, (treeSize * 74) + treeSize);
	this.fld_generator_childs_islast_init = this.int_buffer_1.subarray(treeSize * 87, (treeSize * 87) + treeSize);
	this.fld_generator_childs_islast_last = this.int_buffer_1.subarray(treeSize * 88, (treeSize * 88) + treeSize);
	this.fld_generator_childs_minradius_init = this.float_buffer_1.subarray(treeSize * 55, (treeSize * 55) + treeSize);
	this.fld_generator_childs_minradius_last = this.float_buffer_1.subarray(treeSize * 56, (treeSize * 56) + treeSize);
	this.fld_generator_childs_radius_init = this.float_buffer_1.subarray(treeSize * 61, (treeSize * 61) + treeSize);
	this.fld_generator_childs_radius_last = this.float_buffer_1.subarray(treeSize * 62, (treeSize * 62) + treeSize);
	this.fld_generator_childs_rotation_init = this.int_buffer_1.subarray(treeSize * 75, (treeSize * 75) + treeSize);
	this.fld_generator_childs_rotation_last = this.int_buffer_1.subarray(treeSize * 76, (treeSize * 76) + treeSize);
	this.fld_generator_childs_tween_init = this.float_buffer_1.subarray(treeSize * 65, (treeSize * 65) + treeSize);
	this.fld_generator_childs_tween_last = this.float_buffer_1.subarray(treeSize * 66, (treeSize * 66) + treeSize);
	this.fld_generator_childs_tweenmax_init = this.float_buffer_1.subarray(treeSize * 47, (treeSize * 47) + treeSize);
	this.fld_generator_childs_tweenmax_last = this.float_buffer_1.subarray(treeSize * 48, (treeSize * 48) + treeSize);
	this.fld_generator_childs_tweenmin_init = this.float_buffer_1.subarray(treeSize * 53, (treeSize * 53) + treeSize);
	this.fld_generator_childs_tweenmin_last = this.float_buffer_1.subarray(treeSize * 54, (treeSize * 54) + treeSize);
	this.fld_generator_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 83, (treeSize * 83) + treeSize);
	this.fld_generator_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 84, (treeSize * 84) + treeSize);
	this.fld_generator_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 91, (treeSize * 91) + treeSize);
	this.fld_generator_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 92, (treeSize * 92) + treeSize);
	this.fld_generator_childs_valcopy_init = this.float_buffer_1.subarray(treeSize * 63, (treeSize * 63) + treeSize);
	this.fld_generator_childs_valcopy_last = this.float_buffer_1.subarray(treeSize * 64, (treeSize * 64) + treeSize);
	this.fld_generator_childs_valprev_init = this.float_buffer_1.subarray(treeSize * 49, (treeSize * 49) + treeSize);
	this.fld_generator_childs_valprev_last = this.float_buffer_1.subarray(treeSize * 50, (treeSize * 50) + treeSize);
	this.fld_generator_childs_xoffset_init = this.int_buffer_1.subarray(treeSize * 79, (treeSize * 79) + treeSize);
	this.fld_generator_childs_xoffset_last = this.int_buffer_1.subarray(treeSize * 80, (treeSize * 80) + treeSize);
	this.fld_generator_childs_yoffset_init = this.int_buffer_1.subarray(treeSize * 77, (treeSize * 77) + treeSize);
	this.fld_generator_childs_yoffset_last = this.int_buffer_1.subarray(treeSize * 78, (treeSize * 78) + treeSize);
	this.fld_generator_increment = this.float_buffer_1.subarray(treeSize * 45, (treeSize * 45) + treeSize);
	this.fld_generator_numspikes = this.int_buffer_1.subarray(treeSize * 68, (treeSize * 68) + treeSize);
	this.fld_generator___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 69, (treeSize * 69) + treeSize);
	this.fld_generator___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 85, (treeSize * 85) + treeSize);
	this.fld_generator___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 86, (treeSize * 86) + treeSize);
	this.fld_generator___draw__ = this.int_buffer_1.subarray(treeSize * 70, (treeSize * 70) + treeSize);
	this.fld_generator___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 71, (treeSize * 71) + treeSize);
	this.fld_iroot_depth = this.int_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_iroot_height = this.float_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot_minradius = this.float_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_iroot_radius = this.float_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_iroot_rotation = this.int_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_iroot_tweenmax = this.float_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot_tweenmin = this.float_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_iroot___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_iroot___renderoffset__ = this.int_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot___rendersize__ = this.int_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_iroot_xoffset = this.int_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_iroot_yoffset = this.int_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_leaf_angle = this.float_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_leaf_depth = this.int_buffer_1.subarray(treeSize * 32, (treeSize * 32) + treeSize);
	this.fld_leaf_height = this.float_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_leaf_idx = this.int_buffer_1.subarray(treeSize * 28, (treeSize * 28) + treeSize);
	this.fld_leaf_increment = this.float_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_leaf_isfirst = this.int_buffer_1.subarray(treeSize * 30, (treeSize * 30) + treeSize);
	this.fld_leaf_islast = this.int_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_leaf_minradius = this.float_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_leaf_radius = this.float_buffer_1.subarray(treeSize * 28, (treeSize * 28) + treeSize);
	this.fld_leaf_rotation = this.int_buffer_1.subarray(treeSize * 34, (treeSize * 34) + treeSize);
	this.fld_leaf_tween = this.float_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_leaf_tweenmax = this.float_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_leaf_tweenmin = this.float_buffer_1.subarray(treeSize * 29, (treeSize * 29) + treeSize);
	this.fld_leaf___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 31, (treeSize * 31) + treeSize);
	this.fld_leaf___renderoffset__ = this.int_buffer_1.subarray(treeSize * 35, (treeSize * 35) + treeSize);
	this.fld_leaf___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 29, (treeSize * 29) + treeSize);
	this.fld_leaf___rendersize__ = this.int_buffer_1.subarray(treeSize * 36, (treeSize * 36) + treeSize);
	this.fld_leaf_val = this.float_buffer_1.subarray(treeSize * 30, (treeSize * 30) + treeSize);
	this.fld_leaf_valcopy = this.float_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_leaf_valprev = this.float_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_leaf_xoffset = this.int_buffer_1.subarray(treeSize * 33, (treeSize * 33) + treeSize);
	this.fld_leaf_yoffset = this.int_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_node_depth = this.int_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_node_height = this.float_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_node_idx = this.int_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_node_levellength = this.int_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_node_minradius = this.float_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_node_radius = this.float_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_node_rotation = this.int_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_node_rx = this.float_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_node_tweenmax = this.float_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_node_tweenmin = this.float_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_node___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_node___renderoffset__ = this.int_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_node___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_node___rendersize__ = this.int_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_node_x = this.float_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_node_xoffset = this.int_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_node_yoffset = this.int_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_root_child_child_count = this.int_buffer_1.subarray(treeSize * 40, (treeSize * 40) + treeSize);
	this.fld_root_child_child_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_root___childrendersize__ = this.int_buffer_1.subarray(treeSize * 39, (treeSize * 39) + treeSize);
	this.fld_root___draw__ = this.int_buffer_1.subarray(treeSize * 37, (treeSize * 37) + treeSize);
	this.fld_root___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 38, (treeSize * 38) + treeSize);
	this.fld_second_child_childs_count = this.int_buffer_1.subarray(treeSize * 47, (treeSize * 47) + treeSize);
	this.fld_second_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_second_childs_depth_init = this.int_buffer_1.subarray(treeSize * 64, (treeSize * 64) + treeSize);
	this.fld_second_childs_depth_last = this.int_buffer_1.subarray(treeSize * 65, (treeSize * 65) + treeSize);
	this.fld_second_childs_height_init = this.float_buffer_1.subarray(treeSize * 41, (treeSize * 41) + treeSize);
	this.fld_second_childs_height_last = this.float_buffer_1.subarray(treeSize * 42, (treeSize * 42) + treeSize);
	this.fld_second_childs_idx_init = this.int_buffer_1.subarray(treeSize * 56, (treeSize * 56) + treeSize);
	this.fld_second_childs_idx_last = this.int_buffer_1.subarray(treeSize * 57, (treeSize * 57) + treeSize);
	this.fld_second_childs_levellength_init = this.int_buffer_1.subarray(treeSize * 62, (treeSize * 62) + treeSize);
	this.fld_second_childs_levellength_last = this.int_buffer_1.subarray(treeSize * 63, (treeSize * 63) + treeSize);
	this.fld_second_childs_minradius_init = this.float_buffer_1.subarray(treeSize * 37, (treeSize * 37) + treeSize);
	this.fld_second_childs_minradius_last = this.float_buffer_1.subarray(treeSize * 38, (treeSize * 38) + treeSize);
	this.fld_second_childs_radius_init = this.float_buffer_1.subarray(treeSize * 43, (treeSize * 43) + treeSize);
	this.fld_second_childs_radius_last = this.float_buffer_1.subarray(treeSize * 44, (treeSize * 44) + treeSize);
	this.fld_second_childs_rotation_init = this.int_buffer_1.subarray(treeSize * 50, (treeSize * 50) + treeSize);
	this.fld_second_childs_rotation_last = this.int_buffer_1.subarray(treeSize * 51, (treeSize * 51) + treeSize);
	this.fld_second_childs_rx_init = this.float_buffer_1.subarray(treeSize * 35, (treeSize * 35) + treeSize);
	this.fld_second_childs_rx_last = this.float_buffer_1.subarray(treeSize * 36, (treeSize * 36) + treeSize);
	this.fld_second_childs_tweenmax_init = this.float_buffer_1.subarray(treeSize * 31, (treeSize * 31) + treeSize);
	this.fld_second_childs_tweenmax_last = this.float_buffer_1.subarray(treeSize * 32, (treeSize * 32) + treeSize);
	this.fld_second_childs_tweenmin_init = this.float_buffer_1.subarray(treeSize * 33, (treeSize * 33) + treeSize);
	this.fld_second_childs_tweenmin_last = this.float_buffer_1.subarray(treeSize * 34, (treeSize * 34) + treeSize);
	this.fld_second_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 58, (treeSize * 58) + treeSize);
	this.fld_second_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 59, (treeSize * 59) + treeSize);
	this.fld_second_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 66, (treeSize * 66) + treeSize);
	this.fld_second_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 67, (treeSize * 67) + treeSize);
	this.fld_second_childs_x_init = this.float_buffer_1.subarray(treeSize * 39, (treeSize * 39) + treeSize);
	this.fld_second_childs_x_last = this.float_buffer_1.subarray(treeSize * 40, (treeSize * 40) + treeSize);
	this.fld_second_childs_xoffset_init = this.int_buffer_1.subarray(treeSize * 54, (treeSize * 54) + treeSize);
	this.fld_second_childs_xoffset_last = this.int_buffer_1.subarray(treeSize * 55, (treeSize * 55) + treeSize);
	this.fld_second_childs_yoffset_init = this.int_buffer_1.subarray(treeSize * 52, (treeSize * 52) + treeSize);
	this.fld_second_childs_yoffset_last = this.int_buffer_1.subarray(treeSize * 53, (treeSize * 53) + treeSize);
	this.fld_second_len = this.int_buffer_1.subarray(treeSize * 46, (treeSize * 46) + treeSize);
	this.fld_second_len_init = this.int_buffer_1.subarray(treeSize * 48, (treeSize * 48) + treeSize);
	this.fld_second_len_last = this.int_buffer_1.subarray(treeSize * 49, (treeSize * 49) + treeSize);
	this.fld_second___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 41, (treeSize * 41) + treeSize);
	this.fld_second___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 60, (treeSize * 60) + treeSize);
	this.fld_second___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 61, (treeSize * 61) + treeSize);
	this.fld_second___draw__ = this.int_buffer_1.subarray(treeSize * 44, (treeSize * 44) + treeSize);
	this.fld_second___draw__0 = this.int_buffer_1.subarray(treeSize * 43, (treeSize * 43) + treeSize);
	this.fld_second___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 45, (treeSize * 45) + treeSize);
	this.fld_second___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 42, (treeSize * 42) + treeSize);
	this.fld_secondi_depth = this.int_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_secondi_height = this.float_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_secondi_minradius = this.float_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_secondi_radius = this.float_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_secondi_rotation = this.int_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_secondi_rx = this.float_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_secondi_tweenmax = this.float_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_secondi_tweenmin = this.float_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_secondi___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_secondi___renderoffset__ = this.int_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_secondi___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_secondi___rendersize__ = this.int_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_secondi_w = this.float_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_secondi_x = this.float_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_secondi_xoffset = this.int_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_secondi_yoffset = this.int_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_spike_enableshadow = this.int_buffer_1.subarray(treeSize * 103, (treeSize * 103) + treeSize);
	this.fld_spike_ison = this.int_buffer_1.subarray(treeSize * 104, (treeSize * 104) + treeSize);
	this.fld_spike___draw__ = this.int_buffer_1.subarray(treeSize * 101, (treeSize * 101) + treeSize);
	this.fld_spike___draw__0 = this.int_buffer_1.subarray(treeSize * 99, (treeSize * 99) + treeSize);
	this.fld_spike___draw__1 = this.int_buffer_1.subarray(treeSize * 100, (treeSize * 100) + treeSize);
	this.fld_spike___draw__2 = this.int_buffer_1.subarray(treeSize * 95, (treeSize * 95) + treeSize);
	this.fld_spike___draw__3 = this.int_buffer_1.subarray(treeSize * 96, (treeSize * 96) + treeSize);
	this.fld_spike___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 102, (treeSize * 102) + treeSize);
	this.fld_spike___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 98, (treeSize * 98) + treeSize);
	this.fld_spike___selfrendersize__1 = this.int_buffer_1.subarray(treeSize * 97, (treeSize * 97) + treeSize);
	this.fld_spike___selfrendersize__2 = this.int_buffer_1.subarray(treeSize * 94, (treeSize * 94) + treeSize);
	this.fld_spike___selfrendersize__3 = this.int_buffer_1.subarray(treeSize * 93, (treeSize * 93) + treeSize);
	this.id = this.nodeindex_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.left_siblings = this.nodeindex_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.parent = this.nodeindex_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.refname = this.grammartokens_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.right_siblings = this.nodeindex_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
};


this._gen_copyHostBuffers = function (data, treeSize){
	for(var i = 0; i < data.int_buffer_1.length; i++) {
		this.int_buffer_1[i] = data.int_buffer_1[i];
	}

	for(var i = 0; i < data.float_buffer_1.length; i++) {
		this.float_buffer_1[i] = data.float_buffer_1[i];
	}

	for(var i = 0; i < data.grammartokens_buffer_1.length; i++) {
		this.grammartokens_buffer_1[i] = data.grammartokens_buffer_1[i];
	}

	for(var i = 0; i < data.nodeindex_buffer_1.length; i++) {
		this.nodeindex_buffer_1[i] = data.nodeindex_buffer_1[i];
	}

};


// Creates proxy object to wrap every field in the tree. Both host and cl buffers must be allocated
// before calling this function.
this._gen_allocateProxyObjects = function() {
	this.proxyData.displayname = new CLDataWrapper(this, this.displayname, this.cl_grammartokens_buffer_1);
	this.proxyData.fld_generator_angle = new CLDataWrapper(this, this.fld_generator_angle, this.cl_float_buffer_1);
	this.proxyData.fld_generator_child_childs_count = new CLDataWrapper(this, this.fld_generator_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_generator_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_generator_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_generator_childs_angle_init = new CLDataWrapper(this, this.fld_generator_childs_angle_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_angle_last = new CLDataWrapper(this, this.fld_generator_childs_angle_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_depth_init = new CLDataWrapper(this, this.fld_generator_childs_depth_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_depth_last = new CLDataWrapper(this, this.fld_generator_childs_depth_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_height_init = new CLDataWrapper(this, this.fld_generator_childs_height_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_height_last = new CLDataWrapper(this, this.fld_generator_childs_height_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_idx_init = new CLDataWrapper(this, this.fld_generator_childs_idx_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_idx_last = new CLDataWrapper(this, this.fld_generator_childs_idx_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_increment_init = new CLDataWrapper(this, this.fld_generator_childs_increment_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_increment_last = new CLDataWrapper(this, this.fld_generator_childs_increment_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_isfirst_init = new CLDataWrapper(this, this.fld_generator_childs_isfirst_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_isfirst_last = new CLDataWrapper(this, this.fld_generator_childs_isfirst_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_islast_init = new CLDataWrapper(this, this.fld_generator_childs_islast_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_islast_last = new CLDataWrapper(this, this.fld_generator_childs_islast_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_minradius_init = new CLDataWrapper(this, this.fld_generator_childs_minradius_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_minradius_last = new CLDataWrapper(this, this.fld_generator_childs_minradius_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_radius_init = new CLDataWrapper(this, this.fld_generator_childs_radius_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_radius_last = new CLDataWrapper(this, this.fld_generator_childs_radius_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_rotation_init = new CLDataWrapper(this, this.fld_generator_childs_rotation_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_rotation_last = new CLDataWrapper(this, this.fld_generator_childs_rotation_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_tween_init = new CLDataWrapper(this, this.fld_generator_childs_tween_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_tween_last = new CLDataWrapper(this, this.fld_generator_childs_tween_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_tweenmax_init = new CLDataWrapper(this, this.fld_generator_childs_tweenmax_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_tweenmax_last = new CLDataWrapper(this, this.fld_generator_childs_tweenmax_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_tweenmin_init = new CLDataWrapper(this, this.fld_generator_childs_tweenmin_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_tweenmin_last = new CLDataWrapper(this, this.fld_generator_childs_tweenmin_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_generator_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_generator_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_generator_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_generator_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_valcopy_init = new CLDataWrapper(this, this.fld_generator_childs_valcopy_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_valcopy_last = new CLDataWrapper(this, this.fld_generator_childs_valcopy_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_valprev_init = new CLDataWrapper(this, this.fld_generator_childs_valprev_init, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_valprev_last = new CLDataWrapper(this, this.fld_generator_childs_valprev_last, this.cl_float_buffer_1);
	this.proxyData.fld_generator_childs_xoffset_init = new CLDataWrapper(this, this.fld_generator_childs_xoffset_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_xoffset_last = new CLDataWrapper(this, this.fld_generator_childs_xoffset_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_yoffset_init = new CLDataWrapper(this, this.fld_generator_childs_yoffset_init, this.cl_int_buffer_1);
	this.proxyData.fld_generator_childs_yoffset_last = new CLDataWrapper(this, this.fld_generator_childs_yoffset_last, this.cl_int_buffer_1);
	this.proxyData.fld_generator_increment = new CLDataWrapper(this, this.fld_generator_increment, this.cl_float_buffer_1);
	this.proxyData.fld_generator_numspikes = new CLDataWrapper(this, this.fld_generator_numspikes, this.cl_int_buffer_1);
	this.proxyData.fld_generator___childsrendersize__ = new CLDataWrapper(this, this.fld_generator___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_generator___childsrendersize___init = new CLDataWrapper(this, this.fld_generator___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_generator___childsrendersize___last = new CLDataWrapper(this, this.fld_generator___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_generator___draw__ = new CLDataWrapper(this, this.fld_generator___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_generator___selfrendersize__ = new CLDataWrapper(this, this.fld_generator___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_depth = new CLDataWrapper(this, this.fld_iroot_depth, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_height = new CLDataWrapper(this, this.fld_iroot_height, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_minradius = new CLDataWrapper(this, this.fld_iroot_minradius, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_radius = new CLDataWrapper(this, this.fld_iroot_radius, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_rotation = new CLDataWrapper(this, this.fld_iroot_rotation, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_tweenmax = new CLDataWrapper(this, this.fld_iroot_tweenmax, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_tweenmin = new CLDataWrapper(this, this.fld_iroot_tweenmin, this.cl_float_buffer_1);
	this.proxyData.fld_iroot___dorenderinglast__ = new CLDataWrapper(this, this.fld_iroot___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderoffset__ = new CLDataWrapper(this, this.fld_iroot___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderrightoffset__ = new CLDataWrapper(this, this.fld_iroot___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___rendersize__ = new CLDataWrapper(this, this.fld_iroot___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_xoffset = new CLDataWrapper(this, this.fld_iroot_xoffset, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_yoffset = new CLDataWrapper(this, this.fld_iroot_yoffset, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_angle = new CLDataWrapper(this, this.fld_leaf_angle, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_depth = new CLDataWrapper(this, this.fld_leaf_depth, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_height = new CLDataWrapper(this, this.fld_leaf_height, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_idx = new CLDataWrapper(this, this.fld_leaf_idx, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_increment = new CLDataWrapper(this, this.fld_leaf_increment, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_isfirst = new CLDataWrapper(this, this.fld_leaf_isfirst, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_islast = new CLDataWrapper(this, this.fld_leaf_islast, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_minradius = new CLDataWrapper(this, this.fld_leaf_minradius, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_radius = new CLDataWrapper(this, this.fld_leaf_radius, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_rotation = new CLDataWrapper(this, this.fld_leaf_rotation, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_tween = new CLDataWrapper(this, this.fld_leaf_tween, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_tweenmax = new CLDataWrapper(this, this.fld_leaf_tweenmax, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_tweenmin = new CLDataWrapper(this, this.fld_leaf_tweenmin, this.cl_float_buffer_1);
	this.proxyData.fld_leaf___dorenderinglast__ = new CLDataWrapper(this, this.fld_leaf___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___renderoffset__ = new CLDataWrapper(this, this.fld_leaf___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___renderrightoffset__ = new CLDataWrapper(this, this.fld_leaf___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___rendersize__ = new CLDataWrapper(this, this.fld_leaf___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_val = new CLDataWrapper(this, this.fld_leaf_val, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_valcopy = new CLDataWrapper(this, this.fld_leaf_valcopy, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_valprev = new CLDataWrapper(this, this.fld_leaf_valprev, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_xoffset = new CLDataWrapper(this, this.fld_leaf_xoffset, this.cl_int_buffer_1);
	this.proxyData.fld_leaf_yoffset = new CLDataWrapper(this, this.fld_leaf_yoffset, this.cl_int_buffer_1);
	this.proxyData.fld_node_depth = new CLDataWrapper(this, this.fld_node_depth, this.cl_int_buffer_1);
	this.proxyData.fld_node_height = new CLDataWrapper(this, this.fld_node_height, this.cl_float_buffer_1);
	this.proxyData.fld_node_idx = new CLDataWrapper(this, this.fld_node_idx, this.cl_int_buffer_1);
	this.proxyData.fld_node_levellength = new CLDataWrapper(this, this.fld_node_levellength, this.cl_int_buffer_1);
	this.proxyData.fld_node_minradius = new CLDataWrapper(this, this.fld_node_minradius, this.cl_float_buffer_1);
	this.proxyData.fld_node_radius = new CLDataWrapper(this, this.fld_node_radius, this.cl_float_buffer_1);
	this.proxyData.fld_node_rotation = new CLDataWrapper(this, this.fld_node_rotation, this.cl_int_buffer_1);
	this.proxyData.fld_node_rx = new CLDataWrapper(this, this.fld_node_rx, this.cl_float_buffer_1);
	this.proxyData.fld_node_tweenmax = new CLDataWrapper(this, this.fld_node_tweenmax, this.cl_float_buffer_1);
	this.proxyData.fld_node_tweenmin = new CLDataWrapper(this, this.fld_node_tweenmin, this.cl_float_buffer_1);
	this.proxyData.fld_node___dorenderinglast__ = new CLDataWrapper(this, this.fld_node___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderoffset__ = new CLDataWrapper(this, this.fld_node___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderrightoffset__ = new CLDataWrapper(this, this.fld_node___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___rendersize__ = new CLDataWrapper(this, this.fld_node___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_node_x = new CLDataWrapper(this, this.fld_node_x, this.cl_float_buffer_1);
	this.proxyData.fld_node_xoffset = new CLDataWrapper(this, this.fld_node_xoffset, this.cl_int_buffer_1);
	this.proxyData.fld_node_yoffset = new CLDataWrapper(this, this.fld_node_yoffset, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_child_count = new CLDataWrapper(this, this.fld_root_child_child_count, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_child_leftmost_child = new CLDataWrapper(this, this.fld_root_child_child_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_root___childrendersize__ = new CLDataWrapper(this, this.fld_root___childrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_root___draw__ = new CLDataWrapper(this, this.fld_root___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_root___selfrendersize__ = new CLDataWrapper(this, this.fld_root___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_second_child_childs_count = new CLDataWrapper(this, this.fld_second_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_second_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_second_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_second_childs_depth_init = new CLDataWrapper(this, this.fld_second_childs_depth_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_depth_last = new CLDataWrapper(this, this.fld_second_childs_depth_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_height_init = new CLDataWrapper(this, this.fld_second_childs_height_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_height_last = new CLDataWrapper(this, this.fld_second_childs_height_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_idx_init = new CLDataWrapper(this, this.fld_second_childs_idx_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_idx_last = new CLDataWrapper(this, this.fld_second_childs_idx_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_levellength_init = new CLDataWrapper(this, this.fld_second_childs_levellength_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_levellength_last = new CLDataWrapper(this, this.fld_second_childs_levellength_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_minradius_init = new CLDataWrapper(this, this.fld_second_childs_minradius_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_minradius_last = new CLDataWrapper(this, this.fld_second_childs_minradius_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_radius_init = new CLDataWrapper(this, this.fld_second_childs_radius_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_radius_last = new CLDataWrapper(this, this.fld_second_childs_radius_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_rotation_init = new CLDataWrapper(this, this.fld_second_childs_rotation_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_rotation_last = new CLDataWrapper(this, this.fld_second_childs_rotation_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_rx_init = new CLDataWrapper(this, this.fld_second_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_rx_last = new CLDataWrapper(this, this.fld_second_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_tweenmax_init = new CLDataWrapper(this, this.fld_second_childs_tweenmax_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_tweenmax_last = new CLDataWrapper(this, this.fld_second_childs_tweenmax_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_tweenmin_init = new CLDataWrapper(this, this.fld_second_childs_tweenmin_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_tweenmin_last = new CLDataWrapper(this, this.fld_second_childs_tweenmin_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_second_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_second_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_second_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_second_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_x_init = new CLDataWrapper(this, this.fld_second_childs_x_init, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_x_last = new CLDataWrapper(this, this.fld_second_childs_x_last, this.cl_float_buffer_1);
	this.proxyData.fld_second_childs_xoffset_init = new CLDataWrapper(this, this.fld_second_childs_xoffset_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_xoffset_last = new CLDataWrapper(this, this.fld_second_childs_xoffset_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_yoffset_init = new CLDataWrapper(this, this.fld_second_childs_yoffset_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_childs_yoffset_last = new CLDataWrapper(this, this.fld_second_childs_yoffset_last, this.cl_int_buffer_1);
	this.proxyData.fld_second_len = new CLDataWrapper(this, this.fld_second_len, this.cl_int_buffer_1);
	this.proxyData.fld_second_len_init = new CLDataWrapper(this, this.fld_second_len_init, this.cl_int_buffer_1);
	this.proxyData.fld_second_len_last = new CLDataWrapper(this, this.fld_second_len_last, this.cl_int_buffer_1);
	this.proxyData.fld_second___childsrendersize__ = new CLDataWrapper(this, this.fld_second___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_second___childsrendersize___init = new CLDataWrapper(this, this.fld_second___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_second___childsrendersize___last = new CLDataWrapper(this, this.fld_second___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_second___draw__ = new CLDataWrapper(this, this.fld_second___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_second___draw__0 = new CLDataWrapper(this, this.fld_second___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_second___selfrendersize__ = new CLDataWrapper(this, this.fld_second___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_second___selfrendersize__0 = new CLDataWrapper(this, this.fld_second___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_secondi_depth = new CLDataWrapper(this, this.fld_secondi_depth, this.cl_int_buffer_1);
	this.proxyData.fld_secondi_height = new CLDataWrapper(this, this.fld_secondi_height, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_minradius = new CLDataWrapper(this, this.fld_secondi_minradius, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_radius = new CLDataWrapper(this, this.fld_secondi_radius, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_rotation = new CLDataWrapper(this, this.fld_secondi_rotation, this.cl_int_buffer_1);
	this.proxyData.fld_secondi_rx = new CLDataWrapper(this, this.fld_secondi_rx, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_tweenmax = new CLDataWrapper(this, this.fld_secondi_tweenmax, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_tweenmin = new CLDataWrapper(this, this.fld_secondi_tweenmin, this.cl_float_buffer_1);
	this.proxyData.fld_secondi___dorenderinglast__ = new CLDataWrapper(this, this.fld_secondi___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_secondi___renderoffset__ = new CLDataWrapper(this, this.fld_secondi___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_secondi___renderrightoffset__ = new CLDataWrapper(this, this.fld_secondi___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_secondi___rendersize__ = new CLDataWrapper(this, this.fld_secondi___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_secondi_w = new CLDataWrapper(this, this.fld_secondi_w, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_x = new CLDataWrapper(this, this.fld_secondi_x, this.cl_float_buffer_1);
	this.proxyData.fld_secondi_xoffset = new CLDataWrapper(this, this.fld_secondi_xoffset, this.cl_int_buffer_1);
	this.proxyData.fld_secondi_yoffset = new CLDataWrapper(this, this.fld_secondi_yoffset, this.cl_int_buffer_1);
	this.proxyData.fld_spike_enableshadow = new CLDataWrapper(this, this.fld_spike_enableshadow, this.cl_int_buffer_1);
	this.proxyData.fld_spike_ison = new CLDataWrapper(this, this.fld_spike_ison, this.cl_int_buffer_1);
	this.proxyData.fld_spike___draw__ = new CLDataWrapper(this, this.fld_spike___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_spike___draw__0 = new CLDataWrapper(this, this.fld_spike___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_spike___draw__1 = new CLDataWrapper(this, this.fld_spike___draw__1, this.cl_int_buffer_1);
	this.proxyData.fld_spike___draw__2 = new CLDataWrapper(this, this.fld_spike___draw__2, this.cl_int_buffer_1);
	this.proxyData.fld_spike___draw__3 = new CLDataWrapper(this, this.fld_spike___draw__3, this.cl_int_buffer_1);
	this.proxyData.fld_spike___selfrendersize__ = new CLDataWrapper(this, this.fld_spike___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_spike___selfrendersize__0 = new CLDataWrapper(this, this.fld_spike___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_spike___selfrendersize__1 = new CLDataWrapper(this, this.fld_spike___selfrendersize__1, this.cl_int_buffer_1);
	this.proxyData.fld_spike___selfrendersize__2 = new CLDataWrapper(this, this.fld_spike___selfrendersize__2, this.cl_int_buffer_1);
	this.proxyData.fld_spike___selfrendersize__3 = new CLDataWrapper(this, this.fld_spike___selfrendersize__3, this.cl_int_buffer_1);
	this.proxyData.id = new CLDataWrapper(this, this.id, this.cl_nodeindex_buffer_1);
	this.proxyData.left_siblings = new CLDataWrapper(this, this.left_siblings, this.cl_nodeindex_buffer_1);
	this.proxyData.parent = new CLDataWrapper(this, this.parent, this.cl_nodeindex_buffer_1);
	this.proxyData.refname = new CLDataWrapper(this, this.refname, this.cl_grammartokens_buffer_1);
	this.proxyData.right_siblings = new CLDataWrapper(this, this.right_siblings, this.cl_nodeindex_buffer_1);
};

this.getRenderBufferSize = function() {
	return this.proxyData.fld_iroot___rendersize__.get(0);
};

this.classToToken = function (classStr) {
	switch(classStr.toUpperCase()) {
		case "CHILD":
			return 5;
			break;
		case "CHILDS":
			return 6;
			break;
		case "UNDEFINED":
			return 13;
			break;
		case "ROOT":
			return 9;
			break;
		case "SECOND":
			return 10;
			break;
		case "GENERATOR":
			return 7;
			break;
		case "SPIKE":
			return 11;
			break;
		case "IGNORE":
			return 8;
			break;
		case "TEXTBOX":
			return 12;
			break;
		default:
			console.error("unknown class tag " +classStr);
			throw 'Superconductor data flattening exn';
	}
};


this.classToIFace = function (classStr) {
	switch(classStr.toUpperCase()) {
		case "ROOT":
			return "iroot";
			break;
		case "SECOND":
			return "secondi";
			break;
		case "GENERATOR":
			return "node";
			break;
		case "SPIKE":
			return "leaf";
			break;
	}
};


	this.inputs = [
		"val"		, "tweenMax"		, "yOffset"		, "height"		, "xOffset"		, "rotation"		, "minRadius"		, "glBufferMacro"		, "radius"		, "refname"		, "display"		, "tweenMin"	];



this.offsets = "enum unionvariants {TOK_GENERATOR = 7, TOK_CHILD = 5, TOK_ROOT = 9, TOK_IGNORE = 8, TOK_SPIKE = 11, TOK_CHILDS = 6, TOK_UNDEFINED = 13, TOK_SECOND = 10, TOK_TEXTBOX = 12};\n\n// Generated code. Modifcation to this file will be lost on next code generation.\n\n/**\n * @file   cl_runner_generated_buffer_info.h\n * @author Superconductor v0.1\n * @date   10/03/2014 11:19:34\n * @brief  Contains macros needed to access fields within monolithic OpenCL\n * buffers.\n * \n * @warning Generated code. Modifcation to this file will be lost on next\n * code generation.\n *\n * This file defines several sets of macros intended for use with the \n * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic\n * buffers are a way of packing multiple different fields (represented by\n * structure-split arrays) into a single OpenCL buffer so as to minimize the\n * number of arguments needed to be passed to OpenCL.\n *\n * The macros contained here are of three classes:\n * @li @c buffer_name_size The number of fields packed into buffer buffer_name.\n * @li @c NUM_BUFFERS The total number of buffers define herein.\n * @li @c fld_class_property(node_idx) Macro to access the specified property of\n * for the node at node_idx.\n */\n\n#define INT_BUFFER_1_SIZE 105\n#define FLOAT_BUFFER_1_SIZE 67\n#define GRAMMARTOKENS_BUFFER_1_SIZE 2\n#define NODEINDEX_BUFFER_1_SIZE 7\n\n#define fld_second_childs_minradius_last(node_idx) float_buffer_1[tree_size * 38 + node_idx]\n#define FLD_SECOND_CHILDS_MINRADIUS_LAST_POSITION 38\n#define FLD_SECOND_CHILDS_MINRADIUS_LAST_BUFFER float_buffer_1\n#define fld_leaf_yoffset(node_idx) int_buffer_1[tree_size * 27 + node_idx]\n#define FLD_LEAF_YOFFSET_POSITION 27\n#define FLD_LEAF_YOFFSET_BUFFER int_buffer_1\n#define fld_generator_childs_radius_init(node_idx) float_buffer_1[tree_size * 61 + node_idx]\n#define FLD_GENERATOR_CHILDS_RADIUS_INIT_POSITION 61\n#define FLD_GENERATOR_CHILDS_RADIUS_INIT_BUFFER float_buffer_1\n#define fld_iroot_depth(node_idx) int_buffer_1[tree_size * 4 + node_idx]\n#define FLD_IROOT_DEPTH_POSITION 4\n#define FLD_IROOT_DEPTH_BUFFER int_buffer_1\n#define fld_generator_childs_xoffset_init(node_idx) int_buffer_1[tree_size * 79 + node_idx]\n#define FLD_GENERATOR_CHILDS_XOFFSET_INIT_POSITION 79\n#define FLD_GENERATOR_CHILDS_XOFFSET_INIT_BUFFER int_buffer_1\n#define fld_iroot_tweenmax(node_idx) float_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_TWEENMAX_POSITION 0\n#define FLD_IROOT_TWEENMAX_BUFFER float_buffer_1\n#define fld_spike___selfrendersize__2(node_idx) int_buffer_1[tree_size * 94 + node_idx]\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE2_POSITION 94\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE2_BUFFER int_buffer_1\n#define fld_generator_childs_valprev_last(node_idx) float_buffer_1[tree_size * 50 + node_idx]\n#define FLD_GENERATOR_CHILDS_VALPREV_LAST_POSITION 50\n#define FLD_GENERATOR_CHILDS_VALPREV_LAST_BUFFER float_buffer_1\n#define fld_second_childs_xoffset_init(node_idx) int_buffer_1[tree_size * 54 + node_idx]\n#define FLD_SECOND_CHILDS_XOFFSET_INIT_POSITION 54\n#define FLD_SECOND_CHILDS_XOFFSET_INIT_BUFFER int_buffer_1\n#define fld_generator_childs_rotation_init(node_idx) int_buffer_1[tree_size * 75 + node_idx]\n#define FLD_GENERATOR_CHILDS_ROTATION_INIT_POSITION 75\n#define FLD_GENERATOR_CHILDS_ROTATION_INIT_BUFFER int_buffer_1\n#define fld_iroot_minradius(node_idx) float_buffer_1[tree_size * 2 + node_idx]\n#define FLD_IROOT_MINRADIUS_POSITION 2\n#define FLD_IROOT_MINRADIUS_BUFFER float_buffer_1\n#define fld_second_childs_xoffset_last(node_idx) int_buffer_1[tree_size * 55 + node_idx]\n#define FLD_SECOND_CHILDS_XOFFSET_LAST_POSITION 55\n#define FLD_SECOND_CHILDS_XOFFSET_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_yoffset_init(node_idx) int_buffer_1[tree_size * 77 + node_idx]\n#define FLD_GENERATOR_CHILDS_YOFFSET_INIT_POSITION 77\n#define FLD_GENERATOR_CHILDS_YOFFSET_INIT_BUFFER int_buffer_1\n#define fld_iroot___renderrightoffset__(node_idx) int_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 0\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define left_siblings(node_idx) nodeindex_buffer_1[tree_size * 4 + node_idx]\n#define LEFT_SIBLINGS_POSITION 4\n#define LEFT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_spike___selfrendersize__(node_idx) int_buffer_1[tree_size * 102 + node_idx]\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 102\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator___draw__(node_idx) int_buffer_1[tree_size * 70 + node_idx]\n#define FLD_GENERATOR_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 70\n#define FLD_GENERATOR_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second_childs_rotation_init(node_idx) int_buffer_1[tree_size * 50 + node_idx]\n#define FLD_SECOND_CHILDS_ROTATION_INIT_POSITION 50\n#define FLD_SECOND_CHILDS_ROTATION_INIT_BUFFER int_buffer_1\n#define fld_secondi_radius(node_idx) float_buffer_1[tree_size * 9 + node_idx]\n#define FLD_SECONDI_RADIUS_POSITION 9\n#define FLD_SECONDI_RADIUS_BUFFER float_buffer_1\n#define fld_root_child_child_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 0 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_POSITION 0\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_spike___selfrendersize__0(node_idx) int_buffer_1[tree_size * 98 + node_idx]\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 98\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_second_childs_depth_last(node_idx) int_buffer_1[tree_size * 65 + node_idx]\n#define FLD_SECOND_CHILDS_DEPTH_LAST_POSITION 65\n#define FLD_SECOND_CHILDS_DEPTH_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_increment_last(node_idx) float_buffer_1[tree_size * 52 + node_idx]\n#define FLD_GENERATOR_CHILDS_INCREMENT_LAST_POSITION 52\n#define FLD_GENERATOR_CHILDS_INCREMENT_LAST_BUFFER float_buffer_1\n#define fld_spike___selfrendersize__3(node_idx) int_buffer_1[tree_size * 93 + node_idx]\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE3_POSITION 93\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE3_BUFFER int_buffer_1\n#define fld_generator_angle(node_idx) float_buffer_1[tree_size * 46 + node_idx]\n#define FLD_GENERATOR_ANGLE_POSITION 46\n#define FLD_GENERATOR_ANGLE_BUFFER float_buffer_1\n#define fld_secondi_xoffset(node_idx) int_buffer_1[tree_size * 12 + node_idx]\n#define FLD_SECONDI_XOFFSET_POSITION 12\n#define FLD_SECONDI_XOFFSET_BUFFER int_buffer_1\n#define fld_generator_childs_valcopy_last(node_idx) float_buffer_1[tree_size * 64 + node_idx]\n#define FLD_GENERATOR_CHILDS_VALCOPY_LAST_POSITION 64\n#define FLD_GENERATOR_CHILDS_VALCOPY_LAST_BUFFER float_buffer_1\n#define fld_leaf_val(node_idx) float_buffer_1[tree_size * 30 + node_idx]\n#define FLD_LEAF_VAL_POSITION 30\n#define FLD_LEAF_VAL_BUFFER float_buffer_1\n#define fld_secondi_yoffset(node_idx) int_buffer_1[tree_size * 8 + node_idx]\n#define FLD_SECONDI_YOFFSET_POSITION 8\n#define FLD_SECONDI_YOFFSET_BUFFER int_buffer_1\n#define fld_second_childs_rx_last(node_idx) float_buffer_1[tree_size * 36 + node_idx]\n#define FLD_SECOND_CHILDS_RX_LAST_POSITION 36\n#define FLD_SECOND_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_secondi_rx(node_idx) float_buffer_1[tree_size * 11 + node_idx]\n#define FLD_SECONDI_RX_POSITION 11\n#define FLD_SECONDI_RX_BUFFER float_buffer_1\n#define fld_leaf_depth(node_idx) int_buffer_1[tree_size * 32 + node_idx]\n#define FLD_LEAF_DEPTH_POSITION 32\n#define FLD_LEAF_DEPTH_BUFFER int_buffer_1\n#define fld_spike___selfrendersize__1(node_idx) int_buffer_1[tree_size * 97 + node_idx]\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE1_POSITION 97\n#define FLD_SPIKE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE1_BUFFER int_buffer_1\n#define fld_spike___draw__0(node_idx) int_buffer_1[tree_size * 99 + node_idx]\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 99\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_second_childs_height_last(node_idx) float_buffer_1[tree_size * 42 + node_idx]\n#define FLD_SECOND_CHILDS_HEIGHT_LAST_POSITION 42\n#define FLD_SECOND_CHILDS_HEIGHT_LAST_BUFFER float_buffer_1\n#define id(node_idx) nodeindex_buffer_1[tree_size * 6 + node_idx]\n#define ID_POSITION 6\n#define ID_BUFFER nodeindex_buffer_1\n#define fld_iroot_xoffset(node_idx) int_buffer_1[tree_size * 6 + node_idx]\n#define FLD_IROOT_XOFFSET_POSITION 6\n#define FLD_IROOT_XOFFSET_BUFFER int_buffer_1\n#define fld_leaf_islast(node_idx) int_buffer_1[tree_size * 26 + node_idx]\n#define FLD_LEAF_ISLAST_POSITION 26\n#define FLD_LEAF_ISLAST_BUFFER int_buffer_1\n#define fld_leaf_increment(node_idx) float_buffer_1[tree_size * 20 + node_idx]\n#define FLD_LEAF_INCREMENT_POSITION 20\n#define FLD_LEAF_INCREMENT_BUFFER float_buffer_1\n#define fld_leaf_minradius(node_idx) float_buffer_1[tree_size * 26 + node_idx]\n#define FLD_LEAF_MINRADIUS_POSITION 26\n#define FLD_LEAF_MINRADIUS_BUFFER float_buffer_1\n#define fld_generator___childsrendersize__(node_idx) int_buffer_1[tree_size * 69 + node_idx]\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 69\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_iroot_tweenmin(node_idx) float_buffer_1[tree_size * 4 + node_idx]\n#define FLD_IROOT_TWEENMIN_POSITION 4\n#define FLD_IROOT_TWEENMIN_BUFFER float_buffer_1\n#define fld_second_childs_minradius_init(node_idx) float_buffer_1[tree_size * 37 + node_idx]\n#define FLD_SECOND_CHILDS_MINRADIUS_INIT_POSITION 37\n#define FLD_SECOND_CHILDS_MINRADIUS_INIT_BUFFER float_buffer_1\n#define fld_second_childs_rx_init(node_idx) float_buffer_1[tree_size * 35 + node_idx]\n#define FLD_SECOND_CHILDS_RX_INIT_POSITION 35\n#define FLD_SECOND_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_node_idx(node_idx) int_buffer_1[tree_size * 17 + node_idx]\n#define FLD_NODE_IDX_POSITION 17\n#define FLD_NODE_IDX_BUFFER int_buffer_1\n#define fld_generator___childsrendersize___last(node_idx) int_buffer_1[tree_size * 86 + node_idx]\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 86\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_height_last(node_idx) float_buffer_1[tree_size * 58 + node_idx]\n#define FLD_GENERATOR_CHILDS_HEIGHT_LAST_POSITION 58\n#define FLD_GENERATOR_CHILDS_HEIGHT_LAST_BUFFER float_buffer_1\n#define fld_node___rendersize__(node_idx) int_buffer_1[tree_size * 24 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 24\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_secondi___rendersize__(node_idx) int_buffer_1[tree_size * 15 + node_idx]\n#define FLD_SECONDI_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 15\n#define FLD_SECONDI_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_iroot_radius(node_idx) float_buffer_1[tree_size * 3 + node_idx]\n#define FLD_IROOT_RADIUS_POSITION 3\n#define FLD_IROOT_RADIUS_BUFFER float_buffer_1\n#define fld_leaf___renderrightoffset__(node_idx) int_buffer_1[tree_size * 29 + node_idx]\n#define FLD_LEAF_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 29\n#define FLD_LEAF_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_root___childrendersize__(node_idx) int_buffer_1[tree_size * 39 + node_idx]\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_POSITION 39\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator_childs_minradius_init(node_idx) float_buffer_1[tree_size * 55 + node_idx]\n#define FLD_GENERATOR_CHILDS_MINRADIUS_INIT_POSITION 55\n#define FLD_GENERATOR_CHILDS_MINRADIUS_INIT_BUFFER float_buffer_1\n#define refname(node_idx) grammartokens_buffer_1[tree_size * 1 + node_idx]\n#define REFNAME_POSITION 1\n#define REFNAME_BUFFER grammartokens_buffer_1\n#define fld_leaf_idx(node_idx) int_buffer_1[tree_size * 28 + node_idx]\n#define FLD_LEAF_IDX_POSITION 28\n#define FLD_LEAF_IDX_BUFFER int_buffer_1\n#define fld_node_x(node_idx) float_buffer_1[tree_size * 19 + node_idx]\n#define FLD_NODE_X_POSITION 19\n#define FLD_NODE_X_BUFFER float_buffer_1\n#define fld_leaf_height(node_idx) float_buffer_1[tree_size * 25 + node_idx]\n#define FLD_LEAF_HEIGHT_POSITION 25\n#define FLD_LEAF_HEIGHT_BUFFER float_buffer_1\n#define fld_leaf___renderoffset__(node_idx) int_buffer_1[tree_size * 35 + node_idx]\n#define FLD_LEAF_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 35\n#define FLD_LEAF_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 58 + node_idx]\n#define FLD_SECOND_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 58\n#define FLD_SECOND_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_secondi___dorenderinglast__(node_idx) int_buffer_1[tree_size * 10 + node_idx]\n#define FLD_SECONDI_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 10\n#define FLD_SECONDI_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_leaf___rendersize__(node_idx) int_buffer_1[tree_size * 36 + node_idx]\n#define FLD_LEAF_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 36\n#define FLD_LEAF_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define right_siblings(node_idx) nodeindex_buffer_1[tree_size * 3 + node_idx]\n#define RIGHT_SIBLINGS_POSITION 3\n#define RIGHT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_second_childs_tweenmax_init(node_idx) float_buffer_1[tree_size * 31 + node_idx]\n#define FLD_SECOND_CHILDS_TWEENMAX_INIT_POSITION 31\n#define FLD_SECOND_CHILDS_TWEENMAX_INIT_BUFFER float_buffer_1\n#define fld_second_childs_yoffset_last(node_idx) int_buffer_1[tree_size * 53 + node_idx]\n#define FLD_SECOND_CHILDS_YOFFSET_LAST_POSITION 53\n#define FLD_SECOND_CHILDS_YOFFSET_LAST_BUFFER int_buffer_1\n#define fld_second_childs_radius_init(node_idx) float_buffer_1[tree_size * 43 + node_idx]\n#define FLD_SECOND_CHILDS_RADIUS_INIT_POSITION 43\n#define FLD_SECOND_CHILDS_RADIUS_INIT_BUFFER float_buffer_1\n#define displayname(node_idx) grammartokens_buffer_1[tree_size * 0 + node_idx]\n#define DISPLAYNAME_POSITION 0\n#define DISPLAYNAME_BUFFER grammartokens_buffer_1\n#define fld_node_yoffset(node_idx) int_buffer_1[tree_size * 16 + node_idx]\n#define FLD_NODE_YOFFSET_POSITION 16\n#define FLD_NODE_YOFFSET_BUFFER int_buffer_1\n#define fld_spike___draw__(node_idx) int_buffer_1[tree_size * 101 + node_idx]\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 101\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator_childs_idx_last(node_idx) int_buffer_1[tree_size * 82 + node_idx]\n#define FLD_GENERATOR_CHILDS_IDX_LAST_POSITION 82\n#define FLD_GENERATOR_CHILDS_IDX_LAST_BUFFER int_buffer_1\n#define fld_generator_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 2 + node_idx]\n#define FLD_GENERATOR_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 2\n#define FLD_GENERATOR_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_second_childs_depth_init(node_idx) int_buffer_1[tree_size * 64 + node_idx]\n#define FLD_SECOND_CHILDS_DEPTH_INIT_POSITION 64\n#define FLD_SECOND_CHILDS_DEPTH_INIT_BUFFER int_buffer_1\n#define fld_generator_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 83 + node_idx]\n#define FLD_GENERATOR_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 83\n#define FLD_GENERATOR_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_secondi___renderoffset__(node_idx) int_buffer_1[tree_size * 14 + node_idx]\n#define FLD_SECONDI_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 14\n#define FLD_SECONDI_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_leaf_tweenmin(node_idx) float_buffer_1[tree_size * 29 + node_idx]\n#define FLD_LEAF_TWEENMIN_POSITION 29\n#define FLD_LEAF_TWEENMIN_BUFFER float_buffer_1\n#define fld_leaf___dorenderinglast__(node_idx) int_buffer_1[tree_size * 31 + node_idx]\n#define FLD_LEAF_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 31\n#define FLD_LEAF_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator_childs_idx_init(node_idx) int_buffer_1[tree_size * 81 + node_idx]\n#define FLD_GENERATOR_CHILDS_IDX_INIT_POSITION 81\n#define FLD_GENERATOR_CHILDS_IDX_INIT_BUFFER int_buffer_1\n#define fld_generator_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 84 + node_idx]\n#define FLD_GENERATOR_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 84\n#define FLD_GENERATOR_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_secondi_depth(node_idx) int_buffer_1[tree_size * 11 + node_idx]\n#define FLD_SECONDI_DEPTH_POSITION 11\n#define FLD_SECONDI_DEPTH_BUFFER int_buffer_1\n#define fld_second___childsrendersize___init(node_idx) int_buffer_1[tree_size * 60 + node_idx]\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 60\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_leaf_angle(node_idx) float_buffer_1[tree_size * 22 + node_idx]\n#define FLD_LEAF_ANGLE_POSITION 22\n#define FLD_LEAF_ANGLE_BUFFER float_buffer_1\n#define fld_generator_childs_yoffset_last(node_idx) int_buffer_1[tree_size * 78 + node_idx]\n#define FLD_GENERATOR_CHILDS_YOFFSET_LAST_POSITION 78\n#define FLD_GENERATOR_CHILDS_YOFFSET_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_tweenmax_last(node_idx) float_buffer_1[tree_size * 48 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEENMAX_LAST_POSITION 48\n#define FLD_GENERATOR_CHILDS_TWEENMAX_LAST_BUFFER float_buffer_1\n#define fld_secondi_w(node_idx) float_buffer_1[tree_size * 5 + node_idx]\n#define FLD_SECONDI_W_POSITION 5\n#define FLD_SECONDI_W_BUFFER float_buffer_1\n#define fld_node_depth(node_idx) int_buffer_1[tree_size * 20 + node_idx]\n#define FLD_NODE_DEPTH_POSITION 20\n#define FLD_NODE_DEPTH_BUFFER int_buffer_1\n#define fld_second___childsrendersize___last(node_idx) int_buffer_1[tree_size * 61 + node_idx]\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 61\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_iroot_rotation(node_idx) int_buffer_1[tree_size * 7 + node_idx]\n#define FLD_IROOT_ROTATION_POSITION 7\n#define FLD_IROOT_ROTATION_BUFFER int_buffer_1\n#define fld_second_len(node_idx) int_buffer_1[tree_size * 46 + node_idx]\n#define FLD_SECOND_LEN_POSITION 46\n#define FLD_SECOND_LEN_BUFFER int_buffer_1\n#define fld_generator___childsrendersize___init(node_idx) int_buffer_1[tree_size * 85 + node_idx]\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 85\n#define FLD_GENERATOR_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_node_levellength(node_idx) int_buffer_1[tree_size * 25 + node_idx]\n#define FLD_NODE_LEVELLENGTH_POSITION 25\n#define FLD_NODE_LEVELLENGTH_BUFFER int_buffer_1\n#define fld_generator_childs_tween_last(node_idx) float_buffer_1[tree_size * 66 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEEN_LAST_POSITION 66\n#define FLD_GENERATOR_CHILDS_TWEEN_LAST_BUFFER float_buffer_1\n#define fld_secondi_tweenmin(node_idx) float_buffer_1[tree_size * 10 + node_idx]\n#define FLD_SECONDI_TWEENMIN_POSITION 10\n#define FLD_SECONDI_TWEENMIN_BUFFER float_buffer_1\n#define fld_root___selfrendersize__(node_idx) int_buffer_1[tree_size * 38 + node_idx]\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 38\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second_childs_levellength_init(node_idx) int_buffer_1[tree_size * 62 + node_idx]\n#define FLD_SECOND_CHILDS_LEVELLENGTH_INIT_POSITION 62\n#define FLD_SECOND_CHILDS_LEVELLENGTH_INIT_BUFFER int_buffer_1\n#define fld_second_childs_yoffset_init(node_idx) int_buffer_1[tree_size * 52 + node_idx]\n#define FLD_SECOND_CHILDS_YOFFSET_INIT_POSITION 52\n#define FLD_SECOND_CHILDS_YOFFSET_INIT_BUFFER int_buffer_1\n#define fld_iroot___dorenderinglast__(node_idx) int_buffer_1[tree_size * 3 + node_idx]\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 3\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_secondi_rotation(node_idx) int_buffer_1[tree_size * 13 + node_idx]\n#define FLD_SECONDI_ROTATION_POSITION 13\n#define FLD_SECONDI_ROTATION_BUFFER int_buffer_1\n#define fld_generator_child_childs_count(node_idx) int_buffer_1[tree_size * 72 + node_idx]\n#define FLD_GENERATOR_CHILD_CHILDS_COUNT_POSITION 72\n#define FLD_GENERATOR_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_spike_enableshadow(node_idx) int_buffer_1[tree_size * 103 + node_idx]\n#define FLD_SPIKE_ENABLESHADOW_POSITION 103\n#define FLD_SPIKE_ENABLESHADOW_BUFFER int_buffer_1\n#define fld_spike___draw__3(node_idx) int_buffer_1[tree_size * 96 + node_idx]\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE3_POSITION 96\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE3_BUFFER int_buffer_1\n#define fld_generator_childs_tween_init(node_idx) float_buffer_1[tree_size * 65 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEEN_INIT_POSITION 65\n#define FLD_GENERATOR_CHILDS_TWEEN_INIT_BUFFER float_buffer_1\n#define fld_iroot___rendersize__(node_idx) int_buffer_1[tree_size * 2 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 2\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_root___draw__(node_idx) int_buffer_1[tree_size * 37 + node_idx]\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 37\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator_childs_tweenmax_init(node_idx) float_buffer_1[tree_size * 47 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEENMAX_INIT_POSITION 47\n#define FLD_GENERATOR_CHILDS_TWEENMAX_INIT_BUFFER float_buffer_1\n#define fld_second_childs_x_last(node_idx) float_buffer_1[tree_size * 40 + node_idx]\n#define FLD_SECOND_CHILDS_X_LAST_POSITION 40\n#define FLD_SECOND_CHILDS_X_LAST_BUFFER float_buffer_1\n#define fld_generator_childs_islast_init(node_idx) int_buffer_1[tree_size * 87 + node_idx]\n#define FLD_GENERATOR_CHILDS_ISLAST_INIT_POSITION 87\n#define FLD_GENERATOR_CHILDS_ISLAST_INIT_BUFFER int_buffer_1\n#define fld_node_minradius(node_idx) float_buffer_1[tree_size * 15 + node_idx]\n#define FLD_NODE_MINRADIUS_POSITION 15\n#define FLD_NODE_MINRADIUS_BUFFER float_buffer_1\n#define fld_second_childs_levellength_last(node_idx) int_buffer_1[tree_size * 63 + node_idx]\n#define FLD_SECOND_CHILDS_LEVELLENGTH_LAST_POSITION 63\n#define FLD_SECOND_CHILDS_LEVELLENGTH_LAST_BUFFER int_buffer_1\n#define fld_node___dorenderinglast__(node_idx) int_buffer_1[tree_size * 19 + node_idx]\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 19\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second_childs_tweenmin_last(node_idx) float_buffer_1[tree_size * 34 + node_idx]\n#define FLD_SECOND_CHILDS_TWEENMIN_LAST_POSITION 34\n#define FLD_SECOND_CHILDS_TWEENMIN_LAST_BUFFER float_buffer_1\n#define fld_generator_childs_radius_last(node_idx) float_buffer_1[tree_size * 62 + node_idx]\n#define FLD_GENERATOR_CHILDS_RADIUS_LAST_POSITION 62\n#define FLD_GENERATOR_CHILDS_RADIUS_LAST_BUFFER float_buffer_1\n#define fld_generator_childs_tweenmin_last(node_idx) float_buffer_1[tree_size * 54 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEENMIN_LAST_POSITION 54\n#define FLD_GENERATOR_CHILDS_TWEENMIN_LAST_BUFFER float_buffer_1\n#define fld_second_childs_tweenmax_last(node_idx) float_buffer_1[tree_size * 32 + node_idx]\n#define FLD_SECOND_CHILDS_TWEENMAX_LAST_POSITION 32\n#define FLD_SECOND_CHILDS_TWEENMAX_LAST_BUFFER float_buffer_1\n#define fld_leaf_isfirst(node_idx) int_buffer_1[tree_size * 30 + node_idx]\n#define FLD_LEAF_ISFIRST_POSITION 30\n#define FLD_LEAF_ISFIRST_BUFFER int_buffer_1\n#define fld_second___selfrendersize__0(node_idx) int_buffer_1[tree_size * 42 + node_idx]\n#define FLD_SECOND_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 42\n#define FLD_SECOND_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_second___draw__(node_idx) int_buffer_1[tree_size * 44 + node_idx]\n#define FLD_SECOND_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 44\n#define FLD_SECOND_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_spike_ison(node_idx) int_buffer_1[tree_size * 104 + node_idx]\n#define FLD_SPIKE_ISON_POSITION 104\n#define FLD_SPIKE_ISON_BUFFER int_buffer_1\n#define fld_iroot_yoffset(node_idx) int_buffer_1[tree_size * 5 + node_idx]\n#define FLD_IROOT_YOFFSET_POSITION 5\n#define FLD_IROOT_YOFFSET_BUFFER int_buffer_1\n#define fld_generator_childs_valcopy_init(node_idx) float_buffer_1[tree_size * 63 + node_idx]\n#define FLD_GENERATOR_CHILDS_VALCOPY_INIT_POSITION 63\n#define FLD_GENERATOR_CHILDS_VALCOPY_INIT_BUFFER float_buffer_1\n#define fld_generator_childs_increment_init(node_idx) float_buffer_1[tree_size * 51 + node_idx]\n#define FLD_GENERATOR_CHILDS_INCREMENT_INIT_POSITION 51\n#define FLD_GENERATOR_CHILDS_INCREMENT_INIT_BUFFER float_buffer_1\n#define fld_generator_childs_angle_last(node_idx) float_buffer_1[tree_size * 60 + node_idx]\n#define FLD_GENERATOR_CHILDS_ANGLE_LAST_POSITION 60\n#define FLD_GENERATOR_CHILDS_ANGLE_LAST_BUFFER float_buffer_1\n#define fld_node_height(node_idx) float_buffer_1[tree_size * 14 + node_idx]\n#define FLD_NODE_HEIGHT_POSITION 14\n#define FLD_NODE_HEIGHT_BUFFER float_buffer_1\n#define fld_second_len_last(node_idx) int_buffer_1[tree_size * 49 + node_idx]\n#define FLD_SECOND_LEN_LAST_POSITION 49\n#define FLD_SECOND_LEN_LAST_BUFFER int_buffer_1\n#define fld_spike___draw__1(node_idx) int_buffer_1[tree_size * 100 + node_idx]\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE1_POSITION 100\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE1_BUFFER int_buffer_1\n#define fld_secondi_tweenmax(node_idx) float_buffer_1[tree_size * 6 + node_idx]\n#define FLD_SECONDI_TWEENMAX_POSITION 6\n#define FLD_SECONDI_TWEENMAX_BUFFER float_buffer_1\n#define fld_leaf_radius(node_idx) float_buffer_1[tree_size * 28 + node_idx]\n#define FLD_LEAF_RADIUS_POSITION 28\n#define FLD_LEAF_RADIUS_BUFFER float_buffer_1\n#define fld_generator_numspikes(node_idx) int_buffer_1[tree_size * 68 + node_idx]\n#define FLD_GENERATOR_NUMSPIKES_POSITION 68\n#define FLD_GENERATOR_NUMSPIKES_BUFFER int_buffer_1\n#define fld_second_childs_height_init(node_idx) float_buffer_1[tree_size * 41 + node_idx]\n#define FLD_SECOND_CHILDS_HEIGHT_INIT_POSITION 41\n#define FLD_SECOND_CHILDS_HEIGHT_INIT_BUFFER float_buffer_1\n#define fld_node_xoffset(node_idx) int_buffer_1[tree_size * 21 + node_idx]\n#define FLD_NODE_XOFFSET_POSITION 21\n#define FLD_NODE_XOFFSET_BUFFER int_buffer_1\n#define fld_generator_childs_valprev_init(node_idx) float_buffer_1[tree_size * 49 + node_idx]\n#define FLD_GENERATOR_CHILDS_VALPREV_INIT_POSITION 49\n#define FLD_GENERATOR_CHILDS_VALPREV_INIT_BUFFER float_buffer_1\n#define fld_generator_childs_depth_init(node_idx) int_buffer_1[tree_size * 89 + node_idx]\n#define FLD_GENERATOR_CHILDS_DEPTH_INIT_POSITION 89\n#define FLD_GENERATOR_CHILDS_DEPTH_INIT_BUFFER int_buffer_1\n#define fld_generator_increment(node_idx) float_buffer_1[tree_size * 45 + node_idx]\n#define FLD_GENERATOR_INCREMENT_POSITION 45\n#define FLD_GENERATOR_INCREMENT_BUFFER float_buffer_1\n#define fld_second_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 59 + node_idx]\n#define FLD_SECOND_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 59\n#define FLD_SECOND_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_node___renderrightoffset__(node_idx) int_buffer_1[tree_size * 18 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 18\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_leaf_valcopy(node_idx) float_buffer_1[tree_size * 23 + node_idx]\n#define FLD_LEAF_VALCOPY_POSITION 23\n#define FLD_LEAF_VALCOPY_BUFFER float_buffer_1\n#define fld_node_radius(node_idx) float_buffer_1[tree_size * 16 + node_idx]\n#define FLD_NODE_RADIUS_POSITION 16\n#define FLD_NODE_RADIUS_BUFFER float_buffer_1\n#define fld_spike___draw__2(node_idx) int_buffer_1[tree_size * 95 + node_idx]\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE2_POSITION 95\n#define FLD_SPIKE_USCOREUSCOREDRAWUSCOREUSCORE2_BUFFER int_buffer_1\n#define fld_second_child_childs_count(node_idx) int_buffer_1[tree_size * 47 + node_idx]\n#define FLD_SECOND_CHILD_CHILDS_COUNT_POSITION 47\n#define FLD_SECOND_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_second_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 66 + node_idx]\n#define FLD_SECOND_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 66\n#define FLD_SECOND_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_generator_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 92 + node_idx]\n#define FLD_GENERATOR_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 92\n#define FLD_GENERATOR_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_secondi_x(node_idx) float_buffer_1[tree_size * 12 + node_idx]\n#define FLD_SECONDI_X_POSITION 12\n#define FLD_SECONDI_X_BUFFER float_buffer_1\n#define fld_secondi_height(node_idx) float_buffer_1[tree_size * 7 + node_idx]\n#define FLD_SECONDI_HEIGHT_POSITION 7\n#define FLD_SECONDI_HEIGHT_BUFFER float_buffer_1\n#define parent(node_idx) nodeindex_buffer_1[tree_size * 5 + node_idx]\n#define PARENT_POSITION 5\n#define PARENT_BUFFER nodeindex_buffer_1\n#define fld_second___childsrendersize__(node_idx) int_buffer_1[tree_size * 41 + node_idx]\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 41\n#define FLD_SECOND_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second_childs_idx_init(node_idx) int_buffer_1[tree_size * 56 + node_idx]\n#define FLD_SECOND_CHILDS_IDX_INIT_POSITION 56\n#define FLD_SECOND_CHILDS_IDX_INIT_BUFFER int_buffer_1\n#define fld_secondi_minradius(node_idx) float_buffer_1[tree_size * 8 + node_idx]\n#define FLD_SECONDI_MINRADIUS_POSITION 8\n#define FLD_SECONDI_MINRADIUS_BUFFER float_buffer_1\n#define fld_second_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 1 + node_idx]\n#define FLD_SECOND_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 1\n#define FLD_SECOND_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_generator_childs_tweenmin_init(node_idx) float_buffer_1[tree_size * 53 + node_idx]\n#define FLD_GENERATOR_CHILDS_TWEENMIN_INIT_POSITION 53\n#define FLD_GENERATOR_CHILDS_TWEENMIN_INIT_BUFFER float_buffer_1\n#define fld_second___draw__0(node_idx) int_buffer_1[tree_size * 43 + node_idx]\n#define FLD_SECOND_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 43\n#define FLD_SECOND_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_generator_childs_rotation_last(node_idx) int_buffer_1[tree_size * 76 + node_idx]\n#define FLD_GENERATOR_CHILDS_ROTATION_LAST_POSITION 76\n#define FLD_GENERATOR_CHILDS_ROTATION_LAST_BUFFER int_buffer_1\n#define fld_node_rotation(node_idx) int_buffer_1[tree_size * 22 + node_idx]\n#define FLD_NODE_ROTATION_POSITION 22\n#define FLD_NODE_ROTATION_BUFFER int_buffer_1\n#define fld_generator_childs_minradius_last(node_idx) float_buffer_1[tree_size * 56 + node_idx]\n#define FLD_GENERATOR_CHILDS_MINRADIUS_LAST_POSITION 56\n#define FLD_GENERATOR_CHILDS_MINRADIUS_LAST_BUFFER float_buffer_1\n#define fld_second_childs_tweenmin_init(node_idx) float_buffer_1[tree_size * 33 + node_idx]\n#define FLD_SECOND_CHILDS_TWEENMIN_INIT_POSITION 33\n#define FLD_SECOND_CHILDS_TWEENMIN_INIT_BUFFER float_buffer_1\n#define fld_second_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 67 + node_idx]\n#define FLD_SECOND_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 67\n#define FLD_SECOND_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_leaf_xoffset(node_idx) int_buffer_1[tree_size * 33 + node_idx]\n#define FLD_LEAF_XOFFSET_POSITION 33\n#define FLD_LEAF_XOFFSET_BUFFER int_buffer_1\n#define fld_generator_childs_height_init(node_idx) float_buffer_1[tree_size * 57 + node_idx]\n#define FLD_GENERATOR_CHILDS_HEIGHT_INIT_POSITION 57\n#define FLD_GENERATOR_CHILDS_HEIGHT_INIT_BUFFER float_buffer_1\n#define fld_iroot___renderoffset__(node_idx) int_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 1\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_second___selfrendersize__(node_idx) int_buffer_1[tree_size * 45 + node_idx]\n#define FLD_SECOND_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 45\n#define FLD_SECOND_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_tweenmin(node_idx) float_buffer_1[tree_size * 17 + node_idx]\n#define FLD_NODE_TWEENMIN_POSITION 17\n#define FLD_NODE_TWEENMIN_BUFFER float_buffer_1\n#define fld_second_len_init(node_idx) int_buffer_1[tree_size * 48 + node_idx]\n#define FLD_SECOND_LEN_INIT_POSITION 48\n#define FLD_SECOND_LEN_INIT_BUFFER int_buffer_1\n#define fld_generator_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 91 + node_idx]\n#define FLD_GENERATOR_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 91\n#define FLD_GENERATOR_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_iroot_height(node_idx) float_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_HEIGHT_POSITION 1\n#define FLD_IROOT_HEIGHT_BUFFER float_buffer_1\n#define fld_leaf_rotation(node_idx) int_buffer_1[tree_size * 34 + node_idx]\n#define FLD_LEAF_ROTATION_POSITION 34\n#define FLD_LEAF_ROTATION_BUFFER int_buffer_1\n#define fld_root_child_child_count(node_idx) int_buffer_1[tree_size * 40 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_COUNT_POSITION 40\n#define FLD_ROOT_CHILD_CHILD_COUNT_BUFFER int_buffer_1\n#define fld_leaf_tween(node_idx) float_buffer_1[tree_size * 21 + node_idx]\n#define FLD_LEAF_TWEEN_POSITION 21\n#define FLD_LEAF_TWEEN_BUFFER float_buffer_1\n#define fld_node_tweenmax(node_idx) float_buffer_1[tree_size * 13 + node_idx]\n#define FLD_NODE_TWEENMAX_POSITION 13\n#define FLD_NODE_TWEENMAX_BUFFER float_buffer_1\n#define fld_leaf_valprev(node_idx) float_buffer_1[tree_size * 27 + node_idx]\n#define FLD_LEAF_VALPREV_POSITION 27\n#define FLD_LEAF_VALPREV_BUFFER float_buffer_1\n#define fld_generator_childs_isfirst_last(node_idx) int_buffer_1[tree_size * 74 + node_idx]\n#define FLD_GENERATOR_CHILDS_ISFIRST_LAST_POSITION 74\n#define FLD_GENERATOR_CHILDS_ISFIRST_LAST_BUFFER int_buffer_1\n#define fld_second_childs_x_init(node_idx) float_buffer_1[tree_size * 39 + node_idx]\n#define FLD_SECOND_CHILDS_X_INIT_POSITION 39\n#define FLD_SECOND_CHILDS_X_INIT_BUFFER float_buffer_1\n#define fld_generator_childs_xoffset_last(node_idx) int_buffer_1[tree_size * 80 + node_idx]\n#define FLD_GENERATOR_CHILDS_XOFFSET_LAST_POSITION 80\n#define FLD_GENERATOR_CHILDS_XOFFSET_LAST_BUFFER int_buffer_1\n#define fld_second_childs_radius_last(node_idx) float_buffer_1[tree_size * 44 + node_idx]\n#define FLD_SECOND_CHILDS_RADIUS_LAST_POSITION 44\n#define FLD_SECOND_CHILDS_RADIUS_LAST_BUFFER float_buffer_1\n#define fld_node___renderoffset__(node_idx) int_buffer_1[tree_size * 23 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 23\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_generator_childs_islast_last(node_idx) int_buffer_1[tree_size * 88 + node_idx]\n#define FLD_GENERATOR_CHILDS_ISLAST_LAST_POSITION 88\n#define FLD_GENERATOR_CHILDS_ISLAST_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_isfirst_init(node_idx) int_buffer_1[tree_size * 73 + node_idx]\n#define FLD_GENERATOR_CHILDS_ISFIRST_INIT_POSITION 73\n#define FLD_GENERATOR_CHILDS_ISFIRST_INIT_BUFFER int_buffer_1\n#define fld_second_childs_idx_last(node_idx) int_buffer_1[tree_size * 57 + node_idx]\n#define FLD_SECOND_CHILDS_IDX_LAST_POSITION 57\n#define FLD_SECOND_CHILDS_IDX_LAST_BUFFER int_buffer_1\n#define fld_second_childs_rotation_last(node_idx) int_buffer_1[tree_size * 51 + node_idx]\n#define FLD_SECOND_CHILDS_ROTATION_LAST_POSITION 51\n#define FLD_SECOND_CHILDS_ROTATION_LAST_BUFFER int_buffer_1\n#define fld_generator_childs_angle_init(node_idx) float_buffer_1[tree_size * 59 + node_idx]\n#define FLD_GENERATOR_CHILDS_ANGLE_INIT_POSITION 59\n#define FLD_GENERATOR_CHILDS_ANGLE_INIT_BUFFER float_buffer_1\n#define fld_generator_childs_depth_last(node_idx) int_buffer_1[tree_size * 90 + node_idx]\n#define FLD_GENERATOR_CHILDS_DEPTH_LAST_POSITION 90\n#define FLD_GENERATOR_CHILDS_DEPTH_LAST_BUFFER int_buffer_1\n#define fld_node_rx(node_idx) float_buffer_1[tree_size * 18 + node_idx]\n#define FLD_NODE_RX_POSITION 18\n#define FLD_NODE_RX_BUFFER float_buffer_1\n#define fld_leaf_tweenmax(node_idx) float_buffer_1[tree_size * 24 + node_idx]\n#define FLD_LEAF_TWEENMAX_POSITION 24\n#define FLD_LEAF_TWEENMAX_BUFFER float_buffer_1\n#define fld_generator___selfrendersize__(node_idx) int_buffer_1[tree_size * 71 + node_idx]\n#define FLD_GENERATOR_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 71\n#define FLD_GENERATOR_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_secondi___renderrightoffset__(node_idx) int_buffer_1[tree_size * 9 + node_idx]\n#define FLD_SECONDI_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 9\n#define FLD_SECONDI_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n";
