import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    productCode: { type: String, required: true, unique: true, trim: true },
    // Named collectionRef (not `collection`) because `collection` is a
    // reserved Mongoose document pathname that collides with
    // Document.prototype.collection and can silently break populate().
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
      index: true,
    },
    material: {
      type: String,
      enum: ["linen", "natural-fiber", "vinyl", "textile", "acoustic", "custom"],
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["creative", "special-edition"],
      required: true,
    },
    applications: [
      {
        type: String,
        enum: ["residential", "hospitality", "commercial", "retail", "wellness"],
      },
    ],
    tags: [String],
    color: { type: String, trim: true },
    dimensions: {
      widthCm: Number,
      rollLengthM: Number,
      repeatCm: Number,
    },
    technicalInfo: { type: String },
    finishes: [String],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
      },
    ],
    technicalSheetUrl: { type: String },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(`${this.name}-${this.productCode || ""}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

productSchema.index({ name: "text", tags: "text", productCode: "text" });

export default mongoose.model("Product", productSchema);
