import { describe, expect, it } from "vitest";
import { curriculumDays } from "../../data/curriculum15Days.js";
import { getAllRosterStudents, STUDENTS_ROSTER } from "../../data/studentsRoster.js";
import { TEACHER_PROFILE } from "../../data/demoUsers.js";
import { getStepPlan } from "../../data/stepLearningPlans.js";
import { SKUI_PROJECTS } from "../../data/skuiProjectsRegistry.js";
import {
  DAY15_LESSON_ROUTES,
  getPublishedDaysFromClientEnv,
  getPublishedDaysFromServerEnv,
} from "../../config/publicationPolicy.js";
import { validateSkuiProject, SKUI_COMPONENTS } from "./manifest.js";
import { getSuggestions, parseCompletionContext } from "../python/autocomplete.js";
import { getSkuiTeacherSolution } from "../../../server/teacher/skuiSolutions.js";

describe("batch19 and skui integration guard", () => {
  it("preserves all fifteen curriculum days and day-15 publication routes", () => {
    expect(curriculumDays).toHaveLength(15);
    expect(curriculumDays.at(-1)?.id).toBe("day-15");
    expect(DAY15_LESSON_ROUTES).toEqual(
      new Set([
        "/lessons/final-project-presentation",
        "/lessons/peer-feedback-and-refinement",
        "/lessons/final-evaluation",
        "/lessons/program-closure-next-steps",
      ]),
    );
  });

  it("does not alter publication policy defaults during the skui merge", () => {
    expect(getPublishedDaysFromClientEnv()).toBe(15);
    expect(getPublishedDaysFromServerEnv()).toBe(15);
  });

  it("preserves student and teacher account models", () => {
    expect(STUDENTS_ROSTER.length).toBeGreaterThan(0);
    expect(getAllRosterStudents().every((student) => student.role === "student")).toBe(true);
    expect(TEACHER_PROFILE.role).toBe("teacher");
  });

  it("includes the advanced skui catalog without exposing teacher solutions", () => {
    const advanced = SKUI_PROJECTS.filter((project) => project.category === "advanced");
    expect(advanced.map((project) => project.id)).toEqual([
      "advanced-algorithm-lab",
      "advanced-cipher-escape",
      "advanced-smart-city-ops",
    ]);
    expect(SKUI_COMPONENTS).toEqual(expect.arrayContaining(["App", "Scene", "Canvas", "DataGrid"]));

    for (const project of advanced) {
      expect(project.studentStarterCode).toContain("TODO:");
      expect(project.studentStarterCode).not.toContain("def bubble_steps");
      expect(validateSkuiProject(project.studentStarterCode).ok).toBe(true);
      expect(getStepPlan("app", project.id)?.fullSolution).toBeNull();
      expect(getSkuiTeacherSolution(project.id)?.code).toContain("import skui as ui");
    }
  });

  it("keeps training projects classified separately from advanced prototypes", () => {
    const training = SKUI_PROJECTS.filter((project) => project.category === "training");
    expect(training.length).toBeGreaterThanOrEqual(10);
    expect(training.every((project) => project.category !== "advanced")).toBe(true);
    expect(SKUI_PROJECTS.some((project) => project.id === "app-calculator")).toBe(true);
  });

  it("wires skui import autocomplete into the batch-19 python editor catalog", () => {
    const code = "import skui as ui\nui.Bu";
    const ctx = parseCompletionContext(code, code.length);
    const { items } = getSuggestions(ctx, { code, appMode: true });
    expect(items.some((item) => item.label === "Button" && item.kind === "skui-component")).toBe(true);
  });
});
