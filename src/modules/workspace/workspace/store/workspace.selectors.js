// =============================================================================
// Workspace Selectors
// =============================================================================

const selectWorkspaceState = (state) => state.workspace;

export const selectWorkspaces = (state) =>
  selectWorkspaceState(state).workspaces;

export const selectCurrentWorkspace = (state) =>
  selectWorkspaceState(state).currentWorkspace;

export const selectWorkspacePagination = (state) =>
  selectWorkspaceState(state).pagination;

export const selectWorkspaceListStatus = (state) =>
  selectWorkspaceState(state).listStatus;

export const selectIsWorkspaceListLoading = (state) =>
  selectWorkspaceState(state).listStatus === "loading";

export const selectWorkspaceCreateStatus = (state) =>
  selectWorkspaceState(state).createStatus;

export const selectIsWorkspaceCreating = (state) =>
  selectWorkspaceState(state).createStatus === "loading";

export const selectWorkspaceCreateSuccess = (state) =>
  selectWorkspaceState(state).createSuccess;

export const selectWorkspaceListError = (state) =>
  selectWorkspaceState(state).listError;

export const selectWorkspaceCreateError = (state) =>
  selectWorkspaceState(state).createError;

export default selectWorkspaceState;
