import { createSlice } from "@reduxjs/toolkit";

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  updateSubscriptionPlan,
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

  updateStatus: "idle",
  updateError: null,
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
      });
  },
});

export const { resetSubscriptionPlans, clearSubscriptionPlanError } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
