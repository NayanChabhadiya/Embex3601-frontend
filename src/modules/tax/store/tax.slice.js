import { createSlice } from "@reduxjs/toolkit";

import {
  fetchTaxes,
  fetchTaxById,
  createTax,
  updateTax,
  deleteTax,
} from "./tax.thunks.js";

const initialState = {
  items: [],
  selectedTax: null,

  status: "idle",
  error: null,
};

const taxSlice = createSlice({
  name: "tax",

  initialState,

  reducers: {
    clearSelectedTax: (state) => {
      state.selectedTax = null;
    },

    clearTaxError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // GET ALL
    // ========================================================

    builder
      .addCase(fetchTaxes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = action.payload || [];
      })

      .addCase(fetchTaxes.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch taxes.";
      });

    // ========================================================
    // GET BY ID
    // ========================================================

    builder
      .addCase(fetchTaxById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchTaxById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedTax = action.payload || null;
      })

      .addCase(fetchTaxById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch tax.";
      });

    // ========================================================
    // CREATE
    // ========================================================

    builder
      .addCase(createTax.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createTax.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(createTax.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to create tax.";
      });

    // ========================================================
    // UPDATE
    // ========================================================

    builder
      .addCase(updateTax.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateTax.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedTax = action.payload;

        if (!updatedTax?._id) {
          return;
        }

        const index = state.items.findIndex(
          (item) => item._id === updatedTax._id,
        );

        if (index !== -1) {
          state.items[index] = updatedTax;
        }

        state.selectedTax = updatedTax;
      })

      .addCase(updateTax.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to update tax.";
      });

    // ========================================================
    // DELETE
    // ========================================================

    builder
      .addCase(deleteTax.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteTax.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        state.items = state.items.filter((item) => item._id !== deletedId);

        if (state.selectedTax?._id === deletedId) {
          state.selectedTax = null;
        }
      })

      .addCase(deleteTax.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to delete tax.";
      });
  },
});

export const { clearSelectedTax, clearTaxError } = taxSlice.actions;

export default taxSlice.reducer;
