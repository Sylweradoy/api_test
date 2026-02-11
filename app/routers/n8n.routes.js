// KOD
const express = require('express');
const { n8nAuth } = require( "../middlewares/n8nAuth");

const router = express.Router();

/**
 * Tu dajesz tylko endpointy potrzebne dla integracji.
 * Najlepiej trzymać je w osobnych kontrolerach jak resztę API.
 */

// HEALTHCHECK (też zabezpieczony)
router.get("/health", n8nAuth, (req, res) => {
  res.json({ ok: true, service: "n8n" });
});

// PRZYKŁAD: pobierz users (read)
router.get("/users", n8nAuth, async (req, res) => {
  // TODO: pobierz z DB
  // const users = await User.find().limit(200).lean();
  const users = [];
  res.json({ ok: true, data: users });
});

// PRZYKŁAD: zapisz event z n8n (write)
router.post("/events", n8nAuth, async (req, res) => {
  const { type, payload } = req.body || {};
  if (!type) return res.status(400).json({ ok: false, error: "type required" });

  // TODO: walidacja + zapis do DB
  // await IntegrationEvent.create({ type, payload, createdAt: new Date() });

  res.json({ ok: true });
});

module.exports = router
