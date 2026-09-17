const express = require("express");

const asyncHandler = require("../utils/asyncHandler");

const { requireAuth } = require("../middleware/auth");

const Resume = require("../models/Resume");
const ResumeVersion = require("../models/ResumeVersion");
const Analysis = require("../models/Analysis");

const router = express.Router();

router.use(requireAuth);

// ============================================================
// Get All Resume Versions
// ============================================================

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // ----------------------------------------------------------
    // Load User Resumes
    // ----------------------------------------------------------

    const resumes = await Resume.find({ userId })
      .lean();

    const resumeIds = resumes.map(
      (r) => r._id,
    );

    const resumeMap = new Map(
      resumes.map((r) => [
        r._id.toString(),
        r,
      ]),
    );

    // ----------------------------------------------------------
    // Load Versions
    // ----------------------------------------------------------

    const versions = await ResumeVersion.find({
      resumeId: { $in: resumeIds },
    })
      .select(
        "_id resumeId label versionNumber sourceType createdAt latestAnalysisId parentVersionId",
      )
      .sort({ createdAt: -1 })
      .lean();

    // ----------------------------------------------------------
    // Load Latest Analysis Scores
    // ----------------------------------------------------------

    const analysisIds = versions
      .map((v) => v.latestAnalysisId)
      .filter(Boolean);

    const analyses = analysisIds.length
      ? await Analysis.find({
          _id: { $in: analysisIds },
        })
          .select("_id atsScore versionId")
          .lean()
      : [];

    const scoreByVersion = new Map(
      analyses.map((a) => [
        a.versionId.toString(),
        a.atsScore,
      ]),
    );

    // ----------------------------------------------------------
    // Build Version Items
    // ----------------------------------------------------------

    const items = versions.map((v) => {
      const resume = resumeMap.get(
        v.resumeId.toString(),
      );

      return {
        id: v._id,
        label: v.label,
        versionNumber: v.versionNumber,
        sourceType: v.sourceType,
        createdAt: v.createdAt,
        score:
          scoreByVersion.get(
            v._id.toString(),
          ) ?? null,
        resumeId: v.resumeId,
        resumeTitle:
          resume?.title || "Resume",
        parentVersionId:
          v.parentVersionId,
      };
    });

    // ----------------------------------------------------------
    // Totals
    // ----------------------------------------------------------

    const totals = {
      all: items.length,

      uploads: items.filter(
        (v) => v.sourceType === "upload",
      ).length,

      rewrites: items.filter(
        (v) => v.sourceType === "rewrite",
      ).length,
    };

    // ----------------------------------------------------------
    // Response
    // ----------------------------------------------------------

    res.json({
      versions: items,
      totals,
    });
  }),
);

module.exports = router;