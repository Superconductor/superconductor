this.GetAbsoluteIndex = function (rel, ref) { return rel == 0 ? 0 : (rel + ref); } ;
this._gen_getKernels = function() {
};
this._gen_allocateClBuffers = function() {
};
this._gen_transferTree = function() {
};
this._gen_retrieveTree = function() {
};
this._gen_setKernelArguments = function(kernel) {
if (typeof webcl.enableExtension == "function") {
	kernel.setArg(0, new Uint32Array([0]));	// start_idx (default to 0)
	kernel.setArg(1, new Uint32Array([this.tree_size]));
} else {
	console.debug("Legacy set args");
	var types = window.WebCLKernelArgumentTypes;
}
};
this._gen_runTraversals = function() {
	this._gen_run_visit_0();
	this._gen_run_visit_1();
	this._gen_run_visit_2();
	this._gen_run_visit_3();
};
this._gen_run_visitAsync_0 = 
	[this.topDownTraversalAsync, "visit_0"]; {
};
this._gen_run_visitAsync_1 = 
	[this.bottomUpTraversalAsync, "visit_1"]; {
};
this._gen_run_visitAsync_2 = 
	[this.topDownTraversalAsync, "visit_2"]; {
};
this._gen_run_visitAsync_3 = 
	[this.bottomUpTraversalAsync, "visit_3"]; {
};
this._gen_run_visitAsync_4 = 
	[this.topDownTraversalAsync, "visit_4"]; {
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
this.TOK_CHILD = 5; this.TOK_ROOT = 10; this.TOK_IGNORE = 8; this.TOK_CHILDS = 6; this.TOK_LEAF = 9; this.TOK_UNDEFINED = 12; this.TOK_HBOX = 7; this.TOK_TEXTBOX = 11;
// Generated code. Modifcation to this file will be lost on next code generation.
/**
 * @file   cl_runner_generated_buffer_info.h
 * @author Superconductor v0.1
 * @date   23/03/2014 20:55:12
 * @brief  Contains macros needed to access fields within monolithic OpenCL
 * buffers.
 * 
 * @warning Generated code. Modifcation to this file will be lost on next
 * code generation.
 *
 * This file defines several sets of macros intended for use with the 
 * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic
 * buffers are a way of packing multiple different fields (represented by
 * structure-split arrays) into a single OpenCL buffer so as to minimize the
 * number of arguments needed to be passed to OpenCL.
 *
 * The macros contained here are of three classes:
 * @li @c buffer_name_size The number of fields packed into buffer buffer_name.
 * @li @c NUM_BUFFERS The total number of buffers define herein.
 * @li @c fld_class_property(node_idx) Macro to access the specified property of
 * for the node at node_idx.
 */
hbox___draw__ = function  (_ale_arg0) { return _ale_arg0; }
hbox___draw__1 = function  (_ale_arg6, _ale_arg3, _ale_arg8, _ale_arg1, _ale_arg2,  _ale_arg0, _ale_arg7, _ale_arg5, _ale_arg4) { return (RectangleZ_draw(_ale_arg0, (_ale_arg1 + _ale_arg2), _ale_arg3, _ale_arg4, (_ale_arg5 + 40), _ale_arg6, _ale_arg7, 0.0, rgba(255, 0, 0, 153)) + _ale_arg8); }
hbox___selfRenderSize__3 = function  (_ale_arg1, _ale_arg0) { return Line_size((_ale_arg0 + 20), (_ale_arg1 + 80), ((_ale_arg0 + 20) + 10), ((_ale_arg1 + 10) + 80), 5.0, rgba(0, 0, 255, 153)); }
hbox_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
hbox_childs_depth = function  (_ale_arg0) { return (_ale_arg0 + 1); }
hbox___selfRenderSize__ = function  (_ale_arg3, _ale_arg2, _ale_arg1, _ale_arg0) { return (((_ale_arg0 + _ale_arg1) + _ale_arg2) + _ale_arg3); }
hbox___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
hbox_childs_x = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
hbox___draw__0 = function  (_ale_arg5, _ale_arg2, _ale_arg1,  _ale_arg0, _ale_arg7, _ale_arg6, _ale_arg4, _ale_arg3) { return (RectangleOutline_draw(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, 1.0, rgb(100, 0, 0)) + _ale_arg7); }
hbox___selfRenderSize__2 = function  (_ale_arg1, _ale_arg0) { return Line3D_size(_ale_arg0, (_ale_arg1 + 80), 0.0, (_ale_arg0 + 10), ((_ale_arg1 + 10) + 80), 0.0, 5.0, rgba(255, 0, 0, 153)); }
hbox___selfRenderSize__0 = function  (_ale_arg2, _ale_arg3, _ale_arg1, _ale_arg0) { return RectangleOutline_size(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, 1.0, rgb(100, 0, 0)); }
hbox_childs_y = function  (_ale_arg0) { return (_ale_arg0 + 5); }
hbox___draw__3 = function  (_ale_arg5, _ale_arg8, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4,  _ale_arg0, _ale_arg7, _ale_arg6) { return (Line_draw(_ale_arg0, (_ale_arg1 + (_ale_arg2 + (_ale_arg3 + _ale_arg4))), _ale_arg5, (_ale_arg6 + 20), (_ale_arg7 + 80), ((_ale_arg6 + 20) + 10), ((_ale_arg7 + 10) + 80), 5.0, rgba(0, 0, 255, 153)) + _ale_arg8); }
hbox___selfRenderSize__1 = function  (_ale_arg2, _ale_arg3, _ale_arg1, _ale_arg0) { return RectangleZ_size(_ale_arg0, (_ale_arg1 + 40), _ale_arg2, _ale_arg3, 0.0, rgba(255, 0, 0, 153)); }
hbox___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
hbox___draw__2 = function  (_ale_arg4, _ale_arg1, _ale_arg2, _ale_arg7, _ale_arg3,  _ale_arg0, _ale_arg6, _ale_arg5) { return (Line3D_draw(_ale_arg0, (_ale_arg1 + (_ale_arg2 + _ale_arg3)), _ale_arg4, _ale_arg5, (_ale_arg6 + 80), 0.0, (_ale_arg5 + 10), ((_ale_arg6 + 10) + 80), 0.0, 5.0, rgba(255, 0, 0, 153)) + _ale_arg7); }
root___selfRenderSize__ = function  () { return 0; }
root_child_depth = function  () { return 0; }
root_child___renderRightOffset__ = function  (_ale_arg2, _ale_arg1, _ale_arg0) { return ((_ale_arg0 + _ale_arg1) + _ale_arg2); }
root_w = function  (_ale_arg0) { return (_ale_arg0 + 10); }
root___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
root___renderSize__ = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
root_child___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
root_child_rx = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
root___childRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
root_h = function  (_ale_arg0) { return (_ale_arg0 + 10); }
root___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
root_child_x = function  (_ale_arg0) { return (5 + _ale_arg0); }
root___draw__ = function  () { return 0; }
root_child_y = function  () { return 5; }
root___renderRightOffset__ = function  (_ale_arg0) { return _ale_arg0; }
leaf___draw__ = function  (_ale_arg0) { return _ale_arg0; }
leaf___draw__0 = function  (_ale_arg5, _ale_arg7, _ale_arg2, _ale_arg1,  _ale_arg0, _ale_arg8, _ale_arg6, _ale_arg4, _ale_arg3) { return (Rectangle_draw(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, _ale_arg7) + _ale_arg8); }
leaf___renderSize__ = function  (_ale_arg0) { return _ale_arg0; }
leaf___selfRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
leaf___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
leaf_w = function  () { return 10; }
leaf___selfRenderSize__0 = function  (_ale_arg2, _ale_arg4, _ale_arg3, _ale_arg1, _ale_arg0) { return Rectangle_size(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4); }
leaf_h = function  () { return 10; }
// Generated code. Modifcation to this file will be lost on next code generation.
/**
 * @file traversals.cl
 * @brief OpenCL code to run layout solver traversals.
 */
  
  
  
  
  
///// pass /////
this.visit_leaf_0 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_h[index] = leaf_h();
  this.fld_node_w[index] = leaf_w();
}
this.visit_hbox_0 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_depth[current_node] = ((this.fld_node_depth[index] + 1));
      this.fld_node_y[current_node] = ((this.fld_node_y[index] + 5));
   prev_child_idx = current_node; }
}
this.visit_root_0 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_depth[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child_depth();
  this.fld_node_x[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child_x(this.fld_iroot_userinput[index]);
  this.fld_node_y[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child_y();
  this.fld_root___draw__[index] = root___draw__();
  this.fld_root___selfrendersize__[index] = root___selfRenderSize__();
  this.fld_node___dorenderinglast__[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child___doRenderingLast__(this.fld_root___draw__[index]);
}
///// pass /////
this.visit_leaf_1 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_hbox_1 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_hbox_h_init[index] = (5);
  this.fld_node_h[index] = this.fld_hbox_h_init[index];
    this.fld_hbox_w_init[index] = (5);
  this.fld_node_w[index] = this.fld_hbox_w_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[index] = (((this.fld_node_h[index] > (this.fld_node_h[current_node] + 10)) ? this.fld_node_h[index] : (this.fld_node_h[current_node] + 10)));
      this.fld_node_w[index] = (((this.fld_node_w[index] + this.fld_node_w[current_node]) + 5));
   prev_child_idx = current_node; }
}
this.visit_root_1 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_rx[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child_rx(this.fld_node_w[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)], this.fld_node_x[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)]);
  this.fld_iroot_h[index] = root_h(this.fld_node_h[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)]);
  this.fld_iroot_w[index] = root_w(this.fld_node_w[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)]);
}
///// pass /////
this.visit_leaf_2 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_leaf___selfrendersize__0[index] = leaf___selfRenderSize__0(this.fld_node_w[index], this.fld_leaf_color[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_leaf___selfrendersize__[index] = leaf___selfRenderSize__(this.fld_leaf___selfrendersize__0[index]);
  this.fld_node___rendersize__[index] = leaf___renderSize__(this.fld_leaf___selfrendersize__[index]);
}
this.visit_hbox_2 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_hbox___selfrendersize__0[index] = hbox___selfRenderSize__0(this.fld_node_w[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___selfrendersize__1[index] = hbox___selfRenderSize__1(this.fld_node_w[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___selfrendersize__2[index] = hbox___selfRenderSize__2(this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___selfrendersize__3[index] = hbox___selfRenderSize__3(this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___selfrendersize__[index] = hbox___selfRenderSize__(this.fld_hbox___selfrendersize__3[index], this.fld_hbox___selfrendersize__2[index], this.fld_hbox___selfrendersize__1[index], this.fld_hbox___selfrendersize__0[index]);
  this.fld_hbox_childs_rx_init[index] = (this.fld_node_x[index] );
  this.fld_hbox_childs_rx_last[index] = this.fld_hbox_childs_rx_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = ((((step == 1 ? (this.fld_hbox_childs_rx_last[index]) : (this.fld_node_rx[prev_child_idx])) + 5) + this.fld_node_w[current_node]));
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_x[current_node] = ((this.fld_node_rx[current_node] - this.fld_node_w[current_node]));
   prev_child_idx = current_node; }
}
this.visit_root_2 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
///// pass /////
this.visit_leaf_3 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_hbox_3 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_hbox___childsrendersize___init[index] = (0);
  this.fld_hbox___childsrendersize__[index] = this.fld_hbox___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_hbox___childsrendersize__[index] = ((this.fld_hbox___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = hbox___renderSize__(this.fld_hbox___childsrendersize__[index], this.fld_hbox___selfrendersize__[index]);
}
this.visit_root_3 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_root___childrendersize__[index] = root___childRenderSize__(this.fld_node___rendersize__[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)]);
  this.fld_iroot___rendersize__[index] = root___renderSize__(this.fld_root___selfrendersize__[index], this.fld_root___childrendersize__[index]);
  this.fld_iroot___dorenderinglast__[index] = root___doRenderingLast__(this.fld_iroot___rendersize__[index]);
  this.fld_iroot___renderrightoffset__[index] = root___renderRightOffset__(this.fld_iroot___rendersize__[index]);
  this.fld_iroot___renderoffset__[index] = root___renderOffset__(this.fld_iroot___renderrightoffset__[index], this.fld_iroot___rendersize__[index]);
  this.fld_node___renderrightoffset__[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)] = root_child___renderRightOffset__(this.fld_node___rendersize__[this.GetAbsoluteIndex(this.fld_root_child_child_leftmost_child[index], index)], this.fld_root___selfrendersize__[index], this.fld_iroot___renderoffset__[index]);
}
///// pass /////
this.visit_leaf_4 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = leaf___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_leaf___draw__0[index] = leaf___draw__0(this.fld_node_w[index], this.fld_leaf_color[index], this.fld_leaf___selfrendersize__0[index], this.fld_node___renderoffset__[index], glBuffer, this.fld_node___dorenderinglast__[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_leaf___draw__[index] = leaf___draw__(this.fld_leaf___draw__0[index]);
}
this.visit_hbox_4 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = hbox___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_hbox___draw__0[index] = hbox___draw__0(this.fld_node_w[index], this.fld_hbox___selfrendersize__0[index], this.fld_node___renderoffset__[index], glBuffer, this.fld_node___dorenderinglast__[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___draw__1[index] = hbox___draw__1(this.fld_node_w[index], this.fld_hbox___selfrendersize__1[index], this.fld_hbox___draw__0[index], this.fld_hbox___selfrendersize__0[index], this.fld_node___renderoffset__[index], glBuffer, this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_hbox___selfrendersize__[index]));
  this.fld_hbox_childs___renderrightoffset___last[index] = this.fld_hbox_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_hbox_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_hbox___draw__2[index] = hbox___draw__2(this.fld_hbox___selfrendersize__2[index], this.fld_hbox___selfrendersize__1[index], this.fld_hbox___selfrendersize__0[index], this.fld_hbox___draw__1[index], this.fld_node___renderoffset__[index], glBuffer, this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___draw__3[index] = hbox___draw__3(this.fld_hbox___selfrendersize__3[index], this.fld_hbox___draw__2[index], this.fld_hbox___selfrendersize__2[index], this.fld_hbox___selfrendersize__1[index], this.fld_hbox___selfrendersize__0[index], this.fld_node___renderoffset__[index], glBuffer, this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_hbox___draw__[index] = hbox___draw__(this.fld_hbox___draw__3[index]);
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hbox_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_hbox___draw__[index] );
   prev_child_idx = current_node; }
}
this.visit_root_4 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
 // Main visit dispatcher kernels
this.visit_0 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_0(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HBOX:
			this.visit_hbox_0(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_LEAF:
			this.visit_leaf_0(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_1 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_1(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HBOX:
			this.visit_hbox_1(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_LEAF:
			this.visit_leaf_1(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_2 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_2(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HBOX:
			this.visit_hbox_2(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_LEAF:
			this.visit_leaf_2(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_3 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_3(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HBOX:
			this.visit_hbox_3(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_LEAF:
			this.visit_leaf_3(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_4 = function (index, tree_size,  float_buffer_1,  int_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_4(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_HBOX:
			this.visit_hbox_4(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_LEAF:
			this.visit_leaf_4(index, tree_size, float_buffer_1, int_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
	}
}
