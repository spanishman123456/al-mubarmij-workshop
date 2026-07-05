import { gradeLogicCircuit, logicCircuitModelLabel } from "../logic/circuit.js";
import { createCardEngine } from "../binaryCards/placeValueCardsLogic.js";
import { buildTruthTable } from "../logic/truthTable.js";

function parseJson(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function gradeTruthTable(question, userAnswer) {
  const expr = question.logicExpr || "(NOT p AND q) OR r";
  const table = buildTruthTable(expr, question.varCount || 3);
  if (!table.ok) return false;
  const answers = parseJson(userAnswer);
  if (!answers) return false;
  return table.rows.every((row, ri) => String(answers[`${ri}:result`]) === String(row.result));
}

export function gradeCardFlip(question, userAnswer) {
  const engine = createCardEngine(question.cardValues || [16, 8, 4, 2, 1]);
  return engine.checkTarget(engine.parseState(userAnswer), question.target);
}

export function gradeCardSheet(question, userAnswer) {
  const targets = question.targets || [];
  const engine = createCardEngine(question.cardValues || [16, 8, 4, 2, 1]);
  const sheet = parseJson(userAnswer) || {};
  return targets.every((t) => engine.checkTarget(sheet[String(t)] || engine.initialCardState(false), t));
}

export function gradeMatch(question, userAnswer) {
  const parsed = parseJson(userAnswer);
  const expected = question.correctPairs || {};
  const keys = Object.keys(expected);
  if (!keys.length) return false;
  return keys.every((k) => String(parsed?.[k]) === String(expected[k]));
}

export function gradeOrder(question, userAnswer) {
  const parsed = parseJson(userAnswer);
  const expected = question.correctOrder || [];
  if (!Array.isArray(parsed) || parsed.length !== expected.length) return false;
  return parsed.every((v, i) => Number(v) === Number(expected[i]));
}

export { gradeLogicCircuit, logicCircuitModelLabel };

export function gradeFlowchart(question, userAnswer) {
  const expected = question.correctFlow || {};
  const assignment = parseJson(userAnswer) || {};
  const keys = Object.keys(expected);
  if (!keys.length) return false;
  return keys.every((k) => assignment[k] === expected[k]);
}

export function truthTableModelAnswer(question) {
  const expr = question.logicExpr || "(NOT p AND q) OR r";
  const table = buildTruthTable(expr, question.varCount || 3);
  if (!table.ok) return null;
  return table.rows.map((r) => r.result).join("");
}
