export const selectUsers = (state) => state.user?.users ?? [];

export const selectUser = (state) => state.user?.selectedUser ?? null;

export const selectUserStatus = (state) => state.user?.status ?? "idle";

export const selectUserError = (state) => state.user?.error ?? null;
