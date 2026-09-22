import { createAsyncThunk } from "@reduxjs/toolkit";

import companyService from "../services/company.service.js";

// ============================================================
// FETCH ALL COMPANIES
// ============================================================

export const fetchCompanies = createAsyncThunk(
  "company/fetchAll",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await companyService.getAll(workspaceId);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch companies.",
      );
    }
  },
);

// ============================================================
// FETCH COMPANY BY ID
// ============================================================

export const fetchCompanyById = createAsyncThunk(
  "company/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch company.",
      );
    }
  },
);

// ============================================================
// CREATE COMPANY
// ============================================================

export const createCompany = createAsyncThunk(
  "company/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await companyService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create company.",
      );
    }
  },
);

// ============================================================
// UPDATE COMPANY
// ============================================================

export const updateCompany = createAsyncThunk(
  "company/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await companyService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update company.",
      );
    }
  },
);

// ============================================================
// DELETE COMPANY
// ============================================================

export const deleteCompany = createAsyncThunk(
  "company/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await companyService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete company.",
      );
    }
  },
);
