import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  sellings: [],
  status: null,
};

export const addSelling = createAsyncThunk(
  "/sellingSlice/addSelling",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-selling`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateSelling = createAsyncThunk(
  "/sellingSlice/updateSelling",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-selling`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getSellingsByUser = createAsyncThunk(
  "/sellingSlice/getSellingsByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-selling/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteSelling = createAsyncThunk(
  "/sellingSlice/deleteSelling",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-selling`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const sellingSlice = createSlice({
  name: "sellings",
  initialState: initialState,
  reducers: {
    clearSellingSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSellingsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSellingsByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.sellings = action?.payload?.data;
      })
      .addCase(getSellingsByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearSellingSlice } = sellingSlice.actions;
export default sellingSlice.reducer;
