export function createSnippetRecord({ title, code, lessonId = null, activityId = null }) {
  const now = new Date().toISOString();
  return {
    id: `py-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: title || "كود محفوظ",
    code: code || "",
    lessonId,
    activityId,
    at: now,
    updatedAt: now,
    teacherNote: "",
  };
}

export function sortSnippets(snippets, sortBy = "recent") {
  const list = [...(snippets || [])];
  if (sortBy === "oldest") return list.sort((a, b) => new Date(a.at || 0) - new Date(b.at || 0));
  if (sortBy === "title") return list.sort((a, b) => String(a.title || "").localeCompare(String(b.title || ""), "ar"));
  return list.sort((a, b) => new Date(b.updatedAt || b.at || 0) - new Date(a.updatedAt || a.at || 0));
}

export function filterSnippets(snippets, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return snippets || [];
  return (snippets || []).filter((s) => {
    return (
      String(s.title || "").toLowerCase().includes(q) ||
      String(s.code || "").toLowerCase().includes(q) ||
      String(s.activityId || "").toLowerCase().includes(q)
    );
  });
}
