interface(root).
interface(node).
interface(rowi).
interfaceAttribute(node, w).
interfaceAttribute(node, lineh).
interfaceAttribute(node, canvas).
interfaceAttribute(node, absy).
interfaceAttribute(node, rely).
interfaceAttribute(node, h).
interfaceAttribute(node, x).
interfaceAttribute(node, render).
interfaceAttribute(rowi, w).
interfaceAttribute(rowi, endy).
interfaceAttribute(rowi, canvas).
interfaceAttribute(rowi, absy).
interfaceAttribute(rowi, h).
interfaceAttribute(rowi, rely).
interfaceAttribute(rowi, render).
interfaceAttribute(rowi, x).
class(row, rowi).
class(rows, node).
class(top, root).
class(leaf, node).
class(hbox, node).
class(vbox, node).
class(wrapbox, node).
class(listbox, node).
classChild(row, childs, node).
classChild(rows, footer, node).
classChild(rows, header, node).
classChild(rows, rows, rowi).
classChild(top, child, node).
classChild(hbox, childs, node).
classChild(vbox, childs, node).
classChild(wrapbox, childs, node).
classChild(listbox, childs, node).
classField(gensymattrib, gensymattrib) :- false.
classField(row, gensymattrib).
classField(rows, gensymattrib).
classField(top, gensymattrib).
classField(leaf, gensymattrib).
classField(hbox, gensymattrib).
classField(vbox, gensymattrib).
classField(wrapbox, gensymattrib).
classField(wrapbox, width).
classField(listbox, gensymattrib).
interfaceField(root, w).
interfaceField(root, display).
interfaceField(root, refname).
interfaceField(root, h).
interfaceField(node, display).
interfaceField(node, refname).
interfaceField(rowi, display).
interfaceField(rowi, refname).
assignment(row, self, render, self, w).
assignment(row, self, render, self, canvas).
assignment(row, self, render, self, absy).
assignment(row, self, render, self, h).
assignment(row, self, render, self, x).
assignment(row, self, w_step, self, numcells).
assignment(row, self, w_step, self, childs_w_step).
assignment(row, self, w_step, self, gensymattrib).
assignment(row, self, w_last, self, w_step).
assignment(row, self, w, self, w_step).
assignment(row, self, childs_canvas_step, self, gensymattrib).
assignment(row, self, childs_canvas_last, self, childs_canvas_step).
assignment(row, childs, canvas, self, childs_canvas_step).
assignment(row, self, childs_absy_step, self, absy).
assignment(row, self, childs_absy_step, self, childs_rely_step).
assignment(row, self, childs_absy_step, self, gensymattrib).
assignment(row, self, childs_absy_last, self, childs_absy_step).
assignment(row, childs, absy, self, childs_absy_step).
assignment(row, self, childs_lineh_step, self, gensymattrib).
assignment(row, self, childs_lineh_last, self, childs_lineh_step).
assignment(row, childs, lineh, self, childs_lineh_step).
assignment(row, self, childs_rely_step, self, gensymattrib).
assignment(row, self, childs_rely_last, self, childs_rely_step).
assignment(row, childs, rely, self, childs_rely_step).
assignment(row, self, numcells_step, self, gensymattrib).
assignment(row, self, numcells_last, self, numcells_step).
assignment(row, self, numcells, self, numcells_step).
assignment(row, self, childs_x_step, self, x).
assignment(row, self, childs_x_step, self, childs_w_step).
assignment(row, self, childs_x_step, self, gensymattrib).
assignment(row, self, childs_x_last, self, childs_x_step).
assignment(row, childs, x, self, childs_x_step).
assignment(row, self, h_step, self, childs_h_step).
assignment(row, self, h_step, self, gensymattrib).
assignment(row, self, h_last, self, h_step).
assignment(row, self, h, self, h_step).
assignment(row, self, childs_h_step, childs, h).
assignment(row, self, childs_w_step, childs, w).
assignment(rows, footer, lineh, self, gensymattrib).
assignment(rows, header, rely, self, gensymattrib).
assignment(rows, footer, x, self, x).
assignment(rows, footer, rely, self, lastrowy).
assignment(rows, footer, rely, header, rely).
assignment(rows, footer, rely, header, h).
assignment(rows, footer, rely, self, numrows).
assignment(rows, header, canvas, self, render).
assignment(rows, footer, absy, self, absy).
assignment(rows, footer, absy, footer, rely).
assignment(rows, header, lineh, self, gensymattrib).
assignment(rows, header, absy, header, rely).
assignment(rows, header, absy, self, absy).
assignment(rows, header, x, self, x).
assignment(rows, self, render_step, self, w).
assignment(rows, self, render_step, header, rely).
assignment(rows, self, render_step, header, h).
assignment(rows, self, render_step, self, canvas).
assignment(rows, self, render_step, self, absy).
assignment(rows, self, render_step, self, h).
assignment(rows, self, render_step, self, x).
assignment(rows, self, render_step, self, w).
assignment(rows, self, render_step, self, rows_endy_step).
assignment(rows, self, render_step, self, absy).
assignment(rows, self, render_step, self, x).
assignment(rows, self, render_step, self, gensymattrib).
assignment(rows, self, render_last, self, render_step).
assignment(rows, self, render, self, render_step).
assignment(rows, self, rows_rely_step, self, rows_endy_step).
assignment(rows, self, rows_rely_step, self, rows_h_step).
assignment(rows, self, rows_rely_step, self, gensymattrib).
assignment(rows, self, rows_rely_last, self, rows_rely_step).
assignment(rows, rows, rely, self, rows_rely_step).
assignment(rows, self, rows_canvas_step, self, gensymattrib).
assignment(rows, self, rows_canvas_last, self, rows_canvas_step).
assignment(rows, rows, canvas, self, rows_canvas_step).
assignment(rows, self, footer_canvas_step, self, rows_render_step).
assignment(rows, self, footer_canvas_step, self, gensymattrib).
assignment(rows, self, footer_canvas_last, self, footer_canvas_step).
assignment(rows, footer, canvas, self, footer_canvas_step).
assignment(rows, self, rows_x_step, self, x).
assignment(rows, self, rows_x_step, self, gensymattrib).
assignment(rows, self, rows_x_last, self, rows_x_step).
assignment(rows, rows, x, self, rows_x_step).
assignment(rows, self, numrows_step, self, gensymattrib).
assignment(rows, self, numrows_last, self, numrows_step).
assignment(rows, self, numrows, self, numrows_step).
assignment(rows, self, h_step, footer, h).
assignment(rows, self, h_step, header, h).
assignment(rows, self, h_step, self, rows_h_step).
assignment(rows, self, h_step, self, gensymattrib).
assignment(rows, self, h_last, self, h_step).
assignment(rows, self, h, self, h_step).
assignment(rows, self, lastrowy_step, header, rely).
assignment(rows, self, lastrowy_step, header, h).
assignment(rows, self, lastrowy_step, self, rows_endy_step).
assignment(rows, self, lastrowy_step, self, gensymattrib).
assignment(rows, self, lastrowy_last, self, lastrowy_step).
assignment(rows, self, lastrowy, self, lastrowy_step).
assignment(rows, self, rows_endy_step, header, rely).
assignment(rows, self, rows_endy_step, header, h).
assignment(rows, self, rows_endy_step, self, rows_h_step).
assignment(rows, self, rows_endy_step, self, gensymattrib).
assignment(rows, self, rows_endy_last, self, rows_endy_step).
assignment(rows, rows, endy, self, rows_endy_step).
assignment(rows, self, w_step, footer, w).
assignment(rows, self, w_step, header, w).
assignment(rows, self, w_step, self, rows_w_step).
assignment(rows, self, w_step, self, gensymattrib).
assignment(rows, self, w_last, self, w_step).
assignment(rows, self, w, self, w_step).
assignment(rows, self, rows_absy_step, self, rows_rely_step).
assignment(rows, self, rows_absy_step, self, absy).
assignment(rows, self, rows_absy_step, self, gensymattrib).
assignment(rows, self, rows_absy_last, self, rows_absy_step).
assignment(rows, rows, absy, self, rows_absy_step).
assignment(rows, self, rows_h_step, rows, h).
assignment(rows, self, rows_render_step, rows, render).
assignment(rows, self, rows_w_step, rows, w).
assignment(top, child, lineh, child, h).
assignment(top, child, canvas, child, w).
assignment(top, child, canvas, child, h).
assignment(top, child, absy, self, gensymattrib).
assignment(top, child, x, self, gensymattrib).
assignment(top, child, rely, self, gensymattrib).
assignment(leaf, self, h, self, gensymattrib).
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
assignment(hbox, self, childs_lineh_step, self, gensymattrib).
assignment(hbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(hbox, childs, lineh, self, childs_lineh_step).
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
assignment(hbox, self, childs_x_step, self, x).
assignment(hbox, self, childs_x_step, self, childs_w_step).
assignment(hbox, self, childs_x_step, self, gensymattrib).
assignment(hbox, self, childs_x_last, self, childs_x_step).
assignment(hbox, childs, x, self, childs_x_step).
assignment(hbox, self, numchilds_step, self, gensymattrib).
assignment(hbox, self, numchilds_last, self, numchilds_step).
assignment(hbox, self, numchilds, self, numchilds_step).
assignment(hbox, self, childs_absy_step, self, absy).
assignment(hbox, self, childs_absy_step, self, childs_rely_step).
assignment(hbox, self, childs_absy_step, self, gensymattrib).
assignment(hbox, self, childs_absy_last, self, childs_absy_step).
assignment(hbox, childs, absy, self, childs_absy_step).
assignment(hbox, self, childs_canvas_step, self, render).
assignment(hbox, self, childs_canvas_step, self, gensymattrib).
assignment(hbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(hbox, childs, canvas, self, childs_canvas_step).
assignment(hbox, self, childs_h_step, childs, h).
assignment(hbox, self, childs_w_step, childs, w).
assignment(vbox, self, render, self, w).
assignment(vbox, self, render, self, canvas).
assignment(vbox, self, render, self, absy).
assignment(vbox, self, render, self, h).
assignment(vbox, self, render, self, x).
assignment(vbox, self, childs_absy_step, self, absy).
assignment(vbox, self, childs_absy_step, self, childs_rely_step).
assignment(vbox, self, childs_absy_step, self, gensymattrib).
assignment(vbox, self, childs_absy_last, self, childs_absy_step).
assignment(vbox, childs, absy, self, childs_absy_step).
assignment(vbox, self, w_step, self, childs_w_step).
assignment(vbox, self, w_step, self, gensymattrib).
assignment(vbox, self, w_last, self, w_step).
assignment(vbox, self, w, self, w_step).
assignment(vbox, self, numchilds_step, self, gensymattrib).
assignment(vbox, self, numchilds_last, self, numchilds_step).
assignment(vbox, self, numchilds, self, numchilds_step).
assignment(vbox, self, childs_x_step, self, x).
assignment(vbox, self, childs_x_step, self, gensymattrib).
assignment(vbox, self, childs_x_last, self, childs_x_step).
assignment(vbox, childs, x, self, childs_x_step).
assignment(vbox, self, childs_rely_step, self, childs_h_step).
assignment(vbox, self, childs_rely_step, self, gensymattrib).
assignment(vbox, self, childs_rely_last, self, childs_rely_step).
assignment(vbox, childs, rely, self, childs_rely_step).
assignment(vbox, self, childs_lineh_step, self, gensymattrib).
assignment(vbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(vbox, childs, lineh, self, childs_lineh_step).
assignment(vbox, self, childs_canvas_step, self, render).
assignment(vbox, self, childs_canvas_step, self, gensymattrib).
assignment(vbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(vbox, childs, canvas, self, childs_canvas_step).
assignment(vbox, self, h_step, self, numchilds_last).
assignment(vbox, self, h_step, self, childs_h_step).
assignment(vbox, self, h_step, self, gensymattrib).
assignment(vbox, self, h_last, self, h_step).
assignment(vbox, self, h, self, h_step).
assignment(vbox, self, childs_h_step, childs, h).
assignment(vbox, self, childs_w_step, childs, w).
assignment(wrapbox, self, render, self, w).
assignment(wrapbox, self, render, self, canvas).
assignment(wrapbox, self, render, self, absy).
assignment(wrapbox, self, render, self, h).
assignment(wrapbox, self, render, self, x).
assignment(wrapbox, self, w, self, width).
assignment(wrapbox, self, childs_rely_step, self, childs_x_step).
assignment(wrapbox, self, childs_rely_step, self, childs_lineh_step).
assignment(wrapbox, self, childs_rely_step, self, x).
assignment(wrapbox, self, childs_rely_step, self, gensymattrib).
assignment(wrapbox, self, childs_rely_last, self, childs_rely_step).
assignment(wrapbox, childs, rely, self, childs_rely_step).
assignment(wrapbox, self, childs_absy_step, self, absy).
assignment(wrapbox, self, childs_absy_step, self, childs_rely_step).
assignment(wrapbox, self, childs_absy_step, self, gensymattrib).
assignment(wrapbox, self, childs_absy_last, self, childs_absy_step).
assignment(wrapbox, childs, absy, self, childs_absy_step).
assignment(wrapbox, self, childs_x_step, self, x).
assignment(wrapbox, self, childs_x_step, self, w).
assignment(wrapbox, self, childs_x_step, self, childs_w_step).
assignment(wrapbox, self, childs_x_step, self, childs_w_step).
assignment(wrapbox, self, childs_x_step, self, x).
assignment(wrapbox, self, childs_x_step, self, gensymattrib).
assignment(wrapbox, self, childs_x_last, self, childs_x_step).
assignment(wrapbox, childs, x, self, childs_x_step).
assignment(wrapbox, self, childs_canvas_step, self, render).
assignment(wrapbox, self, childs_canvas_step, self, gensymattrib).
assignment(wrapbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(wrapbox, childs, canvas, self, childs_canvas_step).
assignment(wrapbox, self, h_step, self, childs_lineh_step).
assignment(wrapbox, self, h_step, self, childs_rely_step).
assignment(wrapbox, self, h_step, self, gensymattrib).
assignment(wrapbox, self, h_last, self, h_step).
assignment(wrapbox, self, h, self, h_step).
assignment(wrapbox, self, childs_lineh_step, self, childs_x_step).
assignment(wrapbox, self, childs_lineh_step, self, childs_h_step).
assignment(wrapbox, self, childs_lineh_step, self, x).
assignment(wrapbox, self, childs_lineh_step, self, gensymattrib).
assignment(wrapbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(wrapbox, childs, lineh, self, childs_lineh_step).
assignment(wrapbox, self, childs_h_step, childs, h).
assignment(wrapbox, self, childs_w_step, childs, w).
assignment(listbox, self, childs_x_step, self, x).
assignment(listbox, self, childs_x_step, self, gensymattrib).
assignment(listbox, self, childs_x_last, self, childs_x_step).
assignment(listbox, childs, x, self, childs_x_step).
assignment(listbox, self, childs_lineh_step, self, gensymattrib).
assignment(listbox, self, childs_lineh_last, self, childs_lineh_step).
assignment(listbox, childs, lineh, self, childs_lineh_step).
assignment(listbox, self, childs_rely_step, self, childs_h_step).
assignment(listbox, self, childs_rely_step, self, gensymattrib).
assignment(listbox, self, childs_rely_last, self, childs_rely_step).
assignment(listbox, childs, rely, self, childs_rely_step).
assignment(listbox, self, w_step, self, childs_w_step).
assignment(listbox, self, w_step, self, gensymattrib).
assignment(listbox, self, w_last, self, w_step).
assignment(listbox, self, w, self, w_step).
assignment(listbox, self, render_step, self, w).
assignment(listbox, self, render_step, self, canvas).
assignment(listbox, self, render_step, self, absy).
assignment(listbox, self, render_step, self, h).
assignment(listbox, self, render_step, self, x).
assignment(listbox, self, render_step, self, childs_absy_step).
assignment(listbox, self, render_step, self, x).
assignment(listbox, self, render_step, self, gensymattrib).
assignment(listbox, self, render_last, self, render_step).
assignment(listbox, self, render, self, render_step).
assignment(listbox, self, childs_canvas_step, self, render).
assignment(listbox, self, childs_canvas_step, self, gensymattrib).
assignment(listbox, self, childs_canvas_last, self, childs_canvas_step).
assignment(listbox, childs, canvas, self, childs_canvas_step).
assignment(listbox, self, h_step, self, childs_h_step).
assignment(listbox, self, h_step, self, gensymattrib).
assignment(listbox, self, h_last, self, h_step).
assignment(listbox, self, h, self, h_step).
assignment(listbox, self, childs_absy_step, self, absy).
assignment(listbox, self, childs_absy_step, self, childs_rely_step).
assignment(listbox, self, childs_absy_step, self, gensymattrib).
assignment(listbox, self, childs_absy_last, self, childs_absy_step).
assignment(listbox, childs, absy, self, childs_absy_step).
assignment(listbox, self, childs_h_step, childs, h).
assignment(listbox, self, childs_w_step, childs, w).
classAttribute(row, numcells).
classAttribute(row, childs_h_step).
classAttribute(row, childs_absy_step).
classAttribute(row, childs_canvas_step).
classAttribute(row, childs_w_step).
classAttribute(row, childs_x_step).
classAttribute(row, childs_rely_step).
classAttribute(row, childs_lineh_step).
classAttribute(row, numcells_step).
classAttribute(row, numcells_last).
classAttribute(row, childs_x_step).
classAttribute(row, childs_x_last).
classAttribute(row, childs_rely_step).
classAttribute(row, childs_rely_last).
classAttribute(row, childs_lineh_step).
classAttribute(row, childs_lineh_last).
classAttribute(row, childs_absy_step).
classAttribute(row, childs_absy_last).
classAttribute(row, h_step).
classAttribute(row, h_last).
classAttribute(row, childs_canvas_step).
classAttribute(row, childs_canvas_last).
classAttribute(row, w_step).
classAttribute(row, w_last).
classAttribute(rows, lastrowy).
classAttribute(rows, numrows).
classAttribute(rows, rows_absy_step).
classAttribute(rows, rows_h_step).
classAttribute(rows, rows_render_step).
classAttribute(rows, rows_w_step).
classAttribute(rows, rows_x_step).
classAttribute(rows, rows_endy_step).
classAttribute(rows, rows_rely_step).
classAttribute(rows, rows_canvas_step).
classAttribute(rows, numrows_step).
classAttribute(rows, numrows_last).
classAttribute(rows, footer_canvas_step).
classAttribute(rows, footer_canvas_last).
classAttribute(rows, rows_canvas_step).
classAttribute(rows, rows_canvas_last).
classAttribute(rows, h_step).
classAttribute(rows, h_last).
classAttribute(rows, render_step).
classAttribute(rows, render_last).
classAttribute(rows, lastrowy_step).
classAttribute(rows, lastrowy_last).
classAttribute(rows, rows_endy_step).
classAttribute(rows, rows_endy_last).
classAttribute(rows, rows_absy_step).
classAttribute(rows, rows_absy_last).
classAttribute(rows, w_step).
classAttribute(rows, w_last).
classAttribute(rows, rows_x_step).
classAttribute(rows, rows_x_last).
classAttribute(rows, rows_rely_step).
classAttribute(rows, rows_rely_last).
classAttribute(hbox, numchilds).
classAttribute(hbox, childs_h_step).
classAttribute(hbox, childs_absy_step).
classAttribute(hbox, childs_canvas_step).
classAttribute(hbox, childs_w_step).
classAttribute(hbox, childs_x_step).
classAttribute(hbox, childs_rely_step).
classAttribute(hbox, childs_lineh_step).
classAttribute(hbox, childs_absy_step).
classAttribute(hbox, childs_absy_last).
classAttribute(hbox, childs_x_step).
classAttribute(hbox, childs_x_last).
classAttribute(hbox, childs_rely_step).
classAttribute(hbox, childs_rely_last).
classAttribute(hbox, childs_lineh_step).
classAttribute(hbox, childs_lineh_last).
classAttribute(hbox, h_step).
classAttribute(hbox, h_last).
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
classAttribute(vbox, childs_rely_step).
classAttribute(vbox, childs_lineh_step).
classAttribute(vbox, childs_lineh_step).
classAttribute(vbox, childs_lineh_last).
classAttribute(vbox, childs_rely_step).
classAttribute(vbox, childs_rely_last).
classAttribute(vbox, childs_x_step).
classAttribute(vbox, childs_x_last).
classAttribute(vbox, childs_absy_step).
classAttribute(vbox, childs_absy_last).
classAttribute(vbox, h_step).
classAttribute(vbox, h_last).
classAttribute(vbox, childs_canvas_step).
classAttribute(vbox, childs_canvas_last).
classAttribute(vbox, numchilds_step).
classAttribute(vbox, numchilds_last).
classAttribute(vbox, w_step).
classAttribute(vbox, w_last).
classAttribute(wrapbox, childs_h_step).
classAttribute(wrapbox, childs_absy_step).
classAttribute(wrapbox, childs_canvas_step).
classAttribute(wrapbox, childs_w_step).
classAttribute(wrapbox, childs_x_step).
classAttribute(wrapbox, childs_rely_step).
classAttribute(wrapbox, childs_lineh_step).
classAttribute(wrapbox, childs_lineh_step).
classAttribute(wrapbox, childs_lineh_last).
classAttribute(wrapbox, childs_x_step).
classAttribute(wrapbox, childs_x_last).
classAttribute(wrapbox, childs_absy_step).
classAttribute(wrapbox, childs_absy_last).
classAttribute(wrapbox, childs_rely_step).
classAttribute(wrapbox, childs_rely_last).
classAttribute(wrapbox, h_step).
classAttribute(wrapbox, h_last).
classAttribute(wrapbox, childs_canvas_step).
classAttribute(wrapbox, childs_canvas_last).
classAttribute(listbox, childs_h_step).
classAttribute(listbox, childs_absy_step).
classAttribute(listbox, childs_canvas_step).
classAttribute(listbox, childs_w_step).
classAttribute(listbox, childs_x_step).
classAttribute(listbox, childs_rely_step).
classAttribute(listbox, childs_lineh_step).
classAttribute(listbox, childs_absy_step).
classAttribute(listbox, childs_absy_last).
classAttribute(listbox, childs_rely_step).
classAttribute(listbox, childs_rely_last).
classAttribute(listbox, childs_lineh_step).
classAttribute(listbox, childs_lineh_last).
classAttribute(listbox, childs_x_step).
classAttribute(listbox, childs_x_last).
classAttribute(listbox, h_step).
classAttribute(listbox, h_last).
classAttribute(listbox, render_step).
classAttribute(listbox, render_last).
classAttribute(listbox, childs_canvas_step).
classAttribute(listbox, childs_canvas_last).
classAttribute(listbox, w_step).
classAttribute(listbox, w_last).
