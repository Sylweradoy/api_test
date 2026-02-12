const app = require("../app/app");
const connectDB = require("../app/db/connect");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Vercel handler error:", err);
    return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
  }
};