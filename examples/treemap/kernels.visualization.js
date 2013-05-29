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
};
this._gen_runTraversals = function() {
	this._gen_run_visit_0();
	this._gen_run_visit_1();
	this._gen_run_visit_2();
	this._gen_run_visit_3();
};
this._gen_run_visit_0 = function() {
	this.topDownTraversal(this.visit_0);
};
this._gen_run_visit_1 = function() {
	this.bottomUpTraversal(this.visit_1);
};
this._gen_run_visit_2 = function() {
	this.topDownTraversal(this.visit_2);
};
this._gen_run_visit_3 = function() {
	this.bottomUpTraversal(this.visit_3);
};
this._gen_run_visit_4 = function(clVBO) {
	this.topDownTraversal(this.visit_4);
};
// Defines all the typed array buffers which will store data locally before
// sending it to the CL device, then populates them with data
this._gen_allocateHostBuffers = function(treeSize) {
};
this._gen_allocateHostProxies = function (treeSize) {
	this.displayname = this.grammartokens_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_countrycontainer_child_childs_count = this.int_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_countrycontainer_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_countrycontainer_childs_by_init = this.float_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_countrycontainer_childs_by_last = this.float_buffer_1.subarray(treeSize * 28, (treeSize * 28) + treeSize);
	this.fld_countrycontainer_childs_fixwidth_init = this.int_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_countrycontainer_childs_fixwidth_last = this.int_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_countrycontainer_childs_h_init = this.float_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_countrycontainer_childs_h_last = this.float_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_countrycontainer_childs_maxturnout_init = this.float_buffer_1.subarray(treeSize * 31, (treeSize * 31) + treeSize);
	this.fld_countrycontainer_childs_maxturnout_last = this.float_buffer_1.subarray(treeSize * 32, (treeSize * 32) + treeSize);
	this.fld_countrycontainer_childs_minturnout_init = this.float_buffer_1.subarray(treeSize * 37, (treeSize * 37) + treeSize);
	this.fld_countrycontainer_childs_minturnout_last = this.float_buffer_1.subarray(treeSize * 38, (treeSize * 38) + treeSize);
	this.fld_countrycontainer_childs_rx_init = this.float_buffer_1.subarray(treeSize * 29, (treeSize * 29) + treeSize);
	this.fld_countrycontainer_childs_rx_last = this.float_buffer_1.subarray(treeSize * 30, (treeSize * 30) + treeSize);
	this.fld_countrycontainer_childs_showfraud_init = this.float_buffer_1.subarray(treeSize * 39, (treeSize * 39) + treeSize);
	this.fld_countrycontainer_childs_showfraud_last = this.float_buffer_1.subarray(treeSize * 40, (treeSize * 40) + treeSize);
	this.fld_countrycontainer_childs_showjavascript_init = this.float_buffer_1.subarray(treeSize * 21, (treeSize * 21) + treeSize);
	this.fld_countrycontainer_childs_showjavascript_last = this.float_buffer_1.subarray(treeSize * 22, (treeSize * 22) + treeSize);
	this.fld_countrycontainer_childs_showprojected_init = this.float_buffer_1.subarray(treeSize * 35, (treeSize * 35) + treeSize);
	this.fld_countrycontainer_childs_showprojected_last = this.float_buffer_1.subarray(treeSize * 36, (treeSize * 36) + treeSize);
	this.fld_countrycontainer_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 23, (treeSize * 23) + treeSize);
	this.fld_countrycontainer_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 24, (treeSize * 24) + treeSize);
	this.fld_countrycontainer_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 29, (treeSize * 29) + treeSize);
	this.fld_countrycontainer_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 30, (treeSize * 30) + treeSize);
	this.fld_countrycontainer_childs_w_init = this.float_buffer_1.subarray(treeSize * 33, (treeSize * 33) + treeSize);
	this.fld_countrycontainer_childs_w_last = this.float_buffer_1.subarray(treeSize * 34, (treeSize * 34) + treeSize);
	this.fld_countrycontainer_totalmag_init = this.float_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_countrycontainer_totalmag_last = this.float_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_countrycontainer___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_countrycontainer___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 25, (treeSize * 25) + treeSize);
	this.fld_countrycontainer___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 26, (treeSize * 26) + treeSize);
	this.fld_countrycontainer___draw__ = this.int_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_countrycontainer___draw__0 = this.int_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_countrycontainer___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_countrycontainer___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_countrycontainer_votesur_init = this.int_buffer_1.subarray(treeSize * 27, (treeSize * 27) + treeSize);
	this.fld_countrycontainer_votesur_last = this.int_buffer_1.subarray(treeSize * 28, (treeSize * 28) + treeSize);
	this.fld_district_child_childs_count = this.int_buffer_1.subarray(treeSize * 50, (treeSize * 50) + treeSize);
	this.fld_district_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_district_childs_by_init = this.float_buffer_1.subarray(treeSize * 67, (treeSize * 67) + treeSize);
	this.fld_district_childs_by_last = this.float_buffer_1.subarray(treeSize * 68, (treeSize * 68) + treeSize);
	this.fld_district_childs_fixwidth_init = this.int_buffer_1.subarray(treeSize * 51, (treeSize * 51) + treeSize);
	this.fld_district_childs_fixwidth_last = this.int_buffer_1.subarray(treeSize * 52, (treeSize * 52) + treeSize);
	this.fld_district_childs_h_init = this.float_buffer_1.subarray(treeSize * 63, (treeSize * 63) + treeSize);
	this.fld_district_childs_h_last = this.float_buffer_1.subarray(treeSize * 64, (treeSize * 64) + treeSize);
	this.fld_district_childs_maxturnout_init = this.float_buffer_1.subarray(treeSize * 71, (treeSize * 71) + treeSize);
	this.fld_district_childs_maxturnout_last = this.float_buffer_1.subarray(treeSize * 72, (treeSize * 72) + treeSize);
	this.fld_district_childs_minturnout_init = this.float_buffer_1.subarray(treeSize * 77, (treeSize * 77) + treeSize);
	this.fld_district_childs_minturnout_last = this.float_buffer_1.subarray(treeSize * 78, (treeSize * 78) + treeSize);
	this.fld_district_childs_rx_init = this.float_buffer_1.subarray(treeSize * 69, (treeSize * 69) + treeSize);
	this.fld_district_childs_rx_last = this.float_buffer_1.subarray(treeSize * 70, (treeSize * 70) + treeSize);
	this.fld_district_childs_showfraud_init = this.float_buffer_1.subarray(treeSize * 79, (treeSize * 79) + treeSize);
	this.fld_district_childs_showfraud_last = this.float_buffer_1.subarray(treeSize * 80, (treeSize * 80) + treeSize);
	this.fld_district_childs_showjavascript_init = this.float_buffer_1.subarray(treeSize * 61, (treeSize * 61) + treeSize);
	this.fld_district_childs_showjavascript_last = this.float_buffer_1.subarray(treeSize * 62, (treeSize * 62) + treeSize);
	this.fld_district_childs_showprojected_init = this.float_buffer_1.subarray(treeSize * 75, (treeSize * 75) + treeSize);
	this.fld_district_childs_showprojected_last = this.float_buffer_1.subarray(treeSize * 76, (treeSize * 76) + treeSize);
	this.fld_district_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 53, (treeSize * 53) + treeSize);
	this.fld_district_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 54, (treeSize * 54) + treeSize);
	this.fld_district_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 59, (treeSize * 59) + treeSize);
	this.fld_district_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 60, (treeSize * 60) + treeSize);
	this.fld_district_childs_w_init = this.float_buffer_1.subarray(treeSize * 73, (treeSize * 73) + treeSize);
	this.fld_district_childs_w_last = this.float_buffer_1.subarray(treeSize * 74, (treeSize * 74) + treeSize);
	this.fld_district_totalmag_init = this.float_buffer_1.subarray(treeSize * 65, (treeSize * 65) + treeSize);
	this.fld_district_totalmag_last = this.float_buffer_1.subarray(treeSize * 66, (treeSize * 66) + treeSize);
	this.fld_district___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 45, (treeSize * 45) + treeSize);
	this.fld_district___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 55, (treeSize * 55) + treeSize);
	this.fld_district___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 56, (treeSize * 56) + treeSize);
	this.fld_district___draw__ = this.int_buffer_1.subarray(treeSize * 48, (treeSize * 48) + treeSize);
	this.fld_district___draw__0 = this.int_buffer_1.subarray(treeSize * 47, (treeSize * 47) + treeSize);
	this.fld_district___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 49, (treeSize * 49) + treeSize);
	this.fld_district___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 46, (treeSize * 46) + treeSize);
	this.fld_district_votesur_init = this.int_buffer_1.subarray(treeSize * 57, (treeSize * 57) + treeSize);
	this.fld_district_votesur_last = this.int_buffer_1.subarray(treeSize * 58, (treeSize * 58) + treeSize);
	this.fld_hsquare_child_childs_count = this.int_buffer_1.subarray(treeSize * 78, (treeSize * 78) + treeSize);
	this.fld_hsquare_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_hsquare_childs_by_init = this.float_buffer_1.subarray(treeSize * 107, (treeSize * 107) + treeSize);
	this.fld_hsquare_childs_by_last = this.float_buffer_1.subarray(treeSize * 108, (treeSize * 108) + treeSize);
	this.fld_hsquare_childs_fixwidth_init = this.int_buffer_1.subarray(treeSize * 79, (treeSize * 79) + treeSize);
	this.fld_hsquare_childs_fixwidth_last = this.int_buffer_1.subarray(treeSize * 80, (treeSize * 80) + treeSize);
	this.fld_hsquare_childs_h_init = this.float_buffer_1.subarray(treeSize * 103, (treeSize * 103) + treeSize);
	this.fld_hsquare_childs_h_last = this.float_buffer_1.subarray(treeSize * 104, (treeSize * 104) + treeSize);
	this.fld_hsquare_childs_maxturnout_init = this.float_buffer_1.subarray(treeSize * 113, (treeSize * 113) + treeSize);
	this.fld_hsquare_childs_maxturnout_last = this.float_buffer_1.subarray(treeSize * 114, (treeSize * 114) + treeSize);
	this.fld_hsquare_childs_minturnout_init = this.float_buffer_1.subarray(treeSize * 117, (treeSize * 117) + treeSize);
	this.fld_hsquare_childs_minturnout_last = this.float_buffer_1.subarray(treeSize * 118, (treeSize * 118) + treeSize);
	this.fld_hsquare_childs_rx_init = this.float_buffer_1.subarray(treeSize * 109, (treeSize * 109) + treeSize);
	this.fld_hsquare_childs_rx_last = this.float_buffer_1.subarray(treeSize * 110, (treeSize * 110) + treeSize);
	this.fld_hsquare_childs_showfraud_init = this.float_buffer_1.subarray(treeSize * 119, (treeSize * 119) + treeSize);
	this.fld_hsquare_childs_showfraud_last = this.float_buffer_1.subarray(treeSize * 120, (treeSize * 120) + treeSize);
	this.fld_hsquare_childs_showjavascript_init = this.float_buffer_1.subarray(treeSize * 101, (treeSize * 101) + treeSize);
	this.fld_hsquare_childs_showjavascript_last = this.float_buffer_1.subarray(treeSize * 102, (treeSize * 102) + treeSize);
	this.fld_hsquare_childs_showprojected_init = this.float_buffer_1.subarray(treeSize * 115, (treeSize * 115) + treeSize);
	this.fld_hsquare_childs_showprojected_last = this.float_buffer_1.subarray(treeSize * 116, (treeSize * 116) + treeSize);
	this.fld_hsquare_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 81, (treeSize * 81) + treeSize);
	this.fld_hsquare_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 82, (treeSize * 82) + treeSize);
	this.fld_hsquare_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 87, (treeSize * 87) + treeSize);
	this.fld_hsquare_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 88, (treeSize * 88) + treeSize);
	this.fld_hsquare_childs_w_init = this.float_buffer_1.subarray(treeSize * 111, (treeSize * 111) + treeSize);
	this.fld_hsquare_childs_w_last = this.float_buffer_1.subarray(treeSize * 112, (treeSize * 112) + treeSize);
	this.fld_hsquare_totalmag_init = this.float_buffer_1.subarray(treeSize * 105, (treeSize * 105) + treeSize);
	this.fld_hsquare_totalmag_last = this.float_buffer_1.subarray(treeSize * 106, (treeSize * 106) + treeSize);
	this.fld_hsquare___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 75, (treeSize * 75) + treeSize);
	this.fld_hsquare___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 83, (treeSize * 83) + treeSize);
	this.fld_hsquare___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 84, (treeSize * 84) + treeSize);
	this.fld_hsquare___draw__ = this.int_buffer_1.subarray(treeSize * 76, (treeSize * 76) + treeSize);
	this.fld_hsquare___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 77, (treeSize * 77) + treeSize);
	this.fld_hsquare_votesur_init = this.int_buffer_1.subarray(treeSize * 85, (treeSize * 85) + treeSize);
	this.fld_hsquare_votesur_last = this.int_buffer_1.subarray(treeSize * 86, (treeSize * 86) + treeSize);
	this.fld_iroot_fixwidth = this.int_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_iroot_height = this.float_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_iroot_maxturnout = this.float_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_iroot_minturnout = this.float_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_iroot_showfraud = this.float_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_iroot_showjavascript = this.float_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_iroot_showprojected = this.float_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_iroot_totalmag = this.float_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 3, (treeSize * 3) + treeSize);
	this.fld_iroot___renderoffset__ = this.int_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_iroot___rendersize__ = this.int_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_iroot_votesur = this.float_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.fld_iroot_width = this.float_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_node_by = this.float_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_node_fixwidth = this.int_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
	this.fld_node_h = this.float_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_node_maxturnout = this.float_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_node_minturnout = this.float_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_node_rx = this.float_buffer_1.subarray(treeSize * 17, (treeSize * 17) + treeSize);
	this.fld_node_showfraud = this.float_buffer_1.subarray(treeSize * 19, (treeSize * 19) + treeSize);
	this.fld_node_showjavascript = this.float_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_node_showprojected = this.float_buffer_1.subarray(treeSize * 16, (treeSize * 16) + treeSize);
	this.fld_node_totalmag = this.float_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_node___dorenderinglast__ = this.int_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.fld_node___renderoffset__ = this.int_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.fld_node___renderrightoffset__ = this.int_buffer_1.subarray(treeSize * 5, (treeSize * 5) + treeSize);
	this.fld_node___rendersize__ = this.int_buffer_1.subarray(treeSize * 10, (treeSize * 10) + treeSize);
	this.fld_node_votesur = this.int_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.fld_node_w = this.float_buffer_1.subarray(treeSize * 15, (treeSize * 15) + treeSize);
	this.fld_node_x = this.float_buffer_1.subarray(treeSize * 20, (treeSize * 20) + treeSize);
	this.fld_node_y = this.float_buffer_1.subarray(treeSize * 18, (treeSize * 18) + treeSize);
	this.fld_pollingplace_calcfraudcolor = this.int_buffer_1.subarray(treeSize * 95, (treeSize * 95) + treeSize);
	this.fld_pollingplace_calcprojectedcolor = this.int_buffer_1.subarray(treeSize * 102, (treeSize * 102) + treeSize);
	this.fld_pollingplace_calcregularcolor = this.int_buffer_1.subarray(treeSize * 99, (treeSize * 99) + treeSize);
	this.fld_pollingplace_calcvotescolor = this.int_buffer_1.subarray(treeSize * 101, (treeSize * 101) + treeSize);
	this.fld_pollingplace_defcolor = this.int_buffer_1.subarray(treeSize * 89, (treeSize * 89) + treeSize);
	this.fld_pollingplace_fraudcolor = this.int_buffer_1.subarray(treeSize * 93, (treeSize * 93) + treeSize);
	this.fld_pollingplace_injavascript = this.int_buffer_1.subarray(treeSize * 90, (treeSize * 90) + treeSize);
	this.fld_pollingplace_magnitude = this.float_buffer_1.subarray(treeSize * 124, (treeSize * 124) + treeSize);
	this.fld_pollingplace_totalvotes = this.int_buffer_1.subarray(treeSize * 92, (treeSize * 92) + treeSize);
	this.fld_pollingplace_totalvotesur = this.int_buffer_1.subarray(treeSize * 94, (treeSize * 94) + treeSize);
	this.fld_pollingplace_turnout = this.float_buffer_1.subarray(treeSize * 122, (treeSize * 122) + treeSize);
	this.fld_pollingplace_urcolor = this.int_buffer_1.subarray(treeSize * 91, (treeSize * 91) + treeSize);
	this.fld_pollingplace_urvotes = this.float_buffer_1.subarray(treeSize * 123, (treeSize * 123) + treeSize);
	this.fld_pollingplace_urvotesprojected = this.float_buffer_1.subarray(treeSize * 121, (treeSize * 121) + treeSize);
	this.fld_pollingplace___draw__ = this.int_buffer_1.subarray(treeSize * 98, (treeSize * 98) + treeSize);
	this.fld_pollingplace___draw__0 = this.int_buffer_1.subarray(treeSize * 97, (treeSize * 97) + treeSize);
	this.fld_pollingplace___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 100, (treeSize * 100) + treeSize);
	this.fld_pollingplace___selfrendersize__0 = this.int_buffer_1.subarray(treeSize * 96, (treeSize * 96) + treeSize);
	this.fld_region_child_childs_count = this.int_buffer_1.subarray(treeSize * 34, (treeSize * 34) + treeSize);
	this.fld_region_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 2, (treeSize * 2) + treeSize);
	this.fld_region_childs_by_init = this.float_buffer_1.subarray(treeSize * 47, (treeSize * 47) + treeSize);
	this.fld_region_childs_by_last = this.float_buffer_1.subarray(treeSize * 48, (treeSize * 48) + treeSize);
	this.fld_region_childs_fixwidth_init = this.int_buffer_1.subarray(treeSize * 35, (treeSize * 35) + treeSize);
	this.fld_region_childs_fixwidth_last = this.int_buffer_1.subarray(treeSize * 36, (treeSize * 36) + treeSize);
	this.fld_region_childs_h_init = this.float_buffer_1.subarray(treeSize * 43, (treeSize * 43) + treeSize);
	this.fld_region_childs_h_last = this.float_buffer_1.subarray(treeSize * 44, (treeSize * 44) + treeSize);
	this.fld_region_childs_maxturnout_init = this.float_buffer_1.subarray(treeSize * 51, (treeSize * 51) + treeSize);
	this.fld_region_childs_maxturnout_last = this.float_buffer_1.subarray(treeSize * 52, (treeSize * 52) + treeSize);
	this.fld_region_childs_minturnout_init = this.float_buffer_1.subarray(treeSize * 57, (treeSize * 57) + treeSize);
	this.fld_region_childs_minturnout_last = this.float_buffer_1.subarray(treeSize * 58, (treeSize * 58) + treeSize);
	this.fld_region_childs_rx_init = this.float_buffer_1.subarray(treeSize * 49, (treeSize * 49) + treeSize);
	this.fld_region_childs_rx_last = this.float_buffer_1.subarray(treeSize * 50, (treeSize * 50) + treeSize);
	this.fld_region_childs_showfraud_init = this.float_buffer_1.subarray(treeSize * 59, (treeSize * 59) + treeSize);
	this.fld_region_childs_showfraud_last = this.float_buffer_1.subarray(treeSize * 60, (treeSize * 60) + treeSize);
	this.fld_region_childs_showjavascript_init = this.float_buffer_1.subarray(treeSize * 41, (treeSize * 41) + treeSize);
	this.fld_region_childs_showjavascript_last = this.float_buffer_1.subarray(treeSize * 42, (treeSize * 42) + treeSize);
	this.fld_region_childs_showprojected_init = this.float_buffer_1.subarray(treeSize * 55, (treeSize * 55) + treeSize);
	this.fld_region_childs_showprojected_last = this.float_buffer_1.subarray(treeSize * 56, (treeSize * 56) + treeSize);
	this.fld_region_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 37, (treeSize * 37) + treeSize);
	this.fld_region_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 38, (treeSize * 38) + treeSize);
	this.fld_region_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 43, (treeSize * 43) + treeSize);
	this.fld_region_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 44, (treeSize * 44) + treeSize);
	this.fld_region_childs_w_init = this.float_buffer_1.subarray(treeSize * 53, (treeSize * 53) + treeSize);
	this.fld_region_childs_w_last = this.float_buffer_1.subarray(treeSize * 54, (treeSize * 54) + treeSize);
	this.fld_region_totalmag_init = this.float_buffer_1.subarray(treeSize * 45, (treeSize * 45) + treeSize);
	this.fld_region_totalmag_last = this.float_buffer_1.subarray(treeSize * 46, (treeSize * 46) + treeSize);
	this.fld_region___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 31, (treeSize * 31) + treeSize);
	this.fld_region___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 39, (treeSize * 39) + treeSize);
	this.fld_region___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 40, (treeSize * 40) + treeSize);
	this.fld_region___draw__ = this.int_buffer_1.subarray(treeSize * 32, (treeSize * 32) + treeSize);
	this.fld_region___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 33, (treeSize * 33) + treeSize);
	this.fld_region_votesur_init = this.int_buffer_1.subarray(treeSize * 41, (treeSize * 41) + treeSize);
	this.fld_region_votesur_last = this.int_buffer_1.subarray(treeSize * 42, (treeSize * 42) + treeSize);
	this.fld_root_child_childs_count = this.int_buffer_1.subarray(treeSize * 14, (treeSize * 14) + treeSize);
	this.fld_root_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 0, (treeSize * 0) + treeSize);
	this.fld_root___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 11, (treeSize * 11) + treeSize);
	this.fld_root___draw__ = this.int_buffer_1.subarray(treeSize * 12, (treeSize * 12) + treeSize);
	this.fld_root___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 13, (treeSize * 13) + treeSize);
	this.fld_vsquare_child_childs_count = this.int_buffer_1.subarray(treeSize * 64, (treeSize * 64) + treeSize);
	this.fld_vsquare_child_childs_leftmost_child = this.nodeindex_buffer_1.subarray(treeSize * 4, (treeSize * 4) + treeSize);
	this.fld_vsquare_childs_by_init = this.float_buffer_1.subarray(treeSize * 87, (treeSize * 87) + treeSize);
	this.fld_vsquare_childs_by_last = this.float_buffer_1.subarray(treeSize * 88, (treeSize * 88) + treeSize);
	this.fld_vsquare_childs_fixwidth_init = this.int_buffer_1.subarray(treeSize * 65, (treeSize * 65) + treeSize);
	this.fld_vsquare_childs_fixwidth_last = this.int_buffer_1.subarray(treeSize * 66, (treeSize * 66) + treeSize);
	this.fld_vsquare_childs_h_init = this.float_buffer_1.subarray(treeSize * 83, (treeSize * 83) + treeSize);
	this.fld_vsquare_childs_h_last = this.float_buffer_1.subarray(treeSize * 84, (treeSize * 84) + treeSize);
	this.fld_vsquare_childs_maxturnout_init = this.float_buffer_1.subarray(treeSize * 93, (treeSize * 93) + treeSize);
	this.fld_vsquare_childs_maxturnout_last = this.float_buffer_1.subarray(treeSize * 94, (treeSize * 94) + treeSize);
	this.fld_vsquare_childs_minturnout_init = this.float_buffer_1.subarray(treeSize * 97, (treeSize * 97) + treeSize);
	this.fld_vsquare_childs_minturnout_last = this.float_buffer_1.subarray(treeSize * 98, (treeSize * 98) + treeSize);
	this.fld_vsquare_childs_rx_init = this.float_buffer_1.subarray(treeSize * 89, (treeSize * 89) + treeSize);
	this.fld_vsquare_childs_rx_last = this.float_buffer_1.subarray(treeSize * 90, (treeSize * 90) + treeSize);
	this.fld_vsquare_childs_showfraud_init = this.float_buffer_1.subarray(treeSize * 99, (treeSize * 99) + treeSize);
	this.fld_vsquare_childs_showfraud_last = this.float_buffer_1.subarray(treeSize * 100, (treeSize * 100) + treeSize);
	this.fld_vsquare_childs_showjavascript_init = this.float_buffer_1.subarray(treeSize * 81, (treeSize * 81) + treeSize);
	this.fld_vsquare_childs_showjavascript_last = this.float_buffer_1.subarray(treeSize * 82, (treeSize * 82) + treeSize);
	this.fld_vsquare_childs_showprojected_init = this.float_buffer_1.subarray(treeSize * 95, (treeSize * 95) + treeSize);
	this.fld_vsquare_childs_showprojected_last = this.float_buffer_1.subarray(treeSize * 96, (treeSize * 96) + treeSize);
	this.fld_vsquare_childs___dorenderinglast___init = this.int_buffer_1.subarray(treeSize * 67, (treeSize * 67) + treeSize);
	this.fld_vsquare_childs___dorenderinglast___last = this.int_buffer_1.subarray(treeSize * 68, (treeSize * 68) + treeSize);
	this.fld_vsquare_childs___renderrightoffset___init = this.int_buffer_1.subarray(treeSize * 73, (treeSize * 73) + treeSize);
	this.fld_vsquare_childs___renderrightoffset___last = this.int_buffer_1.subarray(treeSize * 74, (treeSize * 74) + treeSize);
	this.fld_vsquare_childs_w_init = this.float_buffer_1.subarray(treeSize * 91, (treeSize * 91) + treeSize);
	this.fld_vsquare_childs_w_last = this.float_buffer_1.subarray(treeSize * 92, (treeSize * 92) + treeSize);
	this.fld_vsquare_totalmag_init = this.float_buffer_1.subarray(treeSize * 85, (treeSize * 85) + treeSize);
	this.fld_vsquare_totalmag_last = this.float_buffer_1.subarray(treeSize * 86, (treeSize * 86) + treeSize);
	this.fld_vsquare___childsrendersize__ = this.int_buffer_1.subarray(treeSize * 61, (treeSize * 61) + treeSize);
	this.fld_vsquare___childsrendersize___init = this.int_buffer_1.subarray(treeSize * 69, (treeSize * 69) + treeSize);
	this.fld_vsquare___childsrendersize___last = this.int_buffer_1.subarray(treeSize * 70, (treeSize * 70) + treeSize);
	this.fld_vsquare___draw__ = this.int_buffer_1.subarray(treeSize * 62, (treeSize * 62) + treeSize);
	this.fld_vsquare___selfrendersize__ = this.int_buffer_1.subarray(treeSize * 63, (treeSize * 63) + treeSize);
	this.fld_vsquare_votesur_init = this.int_buffer_1.subarray(treeSize * 71, (treeSize * 71) + treeSize);
	this.fld_vsquare_votesur_last = this.int_buffer_1.subarray(treeSize * 72, (treeSize * 72) + treeSize);
	this.id = this.nodeindex_buffer_1.subarray(treeSize * 9, (treeSize * 9) + treeSize);
	this.left_siblings = this.nodeindex_buffer_1.subarray(treeSize * 7, (treeSize * 7) + treeSize);
	this.parent = this.nodeindex_buffer_1.subarray(treeSize * 8, (treeSize * 8) + treeSize);
	this.refname = this.grammartokens_buffer_1.subarray(treeSize * 1, (treeSize * 1) + treeSize);
	this.right_siblings = this.nodeindex_buffer_1.subarray(treeSize * 6, (treeSize * 6) + treeSize);
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
	this.proxyData.fld_countrycontainer_child_childs_count = new CLDataWrapper(this, this.fld_countrycontainer_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_countrycontainer_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_countrycontainer_childs_by_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_by_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_by_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_by_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_fixwidth_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_fixwidth_init, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs_fixwidth_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_fixwidth_last, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs_h_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_h_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_maxturnout_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_maxturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_maxturnout_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_maxturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_minturnout_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_minturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_minturnout_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_minturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_rx_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_rx_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showfraud_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_showfraud_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showfraud_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_showfraud_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showjavascript_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_showjavascript_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showjavascript_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_showjavascript_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showprojected_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_showprojected_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_showprojected_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_showprojected_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_countrycontainer_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_countrycontainer_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_countrycontainer_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_countrycontainer_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_childs_w_init = new CLDataWrapper(this, this.fld_countrycontainer_childs_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_childs_w_last = new CLDataWrapper(this, this.fld_countrycontainer_childs_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_totalmag_init = new CLDataWrapper(this, this.fld_countrycontainer_totalmag_init, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer_totalmag_last = new CLDataWrapper(this, this.fld_countrycontainer_totalmag_last, this.cl_float_buffer_1);
	this.proxyData.fld_countrycontainer___childsrendersize__ = new CLDataWrapper(this, this.fld_countrycontainer___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___childsrendersize___init = new CLDataWrapper(this, this.fld_countrycontainer___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___childsrendersize___last = new CLDataWrapper(this, this.fld_countrycontainer___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___draw__ = new CLDataWrapper(this, this.fld_countrycontainer___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___draw__0 = new CLDataWrapper(this, this.fld_countrycontainer___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___selfrendersize__ = new CLDataWrapper(this, this.fld_countrycontainer___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer___selfrendersize__0 = new CLDataWrapper(this, this.fld_countrycontainer___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_votesur_init = new CLDataWrapper(this, this.fld_countrycontainer_votesur_init, this.cl_int_buffer_1);
	this.proxyData.fld_countrycontainer_votesur_last = new CLDataWrapper(this, this.fld_countrycontainer_votesur_last, this.cl_int_buffer_1);
	this.proxyData.fld_district_child_childs_count = new CLDataWrapper(this, this.fld_district_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_district_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_district_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_district_childs_by_init = new CLDataWrapper(this, this.fld_district_childs_by_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_by_last = new CLDataWrapper(this, this.fld_district_childs_by_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_fixwidth_init = new CLDataWrapper(this, this.fld_district_childs_fixwidth_init, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs_fixwidth_last = new CLDataWrapper(this, this.fld_district_childs_fixwidth_last, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs_h_init = new CLDataWrapper(this, this.fld_district_childs_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_h_last = new CLDataWrapper(this, this.fld_district_childs_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_maxturnout_init = new CLDataWrapper(this, this.fld_district_childs_maxturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_maxturnout_last = new CLDataWrapper(this, this.fld_district_childs_maxturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_minturnout_init = new CLDataWrapper(this, this.fld_district_childs_minturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_minturnout_last = new CLDataWrapper(this, this.fld_district_childs_minturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_rx_init = new CLDataWrapper(this, this.fld_district_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_rx_last = new CLDataWrapper(this, this.fld_district_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showfraud_init = new CLDataWrapper(this, this.fld_district_childs_showfraud_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showfraud_last = new CLDataWrapper(this, this.fld_district_childs_showfraud_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showjavascript_init = new CLDataWrapper(this, this.fld_district_childs_showjavascript_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showjavascript_last = new CLDataWrapper(this, this.fld_district_childs_showjavascript_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showprojected_init = new CLDataWrapper(this, this.fld_district_childs_showprojected_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_showprojected_last = new CLDataWrapper(this, this.fld_district_childs_showprojected_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_district_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_district_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_district_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_district_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_district_childs_w_init = new CLDataWrapper(this, this.fld_district_childs_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_childs_w_last = new CLDataWrapper(this, this.fld_district_childs_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_district_totalmag_init = new CLDataWrapper(this, this.fld_district_totalmag_init, this.cl_float_buffer_1);
	this.proxyData.fld_district_totalmag_last = new CLDataWrapper(this, this.fld_district_totalmag_last, this.cl_float_buffer_1);
	this.proxyData.fld_district___childsrendersize__ = new CLDataWrapper(this, this.fld_district___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_district___childsrendersize___init = new CLDataWrapper(this, this.fld_district___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_district___childsrendersize___last = new CLDataWrapper(this, this.fld_district___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_district___draw__ = new CLDataWrapper(this, this.fld_district___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_district___draw__0 = new CLDataWrapper(this, this.fld_district___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_district___selfrendersize__ = new CLDataWrapper(this, this.fld_district___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_district___selfrendersize__0 = new CLDataWrapper(this, this.fld_district___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_district_votesur_init = new CLDataWrapper(this, this.fld_district_votesur_init, this.cl_int_buffer_1);
	this.proxyData.fld_district_votesur_last = new CLDataWrapper(this, this.fld_district_votesur_last, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_child_childs_count = new CLDataWrapper(this, this.fld_hsquare_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_hsquare_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_hsquare_childs_by_init = new CLDataWrapper(this, this.fld_hsquare_childs_by_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_by_last = new CLDataWrapper(this, this.fld_hsquare_childs_by_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_fixwidth_init = new CLDataWrapper(this, this.fld_hsquare_childs_fixwidth_init, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs_fixwidth_last = new CLDataWrapper(this, this.fld_hsquare_childs_fixwidth_last, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs_h_init = new CLDataWrapper(this, this.fld_hsquare_childs_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_h_last = new CLDataWrapper(this, this.fld_hsquare_childs_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_maxturnout_init = new CLDataWrapper(this, this.fld_hsquare_childs_maxturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_maxturnout_last = new CLDataWrapper(this, this.fld_hsquare_childs_maxturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_minturnout_init = new CLDataWrapper(this, this.fld_hsquare_childs_minturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_minturnout_last = new CLDataWrapper(this, this.fld_hsquare_childs_minturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_rx_init = new CLDataWrapper(this, this.fld_hsquare_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_rx_last = new CLDataWrapper(this, this.fld_hsquare_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showfraud_init = new CLDataWrapper(this, this.fld_hsquare_childs_showfraud_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showfraud_last = new CLDataWrapper(this, this.fld_hsquare_childs_showfraud_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showjavascript_init = new CLDataWrapper(this, this.fld_hsquare_childs_showjavascript_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showjavascript_last = new CLDataWrapper(this, this.fld_hsquare_childs_showjavascript_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showprojected_init = new CLDataWrapper(this, this.fld_hsquare_childs_showprojected_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_showprojected_last = new CLDataWrapper(this, this.fld_hsquare_childs_showprojected_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_hsquare_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_hsquare_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_hsquare_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_hsquare_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_childs_w_init = new CLDataWrapper(this, this.fld_hsquare_childs_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_childs_w_last = new CLDataWrapper(this, this.fld_hsquare_childs_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_totalmag_init = new CLDataWrapper(this, this.fld_hsquare_totalmag_init, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare_totalmag_last = new CLDataWrapper(this, this.fld_hsquare_totalmag_last, this.cl_float_buffer_1);
	this.proxyData.fld_hsquare___childsrendersize__ = new CLDataWrapper(this, this.fld_hsquare___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare___childsrendersize___init = new CLDataWrapper(this, this.fld_hsquare___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare___childsrendersize___last = new CLDataWrapper(this, this.fld_hsquare___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare___draw__ = new CLDataWrapper(this, this.fld_hsquare___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare___selfrendersize__ = new CLDataWrapper(this, this.fld_hsquare___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_votesur_init = new CLDataWrapper(this, this.fld_hsquare_votesur_init, this.cl_int_buffer_1);
	this.proxyData.fld_hsquare_votesur_last = new CLDataWrapper(this, this.fld_hsquare_votesur_last, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_fixwidth = new CLDataWrapper(this, this.fld_iroot_fixwidth, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_height = new CLDataWrapper(this, this.fld_iroot_height, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_maxturnout = new CLDataWrapper(this, this.fld_iroot_maxturnout, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_minturnout = new CLDataWrapper(this, this.fld_iroot_minturnout, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_showfraud = new CLDataWrapper(this, this.fld_iroot_showfraud, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_showjavascript = new CLDataWrapper(this, this.fld_iroot_showjavascript, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_showprojected = new CLDataWrapper(this, this.fld_iroot_showprojected, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_totalmag = new CLDataWrapper(this, this.fld_iroot_totalmag, this.cl_float_buffer_1);
	this.proxyData.fld_iroot___dorenderinglast__ = new CLDataWrapper(this, this.fld_iroot___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderoffset__ = new CLDataWrapper(this, this.fld_iroot___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___renderrightoffset__ = new CLDataWrapper(this, this.fld_iroot___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot___rendersize__ = new CLDataWrapper(this, this.fld_iroot___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_iroot_votesur = new CLDataWrapper(this, this.fld_iroot_votesur, this.cl_float_buffer_1);
	this.proxyData.fld_iroot_width = new CLDataWrapper(this, this.fld_iroot_width, this.cl_float_buffer_1);
	this.proxyData.fld_node_by = new CLDataWrapper(this, this.fld_node_by, this.cl_float_buffer_1);
	this.proxyData.fld_node_fixwidth = new CLDataWrapper(this, this.fld_node_fixwidth, this.cl_int_buffer_1);
	this.proxyData.fld_node_h = new CLDataWrapper(this, this.fld_node_h, this.cl_float_buffer_1);
	this.proxyData.fld_node_maxturnout = new CLDataWrapper(this, this.fld_node_maxturnout, this.cl_float_buffer_1);
	this.proxyData.fld_node_minturnout = new CLDataWrapper(this, this.fld_node_minturnout, this.cl_float_buffer_1);
	this.proxyData.fld_node_rx = new CLDataWrapper(this, this.fld_node_rx, this.cl_float_buffer_1);
	this.proxyData.fld_node_showfraud = new CLDataWrapper(this, this.fld_node_showfraud, this.cl_float_buffer_1);
	this.proxyData.fld_node_showjavascript = new CLDataWrapper(this, this.fld_node_showjavascript, this.cl_float_buffer_1);
	this.proxyData.fld_node_showprojected = new CLDataWrapper(this, this.fld_node_showprojected, this.cl_float_buffer_1);
	this.proxyData.fld_node_totalmag = new CLDataWrapper(this, this.fld_node_totalmag, this.cl_float_buffer_1);
	this.proxyData.fld_node___dorenderinglast__ = new CLDataWrapper(this, this.fld_node___dorenderinglast__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderoffset__ = new CLDataWrapper(this, this.fld_node___renderoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___renderrightoffset__ = new CLDataWrapper(this, this.fld_node___renderrightoffset__, this.cl_int_buffer_1);
	this.proxyData.fld_node___rendersize__ = new CLDataWrapper(this, this.fld_node___rendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_node_votesur = new CLDataWrapper(this, this.fld_node_votesur, this.cl_int_buffer_1);
	this.proxyData.fld_node_w = new CLDataWrapper(this, this.fld_node_w, this.cl_float_buffer_1);
	this.proxyData.fld_node_x = new CLDataWrapper(this, this.fld_node_x, this.cl_float_buffer_1);
	this.proxyData.fld_node_y = new CLDataWrapper(this, this.fld_node_y, this.cl_float_buffer_1);
	this.proxyData.fld_pollingplace_calcfraudcolor = new CLDataWrapper(this, this.fld_pollingplace_calcfraudcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_calcprojectedcolor = new CLDataWrapper(this, this.fld_pollingplace_calcprojectedcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_calcregularcolor = new CLDataWrapper(this, this.fld_pollingplace_calcregularcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_calcvotescolor = new CLDataWrapper(this, this.fld_pollingplace_calcvotescolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_defcolor = new CLDataWrapper(this, this.fld_pollingplace_defcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_fraudcolor = new CLDataWrapper(this, this.fld_pollingplace_fraudcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_injavascript = new CLDataWrapper(this, this.fld_pollingplace_injavascript, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_magnitude = new CLDataWrapper(this, this.fld_pollingplace_magnitude, this.cl_float_buffer_1);
	this.proxyData.fld_pollingplace_totalvotes = new CLDataWrapper(this, this.fld_pollingplace_totalvotes, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_totalvotesur = new CLDataWrapper(this, this.fld_pollingplace_totalvotesur, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_turnout = new CLDataWrapper(this, this.fld_pollingplace_turnout, this.cl_float_buffer_1);
	this.proxyData.fld_pollingplace_urcolor = new CLDataWrapper(this, this.fld_pollingplace_urcolor, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace_urvotes = new CLDataWrapper(this, this.fld_pollingplace_urvotes, this.cl_float_buffer_1);
	this.proxyData.fld_pollingplace_urvotesprojected = new CLDataWrapper(this, this.fld_pollingplace_urvotesprojected, this.cl_float_buffer_1);
	this.proxyData.fld_pollingplace___draw__ = new CLDataWrapper(this, this.fld_pollingplace___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace___draw__0 = new CLDataWrapper(this, this.fld_pollingplace___draw__0, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace___selfrendersize__ = new CLDataWrapper(this, this.fld_pollingplace___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_pollingplace___selfrendersize__0 = new CLDataWrapper(this, this.fld_pollingplace___selfrendersize__0, this.cl_int_buffer_1);
	this.proxyData.fld_region_child_childs_count = new CLDataWrapper(this, this.fld_region_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_region_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_region_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_region_childs_by_init = new CLDataWrapper(this, this.fld_region_childs_by_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_by_last = new CLDataWrapper(this, this.fld_region_childs_by_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_fixwidth_init = new CLDataWrapper(this, this.fld_region_childs_fixwidth_init, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs_fixwidth_last = new CLDataWrapper(this, this.fld_region_childs_fixwidth_last, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs_h_init = new CLDataWrapper(this, this.fld_region_childs_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_h_last = new CLDataWrapper(this, this.fld_region_childs_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_maxturnout_init = new CLDataWrapper(this, this.fld_region_childs_maxturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_maxturnout_last = new CLDataWrapper(this, this.fld_region_childs_maxturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_minturnout_init = new CLDataWrapper(this, this.fld_region_childs_minturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_minturnout_last = new CLDataWrapper(this, this.fld_region_childs_minturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_rx_init = new CLDataWrapper(this, this.fld_region_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_rx_last = new CLDataWrapper(this, this.fld_region_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showfraud_init = new CLDataWrapper(this, this.fld_region_childs_showfraud_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showfraud_last = new CLDataWrapper(this, this.fld_region_childs_showfraud_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showjavascript_init = new CLDataWrapper(this, this.fld_region_childs_showjavascript_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showjavascript_last = new CLDataWrapper(this, this.fld_region_childs_showjavascript_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showprojected_init = new CLDataWrapper(this, this.fld_region_childs_showprojected_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_showprojected_last = new CLDataWrapper(this, this.fld_region_childs_showprojected_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_region_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_region_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_region_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_region_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_region_childs_w_init = new CLDataWrapper(this, this.fld_region_childs_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_childs_w_last = new CLDataWrapper(this, this.fld_region_childs_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_region_totalmag_init = new CLDataWrapper(this, this.fld_region_totalmag_init, this.cl_float_buffer_1);
	this.proxyData.fld_region_totalmag_last = new CLDataWrapper(this, this.fld_region_totalmag_last, this.cl_float_buffer_1);
	this.proxyData.fld_region___childsrendersize__ = new CLDataWrapper(this, this.fld_region___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_region___childsrendersize___init = new CLDataWrapper(this, this.fld_region___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_region___childsrendersize___last = new CLDataWrapper(this, this.fld_region___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_region___draw__ = new CLDataWrapper(this, this.fld_region___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_region___selfrendersize__ = new CLDataWrapper(this, this.fld_region___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_region_votesur_init = new CLDataWrapper(this, this.fld_region_votesur_init, this.cl_int_buffer_1);
	this.proxyData.fld_region_votesur_last = new CLDataWrapper(this, this.fld_region_votesur_last, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_childs_count = new CLDataWrapper(this, this.fld_root_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_root_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_root_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_root___childsrendersize__ = new CLDataWrapper(this, this.fld_root___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_root___draw__ = new CLDataWrapper(this, this.fld_root___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_root___selfrendersize__ = new CLDataWrapper(this, this.fld_root___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_child_childs_count = new CLDataWrapper(this, this.fld_vsquare_child_childs_count, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_child_childs_leftmost_child = new CLDataWrapper(this, this.fld_vsquare_child_childs_leftmost_child, this.cl_nodeindex_buffer_1);
	this.proxyData.fld_vsquare_childs_by_init = new CLDataWrapper(this, this.fld_vsquare_childs_by_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_by_last = new CLDataWrapper(this, this.fld_vsquare_childs_by_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_fixwidth_init = new CLDataWrapper(this, this.fld_vsquare_childs_fixwidth_init, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs_fixwidth_last = new CLDataWrapper(this, this.fld_vsquare_childs_fixwidth_last, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs_h_init = new CLDataWrapper(this, this.fld_vsquare_childs_h_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_h_last = new CLDataWrapper(this, this.fld_vsquare_childs_h_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_maxturnout_init = new CLDataWrapper(this, this.fld_vsquare_childs_maxturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_maxturnout_last = new CLDataWrapper(this, this.fld_vsquare_childs_maxturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_minturnout_init = new CLDataWrapper(this, this.fld_vsquare_childs_minturnout_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_minturnout_last = new CLDataWrapper(this, this.fld_vsquare_childs_minturnout_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_rx_init = new CLDataWrapper(this, this.fld_vsquare_childs_rx_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_rx_last = new CLDataWrapper(this, this.fld_vsquare_childs_rx_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showfraud_init = new CLDataWrapper(this, this.fld_vsquare_childs_showfraud_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showfraud_last = new CLDataWrapper(this, this.fld_vsquare_childs_showfraud_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showjavascript_init = new CLDataWrapper(this, this.fld_vsquare_childs_showjavascript_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showjavascript_last = new CLDataWrapper(this, this.fld_vsquare_childs_showjavascript_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showprojected_init = new CLDataWrapper(this, this.fld_vsquare_childs_showprojected_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_showprojected_last = new CLDataWrapper(this, this.fld_vsquare_childs_showprojected_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs___dorenderinglast___init = new CLDataWrapper(this, this.fld_vsquare_childs___dorenderinglast___init, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs___dorenderinglast___last = new CLDataWrapper(this, this.fld_vsquare_childs___dorenderinglast___last, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs___renderrightoffset___init = new CLDataWrapper(this, this.fld_vsquare_childs___renderrightoffset___init, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs___renderrightoffset___last = new CLDataWrapper(this, this.fld_vsquare_childs___renderrightoffset___last, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_childs_w_init = new CLDataWrapper(this, this.fld_vsquare_childs_w_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_childs_w_last = new CLDataWrapper(this, this.fld_vsquare_childs_w_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_totalmag_init = new CLDataWrapper(this, this.fld_vsquare_totalmag_init, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare_totalmag_last = new CLDataWrapper(this, this.fld_vsquare_totalmag_last, this.cl_float_buffer_1);
	this.proxyData.fld_vsquare___childsrendersize__ = new CLDataWrapper(this, this.fld_vsquare___childsrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare___childsrendersize___init = new CLDataWrapper(this, this.fld_vsquare___childsrendersize___init, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare___childsrendersize___last = new CLDataWrapper(this, this.fld_vsquare___childsrendersize___last, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare___draw__ = new CLDataWrapper(this, this.fld_vsquare___draw__, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare___selfrendersize__ = new CLDataWrapper(this, this.fld_vsquare___selfrendersize__, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_votesur_init = new CLDataWrapper(this, this.fld_vsquare_votesur_init, this.cl_int_buffer_1);
	this.proxyData.fld_vsquare_votesur_last = new CLDataWrapper(this, this.fld_vsquare_votesur_last, this.cl_int_buffer_1);
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
		case "CHILDS":
			return 5;
			break;
		case "UNDEFINED":
			return 14;
			break;
		case "ROOT":
			return 12;
			break;
		case "COUNTRYCONTAINER":
			return 6;
			break;
		case "REGION":
			return 11;
			break;
		case "DISTRICT":
			return 7;
			break;
		case "VSQUARE":
			return 15;
			break;
		case "HSQUARE":
			return 8;
			break;
		case "POLLINGPLACE":
			return 10;
			break;
		case "IGNORE":
			return 9;
			break;
		case "TEXTBOX":
			return 13;
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
		case "COUNTRYCONTAINER":
			return "node";
			break;
		case "REGION":
			return "node";
			break;
		case "DISTRICT":
			return "node";
			break;
		case "VSQUARE":
			return "node";
			break;
		case "HSQUARE":
			return "node";
			break;
		case "POLLINGPLACE":
			return "node";
			break;
	}
};
	this.inputs = [
		"defColor"		, "urColor"		, "urVotesProjected"		, "width"		, "maxTurnout"		, "fixWidth"		, "showJavascript"		, "refname"		, "display"		, "turnout"		, "totalVotesUR"		, "minTurnout"		, "inJavascript"		, "height"		, "showProjected"		, "totalVotes"		, "glBufferMacro"		, "fraudColor"		, "urVotes"		, "showFraud"	];
this.offsets = "enum unionvariants {TOK_VSQUARE = 15, TOK_ROOT = 12, TOK_IGNORE = 9, TOK_CHILDS = 5, TOK_COUNTRYCONTAINER = 6, TOK_UNDEFINED = 14, TOK_REGION = 11, TOK_HSQUARE = 8, TOK_TEXTBOX = 13, TOK_POLLINGPLACE = 10, TOK_DISTRICT = 7};\n\n// Generated code. Modifcation to this file will be lost on next code generation.\n\n/**\n * @file   cl_runner_generated_buffer_info.h\n * @author Superconductor v0.1\n * @date   24/05/2013 12:50:32\n * @brief  Contains macros needed to access fields within monolithic OpenCL\n * buffers.\n * \n * @warning Generated code. Modifcation to this file will be lost on next\n * code generation.\n *\n * This file defines several sets of macros intended for use with the \n * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic\n * buffers are a way of packing multiple different fields (represented by\n * structure-split arrays) into a single OpenCL buffer so as to minimize the\n * number of arguments needed to be passed to OpenCL.\n *\n * The macros contained here are of three classes:\n * @li @c buffer_name_size The number of fields packed into buffer buffer_name.\n * @li @c NUM_BUFFERS The total number of buffers define herein.\n * @li @c fld_class_property(node_idx) Macro to access the specified property of\n * for the node at node_idx.\n */\n\n#define INT_BUFFER_1_SIZE 103\n#define FLOAT_BUFFER_1_SIZE 125\n#define GRAMMARTOKENS_BUFFER_1_SIZE 2\n#define NODEINDEX_BUFFER_1_SIZE 10\n\n#define fld_district_childs_w_init(node_idx) float_buffer_1[tree_size * 73 + node_idx]\n#define FLD_DISTRICT_CHILDS_W_INIT_POSITION 73\n#define FLD_DISTRICT_CHILDS_W_INIT_BUFFER float_buffer_1\n#define fld_district_childs_rx_init(node_idx) float_buffer_1[tree_size * 69 + node_idx]\n#define FLD_DISTRICT_CHILDS_RX_INIT_POSITION 69\n#define FLD_DISTRICT_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_region_childs_fixwidth_init(node_idx) int_buffer_1[tree_size * 35 + node_idx]\n#define FLD_REGION_CHILDS_FIXWIDTH_INIT_POSITION 35\n#define FLD_REGION_CHILDS_FIXWIDTH_INIT_BUFFER int_buffer_1\n#define fld_vsquare_childs_fixwidth_init(node_idx) int_buffer_1[tree_size * 65 + node_idx]\n#define FLD_VSQUARE_CHILDS_FIXWIDTH_INIT_POSITION 65\n#define FLD_VSQUARE_CHILDS_FIXWIDTH_INIT_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_fixwidth_init(node_idx) int_buffer_1[tree_size * 21 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_FIXWIDTH_INIT_POSITION 21\n#define FLD_COUNTRYCONTAINER_CHILDS_FIXWIDTH_INIT_BUFFER int_buffer_1\n#define fld_node_by(node_idx) float_buffer_1[tree_size * 12 + node_idx]\n#define FLD_NODE_BY_POSITION 12\n#define FLD_NODE_BY_BUFFER float_buffer_1\n#define fld_district___draw__0(node_idx) int_buffer_1[tree_size * 47 + node_idx]\n#define FLD_DISTRICT_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 47\n#define FLD_DISTRICT_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_vsquare_childs_minturnout_last(node_idx) float_buffer_1[tree_size * 98 + node_idx]\n#define FLD_VSQUARE_CHILDS_MINTURNOUT_LAST_POSITION 98\n#define FLD_VSQUARE_CHILDS_MINTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_vsquare_childs_showfraud_init(node_idx) float_buffer_1[tree_size * 99 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWFRAUD_INIT_POSITION 99\n#define FLD_VSQUARE_CHILDS_SHOWFRAUD_INIT_BUFFER float_buffer_1\n#define fld_vsquare_childs_rx_init(node_idx) float_buffer_1[tree_size * 89 + node_idx]\n#define FLD_VSQUARE_CHILDS_RX_INIT_POSITION 89\n#define FLD_VSQUARE_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_district_childs_maxturnout_init(node_idx) float_buffer_1[tree_size * 71 + node_idx]\n#define FLD_DISTRICT_CHILDS_MAXTURNOUT_INIT_POSITION 71\n#define FLD_DISTRICT_CHILDS_MAXTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_district_childs_minturnout_last(node_idx) float_buffer_1[tree_size * 78 + node_idx]\n#define FLD_DISTRICT_CHILDS_MINTURNOUT_LAST_POSITION 78\n#define FLD_DISTRICT_CHILDS_MINTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_district___childsrendersize__(node_idx) int_buffer_1[tree_size * 45 + node_idx]\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 45\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_vsquare_totalmag_init(node_idx) float_buffer_1[tree_size * 85 + node_idx]\n#define FLD_VSQUARE_TOTALMAG_INIT_POSITION 85\n#define FLD_VSQUARE_TOTALMAG_INIT_BUFFER float_buffer_1\n#define fld_iroot_totalmag(node_idx) float_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_TOTALMAG_POSITION 0\n#define FLD_IROOT_TOTALMAG_BUFFER float_buffer_1\n#define fld_vsquare_childs_maxturnout_init(node_idx) float_buffer_1[tree_size * 93 + node_idx]\n#define FLD_VSQUARE_CHILDS_MAXTURNOUT_INIT_POSITION 93\n#define FLD_VSQUARE_CHILDS_MAXTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_region_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 2 + node_idx]\n#define FLD_REGION_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 2\n#define FLD_REGION_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_vsquare_childs_maxturnout_last(node_idx) float_buffer_1[tree_size * 94 + node_idx]\n#define FLD_VSQUARE_CHILDS_MAXTURNOUT_LAST_POSITION 94\n#define FLD_VSQUARE_CHILDS_MAXTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_fixwidth_init(node_idx) int_buffer_1[tree_size * 79 + node_idx]\n#define FLD_HSQUARE_CHILDS_FIXWIDTH_INIT_POSITION 79\n#define FLD_HSQUARE_CHILDS_FIXWIDTH_INIT_BUFFER int_buffer_1\n#define fld_countrycontainer_totalmag_last(node_idx) float_buffer_1[tree_size * 26 + node_idx]\n#define FLD_COUNTRYCONTAINER_TOTALMAG_LAST_POSITION 26\n#define FLD_COUNTRYCONTAINER_TOTALMAG_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_showjavascript_init(node_idx) float_buffer_1[tree_size * 101 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWJAVASCRIPT_INIT_POSITION 101\n#define FLD_HSQUARE_CHILDS_SHOWJAVASCRIPT_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_maxturnout_last(node_idx) float_buffer_1[tree_size * 32 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_MAXTURNOUT_LAST_POSITION 32\n#define FLD_COUNTRYCONTAINER_CHILDS_MAXTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_votesur_init(node_idx) int_buffer_1[tree_size * 27 + node_idx]\n#define FLD_COUNTRYCONTAINER_VOTESUR_INIT_POSITION 27\n#define FLD_COUNTRYCONTAINER_VOTESUR_INIT_BUFFER int_buffer_1\n#define fld_root_child_childs_count(node_idx) int_buffer_1[tree_size * 14 + node_idx]\n#define FLD_ROOT_CHILD_CHILDS_COUNT_POSITION 14\n#define FLD_ROOT_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_node_maxturnout(node_idx) float_buffer_1[tree_size * 10 + node_idx]\n#define FLD_NODE_MAXTURNOUT_POSITION 10\n#define FLD_NODE_MAXTURNOUT_BUFFER float_buffer_1\n#define fld_region_childs_rx_last(node_idx) float_buffer_1[tree_size * 50 + node_idx]\n#define FLD_REGION_CHILDS_RX_LAST_POSITION 50\n#define FLD_REGION_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer___childsrendersize___init(node_idx) int_buffer_1[tree_size * 25 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 25\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_region___childsrendersize___init(node_idx) int_buffer_1[tree_size * 39 + node_idx]\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 39\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_region_childs_maxturnout_last(node_idx) float_buffer_1[tree_size * 52 + node_idx]\n#define FLD_REGION_CHILDS_MAXTURNOUT_LAST_POSITION 52\n#define FLD_REGION_CHILDS_MAXTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_fixwidth_last(node_idx) int_buffer_1[tree_size * 80 + node_idx]\n#define FLD_HSQUARE_CHILDS_FIXWIDTH_LAST_POSITION 80\n#define FLD_HSQUARE_CHILDS_FIXWIDTH_LAST_BUFFER int_buffer_1\n#define fld_countrycontainer_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 29 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 29\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_node_rx(node_idx) float_buffer_1[tree_size * 17 + node_idx]\n#define FLD_NODE_RX_POSITION 17\n#define FLD_NODE_RX_BUFFER float_buffer_1\n#define fld_hsquare_childs_w_last(node_idx) float_buffer_1[tree_size * 112 + node_idx]\n#define FLD_HSQUARE_CHILDS_W_LAST_POSITION 112\n#define FLD_HSQUARE_CHILDS_W_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 81 + node_idx]\n#define FLD_HSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 81\n#define FLD_HSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_region_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 44 + node_idx]\n#define FLD_REGION_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 44\n#define FLD_REGION_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_vsquare_childs_h_init(node_idx) float_buffer_1[tree_size * 83 + node_idx]\n#define FLD_VSQUARE_CHILDS_H_INIT_POSITION 83\n#define FLD_VSQUARE_CHILDS_H_INIT_BUFFER float_buffer_1\n#define fld_iroot___renderrightoffset__(node_idx) int_buffer_1[tree_size * 0 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 0\n#define FLD_IROOT_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_district_childs_by_init(node_idx) float_buffer_1[tree_size * 67 + node_idx]\n#define FLD_DISTRICT_CHILDS_BY_INIT_POSITION 67\n#define FLD_DISTRICT_CHILDS_BY_INIT_BUFFER float_buffer_1\n#define displayname(node_idx) grammartokens_buffer_1[tree_size * 0 + node_idx]\n#define DISPLAYNAME_POSITION 0\n#define DISPLAYNAME_BUFFER grammartokens_buffer_1\n#define fld_vsquare___childsrendersize___last(node_idx) int_buffer_1[tree_size * 70 + node_idx]\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 70\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_vsquare_childs_minturnout_init(node_idx) float_buffer_1[tree_size * 97 + node_idx]\n#define FLD_VSQUARE_CHILDS_MINTURNOUT_INIT_POSITION 97\n#define FLD_VSQUARE_CHILDS_MINTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_showfraud_last(node_idx) float_buffer_1[tree_size * 40 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWFRAUD_LAST_POSITION 40\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWFRAUD_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer___selfrendersize__(node_idx) int_buffer_1[tree_size * 19 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 19\n#define FLD_COUNTRYCONTAINER_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 82 + node_idx]\n#define FLD_HSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 82\n#define FLD_HSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_node_fixwidth(node_idx) int_buffer_1[tree_size * 6 + node_idx]\n#define FLD_NODE_FIXWIDTH_POSITION 6\n#define FLD_NODE_FIXWIDTH_BUFFER int_buffer_1\n#define fld_vsquare_childs_by_init(node_idx) float_buffer_1[tree_size * 87 + node_idx]\n#define FLD_VSQUARE_CHILDS_BY_INIT_POSITION 87\n#define FLD_VSQUARE_CHILDS_BY_INIT_BUFFER float_buffer_1\n#define fld_pollingplace___selfrendersize__(node_idx) int_buffer_1[tree_size * 100 + node_idx]\n#define FLD_POLLINGPLACE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 100\n#define FLD_POLLINGPLACE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_showfraud(node_idx) float_buffer_1[tree_size * 19 + node_idx]\n#define FLD_NODE_SHOWFRAUD_POSITION 19\n#define FLD_NODE_SHOWFRAUD_BUFFER float_buffer_1\n#define fld_district_votesur_init(node_idx) int_buffer_1[tree_size * 57 + node_idx]\n#define FLD_DISTRICT_VOTESUR_INIT_POSITION 57\n#define FLD_DISTRICT_VOTESUR_INIT_BUFFER int_buffer_1\n#define fld_vsquare_childs_h_last(node_idx) float_buffer_1[tree_size * 84 + node_idx]\n#define FLD_VSQUARE_CHILDS_H_LAST_POSITION 84\n#define FLD_VSQUARE_CHILDS_H_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_showprojected_init(node_idx) float_buffer_1[tree_size * 115 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWPROJECTED_INIT_POSITION 115\n#define FLD_HSQUARE_CHILDS_SHOWPROJECTED_INIT_BUFFER float_buffer_1\n#define fld_node_votesur(node_idx) int_buffer_1[tree_size * 9 + node_idx]\n#define FLD_NODE_VOTESUR_POSITION 9\n#define FLD_NODE_VOTESUR_BUFFER int_buffer_1\n#define fld_iroot___rendersize__(node_idx) int_buffer_1[tree_size * 2 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 2\n#define FLD_IROOT_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs_rx_init(node_idx) float_buffer_1[tree_size * 109 + node_idx]\n#define FLD_HSQUARE_CHILDS_RX_INIT_POSITION 109\n#define FLD_HSQUARE_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_iroot_showjavascript(node_idx) float_buffer_1[tree_size * 7 + node_idx]\n#define FLD_IROOT_SHOWJAVASCRIPT_POSITION 7\n#define FLD_IROOT_SHOWJAVASCRIPT_BUFFER float_buffer_1\n#define fld_region_childs_w_init(node_idx) float_buffer_1[tree_size * 53 + node_idx]\n#define FLD_REGION_CHILDS_W_INIT_POSITION 53\n#define FLD_REGION_CHILDS_W_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer___childsrendersize__(node_idx) int_buffer_1[tree_size * 15 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 15\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_countrycontainer_votesur_last(node_idx) int_buffer_1[tree_size * 28 + node_idx]\n#define FLD_COUNTRYCONTAINER_VOTESUR_LAST_POSITION 28\n#define FLD_COUNTRYCONTAINER_VOTESUR_LAST_BUFFER int_buffer_1\n#define fld_vsquare_childs_w_init(node_idx) float_buffer_1[tree_size * 91 + node_idx]\n#define FLD_VSQUARE_CHILDS_W_INIT_POSITION 91\n#define FLD_VSQUARE_CHILDS_W_INIT_BUFFER float_buffer_1\n#define fld_hsquare_childs_h_last(node_idx) float_buffer_1[tree_size * 104 + node_idx]\n#define FLD_HSQUARE_CHILDS_H_LAST_POSITION 104\n#define FLD_HSQUARE_CHILDS_H_LAST_BUFFER float_buffer_1\n#define fld_vsquare_votesur_init(node_idx) int_buffer_1[tree_size * 71 + node_idx]\n#define FLD_VSQUARE_VOTESUR_INIT_POSITION 71\n#define FLD_VSQUARE_VOTESUR_INIT_BUFFER int_buffer_1\n#define fld_iroot_showprojected(node_idx) float_buffer_1[tree_size * 4 + node_idx]\n#define FLD_IROOT_SHOWPROJECTED_POSITION 4\n#define FLD_IROOT_SHOWPROJECTED_BUFFER float_buffer_1\n#define fld_iroot_width(node_idx) float_buffer_1[tree_size * 6 + node_idx]\n#define FLD_IROOT_WIDTH_POSITION 6\n#define FLD_IROOT_WIDTH_BUFFER float_buffer_1\n#define fld_district_childs_showjavascript_last(node_idx) float_buffer_1[tree_size * 62 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWJAVASCRIPT_LAST_POSITION 62\n#define FLD_DISTRICT_CHILDS_SHOWJAVASCRIPT_LAST_BUFFER float_buffer_1\n#define fld_region_childs_fixwidth_last(node_idx) int_buffer_1[tree_size * 36 + node_idx]\n#define FLD_REGION_CHILDS_FIXWIDTH_LAST_POSITION 36\n#define FLD_REGION_CHILDS_FIXWIDTH_LAST_BUFFER int_buffer_1\n#define fld_node_showjavascript(node_idx) float_buffer_1[tree_size * 11 + node_idx]\n#define FLD_NODE_SHOWJAVASCRIPT_POSITION 11\n#define FLD_NODE_SHOWJAVASCRIPT_BUFFER float_buffer_1\n#define fld_region_votesur_init(node_idx) int_buffer_1[tree_size * 41 + node_idx]\n#define FLD_REGION_VOTESUR_INIT_POSITION 41\n#define FLD_REGION_VOTESUR_INIT_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_showprojected_last(node_idx) float_buffer_1[tree_size * 36 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWPROJECTED_LAST_POSITION 36\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWPROJECTED_LAST_BUFFER float_buffer_1\n#define fld_vsquare_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 73 + node_idx]\n#define FLD_VSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 73\n#define FLD_VSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_pollingplace_calcvotescolor(node_idx) int_buffer_1[tree_size * 101 + node_idx]\n#define FLD_POLLINGPLACE_CALCVOTESCOLOR_POSITION 101\n#define FLD_POLLINGPLACE_CALCVOTESCOLOR_BUFFER int_buffer_1\n#define fld_region_childs_showprojected_init(node_idx) float_buffer_1[tree_size * 55 + node_idx]\n#define FLD_REGION_CHILDS_SHOWPROJECTED_INIT_POSITION 55\n#define FLD_REGION_CHILDS_SHOWPROJECTED_INIT_BUFFER float_buffer_1\n#define fld_district___childsrendersize___init(node_idx) int_buffer_1[tree_size * 55 + node_idx]\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 55\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_region_totalmag_last(node_idx) float_buffer_1[tree_size * 46 + node_idx]\n#define FLD_REGION_TOTALMAG_LAST_POSITION 46\n#define FLD_REGION_TOTALMAG_LAST_BUFFER float_buffer_1\n#define fld_region_votesur_last(node_idx) int_buffer_1[tree_size * 42 + node_idx]\n#define FLD_REGION_VOTESUR_LAST_POSITION 42\n#define FLD_REGION_VOTESUR_LAST_BUFFER int_buffer_1\n#define fld_district_childs_h_last(node_idx) float_buffer_1[tree_size * 64 + node_idx]\n#define FLD_DISTRICT_CHILDS_H_LAST_POSITION 64\n#define FLD_DISTRICT_CHILDS_H_LAST_BUFFER float_buffer_1\n#define fld_hsquare_totalmag_last(node_idx) float_buffer_1[tree_size * 106 + node_idx]\n#define FLD_HSQUARE_TOTALMAG_LAST_POSITION 106\n#define FLD_HSQUARE_TOTALMAG_LAST_BUFFER float_buffer_1\n#define fld_region_childs_by_last(node_idx) float_buffer_1[tree_size * 48 + node_idx]\n#define FLD_REGION_CHILDS_BY_LAST_POSITION 48\n#define FLD_REGION_CHILDS_BY_LAST_BUFFER float_buffer_1\n#define fld_node___renderoffset__(node_idx) int_buffer_1[tree_size * 8 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 8\n#define FLD_NODE_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 87 + node_idx]\n#define FLD_HSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 87\n#define FLD_HSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_node_minturnout(node_idx) float_buffer_1[tree_size * 14 + node_idx]\n#define FLD_NODE_MINTURNOUT_POSITION 14\n#define FLD_NODE_MINTURNOUT_BUFFER float_buffer_1\n#define fld_district_childs_showfraud_init(node_idx) float_buffer_1[tree_size * 79 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWFRAUD_INIT_POSITION 79\n#define FLD_DISTRICT_CHILDS_SHOWFRAUD_INIT_BUFFER float_buffer_1\n#define fld_district_childs_fixwidth_init(node_idx) int_buffer_1[tree_size * 51 + node_idx]\n#define FLD_DISTRICT_CHILDS_FIXWIDTH_INIT_POSITION 51\n#define FLD_DISTRICT_CHILDS_FIXWIDTH_INIT_BUFFER int_buffer_1\n#define fld_region_childs_by_init(node_idx) float_buffer_1[tree_size * 47 + node_idx]\n#define FLD_REGION_CHILDS_BY_INIT_POSITION 47\n#define FLD_REGION_CHILDS_BY_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_minturnout_init(node_idx) float_buffer_1[tree_size * 37 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_MINTURNOUT_INIT_POSITION 37\n#define FLD_COUNTRYCONTAINER_CHILDS_MINTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer___selfrendersize__0(node_idx) int_buffer_1[tree_size * 16 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 16\n#define FLD_COUNTRYCONTAINER_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_region___childsrendersize__(node_idx) int_buffer_1[tree_size * 31 + node_idx]\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 31\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define refname(node_idx) grammartokens_buffer_1[tree_size * 1 + node_idx]\n#define REFNAME_POSITION 1\n#define REFNAME_BUFFER grammartokens_buffer_1\n#define fld_region_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 37 + node_idx]\n#define FLD_REGION_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 37\n#define FLD_REGION_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_district___childsrendersize___last(node_idx) int_buffer_1[tree_size * 56 + node_idx]\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 56\n#define FLD_DISTRICT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define right_siblings(node_idx) nodeindex_buffer_1[tree_size * 6 + node_idx]\n#define RIGHT_SIBLINGS_POSITION 6\n#define RIGHT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_region___childsrendersize___last(node_idx) int_buffer_1[tree_size * 40 + node_idx]\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 40\n#define FLD_REGION_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_district_childs_w_last(node_idx) float_buffer_1[tree_size * 74 + node_idx]\n#define FLD_DISTRICT_CHILDS_W_LAST_POSITION 74\n#define FLD_DISTRICT_CHILDS_W_LAST_BUFFER float_buffer_1\n#define fld_hsquare___draw__(node_idx) int_buffer_1[tree_size * 76 + node_idx]\n#define FLD_HSQUARE_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 76\n#define FLD_HSQUARE_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_node_w(node_idx) float_buffer_1[tree_size * 15 + node_idx]\n#define FLD_NODE_W_POSITION 15\n#define FLD_NODE_W_BUFFER float_buffer_1\n#define fld_region_childs_minturnout_last(node_idx) float_buffer_1[tree_size * 58 + node_idx]\n#define FLD_REGION_CHILDS_MINTURNOUT_LAST_POSITION 58\n#define FLD_REGION_CHILDS_MINTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_calcfraudcolor(node_idx) int_buffer_1[tree_size * 95 + node_idx]\n#define FLD_POLLINGPLACE_CALCFRAUDCOLOR_POSITION 95\n#define FLD_POLLINGPLACE_CALCFRAUDCOLOR_BUFFER int_buffer_1\n#define fld_region_childs_maxturnout_init(node_idx) float_buffer_1[tree_size * 51 + node_idx]\n#define FLD_REGION_CHILDS_MAXTURNOUT_INIT_POSITION 51\n#define FLD_REGION_CHILDS_MAXTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_vsquare_childs_by_last(node_idx) float_buffer_1[tree_size * 88 + node_idx]\n#define FLD_VSQUARE_CHILDS_BY_LAST_POSITION 88\n#define FLD_VSQUARE_CHILDS_BY_LAST_BUFFER float_buffer_1\n#define fld_region___draw__(node_idx) int_buffer_1[tree_size * 32 + node_idx]\n#define FLD_REGION_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 32\n#define FLD_REGION_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_region_childs_w_last(node_idx) float_buffer_1[tree_size * 54 + node_idx]\n#define FLD_REGION_CHILDS_W_LAST_POSITION 54\n#define FLD_REGION_CHILDS_W_LAST_BUFFER float_buffer_1\n#define fld_vsquare___draw__(node_idx) int_buffer_1[tree_size * 62 + node_idx]\n#define FLD_VSQUARE_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 62\n#define FLD_VSQUARE_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_countrycontainer_totalmag_init(node_idx) float_buffer_1[tree_size * 25 + node_idx]\n#define FLD_COUNTRYCONTAINER_TOTALMAG_INIT_POSITION 25\n#define FLD_COUNTRYCONTAINER_TOTALMAG_INIT_BUFFER float_buffer_1\n#define fld_vsquare_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 4 + node_idx]\n#define FLD_VSQUARE_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 4\n#define FLD_VSQUARE_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_countrycontainer_childs_by_last(node_idx) float_buffer_1[tree_size * 28 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_BY_LAST_POSITION 28\n#define FLD_COUNTRYCONTAINER_CHILDS_BY_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_urcolor(node_idx) int_buffer_1[tree_size * 91 + node_idx]\n#define FLD_POLLINGPLACE_URCOLOR_POSITION 91\n#define FLD_POLLINGPLACE_URCOLOR_BUFFER int_buffer_1\n#define fld_district_child_childs_count(node_idx) int_buffer_1[tree_size * 50 + node_idx]\n#define FLD_DISTRICT_CHILD_CHILDS_COUNT_POSITION 50\n#define FLD_DISTRICT_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_root_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 0 + node_idx]\n#define FLD_ROOT_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 0\n#define FLD_ROOT_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_region_childs_showfraud_init(node_idx) float_buffer_1[tree_size * 59 + node_idx]\n#define FLD_REGION_CHILDS_SHOWFRAUD_INIT_POSITION 59\n#define FLD_REGION_CHILDS_SHOWFRAUD_INIT_BUFFER float_buffer_1\n#define id(node_idx) nodeindex_buffer_1[tree_size * 9 + node_idx]\n#define ID_POSITION 9\n#define ID_BUFFER nodeindex_buffer_1\n#define fld_district_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 53 + node_idx]\n#define FLD_DISTRICT_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 53\n#define FLD_DISTRICT_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_region___selfrendersize__(node_idx) int_buffer_1[tree_size * 33 + node_idx]\n#define FLD_REGION_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 33\n#define FLD_REGION_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_district___draw__(node_idx) int_buffer_1[tree_size * 48 + node_idx]\n#define FLD_DISTRICT_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 48\n#define FLD_DISTRICT_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_root___selfrendersize__(node_idx) int_buffer_1[tree_size * 13 + node_idx]\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 13\n#define FLD_ROOT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_pollingplace___selfrendersize__0(node_idx) int_buffer_1[tree_size * 96 + node_idx]\n#define FLD_POLLINGPLACE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 96\n#define FLD_POLLINGPLACE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_hsquare_childs_h_init(node_idx) float_buffer_1[tree_size * 103 + node_idx]\n#define FLD_HSQUARE_CHILDS_H_INIT_POSITION 103\n#define FLD_HSQUARE_CHILDS_H_INIT_BUFFER float_buffer_1\n#define fld_iroot_minturnout(node_idx) float_buffer_1[tree_size * 2 + node_idx]\n#define FLD_IROOT_MINTURNOUT_POSITION 2\n#define FLD_IROOT_MINTURNOUT_BUFFER float_buffer_1\n#define fld_vsquare_childs_showprojected_last(node_idx) float_buffer_1[tree_size * 96 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWPROJECTED_LAST_POSITION 96\n#define FLD_VSQUARE_CHILDS_SHOWPROJECTED_LAST_BUFFER float_buffer_1\n#define fld_node_x(node_idx) float_buffer_1[tree_size * 20 + node_idx]\n#define FLD_NODE_X_POSITION 20\n#define FLD_NODE_X_BUFFER float_buffer_1\n#define fld_hsquare_childs_minturnout_last(node_idx) float_buffer_1[tree_size * 118 + node_idx]\n#define FLD_HSQUARE_CHILDS_MINTURNOUT_LAST_POSITION 118\n#define FLD_HSQUARE_CHILDS_MINTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_region_childs_showjavascript_init(node_idx) float_buffer_1[tree_size * 41 + node_idx]\n#define FLD_REGION_CHILDS_SHOWJAVASCRIPT_INIT_POSITION 41\n#define FLD_REGION_CHILDS_SHOWJAVASCRIPT_INIT_BUFFER float_buffer_1\n#define fld_hsquare_childs_maxturnout_init(node_idx) float_buffer_1[tree_size * 113 + node_idx]\n#define FLD_HSQUARE_CHILDS_MAXTURNOUT_INIT_POSITION 113\n#define FLD_HSQUARE_CHILDS_MAXTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_iroot_height(node_idx) float_buffer_1[tree_size * 3 + node_idx]\n#define FLD_IROOT_HEIGHT_POSITION 3\n#define FLD_IROOT_HEIGHT_BUFFER float_buffer_1\n#define fld_iroot_fixwidth(node_idx) int_buffer_1[tree_size * 4 + node_idx]\n#define FLD_IROOT_FIXWIDTH_POSITION 4\n#define FLD_IROOT_FIXWIDTH_BUFFER int_buffer_1\n#define fld_vsquare___childsrendersize__(node_idx) int_buffer_1[tree_size * 61 + node_idx]\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 61\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_vsquare_childs_w_last(node_idx) float_buffer_1[tree_size * 92 + node_idx]\n#define FLD_VSQUARE_CHILDS_W_LAST_POSITION 92\n#define FLD_VSQUARE_CHILDS_W_LAST_BUFFER float_buffer_1\n#define fld_root___childsrendersize__(node_idx) int_buffer_1[tree_size * 11 + node_idx]\n#define FLD_ROOT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 11\n#define FLD_ROOT_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs_showjavascript_last(node_idx) float_buffer_1[tree_size * 102 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWJAVASCRIPT_LAST_POSITION 102\n#define FLD_HSQUARE_CHILDS_SHOWJAVASCRIPT_LAST_BUFFER float_buffer_1\n#define fld_region_childs_minturnout_init(node_idx) float_buffer_1[tree_size * 57 + node_idx]\n#define FLD_REGION_CHILDS_MINTURNOUT_INIT_POSITION 57\n#define FLD_REGION_CHILDS_MINTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_pollingplace_magnitude(node_idx) float_buffer_1[tree_size * 124 + node_idx]\n#define FLD_POLLINGPLACE_MAGNITUDE_POSITION 124\n#define FLD_POLLINGPLACE_MAGNITUDE_BUFFER float_buffer_1\n#define fld_hsquare_childs_w_init(node_idx) float_buffer_1[tree_size * 111 + node_idx]\n#define FLD_HSQUARE_CHILDS_W_INIT_POSITION 111\n#define FLD_HSQUARE_CHILDS_W_INIT_BUFFER float_buffer_1\n#define fld_hsquare_childs_by_last(node_idx) float_buffer_1[tree_size * 108 + node_idx]\n#define FLD_HSQUARE_CHILDS_BY_LAST_POSITION 108\n#define FLD_HSQUARE_CHILDS_BY_LAST_BUFFER float_buffer_1\n#define fld_district_childs_minturnout_init(node_idx) float_buffer_1[tree_size * 77 + node_idx]\n#define FLD_DISTRICT_CHILDS_MINTURNOUT_INIT_POSITION 77\n#define FLD_DISTRICT_CHILDS_MINTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_region_child_childs_count(node_idx) int_buffer_1[tree_size * 34 + node_idx]\n#define FLD_REGION_CHILD_CHILDS_COUNT_POSITION 34\n#define FLD_REGION_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_district_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 59 + node_idx]\n#define FLD_DISTRICT_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 59\n#define FLD_DISTRICT_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_vsquare_childs_fixwidth_last(node_idx) int_buffer_1[tree_size * 66 + node_idx]\n#define FLD_VSQUARE_CHILDS_FIXWIDTH_LAST_POSITION 66\n#define FLD_VSQUARE_CHILDS_FIXWIDTH_LAST_BUFFER int_buffer_1\n#define fld_iroot_votesur(node_idx) float_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_VOTESUR_POSITION 1\n#define FLD_IROOT_VOTESUR_BUFFER float_buffer_1\n#define fld_pollingplace_totalvotes(node_idx) int_buffer_1[tree_size * 92 + node_idx]\n#define FLD_POLLINGPLACE_TOTALVOTES_POSITION 92\n#define FLD_POLLINGPLACE_TOTALVOTES_BUFFER int_buffer_1\n#define fld_countrycontainer___childsrendersize___last(node_idx) int_buffer_1[tree_size * 26 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 26\n#define FLD_COUNTRYCONTAINER_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_vsquare___selfrendersize__(node_idx) int_buffer_1[tree_size * 63 + node_idx]\n#define FLD_VSQUARE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 63\n#define FLD_VSQUARE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_totalmag_init(node_idx) float_buffer_1[tree_size * 105 + node_idx]\n#define FLD_HSQUARE_TOTALMAG_INIT_POSITION 105\n#define FLD_HSQUARE_TOTALMAG_INIT_BUFFER float_buffer_1\n#define fld_iroot___dorenderinglast__(node_idx) int_buffer_1[tree_size * 3 + node_idx]\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 3\n#define FLD_IROOT_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_region_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 38 + node_idx]\n#define FLD_REGION_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 38\n#define FLD_REGION_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_hsquare_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 88 + node_idx]\n#define FLD_HSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 88\n#define FLD_HSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_fixwidth_last(node_idx) int_buffer_1[tree_size * 22 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_FIXWIDTH_LAST_POSITION 22\n#define FLD_COUNTRYCONTAINER_CHILDS_FIXWIDTH_LAST_BUFFER int_buffer_1\n#define fld_node___renderrightoffset__(node_idx) int_buffer_1[tree_size * 5 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_POSITION 5\n#define FLD_NODE_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_iroot_showfraud(node_idx) float_buffer_1[tree_size * 8 + node_idx]\n#define FLD_IROOT_SHOWFRAUD_POSITION 8\n#define FLD_IROOT_SHOWFRAUD_BUFFER float_buffer_1\n#define fld_root___draw__(node_idx) int_buffer_1[tree_size * 12 + node_idx]\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 12\n#define FLD_ROOT_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_minturnout_last(node_idx) float_buffer_1[tree_size * 38 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_MINTURNOUT_LAST_POSITION 38\n#define FLD_COUNTRYCONTAINER_CHILDS_MINTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_node_y(node_idx) float_buffer_1[tree_size * 18 + node_idx]\n#define FLD_NODE_Y_POSITION 18\n#define FLD_NODE_Y_BUFFER float_buffer_1\n#define parent(node_idx) nodeindex_buffer_1[tree_size * 8 + node_idx]\n#define PARENT_POSITION 8\n#define PARENT_BUFFER nodeindex_buffer_1\n#define fld_district_childs_h_init(node_idx) float_buffer_1[tree_size * 63 + node_idx]\n#define FLD_DISTRICT_CHILDS_H_INIT_POSITION 63\n#define FLD_DISTRICT_CHILDS_H_INIT_BUFFER float_buffer_1\n#define fld_district_totalmag_last(node_idx) float_buffer_1[tree_size * 66 + node_idx]\n#define FLD_DISTRICT_TOTALMAG_LAST_POSITION 66\n#define FLD_DISTRICT_TOTALMAG_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_defcolor(node_idx) int_buffer_1[tree_size * 89 + node_idx]\n#define FLD_POLLINGPLACE_DEFCOLOR_POSITION 89\n#define FLD_POLLINGPLACE_DEFCOLOR_BUFFER int_buffer_1\n#define fld_pollingplace_fraudcolor(node_idx) int_buffer_1[tree_size * 93 + node_idx]\n#define FLD_POLLINGPLACE_FRAUDCOLOR_POSITION 93\n#define FLD_POLLINGPLACE_FRAUDCOLOR_BUFFER int_buffer_1\n#define fld_hsquare_childs_rx_last(node_idx) float_buffer_1[tree_size * 110 + node_idx]\n#define FLD_HSQUARE_CHILDS_RX_LAST_POSITION 110\n#define FLD_HSQUARE_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_district_childs_by_last(node_idx) float_buffer_1[tree_size * 68 + node_idx]\n#define FLD_DISTRICT_CHILDS_BY_LAST_POSITION 68\n#define FLD_DISTRICT_CHILDS_BY_LAST_BUFFER float_buffer_1\n#define fld_vsquare_childs_showjavascript_last(node_idx) float_buffer_1[tree_size * 82 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWJAVASCRIPT_LAST_POSITION 82\n#define FLD_VSQUARE_CHILDS_SHOWJAVASCRIPT_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer___draw__(node_idx) int_buffer_1[tree_size * 18 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 18\n#define FLD_COUNTRYCONTAINER_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_pollingplace_turnout(node_idx) float_buffer_1[tree_size * 122 + node_idx]\n#define FLD_POLLINGPLACE_TURNOUT_POSITION 122\n#define FLD_POLLINGPLACE_TURNOUT_BUFFER float_buffer_1\n#define fld_district_childs_showprojected_last(node_idx) float_buffer_1[tree_size * 76 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWPROJECTED_LAST_POSITION 76\n#define FLD_DISTRICT_CHILDS_SHOWPROJECTED_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_maxturnout_init(node_idx) float_buffer_1[tree_size * 31 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_MAXTURNOUT_INIT_POSITION 31\n#define FLD_COUNTRYCONTAINER_CHILDS_MAXTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_district_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 60 + node_idx]\n#define FLD_DISTRICT_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 60\n#define FLD_DISTRICT_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_district___selfrendersize__(node_idx) int_buffer_1[tree_size * 49 + node_idx]\n#define FLD_DISTRICT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 49\n#define FLD_DISTRICT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_vsquare_totalmag_last(node_idx) float_buffer_1[tree_size * 86 + node_idx]\n#define FLD_VSQUARE_TOTALMAG_LAST_POSITION 86\n#define FLD_VSQUARE_TOTALMAG_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_showprojected_last(node_idx) float_buffer_1[tree_size * 116 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWPROJECTED_LAST_POSITION 116\n#define FLD_HSQUARE_CHILDS_SHOWPROJECTED_LAST_BUFFER float_buffer_1\n#define fld_node_totalmag(node_idx) float_buffer_1[tree_size * 9 + node_idx]\n#define FLD_NODE_TOTALMAG_POSITION 9\n#define FLD_NODE_TOTALMAG_BUFFER float_buffer_1\n#define fld_node_showprojected(node_idx) float_buffer_1[tree_size * 16 + node_idx]\n#define FLD_NODE_SHOWPROJECTED_POSITION 16\n#define FLD_NODE_SHOWPROJECTED_BUFFER float_buffer_1\n#define fld_hsquare___selfrendersize__(node_idx) int_buffer_1[tree_size * 77 + node_idx]\n#define FLD_HSQUARE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_POSITION 77\n#define FLD_HSQUARE_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define left_siblings(node_idx) nodeindex_buffer_1[tree_size * 7 + node_idx]\n#define LEFT_SIBLINGS_POSITION 7\n#define LEFT_SIBLINGS_BUFFER nodeindex_buffer_1\n#define fld_pollingplace___draw__0(node_idx) int_buffer_1[tree_size * 97 + node_idx]\n#define FLD_POLLINGPLACE_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 97\n#define FLD_POLLINGPLACE_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_vsquare___childsrendersize___init(node_idx) int_buffer_1[tree_size * 69 + node_idx]\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 69\n#define FLD_VSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_by_init(node_idx) float_buffer_1[tree_size * 27 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_BY_INIT_POSITION 27\n#define FLD_COUNTRYCONTAINER_CHILDS_BY_INIT_BUFFER float_buffer_1\n#define fld_region_childs_showfraud_last(node_idx) float_buffer_1[tree_size * 60 + node_idx]\n#define FLD_REGION_CHILDS_SHOWFRAUD_LAST_POSITION 60\n#define FLD_REGION_CHILDS_SHOWFRAUD_LAST_BUFFER float_buffer_1\n#define fld_district_childs_maxturnout_last(node_idx) float_buffer_1[tree_size * 72 + node_idx]\n#define FLD_DISTRICT_CHILDS_MAXTURNOUT_LAST_POSITION 72\n#define FLD_DISTRICT_CHILDS_MAXTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_by_init(node_idx) float_buffer_1[tree_size * 107 + node_idx]\n#define FLD_HSQUARE_CHILDS_BY_INIT_POSITION 107\n#define FLD_HSQUARE_CHILDS_BY_INIT_BUFFER float_buffer_1\n#define fld_district___selfrendersize__0(node_idx) int_buffer_1[tree_size * 46 + node_idx]\n#define FLD_DISTRICT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_POSITION 46\n#define FLD_DISTRICT_USCOREUSCORESELFRENDERSIZEUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_countrycontainer_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 23 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 23\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_vsquare_childs___dorenderinglast___init(node_idx) int_buffer_1[tree_size * 67 + node_idx]\n#define FLD_VSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_POSITION 67\n#define FLD_VSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_district_childs_rx_last(node_idx) float_buffer_1[tree_size * 70 + node_idx]\n#define FLD_DISTRICT_CHILDS_RX_LAST_POSITION 70\n#define FLD_DISTRICT_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_node___rendersize__(node_idx) int_buffer_1[tree_size * 10 + node_idx]\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_POSITION 10\n#define FLD_NODE_USCOREUSCORERENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_iroot___renderoffset__(node_idx) int_buffer_1[tree_size * 1 + node_idx]\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_POSITION 1\n#define FLD_IROOT_USCOREUSCORERENDEROFFSETUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_region_childs_showjavascript_last(node_idx) float_buffer_1[tree_size * 42 + node_idx]\n#define FLD_REGION_CHILDS_SHOWJAVASCRIPT_LAST_POSITION 42\n#define FLD_REGION_CHILDS_SHOWJAVASCRIPT_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_rx_init(node_idx) float_buffer_1[tree_size * 29 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_RX_INIT_POSITION 29\n#define FLD_COUNTRYCONTAINER_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_region_childs_showprojected_last(node_idx) float_buffer_1[tree_size * 56 + node_idx]\n#define FLD_REGION_CHILDS_SHOWPROJECTED_LAST_POSITION 56\n#define FLD_REGION_CHILDS_SHOWPROJECTED_LAST_BUFFER float_buffer_1\n#define fld_hsquare_childs_maxturnout_last(node_idx) float_buffer_1[tree_size * 114 + node_idx]\n#define FLD_HSQUARE_CHILDS_MAXTURNOUT_LAST_POSITION 114\n#define FLD_HSQUARE_CHILDS_MAXTURNOUT_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_urvotes(node_idx) float_buffer_1[tree_size * 123 + node_idx]\n#define FLD_POLLINGPLACE_URVOTES_POSITION 123\n#define FLD_POLLINGPLACE_URVOTES_BUFFER float_buffer_1\n#define fld_countrycontainer___draw__0(node_idx) int_buffer_1[tree_size * 17 + node_idx]\n#define FLD_COUNTRYCONTAINER_USCOREUSCOREDRAWUSCOREUSCORE0_POSITION 17\n#define FLD_COUNTRYCONTAINER_USCOREUSCOREDRAWUSCOREUSCORE0_BUFFER int_buffer_1\n#define fld_node_h(node_idx) float_buffer_1[tree_size * 13 + node_idx]\n#define FLD_NODE_H_POSITION 13\n#define FLD_NODE_H_BUFFER float_buffer_1\n#define fld_district_totalmag_init(node_idx) float_buffer_1[tree_size * 65 + node_idx]\n#define FLD_DISTRICT_TOTALMAG_INIT_POSITION 65\n#define FLD_DISTRICT_TOTALMAG_INIT_BUFFER float_buffer_1\n#define fld_vsquare_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 74 + node_idx]\n#define FLD_VSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 74\n#define FLD_VSQUARE_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_district_childs_showfraud_last(node_idx) float_buffer_1[tree_size * 80 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWFRAUD_LAST_POSITION 80\n#define FLD_DISTRICT_CHILDS_SHOWFRAUD_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_calcregularcolor(node_idx) int_buffer_1[tree_size * 99 + node_idx]\n#define FLD_POLLINGPLACE_CALCREGULARCOLOR_POSITION 99\n#define FLD_POLLINGPLACE_CALCREGULARCOLOR_BUFFER int_buffer_1\n#define fld_countrycontainer_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 24 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 24\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_countrycontainer_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 1 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 1\n#define FLD_COUNTRYCONTAINER_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_district_childs_fixwidth_last(node_idx) int_buffer_1[tree_size * 52 + node_idx]\n#define FLD_DISTRICT_CHILDS_FIXWIDTH_LAST_POSITION 52\n#define FLD_DISTRICT_CHILDS_FIXWIDTH_LAST_BUFFER int_buffer_1\n#define fld_vsquare_childs_showjavascript_init(node_idx) float_buffer_1[tree_size * 81 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWJAVASCRIPT_INIT_POSITION 81\n#define FLD_VSQUARE_CHILDS_SHOWJAVASCRIPT_INIT_BUFFER float_buffer_1\n#define fld_pollingplace___draw__(node_idx) int_buffer_1[tree_size * 98 + node_idx]\n#define FLD_POLLINGPLACE_USCOREUSCOREDRAWUSCOREUSCORE_POSITION 98\n#define FLD_POLLINGPLACE_USCOREUSCOREDRAWUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs_minturnout_init(node_idx) float_buffer_1[tree_size * 117 + node_idx]\n#define FLD_HSQUARE_CHILDS_MINTURNOUT_INIT_POSITION 117\n#define FLD_HSQUARE_CHILDS_MINTURNOUT_INIT_BUFFER float_buffer_1\n#define fld_district_childs_showjavascript_init(node_idx) float_buffer_1[tree_size * 61 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWJAVASCRIPT_INIT_POSITION 61\n#define FLD_DISTRICT_CHILDS_SHOWJAVASCRIPT_INIT_BUFFER float_buffer_1\n#define fld_hsquare_votesur_init(node_idx) int_buffer_1[tree_size * 85 + node_idx]\n#define FLD_HSQUARE_VOTESUR_INIT_POSITION 85\n#define FLD_HSQUARE_VOTESUR_INIT_BUFFER int_buffer_1\n#define fld_node___dorenderinglast__(node_idx) int_buffer_1[tree_size * 7 + node_idx]\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_POSITION 7\n#define FLD_NODE_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_district_votesur_last(node_idx) int_buffer_1[tree_size * 58 + node_idx]\n#define FLD_DISTRICT_VOTESUR_LAST_POSITION 58\n#define FLD_DISTRICT_VOTESUR_LAST_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_showfraud_init(node_idx) float_buffer_1[tree_size * 39 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWFRAUD_INIT_POSITION 39\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWFRAUD_INIT_BUFFER float_buffer_1\n#define fld_pollingplace_urvotesprojected(node_idx) float_buffer_1[tree_size * 121 + node_idx]\n#define FLD_POLLINGPLACE_URVOTESPROJECTED_POSITION 121\n#define FLD_POLLINGPLACE_URVOTESPROJECTED_BUFFER float_buffer_1\n#define fld_pollingplace_totalvotesur(node_idx) int_buffer_1[tree_size * 94 + node_idx]\n#define FLD_POLLINGPLACE_TOTALVOTESUR_POSITION 94\n#define FLD_POLLINGPLACE_TOTALVOTESUR_BUFFER int_buffer_1\n#define fld_region_childs___renderrightoffset___init(node_idx) int_buffer_1[tree_size * 43 + node_idx]\n#define FLD_REGION_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_POSITION 43\n#define FLD_REGION_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_hsquare_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 5 + node_idx]\n#define FLD_HSQUARE_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 5\n#define FLD_HSQUARE_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_vsquare_votesur_last(node_idx) int_buffer_1[tree_size * 72 + node_idx]\n#define FLD_VSQUARE_VOTESUR_LAST_POSITION 72\n#define FLD_VSQUARE_VOTESUR_LAST_BUFFER int_buffer_1\n#define fld_hsquare___childsrendersize___init(node_idx) int_buffer_1[tree_size * 83 + node_idx]\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_POSITION 83\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_INIT_BUFFER int_buffer_1\n#define fld_countrycontainer_childs___renderrightoffset___last(node_idx) int_buffer_1[tree_size * 30 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_POSITION 30\n#define FLD_COUNTRYCONTAINER_CHILDS_USCOREUSCORERENDERRIGHTOFFSETUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_iroot_maxturnout(node_idx) float_buffer_1[tree_size * 5 + node_idx]\n#define FLD_IROOT_MAXTURNOUT_POSITION 5\n#define FLD_IROOT_MAXTURNOUT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_w_init(node_idx) float_buffer_1[tree_size * 33 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_W_INIT_POSITION 33\n#define FLD_COUNTRYCONTAINER_CHILDS_W_INIT_BUFFER float_buffer_1\n#define fld_hsquare_childs_showfraud_last(node_idx) float_buffer_1[tree_size * 120 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWFRAUD_LAST_POSITION 120\n#define FLD_HSQUARE_CHILDS_SHOWFRAUD_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_h_init(node_idx) float_buffer_1[tree_size * 23 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_H_INIT_POSITION 23\n#define FLD_COUNTRYCONTAINER_CHILDS_H_INIT_BUFFER float_buffer_1\n#define fld_pollingplace_calcprojectedcolor(node_idx) int_buffer_1[tree_size * 102 + node_idx]\n#define FLD_POLLINGPLACE_CALCPROJECTEDCOLOR_POSITION 102\n#define FLD_POLLINGPLACE_CALCPROJECTEDCOLOR_BUFFER int_buffer_1\n#define fld_vsquare_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 68 + node_idx]\n#define FLD_VSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 68\n#define FLD_VSQUARE_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_countrycontainer_childs_rx_last(node_idx) float_buffer_1[tree_size * 30 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_RX_LAST_POSITION 30\n#define FLD_COUNTRYCONTAINER_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_showprojected_init(node_idx) float_buffer_1[tree_size * 35 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWPROJECTED_INIT_POSITION 35\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWPROJECTED_INIT_BUFFER float_buffer_1\n#define fld_vsquare_childs_showprojected_init(node_idx) float_buffer_1[tree_size * 95 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWPROJECTED_INIT_POSITION 95\n#define FLD_VSQUARE_CHILDS_SHOWPROJECTED_INIT_BUFFER float_buffer_1\n#define fld_district_childs___dorenderinglast___last(node_idx) int_buffer_1[tree_size * 54 + node_idx]\n#define FLD_DISTRICT_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_POSITION 54\n#define FLD_DISTRICT_CHILDS_USCOREUSCOREDORENDERINGLASTUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_region_totalmag_init(node_idx) float_buffer_1[tree_size * 45 + node_idx]\n#define FLD_REGION_TOTALMAG_INIT_POSITION 45\n#define FLD_REGION_TOTALMAG_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_child_childs_count(node_idx) int_buffer_1[tree_size * 20 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILD_CHILDS_COUNT_POSITION 20\n#define FLD_COUNTRYCONTAINER_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_vsquare_child_childs_count(node_idx) int_buffer_1[tree_size * 64 + node_idx]\n#define FLD_VSQUARE_CHILD_CHILDS_COUNT_POSITION 64\n#define FLD_VSQUARE_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n#define fld_region_childs_h_last(node_idx) float_buffer_1[tree_size * 44 + node_idx]\n#define FLD_REGION_CHILDS_H_LAST_POSITION 44\n#define FLD_REGION_CHILDS_H_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_showjavascript_init(node_idx) float_buffer_1[tree_size * 21 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWJAVASCRIPT_INIT_POSITION 21\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWJAVASCRIPT_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_showjavascript_last(node_idx) float_buffer_1[tree_size * 22 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWJAVASCRIPT_LAST_POSITION 22\n#define FLD_COUNTRYCONTAINER_CHILDS_SHOWJAVASCRIPT_LAST_BUFFER float_buffer_1\n#define fld_district_child_childs_leftmost_child(node_idx) nodeindex_buffer_1[tree_size * 3 + node_idx]\n#define FLD_DISTRICT_CHILD_CHILDS_LEFTMOST_CHILD_POSITION 3\n#define FLD_DISTRICT_CHILD_CHILDS_LEFTMOST_CHILD_BUFFER nodeindex_buffer_1\n#define fld_district_childs_showprojected_init(node_idx) float_buffer_1[tree_size * 75 + node_idx]\n#define FLD_DISTRICT_CHILDS_SHOWPROJECTED_INIT_POSITION 75\n#define FLD_DISTRICT_CHILDS_SHOWPROJECTED_INIT_BUFFER float_buffer_1\n#define fld_region_childs_rx_init(node_idx) float_buffer_1[tree_size * 49 + node_idx]\n#define FLD_REGION_CHILDS_RX_INIT_POSITION 49\n#define FLD_REGION_CHILDS_RX_INIT_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_h_last(node_idx) float_buffer_1[tree_size * 24 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_H_LAST_POSITION 24\n#define FLD_COUNTRYCONTAINER_CHILDS_H_LAST_BUFFER float_buffer_1\n#define fld_countrycontainer_childs_w_last(node_idx) float_buffer_1[tree_size * 34 + node_idx]\n#define FLD_COUNTRYCONTAINER_CHILDS_W_LAST_POSITION 34\n#define FLD_COUNTRYCONTAINER_CHILDS_W_LAST_BUFFER float_buffer_1\n#define fld_pollingplace_injavascript(node_idx) int_buffer_1[tree_size * 90 + node_idx]\n#define FLD_POLLINGPLACE_INJAVASCRIPT_POSITION 90\n#define FLD_POLLINGPLACE_INJAVASCRIPT_BUFFER int_buffer_1\n#define fld_vsquare_childs_showfraud_last(node_idx) float_buffer_1[tree_size * 100 + node_idx]\n#define FLD_VSQUARE_CHILDS_SHOWFRAUD_LAST_POSITION 100\n#define FLD_VSQUARE_CHILDS_SHOWFRAUD_LAST_BUFFER float_buffer_1\n#define fld_hsquare___childsrendersize___last(node_idx) int_buffer_1[tree_size * 84 + node_idx]\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_POSITION 84\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_LAST_BUFFER int_buffer_1\n#define fld_region_childs_h_init(node_idx) float_buffer_1[tree_size * 43 + node_idx]\n#define FLD_REGION_CHILDS_H_INIT_POSITION 43\n#define FLD_REGION_CHILDS_H_INIT_BUFFER float_buffer_1\n#define fld_vsquare_childs_rx_last(node_idx) float_buffer_1[tree_size * 90 + node_idx]\n#define FLD_VSQUARE_CHILDS_RX_LAST_POSITION 90\n#define FLD_VSQUARE_CHILDS_RX_LAST_BUFFER float_buffer_1\n#define fld_hsquare___childsrendersize__(node_idx) int_buffer_1[tree_size * 75 + node_idx]\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_POSITION 75\n#define FLD_HSQUARE_USCOREUSCORECHILDSRENDERSIZEUSCOREUSCORE_BUFFER int_buffer_1\n#define fld_hsquare_childs_showfraud_init(node_idx) float_buffer_1[tree_size * 119 + node_idx]\n#define FLD_HSQUARE_CHILDS_SHOWFRAUD_INIT_POSITION 119\n#define FLD_HSQUARE_CHILDS_SHOWFRAUD_INIT_BUFFER float_buffer_1\n#define fld_hsquare_votesur_last(node_idx) int_buffer_1[tree_size * 86 + node_idx]\n#define FLD_HSQUARE_VOTESUR_LAST_POSITION 86\n#define FLD_HSQUARE_VOTESUR_LAST_BUFFER int_buffer_1\n#define fld_hsquare_child_childs_count(node_idx) int_buffer_1[tree_size * 78 + node_idx]\n#define FLD_HSQUARE_CHILD_CHILDS_COUNT_POSITION 78\n#define FLD_HSQUARE_CHILD_CHILDS_COUNT_BUFFER int_buffer_1\n";
this.TOK_VSQUARE = 15; this.TOK_ROOT = 12; this.TOK_IGNORE = 9; this.TOK_CHILDS = 5; this.TOK_COUNTRYCONTAINER = 6; this.TOK_UNDEFINED = 14; this.TOK_REGION = 11; this.TOK_HSQUARE = 8; this.TOK_TEXTBOX = 13; this.TOK_POLLINGPLACE = 10; this.TOK_DISTRICT = 7;
// Generated code. Modifcation to this file will be lost on next code generation.
/**
 * @file   cl_runner_generated_buffer_info.h
 * @author Superconductor v0.1
 * @date   24/05/2013 12:50:32
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
district___draw__0 = function  (_ale_arg6, _ale_arg3, _ale_arg0, _ale_arg2,  _ale_arg1, _ale_arg7, _ale_arg5, _ale_arg4) { return ((_ale_arg0 != 0) ? RectangleOutline_draw(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, _ale_arg7, rgb(0, 0, 0)) : 0); }
district_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
district_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
district_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
district_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
district___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
district___draw__ = function  (_ale_arg0) { return _ale_arg0; }
district_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
district_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
district_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
district___selfRenderSize__0 = function  (_ale_arg3, _ale_arg0, _ale_arg4, _ale_arg2, _ale_arg1) { return ((_ale_arg0 != 0) ? RectangleOutline_size(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, rgb(0, 0, 0)) : 0); }
district_childs_by = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
district_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
district_childs_w = function  (_ale_arg2, _ale_arg1, _ale_arg0) { return ((_ale_arg0 / _ale_arg1) * _ale_arg2); }
district___selfRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
district_childs_h = function  (_ale_arg0) { return _ale_arg0; }
district_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
district___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
root_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
root_totalMag = function  (_ale_arg0) { return _ale_arg0; }
root_votesUR = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 / _ale_arg1); }
root_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
root_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
root_childs_h = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 * (_ale_arg1 / 63895164)); }
root___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
root_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
root_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
root___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
root_childs___renderRightOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
root___draw__ = function  () { return 0; }
root_childs_by = function  (_ale_arg0) { return _ale_arg0; }
root___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
root_childs_rx = function  (_ale_arg0) { return _ale_arg0; }
root___selfRenderSize__ = function  () { return 0; }
root_childs_w = function  (_ale_arg2, _ale_arg1, _ale_arg0) { return ((_ale_arg0 != 0) ? _ale_arg1 : (_ale_arg1 * (_ale_arg2 / 63895164))); }
root___renderRightOffset__ = function  (_ale_arg0) { return _ale_arg0; }
root_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
root_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
root___childsRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
pollingplace_totalMag = function  (_ale_arg0, _ale_arg1, _ale_arg2) { return ((_ale_arg0 != 0) ? _ale_arg1 : (_ale_arg2 * _ale_arg1)); }
pollingplace_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
pollingplace___selfRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
pollingplace_votesUR = function  (_ale_arg1, _ale_arg4, _ale_arg6, _ale_arg5, _ale_arg2, _ale_arg0, _ale_arg3) { return ((((_ale_arg0 > _ale_arg1) && (_ale_arg0 <= _ale_arg2))) ? ((_ale_arg0 > 0.83) ? ((_ale_arg3 * (1 - _ale_arg4)) + ((_ale_arg5 * _ale_arg6) * _ale_arg4)) : _ale_arg3) : 0); }
pollingplace_calcVotesColor = function  (_ale_arg3, _ale_arg1, _ale_arg2, _ale_arg0) { return ((_ale_arg0 > 0.83) ? lerpColor(_ale_arg1, _ale_arg2, _ale_arg3) : _ale_arg1); }
pollingplace___draw__0 = function  (_ale_arg8, _ale_arg5, _ale_arg2, _ale_arg1,  _ale_arg0, _ale_arg7, _ale_arg6, _ale_arg4, _ale_arg9, _ale_arg3) { return Rectangle_draw(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, ((((255 * 256) * 256) * 256) + lerpColor(_ale_arg7, _ale_arg8, _ale_arg9))); }
pollingplace_magnitude = function  (_ale_arg1, _ale_arg3, _ale_arg2, _ale_arg0) { return ((((_ale_arg0 > _ale_arg1) && (_ale_arg0 <= _ale_arg2))) ? _ale_arg3 : 0); }
pollingplace_calcRegularColor = function  (_ale_arg0, _ale_arg1, _ale_arg2) { return lerpColor(_ale_arg0, _ale_arg1, _ale_arg2); }
pollingplace_calcFraudColor = function  (_ale_arg2, _ale_arg0, _ale_arg1) { return ((_ale_arg0 > 0.83) ? _ale_arg1 : _ale_arg2); }
pollingplace___selfRenderSize__0 = function  (_ale_arg5, _ale_arg2, _ale_arg4, _ale_arg3, _ale_arg1, _ale_arg6, _ale_arg0) { return Rectangle_size(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, ((((255 * 256) * 256) * 256) + lerpColor(_ale_arg4, _ale_arg5, _ale_arg6))); }
pollingplace___draw__ = function  (_ale_arg0) { return _ale_arg0; }
pollingplace_calcProjectedColor = function  (_ale_arg0, _ale_arg2, _ale_arg1) { return lerpColor(_ale_arg0, _ale_arg1, _ale_arg2); }
pollingplace_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
pollingplace___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
pollingplace___renderSize__ = function  (_ale_arg0) { return _ale_arg0; }
region_childs_h = function  (_ale_arg1, _ale_arg0, _ale_arg2) { return ((_ale_arg0 / _ale_arg1) * _ale_arg2); }
region_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
region___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
region_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
region___selfRenderSize__ = function  () { return 0; }
region___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
region___draw__ = function  () { return 0; }
region_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
region_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
region_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
region_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
region_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
region_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
region_childs_rx = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
region_childs_w = function  (_ale_arg0) { return _ale_arg0; }
region_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs_w = function  (_ale_arg2, _ale_arg1, _ale_arg0) { return ((_ale_arg0 / _ale_arg1) * _ale_arg2); }
hsquare_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs_by = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
hsquare_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs_h = function  (_ale_arg0) { return _ale_arg0; }
hsquare_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
hsquare___selfRenderSize__ = function  () { return 0; }
hsquare___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
hsquare_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
hsquare___draw__ = function  () { return 0; }
hsquare_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
hsquare___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
hsquare_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
hsquare_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs_h = function  (_ale_arg1, _ale_arg0, _ale_arg2) { return ((_ale_arg0 / _ale_arg1) * _ale_arg2); }
vsquare_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
vsquare___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
vsquare_childs_w = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs_rx = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
vsquare_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
vsquare_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
vsquare___selfRenderSize__ = function  () { return 0; }
vsquare_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
vsquare___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
vsquare_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
vsquare_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
vsquare___draw__ = function  () { return 0; }
countrycontainer_childs_showJavascript = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer___selfRenderSize__ = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer_childs_showProjected = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer___draw__0 = function  (_ale_arg6, _ale_arg3, _ale_arg0, _ale_arg2,  _ale_arg1, _ale_arg7, _ale_arg5, _ale_arg4) { return ((_ale_arg0 != 0) ? RectangleOutline_draw(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, _ale_arg7, rgb(0, 0, 0)) : 0); }
countrycontainer_childs_showFraud = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer_childs_maxTurnout = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer___draw__ = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer___renderOffset__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
countrycontainer_childs_by = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 + _ale_arg1); }
countrycontainer___renderSize__ = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 + _ale_arg1); }
countrycontainer_childs_h = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer_childs_w = function  (_ale_arg2, _ale_arg1, _ale_arg0) { return ((_ale_arg0 / _ale_arg1) * _ale_arg2); }
countrycontainer___selfRenderSize__0 = function  (_ale_arg3, _ale_arg0, _ale_arg4, _ale_arg2, _ale_arg1) { return ((_ale_arg0 != 0) ? RectangleOutline_size(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, rgb(0, 0, 0)) : 0); }
countrycontainer_x = function  (_ale_arg1, _ale_arg0) { return (_ale_arg0 - _ale_arg1); }
countrycontainer_childs___doRenderingLast__ = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer_childs_minTurnout = function  (_ale_arg0) { return _ale_arg0; }
countrycontainer_y = function  (_ale_arg0, _ale_arg1) { return (_ale_arg0 - _ale_arg1); }
countrycontainer_childs_fixWidth = function  (_ale_arg0) { return _ale_arg0; }
// Generated code. Modifcation to this file will be lost on next code generation.
/**
 * @file traversals.cl
 * @brief OpenCL code to run layout solver traversals.
 */
  
  
  
  
  
///// pass /////
this.visit_root_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_by[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_by(this.fld_iroot_height[index]);
  this.fld_node_fixwidth[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_fixWidth(this.fld_iroot_fixwidth[index]);
  this.fld_node_maxturnout[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_maxTurnout(this.fld_iroot_maxturnout[index]);
  this.fld_node_minturnout[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_minTurnout(this.fld_iroot_minturnout[index]);
  this.fld_node_rx[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_rx(this.fld_iroot_width[index]);
  this.fld_node_showfraud[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_showFraud(this.fld_iroot_showfraud[index]);
  this.fld_node_showjavascript[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_showJavascript(this.fld_iroot_showjavascript[index]);
  this.fld_node_showprojected[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_showProjected(this.fld_iroot_showprojected[index]);
  this.fld_root___draw__[index] = root___draw__();
  this.fld_root___selfrendersize__[index] = root___selfRenderSize__();
  this.fld_node___dorenderinglast__[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs___doRenderingLast__(this.fld_root___draw__[index]);
}
this.visit_district_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_fixwidth[current_node] = (this.fld_node_fixwidth[index] );
      this.fld_node_maxturnout[current_node] = (this.fld_node_maxturnout[index] );
      this.fld_node_minturnout[current_node] = (this.fld_node_minturnout[index] );
      this.fld_node_showfraud[current_node] = (this.fld_node_showfraud[index] );
      this.fld_node_showjavascript[current_node] = (this.fld_node_showjavascript[index] );
      this.fld_node_showprojected[current_node] = (this.fld_node_showprojected[index] );
   prev_child_idx = current_node; }
}
this.visit_pollingplace_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_pollingplace_calcprojectedcolor[index] = pollingplace_calcProjectedColor(this.fld_pollingplace_defcolor[index], this.fld_pollingplace_urvotesprojected[index], this.fld_pollingplace_urcolor[index]);
  this.fld_pollingplace_calcregularcolor[index] = pollingplace_calcRegularColor(this.fld_pollingplace_defcolor[index], this.fld_pollingplace_urcolor[index], this.fld_pollingplace_urvotes[index]);
  this.fld_pollingplace_magnitude[index] = pollingplace_magnitude(this.fld_node_minturnout[index], this.fld_pollingplace_totalvotes[index], this.fld_node_maxturnout[index], this.fld_pollingplace_turnout[index]);
  this.fld_node_votesur[index] = pollingplace_votesUR(this.fld_node_minturnout[index], this.fld_node_showprojected[index], this.fld_pollingplace_urvotesprojected[index], this.fld_pollingplace_totalvotes[index], this.fld_node_maxturnout[index], this.fld_pollingplace_turnout[index], this.fld_pollingplace_totalvotesur[index]);
  this.fld_pollingplace_calcvotescolor[index] = pollingplace_calcVotesColor(this.fld_node_showprojected[index], this.fld_pollingplace_calcregularcolor[index], this.fld_pollingplace_calcprojectedcolor[index], this.fld_pollingplace_turnout[index]);
  this.fld_node_totalmag[index] = pollingplace_totalMag(this.fld_pollingplace_injavascript[index], this.fld_pollingplace_magnitude[index], this.fld_node_showjavascript[index]);
  this.fld_pollingplace_calcfraudcolor[index] = pollingplace_calcFraudColor(this.fld_pollingplace_calcvotescolor[index], this.fld_pollingplace_turnout[index], this.fld_pollingplace_fraudcolor[index]);
}
this.visit_region_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_region___draw__[index] = region___draw__();
  this.fld_region___selfrendersize__[index] = region___selfRenderSize__();
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_fixwidth[current_node] = (this.fld_node_fixwidth[index] );
      this.fld_node_maxturnout[current_node] = (this.fld_node_maxturnout[index] );
      this.fld_node_minturnout[current_node] = (this.fld_node_minturnout[index] );
      this.fld_node_showfraud[current_node] = (this.fld_node_showfraud[index] );
      this.fld_node_showjavascript[current_node] = (this.fld_node_showjavascript[index] );
      this.fld_node_showprojected[current_node] = (this.fld_node_showprojected[index] );
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_region___draw__[index] );
   prev_child_idx = current_node; }
}
this.visit_hsquare_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_hsquare___draw__[index] = hsquare___draw__();
  this.fld_hsquare___selfrendersize__[index] = hsquare___selfRenderSize__();
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_fixwidth[current_node] = (this.fld_node_fixwidth[index] );
      this.fld_node_maxturnout[current_node] = (this.fld_node_maxturnout[index] );
      this.fld_node_minturnout[current_node] = (this.fld_node_minturnout[index] );
      this.fld_node_showfraud[current_node] = (this.fld_node_showfraud[index] );
      this.fld_node_showjavascript[current_node] = (this.fld_node_showjavascript[index] );
      this.fld_node_showprojected[current_node] = (this.fld_node_showprojected[index] );
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_hsquare___draw__[index] );
   prev_child_idx = current_node; }
}
this.visit_vsquare_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_vsquare___draw__[index] = vsquare___draw__();
  this.fld_vsquare___selfrendersize__[index] = vsquare___selfRenderSize__();
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_fixwidth[current_node] = (this.fld_node_fixwidth[index] );
      this.fld_node_maxturnout[current_node] = (this.fld_node_maxturnout[index] );
      this.fld_node_minturnout[current_node] = (this.fld_node_minturnout[index] );
      this.fld_node_showfraud[current_node] = (this.fld_node_showfraud[index] );
      this.fld_node_showjavascript[current_node] = (this.fld_node_showjavascript[index] );
      this.fld_node_showprojected[current_node] = (this.fld_node_showprojected[index] );
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_vsquare___draw__[index] );
   prev_child_idx = current_node; }
}
this.visit_countrycontainer_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_fixwidth[current_node] = (this.fld_node_fixwidth[index] );
      this.fld_node_maxturnout[current_node] = (this.fld_node_maxturnout[index] );
      this.fld_node_minturnout[current_node] = (this.fld_node_minturnout[index] );
      this.fld_node_showfraud[current_node] = (this.fld_node_showfraud[index] );
      this.fld_node_showjavascript[current_node] = (this.fld_node_showjavascript[index] );
      this.fld_node_showprojected[current_node] = (this.fld_node_showprojected[index] );
   prev_child_idx = current_node; }
}
///// pass /////
this.visit_root_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_iroot_totalmag[index] = root_totalMag(this.fld_node_totalmag[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)]);
  this.fld_node_h[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_h(this.fld_iroot_height[index], this.fld_iroot_totalmag[index]);
  this.fld_node_w[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs_w(this.fld_iroot_totalmag[index], this.fld_iroot_width[index], this.fld_iroot_fixwidth[index]);
  this.fld_iroot_votesur[index] = root_votesUR(this.fld_iroot_totalmag[index], this.fld_node_votesur[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)]);
}
this.visit_district_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_district_totalmag_init[index] = (0);
  this.fld_node_totalmag[index] = this.fld_district_totalmag_init[index];
    this.fld_district_votesur_init[index] = (0);
  this.fld_node_votesur[index] = this.fld_district_votesur_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_totalmag[index] = ((this.fld_node_totalmag[index] + this.fld_node_totalmag[current_node]));
      this.fld_node_votesur[index] = ((this.fld_node_votesur[index] + this.fld_node_votesur[current_node]));
   prev_child_idx = current_node; }
}
this.visit_pollingplace_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_region_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_region_totalmag_init[index] = (0);
  this.fld_node_totalmag[index] = this.fld_region_totalmag_init[index];
    this.fld_region_votesur_init[index] = (0);
  this.fld_node_votesur[index] = this.fld_region_votesur_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_totalmag[index] = ((this.fld_node_totalmag[index] + this.fld_node_totalmag[current_node]));
      this.fld_node_votesur[index] = ((this.fld_node_votesur[index] + this.fld_node_votesur[current_node]));
   prev_child_idx = current_node; }
}
this.visit_hsquare_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_hsquare_totalmag_init[index] = (0);
  this.fld_node_totalmag[index] = this.fld_hsquare_totalmag_init[index];
    this.fld_hsquare_votesur_init[index] = (0);
  this.fld_node_votesur[index] = this.fld_hsquare_votesur_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_totalmag[index] = ((this.fld_node_totalmag[index] + this.fld_node_totalmag[current_node]));
      this.fld_node_votesur[index] = ((this.fld_node_votesur[index] + this.fld_node_votesur[current_node]));
   prev_child_idx = current_node; }
}
this.visit_vsquare_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_vsquare_totalmag_init[index] = (0);
  this.fld_node_totalmag[index] = this.fld_vsquare_totalmag_init[index];
    this.fld_vsquare_votesur_init[index] = (0);
  this.fld_node_votesur[index] = this.fld_vsquare_votesur_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_totalmag[index] = ((this.fld_node_totalmag[index] + this.fld_node_totalmag[current_node]));
      this.fld_node_votesur[index] = ((this.fld_node_votesur[index] + this.fld_node_votesur[current_node]));
   prev_child_idx = current_node; }
}
this.visit_countrycontainer_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_countrycontainer_totalmag_init[index] = (0);
  this.fld_node_totalmag[index] = this.fld_countrycontainer_totalmag_init[index];
    this.fld_countrycontainer_votesur_init[index] = (0);
  this.fld_node_votesur[index] = this.fld_countrycontainer_votesur_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_totalmag[index] = ((this.fld_node_totalmag[index] + this.fld_node_totalmag[current_node]));
      this.fld_node_votesur[index] = ((this.fld_node_votesur[index] + this.fld_node_votesur[current_node]));
   prev_child_idx = current_node; }
}
///// pass /////
this.visit_root_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_district_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = district_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = district_y(this.fld_node_by[index], this.fld_node_h[index]);
  this.fld_district___selfrendersize__0[index] = district___selfRenderSize__0(this.fld_node_w[index], this.fld_node_fixwidth[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[current_node] = (this.fld_node_h[index] );
      this.fld_node_w[current_node] = (((this.fld_node_totalmag[current_node] / this.fld_node_totalmag[index]) * this.fld_node_w[index]));
      this.fld_node_by[current_node] = ((this.fld_node_y[index] + this.fld_node_h[index]));
   prev_child_idx = current_node; }
  this.fld_district___selfrendersize__[index] = district___selfRenderSize__(this.fld_district___selfrendersize__0[index]);
  this.fld_district_childs_rx_init[index] = (this.fld_node_x[index] );
  this.fld_district_childs_rx_last[index] = this.fld_district_childs_rx_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = (((step == 1 ? (this.fld_district_childs_rx_last[index]) : (this.fld_node_rx[prev_child_idx])) + this.fld_node_w[current_node]));
   prev_child_idx = current_node; }
}
this.visit_pollingplace_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = pollingplace_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = pollingplace_y(this.fld_node_by[index], this.fld_node_h[index]);
  this.fld_pollingplace___selfrendersize__0[index] = pollingplace___selfRenderSize__0(this.fld_pollingplace_calcfraudcolor[index], this.fld_node_w[index], this.fld_pollingplace_calcvotescolor[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_showfraud[index], this.fld_node_x[index]);
  this.fld_pollingplace___selfrendersize__[index] = pollingplace___selfRenderSize__(this.fld_pollingplace___selfrendersize__0[index]);
  this.fld_node___rendersize__[index] = pollingplace___renderSize__(this.fld_pollingplace___selfrendersize__[index]);
}
this.visit_region_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = region_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = region_y(this.fld_node_by[index], this.fld_node_h[index]);
  this.fld_region_childs_by_init[index] = (this.fld_node_y[index] );
  this.fld_region_childs_by_last[index] = this.fld_region_childs_by_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[current_node] = (((this.fld_node_totalmag[current_node] / this.fld_node_totalmag[index]) * this.fld_node_h[index]));
      this.fld_node_w[current_node] = (this.fld_node_w[index] );
      this.fld_node_by[current_node] = (((step == 1 ? (this.fld_region_childs_by_last[index]) : (this.fld_node_by[prev_child_idx])) + this.fld_node_h[current_node]));
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = ((this.fld_node_x[index] + this.fld_node_w[index]));
   prev_child_idx = current_node; }
}
this.visit_hsquare_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = hsquare_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = hsquare_y(this.fld_node_by[index], this.fld_node_h[index]);
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[current_node] = (this.fld_node_h[index] );
      this.fld_node_w[current_node] = (((this.fld_node_totalmag[current_node] / this.fld_node_totalmag[index]) * this.fld_node_w[index]));
      this.fld_node_by[current_node] = ((this.fld_node_y[index] + this.fld_node_h[index]));
   prev_child_idx = current_node; }
  this.fld_hsquare_childs_rx_init[index] = (this.fld_node_x[index] );
  this.fld_hsquare_childs_rx_last[index] = this.fld_hsquare_childs_rx_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = (((step == 1 ? (this.fld_hsquare_childs_rx_last[index]) : (this.fld_node_rx[prev_child_idx])) + this.fld_node_w[current_node]));
   prev_child_idx = current_node; }
}
this.visit_vsquare_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = vsquare_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = vsquare_y(this.fld_node_by[index], this.fld_node_h[index]);
  this.fld_vsquare_childs_by_init[index] = (this.fld_node_y[index] );
  this.fld_vsquare_childs_by_last[index] = this.fld_vsquare_childs_by_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[current_node] = (((this.fld_node_totalmag[current_node] / this.fld_node_totalmag[index]) * this.fld_node_h[index]));
      this.fld_node_w[current_node] = (this.fld_node_w[index] );
      this.fld_node_by[current_node] = (((step == 1 ? (this.fld_vsquare_childs_by_last[index]) : (this.fld_node_by[prev_child_idx])) + this.fld_node_h[current_node]));
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = ((this.fld_node_x[index] + this.fld_node_w[index]));
   prev_child_idx = current_node; }
}
this.visit_countrycontainer_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node_x[index] = countrycontainer_x(this.fld_node_w[index], this.fld_node_rx[index]);
  this.fld_node_y[index] = countrycontainer_y(this.fld_node_by[index], this.fld_node_h[index]);
  this.fld_countrycontainer___selfrendersize__0[index] = countrycontainer___selfRenderSize__0(this.fld_node_w[index], this.fld_node_fixwidth[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_h[current_node] = (this.fld_node_h[index] );
      this.fld_node_w[current_node] = (((this.fld_node_totalmag[current_node] / this.fld_node_totalmag[index]) * this.fld_node_w[index]));
      this.fld_node_by[current_node] = ((this.fld_node_y[index] + this.fld_node_h[index]));
   prev_child_idx = current_node; }
  this.fld_countrycontainer___selfrendersize__[index] = countrycontainer___selfRenderSize__(this.fld_countrycontainer___selfrendersize__0[index]);
  this.fld_countrycontainer_childs_rx_init[index] = (this.fld_node_x[index] );
  this.fld_countrycontainer_childs_rx_last[index] = this.fld_countrycontainer_childs_rx_init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node_rx[current_node] = (((step == 1 ? (this.fld_countrycontainer_childs_rx_last[index]) : (this.fld_node_rx[prev_child_idx])) + this.fld_node_w[current_node]));
   prev_child_idx = current_node; }
}
///// pass /////
this.visit_root_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_root___childsrendersize__[index] = root___childsRenderSize__(this.fld_node___rendersize__[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)]);
  this.fld_iroot___rendersize__[index] = root___renderSize__(this.fld_root___childsrendersize__[index], this.fld_root___selfrendersize__[index]);
  this.fld_iroot___dorenderinglast__[index] = root___doRenderingLast__(this.fld_iroot___rendersize__[index]);
  this.fld_iroot___renderrightoffset__[index] = root___renderRightOffset__(this.fld_iroot___rendersize__[index]);
  this.fld_iroot___renderoffset__[index] = root___renderOffset__(this.fld_iroot___renderrightoffset__[index], this.fld_iroot___rendersize__[index]);
  this.fld_node___renderrightoffset__[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)] = root_childs___renderRightOffset__(this.fld_iroot___renderoffset__[index], this.fld_node___rendersize__[this.GetAbsoluteIndex(this.fld_root_child_childs_leftmost_child[index], index)]);
}
this.visit_district_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_district___childsrendersize___init[index] = (0);
  this.fld_district___childsrendersize__[index] = this.fld_district___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_district___childsrendersize__[index] = ((this.fld_district___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = district___renderSize__(this.fld_district___childsrendersize__[index], this.fld_district___selfrendersize__[index]);
}
this.visit_pollingplace_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_region_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_region___childsrendersize___init[index] = (0);
  this.fld_region___childsrendersize__[index] = this.fld_region___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_region___childsrendersize__[index] = ((this.fld_region___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = region___renderSize__(this.fld_region___childsrendersize__[index], this.fld_region___selfrendersize__[index]);
}
this.visit_hsquare_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_hsquare___childsrendersize___init[index] = (0);
  this.fld_hsquare___childsrendersize__[index] = this.fld_hsquare___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_hsquare___childsrendersize__[index] = ((this.fld_hsquare___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = hsquare___renderSize__(this.fld_hsquare___childsrendersize__[index], this.fld_hsquare___selfrendersize__[index]);
}
this.visit_vsquare_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_vsquare___childsrendersize___init[index] = (0);
  this.fld_vsquare___childsrendersize__[index] = this.fld_vsquare___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_vsquare___childsrendersize__[index] = ((this.fld_vsquare___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = vsquare___renderSize__(this.fld_vsquare___childsrendersize__[index], this.fld_vsquare___selfrendersize__[index]);
}
this.visit_countrycontainer_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
   prev_child_idx = current_node; }
  this.fld_countrycontainer___childsrendersize___init[index] = (0);
  this.fld_countrycontainer___childsrendersize__[index] = this.fld_countrycontainer___childsrendersize___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_countrycontainer___childsrendersize__[index] = ((this.fld_countrycontainer___childsrendersize__[index] + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  this.fld_node___rendersize__[index] = countrycontainer___renderSize__(this.fld_countrycontainer___childsrendersize__[index], this.fld_countrycontainer___selfrendersize__[index]);
}
///// pass /////
this.visit_root_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
}
this.visit_district_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = district___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_district___draw__0[index] = district___draw__0(this.fld_node_w[index], this.fld_district___selfrendersize__0[index], this.fld_node_fixwidth[index], this.fld_node___renderoffset__[index], glBufferMacro(index), this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_district___draw__[index] = district___draw__(this.fld_district___draw__0[index]);
  this.fld_district_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_district___selfrendersize__[index]));
  this.fld_district_childs___renderrightoffset___last[index] = this.fld_district_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_district_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_district_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_district___draw__[index] );
   prev_child_idx = current_node; }
}
this.visit_pollingplace_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = pollingplace___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_pollingplace___draw__0[index] = pollingplace___draw__0(this.fld_pollingplace_calcfraudcolor[index], this.fld_node_w[index], this.fld_pollingplace___selfrendersize__0[index], this.fld_node___renderoffset__[index], glBufferMacro(index), this.fld_pollingplace_calcvotescolor[index], this.fld_node_h[index], this.fld_node_y[index], this.fld_node_showfraud[index], this.fld_node_x[index]);
  this.fld_pollingplace___draw__[index] = pollingplace___draw__(this.fld_pollingplace___draw__0[index]);
}
this.visit_region_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = region___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_region_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_region___selfrendersize__[index]));
  this.fld_region_childs___renderrightoffset___last[index] = this.fld_region_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_region_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_region_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
}
this.visit_hsquare_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = hsquare___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_hsquare_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_hsquare___selfrendersize__[index]));
  this.fld_hsquare_childs___renderrightoffset___last[index] = this.fld_hsquare_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_hsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_hsquare_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
}
this.visit_vsquare_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = vsquare___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_vsquare_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_vsquare___selfrendersize__[index]));
  this.fld_vsquare_childs___renderrightoffset___last[index] = this.fld_vsquare_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_vsquare_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_vsquare_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
}
this.visit_countrycontainer_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	// Variables needed for loop macro. Declare up top to avoid declaring a
	// multitide below, one for every loop
	var step = 0;
 	var prev_child_idx = 0;
  this.fld_node___renderoffset__[index] = countrycontainer___renderOffset__(this.fld_node___renderrightoffset__[index], this.fld_node___rendersize__[index]);
  this.fld_countrycontainer___draw__0[index] = countrycontainer___draw__0(this.fld_node_w[index], this.fld_countrycontainer___selfrendersize__0[index], this.fld_node_fixwidth[index], this.fld_node___renderoffset__[index], glBufferMacro(index), this.fld_node_h[index], this.fld_node_y[index], this.fld_node_x[index]);
  this.fld_countrycontainer___draw__[index] = countrycontainer___draw__(this.fld_countrycontainer___draw__0[index]);
  this.fld_countrycontainer_childs___renderrightoffset___init[index] = ((this.fld_node___renderoffset__[index] + this.fld_countrycontainer___selfrendersize__[index]));
  this.fld_countrycontainer_childs___renderrightoffset___last[index] = this.fld_countrycontainer_childs___renderrightoffset___init[index];
    step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___renderrightoffset__[current_node] = (((step == 1 ? (this.fld_countrycontainer_childs___renderrightoffset___last[index]) : (this.fld_node___renderrightoffset__[prev_child_idx])) + this.fld_node___rendersize__[current_node]));
   prev_child_idx = current_node; }
  step = 0; prev_child_idx = 0; for (var current_node = this.GetAbsoluteIndex(this.fld_countrycontainer_child_childs_leftmost_child[index], index); current_node != 0; current_node = this.GetAbsoluteIndex(this.right_siblings[current_node], current_node)) {step++; 
      this.fld_node___dorenderinglast__[current_node] = (this.fld_countrycontainer___draw__[index] );
   prev_child_idx = current_node; }
}
 // Main visit dispatcher kernels
this.visit_0 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_COUNTRYCONTAINER:
			this.visit_countrycontainer_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_REGION:
			this.visit_region_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_DISTRICT:
			this.visit_district_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_VSQUARE:
			this.visit_vsquare_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HSQUARE:
			this.visit_hsquare_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_POLLINGPLACE:
			this.visit_pollingplace_0(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_1 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_COUNTRYCONTAINER:
			this.visit_countrycontainer_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_REGION:
			this.visit_region_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_DISTRICT:
			this.visit_district_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_VSQUARE:
			this.visit_vsquare_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HSQUARE:
			this.visit_hsquare_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_POLLINGPLACE:
			this.visit_pollingplace_1(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_2 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_COUNTRYCONTAINER:
			this.visit_countrycontainer_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_REGION:
			this.visit_region_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_DISTRICT:
			this.visit_district_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_VSQUARE:
			this.visit_vsquare_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HSQUARE:
			this.visit_hsquare_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_POLLINGPLACE:
			this.visit_pollingplace_2(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_3 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_COUNTRYCONTAINER:
			this.visit_countrycontainer_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_REGION:
			this.visit_region_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_DISTRICT:
			this.visit_district_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_VSQUARE:
			this.visit_vsquare_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_HSQUARE:
			this.visit_hsquare_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
		case this.TOK_POLLINGPLACE:
			this.visit_pollingplace_3(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1);
			break;
	}
}
this.visit_4 = function (index, tree_size,  int_buffer_1,  float_buffer_1,  grammartokens_buffer_1,  nodeindex_buffer_1,  glBuffer) {
	
	switch(this.displayname[index]) {
		case this.TOK_ROOT:
			this.visit_root_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_COUNTRYCONTAINER:
			this.visit_countrycontainer_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_REGION:
			this.visit_region_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_DISTRICT:
			this.visit_district_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_VSQUARE:
			this.visit_vsquare_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_HSQUARE:
			this.visit_hsquare_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
		case this.TOK_POLLINGPLACE:
			this.visit_pollingplace_4(index, tree_size, int_buffer_1, float_buffer_1, grammartokens_buffer_1, nodeindex_buffer_1, glBuffer);
			break;
	}
}
