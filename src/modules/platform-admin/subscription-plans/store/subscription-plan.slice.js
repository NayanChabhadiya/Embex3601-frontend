import { createSlice } from "@reduxjs/toolkit";

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  activateSubscriptionPlan,
  deactivateSubscriptionPlan,
  deleteSubscriptionPlan,
  restoreSubscriptionPlan,
} from "./subscription-plan.thunks.js";

const initialState = Object.freeze({
  plans: [],
  meta: null,
  status: "idle",
  error: null,
  currentRequestId: null,

  selectedPlan: null,
  selectedPlanStatus: "idle",
  selectedPlanError: null,

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  activateStatus: "idle",
  activateError: null,

  deactivateStatus: "idle",
  deactivateError: null,

  deleteStatus: "idle",
  deleteError: null,

  restoreStatus: "idle",
  restoreError: null,
});

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlans",
  initialState,
  reducers: {
    resetSubscriptionPlans(state) {
      state.plans = [];
      state.meta = null;
      state.status = "idle";
      state.error = null;
      state.currentRequestId = null;

      state.selectedPlan = null;
      state.selectedPlanStatus = "idle";
      state.selectedPlanError = null;

      state.createStatus = "idle";
      state.createError = null;

      state.updateStatus = "idle";
      state.updateError = null;

      state.activateStatus = "idle";
      state.activateError = null;

      state.deactivateStatus = "idle";
      state.deactivateError = null;

      state.deleteStatus = "idle";
      state.deleteError = null;

      state.restoreStatus = "idle";
      state.restoreError = null;
    },

    clearSubscriptionPlanError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })

      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";
        state.plans = action.payload?.plans ?? [];
        state.meta = action.payload?.meta ?? null;
        state.error = null;
        state.currentRequestId = null;
      })

      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "failed";
        state.plans = [];
        state.meta = null;
        state.error = action.payload ?? "Unable to fetch subscription plans.";
        state.currentRequestId = null;
      })

      .addCase(fetchSubscriptionPlanById.pending, (state) => {
        state.selectedPlanStatus = "loading";
        state.selectedPlanError = null;
      })
      .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
        state.selectedPlanStatus = "succeeded";
        state.selectedPlan = action.payload ?? null;
        state.selectedPlanError = null;
      })
      .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
        state.selectedPlanStatus = "failed";
        state.selectedPlan = null;
        state.selectedPlanError =
          action.payload ?? "Unable to fetch subscription plan.";
      })
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;

        if (action.payload) {
          state.plans.unshift(action.payload);
        }
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload ?? "Unable to create subscription plan.";
      })

      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;

        if (action.payload) {
          state.selectedPlan = action.payload;
        }
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          action.payload ?? "Unable to update subscription plan.";
      })

      .addCase(activateSubscriptionPlan.pending, (state) => {
        state.activateStatus = "loading";
        state.activateError = null;
      })
      .addCase(activateSubscriptionPlan.fulfilled, (state, action) => {
        state.activateStatus = "succeeded";
        state.activateError = null;

        if (action.payload) {
          state.selectedPlan = action.payload;

          const index = state.plans.findIndex(
            (plan) => plan._id === action.payload._id,
          );

          if (index !== -1) {
            state.plans[index] = action.payload;
          }
        }
      })
      .addCase(activateSubscriptionPlan.rejected, (state, action) => {
        state.activateStatus = "failed";
        state.activateError =
          action.payload ?? "Unable to activate subscription plan.";
      })

      .addCase(deactivateSubscriptionPlan.pending, (state) => {
        state.deactivateStatus = "loading";
        state.deactivateError = null;
      })
      .addCase(deactivateSubscriptionPlan.fulfilled, (state, action) => {
        state.deactivateStatus = "succeeded";
        state.deactivateError = null;

        if (action.payload) {
          state.selectedPlan = action.payload;

          const index = state.plans.findIndex(
            (plan) => plan._id === action.payload._id,
          );

          if (index !== -1) {
            state.plans[index] = action.payload;
          }
        }
      })
      .addCase(deactivateSubscriptionPlan.rejected, (state, action) => {
        state.deactivateStatus = "failed";
        state.deactivateError =
          action.payload ?? "Unable to deactivate subscription plan.";
      })

      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteError = null;

        state.plans = state.plans.filter(
          (plan) => plan._id !== action.payload?.id,
        );

        if (state.selectedPlan?._id === action.payload?.id) {
          state.selectedPlan = null;
        }
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          action.payload ?? "Unable to delete subscription plan.";
      })

      .addCase(restoreSubscriptionPlan.pending, (state) => {
        state.restoreStatus = "loading";
        state.restoreError = null;
      })
      .addCase(restoreSubscriptionPlan.fulfilled, (state, action) => {
        state.restoreStatus = "succeeded";
        state.restoreError = null;

        if (action.payload) {
          state.selectedPlan = action.payload;

          const index = state.plans.findIndex(
            (plan) => plan._id === action.payload._id,
          );

          if (index !== -1) {
            state.plans[index] = action.payload;
          } else {
            state.plans.unshift(action.payload);
          }
        }
      })
      .addCase(restoreSubscriptionPlan.rejected, (state, action) => {
        state.restoreStatus = "failed";
        state.restoreError =
          action.payload ?? "Unable to restore subscription plan.";
      });
  },
});

export const { resetSubscriptionPlans, clearSubscriptionPlanError } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
