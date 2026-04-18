import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const token = sessionStorage.getItem("token");

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		navigate("/login");
	};

	const isActive = (path) =>
		location.pathname === path
			? "text-blue-600 font-semibold"
			: "text-gray-700 hover:text-blue-600";

	return (
		<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center border-b">
			{/* Logo */}
			<Link to="/">
				<h1 className="text-2xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
					Deepfake Detector
				</h1>
			</Link>

			{/* Links */}
			<div className="flex items-center gap-8 text-lg">
				{token ? (
					<>
						<Link to="/" className={isActive("/")}>
							Home
						</Link>

						<Link to="/dashboard" className={isActive("/dashboard")}>
							Dashboard
						</Link>

						<Link to="/upload" className={isActive("/upload")}>
							Upload
						</Link>

						<Link to="/history" className={isActive("/history")}>
							History
						</Link>

						<button
							onClick={handleLogout}
							className="bg-linear-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition shadow-md cursor-pointer"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<Link to="/login" className={isActive("/login")}>
							Login
						</Link>

						<Link to="/register" className={isActive("/register")}>
							Register
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
