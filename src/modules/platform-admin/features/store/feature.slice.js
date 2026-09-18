import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFeatures,
  createFeature,
  getFeatureById,
  updateFeature,
  activateFeature,
  deactivateFeature,
  deleteFeature,
  restoreFeature,
} from "./feature.thunks.js";

const initialState = Object.freeze({
  // ===========================================================================
  // Feature List
  // ===========================================================================

  features: [],
  meta: null,

  listStatus: "idle",
  listError: null,
  listRequestId: null,

  // ===========================================================================
  // Selected Feature
  // ===========================================================================

  selectedFeature: null,

  getByIdStatus: "idle",
  getByIdError: null,
  getByIdRequestId: null,

  // ===========================================================================
  // Create
  // ===========================================================================

  createStatus: "idle",
  createError: null,

  // ===========================================================================
  // Update
  // ===========================================================================

  updateStatus: "idle",
  updateError: null,

  // ===========================================================================
  // Activate
  // ===========================================================================

  activateStatus: "idle",
  activateError: null,

  // ===========================================================================
  // Deactivate
  // ===========================================================================

  deactivateStatus: "idle",
  deactivateError: null,

  // ===========================================================================
  // Delete
  // ===========================================================================

  deleteStatus: "idle",
  deleteError: null,

  // ===========================================================================
  // Restore
  // ===========================================================================

  restoreStatus: "idle",
  restoreError: null,
});

const featureSlice = createSlice({
  name: "features",

  initialState,

  reducers: {
    // =========================================================================
    // Reset Entire Feature State
    // =========================================================================

    resetFeatures(state) {
      state.features = [];
      state.meta = null;

      state.listStatus = "idle";
      state.listError = null;
      state.listRequestId = null;

      state.selectedFeature = null;

      state.getByIdStatus = "idle";
      state.getByIdError = null;
      state.getByIdRequestId = null;

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

    // =========================================================================
    // Clear List Error
    // =========================================================================

    clearFeaturesError(state) {
      state.listError = null;
    },

    // =========================================================================
    // Clear Selected Feature
    // =========================================================================

    clearSelectedFeature(state) {
      state.selectedFeature = null;
      state.getByIdStatus = "idle";
      state.getByIdError = null;
      state.getByIdRequestId = null;
    },

    // =========================================================================
    // Clear Operation Errors
    // =========================================================================

    clearFeatureOperationErrors(state) {
      state.createError = null;
      state.updateError = null;
      state.activateError = null;
      state.deactivateError = null;
      state.deleteError = null;
      state.restoreError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================================================================
      // FETCH FEATURES
      // =======================================================================

      .addCase(fetchFeatures.pending, (state, action) => {
        state.listStatus = "loading";
        state.listError = null;
        state.listRequestId = action.meta.requestId;
      })

      .addCase(fetchFeatures.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) {
          return;
        }

        state.listStatus = "succeeded";
        state.features = action.payload?.features ?? [];
        state.meta = action.payload?.meta ?? null;
        state.listError = null;
        state.listRequestId = null;
      })

      .addCase(fetchFeatures.rejected, (state, action) => {
        if (
          action.meta.requestId &&
          state.listRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to fetch features.";
        state.listRequestId = null;
      })

      // =======================================================================
      // GET FEATURE BY ID
      // =======================================================================

      .addCase(getFeatureById.pending, (state, action) => {
        state.getByIdStatus = "loading";
        state.getByIdError = null;
        state.getByIdRequestId = action.meta.requestId;
      })

      .addCase(getFeatureById.fulfilled, (state, action) => {
        if (state.getByIdRequestId !== action.meta.requestId) {
          return;
        }

        state.getByIdStatus = "succeeded";
        state.selectedFeature = action.payload ?? null;
        state.getByIdError = null;
        state.getByIdRequestId = null;
      })

      .addCase(getFeatureById.rejected, (state, action) => {
        if (
          action.meta.requestId &&
          state.getByIdRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.getByIdStatus = "failed";
        state.getByIdError = action.payload ?? "Unable to fetch feature.";
        state.getByIdRequestId = null;
      })

      // =======================================================================
      // CREATE FEATURE
      // =======================================================================

      .addCase(createFeature.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })

      .addCase(createFeature.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;

        if (action.payload) {
          state.features.unshift(action.payload);
        }
      })

      .addCase(createFeature.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? "Unable to create feature.";
      })

      // =======================================================================
      // UPDATE FEATURE
      // =======================================================================

      .addCase(updateFeature.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })

      .addCase(updateFeature.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.updateError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const index = state.features.findIndex(
          (feature) => feature._id === action.payload._id,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(updateFeature.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload ?? "Unable to update feature.";
      })

      // =======================================================================
      // ACTIVATE FEATURE
      // =======================================================================

      .addCase(activateFeature.pending, (state) => {
        state.activateStatus = "loading";
        state.activateError = null;
      })

      .addCase(activateFeature.fulfilled, (state, action) => {
        state.activateStatus = "succeeded";
        state.activateError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const index = state.features.findIndex(
          (feature) => feature._id === action.payload._id,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(activateFeature.rejected, (state, action) => {
        state.activateStatus = "failed";
        state.activateError = action.payload ?? "Unable to activate feature.";
      })

      // =======================================================================
      // DEACTIVATE FEATURE
      // =======================================================================

      .addCase(deactivateFeature.pending, (state) => {
        state.deactivateStatus = "loading";
        state.deactivateError = null;
      })

      .addCase(deactivateFeature.fulfilled, (state, action) => {
        state.deactivateStatus = "succeeded";
        state.deactivateError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const index = state.features.findIndex(
          (feature) => feature._id === action.payload._id,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(deactivateFeature.rejected, (state, action) => {
        state.deactivateStatus = "failed";
        state.deactivateError =
          action.payload ?? "Unable to deactivate feature.";
      })

      // =======================================================================
      // DELETE FEATURE
      // =======================================================================

      .addCase(deleteFeature.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })

      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.deleteError = null;

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
        state.deleteStatus = "failed";
        state.deleteError = action.payload ?? "Unable to delete feature.";
      })

      // =======================================================================
      // RESTORE FEATURE
      // =======================================================================

      .addCase(restoreFeature.pending, (state) => {
        state.restoreStatus = "loading";
        state.restoreError = null;
      })

      .addCase(restoreFeature.fulfilled, (state, action) => {
        state.restoreStatus = "succeeded";
        state.restoreError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const index = state.features.findIndex(
          (feature) => feature._id === action.payload._id,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        } else {
          state.features.unshift(action.payload);
        }
      })

      .addCase(restoreFeature.rejected, (state, action) => {
        state.restoreStatus = "failed";
        state.restoreError = action.payload ?? "Unable to restore feature.";
      });
  },
});

export const {
  resetFeatures,
  clearFeaturesError,
  clearSelectedFeature,
  clearFeatureOperationErrors,
} = featureSlice.actions;

export default featureSlice.reducer;
