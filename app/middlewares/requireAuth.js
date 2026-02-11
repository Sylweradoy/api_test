// KOD
const jwt = require('jsonwebtoken');
const { getCookieName } = require('../utils/auth');

function requireAuth(req, res, next) {
  const cookieName = getCookieName();
  const token = req.cookies?.[cookieName];

  if (!token) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { sub, role, permissions }
    return next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'UNAUTHORIZED' });
  }
}

module.exports = requireAuth;
