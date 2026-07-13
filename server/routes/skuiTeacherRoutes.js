import { getSkuiTeacherSolution } from "../teacher/skuiSolutions.js";

/**
 * حلول skui للمعلم فقط.
 * يتوافق مع عقد الواجهة واختبارات skui عبر رأس X-User-Role،
 * كما يقبل جلسة معلم مصادَقة إن وُجدت.
 */
export function registerSkuiTeacherRoutes(app) {
  app.get("/api/teacher/skui-projects/:projectId/solution", (req, res) => {
    const headerRole = String(req.get("x-user-role") || "").toLowerCase();
    const sessionRole = String(req.auth?.role || "").toLowerCase();
    const isTeacher = headerRole === "teacher" || sessionRole === "teacher";
    if (!isTeacher) {
      return res.status(403).json({ ok: false, error: "الحل النموذجي متاح للمعلم فقط." });
    }

    const solution = getSkuiTeacherSolution(req.params.projectId);
    if (!solution) {
      return res.status(404).json({ ok: false, error: "لا يوجد حل لهذا المشروع." });
    }

    return res.json({
      ok: true,
      id: solution.id,
      code: solution.code,
      note: "حل نموذجي للمعلم — لا يُحفظ كمحاولة طالب.",
    });
  });
}
