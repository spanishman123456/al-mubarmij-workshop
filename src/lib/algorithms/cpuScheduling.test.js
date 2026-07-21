import { describe, expect, it } from "vitest";
import { fcfsSchedule, roundMetric, srtSchedule } from "./cpuScheduling.js";

describe("cpuScheduling", () => {
  const sample = [
    { id: "P1", arrival: 0, burst: 3 },
    { id: "P2", arrival: 1, burst: 2 },
    { id: "P3", arrival: 2, burst: 1 },
  ];

  it("FCFS computes wait and turnaround", () => {
    const { results, avgWait } = fcfsSchedule(sample);
    expect(results[0].wait).toBe(0);
    expect(results[1].wait).toBe(2);
    expect(results[2].wait).toBe(3);
    expect(roundMetric(avgWait, 2)).toBe(1.67);
  });

  it("SRT reduces average wait vs FCFS on sample", () => {
    const fcfs = fcfsSchedule(sample);
    const srt = srtSchedule(sample);
    expect(srt.avgWait).toBeLessThan(fcfs.avgWait);
  });

  it("FCFS handles idle CPU before first arrival", () => {
    const { results } = fcfsSchedule([{ id: "P1", arrival: 5, burst: 2 }]);
    expect(results[0].start).toBe(5);
    expect(results[0].wait).toBe(0);
  });
});
