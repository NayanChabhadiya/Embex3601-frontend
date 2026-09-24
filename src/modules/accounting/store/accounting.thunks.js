import { createAsyncThunk } from "@reduxjs/toolkit";

import accountingService from "../services/accounting.service.js";

// ============================================================
// ERROR HELPER
// ============================================================

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

// ============================================================
// GET ACCOUNTING TRANSACTIONS
// ============================================================

export const getAccountingTransactions = createAsyncThunk(
  "accounting/getAccountingTransactions",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await accountingService.getAccountingTransactions(params);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch accounting transactions."),
      );
    }
  },
);

// ============================================================
// GET ACCOUNTING BY ID
// ============================================================

export const getAccountingById = createAsyncThunk(
  "accounting/getAccountingById",

  async (id, { rejectWithValue }) => {
    try {
      return await accountingService.getAccountingById(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch accounting transaction."),
      );
    }
  },
);

// ============================================================
// CREATE ACCOUNTING
// ============================================================

export const createAccounting = createAsyncThunk(
  "accounting/createAccounting",

  async (payload, { rejectWithValue }) => {
    try {
      return await accountingService.createAccounting(payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to create accounting transaction."),
      );
    }
  },
);

// ============================================================
// UPDATE ACCOUNTING
// ============================================================

export const updateAccounting = createAsyncThunk(
  "accounting/updateAccounting",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await accountingService.updateAccounting(id, payload);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to update accounting transaction."),
      );
    }
  },
);

// ============================================================
// DELETE ACCOUNTING
// ============================================================

export const deleteAccounting = createAsyncThunk(
  "accounting/deleteAccounting",

  async (id, { rejectWithValue }) => {
    try {
      return await accountingService.deleteAccounting(id);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to delete accounting transaction."),
      );
    }
  },
);
