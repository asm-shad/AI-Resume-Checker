const Diff = require("diff");

// ============================================================
// Create Text Diff
// ============================================================

function diffText(oldText, newText, mode = "words") {
  const fn =
    mode === "lines"
      ? Diff.diffLines
      : Diff.diffWordsWithSpace;

  const parts = fn(
    oldText || "",
    newText || "",
  );

  return parts.map((p) => ({
    value: p.value,
    added: !!p.added,
    removed: !!p.removed,
  }));
}

// ============================================================
// Summarize Diff
// ============================================================

function summarize(parts) {
  let added = 0;
  let removed = 0;

  for (const p of parts) {
    if (p.added) {
      added += p.value.length;
    } else if (p.removed) {
      removed += p.value.length;
    }
  }

  return {
    added,
    removed,
  };
}

// ============================================================
// Export
// ============================================================

module.exports = {
  diffText,
  summarize,
};