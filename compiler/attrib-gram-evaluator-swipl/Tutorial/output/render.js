if (false) logger = {log: function () {}, group: function (){}, groupEnd: function(){}, error: function() {} };
else logger = console;
currentDOM = null;

function getAttribSafe(node, attrib) {
  if (node.nodeType == 1) {
    var a = node.getAttribute(attrib);
    var n = parseFloat(a);
    if (isNaN(n)) {
      if (a == "true") return true;
      else if (a == "false") return false;
      else return a;
    } else {
      return n;
    }
    return isNaN(n) ? a : n;
  } else if (node.nodeType == 3) {
    switch (attrib) {
      case "text": return node.nodeValue;
      case "fontfamily": return node.fontfamily ? node.fontfamily : "Verdana";
      case "fontsize": return node.fontsize ? node.fontsize : 20;
      default:
        var a = node[attrib];
        var n = parseFloat(a);
        return isNaN(n) ? a : n;
    }
  }
}
function getInputAttribSafe(node, attrib, def) {
  if (node.nodeType == 1) {
    var a = node.hasAttribute(attrib) ? node.getAttribute(attrib) : def;
    var n = parseFloat(a);
    return isNaN(n) ? a : n;
  } else if (node.nodeType == 3) {  
    if (node[attrib] === undefined) {
      var a = def;
      var n = parseFloat(a);
      return isNaN(n) ? a : n;
    }
    switch (attrib) {
      case "text": return node.nodeValue;
      case "fontfamily": return node.fontfamily ? node.fontfamily : "Verdana";
      case "fontsize": return node.fontsize ? node.fontsize : 20;
      default:
        var a = node[attrib];
        var n = parseFloat(a);
        return isNaN(n) ? a : n;
    }
  }
}

function getInputMaybeAttribSafe(node, attrib) {
  var res;
  var a;
  var n;
  if (node.nodeType == 1) {
    a = node.hasAttribute(attrib) ? node.getAttribute(attrib) : undefined;
    n = parseFloat(a);
    res = isNaN(n) ? a : n;
  } else if (node.nodeType == 3) {  
    if (node[attrib] === undefined) {
      res = undefined;
    } else {
      switch (attrib) {
        case "text": res = node.nodeValue; break;
        default:
          a = node[attrib];
          n = parseFloat(a);
          res = isNaN(n) ? a : n;
      }
    }
  }
  var newRes;
  if (res === undefined) newRes = [true, undefined];
  else newRes = [false, res];
  return newRes;
}

function setAttribSafe(node, attrib, val) {
  if (node.nodeType == 1) {
    return node.setAttribute(attrib, val);
  } else if (node.nodeType == 3) {
    return node[attrib] = val;
  }
}


/*
function getChildByRefName (node, refName, includeText) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (includeText && child.nodeType == 3) { //text
      return child;
    } else if (child.nodeType == 1 && child.getAttribute("refName") == refName)
      return child;
  }
  throw ("child not found: (" + node.tagName + ", " + node.getAttribute("refName") + ") child (" + refName + ")");
}
*/
function getChildByRefName (node, refName) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (child.nodeType == 1 && child.getAttribute("refName") == refName)
      return child;
  }
  var seen = "seen: ";
  for (var i = 0; i < node.childNodes.length; i++) {
    seen += "(" + node.childNodes[i].nodeType + ":" + (node.childNodes[i].getAttribute ? node.childNodes[i].getAttribute("refName") : "nof") + ") ";
  }  
  throw ("child not found: node(" + node.tagName + ", " + node.getAttribute("refName") + ") goal child (" + refName + ") -- " + seen);
}

function getChildren(node, refName, includeText) {
  var notWhitespace = /\S/;
  var res = [];
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (includeText && child.nodeType == 3) { //text
      if (child.nodeValue.length && notWhitespace.test(child.nodeValue) ) res.push(child);
    } else if (child.nodeType == 1 && child.getAttribute("refName") == refName) {
      res.push(child);
    }
  }
  return res;  
}

function isEmptyFtl (m) { return m[0]; }
var isEmptyInt = isEmptyFtl;
var isEmptyBool = isEmptyFtl;
var isEmptyFloat = isEmptyFtl;
var isEmptyColor = isEmptyFtl;
var isEmptyString = isEmptyFtl;

