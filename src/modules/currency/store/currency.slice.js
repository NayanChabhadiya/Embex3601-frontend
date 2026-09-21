import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCurrencies,
  fetchCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "./currency.thunks.js";

const initialState = {
  items: [],
  selectedCurrency: null,

  status: "idle",
  error: null,
};

const currencySlice = createSlice({
  name: "currency",

  initialState,

  reducers: {
    clearSelectedCurrency: (state) => {
      state.selectedCurrency = null;
    },

    clearCurrencyError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // GET ALL CURRENCIES
    // ========================================================

    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = action.payload || [];
      })

      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch currencies.";
      });

    // ========================================================
    // GET CURRENCY BY ID
    // ========================================================

    builder
      .addCase(fetchCurrencyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchCurrencyById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedCurrency = action.payload || null;
      })

      .addCase(fetchCurrencyById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch currency.";
      });

    // ========================================================
    // CREATE CURRENCY
    // ========================================================

    builder
      .addCase(createCurrency.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createCurrency.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(createCurrency.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to create currency.";
      });

    // ========================================================
    // UPDATE CURRENCY
    // ========================================================

    builder
      .addCase(updateCurrency.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedCurrency = action.payload;

        if (!updatedCurrency?._id) {
          return;
        }

        const index = state.items.findIndex(
          (item) => item._id === updatedCurrency._id,
        );

        if (index !== -1) {
          state.items[index] = updatedCurrency;
        }

        state.selectedCurrency = updatedCurrency;
      })

      .addCase(updateCurrency.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to update currency.";
      });

    // ========================================================
    // DELETE CURRENCY
    // ========================================================

    builder
      .addCase(deleteCurrency.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        state.items = state.items.filter((item) => item._id !== deletedId);

        if (state.selectedCurrency?._id === deletedId) {
          state.selectedCurrency = null;
        }
      })

      .addCase(deleteCurrency.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to delete currency.";
      });
  },
});

export const { clearSelectedCurrency, clearCurrencyError } =
  currencySlice.actions;

export default currencySlice.reducer;
