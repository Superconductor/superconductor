function vbox_childs_x ( _ale_arg0) { return _ale_arg0 + 5; }
function vbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function vbox_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#00FF00") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#00FF00") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#00FF00") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#00FF00"); }
function vbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function leaf_w () { return 10; }
function leaf_h () { return 10; }
function leaf_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#000") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#000"); }
function leaf_textRequests () { return 0; }
function top_child_x () { return 0; }
function top_child_relY () { return 0; }
function top_child_absY () { return 0; }
function top_child_canvas ( _ale_arg0,  _ale_arg1) { return paintStart(_ale_arg0, _ale_arg1); }
function top_child_lineH ( _ale_arg0) { return _ale_arg0; }
function top_child_metrics ( _ale_arg0) { return runRequests(_ale_arg0); }
function hbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function hbox_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#FF0000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#FF0000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#FF0000") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#FF0000"); }
function hbox_childs_metrics ( _ale_arg0) { return _ale_arg0; }
function textbox_inhColor () { return "black"; }
function textbox_inhFontSize () { return 10; }
function textbox_metrics () { return 0; }
function textbox_renderFontSize ( _ale_arg1,  _ale_arg0) { return isEmptyInt(_ale_arg0) ? _ale_arg1 : valueInt(_ale_arg0); }
function textbox_renderColor ( _ale_arg0,  _ale_arg1) { return (! isEmptyColor(_ale_arg0)) ? valueColor(_ale_arg0) : _ale_arg1; }
function textbox_overflow () { return false; }
function textbox_lineSpacing ( _ale_arg0) { return _ale_arg0; }
function textbox_textRequests ( _ale_arg0,  _ale_arg2,  _ale_arg1) { return requestGlyphs(_ale_arg0, _ale_arg1, _ale_arg2, 0); }
function textbox_render ( _ale_arg5,  _ale_arg8,  _ale_arg7,  _ale_arg0,  _ale_arg9,  _ale_arg6,  _ale_arg2,  _ale_arg10,  _ale_arg4,  _ale_arg1,  _ale_arg3) { return paintParagraph(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5, _ale_arg6, _ale_arg7, _ale_arg8, _ale_arg9, _ale_arg10); }
function textbox_lineHeight ( _ale_arg0,  _ale_arg3,  _ale_arg2,  _ale_arg1) { return getLineHeight(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3); }
function textbox_maxW ( _ale_arg0,  _ale_arg3,  _ale_arg2,  _ale_arg1) { return getSumWordW(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3); }
function textbox_w ( _ale_arg0) { return _ale_arg0 > 200 ? 200 : _ale_arg0; }
function textbox_numberLines ( _ale_arg3,  _ale_arg0,  _ale_arg5,  _ale_arg4,  _ale_arg2,  _ale_arg1) { return getNumberLines(_ale_arg0, _ale_arg1, _ale_arg2, _ale_arg3, _ale_arg4, _ale_arg5); }
function textbox_h ( _ale_arg1,  _ale_arg0,  _ale_arg2) { return _ale_arg0 * (_ale_arg1 + _ale_arg2); }
///// pass /////
function visit_top_0(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 0);
  setAttribSafe(getChildByRefName(node,"child"), "rely", top_child_relY());
  logger.log("    top_child_relY: " + getAttribSafe(getChildByRefName(node,"child"), "rely"));
  setAttribSafe(getChildByRefName(node,"child"), "x", top_child_x());
  logger.log("    top_child_x: " + getAttribSafe(getChildByRefName(node,"child"), "x"));
  setAttribSafe(getChildByRefName(node,"child"), "absy", top_child_absY());
  logger.log("    top_child_absY: " + getAttribSafe(getChildByRefName(node,"child"), "absy"));
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

  return true;
}
function visit_hbox_0(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 0);
  
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
function visit_textbox_0(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 0);
  setAttribSafe(node, "inhfontsize", textbox_inhFontSize());
  logger.log("    textbox_inhFontSize: " + getAttribSafe(node, "inhfontsize"));
  setAttribSafe(node, "inhcolor", textbox_inhColor());
  logger.log("    textbox_inhColor: " + getAttribSafe(node, "inhcolor"));
  setAttribSafe(node, "overflow", textbox_overflow());
  logger.log("    textbox_overflow: " + getAttribSafe(node, "overflow"));
  setAttribSafe(node, "rendercolor", textbox_renderColor(getInputMaybeAttribSafe(node, "color"), getAttribSafe(node, "inhcolor")));
  logger.log("    textbox_renderColor: " + getAttribSafe(node, "rendercolor"));
  logger.log("        color: " + getInputMaybeAttribSafe(node, "color"));
  logger.log("        inhColor: " + getAttribSafe(node, "inhcolor"));
  setAttribSafe(node, "renderfontsize", textbox_renderFontSize(getAttribSafe(node, "inhfontsize"), getInputMaybeAttribSafe(node, "fontsize")));
  logger.log("    textbox_renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        inhFontSize: " + getAttribSafe(node, "inhfontsize"));
  logger.log("        fontSize: " + getInputMaybeAttribSafe(node, "fontsize"));
  setAttribSafe(node, "textrequests", textbox_textRequests(getAttribSafe(node, "text"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_textRequests: " + getAttribSafe(node, "textrequests"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "metrics", textbox_metrics());
  logger.log("    textbox_metrics: " + getAttribSafe(node, "metrics"));
  setAttribSafe(node, "maxw", textbox_maxW(getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_maxW: " + getAttribSafe(node, "maxw"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "w", textbox_w(getAttribSafe(node, "maxw")));
  logger.log("    textbox_w: " + getAttribSafe(node, "w"));
  logger.log("        maxW: " + getAttribSafe(node, "maxw"));
  setAttribSafe(node, "numberlines", textbox_numberLines(getAttribSafe(node, "w"), getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "overflow"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_numberLines: " + getAttribSafe(node, "numberlines"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        overflow: " + getAttribSafe(node, "overflow"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "lineheight", textbox_lineHeight(getAttribSafe(node, "text"), getAttribSafe(node, "metrics"), getAttribSafe(node, "renderfontsize"), getInputAttribSafe(node, "fontfamily", '"Arial"')));
  logger.log("    textbox_lineHeight: " + getAttribSafe(node, "lineheight"));
  logger.log("        text: " + getAttribSafe(node, "text"));
  logger.log("        metrics: " + getAttribSafe(node, "metrics"));
  logger.log("        renderFontSize: " + getAttribSafe(node, "renderfontsize"));
  logger.log("        fontFamily: " + getInputAttribSafe(node, "fontfamily", '"Arial"'));
  setAttribSafe(node, "linespacing", textbox_lineSpacing(getAttribSafe(node, "lineheight")));
  logger.log("    textbox_lineSpacing: " + getAttribSafe(node, "linespacing"));
  logger.log("        lineHeight: " + getAttribSafe(node, "lineheight"));
  setAttribSafe(node, "h", textbox_h(getAttribSafe(node, "lineheight"), getAttribSafe(node, "numberlines"), getAttribSafe(node, "linespacing")));
  logger.log("    textbox_h: " + getAttribSafe(node, "h"));
  logger.log("        lineHeight: " + getAttribSafe(node, "lineheight"));
  logger.log("        numberLines: " + getAttribSafe(node, "numberlines"));
  logger.log("        lineSpacing: " + getAttribSafe(node, "linespacing"));
  return true;
}
function visit_leaf_0(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 0);
  setAttribSafe(node, "h", leaf_h());
  logger.log("    leaf_h: " + getAttribSafe(node, "h"));
  setAttribSafe(node, "textrequests", leaf_textRequests());
  logger.log("    leaf_textRequests: " + getAttribSafe(node, "textrequests"));
  setAttribSafe(node, "w", leaf_w());
  logger.log("    leaf_w: " + getAttribSafe(node, "w"));
  return true;
}
///// pass /////
function visit_top_1(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 1);
  setAttribSafe(getChildByRefName(node,"child"), "metrics", top_child_metrics(getAttribSafe(getChildByRefName(node,"child"), "textrequests")));
  logger.log("    top_child_metrics: " + getAttribSafe(getChildByRefName(node,"child"), "metrics"));
  logger.log("        child@textRequests: " + getAttribSafe(getChildByRefName(node,"child"), "textrequests"));
  setAttribSafe(getChildByRefName(node,"child"), "canvas", top_child_canvas(getAttribSafe(getChildByRefName(node,"child"), "w"), getAttribSafe(getChildByRefName(node,"child"), "h")));
  logger.log("    top_child_canvas: " + getAttribSafe(getChildByRefName(node,"child"), "canvas"));
  logger.log("        child@w: " + getAttribSafe(getChildByRefName(node,"child"), "w"));
  logger.log("        child@h: " + getAttribSafe(getChildByRefName(node,"child"), "h"));
  setAttribSafe(getChildByRefName(node,"child"), "lineh", top_child_lineH(getAttribSafe(getChildByRefName(node,"child"), "h")));
  logger.log("    top_child_lineH: " + getAttribSafe(getChildByRefName(node,"child"), "lineh"));
  logger.log("        child@h: " + getAttribSafe(getChildByRefName(node,"child"), "h"));
  return true;
}
function visit_vbox_1(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 1);
  
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
function visit_hbox_1(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 1);
  
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
function visit_textbox_1(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 1);
  return true;
}
function visit_leaf_1(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 1);
  return true;
}
///// pass /////
function visit_top_2(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 2);
  return true;
}
function visit_vbox_2(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 2);
  setAttribSafe(node, "render", vbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    vbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(node, "x") + 5));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", true);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "absy", (getAttribSafe(node, "absy") + getAttribSafe(child, "rely") ));
      logger.log("         step childs@absY: " + getAttribSafe(child, "absy"));
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
function visit_hbox_2(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 2);
  setAttribSafe(node, "render", hbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    hbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
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
function visit_textbox_2(node) {
  logger.log("  visit  TextBox (id: " + node.id + "): " + 2);
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
function visit_leaf_2(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 2);
  setAttribSafe(node, "render", leaf_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    leaf_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  return true;
}
function visit_0 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "top":
        return visit_top_0(node);
      case "leaf":
        return visit_leaf_0(node);
      case "hbox":
        return visit_hbox_0(node);
      case "vbox":
        return visit_vbox_0(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_0(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_1 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "top":
        return visit_top_1(node);
      case "leaf":
        return visit_leaf_1(node);
      case "hbox":
        return visit_hbox_1(node);
      case "vbox":
        return visit_vbox_1(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_1(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_2 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "top":
        return visit_top_2(node);
      case "leaf":
        return visit_leaf_2(node);
      case "hbox":
        return visit_hbox_2(node);
      case "vbox":
        return visit_vbox_2(node);
    }
  }
  if (node.nodeType == 3) return visit_textbox_2(node);
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
  synthesize(visit_1, root);
  inherit(visit_2, root);
}
