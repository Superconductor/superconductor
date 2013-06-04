interface IRoot { 
	var w : float;
	var h : float;
}

interface Node { 
	var w : float;
	var h : float;
	var x : float;
	var rx : float;
	var y : float;
	
    var depth : int;
}

class Root : IRoot { 
	children {
		child : Node;
	}
	
	actions {
		w := child.w + 10;
		h := child.h + 10;
		child.x := 5;
		child.rx := child.x + child.w;
		child.y := 5;
		
		child.depth := 0;
	}
}

class HBox : Node { 
	children {
		childs : [ Node ];
	}
	actions {
		loop childs {
			childs.depth := depth + 1;
			w := fold 5 .. $-.w + childs$i.w + 5;
			childs.rx := fold x .. childs$-.rx + 5 + childs$i.w;
			childs.x := childs$i.rx - childs$i.w; 
			h := fold 5 .. $-.h > (childs$i.h + 10) ? $-.h : (childs$i.h + 10);
			childs.y := y + 5;
		}
		@render @RectangleOutline(x, y, w, h, rgb(100,0,0));
	}
}
class Leaf : Node { 
	actions {
		w := 10;
		h := 10;
		@render @Rectangle(x, y, w, h, rgb(255,0,0));
	}
}
