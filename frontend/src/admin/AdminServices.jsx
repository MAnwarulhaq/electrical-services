import { useCallback, useEffect, useState } from "react";
import {
  FaBolt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSearch,
  FaStar,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff,
  FaSpinner,
} from "react-icons/fa";

import api from "../services/api";

const initialForm = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  whatsIncluded: "",
  icon: "FaBolt",
  image: null,
  startingPrice: "",
  estimatedTime: "",
  category: "residential",
  isEmergency: false,
  isPopular: false,
  displayOrder: 0,
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH ALL SERVICES
  // =========================
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services/admin/all");

      setServices(response.data?.data || []);
    } catch (err) {
      console.error("Fetch Services Error:", err.response?.data || err);

      setError(
        err.response?.data?.message ||
          "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0] || null
          : value,
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================
  const openAddModal = () => {
    setEditingService(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEditModal = (service) => {
    setEditingService(service);

    setFormData({
      name: service.name || "",
      shortDescription: service.shortDescription || "",
      fullDescription: service.fullDescription || "",
      whatsIncluded: service.whatsIncluded?.join("\n") || "",
      icon: service.icon || "FaBolt",
      image: null,
      startingPrice: service.startingPrice ?? "",
      estimatedTime: service.estimatedTime || "",
      category: service.category || "residential",
      isEmergency: Boolean(service.isEmergency),
      isPopular: Boolean(service.isPopular),
      displayOrder: service.displayOrder ?? 0,
    });

    setError("");
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingService(null);
    setFormData(initialForm);
  };

  // =========================
  // CREATE FORMDATA
  // =========================
  const buildFormData = () => {
    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append(
      "shortDescription",
      formData.shortDescription.trim()
    );
    data.append(
      "fullDescription",
      formData.fullDescription.trim()
    );

    data.append("icon", formData.icon);
    data.append("startingPrice", formData.startingPrice);
    data.append("estimatedTime", formData.estimatedTime.trim());
    data.append("category", formData.category);

    data.append("isEmergency", String(formData.isEmergency));
    data.append("isPopular", String(formData.isPopular));
    data.append("displayOrder", String(formData.displayOrder || 0));

    const includedItems = formData.whatsIncluded
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    includedItems.forEach((item) => {
      data.append("whatsIncluded[]", item);
    });

    if (formData.image) {
      data.append("image", formData.image);
    }

    return data;
  };

  // =========================
  // ADD / UPDATE SERVICE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const data = buildFormData();

      if (editingService) {
        await api.put(
          `/services/${editingService._id}`,
          data
        );

        setSuccess("Service updated successfully.");
      } else {
        await api.post("/services", data);

        setSuccess("Service created successfully.");
      }

      closeModal();
      await fetchServices();
    } catch (err) {
      console.error(
        "Save Service Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = async (service) => {
    try {
      setUpdatingId(service._id);
      setError("");

      await api.patch(`/services/${service._id}/toggle`);

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Toggle Service Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update service status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // DELETE SERVICE
  // =========================
  const deleteService = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(service._id);
      setError("");

      await api.delete(`/services/${service._id}`);

      setServices((prev) =>
        prev.filter((item) => item._id !== service._id)
      );

      setSuccess("Service deleted successfully.");
    } catch (err) {
      console.error(
        "Delete Service Error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete service."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      service.shortDescription
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      service.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const activeCount = services.filter(
    (service) => service.isActive
  ).length;

  const popularCount = services.filter(
    (service) => service.isPopular
  ).length;

  const emergencyCount = services.filter(
    (service) => service.isEmergency
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-yellow-500 font-bold uppercase tracking-widest text-sm">
            Service Management
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
            Manage Services
          </h1>

          <p className="text-slate-500 mt-2">
            Add, edit, delete and manage your electrical services.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-4 rounded-xl transition"
        >
          <FaPlus />
          Add New Service
        </button>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Services"
          value={services.length}
          icon={<FaBolt />}
          className="bg-blue-50 text-blue-700"
        />

        <StatCard
          title="Active Services"
          value={activeCount}
          icon={<FaToggleOn />}
          className="bg-green-50 text-green-700"
        />

        <StatCard
          title="Popular Services"
          value={popularCount}
          icon={<FaStar />}
          className="bg-purple-50 text-purple-700"
        />

        <StatCard
          title="Emergency"
          value={emergencyCount}
          icon={<FaExclamationTriangle />}
          className="bg-red-50 text-red-700"
        />
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
          {success}
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="grid md:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400 bg-white"
          >
            <option value="all">All Categories</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* SERVICES */}
      {loading ? (
        <div className="bg-white rounded-2xl p-20 flex justify-center">
          <FaSpinner className="text-4xl text-yellow-500 animate-spin" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <FaBolt className="text-5xl text-slate-300 mx-auto" />

          <h2 className="text-xl font-black mt-5">
            No services found
          </h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              updatingId={updatingId}
              onEdit={openEditModal}
              onDelete={deleteService}
              onToggle={toggleStatus}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto my-8 bg-white rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-black">
                  {editingService
                    ? "Edit Service"
                    : "Add New Service"}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Enter service information below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="Service Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Starting Price"
                  name="startingPrice"
                  type="number"
                  min="0"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Estimated Time"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  placeholder="30-60 mins"
                  required
                />

                <Input
                  label="Icon Name"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="FaBolt"
                />

                <div>
                  <label className="font-bold text-sm">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400"
                  >
                    <option value="residential">
                      Residential
                    </option>

                    <option value="commercial">
                      Commercial
                    </option>

                    <option value="emergency">
                      Emergency
                    </option>
                  </select>
                </div>

                <Input
                  label="Display Order"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-5">
                <label className="font-bold text-sm">
                  Short Description
                </label>

                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength="200"
                  required
                  rows="3"
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              <div className="mt-5">
                <label className="font-bold text-sm">
                  Full Description
                </label>

                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 resize-none"
                />
              </div>

              <div className="mt-5">
                <label className="font-bold text-sm">
                  What's Included
                </label>

                <textarea
                  name="whatsIncluded"
                  value={formData.whatsIncluded}
                  onChange={handleChange}
                  rows="5"
                  placeholder={`Inspection\nInstallation\nTesting`}
                  className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 resize-none"
                />

                <p className="text-xs text-slate-400 mt-2">
                  Add one item per line.
                </p>
              </div>

              <div className="mt-5">
                <label className="font-bold text-sm">
                  Service Image
                </label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full mt-2 border border-dashed border-slate-300 rounded-xl p-4"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Checkbox
                  name="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  label="Popular Service"
                  icon={<FaStar />}
                />

                <Checkbox
                  name="isEmergency"
                  checked={formData.isEmergency}
                  onChange={handleChange}
                  label="Emergency Service"
                  icon={<FaExclamationTriangle />}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaSave />
                )}

                {submitting
                  ? "Saving..."
                  : editingService
                  ? "Update Service"
                  : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// SERVICE CARD
// =========================
const ServiceCard = ({
  service,
  updatingId,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const busy = updatingId === service._id;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-xl ${
        !service.isActive
          ? "opacity-60 border-red-200"
          : "border-slate-100"
      }`}
    >
      <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />

      <div className="p-6">
        <div className="flex justify-between gap-4">
          <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl">
            <FaBolt />
          </div>

          <div className="flex gap-2">
            {service.isPopular && (
              <span className="h-fit bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Popular
              </span>
            )}

            {service.isEmergency && (
              <span className="h-fit bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">
                Emergency
              </span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-black mt-5">
          {service.name}
        </h2>

        <p className="text-slate-500 text-sm mt-2 line-clamp-2">
          {service.shortDescription}
        </p>

        <div className="flex justify-between items-center mt-5 pt-5 border-t">
          <div>
            <p className="text-xs text-slate-400">
              Starting Price
            </p>

            <p className="font-black text-green-600">
              Rs. {service.startingPrice}
            </p>
          </div>

          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-2 rounded-lg capitalize">
            {service.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5">
          <button
            onClick={() => onEdit(service)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl py-3 flex justify-center"
          >
            <FaEdit />
          </button>

          <button
            disabled={busy}
            onClick={() => onToggle(service)}
            className={`rounded-xl py-3 flex justify-center ${
              service.isActive
                ? "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {service.isActive ? (
              <FaToggleOn />
            ) : (
              <FaToggleOff />
            )}
          </button>

          <button
            disabled={busy}
            onClick={() => onDelete(service)}
            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl py-3 flex justify-center"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  className,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${className}`}
    >
      {icon}
    </div>

    <div>
      <p className="text-slate-500 text-sm">{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="font-bold text-sm">{label}</label>

    <input
      {...props}
      className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-yellow-400"
    />
  </div>
);

const Checkbox = ({
  name,
  checked,
  onChange,
  label,
  icon,
}) => (
  <label className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-yellow-400">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-yellow-400"
    />

    <span className="text-yellow-500">{icon}</span>

    <span className="font-bold">{label}</span>
  </label>
);

export default AdminServices;