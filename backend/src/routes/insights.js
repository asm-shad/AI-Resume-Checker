const express = require("express");

const asyncHandler = require("../utils/asyncHandler");

const { requireAuth } = require("../middleware/auth");

const Resume = require("../models/Resume");
const ResumeVersion = require("../models/ResumeVersion");
const Analysis = require("../models/Analysis");

const router = express.Router();

router.use(requireAuth);

// ============================================================
// Get Top N Items
// ============================================================

function topN(items, getKey, n = 8) {
  const counts = new Map();
  const extra = new Map();

  for (const item of items) {
    const key = getKey(item);

    if (!key) {
      continue;
    }

    counts.set(
      key,
      (counts.get(key) || 0) + 1,
    );

    if (!extra.has(key)) {
      extra.set(key, item);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({
      key,
      count,
      sample: extra.get(key),
    }));
}

// ============================================================
// Analytics
// ============================================================

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    const resumeMap = new Map(
      resumes.map((r) => [
        r._id.toString(),
        r,
      ]),
    );

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: 1 })
      .lean();

    // ----------------------------------------------------------
    // Empty State
    // ----------------------------------------------------------

    if (!analyses.length) {
      return res.json({
        empty: true,
        totalAnalyses: 0,

        resumes: resumes.map((r) => ({
          _id: r._id,
          title: r.title,
          latestVersionNumber:
            r.latestVersionNumber,
        })),
      });
    }

    // ----------------------------------------------------------
    // Overall Score
    // ----------------------------------------------------------

    const totalScore = analyses.reduce(
      (sum, a) => sum + a.atsScore,
      0,
    );

    const averageScore = Math.round(
      totalScore / analyses.length,
    );

    const bestEntry = analyses.reduce(
      (best, a) =>
        a.atsScore > best.atsScore
          ? a
          : best,
    );

    const bestResume = resumeMap.get(
      bestEntry.resumeId.toString(),
    );

    // ----------------------------------------------------------
    // Score Trend
    // ----------------------------------------------------------

    const scoreTrend = analyses.map((a) => {
      const resume = resumeMap.get(
        a.resumeId.toString(),
      );

      return {
        at: a.createdAt,
        score: a.atsScore,
        resumeId: a.resumeId,
        resumeTitle:
          resume?.title || "Resume",
      };
    });

    // ----------------------------------------------------------
    // Issue Frequency
    // ----------------------------------------------------------

    const allIssues = analyses.flatMap(
      (a) => a.issues || [],
    );

    const topIssues = topN(
      allIssues,
      (issue) =>
        issue.title?.trim().toLowerCase(),
      6,
    ).map((row) => ({
      title:
        row.sample?.title || row.key,
      count: row.count,
      severity:
        row.sample?.severity || "medium",
    }));

    // ----------------------------------------------------------
    // Keyword Frequency
    // ----------------------------------------------------------

    const allMissing = analyses.flatMap(
      (a) => a.keywordsMissing || [],
    );

    const allPresent = analyses.flatMap(
      (a) => a.keywordsPresent || [],
    );

    const topMissing = topN(
      allMissing,
      (keyword) =>
        keyword.toLowerCase(),
      12,
    ).map((row) => ({
      keyword: row.sample,
      count: row.count,
    }));

    const topPresent = topN(
      allPresent,
      (keyword) =>
        keyword.toLowerCase(),
      12,
    ).map((row) => ({
      keyword: row.sample,
      count: row.count,
    }));

    // ----------------------------------------------------------
    // Per-Resume Performance
    // ----------------------------------------------------------

    const resumePerformance = resumes
      .map((r) => {
        const resumeAnalyses = analyses.filter(
          (a) =>
            a.resumeId.toString() ===
            r._id.toString(),
        );

        if (!resumeAnalyses.length) {
          return null;
        }

        const latest =
          resumeAnalyses[
            resumeAnalyses.length - 1
          ];

        const best = resumeAnalyses.reduce(
          (b, a) =>
            a.atsScore > b.atsScore
              ? a
              : b,
        );

        const first = resumeAnalyses[0];

        return {
          resumeId: r._id,
          title: r.title,
          analysesCount:
            resumeAnalyses.length,
          latestScore: latest.atsScore,
          bestScore: best.atsScore,
          improvement:
            latest.atsScore -
            first.atsScore,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          b.latestScore - a.latestScore,
      );

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    res.json({
      empty: false,
      totalAnalyses: analyses.length,
      averageScore,

      bestScore: {
        value: bestEntry.atsScore,
        resumeId: bestEntry.resumeId,
        resumeTitle:
          bestResume?.title || "Resume",
        at: bestEntry.createdAt,
      },

      scoreTrend,

      topIssues,

      topMissingKeywords: topMissing,

      topPresentKeywords: topPresent,

      resumePerformance,
    });
  }),
);

module.exports = router;