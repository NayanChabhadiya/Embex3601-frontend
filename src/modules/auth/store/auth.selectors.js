export const selectAuthState = (state) => state.auth;

export const selectIsAuthenticated = (state) =>
  Boolean(state.auth?.isAuthenticated);

export const selectAuthUser = (state) => state.auth?.user ?? null;

export const selectAuthAccessToken = (state) => state.auth?.accessToken ?? null;
