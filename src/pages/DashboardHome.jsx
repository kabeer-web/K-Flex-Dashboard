  // No change to imports
  import React, { useEffect, useState } from "react";
  import DashboardLayout from "../components/DashboardLayout";
  import { Link } from "react-router-dom";
  import { FaBoxOpen, FaDollarSign, FaUsers, FaPlus } from "react-icons/fa";
  import axios from "axios";

  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
  } from "recharts";

  const DashboardHome = () => {
    const [stats, setStats] = useState({
      products: 0,
      earnings: 0,
      users: 8,
      recentOrders: [],
      lowStock: [],
    });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const productsRes = await axios.get("http://localhost:5000/api/products");
          const ordersRes = await axios.get("http://localhost:5000/api/orders");

          const products = productsRes.data;
          const orders = ordersRes.data;

          const earnings = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
          const lowStock = products.filter((p) => p.stock <= 5);
          const recentOrders = orders.slice(-5).reverse();

          setStats({
            products: products.length,
            earnings,
            users: 8,
            recentOrders: recentOrders.map((o) => ({
              id: o._id.slice(-5),
              customer: o.name,
              status: o.status,
              totalAmount: o.totalAmount || 0,
              date: new Date(o.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            })),
            lowStock: lowStock.map((p) => ({
              name: p.name,
              stock: p.stock,
            })),
          });
        } catch (err) {
          console.error("Dashboard data fetch error:", err);
        }
      };

      fetchData();
    }, []);

    const chartData = stats.recentOrders.map((order) => ({
      name: order.date,
      amount: parseFloat(order.totalAmount),
    }));

    return (
      <DashboardLayout>
        {/* Shortcut Buttons */}
        <div className="flex flex-wrap gap-4 justify-end mb-8">
          <Link
            to="/products"
            className="bg-[#feb500] text-black px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-yellow-500/40 hover:scale-105 transition-all duration-300"
          >
            <FaBoxOpen className="inline mr-2" /> View Products
          </Link>
          <Link
            to="/products"
            className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
          >
            <FaPlus className="inline mr-2" /> Add Product
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaBoxOpen className="text-3xl text-yellow-500" />,
              label: "Total Products",
              value: stats.products,
              border: "border-yellow-400",
              color: "text-yellow-500",
            },
            {
              icon: <FaDollarSign className="text-3xl text-green-500" />,
              label: "Total Earnings",
              value: `Rs. ${stats.earnings}`,
              border: "border-green-400",
              color: "text-green-500",
            },
            {
              icon: <FaUsers className="text-3xl text-blue-500" />,
              label: "Users",
              value: stats.users,
              border: "border-blue-400",
              color: "text-blue-500",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`bg-white shadow-xl rounded-xl p-6 text-center border-t-4 ${card.border} hover:shadow-2xl transition duration-300`}
            >
              {card.icon}
              <h2 className="text-lg font-semibold text-gray-700 mt-2">{card.label}</h2>
              <p className={`text-2xl font-bold ${card.color} mt-1`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-yellow-600 mb-4">🧾 Recent Orders</h3>
          <table className="w-full text-sm text-left border border-gray-200 rounded">
            <thead className="text-gray-600 bg-yellow-50">
              <tr>
                <th className="py-2 px-3">Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, i) => (
                <tr key={i} className="border-t hover:bg-yellow-50 transition">
                  <td className="py-2 px-3">#{order.id}</td>
                  <td>{order.customer}</td>
                  <td
                    className={`font-medium ${
                      order.status === "Delivered" || order.status === "Completed"
                        ? "text-green-600"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-yellow-600 mb-4">⚠️ Low Stock Products</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            {stats.lowStock.map((item, i) => (
              <li key={i} className="flex justify-between px-2 py-1 bg-yellow-50 rounded shadow-sm">
                <span>{item.name}</span>
                <span className="text-red-600 font-medium">Only {item.stock} left</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Line Chart */}
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-yellow-600 mb-4">📈 Sales Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#feb500" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="mt-10 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-yellow-600 mb-4">📊 Earnings by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#feb500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardLayout>
    );
  };

  export default DashboardHome;
