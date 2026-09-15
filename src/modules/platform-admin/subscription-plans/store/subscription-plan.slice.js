import { createSlice } from "@reduxjs/toolkit";

import { fetchSubscriptionPlans } from "./subscription-plan.thunks.js";

const initialState = Object.freeze({
  plans: [],
  meta: null,
  status: "idle",
  error: null,
  currentRequestId: null,
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
      });
  },
});

export const { resetSubscriptionPlans, clearSubscriptionPlanError } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
