const express = require("express");

const {
  listSigns,
  createSign,
  updateSign,
  deleteSign,
  listVideoAssets,
  uploadVideoAsset,
} = require("../controllers/signAdminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");
const { uploadVideo } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/signs", listSigns);
router.post("/signs", createSign);
router.put("/signs/:id", updateSign);
router.delete("/signs/:id", deleteSign);
router.get("/video-assets", listVideoAssets);
router.post("/upload-video", uploadVideo.single("video"), uploadVideoAsset);

module.exports = router;
