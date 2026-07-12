import { useMemo, useRef, useState } from "react";
import { getSkuiAutocompleteSuggestions, getSkuiConstructorProps } from "../../lib/skui/manifest";

function completionAt(value, cursor) {
  const before = String(value || "").slice(0, cursor);
  const member = before.match(/\bui\.([A-Za-z_]*)$/);
  if (member) {
    return {
      start: cursor - member[1].length,
      items: getSkuiAutocompleteSuggestions(member[1]),
    };
  }
  const props = before.match(/\bui\.([A-Z][A-Za-z0-9_]*)\([^)]*?([A-Za-z_]*)$/s);
  if (props) {
    const prefix = props[2] || "";
    return {
      start: cursor - prefix.length,
      items: getSkuiConstructorProps(props[1])
        .filter((name) => name.startsWith(prefix))
        .map((name) => ({ label: name, insertText: `${name}=`, kind: "skui-property" })),
    };
  }
  return null;
}

export function PythonCodeEditor({ value, onChange, appMode = false }) {
  const ref = useRef(null);
  const [cursor, setCursor] = useState(0);
  const [forced, setForced] = useState(false);
  const completion = useMemo(
    () => (appMode || forced ? completionAt(value, cursor) : null),
    [appMode, forced, value, cursor],
  );

  function apply(item) {
    const start = completion?.start ?? cursor;
    const next = `${value.slice(0, start)}${item.insertText}${value.slice(cursor)}`;
    const nextCursor = start + item.insertText.length;
    onChange(next);
    setForced(false);
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(nextCursor, nextCursor);
      setCursor(nextCursor);
    });
  }

  return (
    <div className="relative">
      <textarea
        ref={ref}
        dir="ltr"
        className="code-editor min-h-[min(70vh,480px)] w-full resize-y"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setCursor(event.target.selectionStart);
        }}
        onSelect={(event) => setCursor(event.currentTarget.selectionStart)}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.code === "Space") {
            event.preventDefault();
            setForced(true);
          }
          if (event.key === "Tab") {
            event.preventDefault();
            const start = event.currentTarget.selectionStart;
            const end = event.currentTarget.selectionEnd;
            onChange(`${value.slice(0, start)}    ${value.slice(end)}`);
            requestAnimationFrame(() => event.currentTarget.setSelectionRange(start + 4, start + 4));
          }
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-label="محرر كود بايثون"
        data-testid="python-code-editor"
      />
      {completion?.items?.length ? (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1 max-h-52 overflow-auto rounded-lg border border-violet-400/40 bg-slate-950 p-1 text-left shadow-2xl"
          dir="ltr"
          data-testid="python-autocomplete"
        >
          {completion.items.slice(0, 18).map((item) => (
            <button
              key={`${item.kind}-${item.label}`}
              type="button"
              role="option"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => apply(item)}
              className="block w-full rounded px-3 py-2 text-left font-mono text-xs text-cyan-100 hover:bg-violet-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
