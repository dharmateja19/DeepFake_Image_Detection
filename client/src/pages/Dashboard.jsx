import api from "../api/api.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
	const [data, setData] = useState([]);
	const [user, setUser] = useState({
		name: "",
		email: "",
	});

	const [stats, setStats] = useState({
		total: 0,
		real: 0,
		fake: 0,
	});

	const [loading, setLoading] = useState(true);

	const token = sessionStorage.getItem("token");

	const fetchData = async () => {
		try {
			const [historyRes, userRes] = await Promise.all([
				api.get("/images/history", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				api.get("/user/me", {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);

			const results = historyRes.data;
			setData(results);
			setUser(userRes.data.user);

			const total = results.length;
			const real = results.filter((r) => r.finalResult === "REAL").length;
			const fake = results.filter((r) => r.finalResult === "FAKE").length;

			setStats({ total, real, fake });
		} catch {
			toast.error("Failed to load dashboard");
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
		<div className="min-h-screen bg-gradient-to-br from-gray-100 via-purple-100 to-pink-100 p-6">
			{/* Header */}
			<h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
				Dashboard
			</h1>

			{/* 👤 Profile Section */}
			<div className="max-w-5xl mx-auto mb-8">
				<div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-600 to-red-700 text-white flex items-center justify-center text-2xl font-bold">
							{user?.name?.charAt(0)?.toUpperCase() || "U"}
						</div>

						<div>
							<h2 className="text-2xl font-bold text-gray-800">
								Hi {user.name || "User"}!
							</h2>
							{/* <p className="text-gray-500">{user.email}</p> */}
						</div>
					</div>

				
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-5xl mx-auto">
				<div className="bg-white/80 p-6 rounded-2xl shadow-lg text-center">
					<p className="text-gray-500">Total Images</p>
					<p className="text-3xl font-bold text-gray-800">{stats.total}</p>
				</div>

				<div className="bg-green-100 p-6 rounded-2xl shadow-lg text-center">
					<p className="text-green-700">REAL</p>
					<p className="text-3xl font-bold text-green-800">{stats.real}</p>
				</div>

				<div className="bg-red-100 p-6 rounded-2xl shadow-lg text-center">
					<p className="text-red-700">FAKE</p>
					<p className="text-3xl font-bold text-red-800">{stats.fake}</p>
				</div>
			</div>

			{/* Distribution */}
			<div className="bg-white/90 p-6 rounded-3xl shadow-xl mb-10 max-w-5xl mx-auto">
				<h2 className="text-xl font-semibold mb-6 text-gray-800">
					Prediction Distribution
				</h2>

				<div className="mb-4">
					<div className="flex justify-between text-sm mb-1">
						<span className="text-green-700">REAL</span>
						<span>{realPercent}%</span>
					</div>

					<div className="w-full bg-gray-200 h-3 rounded-full">
						<div
							className="bg-green-500 h-3 rounded-full"
							style={{ width: `${realPercent}%` }}
						></div>
					</div>
				</div>

				<div>
					<div className="flex justify-between text-sm mb-1">
						<span className="text-red-700">FAKE</span>
						<span>{fakePercent}%</span>
					</div>

					<div className="w-full bg-gray-200 h-3 rounded-full">
						<div
							className="bg-red-500 h-3 rounded-full"
							style={{ width: `${fakePercent}%` }}
						></div>
					</div>
				</div>
			</div>

			{/* Recent Uploads */}
			<div className="bg-white/90 p-6 rounded-3xl shadow-xl max-w-5xl mx-auto">
				<h2 className="text-xl font-semibold mb-6 text-gray-800">
					Recent Uploads
				</h2>

				{loading ? (
					<p>Loading...</p>
				) : data.length === 0 ? (
					<p>No data available</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
						{data.slice(0, 4).map((item) => (
							<div
								key={item._id}
								className="bg-gray-50 rounded-xl p-2 shadow hover:shadow-lg transition"
							>
								<div className="h-28 bg-gray-100 rounded-lg p-1 border">
									<div className="h-full flex items-center justify-center bg-white rounded-md overflow-hidden">
										<img
											src={item.imageUrl}
											className="max-h-full max-w-full object-contain"
										/>
									</div>
								</div>

								<p
									className={`text-sm text-center mt-2 font-semibold ${
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