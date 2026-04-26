const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "../logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

function formatMessage(level, message, data = null) {
  const timestamp = formatTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
}

function writeLog(level, message, data) {
  const formatted = formatMessage(level, message, data);
  console.log(formatted);

  // Write to file
  try {
    fs.appendFileSync(LOG_FILE, formatted + "\n");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

const logger = {
  info: (message, data) => writeLog("INFO", message, data),
  warn: (message, data) => writeLog("WARN", message, data),
  error: (message, data) => writeLog("ERROR", message, data),
  debug: (message, data) => {
    if (process.env.NODE_ENV === "development") {
      writeLog("DEBUG", message, data);
    }
  },
};

module.exports = logger;
