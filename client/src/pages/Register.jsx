import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
	});
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
			const res = await axios.post(
				"http://localhost:3000/api/auth/register",
				form
			);

			const data = res.data;

			toast.success("Registration successful");

			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));

			navigate("/upload");
		} catch (err) {
			toast.error(err.response?.data?.message || "Registration failed");
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
					Create Account
				</h2>

				<input
					type="text"
					name="name"
					placeholder="Enter your name"
					className="w-full p-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
					onChange={handleChange}
					required
				/>

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
						placeholder="Create a password"
						className="w-full p-3 border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						onChange={handleChange}
						required
					/>

					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition shadow-md disabled:opacity-50 cursor-pointer"
				>
					{loading ? "Registering..." : "Register"}
				</button>

				<p className="text-sm mt-5 text-center text-gray-600">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-600 font-semibold hover:underline"
					>
						Login
					</Link>
				</p>
			</form>
		</div>
	);
};

export default Register;