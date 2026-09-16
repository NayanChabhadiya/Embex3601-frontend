import { createSlice } from "@reduxjs/toolkit";

import { fetchFeatures } from "./feature.thunks.js";

const initialState = Object.freeze({
  features: [],
  meta: null,
  status: "idle",
  error: null,
  currentRequestId: null,
});

const featureSlice = createSlice({
  name: "features",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) {
          return;
        }

        state.status = "succeeded";
        state.features = action.payload?.features ?? [];
        state.meta = action.payload?.meta ?? null;
        state.error = null;
        state.currentRequestId = null;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        if (
          action.meta.requestId &&
          state.currentRequestId !== action.meta.requestId
        ) {
          return;
        }

        state.status = "failed";
        state.error = action.payload ?? "Unable to fetch features.";
        state.currentRequestId = null;
      });
  },
});

export default featureSlice.reducer;
