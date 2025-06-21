import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

// ✅ Use env or hardcoded deployed URL
const BACKEND_URL = process.env.REACT_APP_API_URL || "https://kflex-backend.vercel.app";

const ReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    const filtered = reviews.filter(
      (r) =>
        (r.productName || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.userName || "").toLowerCase().includes(search.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [search, reviews]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/reviews`);
      setReviews(res.data);
      setFilteredReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        <h2 className="text-3xl font-bold mb-6 text-yellow-700">📝 Product Reviews</h2>

        <input
          type="text"
          placeholder="Search by product or user..."
          className="border p-2 rounded-xl shadow-sm w-full mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto bg-white/80 backdrop-blur-xl shadow-xl rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-900">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">User</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id} className="border-b hover:bg-yellow-50">
                  <td className="p-3">{review.productName || "N/A"}</td>
                  <td className="p-3">{review.userName}</td>
                  <td className="p-3">⭐ {review.rating}</td>
                  <td className="p-3">{review.comment}</td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewDashboard;
