interface(i).
interfaceAttribute(gensymattrib, gensymattrib) :- false.
class(c, i).
classChild(gensymattrib, gensymattrib, gensymattrib) :- false.
classField(gensymattrib, gensymattrib) :- false.
classField(c, gensymattrib).
interfaceField(i, display).
interfaceField(i, refname).
assignment(c, self, x, self, gensymattrib). %a40
assignment(gensymattrib, gensymattrib, gensymattrib, gensymattrib, gensymattrib) :- false.
classAttribute(c, x). %s1
