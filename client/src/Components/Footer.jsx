import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 py-4">
			<div className="max-w-6xl mx-auto px-6 text-center text-sm tracking-wide">
				© {new Date().getFullYear()} Deepfake Detector • Built with MERN and CNN 
			</div>
		</footer>
	);
}