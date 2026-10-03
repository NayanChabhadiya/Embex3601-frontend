import { createAsyncThunk } from "@reduxjs/toolkit";

import userService from "../services/user.service.js";

// --------------------------------------------------------------------------
// Create User
// --------------------------------------------------------------------------

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to create user.",
      );
    }
  },
);

// --------------------------------------------------------------------------
// Get Users
// --------------------------------------------------------------------------

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await userService.getUsers(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch users.",
      );
    }
  },
);

// --------------------------------------------------------------------------
// Get User By ID
// --------------------------------------------------------------------------

export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch user.",
      );
    }
  },
);
