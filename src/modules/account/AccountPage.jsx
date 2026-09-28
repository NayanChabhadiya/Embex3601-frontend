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
  Loader,
} from "../../components/common";

import {
  createAccount,
  getAccounts,
  getAccountById,
} from "./store/account.thunks.js";

import {
  selectAccounts,
  selectAccountPagination,
  selectAccountListLoading,
  selectAccountListError,
  selectSelectedAccount,
  selectAccountDetailsLoading,
  selectAccountDetailsError,
  selectAccountCreateLoading,
} from "./store/account.selectors.js";

import {
  ACCOUNT_TYPES,
  ACCOUNT_STATUS,
  ACCOUNT_VERIFICATION_STATUS,
  ACCOUNT_PLAN_STATUS,
} from "./constants/account.constants.js";

import { validateCreateAccount } from "./validations/account.validation.js";

import ACCOUNT_MESSAGES from "./constants/account.messages.js";

import { ViewIcon } from "../../components/common/icons";

const INITIAL_FORM = {
  name: "",
  slug: "",
  type: ACCOUNT_TYPES.BUSINESS,
  description: "",
  email: "",
  phone: "",
};

function AccountPage() {
  const dispatch = useDispatch();

  // ===========================================================================
  // Redux State
  // ===========================================================================

  const accounts = useSelector(selectAccounts);

  const loading = useSelector(selectAccountListLoading);
  const submitting = useSelector(selectAccountCreateLoading);
  const error = useSelector(selectAccountListError);

  const pagination = useSelector(selectAccountPagination);

  const selectedAccount = useSelector(selectSelectedAccount);
  const detailLoading = useSelector(selectAccountDetailsLoading);
  const detailError = useSelector(selectAccountDetailsError);

  // ===========================================================================
  // Local State
  // ===========================================================================

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");

  const { showToast } = useToast();

  // ===========================================================================
  // Initial Accounts Load
  // ===========================================================================

  useEffect(() => {
    dispatch(
      getAccounts({
        page: 1,
        limit: pagination?.limit || 10,
      }),
    );
  }, [dispatch]);

  // ===========================================================================
  // Account Type Options
  // ===========================================================================

  const accountTypeOptions = useMemo(
    () => [
      {
        value: ACCOUNT_TYPES.INDIVIDUAL,
        label: "Individual",
      },
      {
        value: ACCOUNT_TYPES.BUSINESS,
        label: "Business",
      },
      {
        value: ACCOUNT_TYPES.ENTERPRISE,
        label: "Enterprise",
      },
    ],
    [],
  );

  // ===========================================================================
  // Form Change
  // ===========================================================================

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

  // ===========================================================================
  // Create Modal
  // ===========================================================================

  const handleOpenCreateModal = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (submitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setForm(INITIAL_FORM);
    setFormErrors({});
  };

  // ===========================================================================
  // Create Account
  // ===========================================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      type: form.type,
      description: form.description.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
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
    // Create
    // -------------------------------------------------------------------------

    const result = await dispatch(createAccount(values));

    // -------------------------------------------------------------------------
    // Success
    // -------------------------------------------------------------------------

    if (createAccount.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Account Created",
        message:
          ACCOUNT_MESSAGES.CREATE_SUCCESS ||
          ACCOUNT_MESSAGES.CREATED ||
          "Account created successfully.",
      });

      setIsCreateModalOpen(false);
      setForm(INITIAL_FORM);
      setFormErrors({});

      dispatch(
        getAccounts({
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
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
        ACCOUNT_MESSAGES.CREATE_ERROR ||
        ACCOUNT_MESSAGES.CREATE_FAILED ||
        "Failed to create account.",
    });
  };

  // ===========================================================================
  // View Account
  // ===========================================================================

  const handleViewAccount = async (accountId) => {
    const result = await dispatch(getAccountById(accountId));

    if (getAccountById.fulfilled.match(result)) {
      setIsViewModalOpen(true);
      return;
    }

    showToast({
      type: "error",
      title: "Unable to Load Account",
      message:
        result.payload?.message ||
        ACCOUNT_MESSAGES.FETCH_BY_ID_ERROR ||
        ACCOUNT_MESSAGES.FETCH_FAILED ||
        "Failed to fetch account.",
    });
  };

  // ===========================================================================
  // Pagination
  // ===========================================================================

  const handlePageChange = (page) => {
    dispatch(
      getAccounts({
        page,
        limit: pagination?.limit || 10,
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

  // ===========================================================================
  // Search
  // ===========================================================================

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getAccounts({
        page: 1,
        limit: pagination?.limit || 10,
        search: value,
      }),
    );
  };

  // ===========================================================================
  // Badge Variants
  // ===========================================================================

  const getStatusVariant = (status) => {
    if (status === ACCOUNT_STATUS.ACTIVE) {
      return "success";
    }

    if (status === ACCOUNT_STATUS.SUSPENDED) {
      return "warning";
    }

    if (status === ACCOUNT_STATUS.DELETED) {
      return "danger";
    }

    return "neutral";
  };

  const getVerificationVariant = (status) => {
    if (status === ACCOUNT_VERIFICATION_STATUS.VERIFIED) {
      return "success";
    }

    if (status === ACCOUNT_VERIFICATION_STATUS.REJECTED) {
      return "danger";
    }

    return "neutral";
  };

  const getPlanStatusVariant = (status) => {
    if (status === ACCOUNT_PLAN_STATUS.ACTIVE) {
      return "success";
    }

    if (status === ACCOUNT_PLAN_STATUS.TRIAL) {
      return "info";
    }

    if (status === ACCOUNT_PLAN_STATUS.EXPIRED) {
      return "warning";
    }

    if (status === ACCOUNT_PLAN_STATUS.CANCELLED) {
      return "danger";
    }

    return "neutral";
  };

  // ===========================================================================
  // Table Columns
  // ===========================================================================

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (account) => account.name || "-",
    },
    {
      key: "slug",
      label: "Slug",
      render: (account) => account.slug || "-",
    },
    {
      key: "type",
      label: "Type",
      render: (account) => {
        if (account.type === ACCOUNT_TYPES.INDIVIDUAL) {
          return "Individual";
        }

        if (account.type === ACCOUNT_TYPES.BUSINESS) {
          return "Business";
        }

        if (account.type === ACCOUNT_TYPES.ENTERPRISE) {
          return "Enterprise";
        }

        return account.type || "-";
      },
    },
    {
      key: "email",
      label: "Email",
      render: (account) => account.email || "-",
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
      key: "verificationStatus",
      label: "Verification",
      render: (account) => (
        <Badge variant={getVerificationVariant(account.verificationStatus)}>
          {account.verificationStatus || "-"}
        </Badge>
      ),
    },
    {
      key: "planStatus",
      label: "Plan",
      render: (account) => (
        <Badge variant={getPlanStatusVariant(account.planStatus)}>
          {account.planStatus || "-"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (account) => (
        <ViewIcon size={4} onClick={() => handleViewAccount(account._id)} />
      ),
    },
  ];

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <PageContainer>
      <PageHeader
        title="Accounts"
        description="Manage accounts and their subscription status."
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

      {/* ================================================================== */}
      {/* Account List */}
      {/* ================================================================== */}

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
          error ||
          ACCOUNT_MESSAGES.FETCH_ERROR ||
          ACCOUNT_MESSAGES.FETCH_FAILED ||
          "No accounts found."
        }
      />

      {/* ================================================================== */}
      {/* Create Account Modal */}
      {/* ================================================================== */}

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
            />
          </FormField>

          <FormField label="Slug" name="slug" required error={formErrors.slug}>
            <Input
              name="slug"
              value={form.slug}
              onChange={handleFormChange}
              placeholder="Enter account slug"
              required
              disabled={submitting}
            />
          </FormField>

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

          <FormField
            label="Description"
            name="description"
            error={formErrors.description}
          >
            <Input
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Enter account description"
              disabled={submitting}
            />
          </FormField>

          <FormField label="Email" name="email" error={formErrors.email}>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Enter account email"
              autoComplete="email"
              disabled={submitting}
            />
          </FormField>

          <FormField label="Phone" name="phone" error={formErrors.phone}>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleFormChange}
              placeholder="Enter phone number"
              disabled={submitting}
            />
          </FormField>
        </form>
      </Modal>

      {/* ================================================================== */}
      {/* Account Details Modal */}
      {/* ================================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Account Details"
      >
        {detailLoading ? (
          <Loader />
        ) : detailError ? (
          <div>{detailError}</div>
        ) : selectedAccount ? (
          <div className="account-details">
            <div className="account-details__row">
              <span>Account Name</span>
              <strong>{selectedAccount.name || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Slug</span>
              <strong>{selectedAccount.slug || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Account Type</span>
              <strong>{selectedAccount.type || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Description</span>
              <strong>{selectedAccount.description || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Email</span>
              <strong>{selectedAccount.email || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Phone</span>
              <strong>{selectedAccount.phone || "-"}</strong>
            </div>

            <div className="account-details__row">
              <span>Status</span>
              <Badge variant={getStatusVariant(selectedAccount.status)}>
                {selectedAccount.status || "-"}
              </Badge>
            </div>

            <div className="account-details__row">
              <span>Verification Status</span>
              <Badge
                variant={getVerificationVariant(
                  selectedAccount.verificationStatus,
                )}
              >
                {selectedAccount.verificationStatus || "-"}
              </Badge>
            </div>

            <div className="account-details__row">
              <span>Plan Status</span>
              <Badge variant={getPlanStatusVariant(selectedAccount.planStatus)}>
                {selectedAccount.planStatus || "-"}
              </Badge>
            </div>

            <div className="account-details__row">
              <span>Created At</span>
              <strong>
                {selectedAccount.createdAt
                  ? new Date(selectedAccount.createdAt).toLocaleString()
                  : "-"}
              </strong>
            </div>

            <div className="account-details__row">
              <span>Updated At</span>
              <strong>
                {selectedAccount.updatedAt
                  ? new Date(selectedAccount.updatedAt).toLocaleString()
                  : "-"}
              </strong>
            </div>
          </div>
        ) : null}
      </Modal>
    </PageContainer>
  );
}

export default AccountPage;
