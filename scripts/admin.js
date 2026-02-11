// KOD
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../app/db/models/User"); // <- dopasuj ścieżkę

async function run() {
  const email = process.env.ADMIN_EMAIL || "admin@admin.pl";
  const pass = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Moozaik";

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "api_tomix", // <- NAJWAŻNIEJSZE
  });

  const passwordHash = await bcrypt.hash(pass, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name, email, passwordHash, role: "admin" } },
    { new: true, upsert: true }
  );

  console.log("✅ Admin ready:", {
    db: mongoose.connection.name,
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ seed-admin error:", e);
  process.exit(1);
});
