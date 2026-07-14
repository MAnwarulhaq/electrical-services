import { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaBriefcase,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlus,
  FaSearch,
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
    return electricians.filter((electrician) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        electrician.name
          ?.toLowerCase()
          .includes(searchText) ||
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
        (item) =>
          item.availabilityStatus === "available"
      ).length,

      busy: electricians.filter(
        (item) => item.availabilityStatus === "busy"
      ).length,

      offDuty: electricians.filter(
        (item) =>
          item.availabilityStatus === "off-duty"
      ).length,
    };
  }, [electricians]);

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
      whatsappNumber:
        electrician.whatsappNumber || "",

      specialization:
        electrician.specialization?.join(", ") || "",

      serviceAreas:
        electrician.serviceAreas?.map(
          (area) => area._id || area
        ) || [],

      availabilityStatus:
        electrician.availabilityStatus ||
        "available",

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
          ? prev.serviceAreas.filter(
              (id) => id !== areaId
            )
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

        setSuccess(
          "Electrician updated successfully."
        );
      } else {
        await createElectrician(payload);

        setSuccess(
          "Electrician added successfully."
        );
      }

      closeModal();
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
      console.error(
        "Update Availability Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update availability."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleActiveToggle = async (
    electrician
  ) => {
    try {
      setUpdatingId(electrician._id);
      setError("");

      await updateElectricianStatus(
        electrician._id,
        {
          isActive: !electrician.isActive,
        }
      );

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
      console.error(
        "Toggle Electrician Error:",
        err
      );

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

      setSuccess(
        "Electrician deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete Electrician Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to delete electrician."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getImageUrl = (photo) => {
    if (!photo) return "";

    if (photo.startsWith("http")) {
      return photo;
    }

    return `http://localhost:5000${photo}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-yellow-600 font-black uppercase tracking-widest text-sm">
            Team Management
          </p>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
            Electricians
          </h1>

          <p className="text-slate-500 mt-2">
            Manage electricians, availability,
            service areas and profiles.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-3 bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-yellow-400 hover:text-slate-950 transition"
        >
          <FaPlus />
          Add Electrician
        </button>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-6">
          {success}
        </div>
      )}

      {!showModal && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Electricians"
          value={stats.total}
          icon={<FaBolt />}
          className="bg-slate-950 text-white"
        />

        <StatCard
          title="Available"
          value={stats.available}
          icon={<FaUserCheck />}
          className="bg-green-500 text-white"
        />

        <StatCard
          title="Busy"
          value={stats.busy}
          icon={<FaUserClock />}
          className="bg-orange-500 text-white"
        />

        <StatCard
          title="Off Duty"
          value={stats.offDuty}
          icon={<FaUserSlash />}
          className="bg-red-500 text-white"
        />
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mb-8">
        <div className="grid md:grid-cols-[1fr_250px] gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search electrician..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-slate-200 rounded-xl py-4 pl-11 pr-4 outline-none focus:border-yellow-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
          >
            <option value="all">
              All Availability
            </option>

            <option value="available">
              Available
            </option>

            <option value="busy">Busy</option>

            <option value="off-duty">
              Off Duty
            </option>
          </select>
        </div>
      </div>

      {/* ELECTRICIANS */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-400 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-5">
            Loading electricians...
          </p>
        </div>
      ) : filteredElectricians.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <FaUserSlash className="text-5xl text-slate-300 mx-auto" />

          <h2 className="text-2xl font-black mt-5">
            No Electricians Found
          </h2>

          <p className="text-slate-500 mt-2">
            Add your first electrician to get
            started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredElectricians.map(
            (electrician) => (
              <ElectricianCard
                key={electrician._id}
                electrician={electrician}
                updating={
                  updatingId === electrician._id
                }
                getImageUrl={getImageUrl}
                onEdit={() =>
                  openEditModal(electrician)
                }
                onDelete={() =>
                  handleDelete(electrician)
                }
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
            )
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm overflow-y-auto p-4">
          <div className="min-h-full flex items-center justify-center py-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* MODAL HEADER */}
              <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest">
                    Electrician Profile
                  </p>

                  <h2 className="text-2xl font-black mt-1">
                    {editingElectrician
                      ? "Edit Electrician"
                      : "Add New Electrician"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-red-500 transition"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 md:p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                    {error}
                  </div>
                )}

                {/* PHOTO */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="w-28 h-28 rounded-3xl bg-slate-100 overflow-hidden flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Electrician preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaBolt className="text-4xl text-yellow-500" />
                    )}
                  </div>

                  <label className="cursor-pointer">
                    <div className="flex items-center gap-3 bg-slate-100 px-5 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">
                      <FaUpload />
                      Upload Photo
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    value={
                      formData.whatsappNumber
                    }
                    onChange={handleChange}
                    placeholder="03XX XXXXXXX"
                    required
                  />

                  <FormInput
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    value={
                      formData.yearsOfExperience
                    }
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-5">
                  <FormInput
                    label="Specializations"
                    name="specialization"
                    value={
                      formData.specialization
                    }
                    onChange={handleChange}
                    placeholder="Wiring, Solar, AC Repair"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Separate specializations with
                    commas.
                  </p>
                </div>

                {/* AVAILABILITY */}
                <div className="mt-5">
                  <label className="font-bold text-slate-700">
                    Availability Status
                  </label>

                  <select
                    name="availabilityStatus"
                    value={
                      formData.availabilityStatus
                    }
                    onChange={handleChange}
                    className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
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
                </div>

                {/* SERVICE AREAS */}
                <div className="mt-7">
                  <label className="font-black text-slate-800">
                    Service Areas
                  </label>

                  {serviceAreas.length === 0 ? (
                    <p className="text-slate-500 mt-3">
                      No service areas available.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                      {serviceAreas.map((area) => (
                        <label
                          key={area._id}
                          className={`border rounded-xl p-3 cursor-pointer transition ${
                            formData.serviceAreas.includes(
                              area._id
                            )
                              ? "bg-yellow-50 border-yellow-400"
                              : "border-slate-200 hover:border-yellow-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.serviceAreas.includes(
                              area._id
                            )}
                            onChange={() =>
                              handleAreaChange(
                                area._id
                              )
                            }
                            className="mr-2"
                          />

                          {area.name}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIVE */}
                <label className="flex items-center justify-between bg-slate-100 rounded-2xl p-5 mt-7 cursor-pointer">
                  <div>
                    <p className="font-black">
                      Active Electrician
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Allow this electrician to be
                      used in the system.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                </label>

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-4 rounded-xl bg-slate-100 font-black"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-4 rounded-xl bg-yellow-400 text-slate-950 font-black hover:bg-yellow-300 disabled:opacity-50"
                  >
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

const ElectricianCard = ({
  electrician,
  updating,
  getImageUrl,
  onEdit,
  onDelete,
  onStatusChange,
  onActiveToggle,
}) => {
  const statusStyles = {
    available:
      "bg-green-100 text-green-700 border-green-200",

    busy:
      "bg-orange-100 text-orange-700 border-orange-200",

    "off-duty":
      "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-xl ${
        !electrician.isActive
          ? "opacity-60 border-red-200"
          : "border-slate-200"
      }`}
    >
      <div className="bg-slate-950 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-yellow-400 overflow-hidden flex items-center justify-center shrink-0">
            {electrician.photo ? (
              <img
                src={getImageUrl(
                  electrician.photo
                )}
                alt={electrician.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaBolt className="text-3xl text-slate-950" />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-white text-xl font-black truncate">
              {electrician.name}
            </h2>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full border text-xs font-black capitalize ${
                statusStyles[
                  electrician.availabilityStatus
                ] || statusStyles.available
              }`}
            >
              {electrician.availabilityStatus?.replace(
                "-",
                " "
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 text-sm">
          <InfoRow
            icon={<FaPhoneAlt />}
            value={electrician.mobileNumber}
          />

          <InfoRow
            icon={<FaWhatsapp />}
            value={electrician.whatsappNumber}
          />

          <InfoRow
            icon={<FaBriefcase />}
            value={`${electrician.yearsOfExperience || 0} years experience`}
          />

          <InfoRow
            icon={<FaMapMarkerAlt />}
            value={
              electrician.serviceAreas?.length
                ? electrician.serviceAreas
                    .map((area) => area.name)
                    .join(", ")
                : "No service areas"
            }
          />
        </div>

        {electrician.specialization?.length >
          0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {electrician.specialization.map(
              (item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold"
                >
                  {item}
                </span>
              )
            )}
          </div>
        )}

        <div className="mt-6">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Availability
          </label>

          <select
            value={
              electrician.availabilityStatus
            }
            disabled={updating}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-yellow-400 disabled:opacity-50"
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

        <div className="flex items-center justify-between mt-5 bg-slate-50 rounded-xl p-4">
          <span className="font-bold text-sm">
            {electrician.isActive
              ? "Active"
              : "Inactive"}
          </span>

          <button
            type="button"
            disabled={updating}
            onClick={onActiveToggle}
            className={`relative w-12 h-7 rounded-full transition ${
              electrician.isActive
                ? "bg-green-500"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${
                electrician.isActive
                  ? "left-6"
                  : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-black hover:bg-blue-600 hover:text-white transition"
          >
            <FaEdit />
            Edit
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={onDelete}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-black hover:bg-red-600 hover:text-white transition disabled:opacity-50"
          >
            <FaTrash />
            Delete
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
  <div
    className={`${className} rounded-3xl p-6 shadow-sm`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="opacity-80 font-bold">
          {title}
        </p>

        <p className="text-4xl font-black mt-3">
          {value}
        </p>
      </div>

      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
        {icon}
      </div>
    </div>
  </div>
);

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="font-bold text-slate-700">
      {label}
    </label>

    <input
      {...props}
      className="w-full mt-2 border border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-yellow-400"
    />
  </div>
);

const InfoRow = ({ icon, value }) => (
  <div className="flex items-start gap-3 text-slate-600">
    <span className="text-yellow-500 mt-0.5">
      {icon}
    </span>

    <span className="break-words">{value}</span>
  </div>
);

export default AdminElectricians;