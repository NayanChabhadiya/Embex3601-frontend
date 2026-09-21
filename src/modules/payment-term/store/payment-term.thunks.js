import { createAsyncThunk } from "@reduxjs/toolkit";

import paymentTermService from "../services/payment-term.service.js";

// ============================================================
// GET ALL PAYMENT TERMS
// ============================================================

export const fetchPaymentTerms = createAsyncThunk(
  "paymentTerm/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentTermService.getAll();

      return response.data;
    } catch (error) {
      console.error("FETCH PAYMENT TERMS ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch payment terms.",
      );
    }
  },
);

// ============================================================
// GET PAYMENT TERM BY ID
// ============================================================

export const fetchPaymentTermById = createAsyncThunk(
  "paymentTerm/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentTermService.getById(id);

      return response.data;
    } catch (error) {
      console.error("FETCH PAYMENT TERM ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch payment term.",
      );
    }
  },
);

// ============================================================
// CREATE PAYMENT TERM
// ============================================================

export const createPaymentTerm = createAsyncThunk(
  "paymentTerm/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await paymentTermService.create(payload);

      return response.data;
    } catch (error) {
      console.error("CREATE PAYMENT TERM ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to create payment term.",
      );
    }
  },
);

// ============================================================
// UPDATE PAYMENT TERM
// ============================================================

export const updatePaymentTerm = createAsyncThunk(
  "paymentTerm/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await paymentTermService.update(id, payload);

      return response.data;
    } catch (error) {
      console.error("UPDATE PAYMENT TERM ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to update payment term.",
      );
    }
  },
);

// ============================================================
// DELETE PAYMENT TERM
// ============================================================

export const deletePaymentTerm = createAsyncThunk(
  "paymentTerm/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await paymentTermService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error("DELETE PAYMENT TERM ERROR:", error);

      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete payment term.",
      );
    }
  },
);
