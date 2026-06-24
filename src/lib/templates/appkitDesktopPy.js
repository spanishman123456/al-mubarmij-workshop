/** نسخة سطح المكتب من appkit — Tkinter — متوافقة مع Skulpt والتصدير */
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
_placeholders = {}
_root = None


def title(t):
    global _title
    _title = str(t)


def text(content):
    _elements.append({"type": "text", "content": str(content)})


def input(id, label, defaultVal="", placeholder=""):
    i = str(id)
    _elements.append(
        {
            "type": "input",
            "id": i,
            "label": str(label),
            "inputType": "text",
            "placeholder": str(placeholder or ""),
        }
    )
    _values[i] = str(defaultVal)


def number_input(id, label, defaultVal="0", placeholder=""):
    i = str(id)
    _elements.append(
        {
            "type": "input",
            "id": i,
            "label": str(label),
            "inputType": "number",
            "placeholder": str(placeholder or ""),
        }
    )
    _values[i] = str(defaultVal)


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
        val = w.get()
        ph = _placeholders.get(i, "")
        if ph and val == ph:
            return ""
        return val
    return _values.get(i, "")


def set(id, value):
    i = str(id)
    _values[i] = str(value)
    lbl = _output_labels.get(i)
    if lbl is not None:
        lbl.config(text=str(value) if str(value) else "—")
    var = _widgets.get(i)
    if isinstance(var, tk.StringVar):
        var.set(str(value))


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


def clear_canvas(canvasId):
    cid = str(canvasId)
    _canvas_ops[cid] = []
    cv = _canvas_widgets.get(cid)
    if cv is not None:
        _render_canvas(cv, cid)


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
        try:
            handler()
        except Exception:
            import traceback
            import sys
            from datetime import datetime

            try:
                with open("debug_log.txt", "w", encoding="utf-8") as f:
                    f.write(datetime.now().isoformat() + "\\n")
                    f.write(traceback.format_exc())
            except OSError:
                pass
            try:
                from tkinter import messagebox

                messagebox.showerror(
                    "خطأ أثناء التشغيل",
                    "حدث خطأ أثناء تنفيذ الإجراء.\\nراجع debug_log.txt للتفاصيل.",
                )
            except Exception:
                traceback.print_exc()
                sys.exit(1)
        _refresh_ui()

    return wrapped


def _make_entry(parent, el):
    i = el["id"]
    ph = el.get("placeholder", "")
    initial = _values.get(i, "")
    var = tk.StringVar(value=initial if initial else (ph if ph else ""))
    if ph:
        _placeholders[i] = ph

        def on_in(_ev, v=var, p=ph):
            if v.get() == p:
                v.set("")

        def on_out(_ev, v=var, p=ph):
            if not v.get().strip():
                v.set(p)

        entry = ttk.Entry(parent, textvariable=var)
        if not initial:
            var.set(ph)
        entry.bind("<FocusIn>", on_in)
        entry.bind("<FocusOut>", on_out)
        return entry, var

    return ttk.Entry(parent, textvariable=var), var


def build():
    global _root
    _root = tk.Tk()
    _root.title(_title or "مشروع برمجة الحاسب")
    _root.minsize(380, 420)

    outer = ttk.Frame(_root, padding=12)
    outer.pack(fill=tk.BOTH, expand=True)

    if _title:
        ttk.Label(outer, text=_title, font=("Segoe UI", 14, "bold")).pack(anchor="center", pady=(0, 8))

    for el in _elements:
        t = el["type"]
        if t == "text":
            ttk.Label(outer, text=el["content"], wraplength=400).pack(anchor="w", pady=4)
        elif t == "input":
            i = el["id"]
            ttk.Label(outer, text=el["label"], font=("Segoe UI", 9, "bold")).pack(anchor="w")
            if el["inputType"] == "number":
                var = tk.StringVar(value=_values.get(i, ""))
                w = ttk.Entry(outer, textvariable=var)
                ph = el.get("placeholder", "")
                if ph and not _values.get(i):
                    _placeholders[i] = ph
                    var.set(ph)

                    def on_in_n(_ev, v=var, p=ph):
                        if v.get() == p:
                            v.set("")

                    def on_out_n(_ev, v=var, p=ph):
                        if not v.get().strip():
                            v.set(p)

                    w.bind("<FocusIn>", on_in_n)
                    w.bind("<FocusOut>", on_out_n)
            else:
                w, var = _make_entry(outer, el)
            w.pack(fill=tk.X, pady=4)
            _widgets[i] = var
        elif t == "output":
            i = el["id"]
            ttk.Label(outer, text=el["label"], font=("Segoe UI", 9, "bold")).pack(anchor="w", pady=(6, 0))
            lbl = ttk.Label(outer, text=_values.get(i, "") or "—", wraplength=400, justify="right")
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
