// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// String validation
function isValidString(str, minLength = 1, maxLength = Infinity) {
  if (typeof str !== "string") return false;
  const trimmed = str.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

// Password validation
function isValidPassword(password) {
  // At least 8 characters
  return isValidString(password, 8);
}

// Name validation
function isValidName(name) {
  return isValidString(name, 2, 100);
}

// Text input validation (for translations)
function isValidTextInput(text) {
  return isValidString(text, 1, 5000);
}

// Sanitize string input
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim();
}

module.exports = {
  isValidEmail,
  isValidString,
  isValidPassword,
  isValidName,
  isValidTextInput,
  sanitizeInput,
};
