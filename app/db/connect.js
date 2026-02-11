// KOD
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false, // OK w dev, w prod można wyłączyć
      dbName: "api_tomix", // <- TU wymuszasz nazwę bazy
    });

    console.log("✅ MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;