import { createSlice } from "@reduxjs/toolkit";

import {
  fetchBranches,
  fetchBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "./branch.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  branches: [],

  selectedBranch: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const branchSlice = createSlice({
  name: "branch",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearBranchError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED BRANCH
    // --------------------------------------------------------

    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },

    // --------------------------------------------------------
    // RESET STATE
    // --------------------------------------------------------

    resetBranchState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL BRANCHES
    // ========================================================

    builder
      .addCase(fetchBranches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.branches = action.payload || [];
      })

      .addCase(fetchBranches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch branches.";
      });

    // ========================================================
    // FETCH BRANCH BY ID
    // ========================================================

    builder
      .addCase(fetchBranchById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBranch = action.payload || null;
      })

      .addCase(fetchBranchById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch branch.";
      });

    // ========================================================
    // CREATE BRANCH
    // ========================================================

    builder
      .addCase(createBranch.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createBranch.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.branches.unshift(action.payload);
        }
      })

      .addCase(createBranch.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create branch.";
      });

    // ========================================================
    // UPDATE BRANCH
    // ========================================================

    builder
      .addCase(updateBranch.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateBranch.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedBranch = action.payload;

        if (!updatedBranch?._id) {
          return;
        }

        const index = state.branches.findIndex(
          (branch) => branch._id === updatedBranch._id,
        );

        if (index !== -1) {
          state.branches[index] = updatedBranch;
        }

        if (state.selectedBranch?._id === updatedBranch._id) {
          state.selectedBranch = updatedBranch;
        }
      })

      .addCase(updateBranch.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update branch.";
      });

    // ========================================================
    // DELETE BRANCH
    // ========================================================

    builder
      .addCase(deleteBranch.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.branches = state.branches.filter(
          (branch) => branch._id !== deletedId,
        );

        if (state.selectedBranch?._id === deletedId) {
          state.selectedBranch = null;
        }
      })

      .addCase(deleteBranch.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete branch.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearBranchError, clearSelectedBranch, resetBranchState } =
  branchSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default branchSlice.reducer;
