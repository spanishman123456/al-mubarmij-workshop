/** main.py — يشغّل project.py ويلتقط الأخطاء للمستخدم النهائي */
export const MAIN_LAUNCHER_PY = `# -*- coding: utf-8 -*-
"""مشغّل المشروع — يعرض رسالة مبسطة ويكتب التفاصيل في debug_log.txt"""
import sys
import traceback
from datetime import datetime

FRIENDLY_AR = (
    "تعذر تشغيل البرنامج بسبب خطأ في إعداد الواجهة.\\n"
    "الرجاء إعادة تصدير المشروع بعد الإصلاح.\\n"
    "التفاصيل التقنية في ملف debug_log.txt"
)


def _write_log(exc):
    try:
        with open("debug_log.txt", "w", encoding="utf-8") as f:
            f.write("Mubarmij export error log\\n")
            f.write("=" * 40 + "\\n")
            f.write(datetime.now().isoformat() + "\\n\\n")
            f.write(traceback.format_exc())
    except OSError:
        pass


def _show_error(message):
    try:
        import tkinter as tk
        from tkinter import messagebox

        root = tk.Tk()
        root.withdraw()
        messagebox.showerror("خطأ في التشغيل", message)
        root.destroy()
    except Exception:
        print(message, file=sys.stderr)


if __name__ == "__main__":
    try:
        import project  # noqa: F401 — كود الطالب
    except Exception as exc:
        _write_log(exc)
        _show_error(FRIENDLY_AR)
        sys.exit(1)
`;

export const VERIFY_EXPORT_PY = `# -*- coding: utf-8 -*-
"""فحص المشروع قبل بناء EXE — شغّله عبر build_windows.bat"""
import ast
import sys

APPKIT_BOUNDS = {
    "title": (1, 1),
    "text": (1, 1),
    "input": (2, 4),
    "number_input": (2, 4),
    "output": (2, 2),
    "button": (2, 2),
    "get": (1, 1),
    "set": (2, 2),
    "on_click": (2, 2),
    "canvas": (3, 3),
    "draw_rect": (6, 6),
    "draw_text": (5, 5),
    "clear_canvas": (1, 1),
    "build": (0, 0),
}


class AppkitVisitor(ast.NodeVisitor):
    def __init__(self):
        self.errors = []
        self.has_build = False

    def visit_Call(self, node):
        func = node.func
        if isinstance(func, ast.Attribute) and isinstance(func.value, ast.Name):
            if func.value.id == "appkit":
                name = func.attr
                n = len(node.args) + len(node.keywords)
                bounds = APPKIT_BOUNDS.get(name)
                if bounds is None:
                    self.errors.append(f"Unsupported appkit.{name}()")
                else:
                    lo, hi = bounds
                    if n < lo or n > hi:
                        self.errors.append(
                            f"appkit.{name}() expects {lo}-{hi} args, got {n} (line {node.lineno})"
                        )
                if name == "build":
                    self.has_build = True
        self.generic_visit(node)


def main():
    try:
        with open("project.py", encoding="utf-8") as f:
            src = f.read()
        tree = ast.parse(src)
    except SyntaxError as e:
        print("SYNTAX ERROR:", e)
        return 1

    v = AppkitVisitor()
    v.visit(tree)
    if not v.has_build:
        v.errors.append("Missing appkit.build()")
    if v.errors:
        print("VERIFY FAILED:")
        for err in v.errors:
            print(" -", err)
        try:
            with open("debug_log.txt", "w", encoding="utf-8") as f:
                f.write("Export verify failed\\n")
                for err in v.errors:
                    f.write(err + "\\n")
        except OSError:
            pass
        return 1

    import appkit  # noqa: F401
    print("VERIFY OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
`;
