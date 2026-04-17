import express from "express";
import { uploadImage, getUserHistory } from "../controllers/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// 📁 Multer config (store locally before cloudinary)
const upload = multer({ dest: "uploads/" });

// 🔥 1. Upload + Predict + Save
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

// 📜 2. Get User History
router.get("/history", authMiddleware, getUserHistory);

export default router;
