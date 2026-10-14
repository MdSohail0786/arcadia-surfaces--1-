import { Router } from "express";
import {
  listProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listProjects);
router.get("/:slug", getProjectBySlug);
router.post("/", requireAdmin, createProject);
router.put("/:id", requireAdmin, updateProject);
router.delete("/:id", requireAdmin, deleteProject);

export default router;
