import apiClient from "./apiClient";

const request = async ({
  method = "GET",
  url,
  data,
  params,
  headers,
  signal,
  timeout,
}) => {
  if (typeof url !== "string" || url.trim().length === 0) {
    throw new TypeError("API request URL is required.");
  }

  const config = {
    method: method.toUpperCase(),
    url,
  };

  if (data !== undefined) {
    config.data = data;
  }

  if (params !== undefined) {
    config.params = params;
  }

  if (headers !== undefined) {
    config.headers = headers;
  }

  if (signal !== undefined) {
    config.signal = signal;
  }

  if (timeout !== undefined) {
    config.timeout = timeout;
  }

  const response = await apiClient.request(config);

  return response;
};

const get = (url, options = {}) =>
  request({
    method: "GET",
    url,
    ...options,
  });

const post = (url, data, options = {}) =>
  request({
    method: "POST",
    url,
    data,
    ...options,
  });

const put = (url, data, options = {}) =>
  request({
    method: "PUT",
    url,
    data,
    ...options,
  });

const patch = (url, data, options = {}) =>
  request({
    method: "PATCH",
    url,
    data,
    ...options,
  });

const del = (url, options = {}) =>
  request({
    method: "DELETE",
    url,
    ...options,
  });

export { request, get, post, put, patch, del };
