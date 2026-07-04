import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  recordLogin,
  recordPageView,
  todayKey,
  getPresenceStatus,
  filterByLastLogin,
  mergeRemoteAnalytics,
  defaultAnalytics,
} from "./platformAnalytics.js";
import { riyadhDateKey } from "./timezone.js";

describe("todayKey / timezone", () => {
  it("uses Asia/Riyadh not UTC for day boundary", () => {
    const utcLateNight = new Date("2026-06-06T21:30:00.000Z");
    expect(todayKey(utcLateNight)).toBe(riyadhDateKey(utcLateNight));
    expect(todayKey(utcLateNight)).toBe("2026-06-07");
  });
});

describe("recordLogin", () => {
  it("increments login count and sets lastLoginAt", () => {
    const base = defaultAnalytics();
    const updated = recordLogin(base, { sessionId: "sess-1" });
    expect(updated.loginCount).toBe(1);
    expect(updated.lastLoginAt).toBeTruthy();
    expect(updated.loginHistory).toHaveLength(1);
    expect(updated.dailyLog[todayKey(updated.lastLoginAt)].entered).toBe(true);
  });

  it("does not duplicate login within same session", () => {
    const first = recordLogin(defaultAnalytics(), { sessionId: "sess-1" });
    const second = recordLogin(first, { sessionId: "sess-1" });
    expect(second.loginCount).toBe(1);
    expect(second.loginHistory).toHaveLength(1);
  });

  it("counts separate sessions", () => {
    const first = recordLogin(defaultAnalytics(), { sessionId: "sess-1" });
    const second = recordLogin(first, { sessionId: "sess-2" });
    expect(second.loginCount).toBe(2);
    expect(second.loginHistory).toHaveLength(2);
  });
});

describe("recordPageView", () => {
  it("does not mark attendance entered without login", () => {
    const updated = recordPageView(defaultAnalytics(), "/student");
    const day = todayKey();
    expect(updated.dailyLog[day].entered).toBe(false);
    expect(updated.dailyLog[day].pages).toBe(1);
  });

  it("increments pages after login day is entered", () => {
    const logged = recordLogin(defaultAnalytics(), { sessionId: "s1" });
    const viewed = recordPageView(logged, "/student");
    const day = todayKey();
    expect(viewed.dailyLog[day].entered).toBe(true);
    expect(viewed.dailyLog[day].pages).toBe(1);
  });
});

describe("getPresenceStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-06T12:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns never when no logins", () => {
    expect(getPresenceStatus(defaultAnalytics()).key).toBe("never");
  });

  it("returns online when active within 15 minutes", () => {
    const analytics = {
      loginCount: 1,
      lastActivityAt: new Date("2026-06-06T11:50:00.000Z").toISOString(),
    };
    expect(getPresenceStatus(analytics).key).toBe("online");
  });
});

describe("mergeRemoteAnalytics", () => {
  it("merges remote login history with local", () => {
    const local = recordLogin(defaultAnalytics(), { sessionId: "a" });
    const remote = recordLogin(defaultAnalytics(), { sessionId: "b" });
    const merged = mergeRemoteAnalytics(local, remote);
    expect(merged.loginCount).toBeGreaterThanOrEqual(2);
    expect(merged.loginHistory.length).toBeGreaterThanOrEqual(2);
  });
});

describe("filterByLastLogin", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-06T12:00:00.000Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("filters never logged students", () => {
    const rows = [
      { analytics: defaultAnalytics() },
      { analytics: recordLogin(defaultAnalytics(), { sessionId: "x" }) },
    ];
    expect(filterByLastLogin(rows, "never")).toHaveLength(1);
  });
});
