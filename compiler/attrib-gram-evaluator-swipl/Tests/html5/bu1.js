function mt () { 
  var res = new Node();
  res.tagName = "mt";
  res.y = 100; 
  return res;
}
function cons (child) { 
  var res = new Node();
  res.tagName = "cons";
  res.children.push(child);
  child.refName = "next";
  return res;
}

var tree =  cons(cons(cons(mt())));
layout(tree);
tree.x == 103;