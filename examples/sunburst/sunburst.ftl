interface Node {
  input open : float;
  var show : float;

  var r : float;
  var parentTotR : float;
  var alpha : float;
  var sectorAng : float;
  var maxR : float;
  
  input bgcolor : color;

  var rootCenterX : float;
  var rootCenterY : float;
  
  //var subtreeWeight : float;
}

class Radial : Node {
  children {
    child : [ Node ];
  }
  attributes {
    var numOpenChildren : int;
  }
  
  actions {
  
    r := (maxR - parentTotR)/3 < 10 ? 10 : (maxR - parentTotR)/4;
      
    loop child {
      //subtreeWeight := fold 1 .. $-.subtreeWeight + child$i.subtreeWeight;
  
      child.parentTotR := parentTotR + r;
  
      child.rootCenterX := rootCenterX;
      child.rootCenterY := rootCenterY;

      child.show := show * child$i.open;
    
    
      child.maxR := maxR;
      
      child.sectorAng :=  $$.numOpenChildren > 0.01 ? child$i.show * sectorAng / $$.numOpenChildren : 0;
      
      // FIXME: Can this be simplified?
      child.alpha := 
        fold 
           $$.numOpenChildren > 0.01?
            alpha - (sectorAng / 2.0f) - (sectorAng/($$.numOpenChildren*2)) 
            : 0
        .. 
        $$.numOpenChildren > 0.01 ?
          child$-.alpha + child$i.show * (sectorAng/$$.numOpenChildren)
          : 0;

      numOpenChildren := fold 0 .. $-.numOpenChildren + child$i.show;
    }
    //@render getRedComponent8B(bgcolor) > 0.7f ? 0 : @Arc(rootCenterX, rootCenterY, show * (parentTotR + r), alpha, sectorAng, (show * 4 * r) / 5, bgcolor);
    @render @Arc(rootCenterX, rootCenterY, show * (parentTotR + r), alpha, sectorAng, (show * 4 * r) / 5, bgcolor);
  }
}


interface IRoot { }

class Root : IRoot {
  children {
    child : Node;
  }
  
  attributes {
    input radius : float;
    input centerRadius : float;
    input centerAlpha : float;
    
    input w : float;
    input h : float;
  }
  
  actions {
    child.alpha := 45;
    child.maxR := radius;
    child.parentTotR := 0;
    child.sectorAng := 360.0f;
    
    child.show := 1.0;
        
    child.rootCenterX := centerRadius * cos(PI() * centerAlpha / 180);
    child.rootCenterY := centerRadius * sin(PI() * centerAlpha / 180);    
  }
}
