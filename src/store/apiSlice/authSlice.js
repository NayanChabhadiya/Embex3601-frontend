import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader, logout, setSession } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  user: {},
  isLoggedIn: false,
};

export const setSessionData = (token, authUser) => {
  const sessionData = {
    access_token: token,
    authUser: authUser,
  };
  setSession(sessionData);
};

export const logIn = createAsyncThunk("authSlice/logIn", async (body) => {
  try {
    const response = await axiosInstance.post("/user/login", body, {
      headers: authHeader(),
    });

    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
});

export const verifyRegisterOtp = createAsyncThunk(
  "./authSlice/verifyRegisterOtp",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/verify-register-user-otp`,
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

export const resendVerifyRegisterOtp = createAsyncThunk(
  "/authSlice/resendVerifyRegisterOtp",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/resend-verify-register-otp`,
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

export const forgotPassword = createAsyncThunk(
  "/authSlice/forgotPassword",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/forgot-password`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  "/authSlice/verifyForgotPasswordOtp",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/verify-forgot-password-otp`,
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

export const resendForgotPasswordOtp = createAsyncThunk(
  "/authSlice/resendForgotPasswordOtp",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/resend-forgot-password-otp`,
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

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = {};
      state.isLoggedIn = false;
      setSessionData({});
      logout();
    },
    loginUser: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.authUser;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.user = {};
        state.isLoggedIn = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        const token = action?.payload?.token;
        let authUser = action?.payload?.data;
        if (token) {
          state.isLoggedIn = true;
          state.user = authUser;
          setSessionData(token, authUser);
          localStorage.setItem("authUser", JSON.stringify(authUser));
          localStorage.setItem("token", JSON.stringify(token));
        }
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action?.payload?.message;
        state.isLoggedIn = false;
        state.user = {};
      });
  },
});

export const { logoutUser, loginUser } = authSlice.actions;
export default authSlice.reducer;
