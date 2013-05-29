function top (child) { 
  var res = new Node();
  res.tagName = "top";
  res.children.push(child);
  child.refName = "child";
  res.radius = 10;
  res.centerradius = 10;
  res.centeralpha = 10;
  res.w = 100;
  res.h = 100;
  res.bgcolor = 100;
  return res;
}
function radial (/*children*/) { 
  var res = new Node();
  res.tagName = "radial";
  for (var i = 0; i < arguments.length; i++) {
    arguments[i].refName = "child";
    res.children.push(arguments[i]);
  }
  res.open = 1;
  return res;
}


var l = radial();
var tree = 
  top(
    radial(
      radial(l),
      radial(radial())));
layout(tree);

l.level == 3;