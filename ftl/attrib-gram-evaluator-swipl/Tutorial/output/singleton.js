function root_render () { return paintStart() + paintOval(100, 100, 50, 50, "#FF0000"); }
///// pass /////
function visit_root_0(node) {
  logger.log("  visit  Root (id: " + node.id + "): " + 0);
  setAttribSafe(node, "render", root_render());
  logger.log("    root_render: " + getAttribSafe(node, "render"));
  return true;
}
function visit_0 (node) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "root":
        return visit_root_0(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
}
