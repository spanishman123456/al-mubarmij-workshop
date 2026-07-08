const INDENT = "    ";
const BLOCK_START_RE = /:\s*(#.*)?$/;
const DEDENT_KEYWORDS = /^(elif\b.*:|else:|except\b.*:|finally:)\s*$/;

function lineStart(code, cursor) {
  return code.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
}

function currentLine(code, cursor) {
  const start = lineStart(code, cursor);
  const end = code.indexOf("\n", cursor);
  return code.slice(start, end === -1 ? code.length : end);
}

function leadingSpaces(text) {
  const m = text.match(/^\s*/);
  return m ? m[0].replace(/\t/g, INDENT).length : 0;
}

function pad(count) {
  return " ".repeat(Math.max(0, count));
}

export function applySmartEnter(code, cursor) {
  const line = currentLine(code, cursor);
  const beforeCursor = code.slice(0, cursor);
  const afterCursor = code.slice(cursor);
  const trimmed = line.trim();
  let indent = leadingSpaces(line);
  if (BLOCK_START_RE.test(trimmed)) indent += 4;
  if (DEDENT_KEYWORDS.test(trimmed)) indent = Math.max(4, indent);
  const insert = `\n${pad(indent)}`;
  const nextCode = `${beforeCursor}${insert}${afterCursor}`;
  const nextCursor = cursor + insert.length;
  return { code: nextCode, cursor: nextCursor };
}

export function applyTabIndent(code, selectionStart, selectionEnd, { shift = false } = {}) {
  if (selectionStart == null || selectionEnd == null) {
    return { code, selectionStart: 0, selectionEnd: 0 };
  }
  if (selectionStart !== selectionEnd) {
    const start = lineStart(code, selectionStart);
    const block = code.slice(start, selectionEnd);
    const lines = block.split("\n");
    const updated = lines.map((line) => {
      if (!shift) return `${INDENT}${line}`;
      if (line.startsWith(INDENT)) return line.slice(INDENT.length);
      return line.replace(/^ {1,3}/, "");
    });
    const nextBlock = updated.join("\n");
    const nextCode = `${code.slice(0, start)}${nextBlock}${code.slice(selectionEnd)}`;
    const delta = nextBlock.length - block.length;
    return { code: nextCode, selectionStart, selectionEnd: selectionEnd + delta };
  }
  if (shift) {
    const start = lineStart(code, selectionStart);
    const beforeCursor = code.slice(start, selectionStart);
    const toRemove = Math.min(4, beforeCursor.match(/ *$/)?.[0].length || 0);
    if (!toRemove) return { code, selectionStart, selectionEnd };
    const nextCode = `${code.slice(0, selectionStart - toRemove)}${code.slice(selectionStart)}`;
    const nextPos = selectionStart - toRemove;
    return { code: nextCode, selectionStart: nextPos, selectionEnd: nextPos };
  }
  const nextCode = `${code.slice(0, selectionStart)}${INDENT}${code.slice(selectionEnd)}`;
  const nextPos = selectionStart + INDENT.length;
  return { code: nextCode, selectionStart: nextPos, selectionEnd: nextPos };
}

export function autoFixIndentation(code) {
  const lines = String(code || "").replace(/\t/g, INDENT).split("\n");
  let level = 0;
  const out = [];
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) {
      out.push("");
      continue;
    }
    if (DEDENT_KEYWORDS.test(trimmed)) {
      level = Math.max(0, level - 1);
    }
    out.push(`${pad(level * 4)}${trimmed}`);
    if (BLOCK_START_RE.test(trimmed)) {
      level += 1;
    }
  }
  return out.join("\n");
}
