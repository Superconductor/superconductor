schedule {  "P = [(_,buSubInorder,_,_,(([bu1, bleaf],_),_))]" }
interface BUs { 
    var res : int;
}
interface Cap {
    var v : int;
}
interface INos { 
  var v1 : int;
  var v2 : int;

}
class BU1 : BUs {
    children {
        child1: Cap;
        child2: BUs;
    }
    actions {
        res := child1.v + child2.res;
    }
}
class BLeaf : BUs {
    actions { res := 0; }
}

///////////////////
class CapC : Cap {
    children {
        child: INos;
    }
    actions {
      child.v1 := 1;
      //recur
      v := child.v2;
    }
}
class I1 : INos {
    children {
      child1: INos;
      child2: INos;
    }
    
    actions {
      child1.v1 := v1;
      //recur
      child2.v1 := child1.v2 + 1;
      //recur
      v2 := child2.v2 + 1;
    }
}
class ILeaf : INos {
    actions { v2 := v1; }
}
