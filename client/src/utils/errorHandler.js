// Error handling utilities for client
export class ApiError extends Error {
  constructor(message, code = "UNKNOWN_ERROR", statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export function parseApiError(error) {
  // If it's already an ApiError, return it
  if (error instanceof ApiError) {
    return error;
  }

  // Handle Axios errors
  if (error.response) {
    const { data, status } = error.response;
    const message = data?.message || data?.error || "An error occurred";
    const code = data?.code || "API_ERROR";
    return new ApiError(message, code, status);
  }

  // Handle network errors
  if (error.message === "Network Error") {
    return new ApiError("Network error. Please check your connection.", "NETWORK_ERROR", 0);
  }

  // Handle timeout
  if (error.code === "ECONNABORTED") {
    return new ApiError("Request timeout. Please try again.", "TIMEOUT", 0);
  }

  // Default error
  return new ApiError(error.message || "An unexpected error occurred", "UNKNOWN_ERROR", 500);
}

export function isAuthError(error) {
  return (
    error instanceof ApiError &&
    (error.code === "UNAUTHORIZED" || error.statusCode === 401 || error.code === "TOKEN_EXPIRED")
  );
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }
  return error?.message || "An unknown error occurred";
}
