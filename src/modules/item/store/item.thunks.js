import { createAsyncThunk } from "@reduxjs/toolkit";

import itemService from "../services/item.service.js";

// ============================================================
// GET ALL ITEMS
// ============================================================

export const fetchItems = createAsyncThunk(
  "item/fetchItems",

  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await itemService.getAll(workspaceId);

      return response?.data || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch items.",
      );
    }
  },
);

// ============================================================
// GET ITEM BY ID
// ============================================================

export const fetchItemById = createAsyncThunk(
  "item/fetchItemById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await itemService.getById(id);

      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch item.",
      );
    }
  },
);

// ============================================================
// CREATE ITEM
// ============================================================

export const createItem = createAsyncThunk(
  "item/createItem",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await itemService.create(payload);

      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to create item.",
      );
    }
  },
);

// ============================================================
// UPDATE ITEM
// ============================================================

export const updateItem = createAsyncThunk(
  "item/updateItem",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await itemService.update(id, payload);

      return response?.data || null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update item.",
      );
    }
  },
);

// ============================================================
// DELETE ITEM
// ============================================================

export const deleteItem = createAsyncThunk(
  "item/deleteItem",

  async (id, { rejectWithValue }) => {
    try {
      const response = await itemService.delete(id);

      return {
        id,
        response: response?.data || null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete item.",
      );
    }
  },
);
