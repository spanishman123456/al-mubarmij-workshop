/**
 * عرض أرقام ونسب في سياق RTL دون قلب ترتيبها.
 */
export function LtrValue({ children, className = "" }) {
  return (
    <span dir="ltr" className={`inline-block unicode-bidi-isolate ${className}`.trim()}>
      {children}
    </span>
  );
}

export function formatFraction(numerator, denominator) {
  return `${numerator} / ${denominator}`;
}

export function formatPercent(value) {
  return `${value ?? 0}%`;
}
