// KOD
const express = require("express");
const rateLimit = require("express-rate-limit");
const MessageController = require("../controllers/message.controller");

const router = express.Router();

const sendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", sendLimiter, MessageController.create); // POST /api/messages

module.exports = router;
