this._gen_getKernels = function() {
	this._gen_kernel_visit_0 = this.program.createKernel("visit_0");
	this._gen_kernel_visit_1 = this.program.createKernel("visit_1");
	this._gen_kernel_visit_2 = this.program.createKernel("visit_2");
	this._gen_kernel_visit_3 = this.program.createKernel("visit_3");
	this._gen_kernel_visit_4 = this.program.createKernel("visit_4");
};


this._gen_allocateClBuffers = function() {
	this.cl_float_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.float_buffer_1.byteLength);
	this.cl_int_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.int_buffer_1.byteLength);
	this.cl_grammartokens_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.grammartokens_buffer_1.byteLength);
	this.cl_nodeindex_buffer_1 = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.nodeindex_buffer_1.byteLength);
};


this._gen_transferTree = function() {
	this.queue.enqueueWriteBuffer(this.cl_float_buffer_1, true, 0, this.float_buffer_1.byteLength, this.float_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_int_buffer_1, true, 0, this.int_buffer_1.byteLength, this.int_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_grammartokens_buffer_1, true, 0, this.grammartokens_buffer_1.byteLength, this.grammartokens_buffer_1);
	this.queue.enqueueWriteBuffer(this.cl_nodeindex_buffer_1, true, 0, this.nodeindex_buffer_1.byteLength, this.nodeindex_buffer_1);
};


this._gen_retrieveTree = function() {
	this.queue.enqueueReadBuffer(this.cl_float_buffer_1, true, 0, this.float_buffer_1.byteLength, this.float_buffer_1);
	this.queue.enqueueReadBuffer(this.cl_int_buffer_1, true, 0, this.int_buffer_1.byteLength, this.int_buffer_1);
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
	kernel.setArg(2, this.cl_float_buffer_1);
	kernel.setArg(3, this.cl_int_buffer_1);
	kernel.setArg(4, this.cl_grammartokens_buffer_1);
	kernel.setArg(5, this.cl_nodeindex_buffer_1);
};


this._gen_runTraversals = function() {
	this._gen_run_visit_0();
	this._gen_run_visit_1();
	this._gen_run_visit_2();
	this._gen_run_visit_3();
};


this._gen_run_visit_0 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_0);
	this.topDownTraversal(this._gen_kernel_visit_0);
};


this._gen_run_visit_1 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_1);
	this.bottomUpTraversal(this._gen_kernel_visit_1);
};


this._gen_run_visit_2 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_2);
	this.topDownTraversal(this._gen_kernel_visit_2);
};


this._gen_run_visit_3 = function() {
	this._gen_setKernelArguments(this._gen_kernel_visit_3);
	this.bottomUpTraversal(this._gen_kernel_visit_3);
};


this._gen_run_visit_4 = function(clVBO) {
	this._gen_setKernelArguments(this._gen_kernel_visit_4);
	this._gen_kernel_visit_4.setArg(6, clVBO);
	this.topDownTraversal(this._gen_kernel_visit_4);
};


// Defines all the typed array buffers which will store data locally before
// sending it to the CL device, then populates them with data
this._gen_allocateHostBuffers = function(treeSize) {
	this.FLOAT_BUFFER_1_SIZE = 17;
	this.float_buffer_1 = new Float32Array(this.FLOAT_BUFFER_1_SIZE * treeSize);
	this.INT_BUFFER_1_SIZE = 39;
	this.int_buffer_1 = new Int32Array(this.INT_BUFFER_1_SIZE * treeSize);
	this.GRAMMARTOKENS_BUFFER_1_SIZE = 2;
	this.grammartokens_buffer_1 = new Int32Array(this.GRAMMARTOKENS_BUFFER_1_SIZE * treeSize);
	this.NODEINDEX_BUFFER_1_SIZE = 6;
	this.nodeindex_buffer_1 = new Int32Array(this.NODEINDEX_BUFFER_1_SIZE * treeSize);
};

