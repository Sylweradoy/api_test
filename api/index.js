const app = require("../app/app");        // <- Twoje express app (ten plik co pokazałeś)
const connectDB = require("../app/db/connect");

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};

// co za zmiana!git 