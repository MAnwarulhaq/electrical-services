import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import TrackBooking from "./pages/TrackBooking";
import NotFound from "./pages/NotFound";
import AdminBookings from "./admin/AdminBookings";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminServices from "./admin/AdminServices";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track-booking" element={<TrackBooking />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/bookings"
        element={<AdminBookings />}
      />
      <Route
        path="/admin/services"
        element={<AdminServices />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;