import { describe, expect, it } from "vitest";
import { loadWebAppPreview, saveWebAppPreview } from "./webAppPreview.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

describe("direct WebApp preview", () => {
  it("stores a bounded project reference and restores it", () => {
    const storage = memoryStorage();
    const before = Date.now();
    const id = saveWebAppPreview({ title: "آلة حاسبة", code: "import skui" }, storage);
    expect(loadWebAppPreview(id, storage, before + 1)).toMatchObject({
      title: "آلة حاسبة",
      code: "import skui",
      lang: "ar",
      direction: "rtl",
    });
  });

  it("stores explicit LTR preview settings", () => {
    const storage = memoryStorage();
    const id = saveWebAppPreview(
      { title: "Calculator", code: "import skui", lang: "en", direction: "ltr" },
      storage,
    );
    expect(loadWebAppPreview(id, storage)).toMatchObject({
      lang: "en",
      direction: "ltr",
    });
  });

  it("rejects invalid and expired references", () => {
    const storage = memoryStorage();
    const id = saveWebAppPreview({ title: "تطبيق", code: "import skui" }, storage);
    expect(loadWebAppPreview("../bad", storage)).toBeNull();
    expect(loadWebAppPreview(id, storage, Date.now() + 60 * 60 * 1000 + 1)).toBeNull();
  });
});
