function l () { 
  var res = new Node();
  res.tagName = "l";
  return res;
}
function n (/*children*/) { 
  var res = new Node();
  res.tagName = "n";
  for (var i = 0; i < arguments.length; i++) {
    res.children.push(arguments[i]);
    arguments[i].refName = "childs";
  }
  return res;
}

var tree = n(l(), l(), l());
tree.st = 100;
layout(tree);
tree.z == 820
/*
i: 101
j: 102
i: 204
j: 205
i: 410
j: 411
z: 820
*/