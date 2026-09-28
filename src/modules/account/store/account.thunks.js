// =============================================================================
// Account Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import accountService from "../services/account.service.js";

// =============================================================================
// Create Account
// =============================================================================

export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (payload, { rejectWithValue }) => {
    try {
      return await accountService.createAccount(payload);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to create account.",
        statusCode: error?.statusCode || null,
        errorCode: error?.errorCode || null,
        details: error?.details || null,
        fields: error?.fields || null,
      });
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
      return await accountService.getAccounts(params);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to fetch accounts.",
        statusCode: error?.statusCode || null,
        errorCode: error?.errorCode || null,
        details: error?.details || null,
        fields: error?.fields || null,
      });
    }
  },
);

// =============================================================================
// Get Account By ID
// =============================================================================

export const getAccountById = createAsyncThunk(
  "account/getAccountById",
  async (accountId, { rejectWithValue }) => {
    try {
      return await accountService.getAccountById(accountId);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to fetch account.",
        statusCode: error?.statusCode || null,
        errorCode: error?.errorCode || null,
        details: error?.details || null,
        fields: error?.fields || null,
      });
    }
  },
);

// =============================================================================
// Update Account
// =============================================================================

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async ({ accountId, payload }, { rejectWithValue }) => {
    try {
      return await accountService.updateAccount(accountId, payload);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to update account.",
        statusCode: error?.statusCode || null,
        errorCode: error?.errorCode || null,
        details: error?.details || null,
        fields: error?.fields || null,
      });
    }
  },
);

// =============================================================================
// Delete Account
// =============================================================================

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      return await accountService.deleteAccount(accountId);
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "Failed to delete account.",
        statusCode: error?.statusCode || null,
        errorCode: error?.errorCode || null,
        details: error?.details || null,
        fields: error?.fields || null,
      });
    }
  },
);
