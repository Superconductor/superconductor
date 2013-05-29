interface Root { 
  input w : int = 100;
  input h : int = 100;
}

interface Node { 
  var canvas : int;
  var render : int;
  var w : int;
  var h : int;
  var x : int;
  var relY : int;
  var absY : int;
  
  var lineH : int;
  
  var textRequests : int;
  var metrics : int;
  
  input bgc : color = "transparent";
}

interface RowI {
  var x : int;
  var relY : int;
  var absY : int;
  var canvas : int;
  var render : int;
  var h : int;
  var w : int;
  var textRequests : int;
  var metrics : int;

  var endY : int;  
  input bgc : color = "transparent";
}

trait propMetrics {
  actions {
    loop childs {
      textRequests := fold 0 .. self$-.textRequests + childs$i.textRequests;
      childs.metrics := metrics;    
    } 
  }
}

trait renderBox {
  actions {
    render := canvas // canvas
     + paintRect(x, absY, w, h, bgc)
     + paintLine (x, absY, x+w, absY, borderc) //top
      + paintLine (x+w, absY, x+w, absY+h, borderc) //right
      + paintLine (x+w, absY+h, x, absY+h, borderc) //bot
      + paintLine (x, absY+h, x, absY, borderc); //left  
  }
}

trait absChildsY {
  actions {
    loop childs {
      childs.absY := absY + childs$i.relY;
    }
  }
}

class Row(propMetrics, renderBox, absChildsY) : RowI { 
  children {
    childs : [ Node ];
  }
  attributes {  
    var numchilds : int; 
    input borderc : color = #777;    
  }
  actions {
    loop childs {
      numchilds := fold 0 .. $-.numchilds + 1;
      childs.x := fold x .. childs$-.x + childs$-.w + 5;
      childs.relY := 5;
      childs.lineH := 0;
      childs.canvas := 0;
      h := fold 10 .. $-.h < (childs$i.h + 10) ? (childs$i.h + 10) : $-.h;
      w := fold numchilds == 0 ? 10 : 5 .. $-.w + childs$i.w + 5;
    }
  }
}


class Rows : Node {
  children {
    header : Node;
    footer : Node;
    rows : [ RowI ];
  }    
  attributes {
    var numRows : int;
    var lastRowY : int;
    input borderc : color = #777;    
  }
  actions {
    header.x := x + 5;
    header.relY := 5;
    header.absY := absY + header.relY;
    
    loop rows {
      rows.x := x + 5;
      numRows := fold 0 .. $-.numRows + 1;
      h := fold 5 + header.h + 5 + footer.h + 10
        .. $-.h + rows$i.h + 10;
      w := fold 
        10 < (header.w + 10) ? 
          ((header.w + 10) < (footer.w + 10) ? (footer.w + 10) : (header.w + 10))
          : 10        
        .. (10 + rows$i.w > $-.w) ? (10 + rows$i.w) : $-.w;
      rows.endY := fold header.relY + header.h + 5 .. rows$-.endY + rows$i.h + 10;
      rows.relY := fold 0 .. rows$i.endY - rows$i.h - 5;
      rows.absY := fold 0 .. absY + rows$i.relY;
      rows.canvas := fold 0 .. 0;
      lastRowY := fold header.relY + header.h + 5 .. rows$i.endY;
    }

    footer.x := x + 5;
    footer.relY := (numRows == 0) ? (header.relY + header.h + 10) : (lastRowY + 5);
    footer.absY := absY + footer.relY;
    
    loop rows {
        render := 
          fold canvas
              + paintRect(x, absY, w, h, bgc)
              + paintLine (x, absY, x+w, absY, borderc) //top
              + paintLine (x+w, absY, x+w, absY+h, borderc) //right
              + paintLine (x+w, absY+h, x, absY+h, borderc) //bot
              + paintLine (x, absY+h, x, absY, borderc) //left
              + paintLine(x, absY + header.relY + header.h + 5,
                          x + w, absY + header.relY + header.h + 5, borderc)
            ..
            $-.render 
              + paintLine(x, absY + rows$i.endY, x + w, absY + rows$i.endY, borderc);
    }
      
    header.canvas := render;
    loop rows { footer.canvas := fold 0 .. rows$i.render; }
    
    header.lineH := 0;
    footer.lineH := 0;

    loop rows {
      textRequests := fold header.textRequests + footer.textRequests .. self$-.textRequests + rows$i.textRequests;
      rows.metrics := metrics;    
    }
    header.metrics := metrics;
    footer.metrics := metrics;
    
  }
}


class Top : Root {
  children { 
    child : Node 
  }
  attributes {
    input borderc : color = #000;          
  }
  actions {
    child.x := 0;
    child.relY := 0;
    child.absY := 0;
    child.canvas := paintStart(child.w + 1, child.h + 1);
    
    child.lineH := 0;
  }
}

class Leaf(renderBox) : Node {
  attributes {
    input borderc : color = #000;
  }
  actions {
    w := 10;
    h := 10;
    textRequests := 0;            
  }
}

