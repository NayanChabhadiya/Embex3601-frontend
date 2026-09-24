import apiClient from "../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../services/api/endpoints.js";

const { INVENTORIES } = API_ENDPOINTS;

/**
 * Create Inventory
 */
export const createInventory = async (data) => {
  const response = await apiClient.post(INVENTORIES.BASE, data);

  return response.data;
};

/**
 * Get Inventories
 */
export const getInventories = async (params = {}) => {
  const response = await apiClient.get(INVENTORIES.BASE, {
    params,
  });

  return response.data;
};

/**
 * Get Inventory By ID
 */
export const getInventoryById = async (id) => {
  const response = await apiClient.get(INVENTORIES.BY_ID(id));

  return response.data;
};

/**
 * Update Inventory
 */
export const updateInventory = async (id, data) => {
  const response = await apiClient.put(INVENTORIES.BY_ID(id), data);

  return response.data;
};

/**
 * Delete Inventory
 */
export const deleteInventory = async (id) => {
  const response = await apiClient.delete(INVENTORIES.BY_ID(id));

  return response.data;
};
