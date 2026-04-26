const User = require("../models/User");
const { hashPassword, verifyPassword } = require("../utils/passwords");
const { createAuthToken } = require("../utils/authToken");
const {
  isValidEmail,
  isValidPassword,
  isValidName,
  sanitizeInput,
} = require("../utils/validation");
const {
  sendSuccess,
  sendValidationError,
  sendUnauthorized,
  sendError,
} = require("../utils/response");
const logger = require("../utils/logger");

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function serializeUser(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function getAdminEmailSet() {
  return new Set(
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => normalizeEmail(email))
      .filter(Boolean),
  );
}

async function register(req, res) {
  try {
    const name = sanitizeInput(req.body.name || "");
    const email = normalizeEmail(req.body.email || "");
    const password = String(req.body.password || "");

    // Validation
    if (!isValidName(name)) {
      return sendValidationError(res, "Name must be between 2 and 100 characters");
    }

    if (!isValidEmail(email)) {
      return sendValidationError(res, "Please provide a valid email address");
    }

    if (!isValidPassword(password)) {
      return sendValidationError(res, "Password must be at least 8 characters");
    }

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return sendError(
        res,
        "An account with this email already exists",
        409,
        "ACCOUNT_EXISTS",
      );
    }

    const adminEmails = getAdminEmailSet();
    const existingUserCount = await User.countDocuments();
    const role =
      adminEmails.has(email) || (existingUserCount === 0 && adminEmails.size === 0)
        ? "admin"
        : "user";

    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
      role,
    });

    const serializedUser = serializeUser(user);
    const token = createAuthToken(serializedUser);

    logger.info("User registered", { email, role });

    sendSuccess(
      res,
      { token, user: serializedUser },
      "Account created successfully",
      201,
    );
  } catch (error) {
    logger.error("Registration error", { error: error.message });
    sendError(res, "Could not create account", 500);
  }
}

async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email || "");
    const password = String(req.body.password || "");

    if (!isValidEmail(email) || !password) {
      return sendValidationError(res, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return sendUnauthorized(res, "Invalid email or password");
    }

    const serializedUser = serializeUser(user);
    const token = createAuthToken(serializedUser);

    logger.info("User logged in", { email });

    sendSuccess(res, { token, user: serializedUser }, "Logged in successfully");
  } catch (error) {
    logger.error("Login error", { error: error.message });
    sendError(res, "Could not sign in", 500);
  }
}

async function me(req, res) {
  sendSuccess(res, { user: req.user }, "User info retrieved");
}

async function adminSummary(req, res) {
  try {
    const [totalUsers, totalAdmins, latestUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.find({}, { name: 1, email: 1, role: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    sendSuccess(
      res,
      {
        totalUsers,
        totalAdmins,
        latestUsers: latestUsers.map((user) => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        })),
      },
      "Admin summary retrieved",
    );
  } catch (error) {
    logger.error("Admin summary error", { error: error.message });
    sendError(res, "Could not load admin summary", 500);
  }
}

module.exports = {
  register,
  login,
  me,
  adminSummary,
};
