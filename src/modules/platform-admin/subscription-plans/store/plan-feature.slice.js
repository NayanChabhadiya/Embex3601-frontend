import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPlanFeatures,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
} from "./plan-feature.thunks.js";

const initialState = Object.freeze({
  features: [],
  meta: null,
  status: "idle",
  error: null,
  mutationStatus: "idle",
  mutationError: null,
});

const planFeatureSlice = createSlice({
  name: "planFeatures",
  initialState,
  reducers: {
    clearPlanFeatureError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlanFeatures.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlanFeatures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.features = action.payload?.features ?? [];
        state.meta = action.payload?.meta ?? null;
        state.error = null;
      })
      .addCase(fetchPlanFeatures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Unable to fetch plan features.";
      })

      .addCase(createPlanFeature.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(createPlanFeature.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;

        if (action.payload) {
          state.features.push(action.payload);
        }
      })
      .addCase(createPlanFeature.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ?? "Unable to assign feature to subscription plan.";
      })

      .addCase(updatePlanFeature.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(updatePlanFeature.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;

        const updatedFeature = action.payload;

        if (!updatedFeature) {
          return;
        }

        const index = state.features.findIndex(
          (feature) =>
            feature.featureId === updatedFeature.featureId ||
            feature._id === updatedFeature._id,
        );

        if (index !== -1) {
          state.features[index] = updatedFeature;
        }
      })
      .addCase(updatePlanFeature.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ?? "Unable to update plan feature.";
      })

      .addCase(deletePlanFeature.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
      })
      .addCase(deletePlanFeature.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;

        const featureId = action.payload?.featureId;

        state.features = state.features.filter(
          (feature) =>
            feature.featureId !== featureId && feature._id !== featureId,
        );
      })
      .addCase(deletePlanFeature.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ?? "Unable to remove feature from subscription plan.";
      });
  },
});

export const { clearPlanFeatureError } = planFeatureSlice.actions;

export default planFeatureSlice.reducer;
