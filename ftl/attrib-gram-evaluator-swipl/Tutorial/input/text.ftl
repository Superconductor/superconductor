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
  
  
  var textRequests : int;
  var metrics : int;

  var lineH : int;  
}


class Top : Root {
  children { child : Node }
  actions {
    child.x := 0;
    child.relY := 0;
    child.absY := 0;
    child.canvas := paintStart(child.w, child.h);
    
    child.lineH := child.h;
    
    child.metrics := runRequests(child.textRequests);
  }
}

class Leaf : Node {
  actions {
    w := 10;
    h := 10;
    render := 
      canvas
      + paintLine (x, absY, x+w, absY, "#000") //top
      + paintLine (x+w, absY, x+w, absY+h, "#000") //right
      + paintLine (x+w, absY+h, x, absY+h, "#000") //bot
      + paintLine (x, absY+h, x, absY, "#000"); //left

    textRequests := 0;            
  }
}

class HBox : Node {
  children { childs : [ Node ]; }  
  attributes { var numChilds : int; }
  actions {
    loop childs {        
        numChilds := fold 0 .. 1 + $-.numChilds;
        w := fold 5 + ($$.numChilds == 0 ? 5 : 0) .. $-.w + childs$i.w + 5;
        h := fold 10 .. $-.h < (10 + childs$i.h) ? (10 + childs$i.h) : $-.h;
        childs.relY := fold 5 .. 5;
        childs.absY := absY + childs$i.relY;
        childs.x := fold x .. childs$-.x + childs$-.w + 5;  
        childs.canvas := fold render .. childs$-.canvas;
        
        childs.lineH := fold 0 .. 0;
    }
    render := 
      canvas
      + paintLine (x, absY, x+w, absY, "#FF0000") //top
      + paintLine (x+w, absY, x+w, absY+h, "#FF0000") //right
      + paintLine (x+w, absY+h, x, absY+h, "#FF0000") //bot
      + paintLine (x, absY+h, x, absY, "#FF0000"); //left
    loop childs {
      textRequests := fold 0 .. self$-.textRequests + childs$i.textRequests;
      childs.metrics := metrics;    
    }
  }    
}


class VBox : Node {
  children { childs : [ Node ]; }  
  attributes { var numChilds : int; }
  actions {
    loop childs {
        numChilds := fold 0 .. 1 + $-.numChilds;
        h := fold 5 + ($$.numChilds == 0 ? 5 : 0) .. $-.h + childs$i.h + 5;
        w := fold 10 .. $-.w < (10 + childs$i.w) ? (10 + childs$i.w) : $-.w;
        childs.x := x + 5;
        
        childs.relY := fold 0 .. childs$-.relY + childs$-.h + 5;  
        childs.absY := absY + childs$i.relY;
        childs.canvas := fold render .. childs$-.canvas;
        
        childs.lineH := fold 0 .. 0;
    }
    render := 
      canvas
      + paintLine (x, absY, x+w, absY, "#00FF00") //top
      + paintLine (x+w, absY, x+w, absY+h, "#00FF00") //right
      + paintLine (x+w, absY+h, x, absY+h, "#00FF00") //bot
      + paintLine (x, absY+h, x, absY, "#00FF00"); //left
    loop childs {
      textRequests := fold 0 .. self$-.textRequests + childs$i.textRequests;
      childs.metrics := metrics;    
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
    render := paintParagraph(text, fontFamily, renderFontSize, x, absY, w, overflow, lineHeight, renderColor, lineSpacing, canvas);
    
    lineHeight := getLineHeight(text, fontFamily, renderFontSize, metrics);
    maxW := getSumWordW(text, fontFamily, renderFontSize, metrics);
    w := maxW > 200 ? 200 : maxW;    
    numberLines := getNumberLines(text, fontFamily, renderFontSize, w, overflow, metrics);
    h := numberLines * (lineHeight + lineSpacing);
  }
}