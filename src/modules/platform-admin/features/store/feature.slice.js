import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFeatures,
  fetchFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
} from "./feature.thunks.js";

const initialState = {
  features: [],
  selectedFeature: null,
  status: "idle",
  error: null,
};

const featureSlice = createSlice({
  name: "feature",

  initialState,

  reducers: {
    clearFeatureError: (state) => {
      state.error = null;
    },

    clearSelectedFeature: (state) => {
      state.selectedFeature = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================================================
      // Fetch All
      // =========================================================

      .addCase(fetchFeatures.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.features = action.payload ?? [];
      })

      .addCase(fetchFeatures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Fetch By ID
      // =========================================================

      .addCase(fetchFeatureById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchFeatureById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedFeature = action.payload ?? null;
      })

      .addCase(fetchFeatureById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Create
      // =========================================================

      .addCase(createFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.features.unshift(action.payload);
        }
      })

      .addCase(createFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Update
      // =========================================================

      .addCase(updateFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedFeature = action.payload;

        if (!updatedFeature) {
          return;
        }

        const index = state.features.findIndex(
          (feature) => feature._id === updatedFeature._id,
        );

        if (index !== -1) {
          state.features[index] = updatedFeature;
        }

        if (state.selectedFeature?._id === updatedFeature._id) {
          state.selectedFeature = updatedFeature;
        }
      })

      .addCase(updateFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // =========================================================
      // Delete
      // =========================================================

      .addCase(deleteFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.features = state.features.filter(
          (feature) => feature._id !== deletedId,
        );

        if (state.selectedFeature?._id === deletedId) {
          state.selectedFeature = null;
        }
      })

      .addCase(deleteFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearFeatureError, clearSelectedFeature } = featureSlice.actions;

export default featureSlice.reducer;
