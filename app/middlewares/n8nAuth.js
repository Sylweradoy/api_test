// KOD
const crypto = require("crypto");

const WINDOW_SECONDS = 60; // request ważny max 60s
const usedNonces = new Map(); // nonce -> expiresAt (in-memory)
const CLEANUP_EVERY = 30_000;

function nowMs() {
  return Date.now();
}

function timingSafeEqualStr(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function getClientIp(req) {
  // jeśli jesteś za proxy (nginx), ustaw app.set("trust proxy", 1)
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.ip;
}

function cleanupNonces() {
  const t = nowMs();
  for (const [nonce, exp] of usedNonces) {
    if (exp <= t) usedNonces.delete(nonce);
  }
}

setInterval(cleanupNonces, CLEANUP_EVERY).unref();

function n8nAuth(req, res, next) {
  const secret = process.env.N8N_API_KEY;
  if (!secret) {
    return res.status(500).json({ ok: false, error: "N8N_API_KEY missing" });
  }

  // 1) IP allowlist (opcjonalne)
  const allow = (process.env.N8N_IP_ALLOWLIST || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  if (allow.length) {
    const ip = getClientIp(req);
    if (!allow.includes(ip)) {
      return res.status(403).json({ ok: false, error: "Forbidden (IP)" });
    }
  }

  // 2) Nagłówki
  const key = req.headers["x-n8n-key"];
  const ts = req.headers["x-n8n-ts"];
  const nonce = req.headers["x-n8n-nonce"];
  const sig = req.headers["x-n8n-signature"];

  if (!key || !ts || !nonce || !sig) {
    return res.status(401).json({ ok: false, error: "Missing auth headers" });
  }

  if (
    typeof key !== "string" ||
    typeof ts !== "string" ||
    typeof nonce !== "string" ||
    typeof sig !== "string"
  ) {
    return res.status(401).json({ ok: false, error: "Invalid auth headers" });
  }

  // 3) Sprawdź klucz
  if (!timingSafeEqualStr(key, secret)) {
    return res.status(401).json({ ok: false, error: "Invalid key" });
  }

  // 4) Timestamp (anty-replay)
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) {
    return res.status(401).json({ ok: false, error: "Invalid timestamp" });
  }
  const ageSec = Math.abs(nowMs() - tsNum) / 1000;
  if (ageSec > WINDOW_SECONDS) {
    return res.status(401).json({ ok: false, error: "Request expired" });
  }

  // 5) Nonce (anty-replay)
  cleanupNonces();
  if (usedNonces.has(nonce)) {
    return res.status(409).json({ ok: false, error: "Replay detected" });
  }
  usedNonces.set(nonce, nowMs() + WINDOW_SECONDS * 1000);

  // 6) Podpis HMAC
  const bodyStr =
    req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : "";

  const base = [
    req.method.toUpperCase(),
    req.originalUrl,
    ts,
    nonce,
    bodyStr,
  ].join("|");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(base)
    .digest("hex");

  if (!timingSafeEqualStr(sig, expected)) {
    return res.status(401).json({ ok: false, error: "Invalid signature" });
  }

  return next();
}

module.exports = { n8nAuth };
