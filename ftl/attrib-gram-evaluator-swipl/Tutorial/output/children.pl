interface(node).
interface(leaf).
interfaceAttribute(node, render).
interfaceAttribute(leaf, which).
class(root, node).
class(leaf1, leaf).
classChild(root, childs, leaf).
classField(gensymattrib, gensymattrib) :- false.
classField(root, gensymattrib).
classField(leaf1, gensymattrib).
interfaceField(node, display).
interfaceField(node, refname).
interfaceField(leaf, display).
interfaceField(leaf, refname).
assignment(root, self, radius_step, self, childs_which_last).
assignment(root, self, radius_step, self, gensymattrib).
assignment(root, self, radius_last, self, radius_step).
assignment(root, self, radius, self, radius_step).
assignment(root, self, childs_which_step, self, gensymattrib).
assignment(root, self, childs_which_last, self, childs_which_step).
assignment(root, childs, which, self, childs_which_step).
assignment(root, self, render_step, self, childs_which_step).
assignment(root, self, render_step, self, radius).
assignment(root, self, render_step, self, gensymattrib).
assignment(root, self, render_last, self, render_step).
assignment(root, self, render, self, render_step).
assignment(gensymattrib, gensymattrib, gensymattrib, gensymattrib, gensymattrib) :- false.
classAttribute(root, radius).
classAttribute(root, childs_which_step).
classAttribute(root, radius_step).
classAttribute(root, radius_last).
classAttribute(root, childs_which_step).
classAttribute(root, childs_which_last).
classAttribute(root, render_step).
classAttribute(root, render_last).
