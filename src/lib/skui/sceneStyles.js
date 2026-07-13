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

/* مختبر تقني: شبكة دقيقة، مؤشرات خوارزمية، وألوان تنفيذ واضحة */
body.scene-algorithm-lab{--c-primary:#06b6d4;--c-primary2:#2563eb;--c-accent:#22d3ee;background-color:#020617;background-image:linear-gradient(#22d3ee0b 1px,transparent 1px),linear-gradient(90deg,#22d3ee0b 1px,transparent 1px),radial-gradient(circle at 50% -10%,#0e749066,transparent 40%);background-size:24px 24px,24px 24px,auto}
body.scene-algorithm-lab .sk-App{background:#020617e8;border-color:#22d3ee55;box-shadow:0 0 0 1px #0891b222,0 28px 90px #001827}
body.scene-algorithm-lab .sk-HeroSection{background:linear-gradient(120deg,#083344,#172554);border-color:#22d3ee55}
body.scene-algorithm-lab .sk-GameBoard,body.scene-algorithm-lab canvas{background:#020b19;border:1px solid #22d3ee44;box-shadow:inset 0 0 60px #0891b21c}
body.scene-algorithm-lab .sk-MetricCard{font-family:Consolas,"Segoe UI",monospace;background:#071525;border-color:#0e749066}
body.scene-algorithm-lab .sk-Timeline .timeline-item{background:#082f4966}

/* غرفة هروب قصصية: معدن داكن، ذهب، وأختام مشفرة */
body.scene-cipher-escape{--c-primary:#d97706;--c-primary2:#92400e;--c-accent:#fbbf24;background:radial-gradient(circle at 50% 0%,#92400e55,transparent 32%),repeating-linear-gradient(125deg,#0f0b08 0,#0f0b08 22px,#17100b 23px,#17100b 24px)}
body.scene-cipher-escape .sk-App{background:linear-gradient(145deg,#1c1917f2,#0c0a09ed);border-color:#f59e0b55;box-shadow:0 30px 100px #000,0 0 45px #d9770618}
body.scene-cipher-escape .sk-HeroSection{background:radial-gradient(circle at 80% 20%,#f59e0b33,transparent 25%),linear-gradient(120deg,#451a03,#1c1917);border-color:#fbbf2466;font-family:Georgia,"Segoe UI",serif}
body.scene-cipher-escape .sk-MapPanel{background-color:#1c1917;background-image:radial-gradient(circle,#fbbf2422 1px,transparent 2px);background-size:25px 25px;border:2px solid #92400e}
body.scene-cipher-escape .sk-MissionCard{background:#292017cc;border-color:#d9770666;border-inline-start-color:#fbbf24}
body.scene-cipher-escape .sk-LevelBadge{background:linear-gradient(90deg,#78350f,#d97706);box-shadow:0 0 18px #f59e0b44}
body.scene-cipher-escape .sk-Guide{background:#292017e8;border-color:#d9770666}

/* عمليات مدينة: خرائط مضيئة ولوحات قيادة هندسية */
body.scene-smart-city-ops{--c-primary:#10b981;--c-primary2:#0f766e;--c-accent:#5eead4;background:radial-gradient(circle at 80% 0%,#10b9812e,transparent 35%),radial-gradient(circle at 10% 80%,#0284c733,transparent 40%),linear-gradient(145deg,#02131d,#042f2e 52%,#071827)}
body.scene-smart-city-ops .sk-App{background:#03171ddf;border-color:#34d39944;box-shadow:0 30px 90px #00100d}
body.scene-smart-city-ops .sk-HeroSection{background:linear-gradient(115deg,#064e3b,#0c4a6e);border-color:#5eead455}
body.scene-smart-city-ops .sk-MapPanel{background-color:#052e3b;background-image:linear-gradient(30deg,#2dd4bf16 12%,transparent 12.5%,transparent 87%,#2dd4bf16 87.5%),linear-gradient(150deg,#2dd4bf16 12%,transparent 12.5%,transparent 87%,#2dd4bf16 87.5%);background-size:42px 72px}
body.scene-smart-city-ops .sk-StatusPanel{background:linear-gradient(145deg,#063b3a,#082f49);border-color:#2dd4bf55}
body.scene-smart-city-ops .sk-MetricCard{background:#042f2ecc;border-color:#10b98155;border-block-start-color:#5eead4}
body.scene-smart-city-ops .sk-Timeline .timeline-item{border-inline-start:3px solid #f59e0b;background:#17202dcc}
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
  "algorithm-lab",
  "cipher-escape",
  "smart-city-ops",
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
  "algorithm-lab": "algorithm-lab",
  "cipher-escape": "cipher-escape",
  "smart-city-ops": "smart-city-ops",
  "app-algorithm-lab": "algorithm-lab",
  "app-cipher-escape": "cipher-escape",
  "app-smart-city-ops": "smart-city-ops",
  "advanced-algorithm-lab": "algorithm-lab",
  "advanced-cipher-escape": "cipher-escape",
  "advanced-smart-city-ops": "smart-city-ops",
};
