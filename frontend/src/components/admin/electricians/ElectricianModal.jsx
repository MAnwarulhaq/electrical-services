import {
  FaUser,
  FaTimes,
  FaSave,
  FaSpinner,
  FaImage,
  FaPhoneAlt,
  FaWhatsapp,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

import FormInput, { inputClass } from "./FormInput";

const ElectricianModal = ({
  editingElectrician,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  submitting,
  serviceAreas = [],
  onClose,
  onSubmit,
}) => {
  // Normal input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Image
    if (type === "file") {
      const file = files?.[0];

      if (!file) return;

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setImagePreview(URL.createObjectURL(file));
      return;
    }

    // Other inputs
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Select / Unselect service area
  const toggleServiceArea = (area) => {
    setFormData((prev) => {
      const currentAreas = Array.isArray(prev.serviceAreas)
        ? prev.serviceAreas
        : [];

      const alreadySelected = currentAreas.includes(area);

      return {
        ...prev,
        serviceAreas: alreadySelected
          ? currentAreas.filter((item) => item !== area)
          : [...currentAreas, area],
      };
    });
  };

  const selectedAreas = Array.isArray(formData.serviceAreas)
    ? formData.serviceAreas
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm overflow-y-auto p-3 md:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-5xl mx-auto my-4 md:my-8 bg-slate-50 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-slate-950 p-6 md:p-8 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-400/10 rounded-full" />

          <div className="relative flex items-start justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 text-yellow-400 font-bold">
                {editingElectrician ? <FaEdit /> : <FaPlus />}

                {editingElectrician
                  ? "Edit Electrician"
                  : "New Electrician"}
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white mt-3">
                {editingElectrician
                  ? "Update Electrician"
                  : "Add New Electrician"}
              </h2>

              <p className="text-slate-400 mt-2">
                Manage electrician profile, contact details and service areas.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="w-11 h-11 shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition disabled:opacity-50"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-5 md:p-8">
          <div className="grid xl:grid-cols-[1.4fr_0.8fr] gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                    <FaUser />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Personal Information
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Basic details about the electrician.
                    </p>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-5">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="Enter electrician name"
                    required
                  />

                  <FormInput
                    label="Experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={formData.experience ?? ""}
                    onChange={handleChange}
                    placeholder="Example: 5"
                    required
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <FaPhoneAlt />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Contact Details
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Mobile and WhatsApp contact information.
                    </p>
                  </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-5">
                  <div>
                    <FormInput
                      label="Mobile Number"
                      name="phone"
                      type="tel"
                      value={
                        formData.phone ||
                        formData.mobile ||
                        ""
                      }
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      required
                    />

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                      <FaPhoneAlt />
                      Primary contact number
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label="WhatsApp Number"
                      name="whatsapp"
                      type="tel"
                      value={formData.whatsapp || ""}
                      onChange={handleChange}
                      placeholder="923XX XXXXXXX"
                    />

                    <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                      <FaWhatsapp />
                      Prefer country code for WhatsApp
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-slate-900">
                      Service Areas
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Select areas where this electrician can work.
                    </p>
                  </div>

                  <span className="bg-slate-100 text-slate-600 text-xs font-black px-3 py-1.5 rounded-full">
                    {selectedAreas.length} Selected
                  </span>
                </div>

                <div className="p-5">
                  {serviceAreas.length > 0 ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {serviceAreas.map((area) => {
                        const areaName =
                          typeof area === "string"
                            ? area
                            : area.name;

                        const selected =
                          selectedAreas.includes(areaName);

                        return (
                          <button
                            key={area._id || areaName}
                            type="button"
                            onClick={() =>
                              toggleServiceArea(areaName)
                            }
                            className={`flex items-center justify-between gap-3 text-left border rounded-xl p-4 transition ${
                              selected
                                ? "border-yellow-400 bg-yellow-50 text-slate-900"
                                : "border-slate-200 bg-white text-slate-600 hover:border-yellow-300"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FaMapMarkerAlt
                                className={
                                  selected
                                    ? "text-yellow-500"
                                    : "text-slate-400"
                                }
                              />

                              <span className="text-sm font-bold truncate">
                                {areaName}
                              </span>
                            </div>

                            {selected && (
                              <FaCheckCircle className="shrink-0 text-yellow-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FaMapMarkerAlt className="text-4xl text-slate-300 mx-auto" />

                      <p className="text-slate-500 font-bold mt-3">
                        No service areas available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                    <FaImage />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Profile Image
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Upload electrician profile photo.
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="relative h-72 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Electrician Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <FaUser className="text-3xl text-slate-300" />
                        </div>

                        <p className="text-sm text-slate-400 mt-4">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <label className="mt-4 flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 rounded-xl p-4 font-black text-slate-700 cursor-pointer transition">
                    <FaImage />
                    {imagePreview
                      ? "Change Profile Image"
                      : "Choose Profile Image"}

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                    <FaCheckCircle />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Availability
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Set current working status.
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <label className="block text-sm font-black text-slate-700">
                    Current Status
                  </label>

                  <select
                    name="availabilityStatus"
                    value={
                      formData.availabilityStatus ||
                      formData.status ||
                      "available"
                    }
                    onChange={handleChange}
                    className={inputClass}
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
              </div>

              {/* Experience Summary */}
              <div className="bg-slate-950 rounded-2xl p-6 text-white">
                <div className="w-12 h-12 bg-yellow-400 text-slate-950 rounded-xl flex items-center justify-center text-xl">
                  <FaBriefcase />
                </div>

                <h3 className="font-black text-xl mt-5">
                  Electrician Profile
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mt-2">
                  Make sure contact details and service areas are correct before
                  saving the electrician profile.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-400">
                      Experience
                    </p>

                    <p className="font-black text-yellow-400 mt-1">
                      {formData.experience || 0} Years
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-slate-400">
                      Service Areas
                    </p>

                    <p className="font-black text-yellow-400 mt-1">
                      {selectedAreas.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-black transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-7 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />

                  {editingElectrician
                    ? "Update Electrician"
                    : "Add Electrician"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ElectricianModal;