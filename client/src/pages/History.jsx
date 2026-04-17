import axios from "axios";
import { useEffect, useState } from "react";

const History = () => {
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/images/history", // ✅ fixed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImages(res.data);
      setFiltered(res.data);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🔍 Filter logic
  const handleFilter = (type) => {
    setFilter(type);

    if (type === "ALL") {
      setFiltered(images);
    } else {
      setFiltered(images.filter((img) => img.finalResult === type)); // ✅ fixed
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your History</h1>

      {/* 🔘 Filters */}
      <div className="flex justify-center gap-4 mb-6">
        {["ALL", "REAL", "FAKE"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilter(type)}
            className={`px-4 py-2 rounded-lg ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <p className="text-center text-gray-600">Loading...</p>
      )}

      {/* 📦 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {!loading && filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No images found
          </p>
        )}

        {filtered.map((img) => (
          <div
            key={img._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Image */}
            <img
              src={img.imageUrl}
              alt="uploaded"
              className="w-full h-48 object-cover"
            />

            {/* Details */}
            <div className="p-4 text-center">

              <p
                className={`text-lg font-bold ${
                  img.finalResult === "FAKE"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {img.finalResult}
              </p>

              <p className="text-sm text-gray-600">
                {(img.confidence * 100).toFixed(2)}%
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(img.createdAt).toLocaleString()}
              </p>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;