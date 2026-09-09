import env from "./env";

const appConfig = Object.freeze({
  app: Object.freeze({
    name: env.appName,
    version: env.appVersion,
    environment: env.mode,
    isDevelopment: env.isDevelopment,
    isProduction: env.isProduction,
  }),

  api: Object.freeze({
    baseUrl: env.apiBaseUrl,
    timeout: env.apiTimeout,
  }),

  security: Object.freeze({
    enableDebugLogging: env.enableDebugLogging,
  }),
});

export default appConfig;
