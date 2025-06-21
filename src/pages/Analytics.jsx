import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#facc15", "#22c55e", "#f87171"]; // pending, completed, cancelled

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_URL;

      const ordersRes = await axios.get(`${baseURL}/api/orders`);
      const productsRes = await axios.get(`${baseURL}/api/products`);
      
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    };
    fetchData();
  }, []);

  const totalEarnings = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;

  const earningsPerMonth = {};
  orders.forEach((o) => {
    if (o.status === "Completed") {
      const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
      earningsPerMonth[month] = (earningsPerMonth[month] || 0) + o.totalAmount;
    }
  });

  const earningsData = Object.entries(earningsPerMonth).map(([month, earnings]) => ({
    month,
    earnings,
  }));

  const orderStatusData = [
    { name: "Pending", value: pendingOrders },
    { name: "Completed", value: completedOrders },
    { name: "Cancelled", value: cancelledOrders },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 bg-yellow-50 min-h-screen space-y-10 font-sans">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-yellow-700">Total Earnings</h3>
            <p className="text-3xl font-bold text-yellow-500">Rs. {totalEarnings}</p>
          </div>
          <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-green-700">Completed Orders</h3>
            <p className="text-3xl font-bold text-green-500">{completedOrders}</p>
          </div>
          <div className="bg-white/80 backdrop-blur p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold text-blue-700">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-500">{orders.length}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Earnings Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-yellow-600 mb-4">📊 Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart for Order Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-yellow-600 mb-4">📦 Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-yellow-600 mb-4">🔥 Top 5 Best Selling Products</h3>
          <ul className="space-y-2 text-sm text-gray-800">
            {products
              .sort((a, b) => (b.sold || 0) - (a.sold || 0))
              .slice(0, 5)
              .map((p, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-yellow-50 px-3 py-2 rounded shadow-sm"
                >
                  <span>{p.name}</span>
                  <span className="font-semibold text-yellow-600">{p.sold || 0} sold</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
