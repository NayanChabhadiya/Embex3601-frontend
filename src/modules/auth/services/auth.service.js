import apiClient from "../../../services/api/apiClient";
import API_ENDPOINTS from "../../../services/api/endpoints";

const REFRESH_REQUEST_CONFIG = Object.freeze({
  skipAuthHeader: true,
  skipAuthRefresh: true,
});

export const login = async (credentials) => {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

export const refreshToken = async () => {
  return apiClient.post(
    API_ENDPOINTS.AUTH.REFRESH,
    undefined,
    REFRESH_REQUEST_CONFIG,
  );
};

export const logout = async () => {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};

export const getCurrentUser = async () => {
  return apiClient.get(API_ENDPOINTS.AUTH.ME);
};
