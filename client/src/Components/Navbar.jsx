import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
			{/* Logo / Title */}
			<Link to="/">
				<h1 className="text-xl font-bold text-blue-600">Deepfake Detector</h1>
			</Link>

			{/* Links */}
			<div className="flex items-center gap-6">
				{token ? (
					<>
						<Link
							to="/"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							Home
						</Link>
						<Link
							to="/dashboard"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							Dashboard
						</Link>
						<Link
							to="/upload"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							Upload
						</Link>

						<Link
							to="/history"
							className="text-gray-700 hover:text-blue-600 font-medium"
						>
							History
						</Link>

						<button
							onClick={handleLogout}
							className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link to="/login" className="text-gray-700 hover:text-blue-600">
							Login
						</Link>

						<Link to="/register" className="text-gray-700 hover:text-blue-600">
							Register
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
