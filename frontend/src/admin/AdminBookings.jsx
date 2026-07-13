import { useCallback, useEffect, useState } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaTrash,
  FaEye,
  FaTimes,
  FaCalendarCheck,
} from "react-icons/fa";

import api from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const response = await api.get("/bookings", {
        params,
      });

      setBookings(response.data?.data || []);
    } catch (err) {
      console.error("Bookings API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await api.put(
        `/bookings/${bookingId}`,
        {
          status: newStatus,
        }
      );

      const updatedBooking = response.data?.data;

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? updatedBooking
            : booking
        )
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(updatedBooking);
      }
    } catch (err) {
      console.error("Update Booking Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      setError("");

      await api.delete(`/bookings/${bookingId}`);

      setBookings((prev) =>
        prev.filter(
          (booking) => booking._id !== bookingId
        )
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Delete Booking Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete booking."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Bookings Management
          </h1>

          <p className="text-slate-500 mt-2">
            View and manage customer bookings.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-950 text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
        >
          <FaSyncAlt
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MiniStat
          title="Total"
          value={bookings.length}
        />

        <MiniStat
          title="Pending"
          value={
            bookings.filter(
              (booking) =>
                booking.status === "pending"
            ).length
          }
        />

        <MiniStat
          title="In Progress"
          value={
            bookings.filter(
              (booking) =>
                booking.status === "in-progress"
            ).length
          }
        />

        <MiniStat
          title="Completed"
          value={
            bookings.filter(
              (booking) =>
                booking.status === "completed"
            ).length
          }
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="grid md:grid-cols-[1fr_250px] gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, phone or booking ID..."
              className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">
              Confirmed
            </option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">
              In Progress
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* BOOKINGS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center">
            <FaCalendarCheck className="text-5xl text-slate-300 mx-auto" />

            <h3 className="font-black text-xl mt-5">
              No Bookings Found
            </h3>

            <p className="text-slate-500 mt-2">
              No bookings match your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="p-4">
                    Booking ID
                  </th>

                  <th className="p-4">
                    Customer
                  </th>

                  <th className="p-4">
                    Service
                  </th>

                  <th className="p-4">
                    Date
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-4 font-black">
                      {booking.bookingId}
                    </td>

                    <td className="p-4">
                      <p className="font-bold">
                        {booking.fullName}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {booking.mobileNumber}
                      </p>
                    </td>

                    <td className="p-4">
                      {booking.service?.name ||
                        "N/A"}
                    </td>

                    <td className="p-4">
                      {formatDate(
                        booking.preferredDate
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={
                          booking.status ||
                          "pending"
                        }
                        disabled={
                          updatingId === booking._id
                        }
                        onChange={(e) =>
                          updateStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2 outline-none disabled:opacity-50"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="assigned">
                          Assigned
                        </option>

                        <option value="in-progress">
                          In Progress
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          title="View booking"
                          className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() =>
                            deleteBooking(
                              booking._id
                            )
                          }
                          disabled={
                            deletingId ===
                            booking._id
                          }
                          title="Delete booking"
                          className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 disabled:opacity-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-2xl font-black">
                  Booking Details
                </h2>

                <p className="text-slate-500 mt-1">
                  {selectedBooking.bookingId}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <Detail
                label="Customer"
                value={selectedBooking.fullName}
              />

              <Detail
                label="Mobile"
                value={
                  selectedBooking.mobileNumber
                }
              />

              <Detail
                label="WhatsApp"
                value={
                  selectedBooking.whatsappNumber
                }
              />

              <Detail
                label="Email"
                value={
                  selectedBooking.email ||
                  "Not provided"
                }
              />

              <Detail
                label="Service"
                value={
                  selectedBooking.service?.name ||
                  "N/A"
                }
              />

              <Detail
                label="Area"
                value={
                  selectedBooking.area?.name ||
                  "N/A"
                }
              />

              <Detail
                label="Preferred Date"
                value={formatDate(
                  selectedBooking.preferredDate
                )}
              />

              <Detail
                label="Preferred Time"
                value={
                  selectedBooking.preferredTime
                }
              />

              <Detail
                label="Service Type"
                value={
                  selectedBooking.serviceType ||
                  "normal"
                }
              />

              <Detail
                label="Status"
                value={
                  selectedBooking.status ||
                  "pending"
                }
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Address"
                  value={selectedBooking.address}
                />
              </div>

              <div className="sm:col-span-2">
                <Detail
                  label="Problem Description"
                  value={
                    selectedBooking.problemDescription ||
                    "No description provided"
                  }
                />
              </div>

              {selectedBooking.assignedElectrician && (
                <div className="sm:col-span-2">
                  <Detail
                    label="Assigned Electrician"
                    value={
                      selectedBooking
                        .assignedElectrician
                        ?.name
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MiniStat = ({ title, value }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5">
    <p className="text-sm font-bold text-slate-500">
      {title}
    </p>

    <p className="text-3xl font-black mt-2">
      {value}
    </p>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-4">
    <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
      {label}
    </p>

    <p className="font-semibold mt-2 break-words">
      {value || "N/A"}
    </p>
  </div>
);

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString(
    "en-PK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default AdminBookings;