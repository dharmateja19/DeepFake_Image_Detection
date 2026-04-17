import { useState } from "react";
import axios from "axios";

const Upload = () => {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);

	const token = localStorage.getItem("token");

	const handleFileChange = (e) => {
		const selected = e.target.files[0];
		setFile(selected);

		if (selected) {
			setPreview(URL.createObjectURL(selected));
			setResult(null);
		}
	};

	const handleUpload = async () => {
		if (!file) return alert("Please select an image");

		setLoading(true);

		const formData = new FormData();
		formData.append("image", file);

		try {
			const res = await axios.post(
				"http://localhost:3000/api/images/upload", 
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				},
			);

			const data = res.data;

			setResult(data);
		} catch (err) {
			alert(err.response?.data?.message || "Upload failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
			<h1 className="text-3xl font-bold mb-6">Deepfake Image Detection</h1>

			{/* Upload Card */}
			<div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="mb-4"
				/>

				{/* Preview */}
				{preview && (
					<img
						src={preview}
						alt="preview"
						className="w-full h-64 object-cover rounded-lg mb-4"
					/>
				)}

				<button
					onClick={handleUpload}
					disabled={loading}
					className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
				>
					{loading ? "Analyzing..." : "Upload & Predict"}
				</button>
			</div>

			{/* Result */}
			{result && (
				<div className="mt-6 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
					<h2 className="text-xl font-semibold mb-2">Result</h2>

					<p
						className={`text-2xl font-bold ${
							result.finalLabel === "FAKE" ? "text-red-600" : "text-green-600"
						}`}
					>
						{result.finalLabel}
					</p>

					<p className="text-gray-600">
						Confidence: {result.confidence}
					</p>
				</div>
			)}
		</div>
	);
};

export default Upload;
