import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt, FaSignInAlt } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useUserAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please enter email and password.");
    }

    try {
      setLoading(true);

      await login(form);

      alert("Login Successful");

      // Redirect to previous page or booking
      const redirectTo =
        location.state?.from?.pathname || "/booking";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full">
            <FaBolt />
            ElectroFX
          </span>

          <h1 className="text-4xl font-black text-white mt-6">
            Welcome Back
          </h1>

          <p className="text-gray-400 mt-2">
            Login to continue booking electrical services.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition disabled:opacity-60"
          >
            <FaSignInAlt />

            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?

            <Link
              to="/register"
              className="text-yellow-400 font-bold ml-2 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-300 font-semibold mb-2">
      {label}
    </label>

    <input
      {...props}
      required
      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
    />
  </div>
);

export default Login;