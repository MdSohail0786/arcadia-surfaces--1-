import { Router } from "express";
import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import Project from "../models/Project.js";
import ContactEnquiry from "../models/ContactEnquiry.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/stats", requireAdmin, async (req, res, next) => {
  try {
    const [collections, products, projects, enquiries, subscribers, newEnquiries] =
      await Promise.all([
        Collection.countDocuments(),
        Product.countDocuments(),
        Project.countDocuments(),
        ContactEnquiry.countDocuments(),
        NewsletterSubscriber.countDocuments(),
        ContactEnquiry.countDocuments({ status: "new" }),
      ]);

    res.json({
      success: true,
      data: { collections, products, projects, enquiries, subscribers, newEnquiries },
      message: "Stats retrieved",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
