import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div className="bg-gray-100 min-h-screen">
			{/* 🔥 Hero Section */}
			<div className="text-center py-20 px-6 bg-white shadow-sm">
				<h1 className="text-4xl font-bold mb-4">
					Deepfake Image Detection System
				</h1>

				<p className="text-gray-600 max-w-xl mx-auto mb-6">
					Detect whether an image is REAL or FAKE using advanced deep learning
					models like EfficientNet and MobileNet.
				</p>

				<Link
					to="/upload"
					className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
				>
					Try Now
				</Link>
			</div>

			{/* 🚀 Features Section */}
			<div className="py-16 px-6 max-w-6xl mx-auto">
				<h2 className="text-2xl font-bold text-center mb-10">Key Features</h2>

				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">AI-Based Detection</h3>
						<p className="text-gray-600 text-sm">
							Uses deep learning models to accurately classify images as real or
							fake.
						</p>
					</div>

					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">Confidence Score</h3>
						<p className="text-gray-600 text-sm">
							Shows how confident the model is about its prediction.
						</p>
					</div>

					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">History Tracking</h3>
						<p className="text-gray-600 text-sm">
							View all your past uploads and predictions in one place.
						</p>
					</div>

					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">Fast Processing</h3>
						<p className="text-gray-600 text-sm">
							Get results instantly after uploading an image.
						</p>
					</div>

					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">Multiple Models</h3>
						<p className="text-gray-600 text-sm">
							Combines EfficientNet and MobileNet for better accuracy.
						</p>
					</div>

					<div className="bg-white p-6 rounded-2xl shadow">
						<h3 className="font-semibold text-lg mb-2">User Dashboard</h3>
						<p className="text-gray-600 text-sm">
							Analyze your usage with stats and recent activity.
						</p>
					</div>
				</div>
			</div>

			{/* 📣 CTA Section */}
			<div className="text-center py-16 bg-blue-600 text-white">
				<h2 className="text-2xl font-bold mb-4">
					Start Detecting Deepfakes Now
				</h2>

				<Link
					to="/upload"
					className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
				>
					Upload Image
				</Link>
			</div>
		</div>
	);
}
