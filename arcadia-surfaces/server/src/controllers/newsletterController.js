import { body, validationResult } from "express-validator";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { sendMail } from "../services/emailService.js";

export const newsletterValidators = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("consent").custom((value) => value === true || value === "true").withMessage("Consent is required"),
];

// POST /api/newsletter/subscribe
export async function subscribe(req, res, next) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.array().map((e) => e.msg),
      });
    }

    const { email, firstName, consent } = req.body;
    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed",
        errors: [],
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: normalizedEmail,
      firstName,
      consent,
    });

    await sendMail({
      to: normalizedEmail,
      subject: "You're subscribed — Arcadia Surfaces",
      text: `Thanks for subscribing to the Arcadia Surfaces journal.${
        firstName ? ` See you soon, ${firstName}.` : ""
      }`,
    });

    res.status(201).json({
      success: true,
      data: { id: subscriber._id },
      message: "Subscribed",
    });
  } catch (err) {
    // Race-condition fallback if two requests slip past the findOne check
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed",
        errors: [],
      });
    }
    next(err);
  }
}
