import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaMoneyBillWave,
} from "react-icons/fa";

import { getMyBookings } from "../services/userApi";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 flex justify-center items-center">
        <h1 className="text-2xl text-white">
          Loading Bookings...
        </h1>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="mb-10">

          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <FaClipboardList className="text-yellow-400" />
            My Bookings
          </h1>

          <p className="text-gray-400 mt-2">
            View all your service bookings.
          </p>

        </div>

        {/* Empty */}

        {bookings.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">

            <FaClipboardList className="text-7xl text-yellow-400 mx-auto mb-5" />

            <h2 className="text-3xl font-bold text-white">
              No Bookings Found
            </h2>

            <p className="text-gray-400 mt-3">
              You haven't booked any electrical service yet.
            </p>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">

            {bookings.map((booking) => (

              <div
                key={booking._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-yellow-400 transition"
              >

                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                  <h2 className="text-2xl text-white font-bold">
                    {booking.service?.name}
                  </h2>

                  <StatusBadge status={booking.status} />

                </div>

                <div className="space-y-4">

                  <Info
                    icon={<FaMapMarkerAlt />}
                    label="Area"
                    value={booking.area?.name}
                  />

                  <Info
                    icon={<FaCalendarAlt />}
                    label="Date"
                    value={booking.bookingDate?.slice(0, 10)}
                  />

                  <Info
                    icon={<FaClock />}
                    label="Time"
                    value={booking.preferredTime}
                  />

                  <Info
                    icon={<FaMoneyBillWave />}
                    label="Amount"
                    value={`Rs. ${booking.totalAmount}`}
                  />

                  <Info
                    icon={<FaUserTie />}
                    label="Electrician"
                    value={
                      booking.assignedElectrician?.name ||
                      "Not Assigned"
                    }
                  />

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex justify-between items-center bg-slate-950 rounded-xl p-4">

    <div className="flex items-center gap-3 text-yellow-400">

      {icon}

      <span>{label}</span>

    </div>

    <span className="text-white font-semibold">
      {value || "-"}
    </span>

  </div>
);

const StatusBadge = ({ status }) => {

  const colors = {
    Pending:
      "bg-yellow-500/20 text-yellow-400",

    Confirmed:
      "bg-blue-500/20 text-blue-400",

    Completed:
      "bg-green-500/20 text-green-400",

    Cancelled:
      "bg-red-500/20 text-red-400",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-bold ${
        colors[status] ||
        "bg-gray-700 text-white"
      }`}
    >
      {status}
    </span>
  );
};

export default MyBookings;