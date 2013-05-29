function root_size ( _ale_arg0) { return 50 / _ale_arg0; }
///// pass /////
function visit_root_0(node) {
  logger.log("  visit  Root (id: " + node.id + "): " + 0);
  
  setAttribSafe(node, "childs_which_init", (0));
  setAttribSafe(node, "childs_which_last", getAttribSafe(node, "childs_which_init"));
  logger.log("      init childs@which: " + getAttribSafe(node, "childs_which_init"));
  logger.log("    last init childs_which_last: " + getAttribSafe(node, "childs_which_last"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(child, "which", (getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? ("childs_which_init") : ("which")) + 1));
      logger.log("         step childs@which: " + getAttribSafe(child, "which"));
      if (i + 1 == children.length) {
        setAttribSafe(node, "childs_which_last", getAttribSafe(child, "which"));
        logger.log("    childs@which: " + getAttribSafe(node, "childs_which_last"));
      }
    }
  })();

  
  (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "size", (50 / getAttribSafe(node, "childs_which_last") ));
      logger.log("         step size: " + getAttribSafe(node, "size"));
    }
  })();

  
  setAttribSafe(node, "render_init", (paintStart() + paintOval(100, 100, 50, 50, "#FF0000")));
  setAttribSafe(node, "render", getAttribSafe(node, "render_init"));
  logger.log("      init render: " + getAttribSafe(node, "render_init"));
  logger.log("    last init render: " + getAttribSafe(node, "render"));
    (function () {
    var children = getChildren(node, "childs", false);
    for (var i = 0; i < children.length; i++) {
      var child = children[i]; 
      setAttribSafe(node, "render", (paintOval((100 - 50 / 25) + (getAttribSafe(node, "which") + 1) * getAttribSafe(node, "size"), 100, getAttribSafe(node, "size"), getAttribSafe(node, "size"), "#777")));
      logger.log("         step render: " + getAttribSafe(node, "render"));
    }
  })();

  return true;
}
function visit_leaf1_0(node) {
  logger.log("  visit  Leaf1 (id: " + node.id + "): " + 0);
  return true;
}
function visit_0 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "root":
        return visit_root_0(node);
      case "leaf1":
        return visit_leaf1_0(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
}
