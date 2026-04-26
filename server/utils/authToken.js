const crypto = require("crypto");

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.AUTH_SECRET || "gesturai-dev-secret";
}

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function sign(unsignedToken) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(unsignedToken)
    .digest("base64url");
}

function createAuthToken(user) {
  const header = encode({ alg: "HS256", typ: "JWT" });
  const payload = encode({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const unsignedToken = `${header}.${payload}`;
  const signature = sign(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token) {
    throw new Error("Missing token");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [header, payload, signature] = parts;
  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = sign(unsignedToken);

  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    throw new Error("Invalid token signature");
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    throw new Error("Invalid token signature");
  }

  const decodedHeader = decode(header);

  if (decodedHeader.alg !== "HS256") {
    throw new Error("Unsupported token");
  }

  const decodedPayload = decode(payload);

  if (!decodedPayload.exp || decodedPayload.exp < Date.now()) {
    throw new Error("Token expired");
  }

  return decodedPayload;
}

module.exports = {
  createAuthToken,
  verifyAuthToken,
};
