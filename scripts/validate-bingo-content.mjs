#!/usr/bin/env node
import { BINGO_CELLS } from "../src/content/onboarding/onboardingContent.js";
import { assertValidBingoContent } from "../src/content/onboarding/validateBingoContent.js";

try {
  assertValidBingoContent(BINGO_CELLS);
  console.log(JSON.stringify({ ok: true, cells: BINGO_CELLS.length, fillable: BINGO_CELLS.filter((c) => !c.free).length }));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: err.message }));
  process.exit(1);
}
