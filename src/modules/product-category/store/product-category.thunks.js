import { createAsyncThunk } from "@reduxjs/toolkit";

import productCategoryService from "../services/product-category.service.js";

// ============================================================
// FETCH ALL PRODUCT CATEGORIES
// ============================================================

export const fetchProductCategories = createAsyncThunk(
  "productCategory/fetchAll",
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await productCategoryService.getAll(workspaceId);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch product categories.",
      );
    }
  },
);

// ============================================================
// FETCH PRODUCT CATEGORY BY ID
// ============================================================

export const fetchProductCategoryById = createAsyncThunk(
  "productCategory/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productCategoryService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch product category.",
      );
    }
  },
);

// ============================================================
// CREATE PRODUCT CATEGORY
// ============================================================

export const createProductCategory = createAsyncThunk(
  "productCategory/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await productCategoryService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create product category.",
      );
    }
  },
);

// ============================================================
// UPDATE PRODUCT CATEGORY
// ============================================================

export const updateProductCategory = createAsyncThunk(
  "productCategory/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await productCategoryService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update product category.",
      );
    }
  },
);

// ============================================================
// DELETE PRODUCT CATEGORY
// ============================================================

export const deleteProductCategory = createAsyncThunk(
  "productCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productCategoryService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete product category.",
      );
    }
  },
);
