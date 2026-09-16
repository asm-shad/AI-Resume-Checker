const env = require("../config/env");
const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
  next(
    ApiError.notFound(
      `Route ${req.method} ${req.originalUrl} not found`
    )
  );
}

function errorHandler(err, req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details;

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    details = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [
        key,
        value.message,
      ])
    );

    status = 400;
    message = "Validation failed";
  }

  // Mongoose CastError
  else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB duplicate key error
  else if (err.code === 11000) {
    status = 409;
    message = "Duplicate key";
    details = err.keyValue;
  }

  // Zod validation error
  else if (err.name === "ZodError") {
    status = 400;
    message = "Validation failed";
    details = err.issues;
  }

  // Log server errors
  if (status >= 500) {
    console.error(
      `[${req.method} ${req.originalUrl}]`,
      err
    );
  }

  res.status(status).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(env.isProd ? {} : { stack: err.stack }),
    },
  });
}

module.exports = {
  notFound,
  errorHandler,
};