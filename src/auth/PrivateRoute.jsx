import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // ✅ Import Navigate
import { auth } from "../firebase"; // ✅ Make sure path is correct

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-[#feb500] text-xl font-semibold animate-pulse">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute; // ✅ Export properly
