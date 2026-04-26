require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { validateEnvironment, config } = require("./config/environment");
const authRoute = require("./routes/authRoute");
const signAdminRoute = require("./routes/signAdminRoute");
const translateRoute = require("./routes/translateRoute");
const translationConfigRoute = require("./routes/translationConfigRoute");
const translateToSignVideos = require("./services/translationService");
const { requireAuth } = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const createRateLimiter = require("./middleware/rateLimiter");
const logger = require("./utils/logger");
const { sendSuccess, sendValidationError } = require("./utils/response");

// Validate environment variables
try {
  validateEnvironment();
} catch (error) {
  logger.error("Environment validation failed", { error: error.message });
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

// Static files
app.use("/videos", express.static(path.join(__dirname, "videos")));
logger.info("Serving videos from:", { path: path.join(__dirname, "videos") });

// Routes
app.use("/api/auth", authRoute);
app.use("/api/admin", signAdminRoute);
app.use("/api", translateRoute);
app.use("/api/translation", translationConfigRoute);

// Health check endpoint
app.get("/", (req, res) => {
  sendSuccess(res, { status: "ok" }, "Server is running");
});

// Search endpoint
app.post("/api/search", requireAuth, async (req, res) => {
  try {
    const { sentence, text } = req.body;
    const input = (sentence || text || "").trim();

    if (!input) {
      return sendValidationError(res, "No sentence provided");
    }

    logger.info("Search requested", { input: input.substring(0, 100) });

    const results = await translateToSignVideos(input);
    sendSuccess(res, results, "Search completed");
  } catch (error) {
    logger.error("Search error", { error: error.message });
    sendValidationError(res, "Failed to process search");
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(config.mongoUri, {
    family: 4,
  })
  .then(() => logger.info("MongoDB Connected"))
  .catch((err) => {
    logger.error("MongoDB connection error", { error: err.message });
    process.exit(1);
  });

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: config.nodeEnv });
});
