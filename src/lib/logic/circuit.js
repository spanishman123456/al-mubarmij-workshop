/** تقييم الدوائر المنطقية — منطق منفصل عن الواجهة */

export const GATE_META = {
  INPUT: { label: "مدخل", inputs: 0, outputs: 1, color: "#10b981", w: 56, h: 40 },
  OUTPUT: { label: "مخرج", inputs: 1, outputs: 0, color: "#ec4899", w: 56, h: 40 },
  AND: { label: "AND", inputs: 2, outputs: 1, color: "#7c3aed", w: 72, h: 48 },
  OR: { label: "OR", inputs: 2, outputs: 1, color: "#6366f1", w: 72, h: 48 },
  NOT: { label: "NOT", inputs: 1, outputs: 1, color: "#8b5cf6", w: 64, h: 40 },
  NAND: { label: "NAND", inputs: 2, outputs: 1, color: "#a855f7", w: 72, h: 48 },
  NOR: { label: "NOR", inputs: 2, outputs: 1, color: "#9333ea", w: 72, h: 48 },
  XOR: { label: "XOR", inputs: 2, outputs: 1, color: "#c084fc", w: 72, h: 48 },
  XNOR: { label: "XNOR", inputs: 2, outputs: 1, color: "#d8b4fe", w: 72, h: 48 },
};

export const OPS = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XOR: (a, b) => a !== b,
  XNOR: (a, b) => a === b,
  NOT: (a) => !a,
};

/**
 * @param {{ id: string, type: string, value?: boolean, inputCount?: number }[]} nodes
 * @param {{ id: string, from: string, to: string, toPort?: number }[]} wires
 */
export function evaluateCircuit(nodes, wires) {
  const values = {};
  nodes
    .filter((n) => n.type === "INPUT")
    .forEach((n) => {
      values[n.id] = Boolean(n.value);
    });

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const incoming = {};
  wires.forEach((w) => {
    if (!incoming[w.to]) incoming[w.to] = [];
    incoming[w.to].push({ from: w.from, port: w.toPort ?? 0 });
  });

  const order = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(id) {
    if (visited.has(id)) return;
    if (visiting.has(id)) return;
    visiting.add(id);
    (incoming[id] || []).forEach(({ from }) => visit(from));
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  nodes.forEach((n) => {
    if (n.type !== "INPUT") visit(n.id);
  });

  for (const id of order) {
    const node = byId[id];
    if (!node || node.type === "INPUT") continue;
    const ins = incoming[id] || [];
    const inputCount = node.type === "NOT" ? 1 : node.inputCount ?? GATE_META[node.type]?.inputs ?? 0;
    const inVals = [];
    for (let i = 0; i < inputCount; i += 1) {
      const wire = ins.find((x) => x.port === i) || ins[i];
      inVals.push(wire ? Boolean(values[wire.from]) : false);
    }
    if (node.type === "NOT") values[id] = OPS.NOT(inVals[0]);
    else if (node.type === "OUTPUT") values[id] = inVals[0] ?? false;
    else if (OPS[node.type]) {
      values[id] = inputCount <= 2
        ? OPS[node.type](inVals[0], inVals[1])
        : inVals.slice(0, inputCount).reduce((acc, v, idx) => (idx === 0 ? v : OPS[node.type](acc, v)), false);
    } else values[id] = false;
  }

  return values;
}

/**
 * @param {string} fromNodeId
 * @param {string} toNodeId
 * @param {number} toPort
 * @param {{ id: string, type: string }[]} nodes
 * @param {{ from: string, to: string, toPort?: number }[]} wires
 */
export function canConnect(fromNodeId, toNodeId, toPort, nodes, wires) {
  if (fromNodeId === toNodeId) return { ok: false, reason: "لا يمكن توصيل العنصر بنفسه." };
  const fromNode = nodes.find((n) => n.id === fromNodeId);
  const toNode = nodes.find((n) => n.id === toNodeId);
  if (!fromNode || !toNode) return { ok: false, reason: "عنصر غير موجود." };
  if (fromNode.type === "OUTPUT") return { ok: false, reason: "لا يمكن البدء من مخرج." };
  if (fromNode.type === "INPUT" && toNode.type === "INPUT") {
    return { ok: false, reason: "لا يمكن توصيل مدخل بمدخل." };
  }
  if (GATE_META[fromNode.type]?.outputs === 0 && fromNode.type !== "INPUT") {
    return { ok: false, reason: "لا يمكن البدء من مدخل." };
  }
  if (toNode.type === "OUTPUT" && toPort !== 0) {
    return { ok: false, reason: "منفذ غير صالح." };
  }
  if (toNode.type !== "OUTPUT" && toNode.type !== "INPUT") {
    const meta = GATE_META[toNode.type];
    if (meta && toPort >= (toNode.inputCount ?? meta.inputs)) {
      return { ok: false, reason: "منفذ إدخال غير موجود." };
    }
  }
  const duplicateSource = wires.some((w) => w.to === toNodeId && w.toPort === toPort);
  if (duplicateSource) {
    return { ok: false, reason: "هذا المدخل موصول بالفعل — احذف السلك أولًا." };
  }
  if (GATE_META[toNode.type]?.outputs && GATE_META[fromNode.type]?.outputs === 0 && fromNode.type !== "INPUT") {
    return { ok: false, reason: "لا يمكن توصيل خرج بخرج." };
  }
  return { ok: true };
}

export const CIRCUIT_STORAGE_KEY = "mubarmij-logic-circuit-v1";
