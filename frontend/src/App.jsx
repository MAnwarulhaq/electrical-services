import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import TrackBooking from "./pages/TrackBooking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import AdminBookings from "./admin/AdminBookings";
import AdminServices from "./admin/AdminServices";
import AdminElectricians from "./admin/AdminElectricians";
import AdminServiceAreas from "./admin/AdminServiceAreas";
import AdminMessages from "./admin/AdminMessages";
import AdminSettings from "./admin/AdminSettings";

// Protected Routes
import ProtectedRoute from "./components/ProtectedRoute"; // Admin
import UserProtectedRoute from "./components/UserProtectedRoute"; // User

function App() {
  return (
    <Routes>

      {/* ========================= */}
      {/* Website Routes */}
      {/* ========================= */}
      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/services" element={<Services />} />

        <Route path="/services/:slug" element={<ServiceDetails />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/track-booking" element={<TrackBooking />} />

        {/* User Auth */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}

        <Route
          path="/booking"
          element={
            <UserProtectedRoute>
              <Booking />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={<EditProfile />}
        />
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/my-bookings"
          element={
            <UserProtectedRoute>
              <MyBookings />
            </UserProtectedRoute>
          }
        />

      </Route>

      {/* ========================= */}
      {/* Admin Routes */}
      {/* ========================= */}

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <AdminBookings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/services"
        element={
          <ProtectedRoute>
            <AdminServices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/electricians"
        element={
          <ProtectedRoute>
            <AdminElectricians />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/service-areas"
        element={
          <ProtectedRoute>
            <AdminServiceAreas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;