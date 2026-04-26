const translateToSignVideos = require("../services/translationService");

async function translateText(req, res) {
  try {
    const { text, sentence } = req.body;
    const payload = await translateToSignVideos(text || sentence || "");

    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: "Translation failed" });
  }
}

module.exports = translateText;
