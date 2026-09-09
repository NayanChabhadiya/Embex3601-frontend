const getResponseData = (response) => {
  if (!response || typeof response !== "object") {
    return null;
  }

  return response.data ?? null;
};

const getResponseStatus = (response) => {
  if (!response || typeof response !== "object") {
    return null;
  }

  return response.status ?? null;
};

const getResponseHeaders = (response) => {
  if (!response || typeof response !== "object") {
    return {};
  }

  return response.headers ?? {};
};

const isSuccessResponse = (response) => {
  const status = getResponseStatus(response);

  return typeof status === "number" && status >= 200 && status < 300;
};

const extractResponsePayload = (response) => {
  const data = getResponseData(response);

  if (data === null || data === undefined) {
    return null;
  }

  return data;
};

const extractResponseMessage = (response, fallback = "Request completed.") => {
  const data = getResponseData(response);

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data?.error?.message === "string" && data.error.message.trim()) {
    return data.error.message.trim();
  }

  return fallback;
};

const extractResponseError = (error) => {
  if (!error || typeof error !== "object") {
    return {
      message: "An unexpected error occurred.",
      status: null,
      code: null,
      details: null,
    };
  }

  const response = error.response;
  const responseData = response?.data;

  return {
    message:
      responseData?.message ||
      responseData?.error?.message ||
      error.message ||
      "An unexpected error occurred.",
    status: response?.status ?? null,
    code: responseData?.code || responseData?.error?.code || error.code || null,
    details: responseData?.details || responseData?.error?.details || null,
  };
};

export {
  getResponseData,
  getResponseStatus,
  getResponseHeaders,
  isSuccessResponse,
  extractResponsePayload,
  extractResponseMessage,
  extractResponseError,
};
