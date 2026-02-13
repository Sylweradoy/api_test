// KOD
// controllers/gallery.controller.js
const GalleryCategory = require("../db/models/GalleryCategory");

class GalleryController {
  static toSlug(input) {
    return String(input)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  static async ensureUniqueSlug(baseSlug) {
    const first = await GalleryCategory.findOne({ slug: baseSlug })
      .select({ _id: 1 })
      .lean();
    if (!first) return baseSlug;

    let i = 2;
    while (i < 2000) {
      const candidate = `${baseSlug}-${i}`;
      // eslint-disable-next-line no-await-in-loop
      const exists = await GalleryCategory.findOne({ slug: candidate })
        .select({ _id: 1 })
        .lean();
      if (!exists) return candidate;
      i += 1;
    }
    throw new Error("Cannot generate unique slug");
  }

  // GET /admin/gallery/categories  (admin)  | GET /gallery/categories (public)
  static async getCategories(req, res) {
    try {
      const items = await GalleryCategory.find({})
        .sort({ createdAt: -1 })
        .select({ name: 1, slug: 1, images: 1, coverImageId: 1, updatedAt: 1 })
        .lean();

      return res.json({ ok: true, data: items });
    } catch (err) {
      console.error("GalleryController.getCategories:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }

  // GET /gallery/categories/:slug  (public) lub /admin/gallery/categories/:slug (admin)
  static async getCategoryBySlug(req, res) {
    try {
      const slug = (req.params.slug || "").toString().trim().toLowerCase();
      if (!slug) return res.status(400).json({ ok: false, error: "slug required" });

      const cat = await GalleryCategory.findOne({ slug })
        .select({
          name: 1,
          slug: 1,
          images: 1,
          coverImageId: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .lean();

      if (!cat) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

      return res.json({ ok: true, data: cat });
    } catch (err) {
      console.error("GalleryController.getCategoryBySlug:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }

  // POST /admin/gallery/categories  { name }
  static async createCategory(req, res) {
    try {
      const name = (req.body?.name || "").toString().trim();
      if (!name) return res.status(400).json({ ok: false, error: "name required" });

      const baseSlug = GalleryController.toSlug(name);
      if (!baseSlug) return res.status(400).json({ ok: false, error: "invalid name" });

      const slug = await GalleryController.ensureUniqueSlug(baseSlug);

      const doc = await GalleryCategory.create({
        name,
        slug,
        images: [],
        coverImageId: null,
      });

      return res.status(201).json({
        ok: true,
        data: { id: doc._id, name: doc.name, slug: doc.slug },
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(409).json({ ok: false, error: "CATEGORY_SLUG_EXISTS" });
      }
      console.error("GalleryController.createCategory:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }
  // KOD
// DELETE /admin/gallery/categories/:slug
static async deleteCategoryBySlug(req, res) {
  try {
    const slug = (req.params.slug || "").toString().trim().toLowerCase();
    if (!slug) return res.status(400).json({ ok: false, error: "slug required" });

    const deleted = await GalleryCategory.findOneAndDelete({ slug }).lean();

    if (!deleted) return res.status(404).json({ ok: false, error: "NOT_FOUND" });

    return res.json({ ok: true, data: { slug } });
  } catch (err) {
    console.error("GalleryController.deleteCategoryBySlug:", err);
    return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
  }
}


  // POST /admin/gallery/images  { categorySlug, imgLink, alt? }
  static async addImageToCategory(req, res) {
    try {
      const categorySlug = (req.body?.categorySlug || "")
        .toString()
        .trim()
        .toLowerCase();
      const imgLink = (req.body?.imgLink || "").toString().trim();
      const alt = (req.body?.alt || "").toString().trim();

      if (!categorySlug)
        return res.status(400).json({ ok: false, error: "categorySlug required" });
      if (!imgLink) return res.status(400).json({ ok: false, error: "imgLink required" });

      const cat = await GalleryCategory.findOne({ slug: categorySlug });
      if (!cat) return res.status(404).json({ ok: false, error: "CATEGORY_NOT_FOUND" });

      // ✅ blokada duplikatu linka w tej samej kategorii
      const normalized = imgLink.trim();
      const exists = cat.images.some((img) => (img.imgLink || "").trim() === normalized);
      if (exists) {
        return res.status(409).json({ ok: false, error: "OBRAZ_JUŻ_ISTNIEJE" });
      }

      const maxOrder = cat.images.reduce(
        (m, x) => (typeof x.order === "number" ? Math.max(m, x.order) : m),
        0
      );
      const nextOrder = cat.images.length ? maxOrder + 1 : 1;

      cat.images.push({ imgLink, alt, order: nextOrder });

      if (!cat.coverImageId && cat.images.length === 1) {
        cat.coverImageId = cat.images[0]._id;
      }

      await cat.save();

      const updated = await GalleryCategory.findById(cat._id).lean();
      return res.json({ ok: true, data: updated });
    } catch (err) {
      console.error("GalleryController.addImageToCategory:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }

  // DELETE /admin/gallery/images  { categorySlug, imageId }
  static async removeImageFromCategory(req, res) {
    try {
      const categorySlug = (req.body?.categorySlug || "")
        .toString()
        .trim()
        .toLowerCase();
      const imageId = (req.body?.imageId || "").toString().trim();

      if (!categorySlug)
        return res.status(400).json({ ok: false, error: "categorySlug required" });
      if (!imageId) return res.status(400).json({ ok: false, error: "imageId required" });

      const cat = await GalleryCategory.findOne({ slug: categorySlug });
      if (!cat) return res.status(404).json({ ok: false, error: "CATEGORY_NOT_FOUND" });

      const before = cat.images.length;
      cat.images = cat.images.filter((x) => String(x._id) !== imageId);

      if (cat.images.length === before) {
        return res.status(404).json({ ok: false, error: "IMAGE_NOT_FOUND" });
      }

      // jeśli usunąłeś cover, ustaw nowy cover (pierwszy po order)
      if (cat.coverImageId && String(cat.coverImageId) === imageId) {
        if (cat.images.length) {
          const sorted = [...cat.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          cat.coverImageId = sorted[0]._id;
        } else {
          cat.coverImageId = null;
        }
      }

      await cat.save();

      const updated = await GalleryCategory.findById(cat._id).lean();
      return res.json({ ok: true, data: updated });
    } catch (err) {
      console.error("GalleryController.removeImageFromCategory:", err);
      return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
    }
  }
}

module.exports = GalleryController;
