import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaBolt,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { getServices } from "../services/serviceApi";
import { getServiceAreas } from "../services/serviceAreaApi";
import { createBooking } from "../services/bookingApi";

const initialForm = {
  fullName: "",
  mobileNumber: "",
  whatsappNumber: "",
  email: "",
  address: "",
  area: "",
  service: "",
  preferredDate: "",
  preferredTime: "",
  problemDescription: "",
  serviceType: "normal",
};

const Booking = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");

  const [formData, setFormData] = useState({
    ...initialForm,
    service: serviceId || "",
  });

  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);
        setError("");

        const [servicesResponse, areasResponse] =
          await Promise.all([
            getServices(),
            getServiceAreas(),
          ]);

        setServices(servicesResponse.data || []);
        setAreas(areasResponse.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load booking information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, []);

  useEffect(() => {
    if (serviceId) {
      setFormData((prev) => ({
        ...prev,
        service: serviceId,
      }));
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await createBooking(formData);

      setBooking(response.data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Booking Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (booking) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          <FaCheckCircle className="text-green-500 text-7xl mx-auto" />

          <h1 className="text-3xl md:text-4xl font-black mt-6">
            Booking Successful!
          </h1>

          <p className="text-gray-500 mt-4">
            Your electrical service request has been received.
          </p>

          <div className="bg-slate-950 rounded-2xl p-6 mt-8">
            <p className="text-gray-400">
              Your Booking ID
            </p>

            <p className="text-yellow-400 text-3xl font-black mt-2">
              {booking.bookingId}
            </p>
          </div>

          <p className="text-gray-500 text-sm mt-5">
            Save your Booking ID. You will need it to track
            your booking status.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <Link
              to={`/track-booking?bookingId=${booking.bookingId}`}
              className="bg-yellow-400 py-4 rounded-xl font-black"
            >
              Track Booking
            </Link>

            <button
              onClick={() => {
                setBooking(null);
                setFormData({
                  ...initialForm,
                  service: serviceId || "",
                });
              }}
              className="border-2 border-slate-950 py-4 rounded-xl font-bold"
            >
              New Booking
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 pt-40 pb-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest">
            <FaBolt />
            Online Booking
          </span>

          <h1 className="text-4xl md:text-6xl text-white font-black mt-5">
            Book an Electrician
          </h1>

          <p className="text-gray-400 text-lg mt-6">
            Fill in your details and our team will contact
            you to confirm your booking.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8">
              {error}
            </div>
          )}

          {/* CUSTOMER */}
          <h2 className="text-2xl font-black mb-7">
            Customer Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              placeholder="03XX XXXXXXX"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />

            <Input
              label="WhatsApp Number"
              name="whatsappNumber"
              type="tel"
              placeholder="03XX XXXXXXX"
              value={formData.whatsappNumber}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Optional"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* SERVICE */}
          <h2 className="text-2xl font-black mt-12 mb-7">
            Service Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Select Service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">
                {loading
                  ? "Loading services..."
                  : "Select Service"}
              </option>

              {services.map((service) => (
                <option
                  key={service._id}
                  value={service._id}
                >
                  {service.name} - Rs.{" "}
                  {Number(
                    service.startingPrice || 0
                  ).toLocaleString()}
                </option>
              ))}
            </Select>

            <Select
              label="Service Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">
                {loading
                  ? "Loading areas..."
                  : "Select Area"}
              </option>

              {areas.map((area) => (
                <option
                  key={area._id}
                  value={area._id}
                >
                  {area.name}
                </option>
              ))}
            </Select>

            <Input
              label="Preferred Date"
              name="preferredDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Preferred Time"
              name="preferredTime"
              type="time"
              value={formData.preferredTime}
              onChange={handleChange}
              required
            />

            <Select
              label="Service Type"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
            >
              <option value="normal">
                Normal Service
              </option>

              <option value="emergency">
                Emergency Service
              </option>
            </Select>
          </div>

          {/* ADDRESS */}
          <div className="mt-7">
            <label className="flex items-center gap-2 font-bold">
              <FaMapMarkerAlt className="text-yellow-500" />
              Complete Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="House number, street, landmark..."
              className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          {/* PROBLEM */}
          <div className="mt-7">
            <label className="font-bold">
              Problem Description
            </label>

            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your electrical problem..."
              className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full bg-yellow-400 text-slate-950 font-black text-lg py-5 rounded-xl mt-8 hover:bg-yellow-300 disabled:opacity-50 transition"
          >
            {submitting
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>
        </form>
      </section>
    </main>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="font-bold">{label}</label>

    <input
      {...props}
      className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="font-bold">{label}</label>

    <select
      {...props}
      className="w-full mt-2 border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 bg-white"
    >
      {children}
    </select>
  </div>
);

export default Booking;