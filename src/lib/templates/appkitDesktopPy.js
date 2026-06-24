/** نسخة سطح المكتب من appkit — Tkinter — للتصدير و PyInstaller */
export const APPKIT_DESKTOP_PY = `# -*- coding: utf-8 -*-
"""appkit — واجهة Tkinter متوافقة مع مختبر برمجة الحاسب (تصدير سطح المكتب)"""
import tkinter as tk
from tkinter import ttk

_title = ""
_elements = []
_handlers = {}
_values = {}
_canvas_ops = {}
_widgets = {}
_output_labels = {}
_canvas_widgets = {}
_root = None


def title(t):
    global _title
    _title = str(t)


def text(content):
    _elements.append({"type": "text", "content": str(content)})


def input(id, label, defaultVal=""):
    _elements.append({"type": "input", "id": str(id), "label": str(label), "inputType": "text"})
    _values[str(id)] = str(defaultVal)


def number_input(id, label, defaultVal="0"):
    _elements.append({"type": "input", "id": str(id), "label": str(label), "inputType": "number"})
    _values[str(id)] = str(defaultVal)


def output(id, label):
    i = str(id)
    _elements.append({"type": "output", "id": i, "label": str(label)})
    _values[i] = ""


def button(id, label):
    _elements.append({"type": "button", "id": str(id), "label": str(label)})


def get(id):
    i = str(id)
    w = _widgets.get(i)
    if isinstance(w, tk.StringVar):
        return w.get()
    return _values.get(i, "")


def set(id, value):
    i = str(id)
    _values[i] = str(value)
    lbl = _output_labels.get(i)
    if lbl is not None:
        lbl.config(text=str(value))


def on_click(id, handler):
    _handlers[str(id)] = handler


def canvas(id, w, h):
    i = str(id)
    _elements.append({"type": "canvas", "id": i, "width": int(w), "height": int(h)})
    _canvas_ops[i] = []


def draw_rect(canvasId, x, y, w, h, color="#7c3aed"):
    cid = str(canvasId)
    if cid not in _canvas_ops:
        _canvas_ops[cid] = []
    _canvas_ops[cid].append(
        {"op": "rect", "x": float(x), "y": float(y), "w": float(w), "h": float(h), "color": str(color)}
    )


def draw_text(canvasId, x, y, txt, color="#1e1b4b"):
    cid = str(canvasId)
    if cid not in _canvas_ops:
        _canvas_ops[cid] = []
    _canvas_ops[cid].append(
        {"op": "text", "x": float(x), "y": float(y), "text": str(txt), "color": str(color)}
    )


def _render_canvas(cv, cid):
    cv.delete("all")
    cv.config(bg="#f8fafc")
    for op in _canvas_ops.get(cid, []):
        if op["op"] == "rect":
            cv.create_rectangle(
                op["x"], op["y"], op["x"] + op["w"], op["y"] + op["h"], fill=op["color"], outline=""
            )
        elif op["op"] == "text":
            cv.create_text(op["x"], op["y"], text=op["text"], fill=op["color"], anchor="nw")


def _refresh_ui():
    for cid, cv in _canvas_widgets.items():
        _render_canvas(cv, cid)
    for oid, lbl in _output_labels.items():
        lbl.config(text=_values.get(oid, "") or "—")


def _make_handler(handler):
    def wrapped():
        handler()
        _refresh_ui()
    return wrapped


def build():
    global _root
    _root = tk.Tk()
    _root.title(_title or "مشروع برمجة الحاسب")
    _root.minsize(360, 400)

    outer = ttk.Frame(_root, padding=12)
    outer.pack(fill=tk.BOTH, expand=True)

    if _title:
        ttk.Label(outer, text=_title, font=("Segoe UI", 14, "bold")).pack(anchor="center", pady=(0, 8))

    for el in _elements:
        t = el["type"]
        if t == "text":
            ttk.Label(outer, text=el["content"], wraplength=380).pack(anchor="w", pady=4)
        elif t == "input":
            i = el["id"]
            ttk.Label(outer, text=el["label"]).pack(anchor="w")
            var = tk.StringVar(value=_values.get(i, ""))
            if el["inputType"] == "number":
                w = ttk.Spinbox(outer, textvariable=var, from_=0, to=99999)
            else:
                w = ttk.Entry(outer, textvariable=var)
            w.pack(fill=tk.X, pady=4)
            _widgets[i] = var
        elif t == "output":
            i = el["id"]
            ttk.Label(outer, text=el["label"], font=("Segoe UI", 9, "bold")).pack(anchor="w")
            lbl = ttk.Label(outer, text=_values.get(i, "") or "—", wraplength=380)
            lbl.pack(anchor="w", pady=4)
            _output_labels[i] = lbl
        elif t == "button":
            bid = el["id"]
            handler = _handlers.get(bid)
            cmd = _make_handler(handler) if handler else None
            ttk.Button(outer, text=el["label"], command=cmd).pack(fill=tk.X, pady=6)
        elif t == "canvas":
            i = el["id"]
            cv = tk.Canvas(outer, width=el["width"], height=el["height"], highlightthickness=1)
            cv.pack(fill=tk.X, pady=6)
            _canvas_widgets[i] = cv
            _render_canvas(cv, i)

    _root.mainloop()
`;
