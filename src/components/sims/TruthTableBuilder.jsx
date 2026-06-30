import { useMemo } from "react";
import { buildTruthTable } from "../../lib/logic/truthTable.js";
import {
  LogicExpressionBuilderPanel,
  useLogicExpressionBuilder,
} from "./LogicExpressionBuilder.jsx";

function TruthTableView({ table }) {
  if (!table?.ok) return null;
  const cols = [
    ...table.variables,
    ...table.intermediateColumns.map((c) => c.id),
    "result",
  ];
  const labels = {
    ...Object.fromEntries(table.variables.map((v) => [v, v])),
    ...Object.fromEntries(table.intermediateColumns.map((c) => [c.id, c.label])),
    result: "الناتج",
  };

  return (
    <div className="truth-table-scroll overflow-x-auto rounded-lg border border-slate-600">
      <table className="truth-table w-full min-w-[280px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-800">
            {cols.map((col) => (
              <th
                key={col}
                className="truth-table__cell truth-table__head text-cyan-300"
                title={labels[col]}
              >
                <span className="truth-table__head-label" dir="ltr">
                  {labels[col]}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-slate-900/50" : ""}>
              {cols.map((col) => (
                <td key={col} className="truth-table__cell font-mono">
                  <span className={row[col] ? "text-emerald-400" : "text-slate-500"}>
                    {row[col]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TruthTableBuilder() {
  const builder = useLogicExpressionBuilder(2, { minVarCount: 1, maxVarCount: 5 });

  const table = useMemo(
    () => (builder.validation?.ok ? buildTruthTable(builder.builderExpr, builder.varCount) : null),
    [builder.builderExpr, builder.varCount, builder.validation?.ok],
  );

  return (
    <div className="space-y-4" dir="rtl">
      <LogicExpressionBuilderPanel builder={builder} />

      {table?.ok ? (
        <>
          <p className="text-sm text-cyan-200">
            {table.rows.length} صف — {table.intermediateColumns.length > 0 ? "مع أعمدة وسيطة" : "نتيجة مباشرة"}
          </p>
          <TruthTableView table={table} />
        </>
      ) : null}
    </div>
  );
}

export { TruthTableView };
