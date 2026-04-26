/**
 * RAG Knowledge Base for Sign Language Translation
 * Contains grammar rules, contextual information, and sign mappings
 */

const grammarRules = [
  {
    id: "subject-verb-object",
    rule: "Sign Language follows Subject-Verb-Object order in most cases",
    context: "General sentence structure",
    removableWords: ["the", "a", "an"],
    keyWords: ["subject", "verb", "object"],
  },
  {
    id: "pronouns",
    rule: "Use directional verbs pointing to pronouns (me, you, him, her, them)",
    context: "Pronoun handling",
    removableWords: ["i", "me", "you", "him", "her", "they", "them"],
    keyWords: ["pronoun", "directional", "pointing"],
  },
  {
    id: "tense-markers",
    rule: "Tense is indicated through time signs (PAST, NOW, FUTURE) rather than verb endings",
    context: "Temporal expressions",
    removableWords: ["was", "were", "is", "are", "am", "been"],
    keyWords: ["tense", "time", "past", "future", "present"],
  },
  {
    id: "adjectives",
    rule: "Adjectives typically follow nouns in sign language",
    context: "Adjective placement",
    removableWords: [],
    keyWords: ["adjective", "noun", "descriptor"],
  },
  {
    id: "articles",
    rule: "Articles (a, an, the) are typically omitted",
    context: "Article removal",
    removableWords: ["a", "an", "the"],
    keyWords: ["article", "determiner"],
  },
  {
    id: "prepositions",
    rule: "Prepositions are often expressed through spatial positioning",
    context: "Spatial information",
    removableWords: ["in", "on", "at", "to", "from", "by"],
    keyWords: ["preposition", "spatial", "location"],
  },
  {
    id: "questions",
    rule: "Questions are indicated through facial expressions and raised eyebrows, word order may change",
    context: "Interrogative sentences",
    removableWords: ["is", "are", "do", "does"],
    keyWords: ["question", "interrogative", "eyebrows"],
  },
  {
    id: "intensifiers",
    rule: "Repeated signs or body movements indicate emphasis/intensity",
    context: "Emphasis and emotion",
    removableWords: [],
    keyWords: ["emphasis", "intensity", "repeated"],
  },
];

const signMappings = [
  {
    english: ["hello", "hi", "hey"],
    sign: "HELLO",
    category: "greeting",
    priority: 1,
  },
  {
    english: ["goodbye", "bye", "farewell"],
    sign: "GOODBYE",
    category: "greeting",
    priority: 1,
  },
  {
    english: ["thank you", "thanks", "thankyou"],
    sign: "THANK YOU",
    category: "politeness",
    priority: 1,
  },
  {
    english: ["please"],
    sign: "PLEASE",
    category: "politeness",
    priority: 1,
  },
  {
    english: ["yes", "yeah", "yep"],
    sign: "YES",
    category: "affirmative",
    priority: 1,
  },
  {
    english: ["no", "nope"],
    sign: "NO",
    category: "negative",
    priority: 1,
  },
  {
    english: ["what", "huh"],
    sign: "WHAT",
    category: "question",
    priority: 1,
  },
  {
    english: ["how"],
    sign: "HOW",
    category: "question",
    priority: 1,
  },
  {
    english: ["when"],
    sign: "WHEN",
    category: "question",
    priority: 1,
  },
  {
    english: ["where"],
    sign: "WHERE",
    category: "question",
    priority: 1,
  },
  {
    english: ["why"],
    sign: "WHY",
    category: "question",
    priority: 1,
  },
];

const contextualRules = [
  {
    context: "Food and dining",
    removeWords: ["the", "a", "an", "is", "are"],
    keepWords: ["food", "eat", "drink", "hungry", "cook"],
    rules: ["Use noun-based expression for food items"],
  },
  {
    context: "Family relationships",
    removeWords: ["the", "a", "an", "is", "are"],
    keepWords: ["mother", "father", "sister", "brother", "family"],
    rules: ["Family signs are fundamental, use them as base"],
  },
  {
    context: "Questions",
    removeWords: ["do", "does", "is", "are", "can", "will"],
    keepWords: ["what", "when", "where", "why", "how", "who"],
    rules: [
      "Question word typically comes first",
      "Raise eyebrows and body language crucial",
    ],
  },
  {
    context: "Emotions",
    removeWords: ["very", "really", "extremely"],
    keepWords: ["happy", "sad", "angry", "surprised", "excited"],
    rules: [
      "Use facial expressions to intensify",
      "Body movement shows emotion level",
    ],
  },
];

/**
 * Get all grammar rules
 */
function getGrammarRules() {
  return grammarRules;
}

/**
 * Get grammar rules relevant to specific keywords
 */
function getRelevantGrammarRules(keywords = []) {
  if (keywords.length === 0) return grammarRules;

  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  return grammarRules.filter((rule) =>
    rule.keyWords.some((k) =>
      lowerKeywords.some((inputKey) => k.includes(inputKey) || inputKey.includes(k)),
    ),
  );
}

/**
 * Get removable words from relevant grammar rules
 */
function getRemovableWordsFromRules(keywords = []) {
  const rules = getRelevantGrammarRules(keywords);
  return [...new Set(rules.flatMap((r) => r.removableWords))];
}

/**
 * Get sign mappings
 */
function getSignMappings() {
  return signMappings;
}

/**
 * Get contextual rules
 */
function getContextualRules() {
  return contextualRules;
}

/**
 * Get contextual rules for a specific context
 */
function getContextualRulesFor(context) {
  const lowerContext = context.toLowerCase();
  return contextualRules.filter((rule) =>
    rule.context.toLowerCase().includes(lowerContext),
  );
}

/**
 * Get all knowledge base documents for RAG
 */
function getAllDocuments() {
  return [
    ...grammarRules.map((rule) => ({
      type: "grammar",
      id: rule.id,
      content: `${rule.rule}. Context: ${rule.context}`,
      metadata: { rule: rule.id, context: rule.context },
    })),
    ...signMappings.map((mapping) => ({
      type: "mapping",
      id: mapping.english[0],
      content: `English: ${mapping.english.join(", ")}. Sign: ${mapping.sign}. Category: ${mapping.category}`,
      metadata: {
        english: mapping.english,
        sign: mapping.sign,
        category: mapping.category,
      },
    })),
    ...contextualRules.map((cRule) => ({
      type: "contextual",
      id: cRule.context,
      content: `Context: ${cRule.context}. Remove: ${cRule.removeWords.join(", ")}. Keep: ${cRule.keepWords.join(", ")}. Rules: ${cRule.rules.join("; ")}`,
      metadata: {
        context: cRule.context,
        removeWords: cRule.removeWords,
        keepWords: cRule.keepWords,
      },
    })),
  ];
}

module.exports = {
  getGrammarRules,
  getRelevantGrammarRules,
  getRemovableWordsFromRules,
  getSignMappings,
  getContextualRules,
  getContextualRulesFor,
  getAllDocuments,
};
