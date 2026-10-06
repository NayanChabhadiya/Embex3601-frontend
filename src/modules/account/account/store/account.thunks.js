// =============================================================================
// Account Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import accountService from "../services/account.service.js";
import ACCOUNT_MESSAGES from "../constants/account.messages.js";

// =============================================================================
// Create Account
// =============================================================================

export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await accountService.createAccount(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: ACCOUNT_MESSAGES.CREATE_FAILED,
        },
      );
    }
  },
);

// =============================================================================
// Get Accounts
// =============================================================================

export const getAccounts = createAsyncThunk(
  "account/getAccounts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accountService.getAccounts(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: ACCOUNT_MESSAGES.LIST_FAILED,
        },
      );
    }
  },
);
