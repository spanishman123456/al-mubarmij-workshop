import { describe, it, expect } from "vitest";
import {
  DEMO_STUDENT_LOGIN_CODE,
  buildDemoStudentId,
  isDemoStudentId,
  createDemoStudentProfile,
  findDemoStudentById,
} from "./demoStudentProfile";

describe("demo student helpers", () => {
  it("builds demo user ids with fixed prefix", () => {
    const id = buildDemoStudentId("visitor-1");
    expect(id.startsWith("demo-stu-")).toBe(true);
    expect(isDemoStudentId(id)).toBe(true);
    expect(isDemoStudentId("stu-1165814631")).toBe(false);
  });

  it("creates demo profile with safe flags", () => {
    const user = createDemoStudentProfile("abc123");
    expect(user.role).toBe("student");
    expect(user.isDemo).toBe(true);
    expect(user.studentType).toBe("demo");
    expect(user.nationalId).toBe(DEMO_STUDENT_LOGIN_CODE);
  });

  it("resolves demo profile from stored id", () => {
    const id = buildDemoStudentId("session-77");
    const user = findDemoStudentById(id);
    expect(user?.id).toBe(id);
    expect(findDemoStudentById("stu-1165814631")).toBeNull();
  });
});
