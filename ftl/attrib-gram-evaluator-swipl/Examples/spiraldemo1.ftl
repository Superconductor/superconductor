interface Root { 
  input radius : int;
  input centerRadius : int;
  input centerAlpha : int;
}
interface Node { 
  input open : bool;
  var show : bool;

  var r : int;
  var alpha : int;
  var sectorAng : int;
  var maxR : int;
  var level : int;
  var siblingNum : int;
  
  var x : int;
  var y : int;
  var w : int;
  var h : int;
}


class Top : Root { 
  children { 
    child : Node;
  }
  actions {
    child.r := centerRadius;
    child.alpha := 0;
    child.maxR := radius;        
    child.sectorAng := 360;

    child.siblingNum := 1;
    child.level := 1;
    
    child.show := true;
    
    child.x := centerRadius * cos(PI() * centerAlpha / 180) - child.w/2;
    child.y := centerRadius * sin(PI() * centerAlpha / 180) - child.h/2;
  }
}

class Radial : Node { 
  children {
    child : [ Node ];
  } 
  attributes {
    var numOpenChildren : int;
  }
  actions {
    loop child {
      child.show := show && child.open;
    
      child.r := maxR / (child.level * 2);
      child.maxR := maxR;    
      child.sectorAng := sectorAng / $$.numOpenChildren;
      child.alpha := fold alpha - (sectorAng / 2) - (sectorAng/($$.numOpenChildren*2)) .. child$-.alpha + (sectorAng/$$.numOpenChildren);
      child.siblingNum := fold 0 .. child$-.siblingNum + 1;
      child.level := level + 1;
      numOpenChildren := fold 0 .. $-.numOpenChildren + (child$i.show ? 1 : 0);
      
      if (child.show) {
        child.x := x + child.r * cos(PI() * child.alpha / 180) - child.w/2 + w/2;
        child.y := y + child.r * sin(PI() * child.alpha / 180) - child.h/2 + h/2;      
      } else {
        child.x := x;
        child.y := y;
      }

    }
    w := r/4;
    h := r/4;    
    
  }
}