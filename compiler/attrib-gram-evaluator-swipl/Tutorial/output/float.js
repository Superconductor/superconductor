function vbox_childs_x ( _ale_arg0) { return _ale_arg0 + 5; }
function vbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function vbox_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#00FF00") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#00FF00") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#00FF00") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#00FF00"); }
function leaf_w () { return 10; }
function leaf_h () { return 10; }
function leaf_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#000") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#000"); }
function top_child_x () { return 0; }
function top_child_relY () { return 0; }
function top_child_absY () { return 0; }
function top_child_canvas ( _ale_arg0,  _ale_arg1) { return paintStart(_ale_arg0, _ale_arg1); }
function top_child_lineH ( _ale_arg0) { return _ale_arg0; }
function hbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function hbox_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#FF0000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#FF0000") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#FF0000") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#FF0000"); }
function wrapbox_w ( _ale_arg0) { return _ale_arg0; }
function wrapbox_childs_absY ( _ale_arg0,  _ale_arg1) { return _ale_arg0 + _ale_arg1; }
function wrapbox_render ( _ale_arg3,  _ale_arg0,  _ale_arg2,  _ale_arg4,  _ale_arg1) { return _ale_arg0 + paintLine(_ale_arg1, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2, "#0000FF") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2, _ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, "#0000FF") + paintLine(_ale_arg1 + _ale_arg3, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2 + _ale_arg4, "#0000FF") + paintLine(_ale_arg1, _ale_arg2 + _ale_arg4, _ale_arg1, _ale_arg2, "#0000FF"); }
///// pass /////
function visit_top_0(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 0);
  setAttribSafe(getChildByRefName(node,"child"), "absy", top_child_absY());
  logger.log("    top_child_absY: " + getAttribSafe(getChildByRefName(node,"child"), "absy"));
  setAttribSafe(getChildByRefName(node,"child"), "rely", top_child_relY());
  logger.log("    top_child_relY: " + getAttribSafe(getChildByRefName(node,"child"), "rely"));
  setAttribSafe(getChildByRefName(node,"child"), "x", top_child_x());
  logger.log("    top_child_x: " + getAttribSafe(getChildByRefName(node,"child"), "x"));
  return true;
}
function visit_hbox_0(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 0);
  
  setAttribSafe(node, "numchilds_init", (0));
  setAttribSafe(node, "numchilds", getAttribSafe(node, "numchilds_init"));
  logger.log("      init numChilds: " + getAttribSafe(node, "numchilds_init"));
  logger.log("    last init numchilds: " + getAttribSafe(node, "numchilds"));
    (function () {
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "lineh", (0));
      logger.log("         step childs@lineH: " + getAttribSafe(child, "lineh"));
    }
  })();

  return true;
}
function visit_wrapbox_0(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 0);
  setAttribSafe(node, "w", wrapbox_w(getInputAttribSafe(node, "width", '100')));
  logger.log("    wrapbox_w: " + getAttribSafe(node, "w"));
  logger.log("        width: " + getInputAttribSafe(node, "width", '100'));
  return true;
}
function visit_vbox_0(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 0);
  
  setAttribSafe(node, "numchilds_init", (0));
  setAttribSafe(node, "numchilds", getAttribSafe(node, "numchilds_init"));
  logger.log("      init numChilds: " + getAttribSafe(node, "numchilds_init"));
  logger.log("    last init numchilds: " + getAttribSafe(node, "numchilds"));
    (function () {
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
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
  return true;
}
///// pass /////
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") + getAttribSafe(child, "w") + 5));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

  return true;
}
function visit_wrapbox_1(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 1);
  return true;
}
function visit_vbox_1(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 1);
  
  setAttribSafe(node, "w_init", (10));
  setAttribSafe(node, "w", getAttribSafe(node, "w_init"));
  logger.log("      init w: " + getAttribSafe(node, "w_init"));
  logger.log("    last init w: " + getAttribSafe(node, "w"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "w", (getAttribSafe(node, "w") < (10 + getAttribSafe(child, "w")) ? (10 + getAttribSafe(child, "w")) : getAttribSafe(node, "w") ));
      logger.log("         step w: " + getAttribSafe(node, "w"));
    }
  })();

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
function visit_hbox_2(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 2);
  
  setAttribSafe(node, "childs_x_init", (getAttribSafe(node, "x") ));
  setAttribSafe(node, "childs_x_last", getAttribSafe(node, "childs_x_init"));
  logger.log("      init childs@x: " + getAttribSafe(node, "childs_x_init"));
  logger.log("    last init childs_x_last: " + getAttribSafe(node, "childs_x_last"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_wrapbox_2(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 2);
  
  setAttribSafe(node, "childs_x_init", (getAttribSafe(node, "x") ));
  setAttribSafe(node, "childs_x_last", getAttribSafe(node, "childs_x_init"));
  logger.log("      init childs@x: " + getAttribSafe(node, "childs_x_init"));
  logger.log("    last init childs_x_last: " + getAttribSafe(node, "childs_x_last"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5 + getAttribSafe(child, "w") >= (getAttribSafe(node, "x") + getAttribSafe(node, "w")) ? (getAttribSafe(node, "x") + 5) : (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_x_init") : ("x")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_w_init") : ("w")) + 5)));
      logger.log("         step childs@x: " + getAttribSafe(child, "x"));
    }
  })();

  return true;
}
function visit_vbox_2(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 2);
  
  (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "x", (getAttribSafe(node, "x") + 5));
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
function visit_top_3(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 3);
  setAttribSafe(getChildByRefName(node,"child"), "lineh", top_child_lineH(getAttribSafe(getChildByRefName(node,"child"), "h")));
  logger.log("    top_child_lineH: " + getAttribSafe(getChildByRefName(node,"child"), "lineh"));
  logger.log("        child@h: " + getAttribSafe(getChildByRefName(node,"child"), "h"));
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(node, "h") < (10 + getAttribSafe(child, "h")) ? (10 + getAttribSafe(child, "h")) : getAttribSafe(node, "h") ));
      logger.log("         step h: " + getAttribSafe(node, "h"));
    }
  })();

  return true;
}
function visit_wrapbox_3(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 3);
  
  setAttribSafe(node, "childs_lineh_init", (0));
  setAttribSafe(node, "childs_lineh_last", getAttribSafe(node, "childs_lineh_init"));
  logger.log("      init childs@lineH: " + getAttribSafe(node, "childs_lineh_init"));
  logger.log("    last init childs_lineh_last: " + getAttribSafe(node, "childs_lineh_last"));
    (function () {
    var children = getChildren(node, "childs", false);
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
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_rely_init") : ("rely")) + (getAttribSafe(child, "x") == getAttribSafe(node, "x") + 5 ? getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_lineh_init") : ("lineh")) + 5 : 0)));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  
  setAttribSafe(node, "h_init", (10));
  setAttribSafe(node, "h", getAttribSafe(node, "h_init"));
  logger.log("      init h: " + getAttribSafe(node, "h_init"));
  logger.log("    last init h: " + getAttribSafe(node, "h"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "h", (getAttribSafe(child, "rely") + getAttribSafe(child, "lineh") + 5));
      logger.log("         step h: " + getAttribSafe(node, "h"));
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
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "rely", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_rely_init") : ("rely")) + getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_h_init") : ("h")) + 5));
      logger.log("         step childs@relY: " + getAttribSafe(child, "rely"));
    }
  })();

  return true;
}
function visit_leaf_3(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 3);
  return true;
}
///// pass /////
function visit_top_4(node) {
  logger.log("  visit  Top (id: " + node.id + "): " + 4);
  return true;
}
function visit_hbox_4(node) {
  logger.log("  visit  HBox (id: " + node.id + "): " + 4);
  setAttribSafe(node, "render", hbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    hbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_wrapbox_4(node) {
  logger.log("  visit  WrapBox (id: " + node.id + "): " + 4);
  setAttribSafe(node, "render", wrapbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    wrapbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_vbox_4(node) {
  logger.log("  visit  VBox (id: " + node.id + "): " + 4);
  setAttribSafe(node, "render", vbox_render(getAttribSafe(node, "w"), getAttribSafe(node, "canvas"), getAttribSafe(node, "absy"), getAttribSafe(node, "h"), getAttribSafe(node, "x")));
  logger.log("    vbox_render: " + getAttribSafe(node, "render"));
  logger.log("        w: " + getAttribSafe(node, "w"));
  logger.log("        canvas: " + getAttribSafe(node, "canvas"));
  logger.log("        absY: " + getAttribSafe(node, "absy"));
  logger.log("        h: " + getAttribSafe(node, "h"));
  logger.log("        x: " + getAttribSafe(node, "x"));
  
  (function () {
    var children = getChildren(node, "childs", false);
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
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "canvas", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_canvas_init") : ("canvas")) ));
      logger.log("         step childs@canvas: " + getAttribSafe(child, "canvas"));
    }
  })();

  return true;
}
function visit_leaf_4(node) {
  logger.log("  visit  Leaf (id: " + node.id + "): " + 4);
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
      case "wrapbox":
        return visit_wrapbox_0(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
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
      case "wrapbox":
        return visit_wrapbox_1(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
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
      case "wrapbox":
        return visit_wrapbox_2(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_3 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
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
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function visit_4 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
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
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
  synthesize(visit_1, root);
  inherit(visit_2, root);
  synthesize(visit_3, root);
  inherit(visit_4, root);
}
