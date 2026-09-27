// -----------------------------------------------------------------------------
// Profile State Selector
// -----------------------------------------------------------------------------

const selectProfileState = (state) => state.profile;

// -----------------------------------------------------------------------------
// Profile
// -----------------------------------------------------------------------------

export const selectProfile = (state) => selectProfileState(state).profile;

// -----------------------------------------------------------------------------
// Profile Loading
// -----------------------------------------------------------------------------

export const selectProfileLoading = (state) =>
  selectProfileState(state).loading;

// -----------------------------------------------------------------------------
// Profile Error
// -----------------------------------------------------------------------------

export const selectProfileError = (state) => selectProfileState(state).error;

// -----------------------------------------------------------------------------
// Profile Helpers
// -----------------------------------------------------------------------------

export const selectHasProfile = (state) => Boolean(selectProfile(state));

export const selectHasProfileError = (state) =>
  Boolean(selectProfileError(state));

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

const profileSelectors = Object.freeze({
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectHasProfile,
  selectHasProfileError,
});

export default profileSelectors;
