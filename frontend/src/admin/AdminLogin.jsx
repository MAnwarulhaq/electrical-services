import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaBolt, FaEnvelope, FaLock } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    loading,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await login(
        formData.email,
        formData.password
      );

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto">
          <FaBolt className="text-3xl" />
        </div>

        <h1 className="text-3xl font-black text-center mt-6">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Electrical Services Management
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mt-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8">
          <label className="font-bold">
            Email Address
          </label>

          <div className="relative mt-2">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-yellow-400"
            />
          </div>

          <label className="block font-bold mt-6">
            Password
          </label>

          <div className="relative mt-2">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-400 py-4 rounded-xl font-black mt-8 disabled:opacity-50"
          >
            {submitting
              ? "Logging In..."
              : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;