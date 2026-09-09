import apiClient from "./apiClient";

const REQUEST_INTERCEPTOR_ID = Symbol("request-interceptor");
const RESPONSE_INTERCEPTOR_ID = Symbol("response-interceptor");

const createInterceptorState = () => ({
  requestId: null,
  responseId: null,
});

const interceptorState = createInterceptorState();

const getAccessToken = () => {
  return null;
};

const registerRequestInterceptor = () => {
  if (interceptorState.requestId !== null) {
    return interceptorState.requestId;
  }

  const requestId = apiClient.interceptors.request.use(
    (config) => {
      const nextConfig = { ...config };

      const accessToken = getAccessToken();

      if (accessToken) {
        nextConfig.headers = {
          ...nextConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }

      return nextConfig;
    },
    (error) => Promise.reject(error),
  );

  interceptorState.requestId = requestId;

  return requestId;
};

const registerResponseInterceptor = () => {
  if (interceptorState.responseId !== null) {
    return interceptorState.responseId;
  }

  const responseId = apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  interceptorState.responseId = responseId;

  return responseId;
};

const registerApiInterceptors = () => {
  registerRequestInterceptor();
  registerResponseInterceptor();

  return {
    requestId: interceptorState.requestId,
    responseId: interceptorState.responseId,
    requestInterceptor: REQUEST_INTERCEPTOR_ID,
    responseInterceptor: RESPONSE_INTERCEPTOR_ID,
  };
};

const ejectApiInterceptors = () => {
  if (interceptorState.requestId !== null) {
    apiClient.interceptors.request.eject(interceptorState.requestId);
    interceptorState.requestId = null;
  }

  if (interceptorState.responseId !== null) {
    apiClient.interceptors.response.eject(interceptorState.responseId);
    interceptorState.responseId = null;
  }
};

export { registerApiInterceptors, ejectApiInterceptors };
