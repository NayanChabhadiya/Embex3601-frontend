const selectAuthState = (state) => state.auth;

const selectAuthStatus = (state) => state.auth?.status ?? null;

const selectIsAuthenticated = (state) => state.auth?.isAuthenticated === true;

const selectCurrentUser = (state) => state.auth?.user ?? null;

const selectAuthError = (state) => state.auth?.error ?? null;

const selectIsAuthLoading = (state) => state.auth?.status === "loading";

const selectIsAuthInitialized = (state) => state.auth?.status !== "idle";

export {
  selectAuthState,
  selectAuthStatus,
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthError,
  selectIsAuthLoading,
  selectIsAuthInitialized,
};
