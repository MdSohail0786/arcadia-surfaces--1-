import mongoose from "mongoose";
import slugify from "slugify";

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: {
      type: String,
      enum: ["creative", "special-edition"],
      required: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    story: { type: String, required: true },
    designPhilosophy: { type: String },
    heroImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
    gallery: [
      {
        url: String,
        alt: String,
      },
    ],
    applications: [
      {
        type: String,
        enum: ["residential", "hospitality", "commercial", "retail", "wellness"],
      },
    ],
    styles: [
      {
        type: String,
        enum: ["botanical", "abstract", "geometric", "artistic", "architectural", "textural"],
      },
    ],
    materials: [
      {
        type: String,
        enum: ["linen", "natural-fiber", "vinyl", "textile", "acoustic", "custom"],
      },
    ],
    featured: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true }
);

collectionSchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

collectionSchema.index({ name: "text", shortDescription: "text", story: "text" });

export default mongoose.model("Collection", collectionSchema);