class HBox(propMetrics, renderBox, absChildsY) : Node {
  children { childs : [ Node ]; }  
  attributes { 
    var numChilds : int; 
    input borderc : color = #FF0000;        
  }
  actions {
    loop childs {
        numChilds := fold 0 .. 1 + $-.numChilds;
        w := fold 5 + ($$.numChilds == 0 ? 5 : 0) .. $-.w + childs$i.w + 5;
        h := fold 10 .. $-.h < (10 + childs$i.h) ? (10 + childs$i.h) : $-.h;
        childs.relY := fold 5 .. 5;
        childs.x := fold x .. childs$-.x + childs$-.w + 5;  
        
        childs.lineH := fold 0 .. 0;
    }
  }
}


class VBox(propMetrics, renderBox, absChildsY) : Node {
  children { childs : [ Node ]; }  
  attributes { 
    var numChilds : int; 
    input borderc : color = #00FF00;        
  }
  actions {
    loop childs {
        numChilds := fold 0 .. 1 + $-.numChilds;
        h := fold 5 + ($$.numChilds == 0 ? 5 : 0) .. $-.h + childs$i.h + 5;
        w := fold 10 .. $-.w < (10 + childs$i.w) ? (10 + childs$i.w) : $-.w;
        childs.x := x + 5;
        
        childs.relY := fold 0 .. childs$-.relY + childs$-.h + 5;  
        childs.canvas := fold render .. childs$-.canvas;
        
        childs.lineH := fold 0 .. 0;
    }
  }
}


class WrapBox(propMetrics, renderBox, absChildsY) : Node {
  children { childs : [ Node ]; }
  attributes {
    input width : int = 100;
//    var lineH : int;
    input borderc : color = #0000FF;        
  }
  actions {
    w := width;
    loop childs {
      childs.x := fold x
          .. childs$-.x + childs$-.w + 5 + childs$i.w >= (x + w) ?
            (x + 5) : (childs$-.x + childs$-.w + 5);
      childs.lineH := fold 0 
          .. childs$i.x == x + 5 ? 
            childs$i.h 
            : (childs$i.h > childs$-.lineH ? childs$i.h : childs$-.lineH);         
      childs.relY := fold 0
          .. childs$-.relY + (childs$i.x == x + 5 ? childs$-.lineH + 5 : 0);
      childs.canvas := fold render .. childs$-.canvas;      
      h := fold 10 .. childs$i.relY + childs$i.lineH + 5;      
    }
  }
}

class ListBox(propMetrics, absChildsY) : Node {
  children { childs : [ Node ]; }
  attributes {
    input borderc : color = #FF00FF;
  }
  actions {
    loop childs {
      w := fold 10 ..
        $-.w < (5 + 10 + 5 + childs$i.w + 5) ? 
          (5 + 10 + 5 + childs$i.w + 5) : $-.w;
      h := fold 10 ..
        $-.h + childs$i.h + 5;        
      childs.x := x + 15;
      childs.relY := fold 5 .. childs$-.relY + childs$-.h + 5;
    }
 
    loop childs {
      childs.lineH := 0;
      childs.canvas := fold render .. childs$-.canvas;
      render := 
        fold 
          canvas
          + paintRect(x, absY, w, h, bgc)      
          + paintLine (x, absY, x+w, absY, borderc) //top
          + paintLine (x+w, absY, x+w, absY+h, borderc) //right
          + paintLine (x+w, absY+h, x, absY+h, borderc) //bot
          + paintLine (x, absY+h, x, absY, borderc) //left
        ..
          paintLine (x + 5, childs$i.absY, x + 10, childs$i.absY, borderc) //top
          + paintLine (x + 10, childs$i.absY, x + 10, childs$i.absY + 5, borderc) //right
          + paintLine (x + 10, childs$i.absY + 5, x + 5, childs$i.absY + 5, borderc) //bot
          + paintLine (x + 5, childs$i.absY + + 5, x + 5, childs$i.absY, borderc); //left        
    }
  }
}



class TextBox : Node { 
  attributes {  
    input text : string;
    input fontFamily : string = "Arial";
    var lineHeight : int;
    var lineSpacing : int;
    var numberLines : int;  
    var overflow : bool;
    var maxW : int;
    var renderFontSize : int;
    var renderColor : color; 
    
    input color : ?color;
    input fontSize : ?int;
    var inhColor : color;
    var inhFontSize : int;
    input borderc : color = #EEE;
  }
  actions {   
    inhColor := "black";
    inhFontSize := 10;
    metrics := 0;
    
  
    renderFontSize := isEmptyInt(fontSize) ? inhFontSize : valueInt(fontSize);
    renderColor := !isEmptyColor(color) ? valueColor(color) : inhColor; 
  
    overflow := false;
    lineSpacing := lineHeight;
    textRequests := requestGlyphs(text, fontFamily, renderFontSize, 0);    
    render := 
      paintParagraph(text, fontFamily, renderFontSize, x, absY, w, overflow, lineHeight, renderColor, lineSpacing, canvas);
    
    lineHeight := getLineHeight(text, fontFamily, renderFontSize, metrics);
    maxW := getSumWordW(text, fontFamily, renderFontSize, metrics);
    w := maxW;
    numberLines := getNumberLines(text, fontFamily, renderFontSize, w, overflow, metrics);
    h := numberLines > 1 ? ((numberLines * lineHeight) + ((numberLines - 1) +lineSpacing)) : lineHeight;
  }
}