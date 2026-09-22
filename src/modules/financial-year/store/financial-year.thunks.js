import { createAsyncThunk } from "@reduxjs/toolkit";

import financialYearService from "../services/financial-year.service.js";

// ============================================================
// FETCH ALL FINANCIAL YEARS
// ============================================================

export const fetchFinancialYears = createAsyncThunk(
  "financialYear/fetchAll",

  async ({ workspaceId, companyId } = {}, { rejectWithValue }) => {
    try {
      const response = await financialYearService.getAll(
        workspaceId,
        companyId,
      );

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch financial years.",
      );
    }
  },
);

// ============================================================
// FETCH FINANCIAL YEAR BY ID
// ============================================================

export const fetchFinancialYearById = createAsyncThunk(
  "financialYear/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await financialYearService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch financial year.",
      );
    }
  },
);

// ============================================================
// CREATE FINANCIAL YEAR
// ============================================================

export const createFinancialYear = createAsyncThunk(
  "financialYear/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await financialYearService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create financial year.",
      );
    }
  },
);

// ============================================================
// UPDATE FINANCIAL YEAR
// ============================================================

export const updateFinancialYear = createAsyncThunk(
  "financialYear/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await financialYearService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update financial year.",
      );
    }
  },
);

// ============================================================
// DELETE FINANCIAL YEAR
// ============================================================

export const deleteFinancialYear = createAsyncThunk(
  "financialYear/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await financialYearService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete financial year.",
      );
    }
  },
);
