import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePlatform } from "../context/PlatformContext";

export function ActivityTracker() {
  const { pathname } = useLocation();
  const { user, trackPageView } = usePlatform();

  useEffect(() => {
    if (user?.role === "student") {
      trackPageView(pathname);
    }
  }, [pathname, user, trackPageView]);

  return null;
}
