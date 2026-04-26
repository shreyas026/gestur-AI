// Standardized API response utilities

function successResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data,
  };
}

function errorResponse(message, code = "ERROR") {
  return {
    success: false,
    code,
    message,
  };
}

function sendSuccess(res, data, message = "Success", statusCode = 200) {
  res.status(statusCode).json(successResponse(data, message));
}

function sendError(res, message, statusCode = 500, code = "ERROR") {
  res.status(statusCode).json(errorResponse(message, code));
}

function sendValidationError(res, message) {
  sendError(res, message, 400, "VALIDATION_ERROR");
}

function sendUnauthorized(res, message = "Unauthorized") {
  sendError(res, message, 401, "UNAUTHORIZED");
}

function sendForbidden(res, message = "Forbidden") {
  sendError(res, message, 403, "FORBIDDEN");
}

function sendNotFound(res, message = "Not found") {
  sendError(res, message, 404, "NOT_FOUND");
}

module.exports = {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
