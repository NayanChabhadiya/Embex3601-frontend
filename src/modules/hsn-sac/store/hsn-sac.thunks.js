import { createAsyncThunk } from "@reduxjs/toolkit";

import hsnSacService from "../services/hsn-sac.service.js";

// ============================================================
// GET ALL HSN / SAC
// ============================================================

export const fetchHsnSac = createAsyncThunk(
  "hsnSac/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await hsnSacService.getAll();

      return response.data;
    } catch (error) {
      console.error("FETCH HSN/SAC ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch HSN/SAC.",
      );
    }
  },
);

// ============================================================
// GET HSN / SAC BY ID
// ============================================================

export const fetchHsnSacById = createAsyncThunk(
  "hsnSac/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await hsnSacService.getById(id);

      return response.data;
    } catch (error) {
      console.error("FETCH HSN/SAC BY ID ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch HSN/SAC.",
      );
    }
  },
);

// ============================================================
// CREATE HSN / SAC
// ============================================================

export const createHsnSac = createAsyncThunk(
  "hsnSac/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await hsnSacService.create(payload);

      return response.data;
    } catch (error) {
      console.error("CREATE HSN/SAC ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to create HSN/SAC.",
      );
    }
  },
);

// ============================================================
// UPDATE HSN / SAC
// ============================================================

export const updateHsnSac = createAsyncThunk(
  "hsnSac/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await hsnSacService.update(id, payload);

      return response.data;
    } catch (error) {
      console.error("UPDATE HSN/SAC ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to update HSN/SAC.",
      );
    }
  },
);

// ============================================================
// DELETE HSN / SAC
// ============================================================

export const deleteHsnSac = createAsyncThunk(
  "hsnSac/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await hsnSacService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error("DELETE HSN/SAC ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete HSN/SAC.",
      );
    }
  },
);
