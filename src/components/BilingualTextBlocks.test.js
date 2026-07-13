import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  BinaryValue,
  LogicExpressionBlock,
  TechnicalTable,
  TechnicalValue,
} from "./BilingualTextBlocks";
import { LtrValue } from "./LtrValue";

globalThis.React = React;

function render(component, props, children) {
  return renderToStaticMarkup(React.createElement(component, props, children));
}

describe("technical LTR components", () => {
  it("renders inline and block values with enforced technical direction", () => {
    const inline = render(
      TechnicalValue,
      { dir: "auto", style: { direction: "rtl", textAlign: "right" } },
      "0xFF",
    );
    const block = render(TechnicalValue, { display: "block" }, "row[1]");

    expect(inline).toContain('dir="ltr"');
    expect(inline).not.toContain('dir="auto"');
    expect(inline).toContain("direction:ltr");
    expect(inline).toContain("text-align:left");
    expect(inline).toContain("technical-value--inline");
    expect(inline).toContain("unicode-bidi:isolate");
    expect(inline).toContain("font-variant-numeric:tabular-nums");
    expect(block).toContain("<div");
    expect(block).toContain("technical-value--block");
  });

  it("keeps the legacy LtrValue API on the shared primitive", () => {
    const markup = render(LtrValue, { className: "metric" }, "25%");

    expect(markup).toContain('dir="ltr"');
    expect(markup).toContain("technical-value");
    expect(markup).toContain("metric");
  });

  it("renders binary and logic values through explicit APIs", () => {
    const binary = render(BinaryValue, { value: "101101" });
    const logic = render(LogicExpressionBlock, { expression: "A AND B" });

    expect(binary).toContain('data-technical-kind="binary"');
    expect(binary).toContain("technical-value--binary");
    expect(logic).toContain("<pre");
    expect(logic).toContain("technical-logic-expression");
    expect(logic).toContain("A AND B");
  });

  it("renders tables with stable LTR direction", () => {
    const row = React.createElement(
      "tbody",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement("td", null, "A"),
        React.createElement("td", null, "V"),
      ),
    );
    const markup = render(TechnicalTable, { className: "truth-table" }, row);

    expect(markup).toContain('<table dir="ltr"');
    expect(markup).toContain("technical-table truth-table");
  });
});
