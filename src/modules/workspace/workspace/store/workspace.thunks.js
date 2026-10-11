// =============================================================================
// Workspace Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import workspaceService from "../services/workspace.service.js";
import WORKSPACE_MESSAGES from "../constants/workspace.messages.js";

// =============================================================================
// Create Workspace
// =============================================================================

export const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  async (data, { rejectWithValue }) => {
    try {
      const response = await workspaceService.createWorkspace(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: WORKSPACE_MESSAGES.CREATE_FAILED,
        },
      );
    }
  },
);

// =============================================================================
// Get Workspaces
// =============================================================================

export const getWorkspaces = createAsyncThunk(
  "workspace/getWorkspaces",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await workspaceService.getWorkspaces(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: WORKSPACE_MESSAGES.LIST_FAILED,
        },
      );
    }
  },
);
