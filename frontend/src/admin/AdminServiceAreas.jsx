import { useEffect, useMemo, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheckCircle,
  FaBan,
  FaCity,
  FaLayerGroup,
  FaSpinner,
} from "react-icons/fa";

import {
  getAllServiceAreas,
  createServiceArea,
  updateServiceArea,
  toggleServiceAreaStatus,
  deleteServiceArea,
} from "../services/serviceAreaApi";

const initialForm = {
  name: "",
  city: "Karachi",
  displayOrder: 0,
  isActive: true,
};

const AdminServiceAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH AREAS
  // =========================
  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllServiceAreas();

      setAreas(response.data || []);
    } catch (err) {
      console.error("Fetch Service Areas Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load service areas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    return {
      total: areas.length,
      active: areas.filter((area) => area.isActive).length,
      inactive: areas.filter((area) => !area.isActive).length,
    };
  }, [areas]);

  // =========================
  // FILTER AREAS
  // =========================
  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        area.name?.toLowerCase().includes(searchValue) ||
        area.city?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && area.isActive) ||
        (statusFilter === "inactive" && !area.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [areas, search, statusFilter]);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // OPEN ADD MODAL
  // =========================
  const openAddModal = () => {
    setEditingArea(null);
    setFormData(initialForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEditModal = (area) => {
    setEditingArea(area);

    setFormData({
      name: area.name || "",
      city: area.city || "Karachi",
      displayOrder: area.displayOrder ?? 0,
      isActive: area.isActive ?? true,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingArea(null);
    setFormData(initialForm);
  };

  // =========================
  // CREATE / UPDATE AREA
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Area name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name.trim(),
        city: formData.city.trim() || "Karachi",
        displayOrder: Number(formData.displayOrder) || 0,
        isActive: formData.isActive,
      };

      if (editingArea) {
        await updateServiceArea(editingArea._id, payload);

        setSuccess("Service area updated successfully.");
      } else {
        await createServiceArea(payload);

        setSuccess("Service area added successfully.");
      }

      await fetchAreas();

      setShowModal(false);
      setEditingArea(null);
      setFormData(initialForm);
    } catch (err) {
      console.error("Save Service Area Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save service area."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const handleToggleStatus = async (area) => {
    try {
      setUpdatingId(area._id);
      setError("");
      setSuccess("");

      const newStatus = !area.isActive;

      await toggleServiceAreaStatus(
        area._id,
        newStatus
      );

      setAreas((prev) =>
        prev.map((item) =>
          item._id === area._id
            ? { ...item, isActive: newStatus }
            : item
        )
      );

      setSuccess(
        `Service area ${
          newStatus ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (err) {
      console.error("Toggle Area Status Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update service area status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // DELETE AREA
  // =========================
  const handleDelete = async (area) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${area.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(area._id);
      setError("");
      setSuccess("");

      await deleteServiceArea(area._id);

      setAreas((prev) =>
        prev.filter((item) => item._id !== area._id)
      );

      setSuccess("Service area deleted successfully.");
    } catch (err) {
      console.error("Delete Service Area Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete service area."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <p className="text-yellow-600 font-bold uppercase tracking-wider text-sm">
            Admin Management
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-1">
            Service Areas
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all areas where electrical services are
            available.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-4 rounded-2xl shadow-lg transition"
        >
          <FaPlus />
          Add Service Area
        </button>
      </div>

      {/* MESSAGES */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6">
          <FaCheckCircle />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6">
          <FaBan />
          <span>{error}</span>
        </div>
      )}

      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={<FaLayerGroup />}
          title="Total Areas"
          value={stats.total}
          className="bg-blue-600"
        />

        <StatCard
          icon={<FaCheckCircle />}
          title="Active Areas"
          value={stats.active}
          className="bg-emerald-600"
        />

        <StatCard
          icon={<FaBan />}
          title="Inactive Areas"
          value={stats.inactive}
          className="bg-red-500"
        />
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mb-7">
        <div className="grid md:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area or city..."
              className="w-full border border-slate-200 rounded-xl py-4 pl-12 pr-5 outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 bg-white"
          >
            <option value="all">All Areas</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center">
            <FaSpinner className="text-4xl text-yellow-500 animate-spin" />

            <p className="text-slate-500 mt-4">
              Loading service areas...
            </p>
          </div>
        ) : filteredAreas.length === 0 ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-3xl text-slate-400" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-5">
              No Service Areas Found
            </h3>

            <p className="text-slate-500 mt-2">
              Add a new service area or change your search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-950 text-white">
                <tr>
                  <th className="text-left px-6 py-5">
                    Area
                  </th>

                  <th className="text-left px-6 py-5">
                    City
                  </th>

                  <th className="text-center px-6 py-5">
                    Order
                  </th>

                  <th className="text-center px-6 py-5">
                    Status
                  </th>

                  <th className="text-right px-6 py-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAreas.map((area) => (
                  <tr
                    key={area._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                          <FaMapMarkerAlt />
                        </div>

                        <div>
                          <p className="font-black text-slate-900">
                            {area.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {area._id?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaCity className="text-blue-500" />
                        {area.city}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <span className="inline-flex items-center justify-center min-w-10 h-10 px-3 bg-purple-100 text-purple-700 rounded-xl font-bold">
                        {area.displayOrder ?? 0}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() =>
                          handleToggleStatus(area)
                        }
                        disabled={
                          updatingId === area._id
                        }
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                          area.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } disabled:opacity-50`}
                      >
                        {updatingId === area._id ? (
                          <FaSpinner className="animate-spin" />
                        ) : area.isActive ? (
                          <FaCheckCircle />
                        ) : (
                          <FaBan />
                        )}

                        {area.isActive
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            openEditModal(area)
                          }
                          className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition"
                          title="Edit Area"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(area)
                          }
                          disabled={
                            deletingId === area._id
                          }
                          className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition disabled:opacity-50"
                          title="Delete Area"
                        >
                          {deletingId === area._id ? (
                            <FaSpinner className="animate-spin" />
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
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-bold uppercase">
                  Service Area
                </p>

                <h2 className="text-2xl font-black mt-1">
                  {editingArea
                    ? "Edit Service Area"
                    : "Add Service Area"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8"
            >
              <div className="space-y-5">
                <FormInput
                  label="Area Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Gulshan-e-Iqbal"
                  required
                />

                <FormInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Karachi"
                  required
                />

                <FormInput
                  label="Display Order"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={handleChange}
                />

                {editingArea && (
                  <label className="flex items-center justify-between bg-slate-50 border border-slate-200 p-5 rounded-2xl cursor-pointer">
                    <div>
                      <p className="font-black text-slate-900">
                        Active Status
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Allow customers to select this area.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 accent-yellow-400"
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="border border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-4 rounded-xl transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : editingArea ? (
                    <>
                      <FaEdit />
                      Update Area
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Add Area
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// STAT CARD
// =========================
const StatCard = ({
  icon,
  title,
  value,
  className,
}) => (
  <div
    className={`${className} text-white rounded-3xl p-6 shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 font-semibold">
          {title}
        </p>

        <p className="text-4xl font-black mt-3">
          {value}
        </p>
      </div>

      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
        {icon}
      </div>
    </div>
  </div>
);

// =========================
// FORM INPUT
// =========================
const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block font-bold text-slate-800 mb-2">
      {label}
    </label>

    <input
      {...props}
      className="w-full border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-yellow-400 transition"
    />
  </div>
);

export default AdminServiceAreas;