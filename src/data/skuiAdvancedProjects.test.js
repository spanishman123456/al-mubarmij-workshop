import { describe, expect, it } from "vitest";
import { SKUI_ADVANCED_PROJECTS } from "./skuiAdvancedProjects.js";
import { SKUI_ADVANCED_STARTERS } from "./skuiAdvancedStarters.js";
import { getStepPlan } from "./stepLearningPlans.js";
import { validateSkuiProject } from "../lib/skui/manifest.js";

describe("advanced skui projects", () => {
  it("keeps exactly three prototypes behind the QA gate", () => {
    expect(SKUI_ADVANCED_PROJECTS).toHaveLength(3);
    for (const project of SKUI_ADVANCED_PROJECTS) {
      expect(project.category).toBe("advanced");
      expect(project.status).toBe("qa");
      expect(project.rubric.reduce((sum, item) => sum + item.maxScore, 0)).toBe(100);
      expect(project.criticalGates.length).toBeGreaterThanOrEqual(5);
      expect(project.stages).toHaveLength(3);
    }
  });

  it("ships runnable student scaffolds without teacher algorithms", () => {
    for (const project of SKUI_ADVANCED_PROJECTS) {
      const starter = SKUI_ADVANCED_STARTERS[project.id];
      expect(starter).toBe(project.studentStarterCode);
      expect(starter).toContain("TODO:");
      expect(starter).toMatch(/app\.run\s*\(\s*\)/);
      expect(validateSkuiProject(starter).ok).toBe(true);
    }
    expect(SKUI_ADVANCED_STARTERS["advanced-algorithm-lab"]).not.toMatch(/def\s+bubble_steps/);
    expect(SKUI_ADVANCED_STARTERS["advanced-cipher-escape"]).not.toMatch(/def\s+caesar/);
    expect(SKUI_ADVANCED_STARTERS["advanced-smart-city-ops"]).not.toMatch(/INCIDENTS\s*=/);
  });

  it("starts every learning plan from its student scaffold", () => {
    for (const project of SKUI_ADVANCED_PROJECTS) {
      const plan = getStepPlan("app", project.id);
      expect(plan.fullSolution).toBeNull();
      expect(plan.steps).toHaveLength(3);
      expect(plan.steps[0].initialCode).toBe(project.studentStarterCode);
    }
  });
});
