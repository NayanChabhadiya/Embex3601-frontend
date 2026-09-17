import { createSlice } from "@reduxjs/toolkit";

import { fetchFeatures, updateFeature } from "./feature.thunks.js";

const initialState = Object.freeze({
  features: [],
  meta: null,
  status: "idle",
  error: null,
  currentRequestId: null,

  updateStatus: "idle",
  updateError: null,
});

const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    resetFeatures(state) {
      state.features = [];
      state.meta = null;
      state.status = "idle";
      state.error = null;
      state.currentRequestId = null;

      state.selectedPlan = null;
      state.selectedPlanStatus = "idle";
      state.selectedPlanError = null;
    },

    clearFeaturesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";
        state.features = action.payload?.features ?? [];
        state.meta = action.payload?.meta ?? null;
        state.error = null;
        state.currentRequestId = null;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        if (
          action.meta.requestId &&
          state.currentRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.status = "failed";
        state.error = action.payload ?? "Unable to fetch features.";
        state.currentRequestId = null;
      })

      .addCase(updateFeature.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;

        if (action.payload) {
          state.selectedPlan = action.payload;
        }
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload ?? "Unable to update feature.";
      });
  },
});

export const { resetFeatures, clearFeaturesError } = featureSlice.actions;
export default featureSlice.reducer;
