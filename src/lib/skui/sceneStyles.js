/** أنماط المشهد — هوية بصرية فريدة لكل تطبيق */
export const SKUI_SCENE_CSS = `
body.scene-guess{background:radial-gradient(circle at 15% 10%,#fb923c44,transparent 38%),radial-gradient(circle at 85% 20%,#ef444433,transparent 34%),linear-gradient(155deg,#1a0a08,#3b1111 48%,#120608)}
body.scene-guess .sk-App{background:linear-gradient(160deg,#ffffff1a,#7f1d1d33);border-color:#fb718566;box-shadow:0 28px 80px #7f1d1d55}
body.scene-guess .sk-Guide{background:linear-gradient(135deg,#ea580c33,#dc262622);border-color:#fb923c66}
body.scene-guess .sk-Card{background:linear-gradient(150deg,#431407cc,#1c1917aa);border-color:#f9731655}
body.scene-guess .sk-Badge{background:linear-gradient(90deg,#ea580c,#f59e0b)}
body.scene-guess .sk-Alert{background:#7c2d1244;border-color:#fb923c55}

body.scene-calculator{background:radial-gradient(circle at 80% 0%,#22c55e22,transparent 40%),linear-gradient(160deg,#020617,#0f172a 45%,#052e16)}
body.scene-calculator .sk-App{background:linear-gradient(155deg,#0f172acc,#14532d44);border-color:#22c55e55;box-shadow:0 24px 70px #052e1655}
body.scene-calculator .sk-Guide{background:linear-gradient(135deg,#05966933,#0f766e22);border-color:#34d39955}
body.scene-calculator .sk-Card{background:#020617ee;border-color:#22c55e44}
body.scene-calculator input{background:#011a0f;border-color:#22c55e66;color:#bbf7d0;font-family:Consolas,monospace}

body.scene-registration{background:radial-gradient(circle at 10% 15%,#3b82f633,transparent 42%),linear-gradient(150deg,#0c1224,#1e3a8a 52%,#0f172a)}
body.scene-registration .sk-App{background:linear-gradient(160deg,#ffffff14,#1d4ed833);border-color:#60a5fa55;box-shadow:0 26px 72px #1e3a8a55}
body.scene-registration .sk-Guide{background:linear-gradient(135deg,#2563eb33,#1d4ed822);border-color:#60a5fa55}
body.scene-registration .sk-Card{background:linear-gradient(150deg,#172554dd,#0f172acc);border-color:#3b82f655}

body.scene-todo{background:radial-gradient(circle at 90% 10%,#2dd4bf33,transparent 36%),linear-gradient(155deg,#042f2e,#134e4a 50%,#022c22)}
body.scene-todo .sk-App{background:linear-gradient(160deg,#ffffff12,#115e5933);border-color:#2dd4bf55}
body.scene-todo .sk-Guide{background:linear-gradient(135deg,#0d948833,#14b8a622);border-color:#5eead455}
body.scene-todo .sk-Card{background:#064e3bcc;border-color:#34d39944}

body.scene-quiz{background:radial-gradient(circle at 20% 20%,#a855f744,transparent 38%),linear-gradient(150deg,#1e1033,#4c1d95 55%,#1e1b4b)}
body.scene-quiz .sk-App{background:linear-gradient(155deg,#ffffff16,#6d28d933);border-color:#c084fc66}
body.scene-quiz .sk-Guide{background:linear-gradient(135deg,#7c3aed44,#a855f722);border-color:#c084fc55}
body.scene-quiz .sk-Badge{background:linear-gradient(90deg,#a855f7,#6366f1)}

body.scene-timer{background:radial-gradient(circle at 50% 0%,#06b6d444,transparent 45%),linear-gradient(160deg,#031525,#0c4a6e 50%,#082f49)}
body.scene-timer .sk-App{background:linear-gradient(155deg,#ffffff10,#0369a133);border-color:#38bdf866}
body.scene-timer .timer{color:#67e8f9;text-shadow:0 0 24px #22d3ee88;font-size:3rem}
body.scene-timer .sk-Guide{background:linear-gradient(135deg,#0891b233,#06b6d422);border-color:#38bdf855}

body.scene-dashboard{background:radial-gradient(circle at 85% 15%,#6366f133,transparent 40%),linear-gradient(150deg,#0b1020,#312e81 48%,#111827)}
body.scene-dashboard .sk-App{background:linear-gradient(160deg,#ffffff12,#4338ca33);border-color:#818cf866}
body.scene-dashboard .sk-Card{background:linear-gradient(145deg,#1e1b4bcc,#0f172add);border-color:#6366f144}
body.scene-dashboard .sk-Chart canvas{background:#0f172a}

body.scene-colors{background:conic-gradient(from 210deg at 70% 20%,#ef444433,#eab30833,#22c55e33,#3b82f633,#a855f733,#ef444433),linear-gradient(155deg,#120a1f,#1f1147)}
body.scene-colors .sk-App{background:linear-gradient(160deg,#ffffff18,#7c3aed22);border-color:#f472b666}
body.scene-colors .sk-Guide{background:linear-gradient(135deg,#ec489933,#8b5cf622);border-color:#f472b655}

body.scene-canvas{background:radial-gradient(circle at 30% 30%,#f472b644,transparent 40%),radial-gradient(circle at 70% 70%,#22d3ee33,transparent 42%),linear-gradient(155deg,#1a0b2e,#312e81 55%,#0f172a)}
body.scene-canvas .sk-App{background:linear-gradient(155deg,#ffffff14,#6d28d933);border-color:#e879f966}
body.scene-canvas canvas{box-shadow:0 12px 32px #0008;border:2px solid #a855f755}

body.scene-search{background:radial-gradient(circle at 15% 80%,#22c55e22,transparent 38%),linear-gradient(160deg,#020617,#14532d 42%,#022c22)}
body.scene-search .sk-App{background:linear-gradient(155deg,#052e1644,#0f172acc);border-color:#4ade8055}
body.scene-search .sk-List{background:#011a0f;border:1px solid #22c55e44;border-radius:.8rem;padding:.5rem 1rem;font-family:Consolas,monospace}

body.scene-caesar{background:radial-gradient(circle at 80% 20%,#f59e0b33,transparent 40%),linear-gradient(150deg,#1c1408,#422006 52%,#1a1208)}
body.scene-caesar .sk-App{background:linear-gradient(160deg,#ffffff10,#92400e33);border-color:#fbbf2455}
body.scene-caesar .sk-Guide{background:linear-gradient(135deg,#b4530933,#d9770622);border-color:#fbbf2455}
body.scene-caesar input{font-family:Georgia,serif}

body.scene-edugame{background:radial-gradient(circle at 20% 15%,#facc1533,transparent 42%),linear-gradient(155deg,#1a1508,#713f1233 50%,#1c1917)}
body.scene-edugame .sk-App{background:linear-gradient(160deg,#ffffff14,#ca8a0433);border-color:#facc1555}
body.scene-edugame .sk-Guide{background:linear-gradient(135deg,#eab30833,#f59e0b22);border-color:#fde04755}
body.scene-edugame .sk-Badge{background:linear-gradient(90deg,#eab308,#f97316)}

body.scene-convert{background:radial-gradient(circle at 50% 0%,#38bdf833,transparent 45%),linear-gradient(160deg,#020617,#0c4a6e 48%,#082f49)}
body.scene-convert .sk-App{background:linear-gradient(155deg,#0f172acc,#0369a133);border-color:#38bdf866;font-family:Consolas,monospace}
body.scene-convert .sk-Guide{background:linear-gradient(135deg,#0284c733,#0ea5e922);border-color:#38bdf855}
`;

export const SKUI_SCENE_IDS = [
  "guess",
  "calculator",
  "registration",
  "todo",
  "quiz",
  "timer",
  "dashboard",
  "colors",
  "canvas",
  "search",
  "caesar",
  "edugame",
  "convert",
];

export const PROJECT_SCENE_MAP = {
  "app-guess-number": "guess",
  "app-calculator": "calculator",
  "app-registration": "registration",
  "app-todo": "todo",
  "app-quiz": "quiz",
  "app-timer": "timer",
  "app-dashboard": "dashboard",
  "app-colors": "colors",
  "app-canvas-demo": "canvas",
  "app-linear-search": "search",
  "app-caesar": "caesar",
  "app-edu-game": "edugame",
  "app-number-convert": "convert",
};
