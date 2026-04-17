import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import History from "./pages/History";
import ProtectedRoute from "./Components/ProtectedRoute.jsx"
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./Components/Footer.jsx";


function App() {
	return (
		<BrowserRouter>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route path="/dashboard" element={<Dashboard />} />
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
			<Footer />
		</BrowserRouter>
	);
}

export default App;
