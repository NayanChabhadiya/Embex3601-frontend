import apiClient from "../../../services/api/apiClient.js";

// ============================================================
// GST SERVICE
// ============================================================

// CREATE
export const createGST = async (payload) => {
  const response = await apiClient.post("/gst", payload);

  return response.data;
};

// LIST
export const getGSTDocuments = async (params = {}) => {
  const response = await apiClient.get("/gst", {
    params,
  });

  return response.data;
};

// GET BY ID
export const getGSTById = async (id) => {
  const response = await apiClient.get(`/gst/${id}`);

  return response.data;
};

// UPDATE
export const updateGST = async (id, payload) => {
  const response = await apiClient.put(`/gst/${id}`, payload);

  return response.data;
};

// DELETE
export const deleteGST = async (id) => {
  const response = await apiClient.delete(`/gst/${id}`);

  return response.data;
};
