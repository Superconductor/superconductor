interface Node { 
  var render : int;
}

interface Leaf {
  var which : int;
}

class Root : Node { 

  attributes  { 
    var radius : int;
  }

  children {
    childs : [ Leaf ];
  }

  actions {  
    loop childs {
      radius := 50 / childs$$.which;    
      childs.which := fold 0 .. childs$-.which + 1;
      render := 
        fold 
          paintStart() + paintOval(100,100,50,50,"#FF0000")
          ..
          paintOval(50 + childs$i.which * radius * 2,100,radius,radius,"#777"); 
    }    
  }

}

class Leaf1 : Leaf {

}
