const normalizeText = require("./normalizeText");

function cleanText(text) {
  const cleaned = normalizeText(text);

  if (!cleaned) {
    return [];
  }

  return cleaned.split(" ");
}

module.exports = cleanText;
