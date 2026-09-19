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

      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );
};

export default registerApiInterceptors;
