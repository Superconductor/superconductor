interface(root).
interface(node).
interfaceAttribute(node, w).
interfaceAttribute(node, lineh).
interfaceAttribute(node, metrics).
interfaceAttribute(node, canvas).
interfaceAttribute(node, textrequests).
interfaceAttribute(node, absy).
interfaceAttribute(node, rely).
interfaceAttribute(node, h).
interfaceAttribute(node, x).
interfaceAttribute(node, render).
class(top, root).
class(leaf, node).
class(hbox, node).
class(vbox, node).
class(textbox, node).
classChild(top, child, node).
classChild(hbox, childs, node).
classChild(vbox, childs, node).
classField(gensymattrib, gensymattrib) :- false.
classField(top, gensymattrib).
classField(leaf, gensymattrib).
classField(hbox, gensymattrib).
classField(vbox, gensymattrib).
classField(textbox, gensymattrib).
classField(textbox, text).
classField(textbox, color).
classField(textbox, fontfamily).
classField(textbox, fontsize).
interfaceField(root, w).
interfaceField(root, display).
interfaceField(root, refname).
interfaceField(root, h).
interfaceField(node, display).
interfaceField(node, refname).
assignment(top, child, metrics, child, textrequests).
assignment(top, child, canvas, child, w).
assignment(top, child, canvas, child, h).
assignment(top, child, rely, self, gensymattrib).
assignment(top, child, x, self, gensymattrib).
assignment(top, child, lineh, child, h).
assignment(top, child, absy, self, gensymattrib).
assignment(leaf, self, h, self, gensymattrib).
assignment(leaf, self, textrequests, self, gensymattrib).
assignment(leaf, self, render, self, w).
assignment(leaf, self, render, self, canvas).
assignment(leaf, self, render, self, absy).
assignment(leaf, self, render, self, h).
assignment(leaf, self, render, self, x).
assignment(leaf, self, w, self, gensymattrib).
assignment(hbox, self, render, self, w).
assignment(hbox, self, render, self, canvas).
assignment(hbox, self, render, self, absy).
assignment(hbox, self, render, self, h).
assignment(hbox, self, render, self, x).
assignment(hbox, self, numchilds_step, self, gensymattrib).
assignment(hbox, self, numchilds_last, self, numchilds_step).
assignment(hbox, self, numchilds, self, numchilds_step).
assignment(hbox, self, w_step, self, numchilds_last).
assignment(hbox, self, w_step, self, childs_w_step).
assignment(hbox, self, w_step, self, gensymattrib).
assignment(hbox, self, w_last, self, w_step).
assignment(hbox, self, w, self, w_step).
assignment(hbox, self, h_step, self, childs_h_step).
assignment(hbox, self, h_step, self, gensymattrib).
assignment(hbox, self, h_last, self, h_step).
assignment(hbox, self, h, self, h_step).
assignment(hbox, self, childs_rely_step, self, gensymattrib).
assignment(hbox, self, childs_rely_last, self, childs_rely_step).
assignment(hbox, childs, rely, self, childs_rely_step).
assignment(hbox, self, childs_absy_step, self, absy).
assignment(hbox, self, childs_absy_step, self, childs_rely_step).
assignment(hbox, self, childs_absy_step, self, gensymattrib).
assignment(hbox, self, childs_absy_last, self, childs_absy_step).
assignment(hbox, childs, absy, self, childs_absy_step).
assignment(hbox, self, childs_x_step, self, x).
assignment(hbox, self, childs_x_step, self, childs_w_step).
assignment(hbox, self, childs_x_step, self, gensymattrib).
assignment(hbox, self, childs_x_last, self, childs_x_step).
assignment(hbox, childs, x, self, childs_x_step).
assignment(hbox, self, childs_canvas_step, self, render).
assignment(hbox, self, childs_canvas_step, self, gensymattrib).
assignment(hbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(hbox, childs, canvas, self, childs_canvas_step).
assignment(hbox, self, childs_lineh_step, self, gensymattrib).
assignment(hbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(hbox, childs, lineh, self, childs_lineh_step).
assignment(hbox, self, textrequests_step, self, childs_textrequests_step).
assignment(hbox, self, textrequests_step, self, gensymattrib).
assignment(hbox, self, textrequests_last, self, textrequests_step).
assignment(hbox, self, textrequests, self, textrequests_step).
assignment(hbox, self, childs_metrics_step, self, metrics).
assignment(hbox, self, childs_metrics_step, self, gensymattrib).
assignment(hbox, self, childs_metrics_last, self, childs_metrics_step).
assignment(hbox, childs, metrics, self, childs_metrics_step).
assignment(hbox, self, childs_h_step, childs, h).
assignment(hbox, self, childs_w_step, childs, w).
assignment(hbox, self, childs_textrequests_step, childs, textrequests).
assignment(vbox, self, render, self, w).
assignment(vbox, self, render, self, canvas).
assignment(vbox, self, render, self, absy).
assignment(vbox, self, render, self, h).
assignment(vbox, self, render, self, x).
assignment(vbox, self, numchilds_step, self, gensymattrib).
assignment(vbox, self, numchilds_last, self, numchilds_step).
assignment(vbox, self, numchilds, self, numchilds_step).
assignment(vbox, self, h_step, self, numchilds_last).
assignment(vbox, self, h_step, self, childs_h_step).
assignment(vbox, self, h_step, self, gensymattrib).
assignment(vbox, self, h_last, self, h_step).
assignment(vbox, self, h, self, h_step).
assignment(vbox, self, w_step, self, childs_w_step).
assignment(vbox, self, w_step, self, gensymattrib).
assignment(vbox, self, w_last, self, w_step).
assignment(vbox, self, w, self, w_step).
assignment(vbox, self, childs_x_step, self, x).
assignment(vbox, self, childs_x_step, self, gensymattrib).
assignment(vbox, self, childs_x_last, self, childs_x_step).
assignment(vbox, childs, x, self, childs_x_step).
assignment(vbox, self, childs_rely_step, self, childs_h_step).
assignment(vbox, self, childs_rely_step, self, gensymattrib).
assignment(vbox, self, childs_rely_last, self, childs_rely_step).
assignment(vbox, childs, rely, self, childs_rely_step).
assignment(vbox, self, childs_absy_step, self, absy).
assignment(vbox, self, childs_absy_step, self, childs_rely_step).
assignment(vbox, self, childs_absy_step, self, gensymattrib).
assignment(vbox, self, childs_absy_last, self, childs_absy_step).
assignment(vbox, childs, absy, self, childs_absy_step).
assignment(vbox, self, childs_canvas_step, self, render).
assignment(vbox, self, childs_canvas_step, self, gensymattrib).
assignment(vbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(vbox, childs, canvas, self, childs_canvas_step).
assignment(vbox, self, childs_lineh_step, self, gensymattrib).
assignment(vbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(vbox, childs, lineh, self, childs_lineh_step).
assignment(vbox, self, textrequests_step, self, childs_textrequests_step).
assignment(vbox, self, textrequests_step, self, gensymattrib).
assignment(vbox, self, textrequests_last, self, textrequests_step).
assignment(vbox, self, textrequests, self, textrequests_step).
assignment(vbox, self, childs_metrics_step, self, metrics).
assignment(vbox, self, childs_metrics_step, self, gensymattrib).
assignment(vbox, self, childs_metrics_last, self, childs_metrics_step).
assignment(vbox, childs, metrics, self, childs_metrics_step).
assignment(vbox, self, childs_h_step, childs, h).
assignment(vbox, self, childs_w_step, childs, w).
assignment(vbox, self, childs_textrequests_step, childs, textrequests).
assignment(textbox, self, inhfontsize, self, gensymattrib).
assignment(textbox, self, w, self, maxw).
assignment(textbox, self, numberlines, self, w).
assignment(textbox, self, numberlines, self, text).
assignment(textbox, self, numberlines, self, metrics).
assignment(textbox, self, numberlines, self, overflow).
assignment(textbox, self, numberlines, self, renderfontsize).
assignment(textbox, self, numberlines, self, fontfamily).
assignment(textbox, self, linespacing, self, lineheight).
assignment(textbox, self, inhcolor, self, gensymattrib).
assignment(textbox, self, maxw, self, text).
assignment(textbox, self, maxw, self, metrics).
assignment(textbox, self, maxw, self, renderfontsize).
assignment(textbox, self, maxw, self, fontfamily).
assignment(textbox, self, h, self, lineheight).
assignment(textbox, self, h, self, numberlines).
assignment(textbox, self, h, self, linespacing).
assignment(textbox, self, overflow, self, gensymattrib).
assignment(textbox, self, textrequests, self, text).
assignment(textbox, self, textrequests, self, renderfontsize).
assignment(textbox, self, textrequests, self, fontfamily).
assignment(textbox, self, rendercolor, self, color).
assignment(textbox, self, rendercolor, self, inhcolor).
assignment(textbox, self, render, self, w).
assignment(textbox, self, render, self, rendercolor).
assignment(textbox, self, render, self, lineheight).
assignment(textbox, self, render, self, text).
assignment(textbox, self, render, self, linespacing).
assignment(textbox, self, render, self, overflow).
assignment(textbox, self, render, self, renderfontsize).
assignment(textbox, self, render, self, canvas).
assignment(textbox, self, render, self, absy).
assignment(textbox, self, render, self, fontfamily).
assignment(textbox, self, render, self, x).
assignment(textbox, self, renderfontsize, self, inhfontsize).
assignment(textbox, self, renderfontsize, self, fontsize).
assignment(textbox, self, lineheight, self, text).
assignment(textbox, self, lineheight, self, metrics).
assignment(textbox, self, lineheight, self, renderfontsize).
assignment(textbox, self, lineheight, self, fontfamily).
assignment(textbox, self, metrics, self, gensymattrib).
classAttribute(hbox, numchilds).
classAttribute(hbox, childs_h_step).
classAttribute(hbox, childs_absy_step).
classAttribute(hbox, childs_canvas_step).
classAttribute(hbox, childs_w_step).
classAttribute(hbox, childs_x_step).
classAttribute(hbox, childs_lineh_step).
classAttribute(hbox, childs_rely_step).
classAttribute(hbox, childs_textrequests_step).
classAttribute(hbox, childs_metrics_step).
classAttribute(hbox, childs_lineh_step).
classAttribute(hbox, childs_lineh_last).
classAttribute(hbox, childs_x_step).
classAttribute(hbox, childs_x_last).
classAttribute(hbox, childs_absy_step).
classAttribute(hbox, childs_absy_last).
classAttribute(hbox, childs_rely_step).
classAttribute(hbox, childs_rely_last).
classAttribute(hbox, textrequests_step).
classAttribute(hbox, textrequests_last).
classAttribute(hbox, h_step).
classAttribute(hbox, h_last).
classAttribute(hbox, childs_metrics_step).
classAttribute(hbox, childs_metrics_last).
classAttribute(hbox, childs_canvas_step).
classAttribute(hbox, childs_canvas_last).
classAttribute(hbox, numchilds_step).
classAttribute(hbox, numchilds_last).
classAttribute(hbox, w_step).
classAttribute(hbox, w_last).
classAttribute(vbox, numchilds).
classAttribute(vbox, childs_h_step).
classAttribute(vbox, childs_absy_step).
classAttribute(vbox, childs_canvas_step).
classAttribute(vbox, childs_w_step).
classAttribute(vbox, childs_x_step).
classAttribute(vbox, childs_lineh_step).
classAttribute(vbox, childs_rely_step).
classAttribute(vbox, childs_textrequests_step).
classAttribute(vbox, childs_metrics_step).
classAttribute(vbox, childs_lineh_step).
classAttribute(vbox, childs_lineh_last).
classAttribute(vbox, childs_absy_step).
classAttribute(vbox, childs_absy_last).
classAttribute(vbox, childs_rely_step).
classAttribute(vbox, childs_rely_last).
classAttribute(vbox, childs_x_step).
classAttribute(vbox, childs_x_last).
classAttribute(vbox, textrequests_step).
classAttribute(vbox, textrequests_last).
classAttribute(vbox, h_step).
classAttribute(vbox, h_last).
classAttribute(vbox, childs_metrics_step).
classAttribute(vbox, childs_metrics_last).
classAttribute(vbox, childs_canvas_step).
classAttribute(vbox, childs_canvas_last).
classAttribute(vbox, numchilds_step).
classAttribute(vbox, numchilds_last).
classAttribute(vbox, w_step).
classAttribute(vbox, w_last).
classAttribute(textbox, inhfontsize).
classAttribute(textbox, rendercolor).
classAttribute(textbox, lineheight).
classAttribute(textbox, numberlines).
classAttribute(textbox, linespacing).
classAttribute(textbox, renderfontsize).
classAttribute(textbox, overflow).
classAttribute(textbox, maxw).
classAttribute(textbox, inhcolor).
