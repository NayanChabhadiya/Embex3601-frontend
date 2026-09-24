import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createPurchase as createPurchaseService,
  getPurchases as getPurchasesService,
  getPurchaseById as getPurchaseByIdService,
  updatePurchase as updatePurchaseService,
  deletePurchase as deletePurchaseService,
} from "../services/purchase.service.js";

// ============================================================
// CREATE
// ============================================================

export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",

  async (data, { rejectWithValue }) => {
    try {
      return await createPurchaseService(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create purchase",
      );
    }
  },
);

// ============================================================
// GET ALL
// ============================================================

export const getPurchases = createAsyncThunk(
  "purchase/getPurchases",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await getPurchasesService(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch purchases",
      );
    }
  },
);

// ============================================================
// GET BY ID
// ============================================================

export const getPurchaseById = createAsyncThunk(
  "purchase/getPurchaseById",

  async (id, { rejectWithValue }) => {
    try {
      return await getPurchaseByIdService(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch purchase",
      );
    }
  },
);

// ============================================================
// UPDATE
// ============================================================

export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",

  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updatePurchaseService(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update purchase",
      );
    }
  },
);

// ============================================================
// DELETE
// ============================================================

export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",

  async (id, { rejectWithValue }) => {
    try {
      await deletePurchaseService(id);

      return {
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete purchase",
      );
    }
  },
);
