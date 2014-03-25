interface IRoot {

	input userInput : int;

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
		child.x := 5 + userInput;
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
		
		@render @RectangleOutline(x, y, w, h, 1.0f, rgb(100,0,0));
		
		@render @RectangleZ(x, y + 40, w, h, 0.0f, rgba(255,0,0, 153));

		@render @Line3D(
			x, y + 80, 0.0f, 
			x + 10, y + 10 + 80, 0.0f, 
			5.0f, rgba(255, 0, 0, 153));

		@render @Line(
			x + 20, y + 80,
			x + 20 + 10, y + 10 + 80,
			5.0f, rgba(0, 0, 255, 153));

	}
}
class Leaf : Node { 
	attributes {
		input color : int;
	}
	actions {
		w := 10;
		h := 10;
		@render @Rectangle(x, y, w, h, color);
	}
}
