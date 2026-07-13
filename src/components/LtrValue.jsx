import { TechnicalValue } from "./BilingualTextBlocks";

/**
 * عرض أرقام ونسب في سياق RTL دون قلب ترتيبها.
 */
export function LtrValue({ children, className = "", ...props }) {
  return (
    <TechnicalValue
      className={`inline-block unicode-bidi-isolate ${className}`.trim()}
      {...props}
    >
      {children}
    </TechnicalValue>
  );
}

export { BinaryValue, TechnicalValue } from "./BilingualTextBlocks";

export function formatFraction(numerator, denominator) {
  return `${numerator} / ${denominator}`;
}

export function formatPercent(value) {
  return `${value ?? 0}%`;
}
