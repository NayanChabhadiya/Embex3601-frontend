const registerApiInterceptors = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      config.headers = config.headers ?? {};

      config.headers.Accept = "application/json";

      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      const accessToken = localStorage.getItem("embex360_access_token");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },

    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      return Promise.reject(error);
    },
  );
};

export default registerApiInterceptors;
