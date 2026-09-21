import { createAsyncThunk } from "@reduxjs/toolkit";

import currencyService from "../services/currency.service.js";

// ============================================================
// ERROR MESSAGE HELPER
// ============================================================

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallbackMessage
  );
};

// ============================================================
// GET ALL CURRENCIES
// ============================================================

export const fetchCurrencies = createAsyncThunk(
  "currency/fetchAll",

  async (_, { rejectWithValue }) => {
    try {
      const response = await currencyService.getAll();

      return response.data;
    } catch (error) {
      console.error("FETCH CURRENCIES ERROR:", error);

      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch currencies."),
      );
    }
  },
);

// ============================================================
// GET CURRENCY BY ID
// ============================================================

export const fetchCurrencyById = createAsyncThunk(
  "currency/fetchById",

  async (id, { rejectWithValue }) => {
    try {
      const response = await currencyService.getById(id);

      return response.data;
    } catch (error) {
      console.error("FETCH CURRENCY ERROR:", error);

      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch currency."),
      );
    }
  },
);

// ============================================================
// CREATE CURRENCY
// ============================================================

export const createCurrency = createAsyncThunk(
  "currency/create",

  async (payload, { rejectWithValue }) => {
    try {
      const response = await currencyService.create(payload);

      return response.data;
    } catch (error) {
      console.error("CREATE CURRENCY ERROR:", error);

      return rejectWithValue(
        getErrorMessage(error, "Failed to create currency."),
      );
    }
  },
);

// ============================================================
// UPDATE CURRENCY
// ============================================================

export const updateCurrency = createAsyncThunk(
  "currency/update",

  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await currencyService.update(id, payload);

      return response.data;
    } catch (error) {
      console.error("UPDATE CURRENCY ERROR:", error);

      return rejectWithValue(
        getErrorMessage(error, "Failed to update currency."),
      );
    }
  },
);

// ============================================================
// DELETE CURRENCY
// ============================================================

export const deleteCurrency = createAsyncThunk(
  "currency/delete",

  async (id, { rejectWithValue }) => {
    try {
      const response = await currencyService.delete(id);

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      console.error("DELETE CURRENCY ERROR:", error);

      return rejectWithValue(
        getErrorMessage(error, "Failed to delete currency."),
      );
    }
  },
);
