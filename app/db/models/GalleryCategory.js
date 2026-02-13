// KOD
// models/GalleryCategory.js
const mongoose = require("mongoose");

function isHttpUrl(v) {
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const GalleryImageSchema = new mongoose.Schema(
  {
    imgLink: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isHttpUrl,
        message: "imgLink must be a valid http/https URL",
      },
    },
    alt: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const GalleryCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    // okładka (id obrazka z images[])
    coverImageId: { type: mongoose.Schema.Types.ObjectId, default: null },

    images: { type: [GalleryImageSchema], default: [] },
  },
  { timestamps: true }
);

GalleryCategorySchema.index({ createdAt: -1 });
GalleryCategorySchema.index({ updatedAt: -1 });

module.exports =
  mongoose.models.GalleryCategory ||
  mongoose.model("GalleryCategory", GalleryCategorySchema);
