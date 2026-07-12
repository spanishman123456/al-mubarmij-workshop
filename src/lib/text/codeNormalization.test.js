import { describe, expect, it } from "vitest";
import { normalizeExecutablePythonCode, normalizeCodeFieldsDeep } from "./codeNormalization";

describe("normalizeExecutablePythonCode", () => {
  it("normalizes typographic quotes and unicode minus", () => {
    const input = "print(“hello”)\na = 5 − 2\nprint(‘ok’)";
    const out = normalizeExecutablePythonCode(input);
    expect(out).toContain('print("hello")');
    expect(out).toContain("a = 5 - 2");
    expect(out).toContain("print('ok')");
  });

  it("normalizes split operators", () => {
    const input = "if a = = 3:\n    x + = 1\nif y ! = 0:\n    z - = 2\nif n < = 5 and n > = 1:\n    print(n)";
    const out = normalizeExecutablePythonCode(input);
    expect(out).toContain("a == 3");
    expect(out).toContain("x +=");
    expect(out).toContain("y !=");
    expect(out).toContain("z -=");
    expect(out).toContain("n <=");
    expect(out).toContain("n >=");
  });
});

describe("normalizeCodeFieldsDeep", () => {
  it("normalizes only code-like fields", () => {
    const payload = {
      promptAr: "لا تغيّر “النص العربي”",
      code: "print(“A”)",
      nested: {
        expression: "a = = 5",
        bodyAr: "رمز − داخل شرح عربي",
      },
    };
    const out = normalizeCodeFieldsDeep(payload);
    expect(out.promptAr).toContain("“");
    expect(out.code).toBe('print("A")');
    expect(out.nested.expression).toBe("a == 5");
    expect(out.nested.bodyAr).toContain("−");
  });
});
