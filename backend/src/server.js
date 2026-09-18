const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const env = require("./config/env");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const healthRouter = require("./routes/health");
const authRouter = require("./routes/auth");
const resumesRouter = require("./routes/resumes");
const dashboardRouter = require("./routes/dashboard");
const insightsRouter = require("./routes/insights");
const versionsRouter = require("./routes/versions");
const historyRouter = require("./routes/history");

const app = express();

app.set("trust proxy", 1);

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// --------------------------------------------------
// Body parsers
// --------------------------------------------------

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// --------------------------------------------------
// Cookies
// --------------------------------------------------

app.use(cookieParser());

// --------------------------------------------------
// Logging
// --------------------------------------------------

if (!env.isProd) {
  app.use(morgan("dev"));
}

// --------------------------------------------------
// Root route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Checker API is running",
  });
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/resumes", resumesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/versions", versionsRouter);
app.use("/api/history", historyRouter);

// --------------------------------------------------
// Error handling
// --------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// --------------------------------------------------
// Database connection
// --------------------------------------------------

let dbConnectionPromise;

async function ensureDatabaseConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  return dbConnectionPromise;
}

// --------------------------------------------------
// Vercel / Serverless entry
// --------------------------------------------------

if (env.nodeEnv !== "production") {
  ensureDatabaseConnection()
    .then(() => {
      app.listen(env.port, () => {
        console.log(
          `Server listening on http://localhost:${env.port} (${env.nodeEnv})`
        );
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err.message);
      process.exit(1);
    });
}

// Export Express app for Vercel
module.exports = async (req, res) => {
  try {
    await ensureDatabaseConnection();
    return app(req, res);
  } catch (err) {
    console.error("Server initialization error:", err);

    return res.status(500).json({
      error: {
        message: "Server initialization failed",
      },
    });
  }
};