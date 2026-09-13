const selectPlatformAdminState = (state) => state.platformAdmin;

export const selectPlatformAdminAccess = (state) =>
  selectPlatformAdminState(state).access;

export const selectPlatformAdminStatus = (state) =>
  selectPlatformAdminState(state).status;

export const selectPlatformAdminError = (state) =>
  selectPlatformAdminState(state).error;

export const selectIsPlatformAdmin = (state) =>
  selectPlatformAdminState(state).status === "succeeded" &&
  Boolean(selectPlatformAdminState(state).access);

export const selectIsPlatformAdminLoading = (state) =>
  selectPlatformAdminState(state).status === "loading";
