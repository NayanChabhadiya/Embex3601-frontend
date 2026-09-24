import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createInventory as createInventoryService,
  getInventories as getInventoriesService,
  getInventoryById as getInventoryByIdService,
  updateInventory as updateInventoryService,
  deleteInventory as deleteInventoryService,
} from "../services/inventory.service.js";

/**
 * Create Inventory
 */
export const createInventory = createAsyncThunk(
  "inventory/createInventory",
  async (data, { rejectWithValue }) => {
    try {
      return await createInventoryService(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create inventory",
      );
    }
  },
);

/**
 * Get Inventories
 */
export const getInventories = createAsyncThunk(
  "inventory/getInventories",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getInventoriesService(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch inventories",
      );
    }
  },
);

/**
 * Get Inventory By ID
 */
export const getInventoryById = createAsyncThunk(
  "inventory/getInventoryById",
  async (id, { rejectWithValue }) => {
    try {
      return await getInventoryByIdService(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch inventory",
      );
    }
  },
);

/**
 * Update Inventory
 */
export const updateInventory = createAsyncThunk(
  "inventory/updateInventory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateInventoryService(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update inventory",
      );
    }
  },
);

/**
 * Delete Inventory
 */
export const deleteInventory = createAsyncThunk(
  "inventory/deleteInventory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteInventoryService(id);

      return {
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete inventory",
      );
    }
  },
);
