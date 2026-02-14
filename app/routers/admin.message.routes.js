// KOD
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const MessageController = require("../controllers/message.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/messages", MessageController.list);
router.delete("/messages/:id", MessageController.remove); // opcjonalnie

module.exports = router;
