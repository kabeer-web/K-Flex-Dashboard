import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import PrivateRoute from "./auth/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import { auth } from "./firebase";
import ReviewDashboard from "./pages/ReviewDashboard";

const App = () => {
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
      <div className="h-screen flex items-center justify-center text-yellow-600 font-semibold text-xl animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <DashboardLayout>
              {user ? (
                <div className="text-center text-gray-600 py-12">
                  <p className="text-lg font-semibold text-yellow-600">Already Logged In</p>
                  <p>{user.email}</p>
                </div>
              ) : (
                <Login />
              )}
            </DashboardLayout>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
    

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
<Route path="/reviews" element={
            <PrivateRoute>
              <ReviewDashboard  /> 
            </PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
