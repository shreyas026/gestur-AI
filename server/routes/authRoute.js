const express = require("express");
const {
  register,
  login,
  me,
  adminSummary,
} = require("../controllers/authController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/admin/summary", requireAuth, requireAdmin, adminSummary);

module.exports = router;
