import { describe, it, expect } from "vitest";

/** منطق ProtectedRoute — اختبار بدون DOM */
export function canAccessProtectedRoute(user, requiredRoles) {
  if (!user) return { allowed: false, redirect: "/login" };
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return { allowed: false, redirect: user.role === "teacher" ? "/teacher" : "/student" };
  }
  return { allowed: true };
}

describe("teacher route access", () => {
  it("blocks student from teacher-only routes", () => {
    const r = canAccessProtectedRoute({ role: "student", id: "1165814631" }, ["teacher"]);
    expect(r.allowed).toBe(false);
    expect(r.redirect).toBe("/student");
  });

  it("allows teacher to day-02-answers", () => {
    const r = canAccessProtectedRoute({ role: "teacher", id: "teacher-1" }, ["teacher"]);
    expect(r.allowed).toBe(true);
  });

  it("redirects unauthenticated to login", () => {
    const r = canAccessProtectedRoute(null, ["teacher"]);
    expect(r.redirect).toBe("/login");
  });
});

describe("card sort logic", () => {
  function isSorted(arr) {
    for (let i = 1; i < arr.length; i += 1) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  }

  it("detects sorted order", () => {
    expect(isSorted([1, 3, 5, 7, 9])).toBe(true);
    expect(isSorted([7, 3, 9])).toBe(false);
  });
});
