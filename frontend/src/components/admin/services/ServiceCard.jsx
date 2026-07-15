import {
  FaBolt,
  FaEdit,
  FaTrash,
  FaStar,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
  FaTag,
  FaClock,
} from "react-icons/fa";

const ServiceCard = ({
  service,
  updatingId,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const busy = updatingId === service._id;

  // Get correct image URL
  const getImageUrl = () => {
    const image =
      service.image?.url ||
      service.imageUrl ||
      service.image ||
      "";

    if (!image || typeof image !== "string") {
      return "";
    }

    // Cloudinary or any complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Get backend base URL
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    // Remove /api from end
    const backendUrl = apiUrl.replace(/\/api\/?$/, "");

    // Clean image path
    const cleanImagePath = image.replace(/^\/+/, "");

    return `${backendUrl}/${cleanImagePath}`;
  };

  const serviceImage = getImageUrl();

  return (
    <div
      className={`group bg-white rounded-3xl border overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        service.isActive
          ? "border-slate-200"
          : "border-red-200 opacity-75"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {serviceImage ? (
          <img
            src={serviceImage}
            alt={service.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              console.error(
                "Image failed to load:",
                serviceImage
              );

              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBolt className="text-5xl text-slate-300" />
          </div>
        )}

        {/* Active Status */}
        <span
          className={`absolute top-4 left-4 text-xs font-black px-3 py-1.5 rounded-full ${
            service.isActive
              ? "bg-green-500 text-white"
              : "bg-slate-900 text-white"
          }`}
        >
          {service.isActive ? "Active" : "Inactive"}
        </span>

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {service.isPopular && (
            <span className="flex items-center gap-1 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <FaStar />
              Popular
            </span>
          )}

          {service.isEmergency && (
            <span className="flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <FaExclamationTriangle />
              Emergency
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="inline-flex bg-yellow-100 text-yellow-700 text-xs font-black px-3 py-1.5 rounded-full capitalize">
          {service.category || "residential"}
        </span>

        <h2 className="text-xl font-black text-slate-900 mt-3">
          {service.name}
        </h2>

        <p className="text-slate-500 text-sm leading-relaxed mt-3 line-clamp-2 min-h-[40px]">
          {service.shortDescription ||
            "No description available."}
        </p>

        {/* Price & Time */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FaTag />
              Starting Price
            </div>

            <p className="font-black text-green-600 mt-1">
              Rs. {service.startingPrice ?? "N/A"}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FaClock />
              Est. Time
            </div>

            <p className="font-black text-slate-800 mt-1">
              {service.estimatedTime || "N/A"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onEdit(service)}
            disabled={busy}
            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition disabled:opacity-50"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onToggle(service)}
            disabled={busy}
            title={
              service.isActive
                ? "Deactivate Service"
                : "Activate Service"
            }
            className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl py-3 flex items-center justify-center transition disabled:opacity-50"
          >
            {busy ? (
              <FaSpinner className="animate-spin" />
            ) : service.isActive ? (
              <FaToggleOn className="text-xl" />
            ) : (
              <FaToggleOff className="text-xl" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            disabled={busy}
            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition disabled:opacity-50"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;