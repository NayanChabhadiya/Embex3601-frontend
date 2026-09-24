import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  createProduct as createProductService,
  getProducts as getProductsService,
  getProductById as getProductByIdService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/product.service.js";

/**
 * Create Product
 */
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data, { rejectWithValue }) => {
    try {
      return await createProductService(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product",
      );
    }
  },
);

/**
 * Get All Products
 */
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProductsService();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products",
      );
    }
  },
);

/**
 * Get Product By ID
 */
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductByIdService(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product",
      );
    }
  },
);

/**
 * Update Product
 */
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateProductService(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product",
      );
    }
  },
);

/**
 * Delete Product
 */
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductService(id);

      return {
        id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete product",
      );
    }
  },
);
