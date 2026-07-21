import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageShell, EduCard } from "../../components/layout/PageShell";
import {
  CODE_VISIBILITY_LEVELS,
  FULL_SOLUTION_LEVELS,
  DEFAULT_CODE_VISIBILITY_LEVEL,
  resolveEffectiveLevel,
  getLevelDef,
} from "../../config/codeVisibilityPolicy.js";
import { listCatalogProjects, listCatalogDays } from "../../data/codeVisibilityCatalog.js";
import {
  fetchCodeVisibilityConfig,
  updateCodeVisibility,
  resetCodeVisibility,
  revertCodeVisibility,
  undoCodeVisibility,
  previewCodeVisibility,
} from "../../lib/codeVisibilityClient.js";

const PROJECTS = listCatalogProjects();
const DAYS = listCatalogDays();

function scopeTargetOf(scope, projectId, dayId) {
  if (scope === "project") return projectId;
  if (scope === "day") return dayId;
  return null;
}

export default function CodeVisibilityPage() {
  const [searchParams] = useSearchParams();
  const projectFromUrl = searchParams.get("project");

  const [config, setConfig] = useState(null);
  const [scope, setScope] = useState(projectFromUrl ? "project" : "general");
  const [projectId, setProjectId] = useState(projectFromUrl || PROJECTS[0]?.id || "");
  const [dayId, setDayId] = useState(DAYS[0]?.dayId || "");
  const [selectedLevel, setSelectedLevel] = useState(DEFAULT_CODE_VISIBILITY_LEVEL);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirmFullSolution, setConfirmFullSolution] = useState(false);
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchCodeVisibilityConfig();
      setConfig(data);
    } catch {
      setError("تعذر تحميل إعدادات ظهور الكود.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const target = scopeTargetOf(scope, projectId, dayId);

  const currentLevel = useMemo(() => {
    if (!config) return DEFAULT_CODE_VISIBILITY_LEVEL;
    if (scope === "general") return config.general ?? DEFAULT_CODE_VISIBILITY_LEVEL;
    if (scope === "project") return config.projects?.[projectId] ?? null;
    if (scope === "day") return config.days?.[dayId] ?? null;
    return null;
  }, [config, scope, projectId, dayId]);

  const effectiveForProject = useMemo(() => {
    if (!config || scope !== "project") return null;
    const proj = PROJECTS.find((p) => p.id === projectId);
    return resolveEffectiveLevel({ projectId, dayId: proj?.dayId || null }, config);
  }, [config, scope, projectId]);

  useEffect(() => {
    if (currentLevel) setSelectedLevel(currentLevel);
    else setSelectedLevel(config?.general ?? DEFAULT_CODE_VISIBILITY_LEVEL);
    setPreview(null);
  }, [scope, projectId, dayId, currentLevel, config]);

  async function doSave() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await updateCodeVisibility({ scope, target, level: selectedLevel, reason });
      setConfig(data);
      setNotice("تم حفظ الإعداد وتطبيقه فورًا.");
      setReason("");
    } catch (e) {
      setError(e.message === "invalid_level" ? "مستوى غير صالح." : "تعذر الحفظ.");
    } finally {
      setBusy(false);
      setConfirmFullSolution(false);
    }
  }

  function handleSaveClick() {
    if (scope !== "general" && !target) {
      setError("اختر مشروعًا أو يومًا أولًا.");
      return;
    }
    if (FULL_SOLUTION_LEVELS.includes(selectedLevel)) {
      setConfirmFullSolution(true);
      return;
    }
    doSave();
  }

  async function handleReset() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await resetCodeVisibility({ scope, target, reason });
      setConfig(data);
      setNotice("تمت إعادة النطاق إلى الوضع الافتراضي.");
    } catch {
      setError("تعذرت إعادة التعيين.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRevert() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await revertCodeVisibility();
      setConfig(data);
      setNotice("تم استرجاع الإعداد السابق.");
    } catch (e) {
      setError(e.message === "nothing_to_undo" ? "لا يوجد تغيير للاسترجاع." : "تعذر الاسترجاع.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUndo() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await undoCodeVisibility();
      setConfig(data);
      setNotice("تم التراجع عن آخر تغيير.");
    } catch (e) {
      setError(e.message === "nothing_to_undo" ? "لا يوجد تغيير للتراجع." : "تعذر التراجع.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePreview() {
    setError("");
    setPreview(null);
    if (scope !== "project") {
      setError("المعاينة كطالب متاحة عند اختيار مشروع محدّد.");
      return;
    }
    try {
      const data = await previewCodeVisibility({ mode: "app", resourceId: projectId });
      setPreview(data.content);
    } catch {
      setError("تعذرت المعاينة.");
    }
  }

  const selectedDef = getLevelDef(selectedLevel);
  const affectedCount = "—";
  const selectedProject = PROJECTS.find((p) => p.id === projectId);

  return (
    <PageShell
      title="التحكم في ظهور الكود والتلميحات"
      subtitle="اختر مستوى ظهور الكود لكل نطاق — يُطبَّق فورًا دون إعادة نشر."
    >
      <Link to="/teacher" className="mb-4 inline-block text-sm font-semibold text-violet-700">
        ← لوحة المعلم
      </Link>

      {error ? <p className="mb-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      {notice ? <p className="mb-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p> : null}

      <EduCard title="النطاق">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="النطاق">
          {[
            { id: "general", label: "كل المشاريع (عام)" },
            { id: "project", label: "مشروع محدّد" },
            { id: "day", label: "يوم تدريبي" },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              data-testid={`cv-scope-${s.id}`}
              onClick={() => setScope(s.id)}
              className={`edu-btn text-sm ${scope === s.id ? "edu-btn-primary" : "edu-btn-outline"}`}
              aria-pressed={scope === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>

        {scope === "project" ? (
          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-semibold text-slate-700">المشروع</span>
            <select
              data-testid="cv-project-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg border p-2"
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titleAr} {p.dayId ? `(${p.dayId})` : ""}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {scope === "day" ? (
          <label className="mt-4 block text-sm">
            <span className="mb-1 block font-semibold text-slate-700">اليوم</span>
            <select value={dayId} onChange={(e) => setDayId(e.target.value)} className="w-full rounded-lg border p-2">
              {DAYS.map((d) => (
                <option key={d.dayId} value={d.dayId}>
                  اليوم {d.dayNumber} ({d.dayId})
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </EduCard>

      <EduCard title="مستوى ظهور الكود" className="mt-4">
        <ul className="space-y-2">
          {CODE_VISIBILITY_LEVELS.map((lvl) => (
            <li key={lvl.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                  selectedLevel === lvl.id ? "border-violet-500 bg-violet-50" : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="code-visibility-level"
                  data-testid={`cv-level-${lvl.id}`}
                  className="mt-1"
                  checked={selectedLevel === lvl.id}
                  onChange={() => setSelectedLevel(lvl.id)}
                />
                <span>
                  <span className="font-bold text-slate-800">
                    {lvl.id}. {lvl.labelAr}
                    {FULL_SOLUTION_LEVELS.includes(lvl.id) ? (
                      <span className="ms-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                        يكشف الحل الكامل
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-slate-600">{lvl.descriptionAr}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>

        <label className="mt-4 block text-sm">
          <span className="mb-1 block font-semibold text-slate-700">سبب التغيير (اختياري)</span>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border p-2"
            placeholder="مثال: تبسيط النشاط للطلاب المبتدئين"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" data-testid="cv-save" className="edu-btn edu-btn-primary text-sm" onClick={handleSaveClick} disabled={busy}>
            حفظ وتطبيق
          </button>
          <button type="button" data-testid="cv-reset" className="edu-btn edu-btn-outline text-sm" onClick={handleReset} disabled={busy}>
            إعادة للافتراضي
          </button>
          <button type="button" data-testid="cv-revert" className="edu-btn edu-btn-outline text-sm" onClick={handleRevert} disabled={busy}>
            استرجاع السابق
          </button>
          <button type="button" data-testid="cv-undo" className="edu-btn edu-btn-outline text-sm" onClick={handleUndo} disabled={busy}>
            تراجع عن الأخير
          </button>
          <button type="button" data-testid="cv-preview" className="edu-btn edu-btn-outline text-sm" onClick={handlePreview} disabled={busy}>
            معاينة كطالب
          </button>
        </div>
      </EduCard>

      <EduCard title="ملخص الإعداد" className="mt-4">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">النطاق</dt>
            <dd className="font-semibold">{scope}</dd>
          </div>
          {scope === "project" ? (
            <div>
              <dt className="text-slate-500">المشروع</dt>
              <dd className="font-semibold">{selectedProject?.titleAr}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-500">المستوى الحالي المحفوظ</dt>
            <dd className="font-semibold">
              {currentLevel ? `${currentLevel}. ${getLevelDef(currentLevel).labelAr}` : "افتراضي (غير مخصّص)"}
            </dd>
          </div>
          {effectiveForProject ? (
            <div>
              <dt className="text-slate-500">المستوى الفعّال (بعد الأولوية)</dt>
              <dd className="font-semibold">
                {effectiveForProject.level}. {getLevelDef(effectiveForProject.level).labelAr}{" "}
                <span className="text-xs text-slate-500">(من نطاق: {effectiveForProject.scope})</span>
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-slate-500">الطلاب المتأثرون</dt>
            <dd className="font-semibold">{affectedCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">آخر تحديث</dt>
            <dd className="font-semibold">{config?.updatedAt ? new Date(config.updatedAt).toLocaleString("ar") : "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">المعلم المعدِّل</dt>
            <dd className="font-semibold">{config?.updatedBy || "—"}</dd>
          </div>
        </dl>
      </EduCard>

      {preview ? (
        <EduCard title="معاينة كطالب" className="mt-4">
          <p className="text-sm text-slate-600">
            المستوى الفعّال: {preview.level}. {getLevelDef(preview.level).labelAr}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>وصف المهمة: {preview.taskDescriptionAr ? "ظاهر" : "مخفي"}</li>
            <li>التلميحات: {preview.hints?.length ? `${preview.hints.length} تلميح` : "مخفية"}</li>
            <li>الكود الابتدائي: {preview.starterCode ? "ظاهر" : "مخفي"}</li>
            <li>كود جزئي: {preview.partialCode ? "ظاهر" : "مخفي"}</li>
            <li>الخطوات: {preview.stepsEnabled ? "مفعّلة" : "معطّلة"}</li>
            <li
              data-testid="cv-preview-full-solution"
              className={preview.fullSolution ? "font-bold text-rose-600" : "text-slate-600"}
            >
              الحل الكامل للطالب: {preview.fullSolution ? "مكشوف" : "غير مكشوف"}
            </li>
          </ul>
        </EduCard>
      ) : null}

      <EduCard title="سجل التغييرات" className="mt-4">
        {config?.audit?.length ? (
          <ul className="max-h-80 space-y-2 overflow-y-auto text-xs">
            {[...config.audit].reverse().map((e, i) => (
              <li key={i} className="rounded-lg border p-2">
                <span className="font-semibold">{new Date(e.at).toLocaleString("ar")}</span> — {e.action} — نطاق:{" "}
                {e.scope}
                {e.target ? ` (${e.target})` : ""} — من {e.before ?? "افتراضي"} إلى {e.after ?? "افتراضي"}
                {e.teacherId ? ` — بواسطة ${e.teacherId}` : ""}
                {e.reason ? ` — ${e.reason}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">لا توجد تغييرات مسجّلة بعد.</p>
        )}
      </EduCard>

      {confirmFullSolution ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-rose-700">تأكيد كشف الحل الكامل</h3>
            <p className="mt-2 text-sm text-slate-700">
              أنت على وشك تفعيل «{selectedDef.labelAr}» والذي يكشف الحل الكامل للطلاب.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              <li>النطاق: {scope}{target ? ` (${target})` : ""}</li>
              {scope === "project" ? <li>المشروع: {selectedProject?.titleAr}</li> : null}
              <li>الطلاب المتأثرون: {affectedCount}</li>
            </ul>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={() => setConfirmFullSolution(false)}>
                إلغاء
              </button>
              <button type="button" data-testid="cv-confirm-full" className="edu-btn edu-btn-primary text-sm" onClick={doSave} disabled={busy}>
                تأكيد وكشف الحل
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
