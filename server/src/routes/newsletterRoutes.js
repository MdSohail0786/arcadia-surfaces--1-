import { Router } from "express";
import { subscribe, newsletterValidators } from "../controllers/newsletterController.js";

const router = Router();

router.post("/subscribe", newsletterValidators, subscribe);

export default router;
