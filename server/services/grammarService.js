const removableWords = new Set([
  "a",
  "am",
  "an",
  "are",
  "at",
  "be",
  "for",
  "from",
  "i",
  "is",
  "me",
  "my",
  "of",
  "on",
  "our",
  "please",
  "the",
  "to",
  "was",
  "were",
]);

const wordAliases = {
  hi: ["hello"],
  hey: ["hello"],
  thanks: ["thank you"],
  thankyou: ["thank you"],
  veggie: ["vegetables"],
  veggies: ["vegetables"],
  crying: ["cry"],
  cooked: ["cook"],
  cooking: ["cook"],
  drank: ["drink"],
  drinking: ["drink"],
  hugged: ["hug"],
  hugging: ["hug"],
  jumped: ["jump"],
  jumping: ["jump"],
  wives: ["wife"],
  writers: ["writer"],
};

const phraseAliases = {
  "fed up": ["fedup"],
  "whats your name": ["what is your name"],
};

function toUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildSimpleWordVariants(word) {
  const variants = [word];

  if (word.endsWith("ies") && word.length > 3) {
    variants.push(`${word.slice(0, -3)}y`);
  }

  if (word.endsWith("ing") && word.length > 4) {
    const stem = word.slice(0, -3);
    variants.push(stem, `${stem}e`);
  }

  if (word.endsWith("ed") && word.length > 3) {
    variants.push(word.slice(0, -2), `${word.slice(0, -2)}e`);
  }

  if (word.endsWith("s") && word.length > 3) {
    variants.push(word.slice(0, -1));
  }

  return variants;
}

function convertGrammar(words) {
  return words.filter((word) => !removableWords.has(word));
}

function buildWordCandidates(word) {
  return toUnique([
    word,
    ...(wordAliases[word] || []),
    ...buildSimpleWordVariants(word),
  ]);
}

function buildPhraseCandidates(phrase) {
  return toUnique([phrase, ...(phraseAliases[phrase] || [])]);
}

module.exports = convertGrammar;
module.exports.buildWordCandidates = buildWordCandidates;
module.exports.buildPhraseCandidates = buildPhraseCandidates;
