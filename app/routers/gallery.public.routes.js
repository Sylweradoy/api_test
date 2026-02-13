// KOD
const express = require("express");
const GalleryController = require("../controllers/gallery.controller");

const router = express.Router();

router.get("/categories", GalleryController.getCategories);
router.get("/categories/:slug", GalleryController.getCategoryBySlug);

module.exports = router;
