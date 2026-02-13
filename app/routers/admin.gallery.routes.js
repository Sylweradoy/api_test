// KOD
// app/routers/admin.gallery.routes.js
const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const GalleryController = require("../controllers/gallery.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/gallery/categories", GalleryController.getCategories);
router.get("/gallery/categories/:slug", GalleryController.getCategoryBySlug);

router.post("/gallery/categories", GalleryController.createCategory);

// ✅ USUWANIE KATEGORII
router.delete("/gallery/categories/:slug", GalleryController.deleteCategoryBySlug);

router.post("/gallery/images", GalleryController.addImageToCategory);
router.delete("/gallery/images", GalleryController.removeImageFromCategory);
router.delete("/gallery/categories/:slug", GalleryController.deleteCategoryBySlug);

module.exports = router;
