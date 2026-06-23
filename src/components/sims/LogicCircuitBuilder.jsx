import { useCallback, useMemo, useRef, useState } from "react";

const GATE_META = {
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

const PRESETS = {
  and: {
    nodes: [
      { id: "in-1", type: "INPUT", x: 40, y: 80, value: false, label: "A" },
      { id: "in-2", type: "INPUT", x: 40, y: 160, value: false, label: "B" },
      { id: "g-1", type: "AND", x: 180, y: 110 },
      { id: "out-1", type: "OUTPUT", x: 340, y: 120 },
    ],
    wires: [
      { id: "w1", from: "in-1", to: "g-1", toPort: 0 },
      { id: "w2", from: "in-2", to: "g-1", toPort: 1 },
      { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
    ],
  },
  xor: {
    nodes: [
      { id: "in-1", type: "INPUT", x: 40, y: 80, value: true, label: "A" },
      { id: "in-2", type: "INPUT", x: 40, y: 160, value: false, label: "B" },
      { id: "g-1", type: "XOR", x: 180, y: 110 },
      { id: "out-1", type: "OUTPUT", x: 340, y: 120 },
    ],
    wires: [
      { id: "w1", from: "in-1", to: "g-1", toPort: 0 },
      { id: "w2", from: "in-2", to: "g-1", toPort: 1 },
      { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
    ],
  },
};

const OPS = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XOR: (a, b) => a !== b,
  XNOR: (a, b) => a === b,
  NOT: (a) => !a,
};

let idSeq = 1;
function uid(prefix) {
  return `${prefix}-${idSeq++}`;
}

function evaluateCircuit(nodes, wires) {
  const values = {};
  const inputs = nodes.filter((n) => n.type === "INPUT");
  inputs.forEach((n) => {
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
    const inVals = [];
    for (let i = 0; i < (GATE_META[node.type]?.inputs || 0); i++) {
      const wire = ins.find((x) => x.port === i) || ins[i];
      inVals.push(wire ? Boolean(values[wire.from]) : false);
    }
    if (node.type === "NOT") values[id] = OPS.NOT(inVals[0]);
    else if (node.type === "OUTPUT") values[id] = inVals[0] ?? false;
    else if (OPS[node.type]) values[id] = OPS[node.type](inVals[0], inVals[1]);
    else values[id] = false;
  }

  return values;
}

export function LogicCircuitBuilder() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([
    { id: "in-1", type: "INPUT", x: 40, y: 80, value: false, label: "A" },
    { id: "in-2", type: "INPUT", x: 40, y: 160, value: false, label: "B" },
    { id: "g-1", type: "AND", x: 180, y: 110 },
    { id: "out-1", type: "OUTPUT", x: 340, y: 120 },
  ]);
  const [wires, setWires] = useState([
    { id: "w1", from: "in-1", to: "g-1", toPort: 0 },
    { id: "w2", from: "in-2", to: "g-1", toPort: 1 },
    { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
  ]);
  const [dragging, setDragging] = useState(null);
  const [wireFrom, setWireFrom] = useState(null);
  const [selected, setSelected] = useState(null);

  const values = useMemo(() => evaluateCircuit(nodes, wires), [nodes, wires]);

  const addGate = useCallback((type) => {
    const id = uid(type.toLowerCase());
    setNodes((prev) => [
      ...prev,
      {
        id,
        type,
        x: 120 + Math.random() * 120,
        y: 60 + Math.random() * 160,
        value: type === "INPUT" ? false : undefined,
        label: type === "INPUT" ? String.fromCharCode(65 + prev.filter((n) => n.type === "INPUT").length) : undefined,
      },
    ]);
  }, []);

  const onCanvasMouseMove = useCallback(
    (e) => {
      if (!dragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragging.ox;
      const y = e.clientY - rect.top - dragging.oy;
      setNodes((prev) =>
        prev.map((n) => (n.id === dragging.id ? { ...n, x: Math.max(8, x), y: Math.max(8, y) } : n)),
      );
    },
    [dragging],
  );

  const endDrag = useCallback(() => setDragging(null), []);

  function startDragNode(e, node) {
    e.stopPropagation();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragging({
      id: node.id,
      ox: e.clientX - rect.left - node.x,
      oy: e.clientY - rect.top - node.y,
    });
    setSelected(node.id);
  }

  function portPos(node, side) {
    const m = GATE_META[node.type];
    const w = m.w;
    const h = m.h;
    if (side === "out") return { x: node.x + w, y: node.y + h / 2 };
    if (node.type === "NOT") return { x: node.x, y: node.y + h / 2 };
    if (side === "in0") return { x: node.x, y: node.y + h * 0.35 };
    if (side === "in1") return { x: node.x, y: node.y + h * 0.65 };
    return { x: node.x, y: node.y + h / 2 };
  }

  function handleOutputClick(nodeId) {
    if (wireFrom) {
      setWireFrom(null);
      return;
    }
    setWireFrom(nodeId);
  }

  function handleInputClick(nodeId, port) {
    if (!wireFrom || wireFrom === nodeId) return;
    setWires((prev) => [
      ...prev.filter((w) => !(w.to === nodeId && w.toPort === port)),
      { id: uid("w"), from: wireFrom, to: nodeId, toPort: port },
    ]);
    setWireFrom(null);
  }

  function toggleInput(nodeId) {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, value: !n.value } : n)),
    );
  }

  function removeSelected() {
    if (!selected) return;
    setNodes((prev) => prev.filter((n) => n.id !== selected));
    setWires((prev) => prev.filter((w) => w.from !== selected && w.to !== selected));
    setSelected(null);
  }

  function loadPreset(key) {
    const p = PRESETS[key];
    if (!p) return;
    setNodes(p.nodes);
    setWires(p.wires);
    setSelected(null);
    setWireFrom(null);
  }

  function resetCircuit() {
    loadPreset("and");
    setNodes((prev) => prev.map((n) => (n.type === "INPUT" ? { ...n, value: false } : n)));
  }

  return (
    <div className="space-y-4" dir="rtl">
      <p className="lab-hint">
        اسحب البوابات من الشريط إلى اللوحة. انقر مخرجاً (دائرة يمين) ثم مدخلاً (دائرة يسار) للتوصيل.
        انقر مرتين على مدخل INPUT لتبديل 0/1، أو استخدم الأزرار أسفل اللوحة.
      </p>

      <div className="flex flex-wrap gap-2">
        {Object.keys(GATE_META).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addGate(type)}
            className="rounded-lg border border-violet-500/40 bg-violet-900/40 px-3 py-1.5 text-xs font-bold text-violet-200 hover:bg-violet-800/50"
          >
            + {GATE_META[type].label}
          </button>
        ))}
        <button
          type="button"
          onClick={removeSelected}
          className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/30"
        >
          حذف المحدد
        </button>
        <button
          type="button"
          onClick={resetCircuit}
          className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800/50"
        >
          إعادة ضبط
        </button>
        <button
          type="button"
          onClick={() => loadPreset("and")}
          className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900/30"
        >
          مثال AND
        </button>
        <button
          type="button"
          onClick={() => loadPreset("xor")}
          className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-900/30"
        >
          مثال XOR
        </button>
        {wireFrom ? (
          <span className="self-center text-xs text-cyan-300">وضع التوصيل — اختر مدخل الهدف</span>
        ) : null}
      </div>

      <div
        ref={canvasRef}
        className="relative h-[320px] w-full overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900"
        onMouseMove={onCanvasMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClick={() => setWireFrom(null)}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {wires.map((w) => {
            const fromNode = nodes.find((n) => n.id === w.from);
            const toNode = nodes.find((n) => n.id === w.to);
            if (!fromNode || !toNode) return null;
            const a = portPos(fromNode, "out");
            const b = portPos(toNode, w.toPort === 1 ? "in1" : "in0");
            const active = values[w.from];
            return (
              <line
                key={w.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "#34d399" : "#475569"}
                strokeWidth={2}
              />
            );
          })}
        </svg>

        {nodes.map((node) => {
          const m = GATE_META[node.type];
          const out = values[node.id];
          const isOn = node.type === "INPUT" ? node.value : out;
          return (
            <div
              key={node.id}
              className={`absolute cursor-grab select-none rounded-lg border-2 active:cursor-grabbing ${
                selected === node.id ? "ring-2 ring-cyan-400" : ""
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: m.w,
                height: m.h,
                borderColor: m.color,
                background: `${m.color}22`,
              }}
              onMouseDown={(e) => startDragNode(e, node)}
              onDoubleClick={(e) => {
                if (node.type === "INPUT") {
                  e.stopPropagation();
                  toggleInput(node.id);
                }
              }}
            >
              <div className="flex h-full flex-col items-center justify-center text-xs font-bold text-white">
                {node.type === "INPUT" ? (
                  <>
                    <span className="mb-0.5 text-[9px] text-slate-300">مفتاح</span>
                    <span>{node.label}</span>
                    <span
                      className={`mt-1 h-4 w-4 rounded-full border-2 ${
                        node.value ? "border-emerald-300 bg-emerald-400 shadow-[0_0_8px_#34d399]" : "border-slate-500 bg-slate-700"
                      }`}
                    />
                    <span className="text-[10px] text-emerald-300">{node.value ? "1" : "0"}</span>
                  </>
                ) : node.type === "OUTPUT" ? (
                  <>
                    <span className="mb-0.5 text-[9px] text-slate-300">مصباح</span>
                    <span
                      className={`h-6 w-6 rounded-full border-2 ${
                        isOn
                          ? "border-yellow-200 bg-yellow-300 shadow-[0_0_12px_#fde047]"
                          : "border-slate-600 bg-slate-800"
                      }`}
                    />
                    <span className="text-[10px]">{isOn ? "ON" : "OFF"}</span>
                  </>
                ) : (
                  m.label
                )}
              </div>
              <span
                className={`absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-slate-900 ${
                  isOn ? "bg-emerald-400" : "bg-slate-600"
                }`}
                style={{ pointerEvents: "auto", cursor: "crosshair" }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (m.outputs) handleOutputClick(node.id);
                }}
              />
              {m.inputs >= 1 ? (
                <span
                  className="absolute -left-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-slate-500"
                  style={{
                    top: node.type === "NOT" ? "50%" : "35%",
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    cursor: "crosshair",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInputClick(node.id, 0);
                  }}
                />
              ) : null}
              {m.inputs >= 2 ? (
                <span
                  className="absolute -left-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-slate-500"
                  style={{ top: "65%", transform: "translateY(-50%)", pointerEvents: "auto", cursor: "crosshair" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInputClick(node.id, 1);
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        {nodes
          .filter((n) => n.type === "INPUT")
          .map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => toggleInput(n.id)}
              className={`rounded-lg px-3 py-2 font-bold ${n.value ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"}`}
            >
              {n.label} = {n.value ? "1" : "0"}
            </button>
          ))}
        {nodes
          .filter((n) => n.type === "OUTPUT")
          .map((n) => (
            <div key={n.id} className="lab-result inline-block">
              OUT = {values[n.id] ? "1" : "0"}
            </div>
          ))}
      </div>
    </div>
  );
}
