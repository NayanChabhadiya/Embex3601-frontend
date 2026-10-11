// =============================================================================
// Workspace Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import { createWorkspace, getWorkspaces } from "./workspace.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listStatus: "idle",
  listError: null,

  createStatus: "idle",
  createError: null,
  createSuccess: false,
};

// =============================================================================
// Slice
// =============================================================================

const workspaceSlice = createSlice({
  name: "workspace",

  initialState,

  reducers: {
    clearWorkspaceCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.createSuccess = false;
    },

    clearWorkspaceListError: (state) => {
      state.listError = null;
    },

    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },

    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // Create Workspace - Pending
    // -------------------------------------------------------------------------

    builder.addCase(createWorkspace.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
      state.createSuccess = false;
    });

    // -------------------------------------------------------------------------
    // Create Workspace - Fulfilled
    // -------------------------------------------------------------------------

    builder.addCase(createWorkspace.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.createError = null;
      state.createSuccess = true;

      state.currentWorkspace = action.payload?.data || null;
    });

    // -------------------------------------------------------------------------
    // Create Workspace - Rejected
    // -------------------------------------------------------------------------

    builder.addCase(createWorkspace.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createSuccess = false;

      state.createError =
        action.payload?.message ||
        action.payload ||
        "Failed to create workspace.";
    });

    // -------------------------------------------------------------------------
    // Get Workspaces - Pending
    // -------------------------------------------------------------------------

    builder.addCase(getWorkspaces.pending, (state) => {
      state.listStatus = "loading";
      state.listError = null;
    });

    // -------------------------------------------------------------------------
    // Get Workspaces - Fulfilled
    // -------------------------------------------------------------------------

    builder.addCase(getWorkspaces.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.listError = null;

      state.workspaces = action.payload?.data || [];

      state.pagination = action.payload?.meta || state.pagination;
    });

    // -------------------------------------------------------------------------
    // Get Workspaces - Rejected
    // -------------------------------------------------------------------------

    builder.addCase(getWorkspaces.rejected, (state, action) => {
      state.listStatus = "failed";

      state.listError =
        action.payload?.message ||
        action.payload ||
        "Failed to fetch workspaces.";
    });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearWorkspaceCreateState,
  clearWorkspaceListError,
  setCurrentWorkspace,
  clearCurrentWorkspace,
} = workspaceSlice.actions;

// =============================================================================
// Export
// =============================================================================

export default workspaceSlice.reducer;