this._gen_allocateHostProxies = function (treeSize) {
	this.displayname = this.grammartokens_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_hbox_child_childs_count = this.int_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_hbox_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_hbox_childs_depth_init = this.int_buffer_1.subarray(treeSize * 30, (treeSize * 30) + treeSize);
	this.fld_hbox_childs_depth_last = this.int_buffer_1.subarray(treeSize * 31, (treeSize * 31) + treeSize);
	this.fld_hbox_childs_rx_init = this.float_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_hbox_childs_rx_last = this.float_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_hbox_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_hbox_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_hbox_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 32, (treeSize * 32) + treeSize);
	this.fld_hbox_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 33, (treeSize * 33) + treeSize);
	this.fld_hbox_childs_x_init = this.float_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_hbox_childs_x_last = this.float_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_hbox_childs_y_init = this.float_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_hbox_childs_y_last = this.float_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_hbox_h_init = this.float_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_hbox_h_last = this.float_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_hbox___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_hbox___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 28, (treeSize * 28) + treeSize);
	this.fld_hbox___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 29, (treeSize * 29) + treeSize);
	this.fld_hbox___draw__ = this.int_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_hbox___draw__0 = this.int_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_hbox___draw__1 = this.int_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_hbox___draw__2 = this.int_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_hbox___draw__3 = this.int_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_hbox___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_hbox___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_hbox___selfrendersize__1 = this.int_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_hbox___selfrendersize__2 = this.int_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_hbox___selfrendersize__3 = this.int_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_hbox_w_init = this.float_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_hbox_w_last = this.float_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_iroot_h = this.float_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_iroot___renderoffset__ = this.int_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot___rendersize__ = this.int_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_iroot_userinput = this.int_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_iroot_w = this.float_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_leaf_color = this.int_buffer_1.subarray(treeSize * 34, (treeSize * 34) + treeSize);
	this.fld_leaf___draw__ = this.int_buffer_1.subarray(treeSize * 37, (treeSize * 37) + treeSize);
	this.fld_leaf___draw__0 = this.int_buffer_1.subarray(treeSize * 36, (treeSize * 36) + treeSize);
	this.fld_leaf___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 38, (treeSize * 38) + treeSize);
	this.fld_leaf___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 35, (treeSize * 35) + treeSize);
	this.fld_node_depth = this.int_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_node_h = this.float_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_node_rx = this.float_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_node___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_node___renderoffset__ = this.int_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_node___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_node___rendersize__ = this.int_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_node_w = this.float_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_node_x = this.float_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_node_y = this.float_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_root_child_child_count = this.int_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_root_child_child_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_root___childrendersize__ = this.int_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_root___draw__ = this.int_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_root___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.id = this.nodeindex_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.left_siblings = this.nodeindex_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.parent = this.nodeindex_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.refname = this.grammartokens_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.right_siblings = this.nodeindex_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
};


