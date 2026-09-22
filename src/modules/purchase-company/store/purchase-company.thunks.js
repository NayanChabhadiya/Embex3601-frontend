import { createAsyncThunk } from "@reduxjs/toolkit";

import purchaseCompanyService from "../services/purchase-company.service.js";

// ============================================================
// FETCH ALL PURCHASE COMPANIES
// ============================================================

export const fetchPurchaseCompanies = createAsyncThunk(
  "purchaseCompany/fetchAll",

  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await purchaseCompanyService.getAll(workspaceId);
      console.log(response);
      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to fetch purchase companies.",
      );
    }
  },
);

// ============================================================
// FETCH PURCHASE COMPANY BY ID
// ============================================================

export const fetchPurchaseCompanyById = createAsyncThunk(
  "purchaseCompany/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseCompanyService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to fetch purchase company.",
      );
    }
  },
);

// ============================================================
// CREATE PURCHASE COMPANY
// ============================================================

export const createPurchaseCompany = createAsyncThunk(
  "purchaseCompany/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await purchaseCompanyService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to create purchase company.",
      );
    }
  },
);

// ============================================================
// UPDATE PURCHASE COMPANY
// ============================================================

export const updatePurchaseCompany = createAsyncThunk(
  "purchaseCompany/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await purchaseCompanyService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to update purchase company.",
      );
    }
  },
);

// ============================================================
// DELETE PURCHASE COMPANY
// ============================================================

export const deletePurchaseCompany = createAsyncThunk(
  "purchaseCompany/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await purchaseCompanyService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to delete purchase company.",
      );
    }
  },
);
