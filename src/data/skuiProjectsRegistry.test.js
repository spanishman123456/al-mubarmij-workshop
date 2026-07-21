import { describe, expect, it } from "vitest";
import { getSkuiProject, SKUI_PROJECTS } from "../data/skuiProjectsRegistry.js";
import { getStepPlan } from "../data/stepLearningPlans.js";
import { checkProjectReadiness } from "../lib/projectReadiness.js";
import { validateSkuiProject } from "../lib/skui/manifest.js";
import { sha256Hex } from "../lib/projectExport.js";

describe("skuiProjectsRegistry", () => {
  it("exposes a unified independent project list", () => {
    expect(SKUI_PROJECTS.length).toBeGreaterThanOrEqual(12);
    const calculator = getSkuiProject("app-calculator");
    const guess = getSkuiProject("app-guess-number");
    expect(calculator.titleAr).toContain("حاسبة");
    expect(guess.titleAr).toContain("تخمين");
    expect(calculator.usageSteps.join(" ")).not.toContain("تخمين");
    expect(guess.usageSteps.join(" ")).not.toContain("حاسبة");
  });

  it("ships runnable starter apps with app.run()", () => {
    for (const project of SKUI_PROJECTS) {
      expect(project.starterCode).toMatch(/import skui as ui/);
      expect(project.starterCode).toMatch(/app\.run\s*\(/);
      expect(project.teacherSolutionId).toBe(project.id);
      expect(validateSkuiProject(project.starterCode).ok).toBe(true);
    }
  });

  it("keeps training student starters minimal while teacher starters stay runnable", () => {
    const guess = getSkuiProject("app-guess-number");
    expect(guess.starterCode).toMatch(/app\.run\s*\(/);
    expect(guess.studentStarterCode).not.toMatch(/app\.run\s*\(/);
    expect(guess.studentStarterCode).toMatch(/تعلّم خطوة بخطوة/);

    const plan = getStepPlan("app", "app-guess-number");
    expect(plan?.steps?.[0]?.initialCode).toMatch(/import skui as ______/);
    expect(plan?.fullSolution).toBeNull();
  });

  it("does not embed fullSolution in student step plans", () => {
    const plan = getStepPlan("app", "app-calculator");
    expect(plan.fullSolution).toBeNull();
    expect(plan.ideaAr).toMatch(/حاسبة|آلة/);
  });
});

describe("project readiness", () => {
  it("requires a successful run hash before WebApp readiness", async () => {
    const code = `import skui as ui
app = ui.App(title="t")
app.add(ui.Text("x"))
app.run()`;
    const hash = await sha256Hex(code);
    const notReady = await checkProjectReadiness({
      title: "تجربة",
      code,
      lastRunOk: false,
      lastRunCodeHash: null,
    });
    expect(notReady.statuses.webApp).toMatch(/غير جاهز/);
    expect(notReady.statuses.pwa).toMatch(/قيد التطوير/);
    expect(notReady.statuses.windows).toMatch(/غير متاح/);

    const ready = await checkProjectReadiness({
      title: "تجربة",
      code,
      lastRunOk: true,
      lastRunCodeHash: hash,
    });
    expect(ready.statuses.preview).toMatch(/جاهز للمعاينة/);
    expect(ready.statuses.webApp).toMatch(/جاهز لتصدير WebApp/);
  });
});

describe("Guide validation", () => {
  it("accepts ui.Guide in skui projects", () => {
    const result = validateSkuiProject(`import skui as ui
app = ui.App(title="x")
app.add(ui.Guide(title="hi", message="msg"))
app.run()`);
    expect(result.ok).toBe(true);
    expect(result.components).toContain("Guide");
  });
});
