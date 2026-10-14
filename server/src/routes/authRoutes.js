import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, logout, refresh, me } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Stricter limiter on login to slow down credential stuffing
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later.", errors: [] },
});

router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAdmin, me);

export default router;
