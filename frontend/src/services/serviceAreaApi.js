import api from "./api";

// Get all service areas including inactive (Admin)
export const getAllServiceAreas = async () => {
  const response = await api.get("/areas/admin/all");
  return response.data;
};

// Get active service areas (Public)
export const getServiceAreas = async () => {
  const response = await api.get("/areas");
  return response.data;
};

// Create new service area
export const createServiceArea = async (areaData) => {
  const response = await api.post("/areas", areaData);
  return response.data;
};

// Update service area
export const updateServiceArea = async (id, areaData) => {
  const response = await api.put(`/areas/${id}`, areaData);
  return response.data;
};

// Toggle active/inactive status
export const toggleServiceAreaStatus = async (id, isActive) => {
  const response = await api.put(`/areas/${id}`, {
    isActive,
  });

  return response.data;
};

// Delete service area
export const deleteServiceArea = async (id) => {
  const response = await api.delete(`/areas/${id}`);
  return response.data;
};