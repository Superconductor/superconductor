//@type action
function c_x () { return 1; }
function isInorder(node, pass) {
  switch (pass) {
    case 0:
     throw "did not expect inorder call for pass 0";
    default: throw ("unknown pass " + pass);
  }
}
///// pass /////
function visit_c_0(node) {
  logger.log("  visit  C (id: " + node.id + "): " + 0);
  setAttribSafe(node, "x", c_x());
  logger.log("    c_x: " + getAttribSafe(node, "x"));
  return true;
}
function visit_0 (node, isGlobalCall, parent) {
  if (node.nodeType == 1) {
    switch (node.tagName.toLowerCase()) {
      case "c":
        logger.log("global: " + isGlobalCall + ", parent: " + parent);
        return visit_c_0(node);
    }
  }
  if (node.nodeType == 3) { logger.log("skipping text node 2"); return; }
  throw ("unknown node type for dispatch: " + node.tagName);
}
function layout (root) {
  inherit(visit_0, root);
}
