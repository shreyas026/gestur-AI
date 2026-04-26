const CONTRACTION_MAP = [
  [/\bwhat's\b/g, "what is"],
  [/\bi'm\b/g, "i am"],
  [/\byou're\b/g, "you are"],
  [/\bwe're\b/g, "we are"],
  [/\bthey're\b/g, "they are"],
  [/\bit's\b/g, "it is"],
  [/\bcan't\b/g, "can not"],
  [/\bdon't\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"],
  [/\bwon't\b/g, "will not"],
  [/\bthat's\b/g, "that is"],
  [/\bthere's\b/g, "there is"],
];

function normalizeText(text = "") {
  let normalized = String(text).toLowerCase();

  for (const [pattern, replacement] of CONTRACTION_MAP) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized
    .replace(/[_-]+/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = normalizeText;
