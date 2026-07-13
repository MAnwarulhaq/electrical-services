import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaCalendarCheck,
  FaEnvelope,
  FaTools,
  FaUsers,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHome,
  FaClipboardList,
  FaMapMarkerAlt,
  FaUserTie,
  FaSyncAlt,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [electricians, setElectricians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        bookingsResponse,
        servicesResponse,
        messagesResponse,
        electriciansResponse,
      ] = await Promise.allSettled([
        api.get("/bookings?limit=100"),
        api.get("/services/admin/all"),
        api.get("/contact"),
        api.get("/electricians"),
      ]);

      if (bookingsResponse.status === "fulfilled") {
        setBookings(bookingsResponse.value.data?.data || []);
      }

      if (servicesResponse.status === "fulfilled") {
        setServices(servicesResponse.value.data?.data || []);
      }

      if (messagesResponse.status === "fulfilled") {
        setMessages(messagesResponse.value.data?.data || []);
      }

      if (electriciansResponse.status === "fulfilled") {
        setElectricians(
          electriciansResponse.value.data?.data || []
        );
      }

      const failed = [
        bookingsResponse,
        servicesResponse,
        messagesResponse,
      ].every((result) => result.status === "rejected");

      if (failed) {
        setError("Unable to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(
    () => ({
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(
        (booking) => booking.status === "pending"
      ).length,
      activeServices: services.filter(
        (service) => service.isActive
      ).length,
      unreadMessages: messages.filter(
        (message) => !message.isRead
      ).length,
      electricians: electricians.length,
    }),
    [bookings, services, messages, electricians]
  );

  const recentBookings = bookings.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72
        bg-slate-950 text-white transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center">
                <FaBolt className="text-xl" />
              </div>

              <div>
                <h1 className="font-black text-lg">
                  Electrical
                </h1>
                <p className="text-xs text-slate-400">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SidebarItem
              icon={<FaHome />}
              label="Overview"
              active
            />

            <SidebarItem
              icon={<FaClipboardList />}
              label="Bookings"
              onClick={() =>
                navigate("/admin/bookings")
              }
            />

            <SidebarItem
              icon={<FaTools />}
              label="Services"
              onClick={() =>
                navigate("/admin/services")
              }
            />

            <SidebarItem
              icon={<FaUserTie />}
              label="Electricians"
              onClick={() =>
                navigate("/admin/electricians")
              }
            />

            <SidebarItem
              icon={<FaMapMarkerAlt />}
              label="Service Areas"
              onClick={() =>
                navigate("/admin/areas")
              }
            />

            <SidebarItem
              icon={<FaEnvelope />}
              label="Messages"
              badge={stats.unreadMessages}
              onClick={() =>
                navigate("/admin/messages")
              }
            />
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3
              rounded-xl text-red-400 hover:bg-red-500/10 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-xl"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                Dashboard Overview
              </h2>
              <p className="text-sm text-slate-500 hidden sm:block">
                Welcome back, {user?.name || "Admin"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
            bg-slate-100 hover:bg-slate-200 font-bold transition
            disabled:opacity-50"
          >
            <FaSyncAlt
              className={loading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div className="p-5 md:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* STATS */}
          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard
              title="Total Bookings"
              value={loading ? "..." : stats.totalBookings}
              icon={<FaCalendarCheck />}
              iconClass="bg-blue-100 text-blue-600"
            />

            <StatCard
              title="Pending Bookings"
              value={loading ? "..." : stats.pendingBookings}
              icon={<FaClipboardList />}
              iconClass="bg-orange-100 text-orange-600"
            />

            <StatCard
              title="Active Services"
              value={loading ? "..." : stats.activeServices}
              icon={<FaTools />}
              iconClass="bg-green-100 text-green-600"
            />

            <StatCard
              title="Unread Messages"
              value={loading ? "..." : stats.unreadMessages}
              icon={<FaEnvelope />}
              iconClass="bg-purple-100 text-purple-600"
            />
          </section>

          {/* SECONDARY INFO */}
          <section className="grid lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">
                    Recent Bookings
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Latest customer service requests
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate("/admin/bookings")
                  }
                  className="text-sm font-bold text-yellow-600"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-slate-500">
                    Loading bookings...
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    No bookings found.
                  </div>
                ) : (
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-sm text-slate-500">
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="border-t hover:bg-slate-50"
                        >
                          <td className="p-4 font-bold">
                            {booking.bookingId}
                          </td>

                          <td className="p-4">
                            <p className="font-semibold">
                              {booking.fullName}
                            </p>
                            <p className="text-sm text-slate-500">
                              {booking.mobileNumber}
                            </p>
                          </td>

                          <td className="p-4">
                            {booking.service?.name || "N/A"}
                          </td>

                          <td className="p-4">
                            {booking.preferredDate
                              ? new Date(
                                  booking.preferredDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td className="p-4">
                            <StatusBadge
                              status={booking.status}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* QUICK SUMMARY */}
            <div className="space-y-6">
              <div className="bg-slate-950 text-white rounded-2xl p-6">
                <h3 className="text-xl font-black">
                  Business Summary
                </h3>

                <div className="space-y-5 mt-7">
                  <SummaryRow
                    icon={<FaUsers />}
                    label="Electricians"
                    value={stats.electricians}
                  />

                  <SummaryRow
                    icon={<FaTools />}
                    label="Total Services"
                    value={services.length}
                  />

                  <SummaryRow
                    icon={<FaEnvelope />}
                    label="Total Messages"
                    value={messages.length}
                  />
                </div>
              </div>

              <div className="bg-yellow-400 rounded-2xl p-6">
                <FaBolt className="text-3xl" />

                <h3 className="text-xl font-black mt-4">
                  Pending Requests
                </h3>

                <p className="text-4xl font-black mt-3">
                  {stats.pendingBookings}
                </p>

                <button
                  onClick={() =>
                    navigate("/admin/bookings")
                  }
                  className="mt-5 bg-slate-950 text-white
                  px-5 py-3 rounded-xl font-bold w-full"
                >
                  Manage Bookings
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  active,
  badge,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
    transition text-left ${
      active
        ? "bg-yellow-400 text-slate-950 font-black"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="flex-1">{label}</span>

    {badge > 0 && (
      <span className="min-w-6 h-6 px-2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>

        <p className="text-3xl font-black text-slate-900 mt-3">
          {value}
        </p>
      </div>

      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const SummaryRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-slate-300">
      <span className="text-yellow-400">{icon}</span>
      <span>{label}</span>
    </div>

    <span className="font-black text-xl">{value}</span>
  </div>
);

const StatusBadge = ({ status = "pending" }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    "in-progress": "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

export default Dashboard;