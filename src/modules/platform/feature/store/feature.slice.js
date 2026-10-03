// =============================================================================
// Feature Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import { createFeature, getFeatures } from "./feature.thunks.js";

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState = {
  // ---------------------------------------------------------------------------
  // Features List
  // ---------------------------------------------------------------------------

  features: [],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listLoading: false,
  listError: null,

  // ---------------------------------------------------------------------------
  // Create Feature
  // ---------------------------------------------------------------------------

  createLoading: false,
  createError: null,
  createdFeature: null,
};

// -----------------------------------------------------------------------------
// Feature Slice
// -----------------------------------------------------------------------------

const featureSlice = createSlice({
  name: "feature",

  initialState,

  reducers: {
    // -------------------------------------------------------------------------
    // Clear Created Feature
    // -------------------------------------------------------------------------

    clearCreatedFeature: (state) => {
      state.createdFeature = null;
      state.createError = null;
    },

    // -------------------------------------------------------------------------
    // Clear Feature Errors
    // -------------------------------------------------------------------------

    clearFeatureErrors: (state) => {
      state.listError = null;
      state.createError = null;
    },
  },

  extraReducers: (builder) => {
    // =========================================================================
    // Create Feature
    // =========================================================================

    builder
      .addCase(createFeature.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdFeature = null;
      })

      .addCase(createFeature.fulfilled, (state, action) => {
        state.createLoading = false;

        state.createdFeature = action.payload?.data || action.payload || null;
      })

      .addCase(createFeature.rejected, (state, action) => {
        state.createLoading = false;

        state.createError = action.payload || "Failed to create feature.";
      });

    // =========================================================================
    // Get Features
    // =========================================================================

    builder
      .addCase(getFeatures.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(getFeatures.fulfilled, (state, action) => {
        state.listLoading = false;

        const response = action.payload || {};

        state.features = Array.isArray(response.data) ? response.data : [];

        state.pagination = response.meta || state.pagination;
      })

      .addCase(getFeatures.rejected, (state, action) => {
        state.listLoading = false;

        state.listError = action.payload || "Failed to fetch features.";
      });
  },
});

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

export const { clearCreatedFeature, clearFeatureErrors } = featureSlice.actions;

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

export default featureSlice.reducer;
