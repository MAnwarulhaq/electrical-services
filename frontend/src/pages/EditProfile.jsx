import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaUserEdit } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";
import { updateUserProfile } from "../services/userApi";


const EditProfile = () => {
  const navigate = useNavigate();

  const { user, setUser } = useUserAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await updateUserProfile(form);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(res.data.data)
      );

      setUser(res.data.data);

      alert("Profile updated successfully.");

      navigate("/profile");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 py-16 px-6">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8"
        >
          <FaArrowLeft />
          Back to Profile
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <div className="text-center mb-10">

            <FaUserEdit className="text-yellow-400 text-6xl mx-auto mb-4" />

            <h1 className="text-4xl font-black text-white">
              Edit Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Update your personal information.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <Input
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
            />

            <div>

              <label className="block text-gray-300 mb-2 font-semibold">
                Address
              </label>

              <textarea
                rows="4"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-yellow-400 outline-none"
              />

            </div>

            <div className="flex gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2"
              >
                <FaSave />

                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <Link
                to="/profile"
                className="flex-1 border border-slate-700 text-white rounded-xl flex items-center justify-center"
              >
                Cancel
              </Link>

            </div>

          </form>

        </div>
      </div>
    </section>
  );
};

const Input = ({
  label,
  type = "text",
  ...props
}) => (
  <div>
    <label className="block text-gray-300 font-semibold mb-2">
      {label}
    </label>

    <input
      type={type}
      {...props}
      required
      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-yellow-400 outline-none"
    />
  </div>
);

export default EditProfile;