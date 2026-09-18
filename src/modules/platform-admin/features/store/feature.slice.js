import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFeatures,
  fetchFeatureById,
  createFeature,
  updateFeature,
  activateFeature,
  deactivateFeature,
  deleteFeature,
  restoreFeature,
} from "./feature.thunks.js";

const initialState = Object.freeze({
  /**
   * ===========================================================================
   * Feature List
   * ===========================================================================
   */

  features: [],
  meta: null,

  status: "idle",
  error: null,

  currentRequestId: null,

  /**
   * ===========================================================================
   * Selected Feature
   * ===========================================================================
   */

  selectedFeature: null,

  selectedFeatureStatus: "idle",
  selectedFeatureError: null,

  /**
   * ===========================================================================
   * Create
   * ===========================================================================
   */

  createStatus: "idle",
  createError: null,

  /**
   * ===========================================================================
   * Update
   * ===========================================================================
   */

  updateStatus: "idle",
  updateError: null,

  /**
   * ===========================================================================
   * Feature Actions
   *
   * Activate
   * Deactivate
   * Delete
   * Restore
   * ===========================================================================
   */

  actionStatus: "idle",
  actionError: null,
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

      state.selectedFeature = null;
      state.selectedFeatureStatus = "idle";
      state.selectedFeatureError = null;

      state.createStatus = "idle";
      state.createError = null;

      state.updateStatus = "idle";
      state.updateError = null;

      state.actionStatus = "idle";
      state.actionError = null;
    },

    clearFeaturesError(state) {
      state.error = null;
    },

    clearSelectedFeatureError(state) {
      state.selectedFeatureError = null;
    },

    clearFeatureCreateError(state) {
      state.createError = null;
    },

    clearFeatureUpdateError(state) {
      state.updateError = null;
    },

    clearFeatureActionError(state) {
      state.actionError = null;
    },

    clearSelectedFeature(state) {
      state.selectedFeature = null;
      state.selectedFeatureStatus = "idle";
      state.selectedFeatureError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /**
       * =======================================================================
       * Fetch Features
       * =======================================================================
       */

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

      /**
       * =======================================================================
       * Fetch Feature By ID
       * =======================================================================
       */

      .addCase(fetchFeatureById.pending, (state) => {
        state.selectedFeatureStatus = "loading";
        state.selectedFeatureError = null;
      })

      .addCase(fetchFeatureById.fulfilled, (state, action) => {
        state.selectedFeatureStatus = "succeeded";

        state.selectedFeature = action.payload ?? null;
        state.selectedFeatureError = null;
      })

      .addCase(fetchFeatureById.rejected, (state, action) => {
        state.selectedFeatureStatus = "failed";

        state.selectedFeature = null;

        state.selectedFeatureError =
          action.payload ?? "Unable to fetch feature.";
      })

      /**
       * =======================================================================
       * Create Feature
       * =======================================================================
       */

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

      /**
       * =======================================================================
       * Update Feature
       * =======================================================================
       */

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

        const updatedId = action.payload._id ?? action.payload.id;

        const index = state.features.findIndex(
          (feature) => (feature._id ?? feature.id) === updatedId,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(updateFeature.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.updateError = action.payload ?? "Unable to update feature.";
      })

      /**
       * =======================================================================
       * Activate Feature
       * =======================================================================
       */

      .addCase(activateFeature.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })

      .addCase(activateFeature.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.actionError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const updatedId = action.payload._id ?? action.payload.id;

        const index = state.features.findIndex(
          (feature) => (feature._id ?? feature.id) === updatedId,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(activateFeature.rejected, (state, action) => {
        state.actionStatus = "failed";

        state.actionError = action.payload ?? "Unable to activate feature.";
      })

      /**
       * =======================================================================
       * Deactivate Feature
       * =======================================================================
       */

      .addCase(deactivateFeature.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })

      .addCase(deactivateFeature.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.actionError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const updatedId = action.payload._id ?? action.payload.id;

        const index = state.features.findIndex(
          (feature) => (feature._id ?? feature.id) === updatedId,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        }
      })

      .addCase(deactivateFeature.rejected, (state, action) => {
        state.actionStatus = "failed";

        state.actionError = action.payload ?? "Unable to deactivate feature.";
      })

      /**
       * =======================================================================
       * Delete Feature
       * =======================================================================
       */

      .addCase(deleteFeature.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })

      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.actionError = null;

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.features = state.features.filter(
          (feature) => (feature._id ?? feature.id) !== deletedId,
        );

        if (
          state.selectedFeature &&
          (state.selectedFeature._id ?? state.selectedFeature.id) === deletedId
        ) {
          state.selectedFeature = null;
        }
      })

      .addCase(deleteFeature.rejected, (state, action) => {
        state.actionStatus = "failed";

        state.actionError = action.payload ?? "Unable to delete feature.";
      })

      /**
       * =======================================================================
       * Restore Feature
       * =======================================================================
       */

      .addCase(restoreFeature.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })

      .addCase(restoreFeature.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.actionError = null;

        if (!action.payload) {
          return;
        }

        state.selectedFeature = action.payload;

        const restoredId = action.payload._id ?? action.payload.id;

        const index = state.features.findIndex(
          (feature) => (feature._id ?? feature.id) === restoredId,
        );

        if (index !== -1) {
          state.features[index] = action.payload;
        } else {
          state.features.unshift(action.payload);
        }
      })

      .addCase(restoreFeature.rejected, (state, action) => {
        state.actionStatus = "failed";

        state.actionError = action.payload ?? "Unable to restore feature.";
      });
  },
});

export const {
  resetFeatures,
  clearFeaturesError,
  clearSelectedFeatureError,
  clearFeatureCreateError,
  clearFeatureUpdateError,
  clearFeatureActionError,
  clearSelectedFeature,
} = featureSlice.actions;

export default featureSlice.reducer;
