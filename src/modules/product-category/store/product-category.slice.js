import { createSlice } from "@reduxjs/toolkit";

import {
  fetchProductCategories,
  fetchProductCategoryById,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "./product-category.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  productCategories: [],
  selectedProductCategory: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const productCategorySlice = createSlice({
  name: "productCategory",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearProductCategoryError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED PRODUCT CATEGORY
    // --------------------------------------------------------

    clearSelectedProductCategory: (state) => {
      state.selectedProductCategory = null;
    },

    // --------------------------------------------------------
    // RESET STATE
    // --------------------------------------------------------

    resetProductCategoryState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL PRODUCT CATEGORIES
    // ========================================================

    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.productCategories = action.payload || [];
      })

      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch product categories.";
      });

    // ========================================================
    // FETCH PRODUCT CATEGORY BY ID
    // ========================================================

    builder
      .addCase(fetchProductCategoryById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProductCategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedProductCategory = action.payload || null;
      })

      .addCase(fetchProductCategoryById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch product category.";
      });

    // ========================================================
    // CREATE PRODUCT CATEGORY
    // ========================================================

    builder
      .addCase(createProductCategory.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createProductCategory.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.productCategories.unshift(action.payload);
        }
      })

      .addCase(createProductCategory.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create product category.";
      });

    // ========================================================
    // UPDATE PRODUCT CATEGORY
    // ========================================================

    builder
      .addCase(updateProductCategory.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedProductCategory = action.payload;

        if (!updatedProductCategory?._id) {
          return;
        }

        const index = state.productCategories.findIndex(
          (productCategory) =>
            productCategory._id === updatedProductCategory._id,
        );

        if (index !== -1) {
          state.productCategories[index] = updatedProductCategory;
        }

        if (state.selectedProductCategory?._id === updatedProductCategory._id) {
          state.selectedProductCategory = updatedProductCategory;
        }
      })

      .addCase(updateProductCategory.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update product category.";
      });

    // ========================================================
    // DELETE PRODUCT CATEGORY
    // ========================================================

    builder
      .addCase(deleteProductCategory.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteProductCategory.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.productCategories = state.productCategories.filter(
          (productCategory) => productCategory._id !== deletedId,
        );

        if (state.selectedProductCategory?._id === deletedId) {
          state.selectedProductCategory = null;
        }
      })

      .addCase(deleteProductCategory.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete product category.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearProductCategoryError,
  clearSelectedProductCategory,
  resetProductCategoryState,
} = productCategorySlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default productCategorySlice.reducer;
