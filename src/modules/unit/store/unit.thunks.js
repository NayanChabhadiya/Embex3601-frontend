import { createAsyncThunk } from "@reduxjs/toolkit";

import unitService from "../services/unit.service.js";

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
// GET ALL UNITS
// ============================================================

export const fetchUnits = createAsyncThunk(
  "unit/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await unitService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch units."));
    }
  },
);

// ============================================================
// GET UNIT BY ID
// ============================================================

export const fetchUnitById = createAsyncThunk(
  "unit/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await unitService.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch unit."));
    }
  },
);

// ============================================================
// CREATE UNIT
// ============================================================

export const createUnit = createAsyncThunk(
  "unit/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await unitService.create(payload);

      return response.data;
    } catch (error) {
      console.error("CREATE UNIT ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to create unit."));
    }
  },
);

// ============================================================
// UPDATE UNIT
// ============================================================

export const updateUnit = createAsyncThunk(
  "unit/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await unitService.update(id, payload);

      return response.data;
    } catch (error) {
      console.error("UPDATE UNIT ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to update unit."));
    }
  },
);

// ============================================================
// DELETE UNIT
// ============================================================

export const deleteUnit = createAsyncThunk(
  "unit/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await unitService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error("DELETE UNIT ERROR:", error);

      return rejectWithValue(getErrorMessage(error, "Failed to delete unit."));
    }
  },
);
