state = {docId: 0, toggle: 0, time: 0.0, start: null, end: null, current: null}
window.addEventListener("load", mudInit, false);

function mudInit() {
  $("#canvas").click(eh);
}

function eh(event) {
  event = event || window.event;

  var canvas = $('#canvas').get(0);
  var x = event.pageX - canvas.offsetLeft;
  var y = event.pageY - canvas.offsetTop;

  var eh = dispatch(x, y, currentDOM, event.type, [currentDOM]);
  eval(eh[1])(event, eh[0]);
}

function dispatch(x, y, node, etype, acc) {
  function isIn(node, x, y) {
    return (parseFloat(node.getAttribute("x")) <= x &&
            parseFloat(node.getAttribute("y")) <= y &&
            parseFloat(node.getAttribute("x")) + parseFloat(node.getAttribute("w")) >= x &&
            parseFloat(node.getAttribute("y")) + parseFloat(node.getAttribute("h")) >= y);
  }

  for (var i = 0; i < node.children.length; i++) {
    var child = node.children[i];
    if (isIn(child, x, y)) {
      acc.push(child);
      return dispatch( x, y, child, etype, acc);
    }
  }

  var length = acc.length
  for (var i = 0; i < length; i++) {
    var target = acc.pop()
    var fun = target.getAttribute(etype);
    if(fun)
      return [target, fun];
  }
  return [node, "defaultHandler"];
}

function defaultHandler(event, node) {
    console.log("No Handler for event " + event.type + " on " + node.tagName);
}

function processClick(event, node) {
  console.log("Click on " + node.tagName.replace("USCORE", "_"));
  var root = $("#contents").children().get(state.docId);
  state.start = currentDOM

  if (state.toggle)
    state.toggle = 0
  else
    state.toggle = 1

  state.end = demux(root, state)
  animate();
}

function animate () {
  function interpolate(attrs, start, end, current, time) {
    attrs.map(function (attr) {
      var a = parseFloat(start.getAttribute(attr));
      var b = parseFloat(end.getAttribute(attr));
      if (a === 0 || a) {
        var val = a + (b - a) * time;
        current.setAttribute(attr, val);
      }
    })
    for (var i = 0; i < start.children.length; i++)
      interpolate(attrs, start.children[i], end.children[i], current.children[i], time);
  }
  function step () {
    state.time = state.time + 0.1;
    interpolate(["area"], state.start, state.end, state.current, state.time);
    draw(state.current);
    if (state.time < 0.95)
      setTimeout(step, 30);
    else
      draw(state.end);
  }

  state.current = state.start.cloneNode(true);
  state.time = 0
  setTimeout(step, 30)
}

function select0 () {return 0;}
function select1 () {return 1;}
function toggleOnClick(state) {return state.toggle;}
