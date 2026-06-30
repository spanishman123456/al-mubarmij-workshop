/** @typedef {import('../types.js').GameId} GameId */

/** @type {import('../types.js').MglGame[]} */
export const MGL_GAMES = [
  {
    id: "guess-number",
    title: "تخمين الرقم",
    icon: "🎯",
    objective: "تطبيق التفكير الشرطي والبحث في نطاق محدد.",
    concepts: ["if/else", "Math.random_range", "مقارنة"],
    controls: "UP/DOWN لتغيير التخمين، OK للتأكيد، BACK للخروج",
    description: "يختار اللوحة رقمًا سريًا. استخدم الأزرار لرفع أو خفض تخمينك حتى تصيب الهدف.",
  },
  {
    id: "binary-system",
    title: "تحويل أنظمة العد",
    icon: "🔢",
    objective: "فهم التحويل بين العشري والثنائي.",
    concepts: ["قسمة على 2", "باقي القسمة", "عرض ثنائي"],
    controls: "UP/DOWN لتغيير الرقم، OK لعرض الثنائي",
    description: "اعرض قيمة عشرية وحوّلها إلى ثنائي على LCD.",
  },
  {
    id: "cipher",
    title: "التشفير وفك التشفير",
    icon: "🔐",
    objective: "تطبيق شفرة قيصر على الأحرف.",
    concepts: ["إزاحة", "modulo", "ترميز ASCII مبسط"],
    controls: "UP/DOWN للإزاحة، OK للتشفير، SW-A لفك التشفير",
    description: "شفّر حرفًا بإزاحة قابلة للتعديل.",
  },
  {
    id: "search-sort",
    title: "البحث والفرز",
    icon: "🔍",
    objective: "محاكاة خطوة بحث خطي.",
    concepts: ["مصفوفة", "مقارنة", "خطوة بخطوة"],
    controls: "OK للخطوة التالية، BACK لإعادة البدء",
    description: "ابحث عن هدف في قائمة أرقام مع عرض المؤشر على LCD.",
  },
  {
    id: "score-counter",
    title: "عداد النقاط",
    icon: "🏆",
    objective: "إدارة حالة ومتغيرات عدّاد.",
    concepts: ["متغيرات", "زيادة/نقصان", "حدود"],
    controls: "UP +1، DOWN -1، OK لإعادة الضبط",
    description: "عداد نقاط بسيط مع LED أخضر عند الفوز.",
  },
  {
    id: "logic-gates",
    title: "البوابات المنطقية",
    icon: "⚡",
    objective: "فهم AND و OR و NOT.",
    concepts: ["منطق رقمي", "مداخل", "مخرج"],
    controls: "SW-A و SW-B كمداخل، OK لعرض الناتج",
    description: "اختر بوابة وشاهد الناتج على LEDs.",
  },
  {
    id: "truth-table",
    title: "جدول الحقيقة",
    icon: "📋",
    objective: "ربط المداخل بجدول حقيقة لـ AND.",
    concepts: ["جدول حقيقة", "AND", "حالات"],
    controls: "UP/DOWN لاختيار الصف، OK لعرض الناتج",
    description: "تصفّح صفوف جدول AND على LCD.",
  },
  {
    id: "fibonacci",
    title: "متتالية فيبوناتشي",
    icon: "🌀",
    objective: "توليد متتالية فيبوناتشي خطوة بخطوة.",
    concepts: ["تكرار", "متغيران", "تبديل"],
    controls: "OK للخطوة التالية",
    description: "اعرض أرقام فيبوناتشي واحدًا تلو الآخر.",
  },
  {
    id: "hanoi",
    title: "برج هانوي",
    icon: "🗼",
    objective: "محاكاة حركة قرص واحد في كل خطوة.",
    concepts: ["مكدس", "قواعد", "عدّاد"],
    controls: "UP/DOWN لاختيار عمود، OK لنقل القرص",
    description: "نفّذ حركة واحدة في كل ضغطة مع التحقق من القواعد.",
  },
];

/** @param {GameId} gameId */
export function getGameById(gameId) {
  return MGL_GAMES.find((g) => g.id === gameId) ?? MGL_GAMES[0];
}
