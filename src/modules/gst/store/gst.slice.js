import { createSlice } from "@reduxjs/toolkit";

import {
  getGSTDocuments,
  getGSTById,
  createGST,
  updateGST,
  deleteGST,
} from "./gst.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  documents: [],
  selectedDocument: null,

  status: "idle",
  error: null,
};

// ============================================================
// SLICE
// ============================================================

const gstSlice = createSlice({
  name: "gst",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearGSTError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED DOCUMENT
    // --------------------------------------------------------

    clearSelectedGST: (state) => {
      state.selectedDocument = null;
    },

    // --------------------------------------------------------
    // RESET GST STATE
    // --------------------------------------------------------

    resetGSTState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // GET GST DOCUMENTS
    // ========================================================

    builder
      .addCase(getGSTDocuments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getGSTDocuments.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.documents = Array.isArray(action.payload) ? action.payload : [];

        state.error = null;
      })

      .addCase(getGSTDocuments.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to fetch GST documents.";
      });

    // ========================================================
    // GET GST BY ID
    // ========================================================

    builder
      .addCase(getGSTById.pending, (state) => {
        state.error = null;
      })

      .addCase(getGSTById.fulfilled, (state, action) => {
        state.selectedDocument = action.payload;
        state.error = null;
      })

      .addCase(getGSTById.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch GST document.";
      });

    // ========================================================
    // CREATE GST
    // ========================================================

    builder
      .addCase(createGST.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createGST.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.documents.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createGST.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to create GST document.";
      });

    // ========================================================
    // UPDATE GST
    // ========================================================

    builder
      .addCase(updateGST.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateGST.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedDocument = action.payload;

        if (updatedDocument?._id) {
          const index = state.documents.findIndex(
            (document) => document._id === updatedDocument._id,
          );

          if (index !== -1) {
            state.documents[index] = updatedDocument;
          }

          if (state.selectedDocument?._id === updatedDocument._id) {
            state.selectedDocument = updatedDocument;
          }
        }

        state.error = null;
      })

      .addCase(updateGST.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to update GST document.";
      });

    // ========================================================
    // DELETE GST
    // ========================================================

    builder
      .addCase(deleteGST.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteGST.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId =
          typeof action.payload === "string" ? action.payload : action.meta.arg;

        state.documents = state.documents.filter(
          (document) => document._id !== deletedId,
        );

        if (state.selectedDocument?._id === deletedId) {
          state.selectedDocument = null;
        }

        state.error = null;
      })

      .addCase(deleteGST.rejected, (state, action) => {
        state.status = "failed";

        state.error = action.payload || "Failed to delete GST document.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearGSTError, clearSelectedGST, resetGSTState } =
  gstSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default gstSlice.reducer;
