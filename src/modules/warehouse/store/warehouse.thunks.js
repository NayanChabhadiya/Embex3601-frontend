import { createAsyncThunk } from "@reduxjs/toolkit";

import warehouseService from "../services/warehouse.service";

/**
 * Get all warehouses
 *
 * Optional filters:
 * - companyId
 * - branchId
 * - status
 * - isDeleted
 */
export const fetchWarehouses = createAsyncThunk(
  "warehouse/fetchWarehouses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getAll(params);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch warehouses",
      );
    }
  },
);

/**
 * Get warehouse by ID
 */
export const fetchWarehouseById = createAsyncThunk(
  "warehouse/fetchWarehouseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getById(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch warehouse",
      );
    }
  },
);

/**
 * Create warehouse
 *
 * Expected payload:
 * {
 *   companyId,
 *   branchId,
 *   name,
 *   code,
 *   description,
 *   address,
 *   city,
 *   state,
 *   country,
 *   pincode,
 *   isDefault,
 *   status
 * }
 */
export const createWarehouse = createAsyncThunk(
  "warehouse/createWarehouse",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await warehouseService.create(payload);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create warehouse",
      );
    }
  },
);

/**
 * Update warehouse
 */
export const updateWarehouse = createAsyncThunk(
  "warehouse/updateWarehouse",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.update(id, data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update warehouse",
      );
    }
  },
);

/**
 * Delete warehouse
 */
export const deleteWarehouse = createAsyncThunk(
  "warehouse/deleteWarehouse",
  async (id, { rejectWithValue }) => {
    try {
      const response = await warehouseService.delete(id);

      return {
        id,
        response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete warehouse",
      );
    }
  },
);
