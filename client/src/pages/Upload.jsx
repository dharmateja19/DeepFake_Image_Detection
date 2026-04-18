import { useState, useRef } from "react";
import api from "../api/api.js";
import { toast } from "react-toastify";

const Upload = () => {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [dragActive, setDragActive] = useState(false);

	const fileInputRef = useRef(null);
	const token = sessionStorage.getItem("token");

	const handleFile = (selected) => {
		if (!selected) return;

		setFile(selected);
		setPreview(URL.createObjectURL(selected));
		setResult(null);
	};

	const handleFileChange = (e) => {
		handleFile(e.target.files[0]);
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const droppedFile = e.dataTransfer.files[0];
		handleFile(droppedFile);
	};

	const handleUpload = async () => {
		if (!file) return toast.error("Please select an image");

		setLoading(true);

		const formData = new FormData();
		formData.append("image", file);

		try {
			const res = await api.post("/images/upload", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				},
			);

			setResult(res.data);
		} catch (err) {
			toast.error(err.response?.data?.message || "Upload failed");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setFile(null);
		setPreview(null);
		setResult(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold mb-8 text-gray-800">
				Deepfake Image Detection
			</h1>

			<div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
				{!preview && (
					<div
						className={`w-full h-72 flex flex-col justify-center items-center border-2 border-dashed rounded-2xl cursor-pointer transition ${
							dragActive
								? "border-blue-500 bg-blue-50"
								: "border-gray-300 bg-gray-100"
						}`}
						onDragEnter={handleDrag}
						onDragOver={handleDrag}
						onDragLeave={handleDrag}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current.click()}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>

						<p className="text-lg text-gray-700 mb-2">Drag & Drop your image</p>
						<p className="text-blue-600 font-semibold">or click to upload</p>
					</div>
				)}

				{file && <p className="mt-2 text-sm text-gray-500">{file.name}</p>}

				{preview && (
					<img
						src={preview}
						alt="preview"
						className="w-full h-72 object-contain bg-gray-100 rounded-xl mt-4 p-3"
					/>
				)}

				<div className="flex gap-3 mt-5">
					<button
						onClick={handleUpload}
						disabled={loading}
						className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-indigo-700"
					>
						{loading ? "Analyzing..." : "Upload & Predict"}
					</button>

					<button
						onClick={handleReset}
						className="w-full bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500"
					>
						Reset
					</button>
				</div>
			</div>

			{result && (
				<div className="mt-6 bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg text-center">
					<h2 className="text-xl font-semibold mb-2">Result</h2>

					<p
						className={`text-2xl font-bold ${
							result.finalLabel === "FAKE" ? "text-red-500" : "text-green-500"
						}`}
					>
						{result.finalLabel}
					</p>

					<p className="text-gray-600">Confidence: {result.confidence}</p>
				</div>
			)}
		</div>
	);
};

export default Upload;