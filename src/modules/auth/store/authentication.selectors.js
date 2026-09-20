export const selectAuthentication = (state) => state.authentication;

export const selectAuthUser = (state) => state.authentication.user;

export const selectAuthSession = (state) => state.authentication.session;

export const selectIsAuthenticated = (state) =>
  state.authentication.isAuthenticated;

export const selectAuthenticationStatus = (state) =>
  state.authentication.status;

export const selectAuthenticationError = (state) => state.authentication.error;
