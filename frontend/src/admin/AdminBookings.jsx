
import { useCallback, useEffect, useState } from "react";

import {
  FaSearch,
  FaSyncAlt,
  FaTrash,
  FaEye,
  FaTimes,
  FaCalendarCheck,
  FaSave,
  FaUserTie,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBolt,
} from "react-icons/fa";

import api from "../services/api";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  {
    value: "electrician-assigned",
    label: "Electrician Assigned",
  },
  { value: "on-the-way", label: "On The Way" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [electricians, setElectricians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [electriciansLoading, setElectriciansLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [savingDetails, setSavingDetails] =
    useState(false);
  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [selectedElectrician, setSelectedElectrician] =
    useState("");

  const [adminNotes, setAdminNotes] = useState("");

  const limit = 10;

  // =========================
  // FETCH BOOKINGS
  // =========================
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get("/bookings", {
        params,
      });

      setBookings(response.data?.data || []);
      setTotal(response.data?.total || 0);
      setPages(response.data?.pages || 1);
    } catch (err) {
      console.error("Bookings API Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  // =========================
  // FETCH ELECTRICIANS
  // =========================
  const fetchElectricians = useCallback(async () => {
    try {
      setElectriciansLoading(true);

      const response = await api.get("/electricians");

      setElectricians(response.data?.data || []);
    } catch (err) {
      console.error("Electricians API Error:", err);
    } finally {
      setElectriciansLoading(false);
    }
  }, []);

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchBookings]);

  useEffect(() => {
    fetchElectricians();
  }, [fetchElectricians]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // =========================
  // OPEN BOOKING DETAILS
  // =========================
  const openBookingDetails = async (booking) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/bookings/${booking._id}`
      );

      const fullBooking = response.data?.data;

      setSelectedBooking(fullBooking);

      setSelectedElectrician(
        fullBooking?.assignedElectrician?._id || ""
      );

      setAdminNotes(fullBooking?.adminNotes || "");
    } catch (err) {
      console.error("Booking Details Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load booking details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (
    bookingMongoId,
    newStatus
  ) => {
    try {
      setUpdatingId(bookingMongoId);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/bookings/${bookingMongoId}`,
        {
          status: newStatus,
        }
      );

      const updatedBooking = response.data?.data;

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingMongoId
            ? updatedBooking
            : booking
        )
      );

      if (selectedBooking?._id === bookingMongoId) {
        setSelectedBooking(updatedBooking);

        setSelectedElectrician(
          updatedBooking?.assignedElectrician?._id || ""
        );

        setAdminNotes(
          updatedBooking?.adminNotes || ""
        );
      }

      setSuccess(
        "Booking status updated successfully."
      );
    } catch (err) {
      console.error("Update Status Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update booking status."
      );

      fetchBookings();
    } finally {
      setUpdatingId("");
    }
  };

  // =========================
  // SAVE BOOKING DETAILS
  // =========================
  const saveBookingDetails = async () => {
    if (!selectedBooking) return;

    try {
      setSavingDetails(true);
      setError("");
      setSuccess("");

      const updateData = {
        assignedElectrician:
          selectedElectrician || null,
        adminNotes,
      };

      if (
        selectedElectrician &&
        selectedBooking.status === "pending"
      ) {
        updateData.status = "electrician-assigned";
      }

      const response = await api.put(
        `/bookings/${selectedBooking._id}`,
        updateData
      );

      const updatedBooking = response.data?.data;

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === updatedBooking._id
            ? updatedBooking
            : booking
        )
      );

      closeModal();

      setSuccess(
        "Booking details updated successfully."
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "Save Booking Details Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update booking details."
      );
    } finally {
      setSavingDetails(false);
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================
  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      setError("");
      setSuccess("");

      await api.delete(`/bookings/${bookingId}`);

      if (selectedBooking?._id === bookingId) {
        closeModal();
      }

      setSuccess(
        "Booking deleted successfully."
      );

      await fetchBookings();
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

  const closeModal = () => {
    setSelectedBooking(null);
    setSelectedElectrician("");
    setAdminNotes("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="relative overflow-hidden bg-slate-950 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold mb-4">
                <FaBolt />
                Admin Management
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white">
                Bookings Management
              </h1>

              <p className="text-slate-400 mt-2 max-w-2xl">
                View customer requests, manage booking
                statuses and assign electricians.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-yellow-400 text-slate-950 px-6 py-3.5 rounded-xl font-black hover:bg-yellow-300 transition disabled:opacity-50"
            >
              <FaSyncAlt
                className={
                  loading ? "animate-spin" : ""
                }
              />
              Refresh Bookings
            </button>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        {/* STATS */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Results"
            value={total}
            icon={<FaClipboardList />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Pending"
            value={
              bookings.filter(
                (booking) =>
                  booking.status === "pending"
              ).length
            }
            icon={<FaClock />}
            iconClass="bg-amber-100 text-amber-600"
          />

          <StatCard
            title="In Progress"
            value={
              bookings.filter(
                (booking) =>
                  booking.status === "in-progress"
              ).length
            }
            icon={<FaBolt />}
            iconClass="bg-purple-100 text-purple-600"
          />

          <StatCard
            title="Completed"
            value={
              bookings.filter(
                (booking) =>
                  booking.status === "completed"
              ).length
            }
            icon={<FaCheckCircle />}
            iconClass="bg-green-100 text-green-600"
          />
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Find Bookings
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search customers or filter bookings by
                status.
              </p>
            </div>

            {(search || statusFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
                className="text-sm font-bold text-red-500 hover:text-red-600"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, phone or booking ID..."
                className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none transition focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="border border-slate-200 rounded-xl px-4 py-3.5 outline-none bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10"
            >
              <option value="">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200">
            <h2 className="font-black text-xl text-slate-900">
              All Bookings
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {total} booking{total !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <FaSyncAlt className="animate-spin text-4xl text-yellow-500 mx-auto mb-4" />

              <p className="font-bold text-slate-700">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <FaCalendarCheck className="text-4xl text-slate-400" />
              </div>

              <h3 className="font-black text-xl mt-5">
                No Bookings Found
              </h3>

              <p className="text-slate-500 mt-2">
                No bookings match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-5">Booking</th>
                    <th className="p-5">Customer</th>
                    <th className="p-5">Service</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Schedule</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-slate-100 hover:bg-slate-50/70 transition"
                    >
                      <td className="p-5">
                        <p className="font-black text-slate-900">
                          {booking.bookingId}
                        </p>

                        {booking.serviceType ===
                          "emergency" && (
                          <span className="inline-flex items-center gap-1.5 mt-2 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                            <FaExclamationTriangle />
                            Emergency
                          </span>
                        )}
                      </td>

                      <td className="p-5">
                        <p className="font-bold text-slate-900">
                          {booking.fullName}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {booking.mobileNumber}
                        </p>
                      </td>

                      <td className="p-5">
                        <p className="font-semibold text-slate-700">
                          {booking.service?.name || "N/A"}
                        </p>
                      </td>

                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-700">
                          <FaMapMarkerAlt className="text-slate-400" />
                          {booking.area?.name || "N/A"}
                        </div>
                      </td>

                      <td className="p-5">
                        <p className="font-semibold">
                          {formatDate(
                            booking.preferredDate
                          )}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          {booking.preferredTime || "N/A"}
                        </p>
                      </td>

                      <td className="p-5">
                        <div className="space-y-2">
                          <StatusBadge
                            status={booking.status}
                          />

                          <select
                            value={
                              booking.status || "pending"
                            }
                            disabled={
                              updatingId === booking._id
                            }
                            onChange={(event) =>
                              updateStatus(
                                booking._id,
                                event.target.value
                              )
                            }
                            className="block w-full max-w-[200px] border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-yellow-400 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map(
                              (status) => (
                                <option
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openBookingDetails(booking)
                            }
                            disabled={detailsLoading}
                            title="View booking"
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
                          >
                            <FaEye />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteBooking(booking._id)
                            }
                            disabled={
                              deletingId === booking._id
                            }
                            title="Delete booking"
                            className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                          >
                            {deletingId === booking._id ? (
                              <FaSyncAlt className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && total > 0 && (
            <div className="border-t border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Showing page{" "}
                <span className="font-bold text-slate-900">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {pages}
                </span>{" "}
                — {total} total bookings
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((previous) => previous - 1)
                  }
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() =>
                    setPage((previous) => previous + 1)
                  }
                  className="px-5 py-2.5 bg-slate-950 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
          onClick={closeModal}
        >
          <div
            className="bg-slate-50 rounded-3xl w-full max-w-6xl max-h-[94vh] overflow-y-auto shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-20 bg-slate-950 px-6 md:px-8 py-6 flex items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    Booking Details
                  </h2>

                  <StatusBadge
                    status={selectedBooking.status}
                  />
                </div>

                <p className="text-slate-400 mt-2">
                  Booking ID:{" "}
                  <span className="text-yellow-400 font-bold">
                    {selectedBooking.bookingId}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="shrink-0 w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-5 md:p-8">
              <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6">
                {/* LEFT SIDE */}
                <div className="space-y-6">
                  {/* CUSTOMER */}
                  <SectionCard
                    title="Customer Information"
                    icon={<FaUserTie />}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Detail
                        icon={<FaUserTie />}
                        label="Customer Name"
                        value={selectedBooking.fullName}
                      />

                      <Detail
                        icon={<FaPhoneAlt />}
                        label="Mobile Number"
                        value={
                          selectedBooking.mobileNumber
                        }
                      />

                      <Detail
                        icon={<FaPhoneAlt />}
                        label="WhatsApp"
                        value={
                          selectedBooking.whatsappNumber
                        }
                      />

                      <Detail
                        icon={<FaEnvelope />}
                        label="Email Address"
                        value={
                          selectedBooking.email ||
                          "Not provided"
                        }
                      />
                    </div>
                  </SectionCard>

                  {/* SERVICE */}
                  <SectionCard
                    title="Service Information"
                    icon={<FaBolt />}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Detail
                        label="Service"
                        value={
                          selectedBooking.service?.name ||
                          "N/A"
                        }
                      />

                      <Detail
                        label="Service Type"
                        value={
                          selectedBooking.serviceType ||
                          "Normal"
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
                        label="Current Status"
                        value={getStatusLabel(
                          selectedBooking.status
                        )}
                      />
                    </div>

                    <div className="mt-4 space-y-4">
                      <Detail
                        label="Full Address"
                        value={selectedBooking.address}
                      />

                      <Detail
                        label="Problem Description"
                        value={
                          selectedBooking.problemDescription ||
                          "No description provided"
                        }
                      />
                    </div>
                  </SectionCard>
                </div>

                {/* RIGHT MANAGEMENT PANEL */}
                <div>
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden xl:sticky xl:top-28">
                    <div className="bg-yellow-400 p-5">
                      <h3 className="text-xl font-black text-slate-950">
                        Manage Booking
                      </h3>

                      <p className="text-sm text-slate-800 mt-1">
                        Update status, assign an electrician
                        and save notes.
                      </p>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* STATUS */}
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">
                          Booking Status
                        </label>

                        <select
                          value={
                            selectedBooking.status ||
                            "pending"
                          }
                          onChange={(event) =>
                            updateStatus(
                              selectedBooking._id,
                              event.target.value
                            )
                          }
                          disabled={
                            updatingId ===
                            selectedBooking._id
                          }
                          className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* ELECTRICIAN */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 mb-2">
                          <FaUserTie />
                          Assign Electrician
                        </label>

                        <select
                          value={selectedElectrician}
                          onChange={(event) =>
                            setSelectedElectrician(
                              event.target.value
                            )
                          }
                          disabled={electriciansLoading}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:opacity-50"
                        >
                          <option value="">
                            No Electrician Assigned
                          </option>

                          {electricians.map(
                            (electrician) => (
                              <option
                                key={electrician._id}
                                value={electrician._id}
                              >
                                {electrician.name}
                                {electrician.availabilityStatus
                                  ? ` - ${electrician.availabilityStatus}`
                                  : ""}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* NOTES */}
                      <div>
                        <label className="block text-sm font-black text-slate-700 mb-2">
                          Admin Notes
                        </label>

                        <textarea
                          value={adminNotes}
                          onChange={(event) =>
                            setAdminNotes(
                              event.target.value
                            )
                          }
                          rows="6"
                          placeholder="Add private notes about this booking..."
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 resize-none"
                        />
                      </div>

                      {/* SAVE */}
                      <button
                        type="button"
                        onClick={saveBookingDetails}
                        disabled={savingDetails}
                        className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-4 rounded-xl font-black hover:bg-slate-800 transition disabled:opacity-50"
                      >
                        {savingDetails ? (
                          <>
                            <FaSyncAlt className="animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <FaSave />
                            Save Changes
                          </>
                        )}
                      </button>

                      <p className="text-xs text-center text-slate-400">
                        After saving, the booking window will
                        close automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// COMPONENTS
// =========================

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-500">
          {title}
        </p>

        <p className="text-3xl font-black text-slate-900 mt-2">
          {value}
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const SectionCard = ({
  title,
  icon,
  children,
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="border-b border-slate-100 p-5 flex items-center gap-3">
      <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-lg font-black text-slate-900">
        {title}
      </h3>
    </div>

    <div className="p-5">{children}</div>
  </div>
);

const Detail = ({
  label,
  value,
  icon,
}) => (
  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
    <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-slate-500">
      {icon && (
        <span className="text-slate-400">{icon}</span>
      )}
      {label}
    </div>

    <p className="font-semibold text-slate-800 mt-2 break-words whitespace-pre-wrap">
      {value || "N/A"}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending:
      "bg-amber-100 text-amber-700 border-amber-200",
    confirmed:
      "bg-blue-100 text-blue-700 border-blue-200",
    "electrician-assigned":
      "bg-purple-100 text-purple-700 border-purple-200",
    "on-the-way":
      "bg-cyan-100 text-cyan-700 border-cyan-200",
    "in-progress":
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    completed:
      "bg-green-100 text-green-700 border-green-200",
    cancelled:
      "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-black ${
        styles[status] ||
        "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

const Alert = ({
  type,
  message,
  onClose,
}) => {
  const isSuccess = type === "success";

  return (
    <div
      className={`mb-6 border rounded-xl p-4 flex items-center justify-between gap-4 ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-600"
      }`}
    >
      <div className="flex items-center gap-3 font-semibold">
        {isSuccess ? (
          <FaCheckCircle />
        ) : (
          <FaExclamationTriangle />
        )}

        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0"
      >
        <FaTimes />
      </button>
    </div>
  );
};

const getStatusLabel = (status) => {
  return (
    STATUS_OPTIONS.find(
      (option) => option.value === status
    )?.label || status || "Pending"
  );
};

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

