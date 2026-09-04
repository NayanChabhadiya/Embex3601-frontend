import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  buyers: [],
  status: null,
};

export const addBuyer = createAsyncThunk(
  "/buyerSlice/addBuyer",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-buyer`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateBuyer = createAsyncThunk(
  "/buyerSlice/updateBuyer",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-buyer`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getBuyersByUser = createAsyncThunk(
  "/buyerSlice/getBuyersByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-buyer/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteBuyer = createAsyncThunk(
  "/buyerSlice/deleteBuyer",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-buyer`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const buyerSlice = createSlice({
  name: "buyers",
  initialState: initialState,
  reducers: {
    clearBuyerSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getBuyersByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBuyersByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.buyers = action?.payload?.data;
      })
      .addCase(getBuyersByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearBuyerSlice } = buyerSlice.actions;
export default buyerSlice.reducer;
