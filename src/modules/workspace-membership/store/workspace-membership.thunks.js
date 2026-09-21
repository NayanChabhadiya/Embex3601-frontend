import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceMembershipService from "../services/workspace-membership.service.js";

// ============================================================
// GET ALL WORKSPACE MEMBERSHIPS
// ============================================================

export const fetchWorkspaceMemberships = createAsyncThunk(
  "workspaceMembership/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceMembershipService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch workspace memberships.",
      );
    }
  },
);

// ============================================================
// GET WORKSPACE MEMBERSHIP BY ID
// ============================================================

export const fetchWorkspaceMembershipById = createAsyncThunk(
  "workspaceMembership/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceMembershipService.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch workspace membership.",
      );
    }
  },
);

// ============================================================
// CREATE WORKSPACE MEMBERSHIP
// ============================================================

export const createWorkspaceMembership = createAsyncThunk(
  "workspaceMembership/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await workspaceMembershipService.create(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create workspace membership.",
      );
    }
  },
);

// ============================================================
// UPDATE WORKSPACE MEMBERSHIP
// ============================================================

export const updateWorkspaceMembership = createAsyncThunk(
  "workspaceMembership/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceMembershipService.update(id, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update workspace membership.",
      );
    }
  },
);

// ============================================================
// DELETE WORKSPACE MEMBERSHIP
// ============================================================

export const deleteWorkspaceMembership = createAsyncThunk(
  "workspaceMembership/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceMembershipService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete workspace membership.",
      );
    }
  },
);
