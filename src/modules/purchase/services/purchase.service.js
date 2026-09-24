import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const { PURCHASES } = API_ENDPOINTS;

// ============================================================
// CREATE
// ============================================================

export const createPurchase = async (data) => {
  const response = await apiClient.post(PURCHASES.BASE, data);

  return response.data;
};

// ============================================================
// GET ALL
// ============================================================

export const getPurchases = async (params = {}) => {
  const response = await apiClient.get(PURCHASES.BASE, {
    params,
  });

  return response.data;
};

// ============================================================
// GET BY ID
// ============================================================

export const getPurchaseById = async (id) => {
  const response = await apiClient.get(PURCHASES.BY_ID(id));

  return response.data;
};

// ============================================================
// UPDATE
// ============================================================

export const updatePurchase = async (id, data) => {
  const response = await apiClient.put(PURCHASES.BY_ID(id), data);

  return response.data;
};

// ============================================================
// DELETE
// ============================================================

export const deletePurchase = async (id) => {
  const response = await apiClient.delete(PURCHASES.BY_ID(id));

  return response.data;
};
