// KOD
const express = require('express');
const rateLimit = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

// Rate limit na login (ochrona brute-force)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minuta
  max: 10,              // max 10 prób / min / IP
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/auth/login', loginLimiter, authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', requireAuth, authController.me);

router.use("/admin", require("./admin.gallery.routes"));
router.use("/gallery", require("./gallery.public.routes"));

module.exports = router;
