// KOD
const User = require("../../db/models/User"); // <-- dopasuj ścieżkę do swojego projektu

function pickInt(v, def) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

exports.health = async (req, res) => {
  return res.json({ ok: true, service: "n8n", ts: Date.now() });
};

// GET /integrations/n8n/users?limit=100&page=1&role=admin&q=moo
exports.getUsers = async (req, res) => {
  try {
    const limit = Math.min(Math.max(pickInt(req.query.limit, 50), 1), 200);
    const page = Math.max(pickInt(req.query.page, 1), 1);
    const skip = (page - 1) * limit;

    const role = (req.query.role || "").toString().trim();
    const q = (req.query.q || "").toString().trim();

    const filter = {};

    // Filtr po roli (jeśli masz pole role)
    if (role) filter.role = role;

    // Prosty search (dopasuj do swoich pól: username/login/email)
    if (q) {
      filter.$or = [
        { username: { $regex: q, $options: "i" } },
        { login: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }

    // WAŻNE: projection - nie wypuszczamy haseł i tokenów
    const projection = {
      password: 0,
      hash: 0,
      salt: 0,
      refreshToken: 0,
      resetToken: 0,
      resetTokenExp: 0,
    };

    const [items, total] = await Promise.all([
      User.find(filter, projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: items,
    });
  } catch (err) {
    console.error("n8n.getUsers error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
  }
};

// GET /integrations/n8n/users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const projection = {
      password: 0,
      hash: 0,
      salt: 0,
      refreshToken: 0,
      resetToken: 0,
      resetTokenExp: 0,
    };

    const user = await User.findById(id, projection).lean();
    if (!user) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.json({ ok: true, data: user });
  } catch (err) {
    console.error("n8n.getUserById error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
  }
};

// POST /integrations/n8n/events  { type, payload }
exports.createEvent = async (req, res) => {
  try {
    const { type, payload } = req.body || {};
    if (!type) return res.status(400).json({ ok: false, error: "type required" });

    // TODO: tu podepniesz swój model np. IntegrationEvent
    // await IntegrationEvent.create({ type, payload, createdAt: new Date() });

    return res.json({ ok: true });
  } catch (err) {
    console.error("n8n.createEvent error:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
  }
};
