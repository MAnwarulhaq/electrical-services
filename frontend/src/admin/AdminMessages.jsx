
import { useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaSearch,
  FaTrash,
  FaEye,
  FaPhoneAlt,
  FaUser,
  FaCalendarAlt,
  FaTimes,
  FaInbox,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaPaperPlane,
} from "react-icons/fa";

import {
  getContactMessages,
  toggleMessageRead,
  deleteContactMessage,
} from "../services/contactApi";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ==============================
  // FETCH MESSAGES
  // ==============================
  const fetchMessages = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getContactMessages();
      

      setMessages(response.data.data || []);
    } catch (err) {
      console.error("Get Messages Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load contact messages."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ==============================
  // TOGGLE READ / UNREAD
  // ==============================
  const handleToggleRead = async (id) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await toggleMessageRead(id);
      const updatedMessage = response.data;

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id ? updatedMessage : message
        )
      );

      setSelectedMessage((prev) =>
        prev?._id === id ? updatedMessage : prev
      );
    } catch (err) {
      console.error("Toggle Message Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update message status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==============================
  // OPEN MESSAGE
  // ==============================
  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      await handleToggleRead(message._id);
    }
  };

  // ==============================
  // DELETE MESSAGE
  // ==============================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteContactMessage(id);

      setMessages((prev) =>
        prev.filter((message) => message._id !== id)
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Delete Message Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete message."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // SEND EMAIL
  // Opens user's default email app
  // ==============================
  const handleSendEmail = (message) => {
    if (!message.email) {
      setError("This customer did not provide an email address.");
      return;
    }

    const subject = encodeURIComponent(
      `Re: ${message.subject || "Your Message"}`
    );

    const body = encodeURIComponent(
      `Hello ${message.fullName},\n\n` +
        `Thank you for contacting us regarding "${message.subject}".\n\n` +
        `Write your reply here...\n\n` +
        `Best regards,\n` +
        `Electrical Services Team`
    );

    window.location.href = `mailto:${message.email}?subject=${subject}&body=${body}`;
  };

  // ==============================
  // FILTER + SEARCH
  // ==============================
  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "read" && message.isRead) ||
        (filter === "unread" && !message.isRead);

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        message.fullName
          ?.toLowerCase()
          .includes(searchValue) ||
        message.email
          ?.toLowerCase()
          .includes(searchValue) ||
        message.mobileNumber
          ?.toLowerCase()
          .includes(searchValue) ||
        message.subject
          ?.toLowerCase()
          .includes(searchValue) ||
        message.message
          ?.toLowerCase()
          .includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, search]);

  // ==============================
  // STATS
  // ==============================
  const totalMessages = messages.length;

  const unreadMessages = messages.filter(
    (message) => !message.isRead
  ).length;

  const readMessages = messages.filter(
    (message) => message.isRead
  ).length;

  // ==============================
  // DATE FORMAT
  // ==============================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />

        <p className="mt-5 text-slate-500 font-semibold">
          Loading messages...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-7">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="text-yellow-500 font-black uppercase tracking-widest text-sm">
              Customer Support
            </p>

            <h1 className="text-3xl md:text-4xl font-black text-white mt-2">
              Contact Messages
            </h1>

            <p className="text-slate-500 mt-2">
              View, manage and respond to customer messages.
            </p>
          </div>

          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-6 py-3.5 rounded-xl font-bold shadow-lg transition disabled:opacity-50"
          >
            <FaSyncAlt
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh Messages"}
          </button>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="shrink-0" />
              <p>{error}</p>
            </div>

            <button
              onClick={() => setError("")}
              className="shrink-0 hover:text-red-900"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            title="Total Messages"
            value={totalMessages}
            icon={<FaInbox />}
            className="bg-gradient-to-br from-blue-500 to-blue-700"
          />

          <StatCard
            title="Unread Messages"
            value={unreadMessages}
            icon={<FaEnvelope />}
            className="bg-gradient-to-br from-orange-400 to-red-500"
          />

          <StatCard
            title="Read Messages"
            value={readMessages}
            icon={<FaEnvelopeOpen />}
            className="bg-gradient-to-br from-emerald-400 to-green-600"
          />
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-slate-900 border border-slate-700 shadow-sm rounded-3xl p-5">
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, subject or message..."
                className="w-full border border-slate-200 rounded-xl py-4 pl-12 pr-5 outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 transition"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All ({totalMessages})
              </FilterButton>

              <FilterButton
                active={filter === "unread"}
                onClick={() => setFilter("unread")}
              >
                Unread ({unreadMessages})
              </FilterButton>

              <FilterButton
                active={filter === "read"}
                onClick={() => setFilter("read")}
              >
                Read ({readMessages})
              </FilterButton>
            </div>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="bg-slate-900 border border-slate-700 shadow-sm rounded-3xl overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="py-24 text-center px-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <FaInbox className="text-3xl text-slate-400" />
              </div>

              <h3 className="text-xl font-black text-slate-800 mt-5">
                No Messages Found
              </h3>

              <p className="text-slate-500 mt-2">
                No contact messages match your current search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredMessages.map((message) => (
                <div
                  key={message._id}
                  className={`p-5 md:p-6 transition hover:bg-slate-50 ${
                    !message.isRead
                      ? "bg-yellow-50/50 border-l-4 border-yellow-400"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        message.isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-yellow-400 text-slate-950"
                      }`}
                    >
                      <FaUser />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className={`text-lg text-white ${
                            message.isRead
                              ? "font-bold"
                              : "font-black"
                          }`}
                        >
                          {message.fullName}
                        </h3>

                        {!message.isRead && (
                          <span className="bg-red-100 text-red-600 text-xs font-black px-3 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-slate-700 mt-1 truncate">
                        {message.subject}
                      </p>

                      <p className="text-slate-500 mt-2 line-clamp-1">
                        {message.message}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400 mt-3">
                        {message.email && (
                          <span className="flex items-center gap-2">
                            <FaEnvelope />
                            {message.email}
                          </span>
                        )}

                        <span className="flex items-center gap-2">
                          <FaPhoneAlt />
                          {message.mobileNumber}
                        </span>

                        <span className="flex items-center gap-2">
                          <FaCalendarAlt />
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          handleOpenMessage(message)
                        }
                        className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition"
                        title="View message"
                      >
                        <FaEye />
                      </button>

                      {message.email && (
                        <button
                          onClick={() =>
                            handleSendEmail(message)
                          }
                          className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white flex items-center justify-center transition"
                          title="Reply by email"
                        >
                          <FaPaperPlane />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleToggleRead(message._id)
                        }
                        disabled={
                          updatingId === message._id
                        }
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition disabled:opacity-50 ${
                          message.isRead
                            ? "bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white"
                            : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                        }`}
                        title={
                          message.isRead
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                      >
                        {updatingId === message._id ? (
                          <FaSyncAlt className="animate-spin" />
                        ) : message.isRead ? (
                          <FaEnvelope />
                        ) : (
                          <FaCheckCircle />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(message._id)
                        }
                        disabled={
                          deletingId === message._id
                        }
                        className="w-11 h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                        title="Delete message"
                      >
                        {deletingId === message._id ? (
                          <FaSyncAlt className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= MESSAGE MODAL ================= */}
        {selectedMessage && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <div
              className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* MODAL HEADER */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-800 text-white p-6 md:p-8 rounded-t-3xl">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <span className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black">
                      <FaEnvelopeOpen />
                      MESSAGE DETAILS
                    </span>

                    <h2 className="text-2xl md:text-3xl font-black mt-4">
                      {selectedMessage.subject}
                    </h2>
                  </div>

                  <button
                    onClick={() =>
                      setSelectedMessage(null)
                    }
                    className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* MODAL BODY */}
              <div className="p-6 md:p-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  <DetailCard
                    icon={<FaUser />}
                    label="Customer Name"
                    value={selectedMessage.fullName}
                  />

                  <DetailCard
                    icon={<FaPhoneAlt />}
                    label="Mobile Number"
                    value={
                      selectedMessage.mobileNumber
                    }
                  />

                  <DetailCard
                    icon={<FaEnvelope />}
                    label="Email Address"
                    value={
                      selectedMessage.email ||
                      "Email not provided"
                    }
                  />

                  <DetailCard
                    icon={<FaCalendarAlt />}
                    label="Received On"
                    value={formatDate(
                      selectedMessage.createdAt
                    )}
                  />
                </div>

                {/* CUSTOMER MESSAGE */}
                <div className="mt-7">
                  <p className="text-sm font-black uppercase tracking-wider text-slate-400">
                    Customer Message
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-3">
                    <p className="text-slate-700 leading-8 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* MODAL ACTIONS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
                  <a
                    href={`tel:${selectedMessage.mobileNumber}`}
                    className="flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 px-5 rounded-xl transition"
                  >
                    <FaPhoneAlt />
                    Call Customer
                  </a>

                  {selectedMessage.email && (
                    <button
                      onClick={() =>
                        handleSendEmail(selectedMessage)
                      }
                      className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-5 rounded-xl transition"
                    >
                      <FaPaperPlane />
                      Reply by Email
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(
                        selectedMessage._id
                      )
                    }
                    disabled={
                      deletingId ===
                      selectedMessage._id
                    }
                    className="flex items-center justify-center gap-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black py-4 px-5 rounded-xl transition disabled:opacity-50"
                  >
                    {deletingId ===
                    selectedMessage._id ? (
                      <FaSyncAlt className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}

                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==============================
// STAT CARD
// ==============================
const StatCard = ({
  title,
  value,
  icon,
  className,
}) => {
  return (
    <div
      className={`${className} text-white rounded-3xl p-6 shadow-lg relative overflow-hidden`}
    >
      <div className="absolute -right-5 -bottom-5 text-8xl opacity-10">
        {icon}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>

        <p className="text-white/80 font-semibold mt-5">
          {title}
        </p>

        <h3 className="text-4xl font-black mt-1">
          {value}
        </h3>
      </div>
    </div>
  );
};

// ==============================
// FILTER BUTTON
// ==============================
const FilterButton = ({
  active,
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-xl font-bold transition ${
        active
          ? "bg-slate-950 text-white shadow-lg"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
};

// ==============================
// DETAIL CARD
// ==============================
const DetailCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 bg-yellow-400 text-slate-950 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
          {label}
        </p>

        <p className="font-black text-slate-800 mt-1 break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminMessages;

