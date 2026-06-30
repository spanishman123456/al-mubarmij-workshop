import { useState } from "react";
import { MGL_HARDWARE } from "../types.js";

const BUTTONS = [
  { id: "up", label: "UP", pin: "P0" },
  { id: "down", label: "DOWN", pin: "P1" },
  { id: "ok", label: "OK", pin: "P2" },
  { id: "back", label: "BACK", pin: "P8" },
];

const SWITCHES = [
  { id: "swA", label: "Switch A", pin: "P13" },
  { id: "swB", label: "Switch B", pin: "P14" },
];

/**
 * @param {{ lcdLines?: [string, string], ledGreen?: boolean, ledRed?: boolean }} props
 */
export default function HardwarePreview({
  lcdLines = ["Micro:bit Game", "Unified Board"],
  ledGreen = false,
  ledRed = false,
}) {
  const [pressed, setPressed] = useState({});
  const [switches, setSwitches] = useState({ swA: false, swB: false });

  function toggleBtn(id) {
    setPressed((p) => ({ ...p, [id]: !p[id] }));
    setTimeout(() => setPressed((p) => ({ ...p, [id]: false })), 200);
  }

  function toggleSw(id) {
    setSwitches((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="mgl-hw">
      <p className="mgl-hw__note">
        نجاح شاشة LCD يعتمد على العتاد الحقيقي ونوع وحدة I2C، وليس على المحاكي.
      </p>
      <div className="mgl-hw__layout">
        <div className="mgl-hw__lcd">
          <div className="mgl-hw__lcd-header">
            HD44780 16×2 · I2C 0x27 / 0x3F · SDA P{MGL_HARDWARE.LCD_SDA} · SCL P
            {MGL_HARDWARE.LCD_SCL}
          </div>
          <div className="mgl-hw__lcd-screen">
            <div className="mgl-hw__lcd-line" dir="ltr">
              {(lcdLines[0] || "").padEnd(16, " ").slice(0, 16)}
            </div>
            <div className="mgl-hw__lcd-line" dir="ltr">
              {(lcdLines[1] || "").padEnd(16, " ").slice(0, 16)}
            </div>
          </div>
        </div>

        <div className="mgl-hw__controls">
          <div className="mgl-hw__group">
            <span className="mgl-hw__group-label">أزرار (Pull-Up)</span>
            <div className="mgl-hw__btn-row">
              {BUTTONS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`mgl-hw__btn${pressed[b.id] ? " mgl-hw__btn--pressed" : ""}`}
                  onClick={() => toggleBtn(b.id)}
                >
                  <span>{b.label}</span>
                  <small>{b.pin}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="mgl-hw__group">
            <span className="mgl-hw__group-label">مفاتيح</span>
            <div className="mgl-hw__btn-row">
              {SWITCHES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`mgl-hw__switch${switches[s.id] ? " mgl-hw__switch--on" : ""}`}
                  onClick={() => toggleSw(s.id)}
                >
                  <span>{s.label}</span>
                  <small>{s.pin}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="mgl-hw__group">
            <span className="mgl-hw__group-label">LEDs</span>
            <div className="mgl-hw__led-row">
              <div className={`mgl-hw__led mgl-hw__led--green${ledGreen ? " mgl-hw__led--on" : ""}`}>
                <span>Green P12</span>
              </div>
              <div className={`mgl-hw__led mgl-hw__led--red${ledRed ? " mgl-hw__led--on" : ""}`}>
                <span>Red P16</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
