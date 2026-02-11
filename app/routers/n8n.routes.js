// KOD
const express = require("express");
const { n8nAuthSimple } = require("../middlewares/n8nAuthSimple");
const ctrl = require("../controllers/integrations/n8n.controller");

const router = express.Router();

router.get("/health", n8nAuthSimple, ctrl.health);
router.get("/users", n8nAuthSimple, ctrl.getUsers);
router.get("/users/:id", n8nAuthSimple, ctrl.getUserById);
router.post("/events", n8nAuthSimple, ctrl.createEvent);

module.exports = router;
