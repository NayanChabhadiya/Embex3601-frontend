export const selectWorkspaceState = (state) => state.workspace;

export const selectWorkspaces = (state) => state.workspace?.workspaces ?? [];

export const selectSelectedWorkspace = (state) =>
  state.workspace?.selectedWorkspace ?? null;

export const selectWorkspaceStatus = (state) =>
  state.workspace?.status ?? "idle";

export const selectWorkspaceCreateStatus = (state) =>
  state.workspace?.createStatus ?? "idle";

export const selectWorkspaceUpdateStatus = (state) =>
  state.workspace?.updateStatus ?? "idle";

export const selectWorkspaceDeleteStatus = (state) =>
  state.workspace?.deleteStatus ?? "idle";

export const selectWorkspaceError = (state) => state.workspace?.error ?? null;
