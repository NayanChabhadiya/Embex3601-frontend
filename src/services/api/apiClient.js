import axios from "axios";

import registerApiInterceptors from "./interceptors.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

registerApiInterceptors(apiClient);

export default apiClient;
