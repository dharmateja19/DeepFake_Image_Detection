import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await axios.post(
				"http://localhost:3000/api/auth/login",
				form,
			);

			const data = res.data;

			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));

			alert("Login successful");
			window.location.href = "/upload";
		} catch (err) {
			alert(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-2xl shadow-lg w-96"
			>
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

				<input
					type="email"
					name="email"
					placeholder="Email"
					className="w-full p-3 mb-4 border rounded-lg"
					onChange={handleChange}
					required
				/>

				<div className="relative mb-4">
					<input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						className="w-full p-3 border rounded-lg pr-10"
						onChange={handleChange}
						required
					/>

					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
					>
						{showPassword ? <FaEyeSlash /> : <FaEye />}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
				>
					{loading ? "Logging in..." : "Login"}
				</button>

				<p className="text-sm mt-4 text-center">
					Don’t have an account?{" "}
					<a href="/register" className="text-blue-600">
						Register
					</a>
				</p>
			</form>
		</div>
	);
};

export default Login;
