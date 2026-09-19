import { createSlice } from "@reduxjs/toolkit";

import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "./subscription-plan.thunks.js";

const initialState = {
  plans: [],
  selectedPlan: null,
  status: "idle",
  error: null,
};

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",

  initialState,

  reducers: {
    clearSubscriptionPlanError: (state) => {
      state.error = null;
    },

    clearSelectedSubscriptionPlan: (state) => {
      state.selectedPlan = null;
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
        state.plans = action.payload ?? [];
      })

      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchSubscriptionPlanById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPlan = action.payload ?? null;
      })

      .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createSubscriptionPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.plans.unshift(action.payload);
        }
      })

      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedPlan = action.payload;

        if (!updatedPlan) {
          return;
        }

        const index = state.plans.findIndex(
          (plan) => plan._id === updatedPlan._id,
        );

        if (index !== -1) {
          state.plans[index] = updatedPlan;
        }

        if (state.selectedPlan?._id === updatedPlan._id) {
          state.selectedPlan = updatedPlan;
        }
      })

      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.plans = state.plans.filter((plan) => plan._id !== deletedId);

        if (state.selectedPlan?._id === deletedId) {
          state.selectedPlan = null;
        }
      })

      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSubscriptionPlanError, clearSelectedSubscriptionPlan } =
  subscriptionPlanSlice.actions;

export default subscriptionPlanSlice.reducer;
