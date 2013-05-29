interface root {}
class top : root {
  attributes {  
    input x : int;
    input y : float;
    var f : float;
    var i : int;
  }  
  actions {
    f := x + y;
    i := f + 1;
  }
}