this._gen_copyHostBuffers = function (data, treeSize){
	for(var i = 0; i < data.float_buffer_1.length; i++) {
		this.float_buffer_1[i] = data.float_buffer_1[i];
	}

	for(var i = 0; i < data.int_buffer_1.length; i++) {
		this.int_buffer_1[i] = data.int_buffer_1[i];
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
	this.proxyData.fld_hbox_child_childs_count = new CLDataWrapper(this, this.fld_hbox_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_hbox_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_hbox_childs_depth_init = new CLDataWrapper(this, this.fld_hbox_childs_depth_init, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs_depth_last = new CLDataWrapper(this, this.fld_hbox_childs_depth_last, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs_rx_init = new CLDataWrapper(this, this.fld_hbox_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_childs_rx_last = new CLDataWrapper(this, this.fld_hbox_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_hbox_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_hbox_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_hbox_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_hbox_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_childs_x_init = new CLDataWrapper(this, this.fld_hbox_childs_x_init, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_childs_x_last = new CLDataWrapper(this, this.fld_hbox_childs_x_last, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_childs_y_init = new CLDataWrapper(this, this.fld_hbox_childs_y_init, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_childs_y_last = new CLDataWrapper(this, this.fld_hbox_childs_y_last, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_h_init = new CLDataWrapper(this, this.fld_hbox_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_h_last = new CLDataWrapper(this, this.fld_hbox_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_hbox___childsrendersize__ = new CLDataWrapper(this, this.fld_hbox___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___childsrendersize___init = new CLDataWrapper(this, this.fld_hbox___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___childsrendersize___last = new CLDataWrapper(this, this.fld_hbox___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___draw__ = new CLDataWrapper(this, this.fld_hbox___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___draw__0 = new CLDataWrapper(this, this.fld_hbox___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___draw__1 = new CLDataWrapper(this, this.fld_hbox___draw__1, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___draw__2 = new CLDataWrapper(this, this.fld_hbox___draw__2, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___draw__3 = new CLDataWrapper(this, this.fld_hbox___draw__3, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___selfrendersize__ = new CLDataWrapper(this, this.fld_hbox___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___selfrendersize__0 = new CLDataWrapper(this, this.fld_hbox___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___selfrendersize__1 = new CLDataWrapper(this, this.fld_hbox___selfrendersize__1, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___selfrendersize__2 = new CLDataWrapper(this, this.fld_hbox___selfrendersize__2, this.cl_int_buffer_1);
	this.proxyData.fld_hbox___selfrendersize__3 = new CLDataWrapper(this, this.fld_hbox___selfrendersize__3, this.cl_int_buffer_1);
	this.proxyData.fld_hbox_w_init = new CLDataWrapper(this, this.fld_hbox_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_hbox_w_last = new CLDataWrapper(this, this.fld_hbox_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_h = new CLDataWrapper(this, this.fld_iroot_h, this.cl_float_buffer_1);
	this.proxyData.fld_iroot___dorenderinglast__ = new CLDataWrapper(this, this.fld_iroot___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderoffset__ = new CLDataWrapper(this, this.fld_iroot___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderrightoffset__ = new CLDataWrapper(this, this.fld_iroot___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___rendersize__ = new CLDataWrapper(this, this.fld_iroot___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_userinput = new CLDataWrapper(this, this.fld_iroot_userinput, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_w = new CLDataWrapper(this, this.fld_iroot_w, this.cl_float_buffer_1);
	this.proxyData.fld_leaf_color = new CLDataWrapper(this, this.fld_leaf_color, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___draw__ = new CLDataWrapper(this, this.fld_leaf___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___draw__0 = new CLDataWrapper(this, this.fld_leaf___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___selfrendersize__ = new CLDataWrapper(this, this.fld_leaf___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_leaf___selfrendersize__0 = new CLDataWrapper(this, this.fld_leaf___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_node_depth = new CLDataWrapper(this, this.fld_node_depth, this.cl_int_buffer_1);
	this.proxyData.fld_node_h = new CLDataWrapper(this, this.fld_node_h, this.cl_float_buffer_1);
	this.proxyData.fld_node_rx = new CLDataWrapper(this, this.fld_node_rx, this.cl_float_buffer_1);
	this.proxyData.fld_node___dorenderinglast__ = new CLDataWrapper(this, this.fld_node___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderoffset__ = new CLDataWrapper(this, this.fld_node___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderrightoffset__ = new CLDataWrapper(this, this.fld_node___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___rendersize__ = new CLDataWrapper(this, this.fld_node___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_node_w = new CLDataWrapper(this, this.fld_node_w, this.cl_float_buffer_1);
	this.proxyData.fld_node_x = new CLDataWrapper(this, this.fld_node_x, this.cl_float_buffer_1);
	this.proxyData.fld_node_y = new CLDataWrapper(this, this.fld_node_y, this.cl_float_buffer_1);
	this.proxyData.fld_root_child_child_count = new CLDataWrapper(this, this.fld_root_child_child_count, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_child_leftmost_child = new CLDataWrapper(this, this.fld_root_child_child_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_root___childrendersize__ = new CLDataWrapper(this, this.fld_root___childrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_root___draw__ = new CLDataWrapper(this, this.fld_root___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_root___selfrendersize__ = new CLDataWrapper(this, this.fld_root___selfrendersize__, this.cl_int_buffer_1);
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
			return 12;
			break;
		case "ROOT":
			return 10;
			break;
		case "HBOX":
			return 7;
			break;
		case "LEAF":
			return 9;
			break;
		case "IGNORE":
			return 8;
			break;
		case "TEXTBOX":
			return 11;
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
		case "HBOX":
			return "node";
			break;
		case "LEAF":
			return "node";
			break;
	}
};


	this.inputs = [
		"color"		, "userInput"		, "glBufferMacro"		, "refname"		, "display"	];



this.offsets = "enum unionvariants {TOK_CHILD = 5, TOK_ROOT = 10, TOK_IGNORE = 8, TOK_CHILDS = 6, TOK_LEAF = 9, TOK_UNDEFINED = 12, TOK_HBOX = 7, TOK_TEXTBOX = 11};\n\n// Generated code. Modifcation to this file will be lost on next code generation.\n\n/**\n * @file   cl_runner_generated_buffer_info.h\n * @author Superconductor v0.1\n * @date   23/03/2014 20:55:12\n * @brief  Contains macros needed to access fields within monolithic OpenCL\n * buffers.\n * \n * @warning Generated code. Modifcation to this file will be lost on next\n * code generation.\n *\n * This file defines several sets of macros intended for use with the \n * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic\n * buffers are a way of packing multiple different fields (represented by\n * structure-split arrays) into a single OpenCL buffer so as to minimize the\n * number of arguments needed to be passed to OpenCL.\n *\n * The macros contained here are of three classes:\n * @li @c buffer_name_size The number of fields packed into buffer buffer_name.\n * @li @c NUM_BUFFERS The total number of buffers define herein.\n * @li @c fld_class_property(node_idx) Macro to access the specified property of\n * for the node at node_idx.\n */\n\n#define FLOAT_BUFFER_1_SIZE 17\n#define INT_BUFFER_1_SIZE 39\n#define GRAMMARTOKENS_BUFFER_1_SIZE 2\n#define NODEINDEX_BUFFER_1_SIZE 6\n\n#define fld_node_rx(node_idx) float_buffer_1[tree_size * 4 + node_idx]\n#define FLD_NODE_RX_POSITION 4\n#define FLD_NODE_RX_BUFFER float_buffer_1\n#define fld_iroot___renderoffset__(node_idx) int_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 1\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox___selfrendersize__0(node_idx) int_buffer_1[tree_size * 20 + node_idx]\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 20\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_root_child_child_count(node_idx) int_buffer_1[tree_size * 13 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_COUNT_POSITION 13\n#define FLD_ROOT_CHILD_CHILD_COUNT_BUFFER int_buffer_1\n#define fld_node___dorenderinglast__(node_idx) int_buffer_1[tree_size * 8 + node_idx]\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 8\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 26 + node_idx]\n#define FLD_HBOX_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 26\n#define FLD_HBOX_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_leaf___draw__0(node_idx) int_buffer_1[tree_size * 36 + node_idx]\n#define FLD_LEAF_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 36\n#define FLD_LEAF_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_root___childrendersize__(node_idx) int_buffer_1[tree_size * 12 + node_idx]\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_POSITION 12\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define refname(node_idx) grammartokens_buffer_1[tree_size * 1 + node_idx]\n#define REFNAME_POSITION 1\n#define REFNAME_BUFFER grammartokens_buffer_1\n#define fld_hbox_childs_x_last(node_idx) float_buffer_1[tree_size * 10 + node_idx]\n#define FLD_HBOX_CHILDS_X_LAST_POSITION 10\n#define FLD_HBOX_CHILDS_X_LAST_BUFFER float_buffer_1\n#define fld_hbox_h_last(node_idx) float_buffer_1[tree_size * 16 + node_idx]\n#define FLD_HBOX_H_LAST_POSITION 16\n#define FLD_HBOX_H_LAST_BUFFER float_buffer_1\n#define fld_hbox_childs_depth_last(node_idx) int_buffer_1[tree_size * 31 + node_idx]\n#define FLD_HBOX_CHILDS_DEPTH_LAST_POSITION 31\n#define FLD_HBOX_CHILDS_DEPTH_LAST_BUFFER int_buffer_1\n#define fld_iroot___renderrightoffset__(node_idx) int_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 0\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox___selfrendersize__(node_idx) int_buffer_1[tree_size * 24 + node_idx]\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 24\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_leaf_color(node_idx) int_buffer_1[tree_size * 34 + node_idx]\n#define FLD_LEAF_COLOR_POSITION 34\n#define FLD_LEAF_COLOR_BUFFER int_buffer_1\n#define fld_hbox_child_childs_count(node_idx) int_buffer_1[tree_size * 25 + node_idx]\n#define FLD_HBOX_CHILD_CHILDS_COUNT_POSITION 25\n#define FLD_HBOX_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_leaf___selfrendersize__(node_idx) int_buffer_1[tree_size * 38 + node_idx]\n#define FLD_LEAF_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 38\n#define FLD_LEAF_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 1 + node_idx]\n#define FLD_HBOX_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 1\n#define FLD_HBOX_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_hbox___selfrendersize__1(node_idx) int_buffer_1[tree_size * 18 + node_idx]\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE1_POSITION 18\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE1_BUFFER int_buffer_1\n#define fld_hbox___draw__0(node_idx) int_buffer_1[tree_size * 21 + node_idx]\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 21\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_hbox_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 27 + node_idx]\n#define FLD_HBOX_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 27\n#define FLD_HBOX_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_hbox_childs_depth_init(node_idx) int_buffer_1[tree_size * 30 + node_idx]\n#define FLD_HBOX_CHILDS_DEPTH_INIT_POSITION 30\n#define FLD_HBOX_CHILDS_DEPTH_INIT_BUFFER int_buffer_1\n#define fld_hbox_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 32 + node_idx]\n#define FLD_HBOX_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 32\n#define FLD_HBOX_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_node_y(node_idx) float_buffer_1[tree_size * 3 + node_idx]\n#define FLD_NODE_Y_POSITION 3\n#define FLD_NODE_Y_BUFFER float_buffer_1\n#define fld_hbox___draw__2(node_idx) int_buffer_1[tree_size * 16 + node_idx]\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE2_POSITION 16\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE2_BUFFER int_buffer_1\n#define fld_hbox___selfrendersize__3(node_idx) int_buffer_1[tree_size * 14 + node_idx]\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE3_POSITION 14\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE3_BUFFER int_buffer_1\n#define fld_iroot_w(node_idx) float_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_W_POSITION 0\n#define FLD_IROOT_W_BUFFER float_buffer_1\n#define fld_hbox_h_init(node_idx) float_buffer_1[tree_size * 15 + node_idx]\n#define FLD_HBOX_H_INIT_POSITION 15\n#define FLD_HBOX_H_INIT_BUFFER float_buffer_1\n#define fld_node_h(node_idx) float_buffer_1[tree_size * 5 + node_idx]\n#define FLD_NODE_H_POSITION 5\n#define FLD_NODE_H_BUFFER float_buffer_1\n#define fld_hbox___draw__1(node_idx) int_buffer_1[tree_size * 22 + node_idx]\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE1_POSITION 22\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE1_BUFFER int_buffer_1\n#define fld_hbox___childsrendersize___init(node_idx) int_buffer_1[tree_size * 28 + node_idx]\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 28\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define parent(node_idx) nodeindex_buffer_1[tree_size * 4 + node_idx]\n#define PARENT_POSITION 4\n#define PARENT_BUFFER nodeindex_buffer_1\n#define fld_node_w(node_idx) float_buffer_1[tree_size * 2 + node_idx]\n#define FLD_NODE_W_POSITION 2\n#define FLD_NODE_W_BUFFER float_buffer_1\n#define fld_hbox_childs_y_last(node_idx) float_buffer_1[tree_size * 14 + node_idx]\n#define FLD_HBOX_CHILDS_Y_LAST_POSITION 14\n#define FLD_HBOX_CHILDS_Y_LAST_BUFFER float_buffer_1\n#define right_siblings(node_idx) nodeindex_buffer_1[tree_size * 2 + node_idx]\n#define RIGHT_SIBLINGS_POSITION 2\n#define RIGHT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_hbox_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 33 + node_idx]\n#define FLD_HBOX_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 33\n#define FLD_HBOX_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_node___rendersize__(node_idx) int_buffer_1[tree_size * 7 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 7\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node___renderoffset__(node_idx) int_buffer_1[tree_size * 6 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 6\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox___childsrendersize___last(node_idx) int_buffer_1[tree_size * 29 + node_idx]\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 29\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_iroot_userinput(node_idx) int_buffer_1[tree_size * 4 + node_idx]\n#define FLD_IROOT_USERINPUT_POSITION 4\n#define FLD_IROOT_USERINPUT_BUFFER int_buffer_1\n#define fld_iroot___dorenderinglast__(node_idx) int_buffer_1[tree_size * 3 + node_idx]\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 3\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox_w_init(node_idx) float_buffer_1[tree_size * 7 + node_idx]\n#define FLD_HBOX_W_INIT_POSITION 7\n#define FLD_HBOX_W_INIT_BUFFER float_buffer_1\n#define fld_node_x(node_idx) float_buffer_1[tree_size * 6 + node_idx]\n#define FLD_NODE_X_POSITION 6\n#define FLD_NODE_X_BUFFER float_buffer_1\n#define fld_hbox___draw__(node_idx) int_buffer_1[tree_size * 23 + node_idx]\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 23\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node___renderrightoffset__(node_idx) int_buffer_1[tree_size * 5 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 5\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_root___draw__(node_idx) int_buffer_1[tree_size * 10 + node_idx]\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 10\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox___childsrendersize__(node_idx) int_buffer_1[tree_size * 19 + node_idx]\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 19\n#define FLD_HBOX_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hbox_childs_x_init(node_idx) float_buffer_1[tree_size * 9 + node_idx]\n#define FLD_HBOX_CHILDS_X_INIT_POSITION 9\n#define FLD_HBOX_CHILDS_X_INIT_BUFFER float_buffer_1\n#define fld_hbox___draw__3(node_idx) int_buffer_1[tree_size * 17 + node_idx]\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE3_POSITION 17\n#define FLD_HBOX_USCOREUSCOREDRAWUSCOREUSCORE3_BUFFER int_buffer_1\n#define fld_hbox_childs_rx_init(node_idx) float_buffer_1[tree_size * 11 + node_idx]\n#define FLD_HBOX_CHILDS_RX_INIT_POSITION 11\n#define FLD_HBOX_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_root_child_child_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 0 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_POSITION 0\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_hbox___selfrendersize__2(node_idx) int_buffer_1[tree_size * 15 + node_idx]\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE2_POSITION 15\n#define FLD_HBOX_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE2_BUFFER int_buffer_1\n#define fld_leaf___selfrendersize__0(node_idx) int_buffer_1[tree_size * 35 + node_idx]\n#define FLD_LEAF_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 35\n#define FLD_LEAF_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_iroot___rendersize__(node_idx) int_buffer_1[tree_size * 2 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 2\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_iroot_h(node_idx) float_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_H_POSITION 1\n#define FLD_IROOT_H_BUFFER float_buffer_1\n#define fld_hbox_w_last(node_idx) float_buffer_1[tree_size * 8 + node_idx]\n#define FLD_HBOX_W_LAST_POSITION 8\n#define FLD_HBOX_W_LAST_BUFFER float_buffer_1\n#define left_siblings(node_idx) nodeindex_buffer_1[tree_size * 3 + node_idx]\n#define LEFT_SIBLINGS_POSITION 3\n#define LEFT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_hbox_childs_y_init(node_idx) float_buffer_1[tree_size * 13 + node_idx]\n#define FLD_HBOX_CHILDS_Y_INIT_POSITION 13\n#define FLD_HBOX_CHILDS_Y_INIT_BUFFER float_buffer_1\n#define fld_root___selfrendersize__(node_idx) int_buffer_1[tree_size * 11 + node_idx]\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 11\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define displayname(node_idx) grammartokens_buffer_1[tree_size * 0 + node_idx]\n#define DISPLAYNAME_POSITION 0\n#define DISPLAYNAME_BUFFER grammartokens_buffer_1\n#define id(node_idx) nodeindex_buffer_1[tree_size * 5 + node_idx]\n#define ID_POSITION 5\n#define ID_BUFFER nodeindex_buffer_1\n#define fld_leaf___draw__(node_idx) int_buffer_1[tree_size * 37 + node_idx]\n#define FLD_LEAF_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 37\n#define FLD_LEAF_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_depth(node_idx) int_buffer_1[tree_size * 9 + node_idx]\n#define FLD_NODE_DEPTH_POSITION 9\n#define FLD_NODE_DEPTH_BUFFER int_buffer_1\n#define fld_hbox_childs_rx_last(node_idx) float_buffer_1[tree_size * 12 + node_idx]\n#define FLD_HBOX_CHILDS_RX_LAST_POSITION 12\n#define FLD_HBOX_CHILDS_RX_LAST_BUFFER float_buffer_1\n";
