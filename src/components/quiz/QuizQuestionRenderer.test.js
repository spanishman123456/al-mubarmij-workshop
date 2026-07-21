import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  AssessmentAnswer,
  AssessmentPrompt,
  QuizQuestionRenderer,
} from "./QuizQuestionRenderer";

globalThis.React = React;

function render(node) {
  return renderToStaticMarkup(node);
}

describe("assessment direction renderers", () => {
  it("isolates structured prompt expressions and code", () => {
    const markup = render(
      React.createElement(AssessmentPrompt, {
        question: {
          questionAr: "احسب الناتج",
          expression: "A AND B",
          values: [{ name: "A", value: "1" }],
          codeSnippetAr: "print(row[1])",
        },
      }),
    );

    expect(markup).toContain('dir="rtl"');
    expect(markup).toContain("A AND B");
    expect(markup).toContain("A = 1");
    expect(markup).toContain("print(row[1])");
    expect(markup).toContain('dir="ltr"');
  });

  it("uses explicit LTR direction for technical answers", () => {
    const answer = render(
      React.createElement(
        AssessmentAnswer,
        { question: { type: "fill" } },
        "101101",
      ),
    );
    const input = render(
      React.createElement(QuizQuestionRenderer, {
        question: { id: "q1", type: "fill" },
        value: "",
        onChange: () => {},
        disabled: false,
      }),
    );

    expect(answer).toContain('dir="ltr"');
    expect(input).toContain('dir="ltr"');
    expect(input).not.toContain('dir="auto"');
  });

  it("keeps code review answers inline-safe inside review text", () => {
    const markup = render(
      React.createElement(
        AssessmentAnswer,
        { question: { type: "code" } },
        "print(row[1])",
      ),
    );

    expect(markup).toContain('data-technical-kind="code"');
    expect(markup).toContain('dir="ltr"');
    expect(markup).not.toContain("<pre");
  });

  it("keeps Arabic answers RTL while isolating embedded tokens", () => {
    const markup = render(
      React.createElement(
        AssessmentAnswer,
        { question: { type: "essay" } },
        "استخدم print ثم row[1]",
      ),
    );

    expect(markup).toContain("استخدم");
    expect(markup).toContain("row[1]");
    expect(markup).toContain('dir="ltr"');
  });
});
