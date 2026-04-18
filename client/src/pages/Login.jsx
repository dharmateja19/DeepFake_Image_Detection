import api from "../api/api.js";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await api.post("/auth/login", form);

			const data = res.data;

			sessionStorage.setItem("token", data.token);
			sessionStorage.setItem("user", JSON.stringify(data.user));

			toast.success("Login successful");
			navigate("/upload");
		} catch (err) {
			toast.error(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-blue-100 to-purple-100 p-6">

			<form
				onSubmit={handleSubmit}
				className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-200"
			>
				<h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
					Welcome Back
				</h2>
				
				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
					onChange={handleChange}
					required
				/>

				<div className="relative mb-4">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Enter your password"
						className="w-full p-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						onChange={handleChange}
						required
					/>

					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md disabled:opacity-50 cursor-pointer"
				>
					{loading ? "Logging in..." : "Login"}
				</button>

				<p className="text-sm mt-5 text-center text-gray-600">
					Don’t have an account?{" "}
					<Link
						to="/register"
						className="text-blue-600 font-semibold hover:underline"
					>
						Register
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Login;