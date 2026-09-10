import apiClient from "../../../services/api/apiClient";

export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);

  return response.data;
};

export const refreshSession = async () => {
  const response = await apiClient.post("/auth/refresh");

  return response.data;
};
