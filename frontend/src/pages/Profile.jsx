import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEdit, FaKey, FaClipboardList } from "react-icons/fa";
import { useUserAuth } from "../context/UserAuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useUserAuth();

  if (!user) {
    return (
      <section className="min-h-screen bg-slate-950 flex items-center justify-center">
        <h1 className="text-2xl text-white font-bold">
          Please login first.
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">

          {/* Avatar */}
          <div className="flex flex-col items-center">

            <FaUserCircle className="text-yellow-400 text-8xl" />

            <h2 className="text-white text-3xl font-bold mt-4">
              {user.fullName}
            </h2>

            <p className="text-gray-400">
              Customer
            </p>

          </div>

          {/* User Information */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <FaEnvelope />
                <span>Email</span>
              </div>

              <p className="text-white">
                {user.email}
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <FaPhoneAlt />
                <span>Mobile</span>
              </div>

              <p className="text-white">
                {user.mobileNumber || "Not Added"}
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 md:col-span-2">
              <div className="flex items-center gap-3 text-yellow-400 mb-2">
                <FaMapMarkerAlt />
                <span>Address</span>
              </div>

              <p className="text-white">
                {user.address || "No address added"}
              </p>
            </div>

          </div>

          {/* Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mt-10">

            <Link
              to="/profile/edit"
              className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 rounded-xl transition"
            >
              <FaEdit />
              Edit Profile
            </Link>

            <Link
              to="/change-password"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition"
            >
              <FaKey />
              Change Password
            </Link>

            <Link
              to="/my-bookings"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition"
            >
              <FaClipboardList />
              My Bookings
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;