import { createAsyncThunk } from "@reduxjs/toolkit";

import accountService from "../services/account.service";

export const fetchAccounts = createAsyncThunk(
  "account/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await accountService.getAll();

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch accounts.",
      );
    }
  },
);

export const fetchAccountById = createAsyncThunk(
  "account/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await accountService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch account.",
      );
    }
  },
);

export const createAccount = createAsyncThunk(
  "account/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await accountService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create account.",
      );
    }
  },
);

export const updateAccount = createAsyncThunk(
  "account/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await accountService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update account.",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "account/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await accountService.delete(id);

      return {
        id,
        data: response?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete account.",
      );
    }
  },
);
