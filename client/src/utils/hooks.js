// Common hooks for the client application

import { useCallback } from "react";
import { isAuthError } from "./errorHandler";

/**
 * Hook for handling API errors with user feedback
 */
export function useErrorHandler() {
  const handleError = useCallback((error, context = "") => {
    const message = error?.message || "An error occurred";

    if (isAuthError(error)) {
      // Clear auth and redirect to login
      localStorage.removeItem("gesturai_auth");
      localStorage.removeItem("gesturai_auth_token");
      window.location.href = "/login";
      return;
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[${context}]`, error);
    }

    return message;
  }, []);

  return { handleError };
}

/**
 * Hook for showing notifications/alerts
 */
export function useNotification() {
  const showSuccess = useCallback((message) => {
    console.log("[SUCCESS]", message);
    // TODO: Integrate with a toast/notification library
  }, []);

  const showError = useCallback((message) => {
    console.error("[ERROR]", message);
    // TODO: Integrate with a toast/notification library
  }, []);

  const showInfo = useCallback((message) => {
    console.log("[INFO]", message);
    // TODO: Integrate with a toast/notification library
  }, []);

  return { showSuccess, showError, showInfo };
}
