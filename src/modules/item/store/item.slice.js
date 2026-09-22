import { createSlice } from "@reduxjs/toolkit";

import {
  fetchItems,
  fetchItemById,
  createItem,
  updateItem,
  deleteItem,
} from "./item.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  items: [],

  selectedItem: null,

  status: "idle",

  createStatus: "idle",

  updateStatus: "idle",

  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const itemSlice = createSlice({
  name: "item",

  initialState,

  reducers: {
    // ----------------------------------------------------------
    // CLEAR ERROR
    // ----------------------------------------------------------

    clearItemError: (state) => {
      state.error = null;
    },

    // ----------------------------------------------------------
    // CLEAR SELECTED ITEM
    // ----------------------------------------------------------

    clearSelectedItem: (state) => {
      state.selectedItem = null;
    },

    // ----------------------------------------------------------
    // RESET ITEM STATE
    // ----------------------------------------------------------

    resetItemState: () => initialState,
  },

  extraReducers: (builder) => {
    // ==========================================================
    // FETCH ITEMS
    // ==========================================================

    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.items = action.payload || [];
      })

      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch items.";
      });

    // ==========================================================
    // FETCH ITEM BY ID
    // ==========================================================

    builder
      .addCase(fetchItemById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.selectedItem = action.payload || null;
      })

      .addCase(fetchItemById.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch item.";
      });

    // ==========================================================
    // CREATE ITEM
    // ==========================================================

    builder
      .addCase(createItem.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createItem.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(createItem.rejected, (state, action) => {
        state.createStatus = "failed";

        state.error = action.payload || "Failed to create item.";
      });

    // ==========================================================
    // UPDATE ITEM
    // ==========================================================

    builder
      .addCase(updateItem.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedItem = action.payload;

        if (!updatedItem?._id) {
          return;
        }

        // ----------------------------------------------------
        // UPDATE LIST
        // ----------------------------------------------------

        const index = state.items.findIndex(
          (item) => item._id === updatedItem._id,
        );

        if (index !== -1) {
          state.items[index] = updatedItem;
        }

        // ----------------------------------------------------
        // UPDATE SELECTED ITEM
        // ----------------------------------------------------

        if (state.selectedItem?._id === updatedItem._id) {
          state.selectedItem = updatedItem;
        }
      })

      .addCase(updateItem.rejected, (state, action) => {
        state.updateStatus = "failed";

        state.error = action.payload || "Failed to update item.";
      });

    // ==========================================================
    // DELETE ITEM
    // ==========================================================

    builder
      .addCase(deleteItem.pending, (state) => {
        state.deleteStatus = "loading";

        state.error = null;
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        // ----------------------------------------------------
        // REMOVE FROM LIST
        // ----------------------------------------------------

        state.items = state.items.filter((item) => item._id !== deletedId);

        // ----------------------------------------------------
        // CLEAR SELECTED ITEM
        // ----------------------------------------------------

        if (state.selectedItem?._id === deletedId) {
          state.selectedItem = null;
        }
      })

      .addCase(deleteItem.rejected, (state, action) => {
        state.deleteStatus = "failed";

        state.error = action.payload || "Failed to delete item.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearItemError, clearSelectedItem, resetItemState } =
  itemSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default itemSlice.reducer;
