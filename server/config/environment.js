require("dotenv").config();

const requiredEnvVars = ["MONGO_URI"];
const optionalEnvVars = {
  PORT: 5000,
  NODE_ENV: "development",
  ADMIN_EMAILS: "",
  GOOGLE_API_KEY: "",
};

function validateEnvironment() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please check your .env file.`,
    );
  }
}

function getEnv(key, defaultValue) {
  return process.env[key] ?? defaultValue;
}

module.exports = {
  validateEnvironment,
  getEnv,
  config: {
    mongoUri: process.env.MONGO_URI,
    port: parseInt(process.env.PORT || "5000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    adminEmails: (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean),
    googleApiKey: process.env.GOOGLE_API_KEY || "",
  },
};
