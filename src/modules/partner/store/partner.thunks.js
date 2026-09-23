import { createAsyncThunk } from "@reduxjs/toolkit";
import partnerService from "../services/partner.service.js";

// ============================================================
// FETCH ALL PARTNERS
// ============================================================

export const fetchPartners = createAsyncThunk(
  "partner/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await partnerService.getAll(params);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch partners.",
      );
    }
  },
);

// ============================================================
// FETCH PARTNER BY ID
// ============================================================

export const fetchPartnerById = createAsyncThunk(
  "partner/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await partnerService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch partner.",
      );
    }
  },
);

// ============================================================
// CREATE PARTNER
// ============================================================

export const createPartner = createAsyncThunk(
  "partner/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await partnerService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create partner.",
      );
    }
  },
);

// ============================================================
// UPDATE PARTNER
// ============================================================

export const updatePartner = createAsyncThunk(
  "partner/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await partnerService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update partner.",
      );
    }
  },
);

// ============================================================
// DELETE PARTNER
// ============================================================

export const deletePartner = createAsyncThunk(
  "partner/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await partnerService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete partner.",
      );
    }
  },
);
