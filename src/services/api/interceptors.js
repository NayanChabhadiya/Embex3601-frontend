import store from "../../store";
import {
  logoutSuccess,
  updateAccessToken,
} from "../../modules/auth/store/auth.slice";
import API_ENDPOINTS from "./endpoints";

const REFRESH_ENDPOINT = API_ENDPOINTS.AUTH.REFRESH;

const SKIP_AUTH_HEADER = "skipAuthHeader";
const SKIP_AUTH_REFRESH = "skipAuthRefresh";

let refreshPromise = null;

const getAccessToken = () => {
  return store.getState()?.auth?.accessToken ?? null;
};

const isRefreshRequest = (config) => {
  const url = config?.url ?? "";

  return (
    config?.[SKIP_AUTH_REFRESH] === true ||
    url === REFRESH_ENDPOINT ||
    url.endsWith(REFRESH_ENDPOINT)
  );
};

const refreshAccessToken = async (apiClient) => {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post(REFRESH_ENDPOINT, undefined, {
        [SKIP_AUTH_HEADER]: true,
        [SKIP_AUTH_REFRESH]: true,
      })
      .then((response) => {
        const accessToken = response?.data?.data?.accessToken ?? null;

        if (!accessToken) {
          throw new Error(
            "Authentication refresh did not return an access token.",
          );
        }

        store.dispatch(
          updateAccessToken({
            accessToken,
          }),
        );

        return accessToken;
      })
      .catch((error) => {
        store.dispatch(logoutSuccess());
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

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

      if (!config[SKIP_AUTH_HEADER]) {
        const accessToken = getAccessToken();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (isRefreshRequest(originalRequest)) {
        return Promise.reject(error);
      }

      if (status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest._authRetry === true) {
        store.dispatch(logoutSuccess());

        return Promise.reject(error);
      }

      originalRequest._authRetry = true;

      try {
        const accessToken = await refreshAccessToken(apiClient);

        originalRequest.headers = originalRequest.headers ?? {};

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );
};

export default registerApiInterceptors;
