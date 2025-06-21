import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/orders`);
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (statusFilter !== "All") {
      data = data.filter((o) => o.status === statusFilter);
    }
    if (searchQuery) {
      data = data.filter((o) =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(data);
    setCurrentPage(1);
  }, [statusFilter, searchQuery, orders]);

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${BACKEND_URL}/api/orders/${id}`, { status });
      setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
      setSelectedOrder((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    XLSX.writeFile(wb, "Orders.xlsx");
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        <h2 className="text-3xl font-bold mb-6 text-yellow-700">📦 Orders</h2>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded-xl shadow-sm focus:ring-yellow-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border p-2 rounded-xl shadow-sm focus:ring-yellow-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={exportToExcel}
            className="bg-[#feb500] hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium transition"
          >
            ⬇ Export Excel
          </button>
        </div>

        <div className="overflow-x-auto bg-white/80 backdrop-blur-xl shadow-xl rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-yellow-100 text-yellow-900">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((o) => (
                <tr key={o._id} className="border-b hover:bg-yellow-50">
                  <td className="p-3 font-medium">{o.name}</td>
                  <td className="p-3">Rs. {o.totalAmount || 0}</td>
                  <td
                    className={`p-3 font-semibold ${
                      o.status === "Cancelled"
                        ? "text-red-600"
                        : o.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {o.status}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-xl hover:bg-yellow-500 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteOrder(o._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from(
            { length: Math.ceil(filteredOrders.length / ordersPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-xl font-medium ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>

        {/* Order Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
            >
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-black"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold mb-3 text-yellow-800">Order Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Name:</strong> {selectedOrder.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Email:</strong> {selectedOrder.email}</p>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-bold ${
                      selectedOrder.status === "Cancelled"
                        ? "text-red-600"
                        : selectedOrder.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                  <p><strong>Total:</strong> Rs. {selectedOrder.totalAmount || 0}</p>
                  <p><strong>Ordered On:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>

                <h4 className="mt-5 font-semibold text-lg text-yellow-700">Products:</h4>
                <div className="space-y-3 mt-3 max-h-60 overflow-y-auto pr-1">
                  {selectedOrder.products?.map((p, i) => (
                    <div
                      key={i}
                      className={`flex gap-4 items-center p-3 border rounded-xl ${
                        selectedOrder.status === "Cancelled" ? "line-through text-red-500" : ""
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-gray-600">Size: {p.selectedSize || "N/A"}</p>
                        <p className="text-sm text-gray-600">Price: Rs. {p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  {selectedOrder.status === "Cancelled" ? (
                    <button
                      onClick={() => updateStatus(selectedOrder._id, "Pending")}
                      className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600"
                    >
                      Undo
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => updateStatus(selectedOrder._id, "Cancelled")}
                        className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateStatus(selectedOrder._id, "Completed")}
                        className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                      >
                        Complete ✅
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
