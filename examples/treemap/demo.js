var elZoom = null;
var elData = 0;


// Replaces the canvas element with an error box
function displayError(canvas, msg) {
  var errorBox = document.createElement('div');

  // Copy the attributes of the canvas to the error box
  for(var i = 0, len = canvas.attributes.length; i < len; i++) {
    errorBox.setAttribute(canvas.attributes[i].name, canvas.attributes[i].value);
  }

  errorBox.style.fontSize = "48pt";
  errorBox.style.textAlign = "center";
  errorBox.style.color = "#CA0000";
  errorBox.style.fontWeight = "700";
  errorBox.style.textShadow = "2px 2px 1px rgba(250, 250, 250, 0.6)";
  errorBox.style.display = "-webkit-box";
  errorBox.style.webkitBoxAlign = "center";
  // errorBox.style.background = "rgba(255, 100, 110, 1)"

  var container = document.createElement('div');

  var errorText = document.createElement('div');
  errorText.innerText = "Fatal Error Starting Superconductor";
  container.appendChild(errorText);

  if(msg) {
    var errorMsg = document.createElement('div');
    errorMsg.style.fontSize = "18pt";
    errorMsg.style.fontWeight = "400";
    errorMsg.style.marginTop = "2em";
    errorMsg.innerText = msg;
    container.appendChild(errorMsg);
  }

  errorBox.appendChild(container);

  // replace element
  canvas.parentNode.replaceChild(errorBox, canvas);
}


function enableSliders(sc) {
//  document.getElementById('vert-control').className = 'vis-controls';

//  elZoom = document.getElementById("zoom-slider");

  var defMin = Math.round(sc.data.fld_iroot_minturnout.get(0) * 100);
  var defMax = Math.round(sc.data.fld_iroot_maxturnout.get(0) * 100);

//  elZoom.disabled = false;
//  elZoom.addEventListener('change', function () { onChangeZoomValue(sc); });


  elData = document.getElementById("data");
  elData.disabled = false;
  elData.addEventListener('change', function () { onDataChange(sc); });
}


function updateDisplay(sc) {
  sc.layoutAndRender();
  var ur = sc.data.fld_iroot_votesur.get(0);
  document.getElementById("count").textContent = Math.round(ur * 100);
}

function onChangeZoomValue(sc) {
  var glr = sc.glr;
//  glr.movePosition(0, 0, elZoom.value - glr.position.z);

  sc.layoutAndRender();
}

var tweener = null;


function onDataChange(sc) {
  console.log("Data switcher changed");

  if(!tweener == null) {
    clearInterval(tweener);
    tweener = null;
  }

  var tweenFunction;
  var delta = 1.0 / 20;

  if(elData.value == "suspect") {
    tweenFunction = function() {
      var next = sc.data.fld_iroot_showfraud.get(0) + delta;

      if(next < 0 || next > 1) {
        sc.data.fld_iroot_showfraud.set(0, 1.0);
        clearInterval(tweener);
        tweener = null;
      } else {
        sc.data.fld_iroot_showfraud.set(0, next);
      }

      sc.layoutAndRender();
    }

    tweener = setInterval(tweenFunction, 20);
  } else if(elData.value == "projection"){
    tweenFunction = function() {
      if(sc.data.fld_iroot_showfraud.get(0) > 0.0) {
        var nextFraud = sc.data.fld_iroot_showfraud.get(0) - (delta * 2) ;

        if(nextFraud < 0 || nextFraud > 1) {
          sc.data.fld_iroot_showfraud.set(0, 0.0);
        } else {
          sc.data.fld_iroot_showfraud.set(0, nextFraud);
        }
      } else {
        var nextProj = sc.data.fld_iroot_showprojected.get(0) + (delta * 2);

        if(nextProj < 0 || nextProj > 1) {
          sc.data.fld_iroot_showprojected.set(0, 1.0);
          clearInterval(tweener);
          tweener = null;
        } else {
          sc.data.fld_iroot_showprojected.set(0, nextProj);
        }
      }
      
      sc.layoutAndRender();
      updateDisplay(sc);
    }

    tweener = setInterval(tweenFunction, 40);
  } else if(elData.value == "normal") {
    console.log("Animating to normal data");
  }


  
}