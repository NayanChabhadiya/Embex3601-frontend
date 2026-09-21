import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceSubscriptionService from "../services/workspace-subscription.service.js";

// ============================================================
// GET ALL WORKSPACE SUBSCRIPTIONS
// ============================================================

export const fetchWorkspaceSubscriptions = createAsyncThunk(
  "workspaceSubscription/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceSubscriptionService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch workspace subscriptions.",
      );
    }
  },
);

// ============================================================
// GET WORKSPACE SUBSCRIPTION BY ID
// ============================================================

export const fetchWorkspaceSubscriptionById = createAsyncThunk(
  "workspaceSubscription/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceSubscriptionService.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch workspace subscription.",
      );
    }
  },
);

// ============================================================
// CREATE WORKSPACE SUBSCRIPTION
// ============================================================

export const createWorkspaceSubscription = createAsyncThunk(
  "workspaceSubscription/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await workspaceSubscriptionService.create(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to create workspace subscription.",
      );
    }
  },
);

// ============================================================
// UPDATE WORKSPACE SUBSCRIPTION
// ============================================================

export const updateWorkspaceSubscription = createAsyncThunk(
  "workspaceSubscription/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceSubscriptionService.update(id, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to update workspace subscription.",
      );
    }
  },
);

// ============================================================
// DELETE WORKSPACE SUBSCRIPTION
// ============================================================

export const deleteWorkspaceSubscription = createAsyncThunk(
  "workspaceSubscription/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceSubscriptionService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to delete workspace subscription.",
      );
    }
  },
);

