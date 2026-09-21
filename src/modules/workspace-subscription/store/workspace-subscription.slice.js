import { createSlice } from "@reduxjs/toolkit";

import {
  fetchWorkspaceSubscriptions,
  fetchWorkspaceSubscriptionById,
  createWorkspaceSubscription,
  updateWorkspaceSubscription,
  deleteWorkspaceSubscription,
} from "./workspace-subscription.thunks.js";

const initialState = {
  subscriptions: [],
  selectedSubscription: null,

  status: "idle",
  selectedStatus: "idle",
  mutationStatus: "idle",

  error: null,
};

const workspaceSubscriptionSlice = createSlice({
  name: "workspaceSubscription",

  initialState,

  reducers: {
    clearWorkspaceSubscriptionError: (state) => {
      state.error = null;
    },

    clearSelectedWorkspaceSubscription: (state) => {
      state.selectedSubscription = null;
      state.selectedStatus = "idle";
    },

    resetWorkspaceSubscriptionState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================================
      // FETCH ALL
      // ======================================================

      .addCase(fetchWorkspaceSubscriptions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaceSubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.subscriptions = action.payload || [];

        state.error = null;
      })

      .addCase(fetchWorkspaceSubscriptions.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          action.payload || "Failed to fetch workspace subscriptions.";
      })

      // ======================================================
      // FETCH BY ID
      // ======================================================

      .addCase(fetchWorkspaceSubscriptionById.pending, (state) => {
        state.selectedStatus = "loading";
        state.error = null;
      })

      .addCase(fetchWorkspaceSubscriptionById.fulfilled, (state, action) => {
        state.selectedStatus = "succeeded";

        state.selectedSubscription = action.payload || null;

        state.error = null;
      })

      .addCase(fetchWorkspaceSubscriptionById.rejected, (state, action) => {
        state.selectedStatus = "failed";

        state.error =
          action.payload || "Failed to fetch workspace subscription.";
      })

      // ======================================================
      // CREATE
      // ======================================================

      .addCase(createWorkspaceSubscription.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(createWorkspaceSubscription.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        if (action.payload) {
          state.subscriptions.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createWorkspaceSubscription.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to create workspace subscription.";
      })

      // ======================================================
      // UPDATE
      // ======================================================

      .addCase(updateWorkspaceSubscription.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(updateWorkspaceSubscription.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const updatedSubscription = action.payload;

        if (!updatedSubscription?._id) {
          return;
        }

        const index = state.subscriptions.findIndex(
          (subscription) => subscription._id === updatedSubscription._id,
        );

        if (index !== -1) {
          state.subscriptions[index] = updatedSubscription;
        }

        if (state.selectedSubscription?._id === updatedSubscription._id) {
          state.selectedSubscription = updatedSubscription;
        }

        state.error = null;
      })

      .addCase(updateWorkspaceSubscription.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to update workspace subscription.";
      })

      // ======================================================
      // DELETE
      // ======================================================

      .addCase(deleteWorkspaceSubscription.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(deleteWorkspaceSubscription.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (deletedId) {
          state.subscriptions = state.subscriptions.filter(
            (subscription) => subscription._id !== deletedId,
          );

          if (state.selectedSubscription?._id === deletedId) {
            state.selectedSubscription = null;
          }
        }

        state.error = null;
      })

      .addCase(deleteWorkspaceSubscription.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to delete workspace subscription.";
      });
  },
});

export const {
  clearWorkspaceSubscriptionError,
  clearSelectedWorkspaceSubscription,
  resetWorkspaceSubscriptionState,
} = workspaceSubscriptionSlice.actions;

export default workspaceSubscriptionSlice.reducer;
