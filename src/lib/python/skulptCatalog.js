/**
 * قائمة اقتراحات متوافقة مع Skulpt (Python 3 subset في المتصفح).
 * لا تُضاف دوال غير مدعومة في بيئة التشغيل الحالية.
 */

/** @typedef {"keyword"|"builtin"|"method"|"variable"|"function"|"module"} CatalogKind */

/** @typedef {{ label: string, kind: CatalogKind, signature?: string, descriptionAr: string, priority?: number }} CatalogItem */

export const PYTHON_KEYWORDS = [
  { label: "if", kind: "keyword", descriptionAr: "كلمة محجوزة — ينفّذ كتلة أوامر عند تحقق شرط" },
  { label: "elif", kind: "keyword", descriptionAr: "كلمة محجوزة — شرط بديل بعد if" },
  { label: "else", kind: "keyword", descriptionAr: "كلمة محجوزة — ينفّذ عند فشل الشروط السابقة" },
  { label: "for", kind: "keyword", descriptionAr: "كلمة محجوزة — تكرار على عناصر تسلسل" },
  { label: "while", kind: "keyword", descriptionAr: "كلمة محجوزة — تكرار ما دام الشرط صحيحًا" },
  { label: "break", kind: "keyword", descriptionAr: "كلمة محجوزة — الخروج من الحلقة" },
  { label: "continue", kind: "keyword", descriptionAr: "كلمة محجوزة — الانتقال للتكرار التالي" },
  { label: "pass", kind: "keyword", descriptionAr: "كلمة محجوزة — مكان فارغ دون تنفيذ" },
  { label: "def", kind: "keyword", descriptionAr: "كلمة محجوزة — تعريف دالة" },
  { label: "return", kind: "keyword", descriptionAr: "كلمة محجوزة — إرجاع قيمة من دالة" },
  { label: "class", kind: "keyword", descriptionAr: "كلمة محجوزة — تعريف صنف" },
  { label: "import", kind: "keyword", descriptionAr: "كلمة محجوزة — استيراد وحدة" },
  { label: "from", kind: "keyword", descriptionAr: "كلمة محجوزة — استيراد من وحدة" },
  { label: "as", kind: "keyword", descriptionAr: "كلمة محجوزة — alias للاستيراد" },
  { label: "in", kind: "keyword", descriptionAr: "كلمة محجوزة — عضوية أو جزء من for" },
  { label: "is", kind: "keyword", descriptionAr: "كلمة محجوزة — مقارنة هوية" },
  { label: "and", kind: "keyword", descriptionAr: "كلمة محجوزة — و منطقية" },
  { label: "or", kind: "keyword", descriptionAr: "كلمة محجوزة — أو منطقية" },
  { label: "not", kind: "keyword", descriptionAr: "كلمة محجوزة — نفي منطقي" },
  { label: "True", kind: "keyword", descriptionAr: "قيمة منطقية — صح" },
  { label: "False", kind: "keyword", descriptionAr: "قيمة منطقية — خطأ" },
  { label: "None", kind: "keyword", descriptionAr: "قيمة فارغة — لا شيء" },
];

export const SKULPT_BUILTINS = [
  { label: "print", kind: "builtin", signature: "print(value)", descriptionAr: "دالة — تعرض نصًا أو قيمة في المخرجات" },
  { label: "input", kind: "builtin", signature: "input(prompt)", descriptionAr: "دالة — تقرأ نصًا من المستخدم" },
  { label: "len", kind: "builtin", signature: "len(object)", descriptionAr: "دالة — طول قائمة أو سلسلة" },
  { label: "range", kind: "builtin", signature: "range(start, stop, step)", descriptionAr: "دالة — تسلسل أعداد للاستخدام مع for" },
  { label: "int", kind: "builtin", signature: "int(value)", descriptionAr: "دالة — تحويل إلى عدد صحيح" },
  { label: "float", kind: "builtin", signature: "float(value)", descriptionAr: "دالة — تحويل إلى عدد عشري" },
  { label: "str", kind: "builtin", signature: "str(value)", descriptionAr: "دالة — تحويل إلى نص" },
  { label: "bool", kind: "builtin", signature: "bool(value)", descriptionAr: "دالة — تحويل إلى قيمة منطقية" },
  { label: "list", kind: "builtin", signature: "list(iterable)", descriptionAr: "دالة — إنشاء قائمة" },
  { label: "tuple", kind: "builtin", signature: "tuple(iterable)", descriptionAr: "دالة — إنشاء tuple" },
  { label: "dict", kind: "builtin", signature: "dict()", descriptionAr: "دالة — إنشاء قاموس" },
  { label: "set", kind: "builtin", signature: "set(iterable)", descriptionAr: "دالة — إنشاء مجموعة" },
  { label: "sum", kind: "builtin", signature: "sum(iterable)", descriptionAr: "دالة — مجموع عناصر" },
  { label: "min", kind: "builtin", signature: "min(iterable)", descriptionAr: "دالة — أصغر قيمة" },
  { label: "max", kind: "builtin", signature: "max(iterable)", descriptionAr: "دالة — أكبر قيمة" },
  { label: "abs", kind: "builtin", signature: "abs(number)", descriptionAr: "دالة — القيمة المطلقة" },
  { label: "round", kind: "builtin", signature: "round(number, ndigits)", descriptionAr: "دالة — تقريب عدد" },
  { label: "sorted", kind: "builtin", signature: "sorted(iterable)", descriptionAr: "دالة — نسخة مرتبة من قائمة" },
  { label: "enumerate", kind: "builtin", signature: "enumerate(iterable)", descriptionAr: "دالة — فهرس مع كل عنصر في for" },
  { label: "zip", kind: "builtin", signature: "zip(a, b)", descriptionAr: "دالة — دمج تسلسلين" },
  { label: "type", kind: "builtin", signature: "type(object)", descriptionAr: "دالة — نوع القيمة" },
  { label: "pow", kind: "builtin", signature: "pow(base, exp)", descriptionAr: "دالة — أس عدد" },
];

