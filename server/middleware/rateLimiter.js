// Simple in-memory rate limiter
const requestCounts = new Map();

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_REQUESTS = 100;

function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
  const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;
  const message = options.message || "Too many requests, please try again later";

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < windowMs);
    requestCounts.set(key, validRequests);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    // Add current request
    validRequests.push(now);
    next();
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of requestCounts.entries()) {
    const validRequests = requests.filter((time) => now - time < DEFAULT_WINDOW_MS * 2);
    if (validRequests.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, validRequests);
    }
  }
}, DEFAULT_WINDOW_MS);

module.exports = createRateLimiter;
