import { describe, expect, it } from "vitest";
import {
  gradeCardFlip,
  gradeCardSheet,
  gradeFlowchart,
  gradeLogicCircuit,
  gradeTruthTable,
  truthTableModelAnswer,
} from "./grading.js";

describe("quiz grading", () => {
  it("grades truth table pre-04", () => {
    const q = { logicExpr: "(NOT p AND q) OR r", varCount: 3 };
    const key = truthTableModelAnswer(q);
    expect(key).toHaveLength(8);
    const answers = {};
    for (let i = 0; i < 8; i += 1) answers[`${i}:result`] = key[i];
    expect(gradeTruthTable(q, JSON.stringify(answers))).toBe(true);
  });

  it("grades binary cards target 5", () => {
    const q = { target: 5, cardValues: [16, 8, 4, 2, 1] };
    const state = { 16: false, 8: false, 4: true, 2: false, 1: true };
    expect(gradeCardFlip(q, JSON.stringify(state))).toBe(true);
  });

  it("grades binary cards sheet", () => {
    const q = { targets: [13, 27], cardValues: [16, 8, 4, 2, 1] };
    const sheet = {
      13: { 16: false, 8: true, 4: true, 2: false, 1: true },
      27: { 16: true, 8: true, 4: false, 2: true, 1: true },
    };
    expect(gradeCardSheet(q, JSON.stringify(sheet))).toBe(true);
  });

  it("grades flowchart slot assignment pre-18-flow", () => {
    const q = {
      correctFlow: { 1: "oval", 2: "parallelogram", 3: "diamond", 4: "rectangle", 5: "oval" },
    };
    const answer = { 1: "oval", 2: "parallelogram", 3: "diamond", 4: "rectangle", 5: "oval" };
    expect(gradeFlowchart(q, JSON.stringify(answer))).toBe(true);
  });

  it("grades flowchart symbol match pre-19", () => {
    const q = {
      correctFlow: { oval: "start-end", parallelogram: "io", diamond: "decision", rectangle: "process" },
    };
    const answer = { oval: "start-end", parallelogram: "io", diamond: "decision", rectangle: "process" };
    expect(gradeFlowchart(q, JSON.stringify(answer))).toBe(true);
  });

  it("grades logic circuit AND gate pre-logic-and", () => {
    const q = {
      circuitGate: "AND",
      expectedOutputs: [false, false, false, true],
    };
    const answer = {
      nodes: [
        { id: "in-a", type: "INPUT", x: 36, y: 72, value: false, label: "A" },
        { id: "in-b", type: "INPUT", x: 36, y: 152, value: false, label: "B" },
        { id: "g-1", type: "AND", x: 200, y: 110, inputCount: 2 },
        { id: "out-1", type: "OUTPUT", x: 400, y: 112 },
      ],
      wires: [
        { id: "w1", from: "in-a", to: "g-1", toPort: 0 },
        { id: "w2", from: "in-b", to: "g-1", toPort: 1 },
        { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
      ],
    };
    expect(gradeLogicCircuit(q, JSON.stringify(answer))).toBe(true);
  });

  it("grades logic circuit NOT gate pre-logic-not", () => {
    const q = {
      circuitGate: "NOT",
      expectedOutputs: [true, false],
    };
    const answer = {
      nodes: [
        { id: "in-a", type: "INPUT", x: 36, y: 112, value: false, label: "A" },
        { id: "g-1", type: "NOT", x: 200, y: 112 },
        { id: "out-1", type: "OUTPUT", x: 400, y: 112 },
      ],
      wires: [
        { id: "w1", from: "in-a", to: "g-1", toPort: 0 },
        { id: "w2", from: "g-1", to: "out-1", toPort: 0 },
      ],
    };
    expect(gradeLogicCircuit(q, JSON.stringify(answer))).toBe(true);
  });
});
