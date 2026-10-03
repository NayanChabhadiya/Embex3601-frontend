// =============================================================================
// Plan Feature Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import { createPlanFeature, getPlanFeatures } from "./plan-feature.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  planFeatures: [],

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

  createLoading: false,
  createError: null,
  createdPlanFeature: null,
};

// =============================================================================
// Slice
// =============================================================================

const planFeatureSlice = createSlice({
  name: "planFeature",

  initialState,

  reducers: {
    clearCreatedPlanFeature: (state) => {
      state.createdPlanFeature = null;
    },

    clearPlanFeatureErrors: (state) => {
      state.listError = null;
      state.createError = null;
    },
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // Get Plan Features
    // -------------------------------------------------------------------------

    builder
      .addCase(getPlanFeatures.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(getPlanFeatures.fulfilled, (state, action) => {
        state.listLoading = false;
        state.listError = null;

        const response = action.payload;

        state.planFeatures = Array.isArray(response?.data) ? response.data : [];

        state.pagination = response?.meta || state.pagination;
      })

      .addCase(getPlanFeatures.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload || "Failed to fetch plan features.";
      });

    // -------------------------------------------------------------------------
    // Create Plan Feature
    // -------------------------------------------------------------------------

    builder
      .addCase(createPlanFeature.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdPlanFeature = null;
      })

      .addCase(createPlanFeature.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;

        state.createdPlanFeature = action.payload?.data || null;
      })

      .addCase(createPlanFeature.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create plan feature.";
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const { clearCreatedPlanFeature, clearPlanFeatureErrors } =
  planFeatureSlice.actions;

// =============================================================================
// Reducer
// =============================================================================

export default planFeatureSlice.reducer;
