import { body, validationResult } from "express-validator";
import ContactEnquiry from "../models/ContactEnquiry.js";
import { sendMail } from "../services/emailService.js";

export const contactValidators = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("enquiryType")
    .isIn([
      "product",
      "sample",
      "project",
      "bespoke-design",
      "showroom",
      "partnership",
      "press",
      "careers",
      "other",
    ])
    .withMessage("Invalid enquiry type"),
  body("message").trim().isLength({ min: 5 }).withMessage("Message is too short"),
  body("consent").custom((value) => value === true || value === "true").withMessage("Consent is required"),
];

// POST /api/contact
export async function submitContact(req, res, next) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.array().map((e) => e.msg),
      });
    }

    const enquiry = await ContactEnquiry.create(req.body);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

    await sendMail({
      to: adminEmail,
      subject: `New enquiry: ${enquiry.enquiryType} — ${enquiry.firstName} ${enquiry.lastName}`,
      text: `${enquiry.message}\n\nFrom: ${enquiry.email}${enquiry.phone ? ` / ${enquiry.phone}` : ""}`,
    });

    await sendMail({
      to: enquiry.email,
      subject: "We've received your enquiry — Arcadia Surfaces",
      text: `Hi ${enquiry.firstName},\n\nThanks for reaching out. Our team will follow up within two business days.\n\n— Arcadia Surfaces`,
    });

    res.status(201).json({
      success: true,
      data: { id: enquiry._id },
      message: "Enquiry submitted",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/contact (admin)
export async function listEnquiries(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [items, total] = await Promise.all([
      ContactEnquiry.find(query)
        .sort("-createdAt")
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      ContactEnquiry.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
      message: "Enquiries retrieved",
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/contact/:id (admin - update status)
export async function updateEnquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found", errors: [] });
    }
    res.json({ success: true, data: enquiry, message: "Enquiry updated" });
  } catch (err) {
    next(err);
  }
}
