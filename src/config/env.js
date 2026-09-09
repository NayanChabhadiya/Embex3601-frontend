const getEnvValue = (key) => {
  const value = import.meta.env[key];

  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const getBooleanEnvValue = (key, defaultValue = false) => {
  const value = getEnvValue(key);

  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === "true";
};

const getNumberEnvValue = (key, defaultValue) => {
  const value = getEnvValue(key);

  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
};

const getRequiredEnvValue = (key) => {
  const value = getEnvValue(key);

  if (value === undefined) {
    throw new Error(`Missing required frontend environment variable: ${key}`);
  }

  return value;
};

const env = Object.freeze({
  mode: import.meta.env.MODE || "production",
  isDevelopment: import.meta.env.DEV === true,
  isProduction: import.meta.env.PROD === true,

  apiBaseUrl: getRequiredEnvValue("VITE_API_BASE_URL"),

  apiTimeout: getNumberEnvValue("VITE_API_TIMEOUT", 15000),

  enableDebugLogging: getBooleanEnvValue("VITE_ENABLE_DEBUG_LOGGING", false),

  appName: getEnvValue("VITE_APP_NAME") || "Embex360",

  appVersion: getEnvValue("VITE_APP_VERSION") || "1.0.0",
});

export default env;
