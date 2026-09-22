import { createAsyncThunk } from "@reduxjs/toolkit";

import partnerCategoryService from "../services/partner-category.service.js";

// ============================================================
// GET ALL PARTNER CATEGORIES
// ============================================================

export const fetchPartnerCategories = createAsyncThunk(
  "partnerCategory/fetchPartnerCategories",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await partnerCategoryService.getAll(workspaceId);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch partner categories.",
      );
    }
  },
);

// ============================================================
// GET PARTNER CATEGORY BY ID
// ============================================================

export const fetchPartnerCategoryById = createAsyncThunk(
  "partnerCategory/fetchPartnerCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await partnerCategoryService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch partner category.",
      );
    }
  },
);

// ============================================================
// CREATE PARTNER CATEGORY
// ============================================================

export const createPartnerCategory = createAsyncThunk(
  "partnerCategory/createPartnerCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await partnerCategoryService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create partner category.",
      );
    }
  },
);

// ============================================================
// UPDATE PARTNER CATEGORY
// ============================================================

export const updatePartnerCategory = createAsyncThunk(
  "partnerCategory/updatePartnerCategory",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await partnerCategoryService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update partner category.",
      );
    }
  },
);

// ============================================================
// DELETE PARTNER CATEGORY
// ============================================================

export const deletePartnerCategory = createAsyncThunk(
  "partnerCategory/deletePartnerCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await partnerCategoryService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete partner category.",
      );
    }
  },
);
