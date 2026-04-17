import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const History = () => {
	const [images, setImages] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [filter, setFilter] = useState("ALL");
	const [loading, setLoading] = useState(true);

	const token = localStorage.getItem("token");

	const fetchHistory = async () => {
		try {
			const res = await axios.get("http://localhost:3000/api/images/history", {
				headers: { Authorization: `Bearer ${token}` },
			});

			setImages(res.data);
			setFiltered(res.data);
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to load history");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const handleFilter = (type) => {
		setFilter(type);

		if (type === "ALL") {
			setFiltered(images);
		} else {
			setFiltered(images.filter((img) => img.finalResult === type));
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">
			<h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
				Your History
			</h1>

			<div className="flex justify-center gap-4 mb-10">
				{["ALL", "REAL", "FAKE"].map((type) => (
					<button
						key={type}
						onClick={() => handleFilter(type)}
						className={`px-6 py-2 rounded-full font-medium transition shadow-sm cursor-pointer ${
							filter === type
								? type === "REAL"
									? "bg-green-500 text-white"
									: type === "FAKE"
										? "bg-red-500 text-white"
										: "bg-blue-600 text-white"
								: "bg-white text-gray-700 hover:bg-gray-100"
						}`}
					>
						{type}
					</button>
				))}
			</div>

			{loading && <p className="text-center text-gray-600">Loading...</p>}

			<div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{!loading && filtered.length === 0 && (
					<p className="col-span-full text-center text-gray-500">
						No images found
					</p>
				)}

				{filtered.map((img) => (
					<div
						key={img._id}
						className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
					>
						<div className="h-52 flex items-center justify-center bg-gray-100">
							<img
								src={img.imageUrl}
								alt="uploaded"
								className="max-h-full max-w-full object-contain"
							/>
						</div>

						<div className="p-4 text-center">
							<p
								className={`text-lg font-bold ${
									img.finalResult === "FAKE" ? "text-red-500" : "text-green-500"
								}`}
							>
								{img.finalResult}
							</p>

							<p className="text-sm text-gray-600">
								Confidence:{" "}
								<span className="font-semibold text-gray-800">
									{(img.confidence * 100).toFixed(2)}%
								</span>
							</p>

							{/* <p className="text-xs text-gray-400 mt-2">
								{new Date(img.createdAt).toLocaleString()}
							</p> */}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default History;
