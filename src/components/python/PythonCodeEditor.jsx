import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyCompletion,
  getSuggestions,
  kindLabelAr,
  parseCompletionContext,
  shouldAutoTrigger,
} from "../../lib/python/autocomplete.js";

const DEBOUNCE_MS = 150;

function getLineColumn(text, pos) {
  const before = text.slice(0, pos);
  const lines = before.split("\n");
  return { line: lines.length - 1, column: lines[lines.length - 1].length };
}

function getCaretCoords(textarea, cursor) {
  const { line, column } = getLineColumn(textarea.value, cursor);
  const style = window.getComputedStyle(textarea);
  const lineHeight = parseFloat(style.lineHeight) || 20;
  const fontSize = parseFloat(style.fontSize) || 14;
  const charWidth = fontSize * 0.6;
  const padTop = parseFloat(style.paddingTop) || 0;
  const padLeft = parseFloat(style.paddingLeft) || 0;
  return {
    top: padTop + line * lineHeight - textarea.scrollTop + lineHeight + 2,
    left: padLeft + column * charWidth - textarea.scrollLeft,
  };
}

export function PythonCodeEditor({
  value,
  onChange,
  disabled = false,
  assistMode = "full",
  unitId = null,
  appMode = false,
  className = "",
  minHeight = "min-h-[min(70vh,480px)]",
  testId = "python-code-editor",
}) {
  const textareaRef = useRef(null);
  const debounceRef = useRef(null);
  const manualOpenRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [typoHint, setTypoHint] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [cursorPos, setCursorPos] = useState(0);

  const showDescriptions = assistMode === "full";

  const refreshSuggestions = useCallback(
    (code, cursor, { force = false } = {}) => {
      if (assistMode === "off" && !force) {
        setOpen(false);
        return;
      }
      const ctx = parseCompletionContext(code, cursor);
      if (!ctx && !force) {
        setOpen(false);
        return;
      }
      const prefix = ctx?.prefix ?? "";
      if (!force && !shouldAutoTrigger(prefix, assistMode)) {
        setOpen(false);
        return;
      }
      const { items: nextItems, typoHint: hint } = getSuggestions(ctx, {
        code,
        unitId,
        appMode,
      });
      if (!nextItems.length && !hint) {
        setOpen(false);
        return;
      }
      setItems(nextItems);
      setTypoHint(hint);
      setActiveIndex(0);
      setOpen(true);
      if (textareaRef.current) {
        setCoords(getCaretCoords(textareaRef.current, cursor));
      }
    },
    [assistMode, unitId, appMode],
  );

  const scheduleRefresh = useCallback(
    (code, cursor, opts) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => refreshSuggestions(code, cursor, opts), DEBOUNCE_MS);
    },
    [refreshSuggestions],
  );

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const activeItem = items[activeIndex] ?? null;

  const acceptItem = useCallback(
    (item) => {
      if (!item || !textareaRef.current) return;
      const ta = textareaRef.current;
      const pos = ta.selectionStart ?? cursorPos;
      const result = applyCompletion(value, pos, item.label);
      onChange(result.code);
      setOpen(false);
      setTypoHint(null);
      manualOpenRef.current = false;
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.selectionStart, result.selectionEnd);
        setCursorPos(result.cursor);
      });
    },
    [value, onChange, cursorPos],
  );

  function handleChange(e) {
    const next = e.target.value;
    const cursor = e.target.selectionStart ?? next.length;
    onChange(next);
    setCursorPos(cursor);
    manualOpenRef.current = false;
    scheduleRefresh(next, cursor);
  }

  function handleSelect() {
    const ta = textareaRef.current;
    if (!ta) return;
    setCursorPos(ta.selectionStart ?? 0);
  }

  function handleKeyDown(e) {
    const ta = textareaRef.current;
    if (!ta) return;

    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault();
      manualOpenRef.current = true;
      refreshSuggestions(value, ta.selectionStart ?? 0, { force: true });
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && items.length) {
      e.preventDefault();
      acceptItem(items[activeIndex]);
    } else if (e.key === "Tab" && items.length) {
      e.preventDefault();
      acceptItem(items[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setTypoHint(null);
    }
  }

  function handleScroll() {
    const ta = textareaRef.current;
    if (!ta || !open) return;
    setCoords(getCaretCoords(ta, ta.selectionStart ?? cursorPos));
  }

  const listId = useMemo(() => `${testId}-ac-list`, [testId]);

  return (
    <div className="relative" dir="ltr">
      <textarea
        ref={textareaRef}
        dir="ltr"
        data-testid={testId}
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        className={`code-editor w-full resize-y ${minHeight} ${className}`.trim()}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onScroll={handleScroll}
        onClick={handleSelect}
        disabled={disabled}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />

      {typoHint && !items.length ? (
        <p className="mt-1 text-xs text-amber-300" dir="rtl">
          هل تقصد{" "}
          <button
            type="button"
            className="font-mono underline"
            onClick={() => acceptItem({ label: typoHint })}
          >
            {typoHint}
          </button>
          ؟
        </p>
      ) : null}

      {open && items.length ? (
        <ul
          id={listId}
          role="listbox"
          data-testid="python-autocomplete-list"
          className="absolute z-50 max-h-52 min-w-[220px] max-w-[min(100%,360px)] overflow-y-auto rounded-xl border border-violet-500/40 bg-slate-900/98 py-1 shadow-2xl"
          style={{ top: coords.top, left: Math.max(0, coords.left) }}
        >
          {items.map((item, idx) => (
            <li key={item.label} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                data-testid={`python-autocomplete-item-${item.label}`}
                className={`flex w-full flex-col items-start px-3 py-2 text-left transition ${
                  idx === activeIndex ? "bg-violet-700/50" : "hover:bg-white/10"
                }`}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  acceptItem(item);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <span className="font-mono text-sm font-bold text-emerald-200">{item.label}</span>
                {showDescriptions ? (
                  <>
                    <span className="text-[10px] text-violet-300">{kindLabelAr(item.kind)}</span>
                    {item.signature ? (
                      <span className="font-mono text-[10px] text-slate-400">{item.signature}</span>
                    ) : null}
                    {idx === activeIndex && item.descriptionAr ? (
                      <span className="mt-0.5 text-xs leading-snug text-slate-300" dir="rtl">
                        {item.descriptionAr}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && activeItem && showDescriptions ? (
        <div
          className="pointer-events-none absolute z-40 hidden rounded-lg border border-white/10 bg-black/80 px-2 py-1 text-xs text-slate-300 sm:block"
          style={{ top: coords.top + 8, left: Math.min(coords.left + 240, 280) }}
          dir="rtl"
        >
          {kindLabelAr(activeItem.kind)}
          {activeItem.signature ? ` · ${activeItem.signature}` : ""}
        </div>
      ) : null}
    </div>
  );
}
