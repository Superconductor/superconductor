function leaf () { 
  var res = new Node();
  res.tagName = "leaf";
  return res;
}
function intermediate (left, right) { 
  var res = new Node();
  res.tagName = "intermediate";
  res.children.push(left);
  res.children.push(right);
  left.refName = "left";
  right.refName = "right";
  return res;
}
function root (child) { 
  var res = new Node();
  res.tagName = "root";
  res.children.push(child);
  child.refName = "tree";
  return res;
}

var tree = 
  root(
    intermediate(
      intermediate(
        intermediate(leaf(), leaf()), 
        intermediate(leaf(), leaf())),
      intermediate(leaf(), leaf())));
layout(tree);
var numNodes = tree.result1 == 11;
var check2 = tree.result2 == 19;
numNodes && check2;
//[numNodes, tree.result2];
