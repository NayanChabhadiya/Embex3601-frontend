import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWorkspaces,
  fetchWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "./workspace.thunks.js";

const initialState = {
  workspaces: [],
  selectedWorkspace: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",

  initialState,

  reducers: {
    // --------------------------------------------------
    // Set Selected Workspace
    // --------------------------------------------------
    setSelectedWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload || null;
    },

    // --------------------------------------------------
    // Clear Workspace Error
    // --------------------------------------------------
    clearWorkspaceError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------
    // Clear Selected Workspace
    // --------------------------------------------------
    clearSelectedWorkspace: (state) => {
      state.selectedWorkspace = null;
    },

    // --------------------------------------------------
    // Reset Workspace State
    // --------------------------------------------------
    resetWorkspaceState: () => initialState,
  },

  extraReducers: (builder) => {
    // --------------------------------------------------
    // Fetch Workspaces
    // --------------------------------------------------

    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.workspaces = action.payload || [];
      })

      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch workspaces.";
      });

    // --------------------------------------------------
    // Fetch Workspace By ID
    // --------------------------------------------------

    builder
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedWorkspace = action.payload || null;
      })

      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch workspace.";
      });

    // --------------------------------------------------
    // Create Workspace
    // --------------------------------------------------

    builder
      .addCase(createWorkspace.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.workspaces.unshift(action.payload);
        }
      })

      .addCase(createWorkspace.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create workspace.";
      });

    // --------------------------------------------------
    // Update Workspace
    // --------------------------------------------------

    builder
      .addCase(updateWorkspace.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedWorkspace = action.payload;

        if (!updatedWorkspace?._id) {
          return;
        }

        const index = state.workspaces.findIndex(
          (workspace) => workspace._id === updatedWorkspace._id,
        );

        if (index !== -1) {
          state.workspaces[index] = updatedWorkspace;
        }

        if (state.selectedWorkspace?._id === updatedWorkspace._id) {
          state.selectedWorkspace = updatedWorkspace;
        }
      })

      .addCase(updateWorkspace.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update workspace.";
      });

    // --------------------------------------------------
    // Delete Workspace
    // --------------------------------------------------

    builder
      .addCase(deleteWorkspace.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.workspaces = state.workspaces.filter(
          (workspace) => workspace._id !== deletedId,
        );

        if (state.selectedWorkspace?._id === deletedId) {
          state.selectedWorkspace = null;
        }
      })

      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete workspace.";
      });
  },
});

export const {
  setSelectedWorkspace,
  clearWorkspaceError,
  clearSelectedWorkspace,
  resetWorkspaceState,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
