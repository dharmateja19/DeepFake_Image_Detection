import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import History from "./pages/History";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./Components/Footer.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<BrowserRouter>
			<div className="flex flex-col min-h-screen">
				<Navbar />

				<main className="grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />

						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/upload"
							element={
								<ProtectedRoute>
									<Upload />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/history"
							element={
								<ProtectedRoute>
									<History />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</main>

				<Footer />
			</div>

			<ToastContainer position="top-right" autoClose={3000} />
		</BrowserRouter>
	);
}

export default App;
