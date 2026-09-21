import { createAsyncThunk } from "@reduxjs/toolkit";

import bankService from "../services/bank.service.js";

// ============================================================
// GET ALL BANKS
// ============================================================

export const fetchBanks = createAsyncThunk(
  "bank/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankService.getAll();

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("FETCH BANKS ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch banks.",
      );
    }
  },
);

// ============================================================
// GET BANK BY ID
// ============================================================

export const fetchBankById = createAsyncThunk(
  "bank/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bankService.getById(id);

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("FETCH BANK BY ID ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch bank.",
      );
    }
  },
);

// ============================================================
// CREATE BANK
// ============================================================

export const createBank = createAsyncThunk(
  "bank/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await bankService.create(payload);

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("CREATE BANK ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to create bank.",
      );
    }
  },
);

// ============================================================
// UPDATE BANK
// ============================================================

export const updateBank = createAsyncThunk(
  "bank/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await bankService.update(id, payload);

      return response.data?.data ?? response.data;
    } catch (error) {
      console.error("UPDATE BANK ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to update bank.",
      );
    }
  },
);

// ============================================================
// DELETE BANK
// ============================================================

export const deleteBank = createAsyncThunk(
  "bank/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bankService.delete(id);

      return {
        id,
        ...(response.data?.data ?? response.data ?? {}),
      };
    } catch (error) {
      console.error("DELETE BANK ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete bank.",
      );
    }
  },
);
