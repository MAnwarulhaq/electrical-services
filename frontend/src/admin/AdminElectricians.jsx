
import { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaBriefcase,
  FaCheckCircle,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUpload,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
  FaWhatsapp,
} from "react-icons/fa";

import {
  getElectricians,
  createElectrician,
  updateElectrician,
  updateElectricianStatus,
  deleteElectrician,
} from "../services/electricianApi";

import api from "../services/api";

const initialForm = {
  name: "",
  mobileNumber: "",
  whatsappNumber: "",
  specialization: "",
  serviceAreas: [],
  availabilityStatus: "available",
  isActive: true,
  yearsOfExperience: 0,
  photo: null,
};

const AdminElectricians = () => {
  const [electricians, setElectricians] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingElectrician, setEditingElectrician] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      const [electricianResponse, areasResponse] = await Promise.all([
        getElectricians(),
        api.get("/areas"),
      ]);

      setElectricians(electricianResponse.data || []);
      setServiceAreas(areasResponse.data?.data || []);
    } catch (err) {
      console.error("Load Electricians Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load electricians."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredElectricians = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return electricians.filter((electrician) => {
      const matchesSearch =
        electrician.name?.toLowerCase().includes(searchText) ||
        electrician.mobileNumber
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.whatsappNumber
          ?.toLowerCase()
          .includes(searchText) ||
        electrician.specialization?.some((item) =>
          item.toLowerCase().includes(searchText)
        );

      const matchesStatus =
        statusFilter === "all" ||
        electrician.availabilityStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [electricians, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: electricians.length,
      available: electricians.filter(
        (item) => item.availabilityStatus === "available"
      ).length,
      busy: electricians.filter(
        (item) => item.availabilityStatus === "busy"
      ).length,
      offDuty: electricians.filter(
        (item) => item.availabilityStatus === "off-duty"
      ).length,
    };
  }, [electricians]);

  const getImageUrl = (photo) => {
    if (!photo || typeof photo !== "string") return "";

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://")
    ) {
      return photo;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");
    const cleanPath = photo.startsWith("/") ? photo : `/${photo}`;

    return `${backendUrl}${cleanPath}`;
  };

  const openCreateModal = () => {
    setEditingElectrician(null);
    setFormData(initialForm);
    setPreview("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (electrician) => {
    setEditingElectrician(electrician);

    setFormData({
      name: electrician.name || "",
      mobileNumber: electrician.mobileNumber || "",
      whatsappNumber: electrician.whatsappNumber || "",
      specialization:
        electrician.specialization?.join(", ") || "",
      serviceAreas:
        electrician.serviceAreas?.map(
          (area) => area._id || area
        ) || [],
      availabilityStatus:
        electrician.availabilityStatus || "available",
      isActive: electrician.isActive ?? true,
      yearsOfExperience:
        electrician.yearsOfExperience || 0,
      photo: null,
    });

    setPreview(
      electrician.photo
        ? getImageUrl(electrician.photo)
        : ""
    );

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingElectrician(null);
    setFormData(initialForm);
    setPreview("");
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAreaChange = (areaId) => {
    setFormData((prev) => {
      const exists = prev.serviceAreas.includes(areaId);

      return {
        ...prev,
        serviceAreas: exists
          ? prev.serviceAreas.filter((id) => id !== areaId)
          : [...prev.serviceAreas, areaId],
      };
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append(
      "mobileNumber",
      formData.mobileNumber.trim()
    );
    data.append(
      "whatsappNumber",
      formData.whatsappNumber.trim()
    );
    data.append(
      "yearsOfExperience",
      Number(formData.yearsOfExperience)
    );
    data.append(
      "availabilityStatus",
      formData.availabilityStatus
    );
    data.append("isActive", formData.isActive);

    const specializations = formData.specialization
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    specializations.forEach((item) => {
      data.append("specialization[]", item);
    });

    formData.serviceAreas.forEach((areaId) => {
      data.append("serviceAreas[]", areaId);
    });

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.mobileNumber.trim() ||
      !formData.whatsappNumber.trim()
    ) {
      setError(
        "Name, mobile number and WhatsApp number are required."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = buildFormData();

      if (editingElectrician) {
        await updateElectrician(
          editingElectrician._id,
          payload
        );

        setSuccess("Electrician updated successfully.");
      } else {
        await createElectrician(payload);
        setSuccess("Electrician added successfully.");
      }

      setShowModal(false);
      setEditingElectrician(null);
      setFormData(initialForm);
      setPreview("");

      await fetchInitialData();
    } catch (err) {
      console.error("Save Electrician Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save electrician."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      await updateElectricianStatus(id, {
        availabilityStatus: status,
      });

      setElectricians((prev) =>
        prev.map((electrician) =>
          electrician._id === id
            ? {
                ...electrician,
                availabilityStatus: status,
              }
            : electrician
        )
      );
    } catch (err) {
      console.error("Update Availability Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update availability."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleActiveToggle = async (electrician) => {
    try {
      setUpdatingId(electrician._id);
      setError("");

      await updateElectricianStatus(electrician._id, {
        isActive: !electrician.isActive,
      });

      setElectricians((prev) =>
        prev.map((item) =>
          item._id === electrician._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Toggle Electrician Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update electrician."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (electrician) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${electrician.name}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(electrician._id);
      setError("");
      setSuccess("");

      await deleteElectrician(electrician._id);

      setElectricians((prev) =>
        prev.filter(
          (item) => item._id !== electrician._id
        )
      );

      setSuccess("Electrician deleted successfully.");
    } catch (err) {
      console.error("Delete Electrician Error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete electrician."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6 xl:p-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-6 md:p-8 mb-8 shadow-xl">
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-yellow-400/10 blur-2xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
              <FaBolt />
              Team Management
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-white">
              Electrician
              <span className="text-yellow-400"> Management</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm md:text-base leading-7 text-slate-400">
              Manage your electrician team, availability,
              service locations and professional profiles.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-950 shadow-lg shadow-yellow-400/20 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-yellow-400 transition-transform group-hover:rotate-90">
              <FaPlus />
            </span>
            Add Electrician
          </button>
        </div>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
          <FaCheckCircle className="shrink-0 text-xl" />
          {success}
        </div>
      )}

      {!showModal && error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard
          title="Total Electricians"
          value={stats.total}
          icon={<FaBolt />}
          iconClass="bg-yellow-400 text-slate-950"
        />

        <StatCard
          title="Available"
          value={stats.available}
          icon={<FaUserCheck />}
          iconClass="bg-green-100 text-green-600"
        />

        <StatCard
          title="Busy"
          value={stats.busy}
          icon={<FaUserClock />}
          iconClass="bg-orange-100 text-orange-600"
        />

        <StatCard
          title="Off Duty"
          value={stats.offDuty}
          icon={<FaUserSlash />}
          iconClass="bg-red-100 text-red-600"
        />
      </div>

      {/* FILTER BAR */}
      <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white p-4 md:p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="group relative">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-yellow-500" />

            <input
              type="text"
              placeholder="Search by name, mobile or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 text-sm font-semibold text-slate-800 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="off-duty">Off Duty</option>
          </select>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-20 text-center shadow-sm">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-slate-100 border-t-yellow-400" />
          <p className="mt-5 font-semibold text-slate-500">
            Loading electricians...
          </p>
        </div>
      ) : filteredElectricians.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
            <FaUserSlash className="text-3xl text-slate-400" />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-900">
            No Electricians Found
          </h2>

          <p className="mt-2 text-slate-500">
            Add a new electrician or change your search filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredElectricians.map((electrician) => (
            <ElectricianCard
              key={electrician._id}
              electrician={electrician}
              updating={updatingId === electrician._id}
              getImageUrl={getImageUrl}
              onEdit={() => openEditModal(electrician)}
              onDelete={() => handleDelete(electrician)}
              onStatusChange={(status) =>
                handleStatusChange(
                  electrician._id,
                  status
                )
              }
              onActiveToggle={() =>
                handleActiveToggle(electrician)
              }
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center py-6">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}
              <div className="relative overflow-hidden bg-slate-950 p-6 md:p-8">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-400/10" />

                <div className="relative flex items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                      <FaBolt />
                      Electrician Profile
                    </div>

                    <h2 className="mt-3 text-2xl md:text-3xl font-black text-white">
                      {editingElectrician
                        ? "Edit Electrician"
                        : "Add New Electrician"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:rotate-90 hover:bg-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-6 md:p-8">
                {error && (
                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
                    {error}
                  </div>
                )}

                {/* PHOTO */}
                <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-950 shadow-lg">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Electrician preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaBolt className="text-4xl text-yellow-400" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Profile Photo
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Upload a clear professional photo.
                    </p>

                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-yellow-400 hover:text-slate-950">
                      <FaUpload />
                      Choose Photo

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* FORM FIELDS */}
                <div className="grid gap-5 md:grid-cols-2">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />

                  <FormInput
                    label="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    required
                  />

                  <FormInput
                    label="WhatsApp Number"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    required
                  />

                  <FormInput
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-5">
                  <FormInput
                    label="Specializations"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="Wiring, Solar, AC Repair"
                  />

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    Separate multiple specializations with commas.
                  </p>
                </div>

                {/* AVAILABILITY */}
                <div className="mt-6">
                  <label className="text-sm font-black text-slate-700">
                    Availability Status
                  </label>

                  <select
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 font-semibold text-slate-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
                  >
                    <option value="available">
                      Available
                    </option>
                    <option value="busy">Busy</option>
                    <option value="off-duty">
                      Off Duty
                    </option>
                  </select>
                </div>

                {/* SERVICE AREAS */}
                <div className="mt-8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                      <FaMapMarkerAlt />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900">
                        Service Areas
                      </h3>
                      <p className="text-xs text-slate-400">
                        Select all locations this electrician covers.
                      </p>
                    </div>
                  </div>

                  {serviceAreas.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                      No service areas available.
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {serviceAreas.map((area) => {
                        const selected =
                          formData.serviceAreas.includes(
                            area._id
                          );

                        return (
                          <label
                            key={area._id}
                            className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all ${
                              selected
                                ? "border-yellow-400 bg-yellow-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-yellow-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() =>
                                handleAreaChange(area._id)
                              }
                              className="h-4 w-4 accent-yellow-400"
                            />

                            <span className="text-sm font-bold text-slate-700">
                              {area.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ACTIVE */}
                <label className="mt-8 flex cursor-pointer items-center justify-between gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="font-black text-slate-900">
                      Active Electrician
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Allow this electrician to receive and manage jobs.
                    </p>
                  </div>

                  <div
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      formData.isActive
                        ? "bg-green-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        formData.isActive
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={submitting}
                    className="rounded-2xl bg-slate-100 px-7 py-4 font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex min-w-48 items-center justify-center gap-3 rounded-2xl bg-yellow-400 px-7 py-4 font-black text-slate-950 shadow-lg shadow-yellow-400/20 transition hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && (
                      <FaSpinner className="animate-spin" />
                    )}

                    {submitting
                      ? "Saving..."
                      : editingElectrician
                        ? "Update Electrician"
                        : "Add Electrician"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===========================
   ELECTRICIAN CARD
=========================== */

const ElectricianCard = ({
  electrician,
  updating,
  getImageUrl,
  onEdit,
  onDelete,
  onStatusChange,
  onActiveToggle,
}) => {
  const statusConfig = {
    available: {
      label: "Available",
      badge:
        "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },
    busy: {
      label: "Busy",
      badge:
        "bg-orange-50 text-orange-700 border-orange-200",
      dot: "bg-orange-500",
    },
    "off-duty": {
      label: "Off Duty",
      badge: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
  };

  const currentStatus =
    statusConfig[electrician.availabilityStatus] ||
    statusConfig.available;

  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        electrician.isActive
          ? "border-slate-200"
          : "border-red-200 opacity-70"
      }`}
    >
      {/* CARD HEADER */}
      <div className="relative overflow-hidden bg-slate-950 p-6">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-yellow-400/10 transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-yellow-400 bg-slate-800 shadow-lg">
            {electrician.photo ? (
              <img
                src={getImageUrl(electrician.photo)}
                alt={electrician.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FaBolt className="text-3xl text-yellow-400" />
              </div>
            )}

            {electrician.isActive && (
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-green-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-black text-white">
              {electrician.name}
            </h2>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${currentStatus.badge}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
                />
                {currentStatus.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-6">
        <div className="grid gap-3">
          <InfoRow
            icon={<FaPhoneAlt />}
            label="Mobile Number"
            value={
              electrician.mobileNumber || "Not provided"
            }
          />

          <InfoRow
            icon={<FaWhatsapp />}
            label="WhatsApp"
            value={
              electrician.whatsappNumber || "Not provided"
            }
          />

          <InfoRow
            icon={<FaBriefcase />}
            label="Experience"
            value={`${electrician.yearsOfExperience || 0} years`}
          />

          <InfoRow
            icon={<FaMapMarkerAlt />}
            label="Service Areas"
            value={
              electrician.serviceAreas?.length
                ? electrician.serviceAreas
                    .map((area) =>
                      typeof area === "object"
                        ? area.name
                        : area
                    )
                    .join(", ")
                : "No service areas"
            }
          />
        </div>

        {/* SPECIALIZATIONS */}
        {electrician.specialization?.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-400">
              Specializations
            </p>

            <div className="flex flex-wrap gap-2">
              {electrician.specialization.map(
                (item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-bold text-yellow-700"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* AVAILABILITY */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Availability Status
          </label>

          <div className="relative mt-2">
            <select
              value={
                electrician.availabilityStatus ||
                "available"
              }
              disabled={updating}
              onChange={(e) =>
                onStatusChange(e.target.value)
              }
              className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm font-bold text-slate-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            />

            {updating && (
              <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-yellow-500" />
            )}
          </div>
        </div>

        {/* ACTIVE TOGGLE */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div>
            <p className="text-sm font-black text-slate-800">
              {electrician.isActive
                ? "Active Profile"
                : "Inactive Profile"}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {electrician.isActive
                ? "Available in the system"
                : "Hidden from the system"}
            </p>
          </div>

          <button
            type="button"
            disabled={updating}
            onClick={onActiveToggle}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-all ${
              electrician.isActive
                ? "bg-green-500"
                : "bg-slate-300"
            } disabled:opacity-50`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
                electrician.isActive
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        {/* BUTTONS */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onEdit}
            disabled={updating}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 py-3.5 font-black text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:opacity-50"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={onDelete}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 font-black text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
          >
            {updating ? (
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

/* ===========================
   STAT CARD
=========================== */

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
}) => (
  <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100 transition-transform duration-500 group-hover:scale-125" />

    <div className="relative flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-slate-500">
          {title}
        </p>

        <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          {value}
        </p>
      </div>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl shadow-sm ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

/* ===========================
   FORM INPUT
=========================== */

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-black text-slate-700">
      {label}
    </label>

    <input
      {...props}
      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
    />
  </div>
);

/* ===========================
   INFO ROW
=========================== */

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5 transition hover:bg-slate-100">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-yellow-500 shadow-sm">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-sm font-bold text-slate-700">
        {value}
      </p>
    </div>
  </div>
);

export default AdminElectricians;

