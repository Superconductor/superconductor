this._gen_getKernels = function() {
	this._gen_kernel_visit_0 = this.program.createKernel("visit_0");
	this._gen_kernel_visit_1 = this.program.createKernel("visit_1");
	this._gen_kernel_visit_2 = this.program.createKernel("visit_2");
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
	this.FLOAT_BUFFER_1_SIZE = 28;
	this.float_buffer_1 = new Float32Array(this.FLOAT_BUFFER_1_SIZE * treeSize);
	this.INT_BUFFER_1_SIZE = 28;
	this.int_buffer_1 = new Int32Array(this.INT_BUFFER_1_SIZE * treeSize);
	this.GRAMMARTOKENS_BUFFER_1_SIZE = 2;
	this.grammartokens_buffer_1 = new Int32Array(this.GRAMMARTOKENS_BUFFER_1_SIZE * treeSize);
	this.NODEINDEX_BUFFER_1_SIZE = 6;
	this.nodeindex_buffer_1 = new Int32Array(this.NODEINDEX_BUFFER_1_SIZE * treeSize);
};

this._gen_allocateHostProxies = function (treeSize) {
	this.displayname = this.grammartokens_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_iroot___renderoffset__ = this.int_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_iroot___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_iroot___rendersize__ = this.int_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_node_alpha = this.float_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_node_bgcolor = this.int_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_node_maxr = this.float_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_node_open = this.float_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_node_parenttotr = this.float_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_node_r = this.float_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_node_rootcenterx = this.float_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_node_rootcentery = this.float_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_node_sectorang = this.float_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_node_show = this.float_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_node___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_node___renderoffset__ = this.int_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_node___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_node___rendersize__ = this.int_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_radial_child_alpha_init = this.float_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_radial_child_alpha_last = this.float_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_radial_child_child_count = this.int_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_radial_child_child_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_radial_child_maxr_init = this.float_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_radial_child_maxr_last = this.float_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_radial_child_parenttotr_init = this.float_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_radial_child_parenttotr_last = this.float_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_radial_child_rootcenterx_init = this.float_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_radial_child_rootcenterx_last = this.float_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_radial_child_rootcentery_init = this.float_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_radial_child_rootcentery_last = this.float_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_radial_child_sectorang_init = this.float_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_radial_child_sectorang_last = this.float_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_radial_child_show_init = this.float_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_radial_child_show_last = this.float_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_radial_child___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_radial_child___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_radial_child___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_radial_child___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_radial_numopenchildren = this.int_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_radial_numopenchildren_init = this.int_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_radial_numopenchildren_last = this.int_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_radial___childrendersize__ = this.int_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_radial___childrendersize___init = this.int_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_radial___childrendersize___last = this.int_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_radial___draw__ = this.int_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_radial___draw__0 = this.int_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_radial___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_radial___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_root_centeralpha = this.float_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_root_centerradius = this.float_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_root_child_child_count = this.int_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_root_child_child_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_root_h = this.float_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_root_radius = this.float_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_root___childrendersize__ = this.int_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_root___draw__ = this.int_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_root___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_root_w = this.float_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
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
	this.proxyData.fld_iroot___dorenderinglast__ = new CLDataWrapper(this, this.fld_iroot___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderoffset__ = new CLDataWrapper(this, this.fld_iroot___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderrightoffset__ = new CLDataWrapper(this, this.fld_iroot___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___rendersize__ = new CLDataWrapper(this, this.fld_iroot___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_node_alpha = new CLDataWrapper(this, this.fld_node_alpha, this.cl_float_buffer_1);
	this.proxyData.fld_node_bgcolor = new CLDataWrapper(this, this.fld_node_bgcolor, this.cl_int_buffer_1);
	this.proxyData.fld_node_maxr = new CLDataWrapper(this, this.fld_node_maxr, this.cl_float_buffer_1);
	this.proxyData.fld_node_open = new CLDataWrapper(this, this.fld_node_open, this.cl_float_buffer_1);
	this.proxyData.fld_node_parenttotr = new CLDataWrapper(this, this.fld_node_parenttotr, this.cl_float_buffer_1);
	this.proxyData.fld_node_r = new CLDataWrapper(this, this.fld_node_r, this.cl_float_buffer_1);
	this.proxyData.fld_node_rootcenterx = new CLDataWrapper(this, this.fld_node_rootcenterx, this.cl_float_buffer_1);
	this.proxyData.fld_node_rootcentery = new CLDataWrapper(this, this.fld_node_rootcentery, this.cl_float_buffer_1);
	this.proxyData.fld_node_sectorang = new CLDataWrapper(this, this.fld_node_sectorang, this.cl_float_buffer_1);
	this.proxyData.fld_node_show = new CLDataWrapper(this, this.fld_node_show, this.cl_float_buffer_1);
	this.proxyData.fld_node___dorenderinglast__ = new CLDataWrapper(this, this.fld_node___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderoffset__ = new CLDataWrapper(this, this.fld_node___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderrightoffset__ = new CLDataWrapper(this, this.fld_node___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___rendersize__ = new CLDataWrapper(this, this.fld_node___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_radial_child_alpha_init = new CLDataWrapper(this, this.fld_radial_child_alpha_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_alpha_last = new CLDataWrapper(this, this.fld_radial_child_alpha_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_child_count = new CLDataWrapper(this, this.fld_radial_child_child_count, this.cl_int_buffer_1);
	this.proxyData.fld_radial_child_child_leftmost_child = new CLDataWrapper(this, this.fld_radial_child_child_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_radial_child_maxr_init = new CLDataWrapper(this, this.fld_radial_child_maxr_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_maxr_last = new CLDataWrapper(this, this.fld_radial_child_maxr_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_parenttotr_init = new CLDataWrapper(this, this.fld_radial_child_parenttotr_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_parenttotr_last = new CLDataWrapper(this, this.fld_radial_child_parenttotr_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_rootcenterx_init = new CLDataWrapper(this, this.fld_radial_child_rootcenterx_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_rootcenterx_last = new CLDataWrapper(this, this.fld_radial_child_rootcenterx_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_rootcentery_init = new CLDataWrapper(this, this.fld_radial_child_rootcentery_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_rootcentery_last = new CLDataWrapper(this, this.fld_radial_child_rootcentery_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_sectorang_init = new CLDataWrapper(this, this.fld_radial_child_sectorang_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_sectorang_last = new CLDataWrapper(this, this.fld_radial_child_sectorang_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_show_init = new CLDataWrapper(this, this.fld_radial_child_show_init, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child_show_last = new CLDataWrapper(this, this.fld_radial_child_show_last, this.cl_float_buffer_1);
	this.proxyData.fld_radial_child___dorenderinglast___init = new CLDataWrapper(this, this.fld_radial_child___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_radial_child___dorenderinglast___last = new CLDataWrapper(this, this.fld_radial_child___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_radial_child___renderrightoffset___init = new CLDataWrapper(this, this.fld_radial_child___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_radial_child___renderrightoffset___last = new CLDataWrapper(this, this.fld_radial_child___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_radial_numopenchildren = new CLDataWrapper(this, this.fld_radial_numopenchildren, this.cl_int_buffer_1);
	this.proxyData.fld_radial_numopenchildren_init = new CLDataWrapper(this, this.fld_radial_numopenchildren_init, this.cl_int_buffer_1);
	this.proxyData.fld_radial_numopenchildren_last = new CLDataWrapper(this, this.fld_radial_numopenchildren_last, this.cl_int_buffer_1);
	this.proxyData.fld_radial___childrendersize__ = new CLDataWrapper(this, this.fld_radial___childrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_radial___childrendersize___init = new CLDataWrapper(this, this.fld_radial___childrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_radial___childrendersize___last = new CLDataWrapper(this, this.fld_radial___childrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_radial___draw__ = new CLDataWrapper(this, this.fld_radial___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_radial___draw__0 = new CLDataWrapper(this, this.fld_radial___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_radial___selfrendersize__ = new CLDataWrapper(this, this.fld_radial___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_radial___selfrendersize__0 = new CLDataWrapper(this, this.fld_radial___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_root_centeralpha = new CLDataWrapper(this, this.fld_root_centeralpha, this.cl_float_buffer_1);
	this.proxyData.fld_root_centerradius = new CLDataWrapper(this, this.fld_root_centerradius, this.cl_float_buffer_1);
	this.proxyData.fld_root_child_child_count = new CLDataWrapper(this, this.fld_root_child_child_count, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_child_leftmost_child = new CLDataWrapper(this, this.fld_root_child_child_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_root_h = new CLDataWrapper(this, this.fld_root_h, this.cl_float_buffer_1);
	this.proxyData.fld_root_radius = new CLDataWrapper(this, this.fld_root_radius, this.cl_float_buffer_1);
	this.proxyData.fld_root___childrendersize__ = new CLDataWrapper(this, this.fld_root___childrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_root___draw__ = new CLDataWrapper(this, this.fld_root___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_root___selfrendersize__ = new CLDataWrapper(this, this.fld_root___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_root_w = new CLDataWrapper(this, this.fld_root_w, this.cl_float_buffer_1);
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
		case "UNDEFINED":
			return 10;
			break;
		case "RADIAL":
			return 7;
			break;
		case "ROOT":
			return 8;
			break;
		case "IGNORE":
			return 6;
			break;
		case "TEXTBOX":
			return 9;
			break;
		default:
			console.error("unknown class tag " +classStr);
			throw 'Superconductor data flattening exn';
	}
};


this.classToIFace = function (classStr) {
	switch(classStr.toUpperCase()) {
		case "RADIAL":
			return "node";
			break;
		case "ROOT":
			return "iroot";
			break;
	}
};


	this.inputs = [
		"w"		, "open"		, "centerAlpha"		, "glBufferMacro"		, "refname"		, "display"		, "radius"		, "centerRadius"		, "bgcolor"		, "h"	];



this.offsets = "enum unionvariants {TOK_CHILD = 5, TOK_ROOT = 8, TOK_IGNORE = 6, TOK_RADIAL = 7, TOK_UNDEFINED = 10, TOK_TEXTBOX = 9};\n\n// Generated code. Modifcation to this file will be lost on next code generation.\n\n/**\n * @file   cl_runner_generated_buffer_info.h\n * @author Superconductor v0.1\n * @date   11/03/2014 19:12:07\n * @brief  Contains macros needed to access fields within monolithic OpenCL\n * buffers.\n * \n * @warning Generated code. Modifcation to this file will be lost on next\n * code generation.\n *\n * This file defines several sets of macros intended for use with the \n * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic\n * buffers are a way of packing multiple different fields (represented by\n * structure-split arrays) into a single OpenCL buffer so as to minimize the\n * number of arguments needed to be passed to OpenCL.\n *\n * The macros contained here are of three classes:\n * @li @c buffer_name_size The number of fields packed into buffer buffer_name.\n * @li @c NUM_BUFFERS The total number of buffers define herein.\n * @li @c fld_class_property(node_idx) Macro to access the specified property of\n * for the node at node_idx.\n */\n\n#define FLOAT_BUFFER_1_SIZE 28\n#define INT_BUFFER_1_SIZE 28\n#define GRAMMARTOKENS_BUFFER_1_SIZE 2\n#define NODEINDEX_BUFFER_1_SIZE 6\n\n#define left_siblings(node_idx) nodeindex_buffer_1[tree_size * 3 + node_idx]\n#define LEFT_SIBLINGS_POSITION 3\n#define LEFT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_root___draw__(node_idx) int_buffer_1[tree_size * 24 + node_idx]\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 24\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_child___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 18 + node_idx]\n#define FLD_RADIAL_CHILD_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 18\n#define FLD_RADIAL_CHILD_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_iroot___rendersize__(node_idx) int_buffer_1[tree_size * 7 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 7\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_sectorang(node_idx) float_buffer_1[tree_size * 4 + node_idx]\n#define FLD_NODE_SECTORANG_POSITION 4\n#define FLD_NODE_SECTORANG_BUFFER float_buffer_1\n#define fld_node_rootcentery(node_idx) float_buffer_1[tree_size * 7 + node_idx]\n#define FLD_NODE_ROOTCENTERY_POSITION 7\n#define FLD_NODE_ROOTCENTERY_BUFFER float_buffer_1\n#define fld_radial___selfrendersize__(node_idx) int_buffer_1[tree_size * 12 + node_idx]\n#define FLD_RADIAL_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 12\n#define FLD_RADIAL_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_child_show_init(node_idx) float_buffer_1[tree_size * 13 + node_idx]\n#define FLD_RADIAL_CHILD_SHOW_INIT_POSITION 13\n#define FLD_RADIAL_CHILD_SHOW_INIT_BUFFER float_buffer_1\n#define fld_radial___childrendersize___init(node_idx) int_buffer_1[tree_size * 20 + node_idx]\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_INIT_POSITION 20\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_root___selfrendersize__(node_idx) int_buffer_1[tree_size * 25 + node_idx]\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 25\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_child_rootcentery_init(node_idx) float_buffer_1[tree_size * 17 + node_idx]\n#define FLD_RADIAL_CHILD_ROOTCENTERY_INIT_POSITION 17\n#define FLD_RADIAL_CHILD_ROOTCENTERY_INIT_BUFFER float_buffer_1\n#define id(node_idx) nodeindex_buffer_1[tree_size * 5 + node_idx]\n#define ID_POSITION 5\n#define ID_BUFFER nodeindex_buffer_1\n#define fld_radial_child_rootcenterx_last(node_idx) float_buffer_1[tree_size * 16 + node_idx]\n#define FLD_RADIAL_CHILD_ROOTCENTERX_LAST_POSITION 16\n#define FLD_RADIAL_CHILD_ROOTCENTERX_LAST_BUFFER float_buffer_1\n#define fld_node_maxr(node_idx) float_buffer_1[tree_size * 0 + node_idx]\n#define FLD_NODE_MAXR_POSITION 0\n#define FLD_NODE_MAXR_BUFFER float_buffer_1\n#define fld_radial_child___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 17 + node_idx]\n#define FLD_RADIAL_CHILD_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 17\n#define FLD_RADIAL_CHILD_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_radial_child_sectorang_last(node_idx) float_buffer_1[tree_size * 22 + node_idx]\n#define FLD_RADIAL_CHILD_SECTORANG_LAST_POSITION 22\n#define FLD_RADIAL_CHILD_SECTORANG_LAST_BUFFER float_buffer_1\n#define fld_radial_child_child_count(node_idx) int_buffer_1[tree_size * 15 + node_idx]\n#define FLD_RADIAL_CHILD_CHILD_COUNT_POSITION 15\n#define FLD_RADIAL_CHILD_CHILD_COUNT_BUFFER int_buffer_1\n#define fld_root_child_child_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 1 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_POSITION 1\n#define FLD_ROOT_CHILD_CHILD_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define displayname(node_idx) grammartokens_buffer_1[tree_size * 0 + node_idx]\n#define DISPLAYNAME_POSITION 0\n#define DISPLAYNAME_BUFFER grammartokens_buffer_1\n#define fld_root_child_child_count(node_idx) int_buffer_1[tree_size * 27 + node_idx]\n#define FLD_ROOT_CHILD_CHILD_COUNT_POSITION 27\n#define FLD_ROOT_CHILD_CHILD_COUNT_BUFFER int_buffer_1\n#define right_siblings(node_idx) nodeindex_buffer_1[tree_size * 2 + node_idx]\n#define RIGHT_SIBLINGS_POSITION 2\n#define RIGHT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_radial_child_maxr_init(node_idx) float_buffer_1[tree_size * 19 + node_idx]\n#define FLD_RADIAL_CHILD_MAXR_INIT_POSITION 19\n#define FLD_RADIAL_CHILD_MAXR_INIT_BUFFER float_buffer_1\n#define fld_iroot___dorenderinglast__(node_idx) int_buffer_1[tree_size * 8 + node_idx]\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 8\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_show(node_idx) float_buffer_1[tree_size * 5 + node_idx]\n#define FLD_NODE_SHOW_POSITION 5\n#define FLD_NODE_SHOW_BUFFER float_buffer_1\n#define fld_radial_child_alpha_init(node_idx) float_buffer_1[tree_size * 9 + node_idx]\n#define FLD_RADIAL_CHILD_ALPHA_INIT_POSITION 9\n#define FLD_RADIAL_CHILD_ALPHA_INIT_BUFFER float_buffer_1\n#define fld_iroot___renderoffset__(node_idx) int_buffer_1[tree_size * 6 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 6\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_child_parenttotr_last(node_idx) float_buffer_1[tree_size * 12 + node_idx]\n#define FLD_RADIAL_CHILD_PARENTTOTR_LAST_POSITION 12\n#define FLD_RADIAL_CHILD_PARENTTOTR_LAST_BUFFER float_buffer_1\n#define fld_radial_child_sectorang_init(node_idx) float_buffer_1[tree_size * 21 + node_idx]\n#define FLD_RADIAL_CHILD_SECTORANG_INIT_POSITION 21\n#define FLD_RADIAL_CHILD_SECTORANG_INIT_BUFFER float_buffer_1\n#define parent(node_idx) nodeindex_buffer_1[tree_size * 4 + node_idx]\n#define PARENT_POSITION 4\n#define PARENT_BUFFER nodeindex_buffer_1\n#define fld_root_centeralpha(node_idx) float_buffer_1[tree_size * 24 + node_idx]\n#define FLD_ROOT_CENTERALPHA_POSITION 24\n#define FLD_ROOT_CENTERALPHA_BUFFER float_buffer_1\n#define fld_iroot___renderrightoffset__(node_idx) int_buffer_1[tree_size * 5 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 5\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_open(node_idx) float_buffer_1[tree_size * 8 + node_idx]\n#define FLD_NODE_OPEN_POSITION 8\n#define FLD_NODE_OPEN_BUFFER float_buffer_1\n#define fld_node_alpha(node_idx) float_buffer_1[tree_size * 2 + node_idx]\n#define FLD_NODE_ALPHA_POSITION 2\n#define FLD_NODE_ALPHA_BUFFER float_buffer_1\n#define fld_radial_child___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 16 + node_idx]\n#define FLD_RADIAL_CHILD_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 16\n#define FLD_RADIAL_CHILD_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_radial_child___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 19 + node_idx]\n#define FLD_RADIAL_CHILD_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 19\n#define FLD_RADIAL_CHILD_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_radial_child_rootcentery_last(node_idx) float_buffer_1[tree_size * 18 + node_idx]\n#define FLD_RADIAL_CHILD_ROOTCENTERY_LAST_POSITION 18\n#define FLD_RADIAL_CHILD_ROOTCENTERY_LAST_BUFFER float_buffer_1\n#define fld_node_bgcolor(node_idx) int_buffer_1[tree_size * 4 + node_idx]\n#define FLD_NODE_BGCOLOR_POSITION 4\n#define FLD_NODE_BGCOLOR_BUFFER int_buffer_1\n#define fld_node_parenttotr(node_idx) float_buffer_1[tree_size * 3 + node_idx]\n#define FLD_NODE_PARENTTOTR_POSITION 3\n#define FLD_NODE_PARENTTOTR_BUFFER float_buffer_1\n#define fld_node___renderoffset__(node_idx) int_buffer_1[tree_size * 1 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 1\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_child_rootcenterx_init(node_idx) float_buffer_1[tree_size * 15 + node_idx]\n#define FLD_RADIAL_CHILD_ROOTCENTERX_INIT_POSITION 15\n#define FLD_RADIAL_CHILD_ROOTCENTERX_INIT_BUFFER float_buffer_1\n#define fld_radial___childrendersize__(node_idx) int_buffer_1[tree_size * 13 + node_idx]\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_POSITION 13\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node___rendersize__(node_idx) int_buffer_1[tree_size * 2 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 2\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node___renderrightoffset__(node_idx) int_buffer_1[tree_size * 0 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 0\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_root___childrendersize__(node_idx) int_buffer_1[tree_size * 26 + node_idx]\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_POSITION 26\n#define FLD_ROOT_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_r(node_idx) float_buffer_1[tree_size * 1 + node_idx]\n#define FLD_NODE_R_POSITION 1\n#define FLD_NODE_R_BUFFER float_buffer_1\n#define fld_radial___draw__(node_idx) int_buffer_1[tree_size * 11 + node_idx]\n#define FLD_RADIAL_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 11\n#define FLD_RADIAL_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_radial_numopenchildren(node_idx) int_buffer_1[tree_size * 14 + node_idx]\n#define FLD_RADIAL_NUMOPENCHILDREN_POSITION 14\n#define FLD_RADIAL_NUMOPENCHILDREN_BUFFER int_buffer_1\n#define fld_root_centerradius(node_idx) float_buffer_1[tree_size * 25 + node_idx]\n#define FLD_ROOT_CENTERRADIUS_POSITION 25\n#define FLD_ROOT_CENTERRADIUS_BUFFER float_buffer_1\n#define fld_radial_child_parenttotr_init(node_idx) float_buffer_1[tree_size * 11 + node_idx]\n#define FLD_RADIAL_CHILD_PARENTTOTR_INIT_POSITION 11\n#define FLD_RADIAL_CHILD_PARENTTOTR_INIT_BUFFER float_buffer_1\n#define fld_radial___selfrendersize__0(node_idx) int_buffer_1[tree_size * 9 + node_idx]\n#define FLD_RADIAL_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 9\n#define FLD_RADIAL_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_radial_child_child_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 0 + node_idx]\n#define FLD_RADIAL_CHILD_CHILD_LEFTMOST_CHILD_POSITION 0\n#define FLD_RADIAL_CHILD_CHILD_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_radial___childrendersize___last(node_idx) int_buffer_1[tree_size * 21 + node_idx]\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_LAST_POSITION 21\n#define FLD_RADIAL_USCOREUSCORECHILDRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_root_h(node_idx) float_buffer_1[tree_size * 27 + node_idx]\n#define FLD_ROOT_H_POSITION 27\n#define FLD_ROOT_H_BUFFER float_buffer_1\n#define fld_radial_child_show_last(node_idx) float_buffer_1[tree_size * 14 + node_idx]\n#define FLD_RADIAL_CHILD_SHOW_LAST_POSITION 14\n#define FLD_RADIAL_CHILD_SHOW_LAST_BUFFER float_buffer_1\n#define fld_node_rootcenterx(node_idx) float_buffer_1[tree_size * 6 + node_idx]\n#define FLD_NODE_ROOTCENTERX_POSITION 6\n#define FLD_NODE_ROOTCENTERX_BUFFER float_buffer_1\n#define fld_radial___draw__0(node_idx) int_buffer_1[tree_size * 10 + node_idx]\n#define FLD_RADIAL_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 10\n#define FLD_RADIAL_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_radial_child_maxr_last(node_idx) float_buffer_1[tree_size * 20 + node_idx]\n#define FLD_RADIAL_CHILD_MAXR_LAST_POSITION 20\n#define FLD_RADIAL_CHILD_MAXR_LAST_BUFFER float_buffer_1\n#define refname(node_idx) grammartokens_buffer_1[tree_size * 1 + node_idx]\n#define REFNAME_POSITION 1\n#define REFNAME_BUFFER grammartokens_buffer_1\n#define fld_root_radius(node_idx) float_buffer_1[tree_size * 26 + node_idx]\n#define FLD_ROOT_RADIUS_POSITION 26\n#define FLD_ROOT_RADIUS_BUFFER float_buffer_1\n#define fld_root_w(node_idx) float_buffer_1[tree_size * 23 + node_idx]\n#define FLD_ROOT_W_POSITION 23\n#define FLD_ROOT_W_BUFFER float_buffer_1\n#define fld_radial_numopenchildren_init(node_idx) int_buffer_1[tree_size * 22 + node_idx]\n#define FLD_RADIAL_NUMOPENCHILDREN_INIT_POSITION 22\n#define FLD_RADIAL_NUMOPENCHILDREN_INIT_BUFFER int_buffer_1\n#define fld_radial_numopenchildren_last(node_idx) int_buffer_1[tree_size * 23 + node_idx]\n#define FLD_RADIAL_NUMOPENCHILDREN_LAST_POSITION 23\n#define FLD_RADIAL_NUMOPENCHILDREN_LAST_BUFFER int_buffer_1\n#define fld_radial_child_alpha_last(node_idx) float_buffer_1[tree_size * 10 + node_idx]\n#define FLD_RADIAL_CHILD_ALPHA_LAST_POSITION 10\n#define FLD_RADIAL_CHILD_ALPHA_LAST_BUFFER float_buffer_1\n#define fld_node___dorenderinglast__(node_idx) int_buffer_1[tree_size * 3 + node_idx]\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 3\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n";
