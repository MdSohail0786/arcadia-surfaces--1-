import { Router } from "express";
import {
  listCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listCollections);
router.get("/:slug", getCollectionBySlug);
router.post("/", requireAdmin, createCollection);
router.put("/:id", requireAdmin, updateCollection);
router.delete("/:id", requireAdmin, deleteCollection);

export default router;
