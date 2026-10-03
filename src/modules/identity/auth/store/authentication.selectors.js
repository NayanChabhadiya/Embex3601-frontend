const selectAuthenticationState = (state) => state.authentication;

const selectCurrentUser = (state) => selectAuthenticationState(state).user;

const selectIsAuthenticated = (state) =>
  selectAuthenticationState(state).isAuthenticated;

const selectAuthenticationStatus = (state) =>
  selectAuthenticationState(state).status;

const selectAuthenticationError = (state) =>
  selectAuthenticationState(state).error;

const selectIsAuthenticationLoading = (state) =>
  selectAuthenticationStatus(state) === "loading";

const selectHasAuthenticationError = (state) =>
  Boolean(selectAuthenticationError(state));

export {
  selectAuthenticationState,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthenticationStatus,
  selectAuthenticationError,
  selectIsAuthenticationLoading,
  selectHasAuthenticationError,
};
