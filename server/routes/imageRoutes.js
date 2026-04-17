import express from "express";
import { uploadImage, getUserHistory } from "../controllers/imageController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

router.get("/history", authMiddleware, getUserHistory);

export default router;
