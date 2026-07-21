/**
 * BINGO onboarding content validation — shared by client, server, build, and tests.
 */

export const BINGO_ACTIVITY_ID = "onboarding-bingo";
export const BINGO_GRID_SIZE = 5;
export const BINGO_EXPECTED_TOTAL = BINGO_GRID_SIZE * BINGO_GRID_SIZE;
export const BINGO_EXPECTED_FREE = 1;
export const BINGO_EXPECTED_FILLABLE = BINGO_EXPECTED_TOTAL - BINGO_EXPECTED_FREE;

export const BINGO_INSTRUCTIONS_AR =
  "ابحث عن زميل في الصف تنطبق عليه كل صفة، واكتب اسمه في الخانة المناسبة. أكمل صفًا أو عمودًا للفوز، ثم أرسل النشاط.";

export const BINGO_TITLE_AR = "نشاط BINGO — كسر الجليد";

export function validateBingoCells(cells) {
  const errors = [];

  if (!Array.isArray(cells)) {
    return { ok: false, errors: ["BINGO_CELLS must be an array"] };
  }

  if (cells.length !== BINGO_EXPECTED_TOTAL) {
    errors.push(`expected ${BINGO_EXPECTED_TOTAL} cells, got ${cells.length}`);
  }

  const ids = new Set();
  let freeCount = 0;

  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    if (!cell || typeof cell !== "object") {
      errors.push(`cell at index ${i} is missing or invalid`);
      continue;
    }
    if (!cell.id || typeof cell.id !== "string") {
      errors.push(`cell at index ${i} missing id`);
    } else if (ids.has(cell.id)) {
      errors.push(`duplicate cell id: ${cell.id}`);
    } else {
      ids.add(cell.id);
    }
    if (!cell.free && (!cell.labelAr || !String(cell.labelAr).trim())) {
      errors.push(`cell ${cell.id || i} missing labelAr`);
    }
    if (cell.free) freeCount += 1;
  }

  if (freeCount !== BINGO_EXPECTED_FREE) {
    errors.push(`expected ${BINGO_EXPECTED_FREE} free cell(s), got ${freeCount}`);
  }

  const centerIndex = Math.floor(BINGO_EXPECTED_TOTAL / 2);
  if (cells[centerIndex] && !cells[centerIndex].free) {
    errors.push("center cell should be marked free");
  }

  return { ok: errors.length === 0, errors };
}

export function getFillableBingoCells(cells) {
  return cells.filter((c) => c && !c.free);
}

export function getBingoCellAt(cells, row, col) {
  const index = row * BINGO_GRID_SIZE + col;
  return cells[index] ?? null;
}

export function computeBingoProgress(cells, savedCells = {}) {
  const fillable = getFillableBingoCells(cells);
  const filledCount = fillable.filter((c) => String(savedCells[c.id] || "").trim()).length;
  const percent = fillable.length ? Math.round((filledCount / fillable.length) * 100) : 0;
  return { fillable, filledCount, percent, totalFillable: fillable.length };
}

export function createInitialBingoStudentState() {
  return {
    activityId: BINGO_ACTIVITY_ID,
    status: "not_started",
    cells: {},
    startedAt: null,
    completedAt: null,
    submittedAt: null,
  };
}

export function normalizeBingoStudentState(raw) {
  const base = createInitialBingoStudentState();
  if (!raw || typeof raw !== "object") return base;
  return {
    ...base,
    status: raw.status || base.status,
    cells: raw.cells && typeof raw.cells === "object" ? raw.cells : {},
    startedAt: raw.startedAt ?? null,
    completedAt: raw.completedAt ?? null,
    submittedAt: raw.submittedAt ?? null,
  };
}

export function listCompletedBingoLines(cells, savedCells = {}) {
  const wins = [];
  for (let r = 0; r < BINGO_GRID_SIZE; r += 1) {
    const rowCells = Array.from({ length: BINGO_GRID_SIZE }, (_, col) => getBingoCellAt(cells, r, col)).filter(
      (c) => c && !c.free,
    );
    if (rowCells.length && rowCells.every((c) => String(savedCells[c.id] || "").trim())) {
      wins.push(`صف ${r + 1}`);
    }
  }
  for (let col = 0; col < BINGO_GRID_SIZE; col += 1) {
    const colCells = Array.from({ length: BINGO_GRID_SIZE }, (_, r) => getBingoCellAt(cells, r, col)).filter(
      (c) => c && !c.free,
    );
    if (colCells.length && colCells.every((c) => String(savedCells[c.id] || "").trim())) {
      wins.push(`عمود ${col + 1}`);
    }
  }
  return wins;
}

export function assertValidBingoContent(cells) {
  const result = validateBingoCells(cells);
  if (!result.ok) {
    throw new Error(`Invalid BINGO content: ${result.errors.join("; ")}`);
  }
  return result;
}
