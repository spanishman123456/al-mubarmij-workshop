import { Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";
import { isLessonRoutePublished } from "../../config/publication";

/**
 * Blocks student access to draft lesson routes; teachers may preview.
 */
export function PublishedLessonRoute({ children }) {
  const { user } = usePlatform();
  const { pathname } = useLocation();

  if (user?.role === "teacher") return children;
  if (!isLessonRoutePublished(pathname)) {
    return <Navigate to="/student" replace />;
  }

  return children;
}
