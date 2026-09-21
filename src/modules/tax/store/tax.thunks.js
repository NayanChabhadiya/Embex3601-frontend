import { createAsyncThunk } from "@reduxjs/toolkit";

import taxService from "../services/tax.service.js";

// ============================================================
// ERROR MESSAGE HELPER
// ============================================================

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallbackMessage
  );
};

// ============================================================
// GET ALL TAXES
// ============================================================

export const fetchTaxes = createAsyncThunk(
  "tax/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await taxService.getAll();

      return response.data;
    } catch (error) {
      console.error("FETCH TAXES ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to fetch taxes."));
    }
  },
);

// ============================================================
// GET TAX BY ID
// ============================================================

export const fetchTaxById = createAsyncThunk(
  "tax/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await taxService.getById(id);

      return response.data;
    } catch (error) {
      console.error("FETCH TAX ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to fetch tax."));
    }
  },
);

// ============================================================
// CREATE TAX
// ============================================================

export const createTax = createAsyncThunk(
  "tax/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await taxService.create(payload);

      return response.data;
    } catch (error) {
      console.error("CREATE TAX ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to create tax."));
    }
  },
);

// ============================================================
// UPDATE TAX
// ============================================================

export const updateTax = createAsyncThunk(
  "tax/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await taxService.update(id, payload);

      return response.data;
    } catch (error) {
      console.error("UPDATE TAX ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to update tax."));
    }
  },
);

// ============================================================
// DELETE TAX
// ============================================================

export const deleteTax = createAsyncThunk(
  "tax/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await taxService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error("DELETE TAX ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to delete tax."));
    }
  },
);
