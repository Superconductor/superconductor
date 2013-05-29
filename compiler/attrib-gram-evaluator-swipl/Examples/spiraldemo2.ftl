schedule {
  "P = [(_, td, _, _, _), (_, td, _, _, _), (_, bu, _, _, _)]"
}
/*
schedule { 
  //GPU paint need to be sequential, so schedule last traversal as recursive (sequential)
  "append([X], [(_, tdLtrU, _, _, _)], P)"
}
*/

type shapeType =  None | Rect | RoundedRect | Ellipse | Edge;

interface Root { 
  input radius : int;
  input centerRadius : int;
  input centerAlpha : int;
  var render : int;
  var subtreeWeight : int;
  
  input w : int;
  input h : int;
  input bgcolor : color;
}
interface Node { 
  input open : float;
  var show : float;


  var r : int;
  var parentTotR : int;
  var alpha : int;
  var sectorAng : int;
  var maxR : int;
  var level : int;
  var siblingNum : int;
  
  var x : int;
  var y : int;
  var parentX : float;
  var parentY : float;
   
  var render : int;
  var canvas : int;
  input bgcolor : color;
  

  var rootCenterX : int;
  var rootCenterY : int;
  
  var subtreeWeight : int;
  
}


class Top : Root { 
  children { 
    child : Node;
  }
  actions {
    child.alpha := 45;
    child.maxR := radius;
    child.parentTotR := 0;
    child.sectorAng := 360;

    child.siblingNum := 1;
    child.level := 1;
    
    child.show := 1.0;
    
    child.parentX := centerRadius * cos(PI() * centerAlpha / 180);
    child.parentY := centerRadius * sin(PI() * centerAlpha / 180);
    
    child.rootCenterX := centerRadius * cos(PI() * centerAlpha / 180);
    child.rootCenterY := centerRadius * sin(PI() * centerAlpha / 180);
    
    render := child.r + paintStart(radius * 2 * cos(PI() * 45 / 180), radius * 2 * cos(PI() * 45 / 180), 0) 
              + paintRect(0, 0, w, h, bgcolor, -1) + child.siblingNum;
    child.canvas := render;
    
    subtreeWeight := child.subtreeWeight;        
  }  
}

class Radial : Node { 
  children {
    child : [ Node ];
  } 
  attributes {
    var numOpenChildren : int;
    
    var xOpen : int;
    var yOpen : int;
    var xClose : int;
    var yClose : int;    
  }
  actions {
  
    r := (maxR - parentTotR)/3 < 10 ? 10 : (maxR - parentTotR)/4;
  
    loop child {
  
      subtreeWeight := fold 1 .. $-.subtreeWeight + child$i.subtreeWeight;
  
      child.parentTotR := parentTotR + r;
  
      child.rootCenterX := rootCenterX;
      child.rootCenterY := rootCenterY;

      child.show := show * child$i.open;
    
      child.maxR := maxR;    
      
      //regular
      child.sectorAng :=  $$.numOpenChildren > 0.01 ? child$i.show * sectorAng / $$.numOpenChildren : 0;
      child.alpha := 
        fold 
           $$.numOpenChildren > 0.01?
            alpha - (sectorAng / 2) - (sectorAng/($$.numOpenChildren*2)) 
            : 0
        .. 
        $$.numOpenChildren > 0.01 ?
          child$-.alpha + child$i.show * (sectorAng/$$.numOpenChildren)
          : 0;

      child.siblingNum := fold 0 .. child$-.siblingNum + 1;
      child.level := level + 1;
      numOpenChildren := fold 0 .. $-.numOpenChildren + child$i.show;
      
      child.parentX := x;
      child.parentY := y;

      child.canvas := render;
        
    }

    render := 
      canvas +
      paintArc(rootCenterX, rootCenterY, show * (parentTotR + r), alpha, sectorAng, (show * 4 * r) / 5, bgcolor, 0);

    xOpen := parentX + r * cos(PI() * alpha / 180);
    yOpen := parentY + r * sin(PI() * alpha / 180);      
    xClose := parentX;
    yClose := parentY;
    x := show * xOpen + (1 - show) * xClose;
    y := show * yOpen + (1 - show) * yClose;
  } 
}