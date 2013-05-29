/**
GRAMMAR
**/

%%transcribed from sampleAdam.ale
interface(top).
interface(node).
class(topBox, top).
class(vBox, node).
class(leafBox, node).
classChild(topBox, root, node).
classChild(vBox, child1, node). 
classChild(vBox, child2, node).
classField(topBox, self, fx).
classField(topBox, self, fy). 
classField(leafBox, self, fh).
classField(leafBox, self, fw).
classAttribute(vBox, temph). 
classAttribute(C, A) :- classField(C, A).
interfaceAttribute(top, myx).
interfaceAttribute(top, myy).
interfaceAttribute(top, myh).
interfaceAttribute(top, myw).
interfaceAttribute(node, x).
interfaceAttribute(node, y).
interfaceAttribute(node, h).
interfaceAttribute(node, w).

assignment(vBox, self, temph, self, y).
assignment(vBox, self, h, child1, h).
assignment(vBox, self, w, child1, w).
assignment(vBox, self, temph, child1, h).
assignment(vBox, self, h, child2, h).
assignment(vBox, self, w, child2, w).


assignment(topBox, self, myx, self, fx).  
assignment(topBox, self, myy, self, fy).  
assignment(topBox, root, x, self, myx). 
assignment(topBox, root, y, self, myy).  
assignment(topBox, self, myh, root, h).  
assignment(topBox, self, myw, root, w).  

assignment(vBox, child1, x, self, x).  
assignment(vBox, child2, x, self, x).  
assignment(vBox, child1, y, self, y).  
assignment(vBox, child2, y, self, temph).

assignment(leafBox, self, h, self, fh).
assignment(leafBox, self, w, self, fw).
