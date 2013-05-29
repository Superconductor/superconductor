interface IRoot { 

	input xOffset : int;
	input yOffset : int;

    input tweenMin : float;
    input tweenMax : float;
    
    input radius : float;
    input minRadius : float;
    input height : float;
    input rotation : int;

	///////

    var depth : int;

}

interface SecondI { 
	var xOffset : int;
	var yOffset : int;
	var tweenMin : float;
	var tweenMax : float;
	var radius : float;
	var minRadius : float;
	var height : float;
	var rotation : int;


	var w : float;
	var x : float;
	var rx : float;

    var depth : int;
}


interface Node { 
	var xOffset : int;
	var yOffset : int;
	var tweenMin : float;
	var tweenMax : float;
	var radius : float;
	var minRadius : float;
	var height : float;
	var rotation : int;

	var x : float;
	var rx : float;
	
    var depth : int;
    var levelLength : int;
    var idx : int;
}

interface Leaf { 
	var xOffset : int;
	var yOffset : int;
	var tweenMin : float;
	var tweenMax : float;
	var tween : float;
	var radius : float;
	var minRadius : float;
	var height : float;
	var rotation : int;
	
	input val : float;
	

	var valPrev : float;
	var valCopy : float;
	var angle : float;
	var increment : float;
	
	var isFirst : int;
	var isLast : int;
	
	//////

    var depth : int;
    var idx : int;
}


trait propagateChilds {
	actions {
		loop childs {
			childs.xOffset := xOffset;
			childs.yOffset := yOffset;
			childs.tweenMin := tweenMin;
			childs.tweenMax := tweenMax;
			childs.radius := radius;
			childs.minRadius := minRadius;
			childs.height := height;
			childs.rotation := rotation;
		}
	}
} 
trait propagateChild {
	actions {
		child.xOffset := xOffset;
		child.yOffset := yOffset;
		child.tweenMin := tweenMin;
		child.tweenMax := tweenMax;
		child.radius := radius;
		child.minRadius := minRadius;
		child.height := height;
		child.rotation := rotation;
	}
} 

trait propagateIntermediate{	
    actions{
        loop childs {
            childs.depth := depth + 1;
        }
    }
}

class Root(propagateChild) : IRoot {
	attributes {} 
	children {
		child : SecondI ;
	}
	actions {
	
		child.rx := 5 + child.w;
		child.x := child.rx - child.w; 
		child.depth := depth + 1;
		depth := 1;
	}
}

class Second (propagateIntermediate,propagateChilds) : SecondI {
  attributes {
  	var len : int;
  }
  children {
    childs : [ Node ];
  }
  actions {
  	loop childs {
  		len := fold 0 .. $-.len + 1;
  		childs.levelLength := $$.len;
		childs.idx := fold 0 .. childs$-.idx + 1;
  	}

	//background
	@render @RectangleZ(xOffset - radius, yOffset - radius, 4 * radius, 4 * radius, -0.1f, rgb(0,0,0));
	w := 10;
    loop childs {
			childs.rx := fold x .. childs$-.rx + 5 + 10;
			childs.x := childs$i.rx - 10; 
    }
  }
}

// [a,b] of i for [l%,h%] out of n
// i < l% * n  OR  i > h% * n:
//   off
// else:
//   on, tween = (i - l%n) / (h%n - l%n)
//TODO only allocate if needed   
class Generator (propagateIntermediate,propagateChilds) : Node { 
	attributes {
		var numSpikes : int;
		var increment : float;
		var angle : float;
	}
	children {
		childs : [ Leaf ];
	}
	actions {
		numSpikes := childs$$.idx;
		increment := 1.0f / ((tweenMax - tweenMin) * numSpikes);
		angle := 2 * PI() * ((rotation / 360.0f) + (idx + 0.0f) / levelLength);
		loop childs {
			childs.idx := fold 0 .. childs$-.idx + 1;
			childs.increment := increment;

			childs.tween := 
			    ((childs$i.idx < tweenMin * numSpikes) || (childs$i.idx > tweenMax * numSpikes))
				? -1.0f 
				: ((childs.idx - tweenMin * childs$$.idx) / (tweenMax * numSpikes - tweenMin * numSpikes));
				
			childs.isFirst := 
				((childs$i.idx >= tweenMin * numSpikes) && ((childs$i.idx - 1) < tweenMin * numSpikes)) ? 1 : 0;
			childs.isLast := 
				((childs$i.idx <= tweenMax * numSpikes) && ((childs$i.idx + 1) > tweenMax * numSpikes)) ? 1 : 0;
				
			childs.angle := 0.01f + angle;
			childs.valCopy := fold 0 .. childs$i.val;
			childs.valPrev := fold 0 .. childs$-.valCopy;
		}
	}
}
class Spike : Leaf { 
	attributes {
		var isOn : int;
		var enableShadow : int;
	}
	actions {
		enableShadow := 0;
		isOn := tween >= 0.0f ? 1 : 0;
	
		@render (isOn != 1) ? 0 :  //segment
			@Line3D(xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
					((isLast == 1) ? (1.0f + increment/1.0f) : (tween + increment/1.0f))				
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
					((isLast == 1) ? (1.0f + increment/1.0f) : (tween + increment/1.0f))
				  ) * sin(angle),
				height * val,
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
					((isFirst == 1) ? increment/1.0f : tween)
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
					((isFirst == 1) ? increment/1.0f : tween)
				  ) * sin(angle), 
				height * valPrev,
				0.15f, rgba(0, 204, 255, 102));
		@render (isOn != 1 || enableShadow != 1) ? 0 : //shadow
			@Line3D(
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
					((isLast == 1) ? (1.0f + increment/1.0f) : (tween + increment/1.0f))				
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
					((isLast == 1) ? (1.0f + increment/1.0f) : (tween + increment/1.0f))
				  ) * sin(angle),
				0.0f,
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
				    ((isFirst == 1) ? increment/1.0f : tween)
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
				    ((isFirst == 1) ? increment/1.0f : tween)
				  ) * sin(angle), 
				0.0f,
				0.1f, rgb(255, 255, 255));
		@render (isOn != 1 || isLast != 1) ? 0 : //vertical ending			
			@Line3D(
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * (1.0f + increment/1.0f)  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * (1.0f + increment/1.0f)  ) * sin(angle), 
				height * val,
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * (1.0f + increment/1.0f)  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * (1.0f + increment/1.0f)  ) * sin(angle), 
				0.0f,
				0.1f, rgba(255, 255, 255, 125));
		@render (isOn != 1 || isFirst != 1) ? 0 : // vertical beginning
			@Line3D(
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
					increment/1.0f
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
					increment/1.0f
				  ) * sin(angle), 
				height * valPrev,
				xOffset + 1.5 + radius + minRadius * cos(angle) + (radius * 
					increment/1.0f
				  ) * cos(angle), 
				yOffset + 1.5 + radius + minRadius * sin(angle) + (radius * 
					increment/1.0f
				  ) * sin(angle), 
				0.0f,
				0.1f, rgba(0, 204, 255, 102));
	}
}
