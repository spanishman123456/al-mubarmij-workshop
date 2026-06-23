import { useEffect, useState } from "react";
import { PageShell } from "../components/layout/PageShell";
import { LabPanel } from "../components/layout/LabPanel";
import { NumberConverterSim, BinaryCalculatorSim } from "../components/sims/NumberConverter";
import { TruthTableSim, LogicGatesSim, LogicCircuitSim } from "../components/sims/LogicSims";
import { KarnaughMapSim } from "../components/sims/KarnaughMap";
import { CaesarCipherSim } from "../components/sims/CaesarCipher";
import { SearchSortSim } from "../components/sims/SearchSortSim";

const SECTIONS = [
  { id: "number-converter", title: "محوّل الأنظمة العددية", icon: "🔢" },
  { id: "binary-calc", title: "حاسبة ثنائية", icon: "➕" },
  { id: "truth", title: "جدول الحقيقة", icon: "📋" },
  { id: "gates", title: "البوابات المنطقية", icon: "⚡" },
  { id: "circuit", title: "دوائر منطقية", icon: "🔌" },
  { id: "karnaugh", title: "خريطة كارنوف", icon: "🗺️" },
  { id: "caesar", title: "تشفير قيصر", icon: "🔐" },
  { id: "search", title: "البحث والفرز", icon: "🔍" },
];

export default function SimulationsPage() {
  const [active, setActive] = useState("number-converter");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && SECTIONS.some((s) => s.id === hash)) setActive(hash);
  }, []);

  function select(id) {
    setActive(id);
    window.location.hash = id;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <PageShell
      title="معمل المحاكاة التفاعلية"
      subtitle="أدوات تعليمية لتجربة المفاهيم بنفسك — جرّب، فكّر، واستخدم التلميحات للفهم العميق."
      badge="8 محاكيات تفاعلية"
    >
      <nav className="sim-nav no-print" aria-label="أقسام المحاكاة">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`sim-nav-btn ${active === s.id ? "sim-nav-btn--active" : ""}`}
            onClick={() => select(s.id)}
          >
            <span className="ml-1">{s.icon}</span>
            {s.title}
          </button>
        ))}
      </nav>

      <div className="space-y-8">
        <section id="number-converter" className="scroll-mt-28">
          <LabPanel title="محوّل الأنظمة العددية" hint="حوّل بين العشري والثنائي والست عشري مع خطوات الحل">
            <NumberConverterSim />
          </LabPanel>
        </section>

        <section id="binary-calc" className="scroll-mt-28">
          <LabPanel title="حاسبة ثنائية (جمع وطرح)" hint="شاهد خطوات الحساب مع Carry و Borrow">
            <BinaryCalculatorSim />
          </LabPanel>
        </section>

        <section id="truth" className="scroll-mt-28">
          <LabPanel title="مولّد جداول الحقيقة" hint="أدخل تعبيرًا منطقيًا: AND, OR, NOT, XOR, NAND, NOR, XNOR">
            <TruthTableSim />
          </LabPanel>
        </section>

        <section id="gates" className="scroll-mt-28">
          <LabPanel title="محاكي البوابات المنطقية" hint="غيّر المدخلات 0/1 وشاهد المخرجات فورًا">
            <LogicGatesSim />
          </LabPanel>
        </section>

        <section id="circuit" className="scroll-mt-28">
          <LabPanel title="محاكي الدوائر المنطقية" hint="اسحب البوابات، وصّل المخارج بالمداخل، وجرّب كـ Logic.ly">
            <LogicCircuitSim />
          </LabPanel>
        </section>

        <section id="karnaugh" className="scroll-mt-28">
          <LabPanel title="خريطة كارنوف (K-Map)" hint="أدخل قيم جدول الحقيقة وشاهد التبسيط المبدئي">
            <KarnaughMapSim />
          </LabPanel>
        </section>

        <section id="caesar" className="scroll-mt-28">
          <LabPanel title="محاكاة التشفير — شيفرة قيصر" hint="شفّر وفكّ التشفير مع شرح الإزاحة خطوة بخطوة">
            <CaesarCipherSim />
          </LabPanel>
        </section>

        <section id="search" className="scroll-mt-28">
          <LabPanel title="محاكاة البحث والفرز" hint="Linear Search، Binary Search، Bubble Sort، Selection Sort">
            <SearchSortSim />
          </LabPanel>
        </section>
      </div>
    </PageShell>
  );
}
