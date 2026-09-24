import { createAsyncThunk } from "@reduxjs/toolkit";

import salesService from "../services/sales.service.js";

// ============================================================
// CREATE SALES
// ============================================================

export const createSales = createAsyncThunk(
  "sales/createSales",
  async (payload, { rejectWithValue }) => {
    try {
      return await salesService.createSales(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create sales.",
      );
    }
  },
);

// ============================================================
// GET SALES
// ============================================================

export const getSales = createAsyncThunk(
  "sales/getSales",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await salesService.getSales(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch sales.",
      );
    }
  },
);

// ============================================================
// GET SALES BY ID
// ============================================================

export const getSalesById = createAsyncThunk(
  "sales/getSalesById",
  async (id, { rejectWithValue }) => {
    try {
      return await salesService.getSalesById(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch sales.",
      );
    }
  },
);

// ============================================================
// UPDATE SALES
// ============================================================

export const updateSales = createAsyncThunk(
  "sales/updateSales",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await salesService.updateSales(id, payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update sales.",
      );
    }
  },
);

// ============================================================
// DELETE SALES
// ============================================================

export const deleteSales = createAsyncThunk(
  "sales/deleteSales",
  async (id, { rejectWithValue }) => {
    try {
      return await salesService.deleteSales(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete sales.",
      );
    }
  },
);
