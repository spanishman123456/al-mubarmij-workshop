import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";

/** تتبع الصفحات للتحليلات — منفصل عن مؤقت عدم النشاط */
export function ActivityTracker() {
  const { pathname } = useLocation();
  const { isStudentSession, trackPageView } = usePlatform();
  const lastTracked = useRef("");

  useEffect(() => {
    if (!isStudentSession) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackPageView(pathname);
  }, [pathname, isStudentSession, trackPageView]);

  return null;
}

export { StudentInactivityManager } from "../components/auth/StudentInactivityManager.jsx";
