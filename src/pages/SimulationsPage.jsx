import { NumberConverterSim, BinaryCalculatorSim } from "../components/sims/NumberConverter";
import { TruthTableSim, LogicGatesSim } from "../components/sims/LogicSims";
import { CaesarCipherSim } from "../components/sims/CaesarCipher";
import { SearchSortSim } from "../components/sims/SearchSortSim";

function SimCard({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function SimulationsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-24 font-ar text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">المحاكاة التفاعلية</h1>
      <p className="mt-2 text-slate-400">
        أدوات تعليمية — جرّب، فكّر، ولا تعتمد على حلول جاهزة. التلميحات تساعدك على الفهم.
      </p>
      <div className="mt-10 space-y-8">
        <SimCard id="converter" title="محوّل الأنظمة العددية">
          <NumberConverterSim />
        </SimCard>
        <SimCard id="binary-calc" title="حاسبة ثنائية (جمع وطرح)">
          <BinaryCalculatorSim />
        </SimCard>
        <SimCard id="truth" title="جدول الحقيقة">
          <TruthTableSim />
        </SimCard>
        <SimCard id="gates" title="البوابات المنطقية">
          <LogicGatesSim />
        </SimCard>
        <SimCard id="caesar" title="تشفير قيصر">
          <CaesarCipherSim />
        </SimCard>
        <SimCard id="search" title="البحث والفرز">
          <SearchSortSim />
        </SimCard>
      </div>
    </main>
  );
}
