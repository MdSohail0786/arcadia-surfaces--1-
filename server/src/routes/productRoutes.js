import { Router } from "express";
import {
  listProducts,
  searchProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// IMPORTANT: /search must be registered before /:slug
router.get("/search", searchProducts);
router.get("/", listProducts);
router.get("/:slug", getProductBySlug);
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
