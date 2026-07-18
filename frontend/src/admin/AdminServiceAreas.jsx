
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
  FaSortNumericDown,
  FaArrowRight,
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
      const searchValue = search.toLowerCase().trim();

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
    setError("");
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

      await toggleServiceAreaStatus(area._id, newStatus);

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
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6 xl:p-8">
      <div className="mx-auto max-w-[1600px]">

        {/* ================= HEADER ================= */}
        <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 md:p-8 mb-8 shadow-xl shadow-slate-900/10">
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-2xl text-slate-950 shadow-lg shadow-yellow-400/20">
                <FaMapMarkerAlt />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />

                  <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-yellow-400">
                    Admin Management
                  </p>
                </div>

                <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-white">
                  Service Areas
                </h1>

                <p className="mt-2 max-w-2xl text-sm md:text-base leading-7 text-slate-400">
                  Manage locations where your electrical services
                  are available to customers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="group flex w-full lg:w-auto items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-sm text-yellow-400">
                <FaPlus />
              </span>

              Add Service Area

              <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        {success && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <FaCheckCircle />
            </div>

            <span className="font-semibold">{success}</span>
          </div>
        )}

        {!showModal && error && (
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <FaBan />
            </div>

            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* ================= STATS ================= */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 mb-8">
          <StatCard
            icon={<FaLayerGroup />}
            title="Total Areas"
            value={stats.total}
            description="All service locations"
            cardClass="from-slate-950 to-slate-800"
            iconClass="bg-white/10 text-yellow-400"
          />

          <StatCard
            icon={<FaCheckCircle />}
            title="Active Areas"
            value={stats.active}
            description="Available to customers"
            cardClass="from-emerald-600 to-emerald-500"
            iconClass="bg-white/20 text-white"
          />

          <StatCard
            icon={<FaBan />}
            title="Inactive Areas"
            value={stats.inactive}
            description="Currently unavailable"
            cardClass="from-red-600 to-rose-500"
            iconClass="bg-white/20 text-white"
          />
        </div>

        {/* ================= SEARCH & FILTER ================= */}
        <div className="mb-7 rounded-[24px] border border-slate-200/80 bg-white p-4 md:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by area name or city..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-56 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-semibold text-slate-700 outline-none transition-all focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
            >
              <option value="all">All Areas</option>
              <option value="active">Active Areas</option>
              <option value="inactive">Inactive Areas</option>
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
          {/* Table Header Info */}
          <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Service Area List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredAreas.length} of {areas.length} areas
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
              {statusFilter === "all"
                ? "All Status"
                : statusFilter === "active"
                  ? "Active Only"
                  : "Inactive Only"}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-50">
                <FaSpinner className="animate-spin text-3xl text-yellow-500" />
              </div>

              <p className="mt-5 font-semibold text-slate-500">
                Loading service areas...
              </p>
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <FaMapMarkerAlt className="text-4xl text-slate-300" />
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-900">
                No Service Areas Found
              </h3>

              <p className="mt-2 max-w-md text-slate-500">
                No areas match your current search or filter.
                Try changing the filters or add a new service area.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-slate-950 transition hover:bg-yellow-300"
              >
                <FaPlus />
                Add Service Area
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="bg-slate-950 text-left text-sm text-white">
                    <th className="px-6 py-5 font-bold">
                      Service Area
                    </th>

                    <th className="px-6 py-5 font-bold">
                      City
                    </th>

                    <th className="px-6 py-5 text-center font-bold">
                      Display Order
                    </th>

                    <th className="px-6 py-5 text-center font-bold">
                      Status
                    </th>

                    <th className="px-6 py-5 text-right font-bold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAreas.map((area) => (
                    <tr
                      key={area._id}
                      className="group transition-colors duration-200 hover:bg-slate-50/80"
                    >
                      {/* AREA */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600 ring-1 ring-yellow-200 transition group-hover:bg-yellow-400 group-hover:text-slate-950">
                            <FaMapMarkerAlt />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-900">
                              {area.name}
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              ID: {area._id?.slice(-6)?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CITY */}
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                          <FaCity />
                          {area.city}
                        </div>
                      </td>

                      {/* ORDER */}
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-violet-50 px-3 font-black text-violet-700 ring-1 ring-violet-100">
                          <FaSortNumericDown className="text-xs" />
                          {area.displayOrder ?? 0}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(area)}
                          disabled={updatingId === area._id}
                          className={`inline-flex min-w-[115px] items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                            area.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {updatingId === area._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : area.isActive ? (
                            <FaCheckCircle />
                          ) : (
                            <FaBan />
                          )}

                          {area.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(area)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 transition-all hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                            title="Edit Area"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(area)}
                            disabled={deletingId === area._id}
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition-all hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center py-6">
            <div className="w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl">

              {/* MODAL HEADER */}
              <div className="relative overflow-hidden bg-slate-950 p-6 md:p-7">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-400/10" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
                      {editingArea ? <FaEdit /> : <FaPlus />}
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                        Service Area
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-white">
                        {editingArea
                          ? "Edit Service Area"
                          : "Add Service Area"}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-red-500 disabled:opacity-50"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8"
              >
                {error && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <FaBan className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <FormInput
                    label="Area Name"
                    icon={<FaMapMarkerAlt />}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Gulshan-e-Iqbal"
                    required
                  />

                  <FormInput
                    label="City"
                    icon={<FaCity />}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Karachi"
                    required
                  />

                  <FormInput
                    label="Display Order"
                    icon={<FaSortNumericDown />}
                    name="displayOrder"
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={handleChange}
                  />

                  {/* ACTIVE STATUS */}
                  <label className="flex cursor-pointer items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-yellow-300 hover:bg-yellow-50/30">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          formData.isActive
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {formData.isActive ? (
                          <FaCheckCircle />
                        ) : (
                          <FaBan />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-slate-900">
                          Active Status
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Allow customers to select this area.
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="h-5 w-5 shrink-0 accent-yellow-400"
                    />
                  </label>
                </div>

                {/* BUTTONS */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-2xl border border-slate-200 bg-white py-4 font-black text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-4 font-black text-slate-950 shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
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
  description,
  cardClass,
  iconClass,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-[26px] bg-gradient-to-br ${cardClass} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-125" />

      <div className="relative flex items-center justify-between gap-5">
        <div>
          <p className="text-sm font-bold text-white/75">
            {title}
          </p>

          <p className="mt-2 text-4xl font-black tracking-tight">
            {value}
          </p>

          <p className="mt-2 text-xs font-medium text-white/60">
            {description}
          </p>
        </div>

        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

// =========================
// FORM INPUT
// =========================
const FormInput = ({ label, icon, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          {...props}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
        />
      </div>
    </div>
  );
};

export default AdminServiceAreas;

