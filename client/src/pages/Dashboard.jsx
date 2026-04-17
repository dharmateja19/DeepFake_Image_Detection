import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const [data, setData] = useState([]);
	const [stats, setStats] = useState({
		total: 0,
		real: 0,
		fake: 0,
	});
	const [loading, setLoading] = useState(true);

	const token = localStorage.getItem("token");

	const fetchData = async () => {
		try {
			const res = await axios.get("http://localhost:3000/api/images/history", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const results = res.data;
			setData(results);

			// 🔢 Calculate stats
			const total = results.length;
			const real = results.filter((r) => r.finalResult === "REAL").length;
			const fake = results.filter((r) => r.finalResult === "FAKE").length;

			setStats({ total, real, fake });
		} catch (err) {
			alert("Failed to load dashboard");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const realPercent =
		stats.total > 0 ? ((stats.real / stats.total) * 100).toFixed(1) : 0;

	const fakePercent =
		stats.total > 0 ? ((stats.fake / stats.total) * 100).toFixed(1) : 0;

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

			{/* 🔢 Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 rounded-2xl shadow text-center">
					<h2 className="text-gray-500">Total Images</h2>
					<p className="text-2xl font-bold">{stats.total}</p>
				</div>

				<div className="bg-white p-6 rounded-2xl shadow text-center">
					<h2 className="text-green-500">REAL</h2>
					<p className="text-2xl font-bold">{stats.real}</p>
				</div>

				<div className="bg-white p-6 rounded-2xl shadow text-center">
					<h2 className="text-red-500">FAKE</h2>
					<p className="text-2xl font-bold">{stats.fake}</p>
				</div>
			</div>

			{/* 📊 Percentage Bars */}
			<div className="bg-white p-6 rounded-2xl shadow mb-8">
				<h2 className="text-lg font-semibold mb-4">Prediction Distribution</h2>

				<div className="mb-3">
					<p className="text-sm text-gray-600">REAL ({realPercent}%)</p>
					<div className="w-full bg-gray-200 h-3 rounded">
						<div
							className="bg-green-500 h-3 rounded"
							style={{ width: `${realPercent}%` }}
						></div>
					</div>
				</div>

				<div>
					<p className="text-sm text-gray-600">FAKE ({fakePercent}%)</p>
					<div className="w-full bg-gray-200 h-3 rounded">
						<div
							className="bg-red-500 h-3 rounded"
							style={{ width: `${fakePercent}%` }}
						></div>
					</div>
				</div>
			</div>

			{/* 🕒 Recent Activity */}
			<div className="bg-white p-6 rounded-2xl shadow">
				<h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>

				{loading ? (
					<p>Loading...</p>
				) : data.length === 0 ? (
					<p className="text-gray-500">No data available</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{data.slice(0, 5).map((item) => (
							<div key={item._id}>
								<img
									src={item.imageUrl}
									className="h-24 w-full object-cover rounded-lg"
								/>
								<p
									className={`text-sm text-center mt-1 ${
										item.finalResult === "FAKE"
											? "text-red-500"
											: "text-green-500"
									}`}
								>
									{item.finalResult}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
