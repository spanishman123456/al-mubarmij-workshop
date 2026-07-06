import { Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import {
  isStudentDayRouteAllowed,
  DAY_SCHEDULE_MESSAGE_AR,
  DAY_LOCKED_MESSAGE_AR,
  DayStudentState,
  routeContentDay,
  getStudentDayState,
} from "../../config/publication";
import { PageShell, EduCard } from "../layout/PageShell";

/**
 * Blocks students from draft routes and sequentially locked days.
 */
export function PublishedContentGate({ children }) {
  const { user, authReady, myStats, progressSyncStatus } = usePlatform();
  const { pathname } = useLocation();

  if (!authReady || !user) return children;

  const role = user.role;
  if (role === "teacher") return children;

  const dayUnlockMap = myStats?.dayUnlock?.dayUnlockMap;

  if (
    role === "student" &&
    progressSyncStatus?.loading &&
    pathname.startsWith("/path/day/")
  ) {
    return null;
  }

  if (isStudentDayRouteAllowed(pathname, dayUnlockMap, role, myStats)) return children;

  if (role === "student") {
    const day = routeContentDay(pathname);
    const dayId = day != null && day > 0 ? (day <= 9 ? `day-0${day}` : `day-${day}`) : null;
    const state = dayId ? getStudentDayState(dayId, dayUnlockMap) : null;
    const locked = state === DayStudentState.LOCKED;
    const message = locked ? DAY_LOCKED_MESSAGE_AR : DAY_SCHEDULE_MESSAGE_AR;

    return (
      <PageShell title={locked ? "اليوم مقفل" : "المحتوى غير متاح بعد"} badge="المسار التعليمي">
        <EduCard accent="amber">
          <p className="text-lg font-semibold text-slate-800">{message}</p>
          {locked ? (
            <p className="mt-3 text-sm text-slate-600">أكمل اليوم السابق ثم ارجع إلى المسار من صفحة /path.</p>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              يمكنك متابعة محتوى اليوم الأول من{" "}
              <a href="/path/day/day-01" className="font-bold text-violet-700 underline">
                صفحة اليوم الأول
              </a>
              .
            </p>
          )}
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