function valueFtl (m) { return m[1]; }
var valueInt = valueFtl;
var valueBool = valueFtl;
var valueFloat = valueFtl;
var valueColor = valueFtl;
var valueString = valueFtl;


function inherit(visit, node) {
  visit(node);
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (child.nodeType == 1 || child.nodeType == 3) inherit(visit, child);
  }
}
function synthesize(visit, node) {
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (child.nodeType == 1 || child.nodeType == 3) synthesize(visit, node.childNodes[i]);
  }
  visit(node);
}

function render (node, ctx) {
  if (node.nodeType == 1) {
    logger.log(node.tagName + " " + node.id + "::" + node.getAttribute("w") + " x " + node.getAttribute("h") + ": " + node.getAttribute("x") + ", " + node.getAttribute("y"));
  }
  
  var x = getAttribSafe(node, "x");
  var y = getAttribSafe(node, "y");
  var w = getAttribSafe(node, "w");
  var h = getAttribSafe(node, "h");

  if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;

  var bgc = getAttribSafe(node, "bgcolor");
  var hasStyle =  bgc && bgc.length > 0;
  if (!hasStyle) bgc = getAttribSafe(node, "backgroundcolor");
  hasStyle =  bgc && bgc.length > 0;

  if (hasStyle) {
      ctx.save();
      ctx.fillStyle = bgc;
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
  } else {
      if (node.nodeType == 1) {
        var x1 = Math.round(x) + 0.5
        var y1 = Math.round(y) + 0.5
        var w1 = Math.round(w)
        var h1 = Math.round(h)
        ctx.strokeRect(x1, y1, w1, h1);
      }
  }

  var text = getAttribSafe(node, "text");
  if (text) {
    var m = ctx.measureText(text);
    ctx.fillText(text, x + w / 2, y + h / 2);
  }

  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    if (child.nodeType == 1 || child.nodeType == 3)
      render(node.childNodes[i], ctx);
  }
}

function init () {
  displayDoc(0);
}

function displayDoc (docId) {
  logger.log("Displaying doc " + docId);
  var body = $("#contents").get()[0];
  body.style.display = "none";
  var root = body.children[docId];
  draw(demux(root, state));
}


var ctx = null;
var canvas = null;
var paintStarted = false;
//unnecessary in JS
function paintStart(w, h) { 
  if (!w || !h) {
    w = 1000;
    h = 1000;
  }
  paintStarted = true; //can ignore normal rendering calls now..
  canvas.width = w;
  canvas.height = h;
  return 1;
}
function paintDone() { return 1;}
function initFonts () { return 1; }
function runRequests () { return 1; }
function requestGlyphs () { return 1; }

///////////////////////////

function cnv(degRaw) {
  var deg = Math.PI * degRaw / 180.0;
  return deg;
//  if (deg < 0) return deg + 2 * Math.PI;
//  else if (deg > 2 * Math.PI) return deg - 2 * Math.PI;
//  else return deg;
}


function cnv1(degRaw1, degRaw2) {
  return cnv(degRaw1);
  var deg1 = cnv(degRaw1);
  var deg2 = cnv(degRaw2);
  return Math.min(deg1, deg2);
}

function cnv2(degRaw1, degRaw2) {
  return cnv(degRaw2);
  var deg1 = cnv(degRaw1);
  var deg2 = cnv(degRaw2);
  return Math.max(deg1,deg2);
}


function paintArc (x, y, r, alpha, sectorAng, w, bgc, skip) {

//  var alpha = (start + end)/2;
//  var sectorAng = (end - start);
  var start = alpha - sectorAng / 2;
  var end = alpha + sectorAng / 2;
  
  ctx.save();
    try {            

      ctx.fillStyle = bgc;
      ctx.beginPath();

            ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      
      if (sectorAng == 360) {
        paintArc (x, y, r, 0, 180, w, bgc, true);
        paintArc (x, y, r, 180, 180, w, bgc, true);
      } else {        
        ctx.arc(x, y, r, cnv1(start, end), cnv2(start,end), false);
        ctx.lineTo(x + (r - w) * Math.cos(cnv(end)), y + (r - w) * Math.sin(cnv(end)));
        ctx.arc(x, y, r - w, cnv2(start, end), cnv1(start,end), true);        
        ctx.lineTo(x + r * Math.cos(cnv(start)), y + r * Math.sin(cnv(start)));
        if (!skip) ctx.stroke();
      }
    
      
      
      ctx.closePath();
      ctx.fill();
 
    } catch (e) {
      console.log(["bad ellipse: ", x, y, r, start, end, false, w, bgc, e]);
    }

  ctx.restore();

  return 1;
}

