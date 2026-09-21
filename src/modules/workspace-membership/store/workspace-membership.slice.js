import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWorkspaceMemberships,
  fetchWorkspaceMembershipById,
  createWorkspaceMembership,
  updateWorkspaceMembership,
  deleteWorkspaceMembership,
} from "./workspace-membership.thunks.js";

const initialState = {
  memberships: [],
  selectedMembership: null,

  status: "idle",
  selectedStatus: "idle",
  mutationStatus: "idle",

  error: null,
};

const workspaceMembershipSlice = createSlice({
  name: "workspaceMembership",

  initialState,

  reducers: {
    clearWorkspaceMembershipError: (state) => {
      state.error = null;
    },

    clearSelectedWorkspaceMembership: (state) => {
      state.selectedMembership = null;
      state.selectedStatus = "idle";
    },

    resetWorkspaceMembershipState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // FETCH ALL
      // ======================================================

      .addCase(fetchWorkspaceMemberships.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaceMemberships.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.memberships = action.payload || [];

        state.error = null;
      })

      .addCase(fetchWorkspaceMemberships.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          action.payload || "Failed to fetch workspace memberships.";
      })

      // ======================================================
      // FETCH BY ID
      // ======================================================

      .addCase(fetchWorkspaceMembershipById.pending, (state) => {
        state.selectedStatus = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaceMembershipById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";

        state.selectedMembership = action.payload || null;

        state.error = null;
      })

      .addCase(fetchWorkspaceMembershipById.rejected, (state, action) => {
        state.selectedStatus = "failed";

        state.error = action.payload || "Failed to fetch workspace membership.";
      })

      // ======================================================
      // CREATE
      // ======================================================

      .addCase(createWorkspaceMembership.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(createWorkspaceMembership.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        if (action.payload) {
          state.memberships.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createWorkspaceMembership.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to create workspace membership.";
      })

      // ======================================================
      // UPDATE
      // ======================================================

      .addCase(updateWorkspaceMembership.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(updateWorkspaceMembership.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const updatedMembership = action.payload;

        if (!updatedMembership?._id) {
          return;
        }

        const index = state.memberships.findIndex(
          (membership) => membership._id === updatedMembership._id,
        );

        if (index !== -1) {
          state.memberships[index] = updatedMembership;
        }

        if (state.selectedMembership?._id === updatedMembership._id) {
          state.selectedMembership = updatedMembership;
        }

        state.error = null;
      })

      .addCase(updateWorkspaceMembership.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to update workspace membership.";
      })

      // ======================================================
      // DELETE
      // ======================================================

      .addCase(deleteWorkspaceMembership.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(deleteWorkspaceMembership.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (deletedId) {
          state.memberships = state.memberships.filter(
            (membership) => membership._id !== deletedId,
          );

          if (state.selectedMembership?._id === deletedId) {
            state.selectedMembership = null;
          }
        }

        state.error = null;
      })

      .addCase(deleteWorkspaceMembership.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to delete workspace membership.";
      });
  },
});

export const {
  clearWorkspaceMembershipError,
  clearSelectedWorkspaceMembership,
  resetWorkspaceMembershipState,
} = workspaceMembershipSlice.actions;

export default workspaceMembershipSlice.reducer;
