import { createSlice } from "@reduxjs/toolkit";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.thunks.js";

const initialState = {
  products: [],
  selectedProduct: null,
  status: "idle",
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    clearProductError: (state) => {
      state.error = null;
    },

    resetProductState: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // Create Product
      // ==========================================
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const product = action.payload?.data ?? action.payload;

        if (product) {
          state.products.unshift(product);
          state.selectedProduct = product;
        }
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create product";
      })

      // ==========================================
      // Get Products
      // ==========================================
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const products = action.payload?.data ?? action.payload;

        state.products = Array.isArray(products) ? products : [];
      })

      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch products";
      })

      // ==========================================
      // Get Product By ID
      // ==========================================
      .addCase(getProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.selectedProduct = action.payload?.data ?? action.payload;
      })

      .addCase(getProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch product";
      })

      // ==========================================
      // Update Product
      // ==========================================
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const updatedProduct = action.payload?.data ?? action.payload;

        if (!updatedProduct) {
          return;
        }

        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id,
        );

        if (index !== -1) {
          state.products[index] = updatedProduct;
        }

        state.selectedProduct = updatedProduct;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update product";
      })

      // ==========================================
      // Delete Product
      // ==========================================
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const deletedId = action.payload?.id;

        state.products = state.products.filter(
          (product) => product._id !== deletedId,
        );

        if (state.selectedProduct?._id === deletedId) {
          state.selectedProduct = null;
        }
      })

      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { clearSelectedProduct, clearProductError, resetProductState } =
  productSlice.actions;

export default productSlice.reducer;
