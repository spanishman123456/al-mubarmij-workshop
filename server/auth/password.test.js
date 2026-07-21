import { describe, it, expect, beforeAll } from "vitest";
import { verifyPassword, ensureTestTeacherCredentials } from "./password.js";

describe("password hashing", () => {
  let hash;
  let password;

  beforeAll(() => {
    ({ hash, password } = ensureTestTeacherCredentials());
  });

  it("verifies teacher password with bcrypt", () => {
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
});
