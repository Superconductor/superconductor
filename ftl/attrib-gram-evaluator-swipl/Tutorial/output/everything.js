function wrapbox_render ( _ale_arg3,  _ale_arg6,  _ale_arg0,  _ale_arg5,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintRect(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5) + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, _ale_arg6); }
function wrapbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function wrapbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function wrapbox_w ( _ale_arg0) { return _ale_arg0; }
function listbox_childs_x ( _ale_arg0) { return _ale_arg0 + 15; }
function listbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function listbox_childs_lineH () { return 0; }
function listbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function vbox_childs_x ( _ale_arg0) { return _ale_arg0 + 5; }
function vbox_render ( _ale_arg3,  _ale_arg6,  _ale_arg0,  _ale_arg5,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintRect(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5) + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, _ale_arg6); }
function vbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function vbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function rows_footer_lineH () { return 0; }
function rows_header_canvas ( _ale_arg0) { return _ale_arg0; }
function rows_header_relY () { return 5; }
function rows_rows_metrics ( _ale_arg0) { return _ale_arg0; }
function rows_rows_x ( _ale_arg0) { return _ale_arg0 + 5; }
function rows_header_lineH () { return 0; }
function rows_header_metrics ( _ale_arg0) { return _ale_arg0; }
function rows_footer_metrics ( _ale_arg0) { return _ale_arg0; }
function rows_header_x ( _ale_arg0) { return _ale_arg0 + 5; }
function rows_footer_relY ( _ale_arg3,  _ale_arg1,  _ale_arg2,  _ale_arg0) { return (_ale_arg0 == 0) ? (_ale_arg1 + _ale_arg2 + 10) : (_ale_arg3 + 5); }
function rows_footer_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function rows_header_absY ( _ale_arg1,  _ale_arg0) { return _ale_arg0 + _ale_arg1; }
function rows_footer_x ( _ale_arg0) { return _ale_arg0 + 5; }
function row_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function row_render ( _ale_arg3,  _ale_arg6,  _ale_arg0,  _ale_arg5,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintRect(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5) + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, _ale_arg6); }
function row_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function row_childs_lineH () { return 0; }
function row_childs_relY () { return 5; }
function row_childs_canvas () { return 0; }
function textbox_renderColor ( _ale_arg0,  _ale_arg1) { return (! isEmptyColor(_ale_arg0)) ? valueColor(_ale_arg0) : _ale_arg1; }
function textbox_numberLines ( _ale_arg3,  _ale_arg0,  _ale_arg5,  _ale_arg4,  _ale_arg2,  _ale_arg1) { return getNumberLines(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5); }
function textbox_textRequests ( _ale_arg0,  _ale_arg2,  _ale_arg1) { return requestGlyphs(_ale_arg0, _ale_arg1, _ale_arg2, 0); }
function textbox_maxW ( _ale_arg0,  _ale_arg3,  _ale_arg2,  _ale_arg1) { return getSumWordW(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3); }
function textbox_render ( _ale_arg5,  _ale_arg8,  _ale_arg7,  _ale_arg0,  _ale_arg9,  _ale_arg6,  _ale_arg2,  _ale_arg10,  _ale_arg4,  _ale_arg1,  _ale_arg3) { return paintParagraph(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, _ale_arg7, _ale_arg8, _ale_arg9, _ale_arg10); }
function textbox_inhFontSize () { return 10; }
function textbox_w ( _ale_arg0) { return _ale_arg0; }
function textbox_metrics () { return 0; }
function textbox_overflow () { return false; }
function textbox_renderFontSize ( _ale_arg1,  _ale_arg0) { return isEmptyInt(_ale_arg0) ? _ale_arg1 : valueInt(_ale_arg0); }
function textbox_lineHeight ( _ale_arg0,  _ale_arg3,  _ale_arg2,  _ale_arg1) { return getLineHeight(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3); }
function textbox_lineSpacing ( _ale_arg0) { return _ale_arg0; }
function textbox_h ( _ale_arg1,  _ale_arg0,  _ale_arg2) { return _ale_arg0 > 1 ? ((_ale_arg0 * _ale_arg1) + ((_ale_arg0 - 1) + _ale_arg2)) : _ale_arg1; }
function textbox_inhColor () { return "black"; }
function top_child_lineH () { return 0; }
function top_child_absY () { return 0; }
function top_child_x () { return 0; }
function top_child_relY () { return 0; }
function top_child_canvas ( _ale_arg0,  _ale_arg1) { return paintStart(_ale_arg0 + 1, _ale_arg1 + 1); }
function hbox_render ( _ale_arg3,  _ale_arg6,  _ale_arg0,  _ale_arg5,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintRect(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5) + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, _ale_arg6); }
function hbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function hbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function leaf_w () { return 10; }
function leaf_textRequests () { return 0; }
function leaf_h () { return 10; }
function leaf_render ( _ale_arg3,  _ale_arg6,  _ale_arg0,  _ale_arg5,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintRect(_ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5) + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg6) + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, _ale_arg6); }
///// pass /////
function visit_wrapbox_0(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 0);
  setAttribSafe(node, "w", wrapbox_w(getInputAttribSafe(node, "width", '100')));
  logger.log("    wrapbox_w: " + getAttribSafe(node, "w"));
  logger.log("        width: " + getInputAttribSafe(node, "width", '100'));
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step childs@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  return true;
}
function visit_listbox_0(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 0);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step childs@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (0));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  return true;
}
function visit_vbox_0(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 0);
  
  setAttribSafe(node, "numchilds_init", (0));
  setAttribSafe(node, "numchilds", getAttribSafe(node, "numchilds_init"));
  logger.log("      init numChilds: " + getAttribSafe(node, "numchilds_init"));
  logger.log("    last init numchilds: " + getAttribSafe(node, "numchilds"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "numchilds", (1 + getAttribSafe(node, "numchilds") ));
      logger.log("         step numChilds: " + getAttribSafe(node, "numchilds"));
    }
  })();

  
  setAttribSafe(node, "childs_lineh_init", (0));
  setAttribSafe(node, "childs_lineh_last", getAttribSafe(node, "childs_lineh_init"));
  logger.log("      init childs@lineH: " + getAttribSafe(node, "childs_lineh_init"));
  logger.log("    last init childs_lineh_last: " + getAttribSafe(node, "childs_lineh_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (0));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step childs@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  return true;
}
function visit_rows_0(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 0);
  setAttribSafe(getChildByRefName(node,"footer"), "metrics", rows_footer_metrics(getAttribSafe(node, "metrics")));
  logger.log("    rows_footer_metrics: " + getAttribSafe(getChildByRefName(node,"footer"), "metrics"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  setAttribSafe(getChildByRefName(node,"header"), "lineh", rows_header_lineH());
  logger.log("    rows_header_lineH: " + getAttribSafe(getChildByRefName(node,"header"), "lineh"));
  setAttribSafe(getChildByRefName(node,"header"), "metrics", rows_header_metrics(getAttribSafe(node, "metrics")));
  logger.log("    rows_header_metrics: " + getAttribSafe(getChildByRefName(node,"header"), "metrics"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  setAttribSafe(getChildByRefName(node,"header"), "rely", rows_header_relY());
  logger.log("    rows_header_relY: " + getAttribSafe(getChildByRefName(node,"header"), "rely"));
  setAttribSafe(getChildByRefName(node,"footer"), "lineh", rows_footer_lineH());
  logger.log("    rows_footer_lineH: " + getAttribSafe(getChildByRefName(node,"footer"), "lineh"));
  
  setAttribSafe(node, "rows_canvas_init", (0));
  setAttribSafe(node, "rows_canvas_last", getAttribSafe(node, "rows_canvas_init"));
  logger.log("      init rows@canvas: " + getAttribSafe(node, "rows_canvas_init"));
  logger.log("    last init rows_canvas_last: " + getAttribSafe(node, "rows_canvas_last"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (0));
      logger.log("         step rows@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step rows@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  
  setAttribSafe(node, "numrows_init", (0));
  setAttribSafe(node, "numrows", getAttribSafe(node, "numrows_init"));
  logger.log("      init numRows: " + getAttribSafe(node, "numrows_init"));
  logger.log("    last init numrows: " + getAttribSafe(node, "numrows"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "numrows", (getAttribSafe(node, "numrows") + 1));
      logger.log("         step numRows: " + getAttribSafe(node, "numrows"));
    }
  })();

  return true;
}
function visit_textbox_0(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 0);
  setAttribSafe(node, "metrics", textbox_metrics());
  logger.log("    textbox_metrics: " + getAttribSafe(node, "metrics"));
  setAttribSafe(node, "inhfontsize", textbox_inhFontSize());
  logger.log("    textbox_inhFontSize: " + getAttribSafe(node, "inhfontsize"));
  setAttribSafe(node, "renderfontsize", textbox_renderFontSize(getAttribSafe(node, "inhfontsize"), getInputMaybeAttribSafe(node, "fontsize")));
  logger.log("    textbox_renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        inhFontSize: " + getAttribSafe(node, "inhfontsize"));
  logger.log("        fontSize: " + getInputMaybeAttribSafe(node, "fontsize"));
  setAttribSafe(node, "lineheight", textbox_lineHeight(getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_lineHeight: " + getAttribSafe(node, "lineheight"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "linespacing", textbox_lineSpacing(getAttribSafe(node, "lineheight")));
  logger.log("    textbox_lineSpacing: " + getAttribSafe(node, "linespacing"));
  logger.log("        lineHeight: " + getAttribSafe(node, "lineheight"));
  setAttribSafe(node, "maxw", textbox_maxW(getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_maxW: " + getAttribSafe(node, "maxw"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "textrequests", textbox_textRequests(getAttribSafe(node, "text"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_textRequests: " + getAttribSafe(node, "textrequests"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "w", textbox_w(getAttribSafe(node, "maxw")));
  logger.log("    textbox_w: " + getAttribSafe(node, "w"));
  logger.log("        maxW: " + getAttribSafe(node, "maxw"));
  setAttribSafe(node, "overflow", textbox_overflow());
  logger.log("    textbox_overflow: " + getAttribSafe(node, "overflow"));
  setAttribSafe(node, "numberlines", textbox_numberLines(getAttribSafe(node, "w"), getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "overflow"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_numberLines: " + getAttribSafe(node, "numberlines"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        overflow: " + getAttribSafe(node, "overflow"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "h", textbox_h(getAttribSafe(node, "lineheight"), getAttribSafe(node, "numberlines"), getAttribSafe(node, "linespacing")));
  logger.log("    textbox_h: " + getAttribSafe(node, "h"));
  logger.log("        lineHeight: " + getAttribSafe(node, "lineheight"));
  logger.log("        numberLines: " + getAttribSafe(node, "numberlines"));
  logger.log("        lineSpacing: " + getAttribSafe(node, "linespacing"));
  setAttribSafe(node, "inhcolor", textbox_inhColor());
  logger.log("    textbox_inhColor: " + getAttribSafe(node, "inhcolor"));
  setAttribSafe(node, "rendercolor", textbox_renderColor(getInputMaybeAttribSafe(node, "color"), getAttribSafe(node, "inhcolor")));
  logger.log("    textbox_renderColor: " + getAttribSafe(node, "rendercolor"));
  logger.log("        color: " + getInputMaybeAttribSafe(node, "color"));
  logger.log("        inhColor: " + getAttribSafe(node, "inhcolor"));
  return true;
}
function visit_row_0(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 0);
  
  setAttribSafe(node, "numchilds_init", (0));
  setAttribSafe(node, "numchilds", getAttribSafe(node, "numchilds_init"));
  logger.log("      init numchilds: " + getAttribSafe(node, "numchilds_init"));
  logger.log("    last init numchilds: " + getAttribSafe(node, "numchilds"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "numchilds", (getAttribSafe(node, "numchilds") + 1));
      logger.log("         step numchilds: " + getAttribSafe(node, "numchilds"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step childs@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (0));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (5));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (0));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_top_0(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 0);
  setAttribSafe(getChildByRefName(node,"child"), "absy", top_child_absY());
  logger.log("    top_child_absY: " + getAttribSafe(getChildByRefName(node,"child"), "absy"));
  setAttribSafe(getChildByRefName(node,"child"), "rely", top_child_relY());
  logger.log("    top_child_relY: " + getAttribSafe(getChildByRefName(node,"child"), "rely"));
  setAttribSafe(getChildByRefName(node,"child"), "lineh", top_child_lineH());
  logger.log("    top_child_lineH: " + getAttribSafe(getChildByRefName(node,"child"), "lineh"));
  setAttribSafe(getChildByRefName(node,"child"), "x", top_child_x());
  logger.log("    top_child_x: " + getAttribSafe(getChildByRefName(node,"child"), "x"));
  return true;
}
function visit_hbox_0(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 0);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "metrics", (getAttribSafe(node, "metrics") ));
      logger.log("         step childs@metrics: " + getAttribSafe(child, "metrics"));
    }
  })();

  
  setAttribSafe(node, "childs_rely_init", (5));
  setAttribSafe(node, "childs_rely_last", getAttribSafe(node, "childs_rely_init"));
  logger.log("      init childs@relY: " + getAttribSafe(node, "childs_rely_init"));
  logger.log("    last init childs_rely_last: " + getAttribSafe(node, "childs_rely_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (5));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  
  setAttribSafe(node, "numchilds_init", (0));
  setAttribSafe(node, "numchilds", getAttribSafe(node, "numchilds_init"));
  logger.log("      init numChilds: " + getAttribSafe(node, "numchilds_init"));
  logger.log("    last init numchilds: " + getAttribSafe(node, "numchilds"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "numchilds", (1 + getAttribSafe(node, "numchilds") ));
      logger.log("         step numChilds: " + getAttribSafe(node, "numchilds"));
    }
  })();

  
  setAttribSafe(node, "childs_lineh_init", (0));
  setAttribSafe(node, "childs_lineh_last", getAttribSafe(node, "childs_lineh_init"));
  logger.log("      init childs@lineH: " + getAttribSafe(node, "childs_lineh_init"));
  logger.log("    last init childs_lineh_last: " + getAttribSafe(node, "childs_lineh_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (0));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  return true;
}
function visit_leaf_0(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 0);
  setAttribSafe(node, "w", leaf_w());
  logger.log("    leaf_w: " + getAttribSafe(node, "w"));
  setAttribSafe(node, "h", leaf_h());
  logger.log("    leaf_h: " + getAttribSafe(node, "h"));
  setAttribSafe(node, "textrequests", leaf_textRequests());
  logger.log("    leaf_textRequests: " + getAttribSafe(node, "textrequests"));
  return true;
}
///// pass /////
function visit_wrapbox_1(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "textrequests_init", (0));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  return true;
}
function visit_listbox_1(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "w_init", (10));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") < (5 + 10 + 5 + getAttribSafe(child, "w") + 5) ? (5 + 10 + 5 + getAttribSafe(child, "w") + 5) : getAttribSafe(node, "w") ));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  
  setAttribSafe(node, "textrequests_init", (0));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  return true;
}
function visit_vbox_1(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "w_init", (10));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") < (10 + getAttribSafe(child, "w")) ? (10 + getAttribSafe(child, "w")) : getAttribSafe(node, "w") ));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  
  setAttribSafe(node, "textrequests_init", (0));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  return true;
}
function visit_rows_1(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "textrequests_init", (getAttribSafe(getChildByRefName(node,"header"), "textrequests") + getAttribSafe(getChildByRefName(node,"footer"), "textrequests") ));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  
  setAttribSafe(node, "w_init", (10 < (getAttribSafe(getChildByRefName(node,"header"), "w") + 10) ? ((getAttribSafe(getChildByRefName(node,"header"), "w") + 10) < (getAttribSafe(getChildByRefName(node,"footer"), "w") + 10) ? (getAttribSafe(getChildByRefName(node,"footer"), "w") + 10) : (getAttribSafe(getChildByRefName(node,"header"), "w") + 10)) : 10));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", ((10 + getAttribSafe(child, "w") > getAttribSafe(node, "w")) ? (10 + getAttribSafe(child, "w")) : getAttribSafe(node, "w") ));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  return true;
}
function visit_textbox_1(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 1);
  return true;
}
function visit_row_1(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "w_init", (getAttribSafe(node, "numchilds") == 0 ? 10 : 5));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") + getAttribSafe(child, "w") + 5));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  
  setAttribSafe(node, "textrequests_init", (0));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  return true;
}
function visit_top_1(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 1);
  return true;
}
function visit_hbox_1(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "w_init", (5 + (getAttribSafe(node, "numchilds") == 0 ? 5 : 0)));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") + getAttribSafe(child, "w") + 5));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  
  setAttribSafe(node, "textrequests_init", (0));
  setAttribSafe(node, "textrequests", getAttribSafe(node, "textrequests_init"));
  logger.log("      init textRequests: " + getAttribSafe(node, "textrequests_init"));
  logger.log("    last init textrequests: " + getAttribSafe(node, "textrequests"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "textrequests", (getAttribSafe(node, "textrequests") + getAttribSafe(child, "textrequests") ));
      logger.log("         step textRequests: " + getAttribSafe(node, "textrequests"));
    }
  })();

  return true;
}
function visit_leaf_1(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 1);
  return true;
}
///// pass /////
function visit_wrapbox_2(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 2);
  
  setAttribSafe(node, "childs_x_init", (getAttribSafe(node, "x") ));
  setAttribSafe(node, "childs_x_last", getAttribSafe(node, "childs_x_init"));
  logger.log("      init childs@x: " + getAttribSafe(node, "childs_x_init"));
  logger.log("    last init childs_x_last: " + getAttribSafe(node, "childs_x_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5 + getAttribSafe(child, "w") >= (getAttribSafe(node, "x") + getAttribSafe(node, "w")) ? (getAttribSafe(node, "x") + 5) : (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5)));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_listbox_2(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 2);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(node, "x") + 15));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_vbox_2(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 2);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(node, "x") + 5));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_rows_2(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 2);
  setAttribSafe(getChildByRefName(node,"footer"), "x", rows_footer_x(getAttribSafe(node, "x")));
  logger.log("    rows_footer_x: " + getAttribSafe(getChildByRefName(node,"footer"), "x"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  setAttribSafe(getChildByRefName(node,"header"), "x", rows_header_x(getAttribSafe(node, "x")));
  logger.log("    rows_header_x: " + getAttribSafe(getChildByRefName(node,"header"), "x"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(node, "x") + 5));
      logger.log("         step rows@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_textbox_2(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 2);
  return true;
}
function visit_row_2(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 2);
  
  setAttribSafe(node, "childs_x_init", (getAttribSafe(node, "x") ));
  setAttribSafe(node, "childs_x_last", getAttribSafe(node, "childs_x_init"));
  logger.log("      init childs@x: " + getAttribSafe(node, "childs_x_init"));
  logger.log("    last init childs_x_last: " + getAttribSafe(node, "childs_x_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_top_2(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 2);
  return true;
}
function visit_hbox_2(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 2);
  
  setAttribSafe(node, "childs_x_init", (getAttribSafe(node, "x") ));
  setAttribSafe(node, "childs_x_last", getAttribSafe(node, "childs_x_init"));
  logger.log("      init childs@x: " + getAttribSafe(node, "childs_x_init"));
  logger.log("    last init childs_x_last: " + getAttribSafe(node, "childs_x_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_leaf_2(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 2);
  return true;
}
///// pass /////
function visit_wrapbox_3(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "childs_lineh_init", (0));
  setAttribSafe(node, "childs_lineh_last", getAttribSafe(node, "childs_lineh_init"));
  logger.log("      init childs@lineH: " + getAttribSafe(node, "childs_lineh_init"));
  logger.log("    last init childs_lineh_last: " + getAttribSafe(node, "childs_lineh_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (getAttribSafe(child, "x") == getAttribSafe(node, "x") + 5 ? getAttribSafe(child, "h") : (getAttribSafe(child, "h") > getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_lineh_init") : ("lineh")) ? getAttribSafe(child, "h") : getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_lineh_init") : ("lineh")))));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  
  setAttribSafe(node, "childs_rely_init", (0));
  setAttribSafe(node, "childs_rely_last", getAttribSafe(node, "childs_rely_init"));
  logger.log("      init childs@relY: " + getAttribSafe(node, "childs_rely_init"));
  logger.log("    last init childs_rely_last: " + getAttribSafe(node, "childs_rely_last"));
    setAttribSafe(node, "h_init", (10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_rely_init") : ("rely")) + (getAttribSafe(child, "x") == getAttribSafe(node, "x") + 5 ? getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_lineh_init") : ("lineh")) + 5 : 0)));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
      setAttribSafe(node, "h", (getAttribSafe(child, "rely") + getAttribSafe(child, "lineh") + 5));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  return true;
}
function visit_listbox_3(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "h_init", (10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") + getAttribSafe(child, "h") + 5));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  
  setAttribSafe(node, "childs_rely_init", (5));
  setAttribSafe(node, "childs_rely_last", getAttribSafe(node, "childs_rely_init"));
  logger.log("      init childs@relY: " + getAttribSafe(node, "childs_rely_init"));
  logger.log("    last init childs_rely_last: " + getAttribSafe(node, "childs_rely_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_rely_init") : ("rely")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_h_init") : ("h")) + 5));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  return true;
}
function visit_vbox_3(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "h_init", (5 + (getAttribSafe(node, "numchilds") == 0 ? 5 : 0)));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") + getAttribSafe(child, "h") + 5));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  
  setAttribSafe(node, "childs_rely_init", (0));
  setAttribSafe(node, "childs_rely_last", getAttribSafe(node, "childs_rely_init"));
  logger.log("      init childs@relY: " + getAttribSafe(node, "childs_rely_init"));
  logger.log("    last init childs_rely_last: " + getAttribSafe(node, "childs_rely_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_rely_init") : ("rely")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_h_init") : ("h")) + 5));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  return true;
}
function visit_rows_3(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "h_init", (5 + getAttribSafe(getChildByRefName(node,"header"), "h") + 5 + getAttribSafe(getChildByRefName(node,"footer"), "h") + 10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") + getAttribSafe(child, "h") + 10));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  
  setAttribSafe(node, "rows_endy_init", (getAttribSafe(getChildByRefName(node,"header"), "rely") + getAttribSafe(getChildByRefName(node,"header"), "h") + 5));
  setAttribSafe(node, "rows_endy_last", getAttribSafe(node, "rows_endy_init"));
  logger.log("      init rows@endY: " + getAttribSafe(node, "rows_endy_init"));
  logger.log("    last init rows_endy_last: " + getAttribSafe(node, "rows_endy_last"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "endy", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("rows_endy_init") : ("endy")) + getAttribSafe(child, "h") + 10));
      logger.log("         step rows@endY: " + getAttribSafe(child, "endy"));
    }
  })();

  
  setAttribSafe(node, "rows_rely_init", (0));
  setAttribSafe(node, "rows_rely_last", getAttribSafe(node, "rows_rely_init"));
  logger.log("      init rows@relY: " + getAttribSafe(node, "rows_rely_init"));
  logger.log("    last init rows_rely_last: " + getAttribSafe(node, "rows_rely_last"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(child, "endy") - getAttribSafe(child, "h") - 5));
      logger.log("         step rows@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  
  setAttribSafe(node, "lastrowy_init", (getAttribSafe(getChildByRefName(node,"header"), "rely") + getAttribSafe(getChildByRefName(node,"header"), "h") + 5));
  setAttribSafe(node, "lastrowy", getAttribSafe(node, "lastrowy_init"));
  logger.log("      init lastRowY: " + getAttribSafe(node, "lastrowy_init"));
  logger.log("    last init lastrowy: " + getAttribSafe(node, "lastrowy"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "lastrowy", (getAttribSafe(child, "endy") ));
      logger.log("         step lastRowY: " + getAttribSafe(node, "lastrowy"));
    }
  })();

  setAttribSafe(getChildByRefName(node,"footer"), "rely", rows_footer_relY(getAttribSafe(node, "lastrowy"), getAttribSafe(getChildByRefName(node,"header"), "rely"), getAttribSafe(getChildByRefName(node,"header"), "h"), getAttribSafe(node, "numrows")));
  logger.log("    rows_footer_relY: " + getAttribSafe(getChildByRefName(node,"footer"), "rely"));
  logger.log("        lastRowY: " + getAttribSafe(node, "lastrowy"));
  logger.log("        header@relY: " + getAttribSafe(getChildByRefName(node,"header"), "rely"));
  logger.log("        header@h: " + getAttribSafe(getChildByRefName(node,"header"), "h"));
  logger.log("        numRows: " + getAttribSafe(node, "numrows"));
  return true;
}
function visit_textbox_3(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 3);
  return true;
}
function visit_row_3(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "h_init", (10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") < (getAttribSafe(child, "h") + 10) ? (getAttribSafe(child, "h") + 10) : getAttribSafe(node, "h") ));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  return true;
}
function visit_top_3(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 3);
  setAttribSafe(getChildByRefName(node,"child"), "canvas", top_child_canvas(getAttribSafe(getChildByRefName(node,"child"), "w"), getAttribSafe(getChildByRefName(node,"child"), "h")));
  logger.log("    top_child_canvas: " + getAttribSafe(getChildByRefName(node,"child"), "canvas"));
  logger.log("        child@w: " + getAttribSafe(getChildByRefName(node,"child"), "w"));
  logger.log("        child@h: " + getAttribSafe(getChildByRefName(node,"child"), "h"));
  return true;
}
function visit_hbox_3(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "h_init", (10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") < (10 + getAttribSafe(child, "h")) ? (10 + getAttribSafe(child, "h")) : getAttribSafe(node, "h") ));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  return true;
}
function visit_leaf_3(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 3);
  return true;
}
///// pass /////
function visit_wrapbox_4(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 4);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_listbox_4(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 4);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_vbox_4(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 4);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_rows_4(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 4);
  setAttribSafe(getChildByRefName(node,"header"), "absy", rows_header_absY(getAttribSafe(getChildByRefName(node,"header"), "rely"), getAttribSafe(node, "absy")));
  logger.log("    rows_header_absY: " + getAttribSafe(getChildByRefName(node,"header"), "absy"));
  logger.log("        header@relY: " + getAttribSafe(getChildByRefName(node,"header"), "rely"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  setAttribSafe(getChildByRefName(node,"footer"), "absy", rows_footer_absY(getAttribSafe(node, "absy"), getAttribSafe(getChildByRefName(node,"footer"), "rely")));
  logger.log("    rows_footer_absY: " + getAttribSafe(getChildByRefName(node,"footer"), "absy"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        footer@relY: " + getAttribSafe(getChildByRefName(node,"footer"), "rely"));
  
  setAttribSafe(node, "rows_absy_init", (0));
  setAttribSafe(node, "rows_absy_last", getAttribSafe(node, "rows_absy_init"));
  logger.log("      init rows@absY: " + getAttribSafe(node, "rows_absy_init"));
  logger.log("    last init rows_absy_last: " + getAttribSafe(node, "rows_absy_last"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step rows@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_textbox_4(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 4);
  return true;
}
function visit_row_4(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 4);
  setAttribSafe(node, "render", row_render(getAttribSafe(node, "w"), getInputAttribSafe(node, "borderc", '#777'), getAttribSafe(node, "canvas"), getInputAttribSafe(node, "bgc", '"transparent"'), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    row_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        borderc: " + getInputAttribSafe(node, "borderc", '#777'));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        bgc: " + getInputAttribSafe(node, "bgc", '"transparent"'));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_top_4(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 4);
  return true;
}
function visit_hbox_4(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 4);
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
    }
  })();

  return true;
}
function visit_leaf_4(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 4);
  return true;
}
///// pass /////
function visit_wrapbox_5(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 5);
  setAttribSafe(node, "render", wrapbox_render(getAttribSafe(node, "w"), getInputAttribSafe(node, "borderc", '#0000FF'), getAttribSafe(node, "canvas"), getInputAttribSafe(node, "bgc", '"transparent"'), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    wrapbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        borderc: " + getInputAttribSafe(node, "borderc", '#0000FF'));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        bgc: " + getInputAttribSafe(node, "bgc", '"transparent"'));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  setAttribSafe(node, "childs_canvas_init", (getAttribSafe(node, "render") ));
  setAttribSafe(node, "childs_canvas_last", getAttribSafe(node, "childs_canvas_init"));
  logger.log("      init childs@canvas: " + getAttribSafe(node, "childs_canvas_init"));
  logger.log("    last init childs_canvas_last: " + getAttribSafe(node, "childs_canvas_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_listbox_5(node) {
  logger.log("  visit  ListBox (id: " + node.id + "): " + 5);
  
  setAttribSafe(node, "render_init", (getAttribSafe(node, "canvas") + paintRect(getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getAttribSafe(node, "w"), getAttribSafe(node, "h"), getInputAttribSafe(node, "bgc", '"transparent"')) + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy"), getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy"), getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getInputAttribSafe(node, "borderc", '#FF00FF'))));
  setAttribSafe(node, "render", getAttribSafe(node, "render_init"));
  logger.log("      init render: " + getAttribSafe(node, "render_init"));
  logger.log("    last init render: " + getAttribSafe(node, "render"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "render", (paintLine(getAttribSafe(node, "x") + 5, getAttribSafe(child, "absy"), getAttribSafe(node, "x") + 10, getAttribSafe(child, "absy"), getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x") + 10, getAttribSafe(child, "absy"), getAttribSafe(node, "x") + 10, getAttribSafe(child, "absy") + 5, getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x") + 10, getAttribSafe(child, "absy") + 5, getAttribSafe(node, "x") + 5, getAttribSafe(child, "absy") + 5, getInputAttribSafe(node, "borderc", '#FF00FF')) + paintLine(getAttribSafe(node, "x") + 5, getAttribSafe(child, "absy") + (+ 5), getAttribSafe(node, "x") + 5, getAttribSafe(child, "absy"), getInputAttribSafe(node, "borderc", '#FF00FF'))));
      logger.log("         step render: " + getAttribSafe(node, "render"));
    }
  })();

  
  setAttribSafe(node, "childs_canvas_init", (getAttribSafe(node, "render") ));
  setAttribSafe(node, "childs_canvas_last", getAttribSafe(node, "childs_canvas_init"));
  logger.log("      init childs@canvas: " + getAttribSafe(node, "childs_canvas_init"));
  logger.log("    last init childs_canvas_last: " + getAttribSafe(node, "childs_canvas_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_vbox_5(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 5);
  setAttribSafe(node, "render", vbox_render(getAttribSafe(node, "w"), getInputAttribSafe(node, "borderc", '#00FF00'), getAttribSafe(node, "canvas"), getInputAttribSafe(node, "bgc", '"transparent"'), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    vbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        borderc: " + getInputAttribSafe(node, "borderc", '#00FF00'));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        bgc: " + getInputAttribSafe(node, "bgc", '"transparent"'));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  setAttribSafe(node, "childs_canvas_init", (getAttribSafe(node, "render") ));
  setAttribSafe(node, "childs_canvas_last", getAttribSafe(node, "childs_canvas_init"));
  logger.log("      init childs@canvas: " + getAttribSafe(node, "childs_canvas_init"));
  logger.log("    last init childs_canvas_last: " + getAttribSafe(node, "childs_canvas_last"));
    (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_rows_5(node) {
  logger.log("  visit  Rows (id: " + node.id + "): " + 5);
  
  setAttribSafe(node, "render_init", (getAttribSafe(node, "canvas") + paintRect(getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getAttribSafe(node, "w"), getAttribSafe(node, "h"), getInputAttribSafe(node, "bgc", '"transparent"')) + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy"), getInputAttribSafe(node, "borderc", '#777')) + paintLine(getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy"), getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getInputAttribSafe(node, "borderc", '#777')) + paintLine(getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getInputAttribSafe(node, "borderc", '#777')) + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(node, "h"), getAttribSafe(node, "x"), getAttribSafe(node, "absy"), getInputAttribSafe(node, "borderc", '#777')) + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(getChildByRefName(node,"header"), "rely") + getAttribSafe(getChildByRefName(node,"header"), "h") + 5, getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(getChildByRefName(node,"header"), "rely") + getAttribSafe(getChildByRefName(node,"header"), "h") + 5, getInputAttribSafe(node, "borderc", '#777'))));
  setAttribSafe(node, "render", getAttribSafe(node, "render_init"));
  logger.log("      init render: " + getAttribSafe(node, "render_init"));
  logger.log("    last init render: " + getAttribSafe(node, "render"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "render", (getAttribSafe(node, "render") + paintLine(getAttribSafe(node, "x"), getAttribSafe(node, "absy") + getAttribSafe(child, "endy"), getAttribSafe(node, "x") + getAttribSafe(node, "w"), getAttribSafe(node, "absy") + getAttribSafe(child, "endy"), getInputAttribSafe(node, "borderc", '#777'))));
      logger.log("         step render: " + getAttribSafe(node, "render"));
    }
  })();

  setAttribSafe(getChildByRefName(node,"header"), "canvas", rows_header_canvas(getAttribSafe(node, "render")));
  logger.log("    rows_header_canvas: " + getAttribSafe(getChildByRefName(node,"header"), "canvas"));
  logger.log("        render: " + getAttribSafe(node, "render"));
  
  setAttribSafe(node, "footer_canvas_init", (0));
  setAttribSafe(node, "footer_canvas_last", getAttribSafe(node, "footer_canvas_init"));
  logger.log("      init footer@canvas: " + getAttribSafe(node, "footer_canvas_init"));
  logger.log("    last init footer_canvas_last: " + getAttribSafe(node, "footer_canvas_last"));
    (function () {
    var children = getChildren(node, "rows", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(getChildByRefName(node,"footer"), "canvas", (getAttribSafe(child, "render") ));
      logger.log("         step footer@canvas: " + getAttribSafe(getChildByRefName(node,"footer"), "canvas"));
    }
  })();

  return true;
}
function visit_textbox_5(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 5);
  setAttribSafe(node, "render", textbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "rendercolor"), getAttribSafe(node, "lineheight"), getAttribSafe(node, "text"), getAttribSafe(node, "linespacing"), getAttribSafe(node, "overflow"), getAttribSafe(node, "renderfontsize"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getInputAttribSafe(node, "fontfamily", '"Arial"'), getAttribSafe(node, "x")));
  logger.log("    textbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        renderColor: " + getAttribSafe(node, "rendercolor"));
  logger.log("        lineHeight: " + getAttribSafe(node, "lineheight"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        lineSpacing: " + getAttribSafe(node, "linespacing"));
  logger.log("        overflow: " + getAttribSafe(node, "overflow"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  logger.log("        x: " + getAttribSafe(node, "x"));
  return true;
}
function visit_row_5(node) {
  logger.log("  visit  Row (id: " + node.id + "): " + 5);
  return true;
}
function visit_top_5(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 5);
  return true;
}
function visit_hbox_5(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 5);
  setAttribSafe(node, "render", hbox_render(getAttribSafe(node, "w"), getInputAttribSafe(node, "borderc", '#FF0000'), getAttribSafe(node, "canvas"), getInputAttribSafe(node, "bgc", '"transparent"'), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    hbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        borderc: " + getInputAttribSafe(node, "borderc", '#FF0000'));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        bgc: " + getInputAttribSafe(node, "bgc", '"transparent"'));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  return true;
}
function visit_leaf_5(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 5);
  setAttribSafe(node, "render", leaf_render(getAttribSafe(node, "w"), getInputAttribSafe(node, "borderc", '#000'), getAttribSafe(node, "canvas"), getInputAttribSafe(node, "bgc", '"transparent"'), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    leaf_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        borderc: " + getInputAttribSafe(node, "borderc", '#000'));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        bgc: " + getInputAttribSafe(node, "bgc", '"transparent"'));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  return true;
}
function visit_0 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_0(node);
      case "rows":
        return visit_rows_0(node);
      case "top":
        return visit_top_0(node);
      case "leaf":
        return visit_leaf_0(node);
      case "hbox":
        return visit_hbox_0(node);
      case "vbox":
        return visit_vbox_0(node);
      case "wrapbox":
        return visit_wrapbox_0(node);
      case "listbox":
        return visit_listbox_0(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_0(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_1 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_1(node);
      case "rows":
        return visit_rows_1(node);
      case "top":
        return visit_top_1(node);
      case "leaf":
        return visit_leaf_1(node);
      case "hbox":
        return visit_hbox_1(node);
      case "vbox":
        return visit_vbox_1(node);
      case "wrapbox":
        return visit_wrapbox_1(node);
      case "listbox":
        return visit_listbox_1(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_1(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_2 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_2(node);
      case "rows":
        return visit_rows_2(node);
      case "top":
        return visit_top_2(node);
      case "leaf":
        return visit_leaf_2(node);
      case "hbox":
        return visit_hbox_2(node);
      case "vbox":
        return visit_vbox_2(node);
      case "wrapbox":
        return visit_wrapbox_2(node);
      case "listbox":
        return visit_listbox_2(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_2(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_3 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_3(node);
      case "rows":
        return visit_rows_3(node);
      case "top":
        return visit_top_3(node);
      case "leaf":
        return visit_leaf_3(node);
      case "hbox":
        return visit_hbox_3(node);
      case "vbox":
        return visit_vbox_3(node);
      case "wrapbox":
        return visit_wrapbox_3(node);
      case "listbox":
        return visit_listbox_3(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_3(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_4 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_4(node);
      case "rows":
        return visit_rows_4(node);
      case "top":
        return visit_top_4(node);
      case "leaf":
        return visit_leaf_4(node);
      case "hbox":
        return visit_hbox_4(node);
      case "vbox":
        return visit_vbox_4(node);
      case "wrapbox":
        return visit_wrapbox_4(node);
      case "listbox":
        return visit_listbox_4(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_4(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_5 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "row":
        return visit_row_5(node);
      case "rows":
        return visit_rows_5(node);
      case "top":
        return visit_top_5(node);
      case "leaf":
        return visit_leaf_5(node);
      case "hbox":
        return visit_hbox_5(node);
      case "vbox":
        return visit_vbox_5(node);
      case "wrapbox":
        return visit_wrapbox_5(node);
      case "listbox":
        return visit_listbox_5(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_5(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
  synthesize(visit_1, root);
  inherit(visit_2, root);
  synthesize(visit_3, root);
  inherit(visit_4, root);
  inherit(visit_5, root);
}
