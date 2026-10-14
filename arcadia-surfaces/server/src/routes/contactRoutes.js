import { Router } from "express";
import {
  submitContact,
  contactValidators,
  listEnquiries,
  updateEnquiryStatus,
} from "../controllers/contactController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", contactValidators, submitContact);
router.get("/", requireAdmin, listEnquiries);
router.put("/:id", requireAdmin, updateEnquiryStatus);

export default router;
