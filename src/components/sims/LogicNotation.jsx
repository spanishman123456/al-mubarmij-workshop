import { isMintermStyle, normalizeNotForDisplay, parseLogicMinterm, splitLogicSum } from "../../lib/logic/notationFormat.js";

/** @param {{ name: string, negated?: boolean, size?: 'sm'|'md'|'lg' }} props */
export function LogicVariable({ name, negated = false, size = "md" }) {
  return (
    <span className={`logic-var logic-var--${size}${negated ? " logic-var--negated" : ""}`}>
      {negated ? <span className="logic-var__overline" aria-hidden="true" /> : null}
      <span className="logic-var__char">{name}</span>
    </span>
  );
}

/** @param {{ term: string, size?: 'sm'|'md'|'lg' }} props */
export function LogicMinterm({ term, size = "md" }) {
  const tokens = parseLogicMinterm(term);
  if (!tokens.length) return <span className="logic-expr-fallback">{term}</span>;
  return (
    <span className="logic-expr" dir="ltr">
      {tokens.map((t, i) => (
        <LogicVariable key={`${t.name}-${i}`} name={t.name} negated={t.negated} size={size} />
      ))}
    </span>
  );
}

/** @param {{ expr: string, size?: 'sm'|'md'|'lg' }} props */
export function LogicExpression({ expr, size = "md" }) {
  const raw = String(expr || "").trim();
  if (!raw || raw === "0" || raw === "1") {
    return <span className="logic-expr-fallback">{raw}</span>;
  }

  const normalized = normalizeNotForDisplay(raw);
  if (isMintermStyle(normalized)) {
    const terms = splitLogicSum(normalized);
    return (
      <span className="logic-expr logic-expr--sum" dir="ltr">
        {terms.map((term, i) => (
          <span key={`${term}-${i}`} className="logic-expr__term-wrap">
            {i > 0 ? <span className="logic-expr__op">+</span> : null}
            <LogicMinterm term={term} size={size} />
          </span>
        ))}
      </span>
    );
  }

  return <LogicBooleanExpr expr={raw} size={size} />;
}

function LogicBooleanExpr({ expr, size }) {
  const tokens = tokenizeBooleanExpr(expr);
  return (
    <span className="logic-bool-expr" dir="ltr">
      {tokens.map((tok, i) => {
        if (tok.type === "var") {
          return <LogicVariable key={i} name={tok.value} negated={tok.negated} size={size} />;
        }
        if (tok.type === "op") {
          return (
            <span key={i} className="logic-bool-expr__op">
              {tok.value}
            </span>
          );
        }
        return (
          <span key={i} className="logic-bool-expr__punct">
            {tok.value}
          </span>
        );
      })}
    </span>
  );
}

/** @param {string} expr */
function tokenizeBooleanExpr(expr) {
  const re =
    /\(|\)|\bAND\b|\bOR\b|\bXOR\b|\bNAND\b|\bNOR\b|\bXNOR\b|\bNOT\b|[A-Ep-t]/g;
  /** @type {{ type: 'var'|'op'|'punct', value: string, negated?: boolean }[]} */
  const out = [];
  let m;
  let pendingNot = false;
  while ((m = re.exec(expr)) !== null) {
    const t = m[0];
    const upper = t.toUpperCase();
    if (upper === "NOT") {
      pendingNot = true;
      continue;
    }
    if (/^[A-Ep-t]$/.test(t)) {
      out.push({ type: "var", value: t, negated: pendingNot });
      pendingNot = false;
      continue;
    }
    pendingNot = false;
    if (["AND", "OR", "XOR", "NAND", "NOR", "XNOR"].includes(upper)) {
      out.push({ type: "op", value: upper });
    } else {
      out.push({ type: "punct", value: t });
    }
  }
  return out;
}

/** @param {{ label: string, size?: 'sm'|'md'|'lg' }} props */
export function LogicTableHeader({ label, size = "md" }) {
  if (!label || label === "الناتج" || label === "V") {
    return <span className="truth-table__head-text">{label}</span>;
  }
  try {
    return (
      <span className="truth-table__head-logic" title={label}>
        <LogicExpression expr={label} size={size} />
      </span>
    );
  } catch (err) {
    console.warn("[LogicTableHeader] fallback label render:", label, err);
    return (
      <span className="truth-table__head-label" dir="ltr">
        {label}
      </span>
    );
  }
}