function paintLine (x, y, w, h, bgc) {
  if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;
  if (x == "NaN" || y == "NaN" || w == "NaN" || h == "NaN") return;

  ctx.save();
    try {
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(w,h);
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = bgc;
      ctx.stroke();
    } catch (e) {
      console.log(["bad edge: ", x, y, w, h]);
    }
  ctx.restore();

  return 1;
}

function paintOval (x, y, w, h, bgc, ignore) {

  if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;
  if (x == "NaN" || y == "NaN" || w == "NaN" || h == "NaN") return;

  ctx.save();
    try {
      ctx.beginPath();
      ctx.translate(canvas.width/2, canvas.height/2);
//      ctx.scale(1, (h+0.0)/(w+0.0));
      ctx.arc(x - canvas.width/2, y - canvas.height/2, w, 0, Math.PI*2, false);
      ctx.fillStyle = bgc;
//      ctx.fill(x, y, w, h);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    } catch (e) {
      console.log(["bad ellipse: ", x, y, w, h]);
    }

  ctx.restore();

  return 1;
}

//stroke
function paintRect (x, y, w, h, bgc) {

  if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;
  if (x == "NaN" || y == "NaN" || w == "NaN" || h == "NaN") return;

  ctx.save();
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;  
    var hasStyle =  bgc && bgc.length > 0;
    ctx.lineWidth = 2;
    if (hasStyle) {
      ctx.fillStyle = bgc;
      if (bgc != "#00000000" && bgc != "transparent" && bgc != '"transparent"') ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.strokeRect(x, y, w, h);
    }
  
  ctx.restore();

  return 1;
}


