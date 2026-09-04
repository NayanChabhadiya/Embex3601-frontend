import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  purchasedItems: [],
  status: null,
};

export const addPurchasedItem = createAsyncThunk(
  "/purchasedItemSlice/addPurchasedItem",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-purchasedItem`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updatePurchasedItem = createAsyncThunk(
  "/purchasedItemSlice/updatePurchasedItem",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-purchasedItem`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getPurchasedItemsByUser = createAsyncThunk(
  "/purchasedItemSlice/getPurchasedItemsByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(
        `/user/get-purchasedItem/${body}`,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deletePurchasedItem = createAsyncThunk(
  "/purchasedItemSlice/deletePurchasedItem",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-purchasedItem`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const purchasedItemSlice = createSlice({
  name: "purchasedItems",
  initialState: initialState,
  reducers: {
    clearPurchasedItemSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getPurchasedItemsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPurchasedItemsByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.purchasedItems = action?.payload?.data;
      })
      .addCase(getPurchasedItemsByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearPurchasedItemSlice } = purchasedItemSlice.actions;
export default purchasedItemSlice.reducer;
