import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaKey,
} from "react-icons/fa";

import { changePassword } from "../services/userApi";

const ChangePassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = (field) => {
    setShow({
      ...show,
      [field]: !show[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.newPassword !== form.confirmPassword
    ) {
      return alert("Passwords do not match.");
    }

    if (form.newPassword.length < 6) {
      return alert(
        "Password must be at least 6 characters."
      );
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("Password changed successfully.");

      navigate("/profile");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8">

        <div className="text-center mb-8">
          <FaKey className="text-6xl text-yellow-400 mx-auto mb-4" />

          <h1 className="text-4xl font-black text-white">
            Change Password
          </h1>

          <p className="text-gray-400 mt-2">
            Keep your account secure by updating
            your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            show={show.current}
            toggle={() =>
              togglePassword("current")
            }
            onChange={handleChange}
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            show={show.new}
            toggle={() => togglePassword("new")}
            onChange={handleChange}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            show={show.confirm}
            toggle={() =>
              togglePassword("confirm")
            }
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl transition disabled:opacity-60"
          >
            {loading
              ? "Updating..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
}) => (
  <div>
    <label className="block text-gray-300 mb-2 font-semibold">
      {label}
    </label>

    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 pr-14 text-white focus:border-yellow-400 outline-none"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {show ? (
          <FaEyeSlash />
        ) : (
          <FaEye />
        )}
      </button>
    </div>
  </div>
);

export default ChangePassword;