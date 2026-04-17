import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div className="bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 min-h-screen">

			{/* Hero Section */}
			<div className="text-center py-24 px-6">
				<h1 className="text-5xl font-extrabold mb-6 text-gray-800">
					Deepfake Image Detection
				</h1>

				<p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
					Detect whether an image is REAL or FAKE using advanced deep learning
					models like EfficientNet and MobileNet with high accuracy.
				</p>

				<div className="flex justify-center gap-4">
					<Link
						to="/upload"
						className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
					>
						Try Now
					</Link>

					<Link
						to="/dashboard"
						className="bg-white text-gray-800 px-8 py-3 rounded-xl shadow hover:bg-gray-100"
					>
						View Dashboard
					</Link>
				</div>
			</div>

			{/* Features Section */}
			<div className="py-20 px-6 max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-center mb-14 text-gray-800">
					Key Features
				</h2>

				<div className="grid md:grid-cols-3 gap-8">

					{[
						{
							title: "AI-Based Detection",
							desc: "Deep learning models classify images as real or fake with high accuracy.",
						},
						{
							title: "Confidence Score",
							desc: "Get probability-based confidence for every prediction.",
						},
						{
							title: "History Tracking",
							desc: "Access all your previous uploads and results anytime.",
						},
						{
							title: "Fast Processing",
							desc: "Instant predictions with optimized backend models.",
						},
						{
							title: "Multiple Models",
							desc: "Combines EfficientNet and MobileNet for better performance.",
						},
						{
							title: "User Dashboard",
							desc: "Track usage stats and analyze activity visually.",
						},
					].map((item, index) => (
						<div
							key={index}
							className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
						>
							<h3 className="font-semibold text-lg mb-2 text-gray-800">
								{item.title}
							</h3>
							<p className="text-gray-600 text-sm">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</div>

			<div className="text-center py-20">
				<div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-3xl max-w-4xl mx-auto p-10 shadow-xl">
					
					<h2 className="text-3xl font-bold mb-4">
						Start Detecting Deepfakes Now
					</h2>

					<p className="mb-6 text-blue-100">
						Upload your image and get instant AI-powered results.
					</p>

					<Link
						to="/upload"
						className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100"
					>
						Upload Image
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Home