import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBolt, FaUserPlus } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useUserAuth();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (
      !form.fullName ||
      !form.email ||
      !form.mobileNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      return alert("Please fill all fields.");
    }


    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }


    try {
      setSaving(true);


      await register({
        fullName: form.fullName,
        email: form.email,
        mobileNumber: form.mobileNumber,
        password: form.password,
      });


      alert("Registration Successful");

      navigate("/booking");


    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setSaving(false);

    }
  };


  return (
    <section className="min-h-screen bg-slate-950 flex items-center justify-center py-20 px-6">


      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-slate-900 rounded-3xl p-8 border border-slate-800"
      >


        <div className="text-center mb-10">


          <span className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full">

            <FaBolt />

            ElectroFX

          </span>


          <h1 className="text-4xl font-black text-white mt-6">
            Create Account
          </h1>


          <p className="text-gray-400 mt-2">
            Register to book electrical services.
          </p>


        </div>



        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >


          <Input
            label="Full Name"
            name="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />


          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />


          <Input
            label="Mobile Number"
            name="mobileNumber"
            autoComplete="tel"
            value={form.mobileNumber}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />



          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create password"
          />



          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />



          <button
            type="submit"
            disabled={saving}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition disabled:opacity-50"
          >

            <FaUserPlus />

            {
              saving
              ? "Creating..."
              : "Create Account"
            }

          </button>


        </form>



        <p className="text-center text-gray-400 mt-8">

          Already have an account?


          <Link
            to="/login"
            className="text-yellow-400 font-bold ml-2 hover:underline"
          >

            Login

          </Link>


        </p>


      </motion.div>


    </section>
  );
};




const Input = ({ label, ...props }) => (

  <div>

    <label className="block text-gray-300 mb-2">
      {label}
    </label>


    <input
      {...props}
      required
      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none transition"
    />


  </div>

);


export default Register;