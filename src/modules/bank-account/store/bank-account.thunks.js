import { createAsyncThunk } from "@reduxjs/toolkit";

import bankAccountService from "../services/bank-account.service.js";

// ============================================================
// FETCH ALL BANK ACCOUNTS
// ============================================================

export const fetchBankAccounts = createAsyncThunk(
  "bankAccount/fetchAll",

  async ({ companyId, branchId = null } = {}, { rejectWithValue }) => {
    try {
      if (!companyId) {
        return rejectWithValue("Company is required.");
      }

      const response = await bankAccountService.getAll(companyId, branchId);

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch bank accounts.",
      );
    }
  },
);

// ============================================================
// FETCH BANK ACCOUNT BY ID
// ============================================================

export const fetchBankAccountById = createAsyncThunk(
  "bankAccount/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bank account ID is required.");
      }

      const response = await bankAccountService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch bank account.",
      );
    }
  },
);

// ============================================================
// CREATE BANK ACCOUNT
// ============================================================

export const createBankAccount = createAsyncThunk(
  "bankAccount/create",

  async (payload, { rejectWithValue }) => {
    try {
      if (!payload?.companyId) {
        return rejectWithValue("Company is required.");
      }

      const response = await bankAccountService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create bank account.",
      );
    }
  },
);

// ============================================================
// UPDATE BANK ACCOUNT
// ============================================================

export const updateBankAccount = createAsyncThunk(
  "bankAccount/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bank account ID is required.");
      }

      if (!payload?.companyId) {
        return rejectWithValue("Company is required.");
      }

      const response = await bankAccountService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update bank account.",
      );
    }
  },
);

// ============================================================
// DELETE BANK ACCOUNT
// ============================================================

export const deleteBankAccount = createAsyncThunk(
  "bankAccount/delete",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bank account ID is required.");
      }

      const response = await bankAccountService.delete(id);

      return {
        id,
        ...response,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete bank account.",
      );
    }
  },
);
