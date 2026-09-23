import { createAsyncThunk } from "@reduxjs/toolkit";

import branchService from "../services/branch.service.js";

// ============================================================
// FETCH ALL BRANCHES
// ============================================================

export const fetchBranches = createAsyncThunk(
  "branch/fetchAll",

  async (companyId, { rejectWithValue }) => {
    try {
      const response = await branchService.getAll(companyId);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch branches.",
      );
    }
  },
);

// ============================================================
// FETCH BRANCH BY ID
// ============================================================

export const fetchBranchById = createAsyncThunk(
  "branch/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await branchService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch branch.",
      );
    }
  },
);

// ============================================================
// CREATE BRANCH
// ============================================================

export const createBranch = createAsyncThunk(
  "branch/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await branchService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create branch.",
      );
    }
  },
);

// ============================================================
// UPDATE BRANCH
// ============================================================

export const updateBranch = createAsyncThunk(
  "branch/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await branchService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update branch.",
      );
    }
  },
);

// ============================================================
// DELETE BRANCH
// ============================================================

export const deleteBranch = createAsyncThunk(
  "branch/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await branchService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete branch.",
      );
    }
  },
);
