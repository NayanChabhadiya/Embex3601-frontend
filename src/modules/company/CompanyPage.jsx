import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Input,
  Select,
  Textarea,
  Table,
  Modal,
  PageHeader,
} from "../../components/common";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import { createCompany, getCompanies } from "./store/company.thunks.js";

import {
  selectCompanies,
  selectCompanyPagination,
  selectIsCompanyListLoading,
  selectCompanyListError,
  selectIsCompanyCreating,
} from "./store/company.selectors.js";

import {
  COMPANY_TYPES,
  COMPANY_LIMITS,
} from "./constants/company.constants.js";

import COMPANY_MESSAGES from "./constants/company.messages.js";

import {
  validateCreateCompany,
  validateCompanyList,
} from "./validations/company.validation.js";

import { getAccounts } from "../account/account/store/account.thunks.js";

import {
  selectAccounts,
  selectIsAccountListLoading,
  selectAccountListError,
} from "../account/account/store/account.selectors.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = {
  name: "",
  code: "",
  legalName: "",
  type: "proprietorship",
  description: "",
  gstin: "",
  pan: "",
  cin: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

// =============================================================================
// Company Page
// =============================================================================

const CompanyPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Redux State
  const companies = useSelector(selectCompanies);
  const pagination = useSelector(selectCompanyPagination);
  const isListLoading = useSelector(selectIsCompanyListLoading);
  const listError = useSelector(selectCompanyListError);
  const isCreating = useSelector(selectIsCompanyCreating);

  const accounts = useSelector(selectAccounts);
  const isAccountListLoading = useSelector(selectIsAccountListLoading);
  const accountListError = useSelector(selectAccountListError);

  // Local State
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch Accounts
  useEffect(() => {
    dispatch(getAccounts({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Fetch Companies
  const fetchCompanies = (params = {}) => {
    if (!selectedAccountId) return;

    dispatch(
      getCompanies({
        accountId: selectedAccountId,
        page: params.page ?? 1,
        limit: params.limit ?? pagination?.limit ?? 20,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      }),
    );
  };

  // Form Change
  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  // Account Change
  const handleAccountChange = (event) => {
    const accountId = event.target.value;

    setSelectedAccountId(accountId);
    setSearch("");
    setFilters({});

    if (accountId) {
      dispatch(
        getCompanies({
          accountId,
          page: 1,
          limit: 20,
        }),
      );
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!selectedAccountId) {
      showToast({
        type: "error",
        message: "Please select an account first.",
      });
      return;
    }

    setForm(INITIAL_FORM);
    setErrors({});
    setIsModalOpen(true);
  };

  // Close Create Modal
  const handleCloseCreate = () => {
    if (isCreating) return;

    setForm(INITIAL_FORM);
    setErrors({});
    setIsModalOpen(false);
  };

  // Create Company
  const handleCreate = async (event) => {
    event.preventDefault();

    if (!selectedAccountId) {
      showToast({
        type: "error",
        message: "Please select an account first.",
      });
      return;
    }

    const validationErrors = validateCreateCompany(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      accountId: selectedAccountId,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      legalName: form.legalName.trim() || form.name.trim(),
      type: form.type,
      description: form.description.trim() || null,
      gstin: form.gstin.trim().toUpperCase() || null,
      pan: form.pan.trim().toUpperCase() || null,
      cin: form.cin.trim().toUpperCase() || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      country: form.country.trim() || null,
      pincode: form.pincode.trim() || null,
    };

    const result = await dispatch(createCompany(payload));

    if (createCompany.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: COMPANY_MESSAGES.CREATED,
      });

      setForm(INITIAL_FORM);
      setErrors({});
      setIsModalOpen(false);
      setSearch("");

      dispatch(
        getCompanies({
          accountId: selectedAccountId,
          page: 1,
          limit: pagination?.limit ?? 20,
        }),
      );

      return;
    }

    const errorPayload = result.payload;
    const errorMessage =
      typeof errorPayload === "string"
        ? errorPayload
        : errorPayload?.message || COMPANY_MESSAGES.CREATE_FAILED;

    if (errorPayload?.errors && typeof errorPayload.errors === "object") {
      setErrors((previous) => ({
        ...previous,
        ...errorPayload.errors,
      }));
    }

    showToast({
      type: "error",
      title:
        errorPayload?.errorCode === "COMPANY_LIMIT_REACHED"
          ? "Company Limit Reached"
          : undefined,
      message: errorMessage,
    });
  };

  // Search
  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (!selectedAccountId) return;

    dispatch(
      getCompanies({
        accountId: selectedAccountId,
        page: 1,
        limit: pagination?.limit ?? 20,
        ...(value.trim() ? { search: value.trim() } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      }),
    );
  };

  // Filters
  const handleFilterChange = (field, event) => {
    const value = event.target.value;

    const nextFilters = {
      ...filters,
      [field]: value,
    };

    if (!value) {
      delete nextFilters[field];
    }

    setFilters(nextFilters);

    if (!selectedAccountId) return;

    dispatch(
      getCompanies({
        accountId: selectedAccountId,
        page: 1,
        limit: pagination?.limit ?? 20,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(nextFilters.type ? { type: nextFilters.type } : {}),
        ...(nextFilters.status ? { status: nextFilters.status } : {}),
      }),
    );
  };

  // Pagination
  const handlePageChange = (page) => {
    const validationErrors = validateCompanyList({
      page,
      limit: pagination?.limit ?? 20,
    });

    if (Object.keys(validationErrors).length > 0) {
      showToast({
        type: "error",
        message: "Invalid pagination parameters.",
      });
      return;
    }

    fetchCompanies({ page });
  };

  // Table Columns
  const columns = useMemo(
    () => [
      { key: "name", label: "Company Name" },
      { key: "code", label: "Code" },
      { key: "legalName", label: "Legal Name" },
      { key: "type", label: "Type" },
      { key: "gstin", label: "GSTIN" },
      { key: "status", label: "Status" },
      {
        key: "createdAt",
        label: "Created At",
        render: (company) =>
          company.createdAt
            ? new Date(company.createdAt).toLocaleDateString()
            : "-",
      },
    ],
    [],
  );

  // Select Options
  const typeOptions = [
    {
      value: "",
      label: "All Company Types",
    },
    ...Object.values(COMPANY_TYPES).map((type) => ({
      value: type,
      label: type
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase()),
    })),
  ];

  const statusOptions = [
    {
      value: "",
      label: "All Statuses",
    },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const accountOptions = accounts.map((account) => ({
    value: account._id,
    label: account.name,
  }));

  // Render
  return (
    <>
      <PageHeader
        title="Companies"
        description="Manage companies under your account."
        actions={
          <Button type="button" variant="primary" onClick={handleOpenCreate}>
            Create Company
          </Button>
        }
      />

      {/* Account Selection */}
      <div className="page-section">
        <Select
          label="Select Account"
          value={selectedAccountId}
          options={accountOptions}
          onChange={handleAccountChange}
          placeholder="Select an account"
          required
          disabled={isAccountListLoading}
        />

        {isAccountListLoading && <p>Loading accounts...</p>}

        {accountListError && (
          <p role="alert">
            {typeof accountListError === "string"
              ? accountListError
              : accountListError.message || "Failed to load accounts."}
          </p>
        )}
      </div>

      {/* Company List */}
      <div className="page-section">
        <div className="table-toolbar">
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search companies..."
            disabled={!selectedAccountId}
          />

          <Select
            label="Filter by type"
            value={filters.type || ""}
            options={typeOptions}
            onChange={(event) => handleFilterChange("type", event)}
            placeholder="All company types"
            disabled={!selectedAccountId}
          />

          <Select
            label="Filter by status"
            value={filters.status || ""}
            options={statusOptions}
            onChange={(event) => handleFilterChange("status", event)}
            placeholder="All statuses"
            disabled={!selectedAccountId}
          />
        </div>

        <Table
          columns={columns}
          data={selectedAccountId ? companies : []}
          loading={Boolean(selectedAccountId) && isListLoading}
          emptyMessage={
            !selectedAccountId
              ? "Please select an account to view companies."
              : listError || "No companies found."
          }
          pagination={{
            page: pagination?.page || 1,
            limit: pagination?.limit || 20,
            total: pagination?.total || 0,
            totalPages: pagination?.totalPages || 0,
            hasNextPage: pagination?.hasNextPage || false,
            hasPreviousPage: pagination?.hasPreviousPage || false,
          }}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Create Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseCreate}
        title="Create Company"
      >
        <form onSubmit={handleCreate}>
          <div className="form-section">
            <Input
              label="Company Name"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              error={errors.name}
              required
              disabled={isCreating}
            />

            <Input
              label="Company Code"
              value={form.code}
              onChange={(event) =>
                handleChange("code", event.target.value.toUpperCase())
              }
              error={errors.code}
              required
              disabled={isCreating}
            />

            <Input
              label="Legal Name"
              value={form.legalName}
              onChange={(event) =>
                handleChange("legalName", event.target.value)
              }
              error={errors.legalName}
              disabled={isCreating}
            />

            <Select
              label="Company Type"
              value={form.type}
              options={typeOptions}
              onChange={(event) => handleChange("type", event.target.value)}
              error={errors.type}
              required
              disabled={isCreating}
            />

            <Input
              label="GSTIN"
              value={form.gstin}
              onChange={(event) =>
                handleChange("gstin", event.target.value.toUpperCase())
              }
              error={errors.gstin}
              disabled={isCreating}
            />

            <Input
              label="PAN"
              value={form.pan}
              onChange={(event) =>
                handleChange("pan", event.target.value.toUpperCase())
              }
              error={errors.pan}
              disabled={isCreating}
            />

            <Input
              label="CIN"
              value={form.cin}
              onChange={(event) =>
                handleChange("cin", event.target.value.toUpperCase())
              }
              error={errors.cin}
              disabled={isCreating}
            />

            <Input
              label="Email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              error={errors.email}
              disabled={isCreating}
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              error={errors.phone}
              disabled={isCreating}
            />

            <Textarea
              label="Address"
              value={form.address}
              onChange={(event) => handleChange("address", event.target.value)}
              error={errors.address}
              rows={3}
              disabled={isCreating}
            />

            <Input
              label="City"
              value={form.city}
              onChange={(event) => handleChange("city", event.target.value)}
              error={errors.city}
              disabled={isCreating}
            />

            <Input
              label="State"
              value={form.state}
              onChange={(event) => handleChange("state", event.target.value)}
              error={errors.state}
              disabled={isCreating}
            />

            <Input
              label="Country"
              value={form.country}
              onChange={(event) => handleChange("country", event.target.value)}
              error={errors.country}
              disabled={isCreating}
            />

            <Input
              label="Pincode"
              value={form.pincode}
              onChange={(event) => handleChange("pincode", event.target.value)}
              error={errors.pincode}
              disabled={isCreating}
            />

            <Textarea
              label="Description"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              error={errors.description}
              rows={3}
              disabled={isCreating}
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseCreate}
              disabled={isCreating}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isCreating} disabled={isCreating}>
              Create Company
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CompanyPage;
