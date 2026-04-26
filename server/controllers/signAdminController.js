const fs = require("fs");
const path = require("path");

const SignVideo = require("../models/SignVideo");
const {
  invalidateSignCatalogCache,
} = require("../services/translationService");
const { videosDirectory } = require("../middleware/uploadMiddleware");

function escapeRegExp(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toClientSign(sign) {
  return {
    id: sign._id.toString(),
    word: sign.word,
    videoUrl: sign.videoUrl,
    createdAt: sign.createdAt,
  };
}

function isValidVideoUrl(videoUrl) {
  return /^\/videos\/.+/i.test(videoUrl) || /^https?:\/\/.+/i.test(videoUrl);
}

async function listSigns(req, res) {
  try {
    const query = String(req.query.q || "").trim();
    const filter = query
      ? {
          word: {
            $regex: escapeRegExp(query),
            $options: "i",
          },
        }
      : {};

    const signs = await SignVideo.find(filter)
      .sort({ createdAt: -1, word: 1 })
      .limit(200)
      .lean();

    res.json({
      signs: signs.map(toClientSign),
    });
  } catch (error) {
    res.status(500).json({ error: "Could not load sign catalog" });
  }
}

async function createSign(req, res) {
  try {
    const word = String(req.body.word || "").trim();
    const videoUrl = String(req.body.videoUrl || "").trim();

    if (!word || !videoUrl) {
      return res.status(400).json({ error: "Word and video URL are required" });
    }

    if (!isValidVideoUrl(videoUrl)) {
      return res.status(400).json({
        error: "Video URL must start with /videos/ or http:// / https://",
      });
    }

    const existingSign = await SignVideo.findOne({
      word: {
        $regex: `^${escapeRegExp(word)}$`,
        $options: "i",
      },
    }).lean();

    if (existingSign) {
      return res.status(409).json({ error: "A sign with this word already exists" });
    }

    const sign = await SignVideo.create({
      word,
      videoUrl,
    });

    invalidateSignCatalogCache();

    res.status(201).json({
      sign: toClientSign(sign),
    });
  } catch (error) {
    res.status(500).json({ error: "Could not create sign entry" });
  }
}

async function updateSign(req, res) {
  try {
    const word = String(req.body.word || "").trim();
    const videoUrl = String(req.body.videoUrl || "").trim();

    if (!word || !videoUrl) {
      return res.status(400).json({ error: "Word and video URL are required" });
    }

    if (!isValidVideoUrl(videoUrl)) {
      return res.status(400).json({
        error: "Video URL must start with /videos/ or http:// / https://",
      });
    }

    const existingSign = await SignVideo.findOne({
      _id: { $ne: req.params.id },
      word: {
        $regex: `^${escapeRegExp(word)}$`,
        $options: "i",
      },
    }).lean();

    if (existingSign) {
      return res.status(409).json({ error: "Another sign with this word already exists" });
    }

    const sign = await SignVideo.findByIdAndUpdate(
      req.params.id,
      { word, videoUrl },
      { new: true, runValidators: true },
    ).lean();

    if (!sign) {
      return res.status(404).json({ error: "Sign entry not found" });
    }

    invalidateSignCatalogCache();

    res.json({
      sign: toClientSign(sign),
    });
  } catch (error) {
    res.status(500).json({ error: "Could not update sign entry" });
  }
}

async function deleteSign(req, res) {
  try {
    const sign = await SignVideo.findByIdAndDelete(req.params.id).lean();

    if (!sign) {
      return res.status(404).json({ error: "Sign entry not found" });
    }

    invalidateSignCatalogCache();

    res.json({
      deletedId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not delete sign entry" });
  }
}

async function listVideoAssets(req, res) {
  try {
    const assets = fs
      .readdirSync(videosDirectory)
      .filter((file) => /\.(mp4|webm|mov)$/i.test(file))
      .sort((left, right) => left.localeCompare(right))
      .map((file) => ({
        label: file.replace(/\.(mp4|webm|mov)$/i, ""),
        videoUrl: `/videos/${file}`,
      }));

    res.json({ assets });
  } catch (error) {
    res.status(500).json({ error: "Could not load video assets" });
  }
}

async function uploadVideoAsset(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file was uploaded" });
    }

    const asset = {
      label: path.parse(req.file.filename).name,
      videoUrl: `/videos/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
    };

    res.status(201).json({ asset });
  } catch (error) {
    res.status(500).json({ error: "Could not upload video asset" });
  }
}

module.exports = {
  listSigns,
  createSign,
  updateSign,
  deleteSign,
  listVideoAssets,
  uploadVideoAsset,
};
