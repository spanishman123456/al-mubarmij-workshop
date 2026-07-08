export const PYTHON_SNIPPET_LIBRARY = [
  {
    id: "if-else",
    categoryAr: "الشروط",
    titleAr: "if / else",
    code: `if condition:\n    print("True branch")\nelse:\n    print("False branch")`,
  },
  {
    id: "if-elif-else",
    categoryAr: "الشروط",
    titleAr: "if / elif / else",
    code: `if score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"`,
  },
  {
    id: "for-range",
    categoryAr: "الحلقات",
    titleAr: "for in range",
    code: `for i in range(1, 6):\n    print(i)`,
  },
  {
    id: "while-loop",
    categoryAr: "الحلقات",
    titleAr: "while",
    code: `count = 0\nwhile count < 5:\n    print(count)\n    count += 1`,
  },
  {
    id: "function-def",
    categoryAr: "الدوال",
    titleAr: "تعريف دالة",
    code: `def greet(name):\n    return f"مرحبا {name}"\n\nprint(greet("طالب"))`,
  },
  {
    id: "list-loop",
    categoryAr: "القوائم",
    titleAr: "المرور على قائمة",
    code: `items = ["a", "b", "c"]\nfor item in items:\n    print(item)`,
  },
  {
    id: "dict-access",
    categoryAr: "القواميس",
    titleAr: "قاموس + get",
    code: `student = {"name": "Ali", "score": 95}\nprint(student.get("name"))\nprint(student.get("grade", "N/A"))`,
  },
  {
    id: "try-except",
    categoryAr: "معالجة الأخطاء",
    titleAr: "try / except",
    code: `try:\n    value = int(input("أدخل رقمًا: "))\n    print(value)\nexcept ValueError:\n    print("المدخل ليس رقمًا صحيحًا")`,
  },
];

export function filterSnippetLibrary(query = "") {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return PYTHON_SNIPPET_LIBRARY;
  return PYTHON_SNIPPET_LIBRARY.filter((item) => {
    const hay = `${item.categoryAr} ${item.titleAr} ${item.code}`.toLowerCase();
    return hay.includes(q);
  });
}

export function insertSnippetTemplate(currentCode, snippetCode) {
  const code = String(currentCode ?? "");
  const snippet = String(snippetCode ?? "").trimEnd();
  if (!snippet) return code;
  if (!code.trim()) return snippet;
  return `${code.trimEnd()}\n\n${snippet}`;
}
