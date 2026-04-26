const fs = require("fs");
const path = require("path");
const multer = require("multer");

const videosDirectory = path.join(__dirname, "..", "videos");

if (!fs.existsSync(videosDirectory)) {
  fs.mkdirSync(videosDirectory, { recursive: true });
}

function slugifyFilename(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, videosDirectory);
  },
  filename: (req, file, callback) => {
    const originalName = path.parse(file.originalname).name;
    const preferredName = req.body.word || originalName || "sign-video";
    const safeName = slugifyFilename(preferredName) || "sign-video";
    const extension = path.extname(file.originalname || "").toLowerCase() || ".mp4";
    callback(null, `${safeName}-${Date.now()}${extension}`);
  },
});

function fileFilter(_req, file, callback) {
  const allowedExtensions = new Set([".mp4", ".webm", ".mov"]);
  const extension = path.extname(file.originalname || "").toLowerCase();

  if (!allowedExtensions.has(extension)) {
    callback(new Error("Only .mp4, .webm, and .mov uploads are supported"));
    return;
  }

  callback(null, true);
}

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = {
  uploadVideo,
  videosDirectory,
};
