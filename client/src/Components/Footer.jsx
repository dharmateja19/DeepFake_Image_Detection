import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        {/* Left */}
        <p className="text-sm">
          © {new Date().getFullYear()} Deepfake Detector
        </p>

        {/* Right */}
        <div className="flex gap-4 text-sm mt-2 md:mt-0">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/upload" className="hover:text-white">Upload</Link>
          <Link to="/history" className="hover:text-white">History</Link>
        </div>

      </div>
    </footer>
  );
}