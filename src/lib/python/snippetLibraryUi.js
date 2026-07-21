const DEFAULT_PAGE_SIZE = 6;

function toDateTs(value) {
  const ts = Date.parse(value || "");
  return Number.isFinite(ts) ? ts : 0;
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeSnippetType(type) {
  const t = normalizeText(type);
  if (t === "project" || t === "lesson" || t === "activity" || t === "experiment") return t;
  return "lesson";
}

export function buildSnippetSearchText(snippet) {
  return normalizeText(
    [
      snippet.title,
      snippet.lessonTitle,
      snippet.lessonId,
      snippet.activityId,
      snippet.snippetType,
      snippet.at,
      snippet.updatedAt,
      snippet.code,
    ].join(" "),
  );
}

export function filterSnippets(snippets, { query = "", type = "all" } = {}) {
  const normalizedQuery = normalizeText(query);
  return (snippets || []).filter((snippet) => {
    if (type !== "all" && normalizeSnippetType(snippet.snippetType) !== type) return false;
    if (!normalizedQuery) return true;
    return buildSnippetSearchText(snippet).includes(normalizedQuery);
  });
}

export function sortSnippets(snippets, sortKey = "newest") {
  const list = [...(snippets || [])];
  if (sortKey === "oldest") {
    return list.sort((a, b) => toDateTs(a.updatedAt || a.at) - toDateTs(b.updatedAt || b.at));
  }
  if (sortKey === "lesson") {
    return list.sort((a, b) => String(a.lessonTitle || a.title || "").localeCompare(String(b.lessonTitle || b.title || ""), "ar"));
  }
  return list.sort((a, b) => toDateTs(b.updatedAt || b.at) - toDateTs(a.updatedAt || a.at));
}

export function paginateSnippets(snippets, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const safePageSize = Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE);
  const totalItems = (snippets || []).length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (currentPage - 1) * safePageSize;
  const items = (snippets || []).slice(start, start + safePageSize);
  return { items, totalItems, totalPages, currentPage, pageSize: safePageSize };
}

