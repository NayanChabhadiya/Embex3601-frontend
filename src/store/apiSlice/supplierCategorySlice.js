import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  supplierCategories: [],
  status: null,
};

export const addSupplierCategory = createAsyncThunk(
  "/supplierCategorySlice/addSupplierCategory",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-supplier-category`,
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
export const updateSupplierCategory = createAsyncThunk(
  "/supplierCategorySlice/updateSupplierCategory",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-supplier-category`,
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
export const updateSupplierCategoryStatus = createAsyncThunk(
  "/supplierCategorySlice/updateSupplierCategoryStatus",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/supplier-category-activation`,
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

export const getSupplierCategoriesByUser = createAsyncThunk(
  "/supplierCategorySlice/getSupplierCategoriesByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(
        `/user/get-supplier-category/${body}`,
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

export const deleteSupplierCategory = createAsyncThunk(
  "/supplierCategorySlice/deleteSupplierCategory",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-supplier-category`,
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

const supplierCategorySlice = createSlice({
  name: "supplierCategories",
  initialState: initialState,
  reducers: {
    clearSupplierCategorySlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSupplierCategoriesByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSupplierCategoriesByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.supplierCategories = action?.payload?.data;
      })
      .addCase(getSupplierCategoriesByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearSupplierCategorySlice } = supplierCategorySlice.actions;
export default supplierCategorySlice.reducer;
