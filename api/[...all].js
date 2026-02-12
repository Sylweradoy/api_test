const app = require("../app/app");

module.exports = (req, res) => {
  return app(req, res);
};