///////////////////////////
//old paint
function paint (shape, x, y, w, h, bgc) {

  if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;
  if (x == "NaN" || y == "NaN" || w == "NaN" || h == "NaN") return;

  logger.log(["special paint!", shape, x, y, w, h, bgc]);
  
  ctx.save();
  if  (shape == "rect") {
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) return;  
    var hasStyle =  bgc && bgc.length > 0;
    ctx.lineWidth = 2;
    if (hasStyle) {
      ctx.fillStyle = bgc;
      if (bgc != "#00000000") ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    } else {
      ctx.strokeRect(x, y, w, h);
    }
  } else if (shape == "ellipse") {
    try {
      ctx.beginPath();
      ctx.translate(canvas.width/2, canvas.height/2);
//      ctx.scale(1, (h+0.0)/(w+0.0));
      ctx.arc(x - canvas.width/2, y - canvas.height/2, w, 0, Math.PI*2, false);
      ctx.fillStyle = bgc;
      ctx.fill(x, y, w, h);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    } catch (e) {
      console.log(["bad ellipse: ", x, y, w, h]);
    }
      
  } else if (shape == "edge") {
    try {
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(w,h);
      ctx.closePath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctx.stroke();
    } catch (e) {
      console.log(["bad edge: ", x, y, w, h]);
    }
  }
  ctx.restore();

  return 1;
}
////////////////////////
function paintParagraph (text, font, fontSize, x, y, maxWidth, allowOverflow, lineHeight, color, lineSpacing) {
  if (!text || text.trim().length == 0) return;
  
  if (color && color.length > 0) ctx.fillStyle = color;
  ctx.font = (fontSize ? fontSize : 20) + "px " + (font ? font + " " : "");
  var rx = 0;
  var ry = lineHeight; //baseline?
  var space = ctx.measureText(" ").width;
  var lines = ("" + text).trim().split("\n");
  for (var l = 0; l < lines.length; l++) {
    if (rx) { //clear previous line
      rx = 0;
      ry += lineHeight + lineSpacing;
    }
    var words = lines[l].trim().split(" ");
    for (var w = 0; w < words.length; w++) {
      var ww = ctx.measureText(words[w].trim()).width;
      if (maxWidth && rx && ((rx + space + ww) > maxWidth)) {
        ry += lineHeight + lineSpacing;
        ctx.fillText(words[w].trim(), x, y + ry);
        rx = ww;
      } else {
        ctx.fillText((rx ? " " : "") + words[w].trim(), x + rx, y + ry);
        rx += (rx ? space : 0) + ww;
      }
    }
    
  }
}
function getSumWordW (text, font, fontSize) { 
    ctx.font = (fontSize ? fontSize : 20) + "px " + (font ? font + " " : "");

    var lines = ("" + text).trim().split("\n");
    var max = 0;
    for (var n = 0; n < lines.length; n++) {
      var line = ctx.measureText(lines[n].trim()).width;
      if (line > max) max = line;
    }
    return max;
}
function getMaxWordW (text) { 
    ctx.font = (fontSize ? fontSize : 20) + "px " + (font ? font + " " : "");

    var lines = ("" + text).trim().split("\n");
    var max = 0;
    for (var n = 0; n < lines.length; n++) {
      var words = lines[n].split(" ");
      for (var i = 0; i < words.length; i++) {
        var word = ctx.measureText(words[i].trim()).width;      
        if (word > max) max = word;
      }
    }
    return max;
}
function getLineHeight (text, font, fontSize) { 
  ctx.font = (fontSize ? fontSize : 20) + "px " + (font ? font + " " : "");

  return ctx.measureText("m").width; //OMG seriously?
}
function getNumberLines(text, _, _, maxWidth) {
    logger.log("Text: " + text);
    var returns = ("" + text).trim().split("\n");    
    var lines = [];
    var lastPhrase = "";
    function splitWord() {
        var width = ctx.measureText(lastPhrase).width;
        var posA = 0;
        var posZ = 0;
        if (width > maxWidth) {
            for (var n = 0, length = lastPhrase.length; n < length; n ++) {
                var width = ctx.measureText(lastPhrase.substr(posA, posZ ++)).width;
                if (maxWidth && width > maxWidth) {
                    lines.push(lastPhrase.substr(posA, posZ - 2));
                    posA = n - 1;
                    posZ = 2;
                }
            }
            return lastPhrase.substr(posA, posZ + 2);
        }
    };
    for (var n = 0; n < returns.length; n++) {
        if (lastPhrase) lines.push(lastPhrase);
        var phrase = returns[n];
        var spaces = phrase.split(" ");
        var lastPhrase = "";
        for (var i = 0; i < spaces.length; i++) {
            var measure = ctx.measureText(lastPhrase + " " + spaces[i]).width;
            if (!maxWidth || measure < maxWidth) {
                lastPhrase += ((lastPhrase ? " " : "") + spaces[i]);
            } else {
                if (measure > maxWidth) {
                    var split = splitWord();
                    if (split) {
                        lastPhrase = split + " " + spaces[i];
                    } else {
                        lines.push(lastPhrase);
                        lastPhrase = spaces[i];
                    }
                }
            }
            if (i == spaces.length - 1) {
                lines.push(lastPhrase);
                lastPhrase = "";
                break;
            }
        }
    }
    if (lines.length == 1) {
      return (ctx.measureText("" + lines[0]).width == 0) ? 0 : 1;
    } else return lines.length;
};

function sin (x) {
  return Math.sin(x);
}

function cos (x) {
  return Math.cos(x);
}

function PI() {
  return Math.PI;
}

function pow(x,y) {
  return Math.pow(x,y);
}

function draw (root) {
  currentDOM = root;
  canvas = $('#canvas').get(0);
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  root.style.display = "none";
  layout(root);
  
  if (!paintStarted) { //if layout didn't do its own paint calls
    canvas.width = parseFloat(root.getAttribute("w") + 1);
    canvas.height = parseFloat(root.getAttribute("h") + 1);
    render(root, ctx);  
  }
}

function demux(node, state) {
  if (node.nodeName == "MUX") {
    var fun = node.getAttribute("selector");
    if (fun) {
      var i = eval(fun);
      return demux(node.childNodes[i], state);
    } else {
      console.log("No Selector for Mux!");
      return demux(node.childNodes[0], state);
    }
  } else {
    var res = node.cloneNode(false);
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      res.appendChild(demux(child, state));
    }
    return res;
  }
}

window.addEventListener("load", init, false);
