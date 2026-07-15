import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaPlus,
  FaRedoAlt,
  FaSpinner,
} from "react-icons/fa";

import api from "../services/api";

import ServiceCard from "../components/admin/services/ServiceCard";
import ServiceModal from "../components/admin/services/ServiceModal";
import ServiceStats from "../components/admin/services/ServiceStats";
import ServiceFilters from "../components/admin/services/ServiceFilters";
import Alert from "../components/admin/services/Alert";

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
  const [imagePreview, setImagePreview] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/services/admin/all");
      setServices(response.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openAddModal = () => {
    setEditingService(null);
    setFormData(initialForm);
    setImagePreview("");
    setShowModal(true);
  };

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

    setImagePreview(service.image?.url || service.image || "");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingService(null);
    setFormData(initialForm);
    setImagePreview("");
  };

  const buildFormData = () => {
    const data = new FormData();

    data.append("name", formData.name);
    data.append("shortDescription", formData.shortDescription);
    data.append("fullDescription", formData.fullDescription);
    data.append("icon", formData.icon);
    data.append("startingPrice", formData.startingPrice);
    data.append("estimatedTime", formData.estimatedTime);
    data.append("category", formData.category);
    data.append("isEmergency", String(formData.isEmergency));
    data.append("isPopular", String(formData.isPopular));
    data.append("displayOrder", String(formData.displayOrder));

    formData.whatsIncluded
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        data.append("whatsIncluded[]", item);
      });

    if (formData.image) {
      data.append("image", formData.image);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const data = buildFormData();

      if (editingService) {
        await api.put(`/services/${editingService._id}`, data);
        setSuccess("Service updated successfully.");
      } else {
        await api.post("/services", data);
        setSuccess("Service created successfully.");
      }

      closeModal();
      await fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (service) => {
    try {
      setUpdatingId(service._id);

      await api.patch(`/services/${service._id}/toggle`);

      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Delete "${service.name}"?`)) return;

    try {
      setUpdatingId(service._id);

      await api.delete(`/services/${service._id}`);

      setServices((prev) =>
        prev.filter((item) => item._id !== service._id)
      );

      setSuccess("Service deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete service."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredServices = useMemo(() => {
    const query = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        service.name?.toLowerCase().includes(query) ||
        service.shortDescription?.toLowerCase().includes(query);

      const matchesCategory =
        filterCategory === "all" ||
        service.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, filterCategory]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-slate-950 rounded-3xl p-6 md:p-10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-yellow-400 font-bold">
                <FaBolt />
                Service Management
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-4">
                Manage Your{" "}
                <span className="text-yellow-400">Services</span>
              </h1>

              <p className="text-slate-400 mt-3">
                Create, update and manage all electrical services.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchServices}
                className="bg-white/10 text-white px-5 py-3 rounded-xl flex items-center gap-2"
              >
                <FaRedoAlt />
                Refresh
              </button>

              <button
                onClick={openAddModal}
                className="bg-yellow-400 text-slate-950 px-6 py-3 rounded-xl font-black flex items-center gap-2"
              >
                <FaPlus />
                Add Service
              </button>
            </div>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        )}

        <ServiceStats services={services} />

        <ServiceFilters
          search={search}
          setSearch={setSearch}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filteredCount={filteredServices.length}
          totalCount={services.length}
        />

        {loading ? (
          <div className="py-20 text-center">
            <FaSpinner className="animate-spin text-4xl text-yellow-500 mx-auto" />
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
      </div>

      {showModal && (
        <ServiceModal
          editingService={editingService}
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          submitting={submitting}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AdminServices;