String.__proto__.toLowerCase = function () { return this; };
function setAttribSafe (node, attrib, val) { node[attrib] = val; }
function getAttribSafe(node, attrib) { return node[attrib]; }
function getChildren(node, refName, someBool) {
  var res = [];
  for (var i = 0; i < node.children.length; i++)
    if (node.children[i].refName === refName) 
      res.push(node.children[i]);    
  return res;
} 
function getChildByRefName(node, refName) {
  for (var i = 0; i < node.children.length; i++)
    if (node.children[i].refName == refName)
      return node.children[i];
}
function Node() {
  this.nodeType = 1;
  this.children = [];
}
function inherit(v, n) {
  v(n);
  for (var i = 0; i < n.children.length; i++) inherit(v, n.children[i]);
}
function synthesize(v, n) {
  for (var i = 0; i < n.children.length; i++) synthesize(v, n.children[i]);
  v(n);
}
function buSubInorder(v, n, parent) {
  for (var i = 0; i < n.children.length; i++) buSubInorder(v, n.children[i], n);
  v(n, true, parent);
}
//===============================================
if (true) {
  logger = {log: function () {}};
} else {
  logger = {log: function (v) { java.lang.System.out.println("JS Trace: " + v); }};
}
//===============================================
//render lib
function PI () { return Math.PI; };
sin = Math.sin;
cos = Math.cos;
function paintStart(){ return 1; }
function paintRect(){ return 1; }
function paintArc(){ return 1; }