export const STR_METHODS = [
  { label: "upper", kind: "method", signature: "upper()", descriptionAr: "Method — تحويل إلى أحرف كبيرة" },
  { label: "lower", kind: "method", signature: "lower()", descriptionAr: "Method — تحويل إلى أحرف صغيرة" },
  { label: "strip", kind: "method", signature: "strip()", descriptionAr: "Method — إزالة فراغات الطرفين" },
  { label: "split", kind: "method", signature: "split(sep)", descriptionAr: "Method — تقسيم النص إلى قائمة" },
  { label: "replace", kind: "method", signature: "replace(old, new)", descriptionAr: "Method — استبدال جزء من النص" },
  { label: "find", kind: "method", signature: "find(sub)", descriptionAr: "Method — موقع أول ظهور لنص" },
  { label: "startswith", kind: "method", signature: "startswith(prefix)", descriptionAr: "Method — هل يبدأ بنص؟" },
  { label: "endswith", kind: "method", signature: "endswith(suffix)", descriptionAr: "Method — هل ينتهي بنص؟" },
];

export const LIST_METHODS = [
  { label: "append", kind: "method", signature: "append(item)", descriptionAr: "Method — إضافة عنصر في آخر القائمة" },
  { label: "extend", kind: "method", signature: "extend(iterable)", descriptionAr: "Method — دمج قائمة أخرى" },
  { label: "insert", kind: "method", signature: "insert(index, item)", descriptionAr: "Method — إدراج عند موضع" },
  { label: "remove", kind: "method", signature: "remove(item)", descriptionAr: "Method — حذف أول ظهور لعنصر" },
  { label: "pop", kind: "method", signature: "pop(index)", descriptionAr: "Method — إزالة وإرجاع عنصر" },
  { label: "sort", kind: "method", signature: "sort()", descriptionAr: "Method — ترتيب القائمة" },
  { label: "reverse", kind: "method", signature: "reverse()", descriptionAr: "Method — عكس ترتيب القائمة" },
  { label: "count", kind: "method", signature: "count(item)", descriptionAr: "Method — عدد مرات ظهور عنصر" },
  { label: "index", kind: "method", signature: "index(item)", descriptionAr: "Method — موضع أول ظهور" },
];

export const APPKIT_SUGGESTIONS = [
  { label: "appkit", kind: "module", descriptionAr: "وحدة — بناء واجهات رسومية في المختبر" },
  { label: "button", kind: "builtin", signature: "appkit.button(text)", descriptionAr: "دالة appkit — زر" },
  { label: "label", kind: "builtin", signature: "appkit.label(text)", descriptionAr: "دالة appkit — نص" },
  { label: "input", kind: "builtin", signature: "appkit.input(placeholder)", descriptionAr: "دالة appkit — حقل إدخال" },
  { label: "on_click", kind: "builtin", signature: "appkit.on_click(fn)", descriptionAr: "دالة appkit — عند النقر" },
  { label: "build", kind: "builtin", signature: "appkit.build()", descriptionAr: "دالة appkit — بناء الواجهة" },
];

/** أولوية حسب وحدة المنهج — تُرفع في الترتيب دون إخفاء الباقي */
export const UNIT_PRIORITY_BOOST = {
  intro: ["print", "input", "str", "int"],
  "computing-basics": ["print", "str"],
  "python-basics": ["print", "input", "str", "int", "float"],
  "python-control": ["if", "elif", "else", "for", "while", "range", "break", "continue"],
  binary: ["str", "len", "int"],
  algorithms: ["for", "while", "range", "def", "return"],
  lists: ["list", "append", "remove", "pop", "sort", "len", "for", "in"],
};

export const CONTEXT_AFTER_KEYWORD = {
  if: [{ label: "not", kind: "keyword", descriptionAr: "نفي الشرط" }],
  for: [
    { label: "in", kind: "keyword", descriptionAr: "جزء from for x in ..." },
    { label: "range", kind: "builtin", signature: "range(n)", descriptionAr: "تسلسل أعداد" },
  ],
  while: [{ label: "True", kind: "keyword", descriptionAr: "شرط دائم (احذر الحلقة اللانهائية)" }],
};

export function getAllCatalogItems({ appMode = false } = {}) {
  const base = [...PYTHON_KEYWORDS, ...SKULPT_BUILTINS];
  if (appMode) return [...base, ...APPKIT_SUGGESTIONS];
  return base;
}

export function getMethodCatalog(inferredType) {
  if (inferredType === "str") return STR_METHODS;
  if (inferredType === "list") return LIST_METHODS;
  return [...STR_METHODS, ...LIST_METHODS];
}
