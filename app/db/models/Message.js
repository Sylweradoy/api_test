// KOD
// app/db/models/Message.js
const mongoose = require("mongoose");

function isPhone(v) {
  const s = String(v || "").trim();
  if (!s) return false;
  if (s.length < 6 || s.length > 24) return false;
  return /^[0-9+\-\s()]+$/.test(s);
}

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isPhone, message: "phone invalid" },
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

MessageSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
