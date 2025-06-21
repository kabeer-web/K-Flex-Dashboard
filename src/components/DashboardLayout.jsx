import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { auth } from "../firebase";

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 font-poppins">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Topbar */}
        <div className="flex justify-end items-center gap-4 mb-6">
          {/* User Card */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-2xl text-yellow-500" />
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">
                {user?.displayName || user?.email?.split("@")[0] || "User"}
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                {user?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="ml-3 text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-yellow-200/30 shadow-xl rounded-2xl p-6 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
