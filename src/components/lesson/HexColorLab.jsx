import { useMemo, useState } from "react";

function channelToHex(n) {
  const v = Math.max(0, Math.min(255, Math.round(n)));
  return v.toString(16).toUpperCase().padStart(2, "0");
}

function hexToChannel(h) {
  const v = parseInt(h, 16);
  return Number.isNaN(v) ? 0 : Math.max(0, Math.min(255, v));
}

export function HexColorLab({ initial = { r: 255, g: 0, b: 0 } }) {
  const [r, setR] = useState(initial.r);
  const [g, setG] = useState(initial.g);
  const [b, setB] = useState(initial.b);
  const [hexInput, setHexInput] = useState("");

  const hex = useMemo(() => `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`, [r, g, b]);

  const steps = useMemo(
    () => [
      { channel: "R", dec: r, hex: channelToHex(r) },
      { channel: "G", dec: g, hex: channelToHex(g) },
      { channel: "B", dec: b, hex: channelToHex(b) },
    ],
    [r, g, b]
  );

  function applyHex() {
    const clean = hexInput.replace(/^#/, "").trim();
    if (clean.length !== 6) return;
    setR(hexToChannel(clean.slice(0, 2)));
    setG(hexToChannel(clean.slice(2, 4)));
    setB(hexToChannel(clean.slice(4, 6)));
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div
        className="h-24 w-full rounded-xl border-2 border-slate-200 shadow-inner"
        style={{ backgroundColor: hex }}
      />
      <p className="text-center text-lg font-bold font-mono" dir="ltr">
        {hex}
      </p>

      {["R", "G", "B"].map((label, i) => {
        const val = [r, g, b][i];
        const set = [setR, setG, setB][i];
        const color = label === "R" ? "text-red-600" : label === "G" ? "text-green-600" : "text-blue-600";
        return (
          <div key={label}>
            <label className={`text-sm font-semibold ${color}`}>
              {label} = {val} ({channelToHex(val)}₁₆)
            </label>
            <input
              type="range"
              min={0}
              max={255}
              value={val}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full"
            />
          </div>
        );
      })}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-violet-100">
            <th className="border px-2 py-2">قناة</th>
            <th className="border px-2 py-2">عشري</th>
            <th className="border px-2 py-2">hex</th>
          </tr>
        </thead>
        <tbody>
          {steps.map((row) => (
            <tr key={row.channel} className="text-center">
              <td className="border px-2 py-2">{row.channel}</td>
              <td className="border px-2 py-2">{row.dec}</td>
              <td className="border px-2 py-2 font-mono">{row.hex}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap gap-2">
        <input
          className="rounded border px-3 py-2 font-mono text-sm"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          placeholder="#FF0000"
          dir="ltr"
        />
        <button type="button" className="edu-btn edu-btn-outline text-sm" onClick={applyHex}>
          تطبيق hex
        </button>
      </div>
      <p className="text-xs text-slate-500">CSS: background-color: {hex};</p>
    </div>
  );
}
