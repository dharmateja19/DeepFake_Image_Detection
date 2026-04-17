// import { exec } from "child_process";
// import Result from "../models/Result.js";

// const runModel = (command) => {
//   return new Promise((resolve, reject) => {
//     exec(command, (err, stdout) => {
//       if (err) return reject(err);

//       const [label, conf] = stdout.trim().split(" ");
//       resolve({
//         label,
//         conf: parseFloat(conf)
//       });
//     });
//   });
// };

// const predictImage = async (req, res) => {
//   try {
//     const imagePath = req.file.path;

//     const eff = await runModel(`python ../model/predict.py ${imagePath}`);
//     const mob = await runModel(`python ../model/predict_mobilenet.py ${imagePath}`);

//     const effConf = eff.conf / 100;
//     const mobConf = mob.conf / 100;

//     let finalLabel, finalConf;

//     if (eff.label === mob.label) {
//         finalLabel = eff.label;
//         finalConf = (effConf + mobConf) / 2;
//     } else {
//         if (effConf > 0.95) {
//             finalLabel = eff.label;
//             finalConf = effConf;
//         } else {
//             finalLabel = mob.label;
//             finalConf = mobConf;
//         }
//     }

//     // ✅ Save to DB
//     await Result.create({
//         imagePath,
//         finalResult: finalLabel,
//         confidence: finalConf,
//         efficientnet: eff,
//         mobilenet: mob
//     });

//     res.json({
//         final: finalLabel,
//         confidence: (finalConf * 100).toFixed(2) + "%",
//         efficientnet: {
//             label: eff.label,
//             conf: (effConf * 100).toFixed(2) + "%"
//         },
//         mobilenet: {
//             label: mob.label,
//             conf: mob.conf.toFixed(2) + "%"
//         }
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default predictImage;

import Image from "../models/Image.js";
import Result from "../models/Result.js";
import { exec } from "child_process";

const runModel = (command) => {
	return new Promise((resolve, reject) => {
		exec(command, (err, stdout) => {
			if (err) return reject(err);

			const [label, conf] = stdout.trim().split(" ");
			resolve({
				label,
				conf: parseFloat(conf),
			});
		});
	});
};

export const predictImage = async (req, res) => {
	try {
		const { imageId } = req.body;

		const image = await Image.findById(imageId);

		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}

		const filePath = image.localPath;

		const eff = await runModel(`python ../model/predict.py ${filePath}`);
		const mob = await runModel(
			`python ../model/predict_mobilenet.py ${filePath}`,
		);

		const effConf = eff.conf / 100;
		const mobConf = mob.conf / 100;

		let finalLabel, finalConf;

		if (eff.label === mob.label) {
			finalLabel = eff.label;
			finalConf = (effConf + mobConf) / 2;
		} else {
			if (effConf > 0.95) {
				finalLabel = eff.label;
				finalConf = effConf;
			} else {
				finalLabel = mob.label;
				finalConf = mobConf;
			}
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

		res.json({
			imageUrl: image.imageUrl,
			finalLabel: finalLabel,
			confidence: (finalConf * 100).toFixed(2) + "%",
			efficientnet: eff,
			mobilenet: mob,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getUserHistory = async (req, res) => {
	try {
		const results = await Image.find({ userId: req.user.id }).sort({
			createdAt: -1,
		});

		res.json(results);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
