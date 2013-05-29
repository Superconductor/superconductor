function leaf () { 
  var res = new Node();
  res.tagName = "leaf";
  return res;
}
function intermediate (child) { 
  var res = new Node();
  res.tagName = "intermediate";
  res.children.push(child);
  child.refName = "next";
  return res;
}
function root (child) { 
  var res = new Node();
  res.tagName = "root";
  res.children.push(child);
  child.refName = "next";
  return res;
}

var intermed = intermediate(leaf());
var tree =  root(intermed);
layout(tree);
intermed.assumed1 == (4 + 2);