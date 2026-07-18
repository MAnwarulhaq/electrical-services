import {
  FaUser,
  FaEdit,
  FaTrash,
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaBriefcase,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaUserSlash,
} from "react-icons/fa";

const ElectricianCard = ({
  electrician,
  updatingId,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const busy = updatingId === electrician._id;

  // =========================
  // IMAGE URL
  // =========================
  const getImageUrl = () => {
    const image =
      electrician.image?.url ||
      electrician.profileImage?.url ||
      electrician.imageUrl ||
      electrician.profileImage ||
      electrician.image ||
      "";

    if (!image || typeof image !== "string") {
      return "";
    }

    // Already full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Backend base URL
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");
    const cleanPath = image.replace(/^\/+/, "");

    return `${backendUrl}/${cleanPath}`;
  };

  const electricianImage = getImageUrl();

  // =========================
  // STATUS
  // =========================
  const status =
    electrician.availabilityStatus ||
    electrician.status ||
    (electrician.isAvailable
      ? "available"
      : "off-duty");

  const getStatusStyle = () => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          className: "bg-green-100 text-green-700",
          icon: <FaCheckCircle />,
        };

      case "busy":
        return {
          label: "Busy",
          className: "bg-orange-100 text-orange-700",
          icon: <FaClock />,
        };

      default:
        return {
          label: "Off Duty",
          className: "bg-red-100 text-red-700",
          icon: <FaUserSlash />,
        };
    }
  };

  const statusStyle = getStatusStyle();

  // =========================
  // SERVICE AREAS
  // =========================
  const serviceAreas =
    electrician.serviceAreas ||
    electrician.serviceArea ||
    [];

  const normalizedServiceAreas = Array.isArray(serviceAreas)
    ? serviceAreas
    : [serviceAreas].filter(Boolean);

  // =========================
  // PHONE
  // =========================
  const phone =
    electrician.phone ||
    electrician.mobile ||
    "";

  // =========================
  // WHATSAPP
  // =========================
  const whatsapp =
    electrician.whatsapp ||
    electrician.whatsappNumber ||
    "";

  const whatsappLink = whatsapp
    ? `https://wa.me/${String(whatsapp).replace(/\D/g, "")}`
    : null;

  return (
    <div
      className={`group bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        status === "off-duty"
          ? "border-slate-200"
          : "border-slate-200"
      }`}
    >
      {/* =========================
          TOP PROFILE SECTION
      ========================= */}
      <div className="relative bg-slate-950 p-6 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-yellow-400/10 rounded-full" />

        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full" />

        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          {/* Profile */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Image */}
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-800 border-2 border-yellow-400 overflow-hidden flex items-center justify-center shadow-lg">
              {electricianImage ? (
                <img
                  src={electricianImage}
                  alt={electrician.name || "Electrician"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <FaUser className="text-3xl text-slate-500" />
              )}
            </div>

            {/* Name & Experience */}
            <div className="min-w-0">
              <h2 className="text-xl font-black text-white truncate">
                {electrician.name || "Unnamed Electrician"}
              </h2>

              <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                <FaBriefcase className="text-yellow-400 shrink-0" />

                <span>
                  {electrician.experience || 0} Years Experience
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`self-start shrink-0 inline-flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-full ${statusStyle.className}`}
          >
            {statusStyle.icon}
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* =========================
          CARD CONTENT
      ========================= */}
      <div className="p-6">
        {/* =========================
            CONTACT DETAILS
        ========================= */}
        <div className="grid sm:grid-cols-2 gap-3">
          {/* Phone */}
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl p-3 transition"
            >
              <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FaPhoneAlt />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  Mobile Number
                </p>

                <p className="text-sm font-black text-slate-800 truncate">
                  {phone}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <div className="w-10 h-10 shrink-0 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                <FaPhoneAlt />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  Mobile Number
                </p>

                <p className="text-sm font-black text-slate-500">
                  Not provided
                </p>
              </div>
            </div>
          )}

          {/* WhatsApp */}
          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-slate-50 hover:bg-green-50 border border-transparent hover:border-green-100 rounded-xl p-3 transition"
            >
              <div className="w-10 h-10 shrink-0 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <FaWhatsapp className="text-xl" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  WhatsApp
                </p>

                <p className="text-sm font-black text-slate-800 truncate">
                  {whatsapp}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
              <div className="w-10 h-10 shrink-0 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                <FaWhatsapp />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  WhatsApp
                </p>

                <p className="text-sm font-black text-slate-500">
                  Not provided
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            SERVICE AREAS
        ========================= */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <FaMapMarkerAlt className="text-yellow-500" />

            <h3 className="text-sm font-black text-slate-800">
              Service Areas
            </h3>
          </div>

          {normalizedServiceAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {normalizedServiceAreas
                .slice(0, 4)
                .map((area, index) => {
                  // Handle object:
                  // { _id: "...", name: "Islamabad" }
                  const areaName =
                    typeof area === "object" && area !== null
                      ? area.name || "Unknown Area"
                      : String(area);

                  const areaId =
                    typeof area === "object" && area !== null
                      ? area._id || `${areaName}-${index}`
                      : `${areaName}-${index}`;

                  return (
                    <span
                      key={areaId}
                      className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      <FaMapMarkerAlt className="text-[10px]" />
                      {areaName}
                    </span>
                  );
                })}

              {/* More Areas */}
              {normalizedServiceAreas.length > 4 && (
                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-full">
                  +{normalizedServiceAreas.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-400">
                No service areas assigned.
              </p>
            </div>
          )}
        </div>

        {/* =========================
            STATUS SELECT
        ========================= */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-500 mb-2">
            Availability Status
          </label>

          <div className="relative">
            <select
              value={status}
              disabled={busy}
              onChange={(e) =>
                onStatusChange(
                  electrician,
                  e.target.value
                )
              }
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 outline-none font-bold text-sm text-slate-700 cursor-pointer transition focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="available">
                Available
              </option>

              <option value="busy">
                Busy
              </option>

              <option value="off-duty">
                Off Duty
              </option>
            </select>

            {busy && (
              <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-yellow-500" />
            )}
          </div>
        </div>

        {/* =========================
            ACTION BUTTONS
        ========================= */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(electrician)}
            disabled={busy}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl py-3 font-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaEdit />
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(electrician)}
            disabled={busy}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl py-3 font-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaTrash />
            )}

            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectricianCard;