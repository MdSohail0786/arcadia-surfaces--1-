import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    data: {
      dbState: ["disconnected", "connected", "connecting", "disconnecting"][
        mongoose.connection.readyState
      ],
    },
  });
});

export default router;
