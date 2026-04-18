// import cloudinary from "../config/cloudinary.js";
// import Image from "../models/Image.js";
// import Result from "../models/Result.js";
// import { exec } from "child_process";

// const runModel = (command) => {
// 	return new Promise((resolve, reject) => {
// 		exec(command, (err, stdout) => {
// 			if (err) return reject(err);

// 			const [label, conf] = stdout.trim().split(" ");
// 			resolve({
// 				label,
// 				conf: parseFloat(conf),
// 			});
// 		});
// 	});
// };

// export const uploadImage = async (req, res) => {
// 	try {
// 		if (!req.file) {
// 			return res.status(400).json({ message: "No file uploaded" });
// 		}

// 		// 1️⃣ Upload to Cloudinary
// 		const result = await cloudinary.uploader.upload(req.file.path);

// 		// 2️⃣ Save image first
// 		const image = new Image({
// 			userId: req.user.id,
// 			imageUrl: result.secure_url,
// 			publicId: result.public_id,
// 			format: result.format,
// 			width: result.width,
// 			height: result.height,
// 			size: result.bytes,
// 			localPath: req.file.path,
// 		});
// 		await image.save();

// 		const filePath = image.localPath;

// 		// 3️⃣ Run both models
// 		const eff = await runModel(`python ../model/predict.py ${filePath}`);
// 		const mob = await runModel(
// 			`python ../model/predict_mobilenet.py ${filePath}`,
// 		);

// 		const effConf = eff.conf / 100;
// 		const mobConf = mob.conf / 100;

// 		let finalLabel, finalConf;

// 		if (eff.label === mob.label) {
// 			finalLabel = eff.label;
// 			finalConf = (effConf + mobConf) / 2;
// 		} else {
// 			if (effConf > 0.95) {
// 				finalLabel = eff.label;
// 				finalConf = effConf;
// 			} else {
// 				finalLabel = mob.label;
// 				finalConf = mobConf;
// 			}
// 		}

// 		// 4️⃣ Save result
// 		await Result.create({
// 			userId: req.user.id,
// 			imageId: image._id,
// 			imageUrl: image.imageUrl,
// 			finalResult: finalLabel,
// 			confidence: finalConf,
// 			efficientnet: eff,
// 			mobilenet: mob,
// 		});

// 		// 5️⃣ Send response
// 		res.status(200).json({
// 			message: "Image uploaded and analyzed",
// 			imageUrl: image.imageUrl,
// 			finalLabel,
// 			confidence: (finalConf * 100).toFixed(2) + "%",
// 			efficientnet: eff,
// 			mobilenet: mob,
// 		});
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

// export const getUserHistory = async (req, res) => {
// 	try {
// 		const results = await Result.find({ userId: req.user.id }).sort({
// 			createdAt: -1,
// 		});

// 		res.json(results);
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

import cloudinary from "../config/cloudinary.js";
import Image from "../models/Image.js";
import Result from "../models/Result.js";
import { spawn } from "child_process";
import path from "path";

const PYTHON_CMD = "python";

const baseDir = process.cwd();

const effPath = path.join(baseDir, "ML", "predict_efficientnet.py");
const mobPath = path.join(baseDir, "ML", "predict_mobilenet.py");

const runModel = (scriptPath, filePath) => {
	return new Promise((resolve, reject) => {
		const processPy = spawn(PYTHON_CMD, [scriptPath, filePath]);

		let output = "";

		processPy.stdout.on("data", (data) => {
			output += data.toString();
		});

		processPy.stderr.on("data", (err) => {
			console.error("Python error:", err.toString());
		});

		processPy.on("close", (code) => {
			if (code !== 0) {
				return reject(new Error("Python process failed"));
			}

			const [label, conf] = output.trim().split(" ");

			resolve({
				label,
				conf: parseFloat(conf),
			});
		});
	});
};

export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const result = await cloudinary.uploader.upload(req.file.path);

		const image = new Image({
			userId: req.user.id,
			imageUrl: result.secure_url,
			publicId: result.public_id,
			format: result.format,
			width: result.width,
			height: result.height,
			size: result.bytes,
		});
		await image.save();

		const filePath = req.file.path;

		const [eff, mob] = await Promise.all([
			runModel(effPath, filePath),
			runModel(mobPath, filePath),
		]);

		const effConf = eff.conf / 100;
		const mobConf = mob.conf / 100;

		let finalLabel, finalConf;

		const effWeight = 0.6;
		const mobWeight = 0.4;

		if (eff.label === mob.label) {
			finalLabel = eff.label;
			finalConf = effConf * effWeight + mobConf * mobWeight;
		} else {
			const effScore = eff.label === "REAL" ? effConf * effWeight : 0;
			const mobScore = mob.label === "REAL" ? mobConf * mobWeight : 0;

			finalLabel = effScore > mobScore ? "REAL" : "FAKE";
			finalConf = Math.max(effConf, mobConf);
		}
		
		await Result.create({
			userId: req.user.id,
			imageId: image._id,
			imageUrl: image.imageUrl,
			finalResult: finalLabel,
			confidence: finalConf,
			efficientnet: eff,
			mobilenet: mob,
		});

		res.status(200).json({
			message: "Image uploaded and analyzed",
			imageUrl: image.imageUrl,
			finalLabel,
			confidence: (finalConf * 100).toFixed(2) + "%",
			efficientnet: eff,
			mobilenet: mob,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).json({ message: error.message });
	}
};

export const getUserHistory = async (req, res) => {
	try {
		const results = await Result.find({ userId: req.user.id }).sort({
			createdAt: -1,
		});

		res.json(results);
	} catch (error) {
		console.error("History error:", error);
		res.status(500).json({ message: error.message });
	}
};
