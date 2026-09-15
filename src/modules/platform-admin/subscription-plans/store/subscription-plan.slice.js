import { createSlice } from "@reduxjs/toolkit";

import { fetchSubscriptionPlans } from "./subscription-plan.thunks.js";

const initialState = Object.freeze({
  plans: [],
  meta: null,
  status: "idle",
  error: null,
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
    },

    clearSubscriptionPlanError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload?.plans ?? [];
        state.meta = action.payload?.meta ?? null;
        state.error = null;
      })

      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.status = "failed";
        state.plans = [];
        state.meta = null;
        state.error = action.payload ?? "Unable to fetch subscription plans.";
      });
  },
});

export const { resetSubscriptionPlans, clearSubscriptionPlanError } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
