const logger = require("../utils/logger");
const { sendError } = require("../utils/response");

/**
 * Global error handler middleware
 * Should be the last middleware in the app
 */
function errorHandler(error, req, res, next) {
  const timestamp = new Date().toISOString();
  const requestInfo = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp,
  };

  // Log the error
  logger.error(error.message, {
    ...requestInfo,
    stack: error.stack,
  });

  // Handle known error types
  if (error.name === "ValidationError") {
    return sendError(res, error.message, 400, "VALIDATION_ERROR");
  }

  if (error.name === "MongooseError") {
    return sendError(res, "Database error", 500, "DATABASE_ERROR");
  }

  if (error.name === "JsonWebTokenError") {
    return sendError(res, "Invalid token", 401, "AUTH_ERROR");
  }

  if (error.name === "TokenExpiredError") {
    return sendError(res, "Token expired", 401, "TOKEN_EXPIRED");
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  sendError(res, message, statusCode);
}

module.exports = errorHandler;
