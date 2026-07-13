import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaBolt,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaTools,
  FaCalendarAlt,
  FaExclamationCircle,
} from "react-icons/fa";

import { trackBooking } from "../services/bookingApi";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  "in-progress": "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const TrackBooking = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryBookingId = searchParams.get("bookingId") || "";

  const [bookingId, setBookingId] = useState(queryBookingId);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooking = async (id) => {
    const cleanId = id.trim();

    if (!cleanId) {
      setError("Please enter your Booking ID.");
      setBooking(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setBooking(null);

      const response = await trackBooking(cleanId);

      setBooking(response.data);

      setSearchParams({
        bookingId: cleanId,
      });
    } catch (err) {
      console.error("Track Booking Error:", err);

      setError(
        err.response?.data?.message ||
          "Booking not found. Please check your Booking ID."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryBookingId) {
      searchBooking(queryBookingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooking(bookingId);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-950 pt-40 pb-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest">
            <FaBolt />
            Booking Status
          </span>

          <h1 className="text-4xl md:text-6xl text-white font-black mt-5">
            Track Your Booking
          </h1>

          <p className="text-gray-400 text-lg mt-6">
            Enter your Booking ID to check the latest status
            of your electrical service request.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        {/* SEARCH FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-6 md:p-10"
        >
          <label className="font-black text-lg">
            Booking ID
          </label>

          <div className="flex flex-col sm:flex-row gap-4 mt-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={bookingId}
                onChange={(e) =>
                  setBookingId(e.target.value)
                }
                placeholder="Enter your Booking ID"
                className="w-full border border-gray-200 rounded-xl py-4 pl-14 pr-5 outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-slate-950 px-8 py-4 rounded-xl font-black hover:bg-yellow-300 disabled:opacity-50 transition"
            >
              {loading ? "Searching..." : "Track Booking"}
            </button>
          </div>
        </form>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8 flex items-start gap-4">
            <FaExclamationCircle className="text-red-500 text-2xl shrink-0" />

            <div>
              <h2 className="font-black text-red-700">
                Unable to Find Booking
              </h2>

              <p className="text-red-600 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* BOOKING RESULT */}
        {booking && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8">
            {/* HEADER */}
            <div className="bg-slate-950 p-7 md:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <p className="text-gray-400">
                    Booking ID
                  </p>

                  <h2 className="text-yellow-400 text-2xl md:text-3xl font-black mt-1">
                    {booking.bookingId}
                  </h2>
                </div>

                <span
                  className={`self-start sm:self-auto px-5 py-3 rounded-full font-black capitalize ${
                    statusStyles[booking.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status?.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div className="p-7 md:p-10">
              <h3 className="text-2xl font-black">
                Booking Details
              </h3>

              <div className="grid md:grid-cols-2 gap-5 mt-7">
                <DetailCard
                  icon={<FaUser />}
                  label="Customer"
                  value={booking.customerName}
                />

                <DetailCard
                  icon={<FaTools />}
                  label="Service"
                  value={booking.service}
                />

                <DetailCard
                  icon={<FaMapMarkerAlt />}
                  label="Service Area"
                  value={booking.area}
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  label="Preferred Date"
                  value={formatDate(
                    booking.preferredDate
                  )}
                />

                <DetailCard
                  icon={<FaClock />}
                  label="Preferred Time"
                  value={booking.preferredTime}
                />

                <DetailCard
                  icon={<FaBolt />}
                  label="Service Type"
                  value={booking.serviceType}
                />
              </div>

              {/* ELECTRICIAN */}
              {booking.assignedElectrician ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <FaCheckCircle className="text-green-500 text-3xl shrink-0" />

                    <div>
                      <p className="text-sm text-green-700">
                        Assigned Electrician
                      </p>

                      <h3 className="text-xl font-black mt-1">
                        {booking.assignedElectrician.name}
                      </h3>

                      <p className="text-gray-600 capitalize mt-1">
                        Status:{" "}
                        {booking.assignedElectrician.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">
                  <div className="flex items-start gap-4">
                    <FaClock className="text-yellow-600 text-2xl shrink-0" />

                    <div>
                      <h3 className="font-black">
                        Electrician Not Assigned Yet
                      </h3>

                      <p className="text-gray-600 mt-1">
                        Our team will assign an electrician to
                        your booking soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() =>
                    searchBooking(booking.bookingId)
                  }
                  disabled={loading}
                  className="flex-1 bg-yellow-400 py-4 rounded-xl font-black disabled:opacity-50"
                >
                  {loading
                    ? "Refreshing..."
                    : "Refresh Status"}
                </button>

                <Link
                  to="/services"
                  className="flex-1 text-center border-2 border-slate-950 py-4 rounded-xl font-black"
                >
                  View Services
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 rounded-2xl p-5">
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 bg-yellow-400 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-black capitalize mt-1">
          {value || "Not available"}
        </p>
      </div>
    </div>
  </div>
);

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default TrackBooking;