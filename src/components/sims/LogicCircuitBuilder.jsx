import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  canConnect,
  CIRCUIT_STORAGE_KEY,
  evaluateCircuit,
  GATE_META,
  QUIZ_CIRCUIT_CHALLENGES,
} from "../../lib/logic/circuit.js";

const PRESETS = {
  and: {
    nodes: [
      { id: "in-1", type: "INPUT", x: 40, y: 80, value: false, label: "A" },
      { id: "in-2", type: "INPUT", x: 40, y: 160, value: false, label: "B" },
      { id: "g-1", type: "AND", x: 180, y: 110, inputCount: 2 },
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
      { id: "g-1", type: "XOR", x: 180, y: 110, inputCount: 2 },
      { id: "out-1", type: "OUTPUT", x: 340, y: 120 },
    ],
    wires: [
      { id: "w1", from: "in-1", to: "g-1", toPort: 0 },
      { id: "w2", from: "in-2", to: "g-1", toPort: 1 },
      { id: "w3", from: "g-1", to: "out-1", toPort: 0 },
    ],
  },
};

let idSeq = 1;
function uid(prefix) {
  return `${prefix}-${idSeq++}`;
}

function portPos(node, side, portIndex = 0) {
  const m = GATE_META[node.type];
  const w = m.w;
  const h = m.h;
  const inputCount = node.type === "NOT" ? 1 : node.inputCount ?? m.inputs;
  if (side === "out") return { x: node.x + w, y: node.y + h / 2 };
  if (inputCount === 1) return { x: node.x, y: node.y + h / 2 };
  const ratio = (portIndex + 1) / (inputCount + 1);
  return { x: node.x, y: node.y + h * ratio };
}

