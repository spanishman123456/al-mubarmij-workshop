import { BinaryValue, TechnicalTable, TechnicalValue } from "../BilingualTextBlocks.jsx";

const HEADER_CLASS = "border border-slate-500 bg-slate-800 px-2 py-2 text-center text-cyan-200";
const CELL_CLASS = "border border-slate-500 p-1 text-center";

export function KarnaughGrid({
  layout,
  values,
  renderCell,
  className = "",
  headerClassName = "",
  cellClassName = "",
  "data-testid": testId = "karnaugh-grid",
}) {
  const axisLabel = `${layout.rowVars.join("")}\\${layout.colVars.join("")}`;

  return (
    <TechnicalTable
      data-testid={testId}
      className={`karnaugh-grid border-collapse text-center text-sm ${className}`.trim()}
      aria-label={`Karnaugh map ${axisLabel}`}
    >
      <thead>
        <tr>
          <th className={`${HEADER_CLASS} ${headerClassName}`.trim()}>
            <TechnicalValue>{axisLabel}</TechnicalValue>
          </th>
          {layout.colLabels.map((label) => (
            <th
              key={label}
              className={`${HEADER_CLASS} ${headerClassName}`.trim()}
              data-gray-column={label}
            >
              <BinaryValue value={label} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {layout.rowLabels.map((rowLabel, row) => (
          <tr key={rowLabel}>
            <th
              className={`${HEADER_CLASS} ${headerClassName}`.trim()}
              data-gray-row={rowLabel}
            >
              <BinaryValue value={rowLabel} />
            </th>
            {layout.colLabels.map((colLabel, col) => {
              const cell = layout.cells.find((candidate) => (
                candidate.row === row && candidate.col === col
              ));
              const value = values[cell.index] ?? "0";
              return (
                <td
                  key={`${rowLabel}-${colLabel}`}
                  className={`${CELL_CLASS} ${cellClassName}`.trim()}
                  data-kmap-index={cell.index}
                  data-truth-table-index={cell.truthTableIndex}
                >
                  {renderCell ? renderCell({ cell, value }) : <BinaryValue value={value} />}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </TechnicalTable>
  );
}
