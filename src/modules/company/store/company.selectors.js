// =============================================================================
// Company Selectors
// =============================================================================

const selectCompanyState = (state) => state.company;

export const selectCompanies = (state) => selectCompanyState(state).companies;

export const selectCurrentCompany = (state) =>
  selectCompanyState(state).currentCompany;

export const selectCompanyPagination = (state) =>
  selectCompanyState(state).pagination;

export const selectCompanyListStatus = (state) =>
  selectCompanyState(state).listStatus;

export const selectIsCompanyListLoading = (state) =>
  selectCompanyState(state).listStatus === "loading";

export const selectCompanyCreateStatus = (state) =>
  selectCompanyState(state).createStatus;

export const selectIsCompanyCreating = (state) =>
  selectCompanyState(state).createStatus === "loading";

export const selectCompanyCreateSuccess = (state) =>
  selectCompanyState(state).createSuccess;

export const selectCompanyListError = (state) =>
  selectCompanyState(state).listError;

export const selectCompanyCreateError = (state) =>
  selectCompanyState(state).createError;

export default selectCompanyState;
