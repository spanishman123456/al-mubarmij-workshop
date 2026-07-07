/**
 * محاكاة جدولة المعالج — FCFS و SRT (Shortest Remaining Time)
 * @typedef {{ id: string, arrival: number, burst: number }} ProcessInput
 * @typedef {{ id: string, arrival: number, burst: number, start: number, finish: number, wait: number, turnaround: number }} ProcessResult
 */

/**
 * @param {ProcessInput[]} processes
 * @returns {{ results: ProcessResult[], avgWait: number, avgTurnaround: number, timeline: { time: number, processId: string | null }[] }}
 */
export function fcfsSchedule(processes) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  /** @type {ProcessResult[]} */
  const results = [];
  const timeline = [{ time: 0, processId: null }];
  let clock = 0;

  for (const p of sorted) {
    if (clock < p.arrival) {
      timeline.push({ time: clock, processId: null });
      clock = p.arrival;
    }
    const start = clock;
    const finish = start + p.burst;
    const wait = start - p.arrival;
    const turnaround = finish - p.arrival;
    results.push({ ...p, start, finish, wait, turnaround });
    timeline.push({ time: start, processId: p.id });
    timeline.push({ time: finish, processId: null });
    clock = finish;
  }

  const n = results.length || 1;
  const avgWait = results.reduce((s, r) => s + r.wait, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaround, 0) / n;
  return { results, avgWait, avgTurnaround, timeline: dedupeTimeline(timeline) };
}

/**
 * SRT — يختار العملية ذات أقصر وقت متبقٍ عند كل قرار
 * @param {ProcessInput[]} processes
 */
export function srtSchedule(processes) {
  const remaining = new Map(processes.map((p) => [p.id, p.burst]));
  const arrived = new Set();
  /** @type {ProcessResult[]} */
  const results = [];
  const timeline = [];
  let clock = 0;
  let running = null;
  let runStart = 0;

  const allDone = () => [...remaining.values()].every((v) => v <= 0);

  while (!allDone()) {
    for (const p of processes) {
      if (p.arrival <= clock && remaining.get(p.id) > 0) arrived.add(p.id);
    }

    const candidates = processes.filter((p) => arrived.has(p.id) && remaining.get(p.id) > 0);
    if (!candidates.length) {
      const nextArr = Math.min(...processes.filter((p) => remaining.get(p.id) > 0).map((p) => p.arrival));
      if (running) {
        timeline.push({ time: clock, processId: running });
        running = null;
      }
      timeline.push({ time: clock, processId: null });
      clock = nextArr;
      continue;
    }

    candidates.sort((a, b) => remaining.get(a.id) - remaining.get(b.id) || a.arrival - b.arrival || a.id.localeCompare(b.id));
    const pick = candidates[0];

    if (running !== pick.id) {
      if (running) timeline.push({ time: clock, processId: running });
      running = pick.id;
      runStart = clock;
      timeline.push({ time: clock, processId: running });
    }

    remaining.set(pick.id, remaining.get(pick.id) - 1);
    clock += 1;

    if (remaining.get(pick.id) === 0) {
      const p = processes.find((x) => x.id === pick.id);
      const finish = clock;
      const turnaround = finish - p.arrival;
      const wait = turnaround - p.burst;
      results.push({ id: p.id, arrival: p.arrival, burst: p.burst, start: finish - p.burst, finish, wait, turnaround });
      arrived.delete(pick.id);
      running = null;
      timeline.push({ time: clock, processId: null });
    }
  }

  results.sort((a, b) => a.id.localeCompare(b.id));
  const n = results.length || 1;
  const avgWait = results.reduce((s, r) => s + r.wait, 0) / n;
  const avgTurnaround = results.reduce((s, r) => s + r.turnaround, 0) / n;
  return { results, avgWait, avgTurnaround, timeline: dedupeTimeline(timeline) };
}

/** @param {{ time: number, processId: string | null }[]} timeline */
function dedupeTimeline(timeline) {
  if (!timeline.length) return [{ time: 0, processId: null }];
  const out = [timeline[0]];
  for (let i = 1; i < timeline.length; i += 1) {
    const prev = out[out.length - 1];
    const cur = timeline[i];
    if (prev.time === cur.time && prev.processId === cur.processId) continue;
    out.push(cur);
  }
  return out;
}

/** @param {number} value @param {number} [decimals=1] */
export function roundMetric(value, decimals = 1) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
