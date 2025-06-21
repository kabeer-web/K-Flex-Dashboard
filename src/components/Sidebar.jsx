import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { auth } from "../firebase";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

const links = [
  { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
  { name: "Products", path: "/products", icon: <FaBox /> },
  { name: "Orders", path: "/orders", icon: <FaShoppingCart /> },
  { name: "Analytics", path: "/analytics", icon: <FaChartLine /> },
  { name: "Reviews", path: "/reviews", icon: <FaUsers /> } // ✅ Add this line
];


  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#feb500]/30 to-yellow-100/10 backdrop-blur-xl text-white shadow-2xl border-r border-white/20 rounded-tr-3xl rounded-br-3xl overflow-hidden transition-all duration-500 ease-in-out">
      <div className="text-center py-6 text-3xl font-extrabold text-[#feb500] tracking-wide border-b border-white/20 animate-pulse">
        K-Flex
      </div>

      <nav className="flex-1 mt-6 space-y-3 px-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium shadow-md ${
              location.pathname === link.path
                ? "bg-[#feb500]/90 text-black shadow-inner scale-[1.02]"
                : "hover:bg-[#feb500]/20 hover:text-[#feb500]"
            }`}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        ))}

        {user ? (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium shadow-md bg-red-500/90 text-white hover:bg-red-600"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        ) : (
          location.pathname !== "/login" && (
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium shadow-md hover:bg-[#feb500]/20 hover:text-[#feb500]"
            >
              <FaSignInAlt className="text-lg" />
              <span>Login</span>
            </Link>

            
          )
        )}
      </nav>

      <div className="p-4 text-xs text-gray-300 text-center border-t border-white/10">
        &copy; 2025 K-Flex
      </div>
    </div>
  );
};

export default Sidebar;
