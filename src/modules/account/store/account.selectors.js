export const selectAccounts = (state) => state.account?.accounts ?? [];

export const selectAccount = (state) => state.account?.selectedAccount ?? null;

export const selectAccountStatus = (state) => state.account?.status ?? "idle";

export const selectAccountError = (state) => state.account?.error ?? null;
