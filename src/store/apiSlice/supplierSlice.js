import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  suppliers: [],
  status: null,
};

export const addSupplier = createAsyncThunk(
  "/supplierSlice/addSupplier",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-supplier`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateSupplier = createAsyncThunk(
  "/supplierSlice/updateSupplier",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-supplier`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const isVerified = createAsyncThunk(
  "/supplierSlice/isVerified",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/supplier-verification`,
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

export const isWhatsapp = createAsyncThunk(
  "/supplierSlice/isWhatsapp",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/supplier-whatsapp-verification`,
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

export const assignUniqueIdToSupplier = createAsyncThunk(
  "/supplierSlice/assignUniqueIdToSupplier",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/supplier-uniqueId`,
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

export const getSuppliersByUser = createAsyncThunk(
  "/supplierSlice/getSuppliersByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-supplier/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "/supplierSlice/deleteSupplier",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-supplier`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const supplierSlice = createSlice({
  name: "suppliers",
  initialState: initialState,
  reducers: {
    clearSupplierSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSuppliersByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSuppliersByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.suppliers = action?.payload?.data;
      })
      .addCase(getSuppliersByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearSupplierSlice } = supplierSlice.actions;
export default supplierSlice.reducer;
