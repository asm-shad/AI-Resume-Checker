const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", (req, res) => {
  const states = [
    "disconnected",
    "connected",
    "connecting",
    "disconnecting",
  ];

  res.json({
    status: "ok",
    db: states[mongoose.connection.readyState] || "unknown",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;