import { Link } from "react-router-dom";

const IDEAS = [
  { title: "عداد خطوات", desc: "استخدم أزرار A/B لزيادة عداد على شاشة LED." },
  { title: "لعبة تفاعلية", desc: "استجابة سريعة عند الضغط أو الهز." },
  { title: "حساس حركة", desc: "إظهار رمز عند اكتشاف حركة." },
  { title: "رسائل LED", desc: "عرض اسمك أو رسالة تحفيزية متحركة." },
];

export default function MicrobitPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200">قسم إثرائي اختياري</span>
      <h1 className="mt-4 text-3xl font-bold text-white">micro:bit</h1>
      <p className="mt-2 text-slate-400">
        للطلاب الذين أنهوا المهام الأساسية بسرعة — دمج البرمجة مع قطعة إلكترونية بسيطة.
      </p>

      <section className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-bold text-white">ما هي micro:bit؟</h2>
        <p className="mt-2 text-slate-300">
          لوحة صغيرة فيها أزرار، حساسات، وشبكة LED — مناسبة لتعلم البرمجة التطبيقية خارج الشاشة فقط.
        </p>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {IDEAS.map((item) => (
          <article key={item.title} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-100">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        يمكن ربط هذا القسم لاحقًا بمحرر MakeCode أو MicroPython حسب تجهيزات المدرسة.
      </p>
      <Link to="/path" className="mt-4 inline-block text-violet-300 hover:underline">← العودة للمسار الدراسي</Link>
    </main>
  );
}
