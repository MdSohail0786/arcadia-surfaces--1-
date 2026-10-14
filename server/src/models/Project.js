import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: {
      type: String,
      enum: ["residential", "hospitality", "commercial", "retail", "workplace", "wellness"],
      required: true,
      index: true,
    },
    location: { type: String, required: true },
    architect: { type: String },
    year: { type: Number },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: {
      url: { type: String, required: true },
      alt: { type: String, required: true },
    },
    gallery: [
      {
        url: String,
        alt: String,
      },
    ],
    relatedCollections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
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

projectSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Project", projectSchema);
