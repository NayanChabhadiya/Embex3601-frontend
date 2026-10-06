import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  PageContainer,
  PageHeader,
  Table,
  Modal,
  FormField,
  Input,
  Select,
  Button,
  Badge,
  useToast,
} from "../../../components/common";
import { createAccount, getAccounts } from "../../store/account.thunks.js";

import {
  selectAccounts,
  selectAccountPagination,
  selectAccountListStatus,
  selectIsAccountListLoading,
  selectAccountListError,
  selectIsAccountCreating,
  selectAccountCreateError,
  selectAccountCreateSuccess,
} from "../store/account.selectors.js";

import {
  ACCOUNT_TYPES,
  ACCOUNT_STATUS,
} from "../constants/account.constants.js";

import ACCOUNT_MESSAGES from "../constants/account.messages.js";

import { validateCreateAccount } from "../validations/account.validation.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = Object.freeze({
  name: "",
  code: "",
  type: ACCOUNT_TYPES.BUSINESS,
});

// =============================================================================
// Account Page
// =============================================================================

function AccountPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const accounts = useSelector(selectAccounts);

  const pagination = useSelector(selectAccountPagination);

  const listStatus = useSelector(selectAccountListStatus);

  const loading = useSelector(selectIsAccountListLoading);

  const error = useSelector(selectAccountListError);

  const submitting = useSelector(selectIsAccountCreating);

  const createError = useSelector(selectAccountCreateError);

  const createSuccess = useSelector(selectAccountCreateSuccess);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);

  const [formErrors, setFormErrors] = useState({});

  const [search, setSearch] = useState("");

  // =============================================================================
  // Initial Account Fetch
  // =============================================================================

  useEffect(() => {
    dispatch(
      getAccounts({
        page: 1,
        limit: pagination?.limit || 20,
      }),
    );
  }, [dispatch]);

  // =============================================================================
  // Select Options
  // =============================================================================

  const accountTypeOptions = useMemo(
    () => [
      {
        value: ACCOUNT_TYPES.BUSINESS,
        label: "Business",
      },
    ],
    [],
  );

  // =============================================================================
  // Form Handlers
  // =============================================================================

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  // =============================================================================
  // Open Create Modal
  // =============================================================================

  const handleOpenCreateModal = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // =============================================================================
  // Close Create Modal
  // =============================================================================

  const handleCloseCreateModal = () => {
    if (submitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setForm(INITIAL_FORM);
    setFormErrors({});
  };

  // =============================================================================
  // Submit
  // =============================================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // -------------------------------------------------------------------------
    // Client-side payload
    // -------------------------------------------------------------------------
    // IMPORTANT:
    // subscriptionId, ownerId, status and other protected fields are
    // intentionally NOT included.
    // Backend derives subscription and ownership from authenticated user.

    const values = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
    };

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    const validationErrors = validateCreateAccount(values);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    // -------------------------------------------------------------------------
    // Create Account
    // -------------------------------------------------------------------------

    const result = await dispatch(createAccount(values));

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    if (createAccount.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Account Created",
        message: ACCOUNT_MESSAGES.CREATED || "Account created successfully.",
      });

      setIsCreateModalOpen(false);
      setForm(INITIAL_FORM);
      setFormErrors({});

      // -----------------------------------------------------------------------
      // Refetch current page
      // -----------------------------------------------------------------------
      // The list remains pagination-authoritative.
      // We intentionally do not manually prepend the newly created account.

      dispatch(
        getAccounts({
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          search,
        }),
      );

      return;
    }

    // -------------------------------------------------------------------------
    // Backend Validation Errors
    // -------------------------------------------------------------------------

    if (result.payload?.errors) {
      setFormErrors(result.payload.errors);
    }

    // -------------------------------------------------------------------------
    // Error Toast
    // -------------------------------------------------------------------------

    showToast({
      type: "error",
      title: "Create Account Failed",
      message:
        result.payload?.message ||
        createError ||
        ACCOUNT_MESSAGES.CREATE_FAILED ||
        "Failed to create account.",
    });
  };

  // =============================================================================
  // Pagination
  // =============================================================================

  const handlePageChange = (page) => {
    dispatch(
      getAccounts({
        page,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  };

  const handleLimitChange = (limit) => {
    dispatch(
      getAccounts({
        page: 1,
        limit,
        search,
      }),
    );
  };

  // =============================================================================
  // Search
  // =============================================================================

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getAccounts({
        page: 1,
        limit: pagination?.limit || 20,
        search: value,
      }),
    );
  };

  // =============================================================================
  // Badge Helpers
  // =============================================================================

  const getStatusVariant = (status) => {
    if (status === ACCOUNT_STATUS.ACTIVE) {
      return "success";
    }

    if (status === ACCOUNT_STATUS.SUSPENDED) {
      return "warning";
    }

    return "neutral";
  };

  const getTypeVariant = (type) => {
    if (type === ACCOUNT_TYPES.BUSINESS) {
      return "primary";
    }

    return "neutral";
  };

  // =============================================================================
  // Table Columns
  // =============================================================================

  const columns = [
    {
      key: "name",
      label: "Account Name",
      render: (account) => account.name || "-",
    },

    {
      key: "code",
      label: "Code",
      render: (account) => account.code || "-",
    },

    {
      key: "type",
      label: "Type",
      render: (account) => (
        <Badge variant={getTypeVariant(account.type)}>
          {account.type || "-"}
        </Badge>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (account) => (
        <Badge variant={getStatusVariant(account.status)}>
          {account.status || "-"}
        </Badge>
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (account) =>
        account.createdAt ? new Date(account.createdAt).toLocaleString() : "-",
    },
  ];

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <PageContainer>
      {/* --------------------------------------------------------------------- */}
      {/* Page Header                                                          */}
      {/* --------------------------------------------------------------------- */}

      <PageHeader
        title="Accounts"
        description="Manage your business accounts."
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create Account
          </Button>
        }
      />

      {/* --------------------------------------------------------------------- */}
      {/* Account Table                                                        */}
      {/* --------------------------------------------------------------------- */}

      <Table
        title="Account List"
        columns={columns}
        data={accounts}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search accounts..."
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={
          error || ACCOUNT_MESSAGES.LIST_FAILED || "No accounts found."
        }
      />

      {/* --------------------------------------------------------------------- */}
      {/* Create Account Modal                                                 */}
      {/* --------------------------------------------------------------------- */}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create Account"
        size="medium"
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseCreateModal}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="create-account-form"
              variant="primary"
              loading={submitting}
              loadingText="Creating..."
            >
              Create Account
            </Button>
          </>
        }
      >
        <form id="create-account-form" onSubmit={handleSubmit}>
          {/* ----------------------------------------------------------------- */}
          {/* Account Name                                                      */}
          {/* ----------------------------------------------------------------- */}

          <FormField
            label="Account Name"
            name="name"
            required
            error={formErrors.name}
          >
            <Input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Enter account name"
              required
              disabled={submitting}
              autoComplete="organization"
            />
          </FormField>

          {/* ----------------------------------------------------------------- */}
          {/* Account Code                                                      */}
          {/* ----------------------------------------------------------------- */}

          <FormField
            label="Account Code"
            name="code"
            required
            error={formErrors.code}
          >
            <Input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              placeholder="Enter account code"
              required
              disabled={submitting}
              autoComplete="off"
            />
          </FormField>

          {/* ----------------------------------------------------------------- */}
          {/* Account Type                                                      */}
          {/* ----------------------------------------------------------------- */}

          <FormField
            label="Account Type"
            name="type"
            required
            error={formErrors.type}
          >
            <Select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              options={accountTypeOptions}
              placeholder="Select account type"
              required
              disabled={submitting}
            />
          </FormField>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default AccountPage;
