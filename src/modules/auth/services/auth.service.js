import {
  API_ENDPOINTS,
  extractResponseError,
  extractResponsePayload,
  get,
  post,
} from "../../../services";

const normalizeServiceError = (error) => {
  const normalizedError = extractResponseError(error);

  return {
    message: normalizedError.message,
    status: normalizedError.status,
    code: normalizedError.code,
    details: normalizedError.details,
  };
};

const login = async ({ email, password }) => {
  try {
    const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    return extractResponsePayload(response);
  } catch (error) {
    throw normalizeServiceError(error);
  }
};

const logout = async () => {
  try {
    const response = await post(API_ENDPOINTS.AUTH.LOGOUT);

    return extractResponsePayload(response);
  } catch (error) {
    throw normalizeServiceError(error);
  }
};

const refreshToken = async () => {
  try {
    const response = await post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);

    return extractResponsePayload(response);
  } catch (error) {
    throw normalizeServiceError(error);
  }
};

const getCurrentUser = async () => {
  try {
    const response = await get(API_ENDPOINTS.AUTH.CURRENT_USER);

    return extractResponsePayload(response);
  } catch (error) {
    throw normalizeServiceError(error);
  }
};

export { login, logout, refreshToken, getCurrentUser };
