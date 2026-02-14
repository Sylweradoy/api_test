// KOD
const Message = require("../db/models/Message");

class MessageController {
  // POST /api/messages  (public)
  static async create(req, res) {
    try {
      const name = String(req.body?.name || "").trim();
      const phone = String(req.body?.phone || "").trim();
      const message = String(req.body?.message || "").trim();

      if (!name) return res.status(400).json({ ok: false, error: "NAME_REQUIRED" });
      if (!phone) return res.status(400).json({ ok: false, error: "PHONE_REQUIRED" });
      if (!message) return res.status(400).json({ ok: false, error: "MESSAGE_REQUIRED" });

      const doc = await Message.create({ name, phone, message });

      return res.status(201).json({
        ok: true,
        data: { id: doc._id, createdAt: doc.createdAt },
      });
    } catch (err) {
      console.error("MessageController.create:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }

  // GET /api/admin/messages?limit=50&page=1 (admin)
  static async list(req, res) {
    try {
      const limitRaw = Number(req.query?.limit);
      const pageRaw = Number(req.query?.page);

      const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
      const page = Number.isFinite(pageRaw) ? Math.max(pageRaw, 1) : 1;

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Message.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select({ name: 1, phone: 1, message: 1, createdAt: 1 })
          .lean(),
        Message.countDocuments({}),
      ]);

      return res.json({
        ok: true,
        data: { items, page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error("MessageController.list:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }

  // DELETE /api/admin/messages/:id (admin)
  static async remove(req, res) {
    try {
      const id = String(req.params?.id || "").trim();
      if (!id) return res.status(400).json({ ok: false, error: "ID_REQUIRED" });

      const deleted = await Message.findByIdAndDelete(id).lean();
      if (!deleted) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

      return res.json({ ok: true });
    } catch (err) {
      console.error("MessageController.remove:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }
}

module.exports = MessageController;
