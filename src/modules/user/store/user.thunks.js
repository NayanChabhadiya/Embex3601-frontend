import { createAsyncThunk } from "@reduxjs/toolkit";

import userService from "../services/user.service.js";

export const fetchUsers = createAsyncThunk(
  "user/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAll();

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch users.",
      );
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch user.",
      );
    }
  },
);

export const createUser = createAsyncThunk(
  "user/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await userService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create user.",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await userService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user.",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.delete(id);

      return {
        id,
        data: response?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete user.",
      );
    }
  },
);
