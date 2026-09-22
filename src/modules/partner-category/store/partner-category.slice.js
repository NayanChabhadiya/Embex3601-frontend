import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPartnerCategories,
  fetchPartnerCategoryById,
  createPartnerCategory,
  updatePartnerCategory,
  deletePartnerCategory,
} from "./partner-category.thunks.js";

const initialState = {
  partnerCategories: [],
  selectedPartnerCategory: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

const partnerCategorySlice = createSlice({
  name: "partnerCategory",

  initialState,

  reducers: {
    // ============================================================
    // CLEAR ERROR
    // ============================================================

    clearPartnerCategoryError: (state) => {
      state.error = null;
    },

    // ============================================================
    // CLEAR SELECTED PARTNER CATEGORY
    // ============================================================

    clearSelectedPartnerCategory: (state) => {
      state.selectedPartnerCategory = null;
    },

    // ============================================================
    // RESET STATE
    // ============================================================

    resetPartnerCategoryState: () => initialState,
  },

  extraReducers: (builder) => {
    // ============================================================
    // FETCH ALL PARTNER CATEGORIES
    // ============================================================

    builder
      .addCase(fetchPartnerCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPartnerCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.partnerCategories = action.payload || [];
      })

      .addCase(fetchPartnerCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch partner categories.";
      });

    // ============================================================
    // FETCH PARTNER CATEGORY BY ID
    // ============================================================

    builder
      .addCase(fetchPartnerCategoryById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPartnerCategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPartnerCategory = action.payload || null;
      })

      .addCase(fetchPartnerCategoryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch partner category.";
      });

    // ============================================================
    // CREATE PARTNER CATEGORY
    // ============================================================

    builder
      .addCase(createPartnerCategory.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createPartnerCategory.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.partnerCategories.unshift(action.payload);
        }
      })

      .addCase(createPartnerCategory.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create partner category.";
      });

    // ============================================================
    // UPDATE PARTNER CATEGORY
    // ============================================================

    builder
      .addCase(updatePartnerCategory.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updatePartnerCategory.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedCategory = action.payload;

        if (!updatedCategory?._id) {
          return;
        }

        const index = state.partnerCategories.findIndex(
          (category) => category._id === updatedCategory._id,
        );

        if (index !== -1) {
          state.partnerCategories[index] = updatedCategory;
        }

        if (state.selectedPartnerCategory?._id === updatedCategory._id) {
          state.selectedPartnerCategory = updatedCategory;
        }
      })

      .addCase(updatePartnerCategory.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update partner category.";
      });

    // ============================================================
    // DELETE PARTNER CATEGORY
    // ============================================================

    builder
      .addCase(deletePartnerCategory.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deletePartnerCategory.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.partnerCategories = state.partnerCategories.filter(
          (category) => category._id !== deletedId,
        );

        if (state.selectedPartnerCategory?._id === deletedId) {
          state.selectedPartnerCategory = null;
        }
      })

      .addCase(deletePartnerCategory.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete partner category.";
      });
  },
});

export const {
  clearPartnerCategoryError,
  clearSelectedPartnerCategory,
  resetPartnerCategoryState,
} = partnerCategorySlice.actions;

export default partnerCategorySlice.reducer;
