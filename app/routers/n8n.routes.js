const express = require("express");
const { n8nAuth } = require("../middlewares/n8nAuth");
const ctrl = require("../controllers/integrations/n8n.controller");

const router = express.Router();

// Wszystko zabezpieczone n8nAuth
router.get("/health", n8nAuth, ctrl.health);

// Users
router.get("/users", n8nAuth, ctrl.getUsers);
router.get("/users/:id", n8nAuth, ctrl.getUserById);

// Events (write)
router.post("/events", n8nAuth, ctrl.createEvent);

module.exports = router;