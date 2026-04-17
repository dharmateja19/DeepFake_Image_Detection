import express from "express";
import { predictImage, getUserHistory } from "../controllers/predictionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/predict", authMiddleware, predictImage);
router.get("/history", authMiddleware, getUserHistory);

export default router;