function loadSavedCircuit() {
  try {
    const raw = localStorage.getItem(CIRCUIT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function parseCircuitValue(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clonePreset(key) {
  const p = QUIZ_CIRCUIT_CHALLENGES[key] || PRESETS.and;
  return {
    nodes: p.nodes.map((n) => ({ ...n })),
    wires: p.wires.map((w) => ({ ...w })),
  };
}

export function LogicCircuitBuilder({
  value,
  onChange,
  disabled = false,
  quizMode = false,
  allowedGates = null,
  circuitPreset = null,
}) {
  const challenge = circuitPreset ? clonePreset(circuitPreset) : null;
  const parsedValue = parseCircuitValue(value);
  const saved = !quizMode && !value ? loadSavedCircuit() : null;
  const initial = parsedValue?.nodes?.length
    ? { nodes: parsedValue.nodes, wires: parsedValue.wires ?? [] }
    : challenge || saved || PRESETS.and;

  const canvasRef = useRef(null);
  const skipEmitRef = useRef(true);
  const hydratedRef = useRef(Boolean(parsedValue?.nodes?.length));

  const [nodes, setNodes] = useState(initial.nodes);
  const [wires, setWires] = useState(initial.wires);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [wireFrom, setWireFrom] = useState(null);
  const [wirePreview, setWirePreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedWire, setSelectedWire] = useState(null);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const values = useMemo(() => evaluateCircuit(nodes, wires), [nodes, wires]);

  const pushHistory = useCallback(() => {
    setHistory((h) => [...h.slice(-40), { nodes, wires }]);
    setFuture([]);
  }, [nodes, wires]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [{ nodes, wires }, ...f]);
      setNodes(prev.nodes);
      setWires(prev.wires);
      return h.slice(0, -1);
    });
  }, [nodes, wires]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0];
      setHistory((h) => [...h, { nodes, wires }]);
      setNodes(next.nodes);
      setWires(next.wires);
      return f.slice(1);
    });
  }, [nodes, wires]);

  useEffect(() => {
    if (quizMode || value) return;
    try {
      localStorage.setItem(CIRCUIT_STORAGE_KEY, JSON.stringify({ nodes, wires }));
    } catch {
      /* ignore */
    }
  }, [nodes, wires, quizMode, value]);

  useEffect(() => {
    const parsed = parseCircuitValue(value);
    if (parsed?.nodes?.length && !hydratedRef.current) {
      setNodes(parsed.nodes);
      setWires(parsed.wires ?? []);
      hydratedRef.current = true;
      skipEmitRef.current = true;
    }
  }, [value]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!onChangeRef.current) return;
    if (skipEmitRef.current) {
      skipEmitRef.current = false;
      return;
    }
    onChangeRef.current(JSON.stringify({ nodes, wires }));
  }, [nodes, wires]);

  const gateToolbar = allowedGates?.length ? allowedGates : Object.keys(GATE_META);

  const addGate = useCallback(
    (type) => {
      if (disabled) return;
      pushHistory();
      const id = uid(type.toLowerCase());
      setNodes((prev) => [
        ...prev,
        {
          id,
          type,
          x: 100 + Math.random() * 140,
          y: 50 + Math.random() * 180,
          value: type === "INPUT" ? false : undefined,
          label:
            type === "INPUT"
              ? String.fromCharCode(65 + prev.filter((n) => n.type === "INPUT").length)
              : undefined,
          inputCount: type === "NOT" ? 1 : 2,
        },
      ]);
    },
    [pushHistory, disabled],
  );

  const onCanvasPointerMove = useCallback(
    (e) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (dragging) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === dragging.id
              ? { ...n, x: Math.max(8, x - dragging.ox), y: Math.max(8, y - dragging.oy) }
              : n,
          ),
        );
      }
      if (wireFrom) setWirePreview({ x, y });
    },
    [dragging, wireFrom],
  );

  const endPointer = useCallback(() => {
    setDragging(null);
    setWirePreview(null);
  }, []);

  function startDragNode(e, node) {
    if (disabled) return;
    e.stopPropagation();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setDragging({
      id: node.id,
      ox: e.clientX - rect.left - node.x,
      oy: e.clientY - rect.top - node.y,
    });
    setSelected(node.id);
    setSelectedWire(null);
  }

  function startWire(nodeId, e) {
    if (disabled) return;
    e.stopPropagation();
    setWireFrom(nodeId);
    setSelectedWire(null);
    setError("");
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setWirePreview({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }

  function finishWire(nodeId, port, e) {
    e.stopPropagation();
    if (disabled || !wireFrom) return;
    const check = canConnect(wireFrom, nodeId, port, nodes, wires);
    if (!check.ok) {
      setError(check.reason);
      setWireFrom(null);
      setWirePreview(null);
      return;
    }
    pushHistory();
    setWires((prev) => [
      ...prev.filter((w) => !(w.to === nodeId && w.toPort === port)),
      { id: uid("w"), from: wireFrom, to: nodeId, toPort: port },
    ]);
    setWireFrom(null);
    setWirePreview(null);
    setError("");
  }

  function toggleInput(nodeId) {
    if (disabled) return;
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, value: !n.value } : n)));
  }

  function removeSelected() {
    if (disabled) return;
    if (selectedWire) {
      pushHistory();
      setWires((prev) => prev.filter((w) => w.id !== selectedWire));
      setSelectedWire(null);
      return;
    }
    if (!selected) return;
    pushHistory();
    setNodes((prev) => prev.filter((n) => n.id !== selected));
    setWires((prev) => prev.filter((w) => w.from !== selected && w.to !== selected));
    setSelected(null);
  }

  function loadPreset(key) {
    const p = PRESETS[key];
    if (!p) return;
    pushHistory();
    setNodes(p.nodes);
    setWires(p.wires);
    setSelected(null);
    setWireFrom(null);
  }

  function clearCanvas() {
    pushHistory();
    setNodes([]);
    setWires([]);
    setSelected(null);
  }

  function resetCircuit() {
    if (quizMode && circuitPreset) {
      const p = clonePreset(circuitPreset);
      pushHistory();
      setNodes(p.nodes);
      setWires(p.wires);
      setSelected(null);
      setWireFrom(null);
      return;
    }
    loadPreset("and");
    setNodes((prev) => prev.map((n) => (n.type === "INPUT" ? { ...n, value: false } : n)));
  }

  function increaseInputs(nodeId) {
    pushHistory();
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId || n.type === "NOT" || n.type === "INPUT" || n.type === "OUTPUT") {
          return n;
        }
        const next = Math.min(4, (n.inputCount ?? 2) + 1);
        return { ...n, inputCount: next };
      }),
    );
  }

  return (
    <div className="space-y-4" dir="rtl" data-testid={quizMode ? "logic-circuit-quiz" : undefined}>
      <p className={quizMode ? "text-sm text-slate-300" : "lab-hint"}>
        {quizMode
          ? "أضف بوابة من شريط الأدوات، ثم اسحب من منفذ الخرج (يمين) إلى منفذ الإدخال (يسار)."
          : "اسحب العناصر داخل اللوحة. ابدأ السلك من منفذ الخرج (يمين) واسحبه إلى منفذ الإدخال (يسار). انقر مرتين على مفتاح INPUT لتبديل 0/1."}
      </p>

      <div className="flex flex-wrap gap-2">
        {gateToolbar.map((type) => (
          <button
            key={type}
            type="button"
            data-testid={`logic-gate-add-${type}`}
            onClick={() => addGate(type)}
            disabled={disabled}
            className="rounded-lg border border-violet-500/40 bg-violet-900/40 px-3 py-1.5 text-xs font-bold text-violet-200 hover:bg-violet-800/50 disabled:opacity-40"
          >
            + {GATE_META[type].label}
          </button>
        ))}
        <button type="button" onClick={undo} disabled={disabled} className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40">
          تراجع
        </button>
        <button type="button" onClick={redo} disabled={disabled} className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40">
          إعادة
        </button>
        <button type="button" onClick={removeSelected} disabled={disabled} className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-300 disabled:opacity-40">
          {selectedWire ? "حذف السلك" : "حذف المحدد"}
        </button>
        <button type="button" onClick={resetCircuit} disabled={disabled} className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40">
          إعادة ضبط
        </button>
        {!quizMode ? (
          <>
            <button type="button" onClick={clearCanvas} className="rounded-lg border border-slate-500/40 px-3 py-1.5 text-xs text-slate-300">
              مسح اللوحة
            </button>
            <button type="button" onClick={() => loadPreset("and")} className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300">
              مثال AND
            </button>
            <button type="button" onClick={() => loadPreset("xor")} className="rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300">
              مثال XOR
            </button>
            <select className="lab-select !w-auto text-xs" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-300" role="alert">{error}</p> : null}
      {wireFrom ? <p className="text-xs text-cyan-300">اسحب إلى منفذ إدخال…</p> : null}

      <div
        ref={canvasRef}
        data-testid="logic-circuit-canvas"
        className="relative h-[360px] w-full touch-none overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900"
        onPointerMove={onCanvasPointerMove}
        onPointerUp={endPointer}
        onPointerLeave={endPointer}
        onClick={() => {
          setWireFrom(null);
          setWirePreview(null);
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {wires.map((w) => {
            const fromNode = nodes.find((n) => n.id === w.from);
            const toNode = nodes.find((n) => n.id === w.to);
            if (!fromNode || !toNode) return null;
            const a = portPos(fromNode, "out");
            const b = portPos(toNode, "in", w.toPort ?? 0);
            const active = values[w.from];
            return (
              <line
                key={w.id}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={selectedWire === w.id ? "#f472b6" : active ? "#34d399" : "#475569"}
                strokeWidth={selectedWire === w.id ? 3 : 2}
                className="pointer-events-auto cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWire(w.id);
                  setSelected(null);
                }}
              />
            );
          })}
          {wireFrom && wirePreview ? (() => {
            const fromNode = nodes.find((n) => n.id === wireFrom);
            if (!fromNode) return null;
            const a = portPos(fromNode, "out");
            return (
              <line
                x1={a.x}
                y1={a.y}
                x2={wirePreview.x}
                y2={wirePreview.y}
                stroke="#22d3ee"
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            );
          })() : null}
        </svg>

        {nodes.map((node) => {
          const m = GATE_META[node.type];
          const out = values[node.id];
          const isOn = node.type === "INPUT" ? node.value : out;
          const inputCount = node.type === "NOT" ? 1 : node.inputCount ?? m.inputs;
          return (
            <div
              key={node.id}
              data-testid={`logic-node-${node.id}`}
              data-gate-type={node.type}
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
              onPointerDown={(e) => startDragNode(e, node)}
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
                        node.value ? "border-emerald-300 bg-emerald-400" : "border-slate-500 bg-slate-700"
                      }`}
                    />
                  </>
                ) : node.type === "OUTPUT" ? (
                  <>
                    <span className="mb-0.5 text-[9px] text-slate-300">مصباح</span>
                    <span
                      className={`h-6 w-6 rounded-full border-2 ${
                        isOn ? "border-yellow-200 bg-yellow-300 shadow-[0_0_12px_#fde047]" : "border-slate-600 bg-slate-800"
                      }`}
                    />
                  </>
                ) : (
                  <>
                    {m.label}
                    {node.type !== "NOT" ? (
                      <button
                        type="button"
                        className="mt-1 text-[9px] text-cyan-200 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseInputs(node.id);
                        }}
                      >
                        + مدخل ({inputCount})
                      </button>
                    ) : null}
                  </>
                )}
              </div>
              {m.outputs ? (
                <span
                  data-testid={`logic-port-${node.id}-out`}
                  className="absolute -right-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-cyan-400 hover:scale-110"
                  style={{ pointerEvents: "auto", cursor: "crosshair" }}
                  onPointerDown={(e) => startWire(node.id, e)}
                />
              ) : null}
              {Array.from({ length: inputCount }).map((_, port) => (
                <span
                  key={port}
                  data-testid={`logic-port-${node.id}-in-${port}`}
                  className="absolute -left-1 h-4 w-4 rounded-full border-2 border-slate-900 bg-slate-400 hover:bg-cyan-300"
                  style={{
                    top: `${((port + 1) / (inputCount + 1)) * 100}%`,
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    cursor: "crosshair",
                  }}
                  onPointerUp={(e) => finishWire(node.id, port, e)}
                />
              ))}
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
