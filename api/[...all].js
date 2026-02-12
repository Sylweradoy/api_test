const app = require("../app/app");
const connectDB = require("../app/db/connect");

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};