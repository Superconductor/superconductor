interface Node { 
  var render : int;
}

class Root : Node { 

  actions {
  
    render := paintStart() + paintOval(100,100,50,50,"#FF0000");
  
  }

}