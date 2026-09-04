import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  items: [],
  status: null,
};

export const addItem = createAsyncThunk("/itemSlice/addItem", async (body) => {
  try {
    const response = await axiosInstance.post(`/user/add-item`, body, {
      headers: authHeader(),
    });
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
});
export const updateItem = createAsyncThunk(
  "/itemSlice/updateItem",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-item`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getItemsByUser = createAsyncThunk(
  "/itemSlice/getItemsByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-item/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteItem = createAsyncThunk(
  "/itemSlice/deleteItem",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-item`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const itemSlice = createSlice({
  name: "items",
  initialState: initialState,
  reducers: {
    clearItemSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getItemsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getItemsByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action?.payload?.data;
      })
      .addCase(getItemsByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearItemSlice } = itemSlice.actions;
export default itemSlice.reducer;
