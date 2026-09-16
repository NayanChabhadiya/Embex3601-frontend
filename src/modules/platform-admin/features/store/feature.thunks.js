import { createAsyncThunk } from "@reduxjs/toolkit";

import featureService from "../services/feature.service.js";

export const fetchFeatures = createAsyncThunk(
  "features/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await featureService.getFeatures(params);

      return {
        features: response.data?.data ?? [],
        meta: response.data?.meta ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch features.",
      );
    }
  },
);

export default fetchFeatures;
