import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPlanFeatures,
  fetchPlanFeatureById,
  createPlanFeature,
  updatePlanFeature,
  deletePlanFeature,
} from "./plan-feature.thunks.js";

const initialState = {
  planFeatures: [],
  selectedPlanFeature: null,
  status: "idle",
  error: null,
};

const planFeatureSlice = createSlice({
  name: "planFeature",

  initialState,

  reducers: {
    clearPlanFeatureError: (state) => {
      state.error = null;
    },

    clearSelectedPlanFeature: (state) => {
      state.selectedPlanFeature = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================================================
      // Fetch All
      // ============================================================

      .addCase(fetchPlanFeatures.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPlanFeatures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.planFeatures = action.payload ?? [];
      })

      .addCase(fetchPlanFeatures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Fetch By ID
      // ============================================================

      .addCase(fetchPlanFeatureById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPlanFeatureById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPlanFeature = action.payload ?? null;
      })

      .addCase(fetchPlanFeatureById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Create
      // ============================================================

      .addCase(createPlanFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createPlanFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.planFeatures.unshift(action.payload);
        }
      })

      .addCase(createPlanFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Update
      // ============================================================

      .addCase(updatePlanFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updatePlanFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedPlanFeature = action.payload;

        if (!updatedPlanFeature) {
          return;
        }

        const index = state.planFeatures.findIndex(
          (planFeature) => planFeature._id === updatedPlanFeature._id,
        );

        if (index !== -1) {
          state.planFeatures[index] = updatedPlanFeature;
        }

        if (state.selectedPlanFeature?._id === updatedPlanFeature._id) {
          state.selectedPlanFeature = updatedPlanFeature;
        }
      })

      .addCase(updatePlanFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Delete
      // ============================================================

      .addCase(deletePlanFeature.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deletePlanFeature.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.planFeatures = state.planFeatures.filter(
          (planFeature) => planFeature._id !== deletedId,
        );

        if (state.selectedPlanFeature?._id === deletedId) {
          state.selectedPlanFeature = null;
        }
      })

      .addCase(deletePlanFeature.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearPlanFeatureError, clearSelectedPlanFeature } =
  planFeatureSlice.actions;

export default planFeatureSlice.reducer;
