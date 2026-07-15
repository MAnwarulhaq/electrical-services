import {
  FaBolt,
  FaPlus,
  FaEdit,
  FaTimes,
  FaSave,
  FaSpinner,
  FaLayerGroup,
  FaCheckCircle,
  FaImage,
  FaTag,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  FormSection,
  FormLabel,
  Input,
  Textarea,
  ModernCheckbox,
  inputClass,
} from "./FormComponents";

const ServiceModal = ({
  editingService,
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  submitting,
  onClose,
  onSubmit,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      setImagePreview(file ? URL.createObjectURL(file) : "");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm overflow-y-auto p-3 md:p-6"
      onClick={onClose}
    >
      <div
        className="max-w-5xl mx-auto my-4 md:my-8 bg-slate-50 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-950 p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold">
                {editingService ? <FaEdit /> : <FaPlus />}
                {editingService ? "Edit Service" : "Create Service"}
              </div>

              <h2 className="text-3xl font-black text-white mt-3">
                {editingService ? "Update Service" : "Add New Service"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 bg-white/10 text-white rounded-full flex items-center justify-center"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-5 md:p-8">
          <div className="grid xl:grid-cols-[1.5fr_0.8fr] gap-6">
            <div className="space-y-6">
              <FormSection
                title="Basic Information"
                description="Main information shown to customers."
                icon={<FaBolt />}
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
                    value={formData.startingPrice}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Estimated Time"
                    name="estimatedTime"
                    value={formData.estimatedTime}
                    onChange={handleChange}
                  />

                  <Input
                    label="Icon Name"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                  />

                  <div>
                    <FormLabel>Category</FormLabel>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="emergency">Emergency</option>
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
              </FormSection>

              <FormSection
                title="Description"
                description="Describe the electrical service."
                icon={<FaLayerGroup />}
              >
                <Textarea
                  label="Short Description"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows="3"
                />

                <div className="mt-5">
                  <Textarea
                    label="Full Description"
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    rows="6"
                  />
                </div>
              </FormSection>

              <FormSection
                title="What's Included"
                description="Write one item per line."
                icon={<FaCheckCircle />}
              >
                <Textarea
                  label="Included Items"
                  name="whatsIncluded"
                  value={formData.whatsIncluded}
                  onChange={handleChange}
                  rows="6"
                />
              </FormSection>
            </div>

            <div className="space-y-6">
              <FormSection
                title="Service Image"
                description="Upload an image."
                icon={<FaImage />}
              >
                <div className="h-56 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaImage className="text-5xl text-slate-300" />
                  )}
                </div>

                <label className="mt-4 flex justify-center gap-2 border rounded-xl p-3 font-bold cursor-pointer">
                  <FaImage />
                  Choose Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </FormSection>

              <FormSection
                title="Settings"
                description="Configure service options."
                icon={<FaTag />}
              >
                <div className="space-y-3">
                  <ModernCheckbox
                    name="isPopular"
                    checked={formData.isPopular}
                    onChange={handleChange}
                    title="Popular Service"
                    description="Highlight as popular."
                    icon={<FaStar />}
                    iconClass="bg-purple-100 text-purple-600"
                  />

                  <ModernCheckbox
                    name="isEmergency"
                    checked={formData.isEmergency}
                    onChange={handleChange}
                    title="Emergency Service"
                    description="Mark as emergency."
                    icon={<FaExclamationTriangle />}
                    iconClass="bg-red-100 text-red-600"
                  />
                </div>
              </FormSection>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-xl font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-yellow-400 text-slate-950 px-7 py-3 rounded-xl font-black flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {editingService ? "Update Service" : "Create Service"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;