import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    subject: { type: String, trim: true },
    enquiryType: {
      type: String,
      enum: [
        "product",
        "sample",
        "project",
        "bespoke-design",
        "showroom",
        "partnership",
        "press",
        "careers",
        "other",
      ],
      required: true,
    },
    message: { type: String, required: true },
    products: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        productCode: String,
      },
    ],
    consent: { type: Boolean, required: true },
    status: { type: String, enum: ["new", "in-progress", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactEnquiry", contactEnquirySchema);
