import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((u) => {
    setUser(u);
    if (u) {
      navigate("/"); // 👈 Redirect if already logged in
    }
  });
  return () => unsubscribe();
}, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-yellow-100 font-poppins">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm transition-all duration-300">
        <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">
          {user ? "You're Logged In" : "Admin Login"}
        </h2>

        {user ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-700">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600 transition"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              className="border border-yellow-300 focus:ring-2 focus:ring-yellow-500 p-2 rounded w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-yellow-300 focus:ring-2 focus:ring-yellow-500 p-2 rounded w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white w-full py-2 rounded hover:bg-yellow-600 transition"
            >
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
