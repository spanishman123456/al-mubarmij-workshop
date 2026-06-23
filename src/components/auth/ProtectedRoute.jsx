import { Navigate, useLocation } from "react-router-dom";
import { usePlatform } from "../../context/PlatformContext";

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a4b]" dir="rtl">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-300 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-violet-100">جاري التحقق من الجلسة...</p>
      </div>
    </div>
  );
}

function dashboardPath(role) {
  return role === "teacher" ? "/teacher" : "/student";
}

/**
 * يمنع عرض المحتوى قبل التحقق من الجلسة.
 * يحوّل غير المسجّلين إلى /login فورًا (بدون وميض المحتوى).
 */
export function ProtectedRoute({ children, roles }) {
  const { user, authReady } = usePlatform();
  const location = useLocation();

  if (!authReady) {
    return <AuthLoading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  return children;
}

/**
 * صفحة الدخول فقط — المسجّلون يُحوَّلون إلى لوحتهم.
 */
export function GuestRoute({ children }) {
  const { user, authReady } = usePlatform();

  if (!authReady) {
    return <AuthLoading />;
  }

  if (user) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }

  return children;
}

export { AuthLoading };
