import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BinaryToy } from "../components/BinaryToy";
import { curriculumUnits, learningPillars } from "../data/curriculum";
import { useState } from "react";

function MiniQuiz() {
  const [picked, setPicked] = useState(null);
  const ok = picked === "101";
  return (
    <div className="card-glass p-4 text-white">
      <h3 className="font-ar mb-3 text-center text-lg font-bold">اختبار سريع</h3>
      <p className="font-ar mb-4 text-center text-sm text-slate-300">ما هو الرقم الثنائي للعدد العشري 5؟</p>
      <div className="flex flex-wrap justify-center gap-2">
        {["101", "110", "100", "111"].map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setPicked(o)}
            className={`rounded-lg px-4 py-2 font-mono text-lg ${
              picked === o ? "bg-pink-600 text-white" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`font-ar mt-3 text-center text-sm ${ok ? "text-emerald-300" : "text-rose-300"}`}>
          {ok ? "صحيح! 5 = 101 في النظام الثنائي." : "حاول مجدداً — تلميح: 4+1"}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const previewUnits = curriculumUnits.slice(0, 4);

  return (
    <div className="min-h-screen font-ar">
      {/* Hero */}
      <section className="hero-grid relative overflow-hidden pb-20 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="blob-float absolute -right-20 -top-24 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
          <div
            className="blob-float absolute left-0 top-1/3 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl"
            style={{ animationDelay: "-4s" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-sm font-medium text-violet-300"
          >
            ورشة برمجة الحاسب · صفوف 4 – 8
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-extrabold leading-tight text-white sm:text-5xl"
          >
            ابدأ رحلتك في عالم
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              {" "}
              البرمجة والعلوم الحاسوبية
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-300"
          >
            محتوى مُحاذى لمقرر «برمجة الحاسب»: أسس علوم الحاسب، النظام الثنائي، الخوارزميات، المنطق، ولغة بايثون —
            مع أنشطة تفاعلية وتمارين كثيرة خاصة في بايثون.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              to="/python"
              className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-3 font-bold text-white shadow-lg transition hover:brightness-110"
            >
              مختبر بايثون
            </Link>
            <Link
              to="/curriculum"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3 font-bold text-white backdrop-blur hover:bg-white/20"
            >
              المسار الدراسي
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl md:grid-cols-4">
          {[
            ["+5000", "طالب", "نموذج إلهام"],
            ["+100", "نشاط", "تمارين ومهام"],
            ["100+", "درس", "محاذاة للمقرر"],
            ["5", "صفوف", "من الرابع للثامن"],
          ].map(([n, l, s]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-bold text-violet-700">{n}</div>
              <div className="text-sm font-semibold text-slate-800">{l}</div>
              <div className="text-xs text-slate-500">{s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-2 text-center text-3xl font-bold text-slate-900">اختر مسارك الفكري</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
          أربعة محاور تدعم أهداف المقرر وتجربة الورشة — بدون تغيير أسلوب التعلم الممتع.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {learningPillars.map((p, i) => (
            <motion.div
              key={p.titleAr}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/80 p-5 shadow-sm"
            >
              <div className="mb-2 text-3xl">{p.icon}</div>
              <h3 className="text-lg font-bold text-slate-900">{p.titleAr}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.descAr}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Curriculum preview */}
      <section className="bg-slate-100/80 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">وحدات مستمدة من المقرر</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {previewUnits.map((u) => (
              <div
                key={u.id}
                className="rounded-2xl border border-white bg-white p-5 shadow-sm ring-1 ring-slate-100"
              >
                <p className="text-xs font-medium text-violet-600">{u.weekHint}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{u.titleAr}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{u.summaryAr}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/curriculum" className="font-semibold text-violet-700 underline-offset-4 hover:underline">
              عرض المسار الكامل
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive strip — dark like original */}
      <section className="bg-[#0a0e1a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">تعلم تفاعلي مع المتعة</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-slate-400">
            نفس فكرة الأدوات التفاعلية في الموقع الأصلي — محوّل ثنائي واختبار سريع، مع ربط صريح بأنشطة المقرر.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <BinaryToy />
            <MiniQuiz />
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/python"
              className="inline-flex rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-emerald-500"
            >
              الانتقال إلى تمارين بايثون
            </Link>
          </div>
        </div>
      </section>

      {/* Journey levels */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">رحلتك في التعلم</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                t: "المستوى المبتدئ",
                w: "4–8 أسابيع",
                d: "أساسيات ثنائية، أول خطوات بايثون، ومهارات منطقية بسيطة.",
              },
              {
                t: "المستوى المتوسط",
                w: "8–12 أسبوع",
                d: "خوارزميات، جمل شرط وحلقات، متغيرات، مشاريع صغيرة.",
              },
              {
                t: "المستوى المتقدم",
                w: "12+ أسبوع",
                d: "منطق رقمي متقدم، بحث وفرز، كائنات، ومشاريع ختامية.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-violet-800">{x.t}</h3>
                <p className="mt-1 text-sm text-slate-500">{x.w}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-violet-700 to-pink-600 py-14 text-center text-white">
        <h2 className="text-2xl font-bold sm:text-3xl">ابدأ رحلتك في الورشة اليوم</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/90">
          ربط التعلم بالمقرر الرسمي، مع تمكين الطلاب من التجربة العملية بلغة بايثون.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/curriculum" className="rounded-full bg-white px-6 py-3 font-bold text-violet-800">
            استكشف المسار
          </Link>
          <Link
            to="/python"
            className="rounded-full border border-white/80 bg-transparent px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            تمرّن على بايثون
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
        <p className="font-ar">
          ورشة تعليمية — محتوى المسار مُستوحى من هيكل مقرر «برمجة الحاسب» (علوم الحاسب وبايثون). التصميم يحافظ على
          روح تجربة «المبرمج الصغير» التفاعلية.
        </p>
      </footer>
    </div>
  );
}
