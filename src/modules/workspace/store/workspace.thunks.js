import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceService from "../services/workspace.service.js";

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch workspaces.",
      );
    }
  },
);

export const fetchWorkspaceById = createAsyncThunk(
  "workspace/fetchWorkspaceById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getById(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch workspace.",
      );
    }
  },
);

export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await workspaceService.create(payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create workspace.",
      );
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspace/updateWorkspace",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await workspaceService.update(id, payload);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update workspace.",
      );
    }
  },
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/deleteWorkspace",
  async (id, { rejectWithValue }) => {
    try {
      const response = await workspaceService.delete(id);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete workspace.",
      );
    }
  },
);
