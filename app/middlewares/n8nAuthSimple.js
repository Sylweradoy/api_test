// KOD
function n8nAuthSimple(req, res, next) {
  const secret = process.env.N8N_API_KEY;
  if (!secret) {
    return res.status(500).json({ ok: false, error: "N8N_API_KEY missing" });
  }

  const key = req.headers["x-api-key"];

  if (!key || typeof key !== "string" || key !== secret) {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }

  return next();
}

module.exports = { n8nAuthSimple };
