interface(node).
interfaceAttribute(node, render).
class(root, node).
classChild(gensymattrib, gensymattrib, gensymattrib) :- false.
classField(gensymattrib, gensymattrib) :- false.
classField(root, gensymattrib).
interfaceField(node, display).
interfaceField(node, refname).
assignment(root, self, render, self, gensymattrib).
classAttribute(gensymattrib, gensymattrib) :- false.
