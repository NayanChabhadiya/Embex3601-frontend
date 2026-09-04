import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader, authHeaderForm } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  users: [],
  status: null,
};

export const getUsers = createAsyncThunk("/userSlice/getUsers", async () => {
  try {
    const response = await axiosInstance.get(`/get-users`, {
      headers: authHeader(),
    });
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
});

export const registerUser = createAsyncThunk(
  "/userSlice/registerUser",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/register-user`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const addUser = createAsyncThunk("/userSlice/addUser", async (body) => {
  try {
    const response = await axiosInstance.post(`/add-user`, body, {
      headers: authHeader(),
    });
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
});

export const editUser = createAsyncThunk(
  "/userSlice/editUser",
  async (body) => {
    try {
      const response = await axiosInstance.put(`/edit-user/${body._id}`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const changePassword = createAsyncThunk(
  "/userSlice/changePassword",
  async (body) => {
    try {
      const response = await axiosInstance.put(
        `/change-password/${body._id}`,
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

export const deleteUser = createAsyncThunk(
  "/userSlice/deleteUser",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/delete-user`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    clearUserSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "success";
        state.users = action?.payload?.data;
      })
      .addCase(getUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearUserSlice } = userSlice.actions;
export default userSlice.reducer;
