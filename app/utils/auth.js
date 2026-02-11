// KOD
const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function getCookieName() {
  return process.env.COOKIE_NAME || 'token';
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  // Ustal czy to cross-site:
  // - jeśli masz Next na innej domenie niż API -> true
  // - jeśli robisz proxy przez Next (rewrites) i request idzie na ten sam origin -> false
  const isCrossSite = (process.env.COOKIE_CROSS_SITE || "true") === "true";

  return {
    httpOnly: true,
    secure: isProd ? true : false, // w prod MUSI być true
    sameSite: isCrossSite ? (isProd ? "none" : "lax") : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}




module.exports = { signToken, getCookieName, cookieOptions };
