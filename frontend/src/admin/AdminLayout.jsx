import { useState } from "react";
import {
  FaBolt,
  FaBars,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaTools,
  FaUserTie,
  FaMapMarkerAlt,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: <FaClipboardList />,
    },
    {
      name: "Services",
      path: "/admin/services",
      icon: <FaTools />,
    },
    {
      name: "Electricians",
      path: "/admin/electricians",
      icon: <FaUserTie />,
    },
    {
      name: "Service Areas",
      path: "/admin/areas",
      icon: <FaMapMarkerAlt />,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-72 h-screen
          bg-slate-950 text-white
          transform transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <NavLink
              to="/admin/dashboard"
              onClick={closeSidebar}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 bg-yellow-400 text-slate-950 rounded-xl flex items-center justify-center">
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
            </NavLink>

            <button
              type="button"
              onClick={closeSidebar}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3
                    px-4 py-3.5 rounded-xl
                    transition font-semibold
                    ${
                      isActive
                        ? "bg-yellow-400 text-slate-950"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `
                }
              >
                <span className="text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* USER */}
          <div className="p-4 border-t border-slate-800">
            <div className="px-4 py-3 mb-2">
              <p className="font-bold">
                {user?.name || "Admin"}
              </p>

              <p className="text-xs text-slate-400 mt-1 truncate">
                {user?.email || "Administrator"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
            >
              <FaSignOutAlt />

              <span className="font-semibold">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200 px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"
            >
              <FaBars />
            </button>

            <div>
              <h2 className="font-black text-xl text-slate-900">
                Admin Panel
              </h2>

              <p className="text-sm text-slate-500 hidden sm:block">
                Manage your electrical services business
              </p>
            </div>
          </div>

          <div className="w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center font-black text-slate-950">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "A"}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;