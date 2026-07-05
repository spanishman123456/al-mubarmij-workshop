import { describe, it, expect } from "vitest";
import { getAppCommit } from "./createApp.js";

describe("getAppCommit", () => {
  it("prefers APP_COMMIT_SHA env", () => {
    const prev = process.env.APP_COMMIT_SHA;
    process.env.APP_COMMIT_SHA = "abc1234";
    expect(getAppCommit()).toBe("abc1234");
    if (prev) process.env.APP_COMMIT_SHA = prev;
    else delete process.env.APP_COMMIT_SHA;
  });

  it("returns unknown when no git and no env", () => {
    const prevSha = process.env.APP_COMMIT_SHA;
    const prevGit = process.env.GIT_COMMIT;
    delete process.env.APP_COMMIT_SHA;
    delete process.env.GIT_COMMIT;
    delete process.env.RENDER_GIT_COMMIT;
    const val = getAppCommit();
    expect(typeof val).toBe("string");
    expect(val.length).toBeGreaterThan(0);
    if (prevSha) process.env.APP_COMMIT_SHA = prevSha;
    if (prevGit) process.env.GIT_COMMIT = prevGit;
  });
});
