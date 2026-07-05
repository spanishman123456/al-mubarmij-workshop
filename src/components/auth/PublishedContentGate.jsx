import { Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { isLessonRoutePublished, LOCKED_MESSAGE_AR } from "../../config/publication";
import { PageShell, EduCard } from "../layout/PageShell";

/**
 * Blocks students from draft routes; teachers respect teacher-answer day limits.
 */
export function PublishedContentGate({ children }) {
  const { user, authReady } = usePlatform();
  const { pathname } = useLocation();

  if (!authReady || !user) return children;

  const role = user.role;

  if (isLessonRoutePublished(pathname, role)) return children;

  if (role === "student") {
    return (
      <PageShell title="المحتوى غير متاح بعد" badge="الجدول التدريبي">
        <EduCard accent="amber">
          <p className="text-lg font-semibold text-slate-800">{LOCKED_MESSAGE_AR}</p>
          <p className="mt-3 text-sm text-slate-600">
            يمكنك متابعة محتوى اليوم الأول من{" "}
            <a href="/path/day/day-01" className="font-bold text-violet-700 underline">
              صفحة اليوم الأول
            </a>
            .
          </p>
        </EduCard>
      </PageShell>
    );
  }

  return <Navigate to="/teacher" replace />;
}

/** @deprecated use PublishedContentGate */
export function PublishedLessonRoute({ children }) {
  return <PublishedContentGate>{children}</PublishedContentGate>;
}
