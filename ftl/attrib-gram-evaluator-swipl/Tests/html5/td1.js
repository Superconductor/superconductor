function mt () { 
  var res = new Node();
  res.tagName = "mt";
  return res;
}
function cons (child) { 
  var res = new Node();
  res.tagName = "cons";
  res.children.push(child);
  child.refName = "next";
  return res;
}
function start (child) { 
  var res = new Node();
  res.tagName = "start";
  res.children.push(child);
  child.refName = "next";
  res.x = 100;
  return res;
}

var end = mt();
var tree =  start(cons(cons(cons(end))));
layout(tree);
end.y == 103;