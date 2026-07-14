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

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Actions
    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [updatingId, setUpdatingId] = useState("");
    const [deletingId, setDeletingId] = useState("");
    const [savingDetails, setSavingDetails] =
        useState(false);

    // Modal form
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

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookings();
        }, 400);

        return () => clearTimeout(timer);
    }, [fetchBookings]);

    useEffect(() => {
        fetchElectricians();
    }, [fetchElectricians]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    // =========================
    // OPEN BOOKING DETAILS
    // =========================
    const openBookingDetails = async (booking) => {
        try {
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

            if (
                selectedBooking?._id === bookingMongoId
            ) {
                setSelectedBooking(updatedBooking);
            }

            setSuccess("Booking status updated successfully.");
        } catch (err) {
            console.error("Update Status Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update booking status."
            );

            // Reload old value if update fails
            fetchBookings();
        } finally {
            setUpdatingId("");
        }
    };


    // =========================
    // SAVE ELECTRICIAN + NOTES
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

            // Automatically update status when
            // electrician is assigned
            if (
                selectedElectrician &&
                selectedBooking.status === "pending"
            ) {
                updateData.status =
                    "electrician-assigned";
            }

            const response = await api.put(
                `/bookings/${selectedBooking._id}`,
                updateData
            );

            const updatedBooking = response.data?.data;

            setSelectedBooking(updatedBooking);

            setSelectedElectrician(
                updatedBooking?.assignedElectrician?._id ||
                ""
            );

            setAdminNotes(
                updatedBooking?.adminNotes || ""
            );

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === updatedBooking._id
                        ? updatedBooking
                        : booking
                )
            );

            setSuccess(
                "Booking details updated successfully."
            );
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

            setBookings((previousBookings) =>
                previousBookings.filter(
                    (booking) => booking._id !== bookingId
                )
            );

            if (selectedBooking?._id === bookingId) {
                closeModal();
            }

            setSuccess("Booking deleted successfully.");

            fetchBookings();
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
        <div className="p-5 md:p-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">
                        Bookings Management
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Manage customer bookings, status and
                        electrician assignments.
                    </p>
                </div>

                <button
                    type="button"
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

            {/* ALERTS */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
                    {success}
                </div>
            )}

            {/* STATS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <MiniStat
                    title="Total Results"
                    value={total}
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
                <div className="grid md:grid-cols-[1fr_280px] gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search name, phone or booking ID..."
                            className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-yellow-400"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400 bg-white"
                    >
                        <option value="">
                            All Statuses
                        </option>

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
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center text-slate-500">
                        <FaSyncAlt className="animate-spin text-3xl mx-auto mb-4" />

                        Loading bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-16 text-center">
                        <FaCalendarCheck className="text-5xl text-slate-300 mx-auto" />

                        <h3 className="font-black text-xl mt-5">
                            No Bookings Found
                        </h3>

                        <p className="text-slate-500 mt-2">
                            No bookings match your filters.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px]">
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
                                        Area
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
                                        <td className="p-4">
                                            <p className="font-black">
                                                {booking.bookingId}
                                            </p>

                                            {booking.serviceType ===
                                                "emergency" && (
                                                    <span className="inline-block mt-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                                                        Emergency
                                                    </span>
                                                )}
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
                                            {booking.area?.name || "N/A"}
                                        </td>

                                        <td className="p-4">
                                            <p>
                                                {formatDate(
                                                    booking.preferredDate
                                                )}
                                            </p>

                                            <p className="text-sm text-slate-500 mt-1">
                                                {booking.preferredTime ||
                                                    ""}
                                            </p>
                                        </td>

                                        <td className="p-4">
                                            <select
                                                value={booking.status || "pending"}
                                                disabled={updatingId === booking._id}
                                                onChange={(e) =>
                                                    updateStatus(booking._id, e.target.value)
                                                }
                                                className="border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none focus:border-yellow-400 disabled:opacity-50"
                                            >
                                                {STATUS_OPTIONS.map((status) => (
                                                    <option key={status.value} value={status.value}>
                                                        {status.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openBookingDetails(
                                                            booking
                                                        )
                                                    }
                                                    title="View booking"
                                                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"
                                                >
                                                    <FaEye />
                                                </button>

                                                <button
                                                    type="button"
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

                {/* PAGINATION */}
                {!loading && total > 0 && (
                    <div className="border-t border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-500">
                            Page {page} of {pages} — {total} total
                            bookings
                        </p>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() =>
                                    setPage((previous) =>
                                        previous - 1
                                    )
                                }
                                className="px-4 py-2 border rounded-lg font-bold disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={page >= pages}
                                onClick={() =>
                                    setPage((previous) =>
                                        previous + 1
                                    )
                                }
                                className="px-4 py-2 bg-slate-950 text-white rounded-lg font-bold disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* DETAILS MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        {/* MODAL HEADER */}
                        <div className="sticky top-0 z-10 bg-white p-6 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black">
                                    Booking Details
                                </h2>

                                <p className="text-slate-500 mt-1">
                                    {selectedBooking.bookingId}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* CUSTOMER DETAILS */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            </div>

                            <div className="grid gap-4 mt-4">
                                <Detail
                                    label="Address"
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

                            {/* MANAGEMENT SECTION */}
                            <div className="border-t mt-8 pt-8">
                                <h3 className="text-xl font-black mb-5">
                                    Manage Booking
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* STATUS */}
                                    <div>
                                        <label className="block font-bold mb-2">
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
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400 bg-white"
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
                                        <label className="flex items-center gap-2 font-bold mb-2">
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
                                            disabled={
                                                electriciansLoading
                                            }
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400 bg-white"
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
                                                        {electrician
                                                            .availabilityStatus
                                                            ? ` - ${electrician.availabilityStatus}`
                                                            : ""}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* ADMIN NOTES */}
                                <div className="mt-6">
                                    <label className="block font-bold mb-2">
                                        Admin Notes
                                    </label>

                                    <textarea
                                        value={adminNotes}
                                        onChange={(event) =>
                                            setAdminNotes(
                                                event.target.value
                                            )
                                        }
                                        rows="5"
                                        placeholder="Add private notes about this booking..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 resize-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={saveBookingDetails}
                                    disabled={savingDetails}
                                    className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-400 text-slate-950 px-7 py-3.5 rounded-xl font-black hover:bg-yellow-300 disabled:opacity-50"
                                >
                                    <FaSave />

                                    {savingDetails
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// =========================
// SMALL COMPONENTS
// =========================

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