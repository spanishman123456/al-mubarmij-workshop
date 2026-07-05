import { describe, it, expect } from "vitest";
import { verifyPassword, TEACHER_BCRYPT_HASH } from "./password.js";

describe("password hashing", () => {
  it("verifies demo teacher password with bcrypt", () => {
    expect(verifyPassword("babamama", TEACHER_BCRYPT_HASH)).toBe(true);
    expect(verifyPassword("wrong", TEACHER_BCRYPT_HASH)).toBe(false);
  });
});
