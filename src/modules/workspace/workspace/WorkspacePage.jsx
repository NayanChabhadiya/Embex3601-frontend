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
} from "../../../components/common";

import { useToast } from "../../../components/common/toast/ToastProvider.jsx";

import { createWorkspace, getWorkspaces } from "./store/workspace.thunks.js";

import {
  selectWorkspaces,
  selectWorkspacePagination,
  selectIsWorkspaceListLoading,
  selectWorkspaceListError,
  selectIsWorkspaceCreating,
} from "./store/workspace.selectors.js";

import {
  WORKSPACE_TYPES,
  WORKSPACE_DEFAULTS,
} from "./constants/workspace.constants.js";

import WORKSPACE_MESSAGES from "./constants/workspace.messages.js";

import { validateCreateWorkspace } from "./validations/workspace.validation.js";

import { getAccounts } from "../../account/account/store/account.thunks.js";

import {
  selectAccounts,
  selectIsAccountListLoading,
  selectAccountListError,
} from "../../account/account/store/account.selectors.js";

// =============================================================================
// Initial Form
// =============================================================================

const INITIAL_FORM = {
  name: "",
  code: "",
  type: WORKSPACE_DEFAULTS.TYPE,
  description: "",
};

// =============================================================================
// Workspace Page
// =============================================================================

const WorkspacePage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Redux State
  // ---------------------------------------------------------------------------

  const workspaces = useSelector(selectWorkspaces);
  const pagination = useSelector(selectWorkspacePagination);

  const isListLoading = useSelector(selectIsWorkspaceListLoading);
  const listError = useSelector(selectWorkspaceListError);
  const isCreating = useSelector(selectIsWorkspaceCreating);

  const accounts = useSelector(selectAccounts);
  const isAccountListLoading = useSelector(selectIsAccountListLoading);
  const accountListError = useSelector(selectAccountListError);

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  // ---------------------------------------------------------------------------
  // Fetch Accounts
  // ---------------------------------------------------------------------------

  useEffect(() => {
    dispatch(getAccounts({ page: 1, limit: 100 }));
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // Fetch Workspaces
  // ---------------------------------------------------------------------------

  const fetchWorkspaces = (params = {}) => {
    if (!selectedAccountId) {
      return;
    }

    dispatch(
      getWorkspaces({
        accountId: selectedAccountId,
        page: params.page ?? 1,
        limit: params.limit ?? pagination?.limit ?? 20,
        ...(search ? { search } : {}),
        ...(params.type ? { type: params.type } : {}),
        ...(params.status ? { status: params.status } : {}),
      }),
    );
  };

  // ---------------------------------------------------------------------------
  // Create Error Handling
  // ---------------------------------------------------------------------------

  const [lastHandledError, setLastHandledError] = useState(null);

  // ---------------------------------------------------------------------------
  // Form Change
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Account Change
  // ---------------------------------------------------------------------------

  const handleAccountChange = (event) => {
    const accountId = event.target.value;

    setSelectedAccountId(accountId);
    setSearch("");

    // Clear previous account's rows immediately through a new request.
    if (accountId) {
      dispatch(
        getWorkspaces({
          accountId,
          page: 1,
          limit: 20,
        }),
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Open Create Modal
  // ---------------------------------------------------------------------------

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
    setLastHandledError(null);
    setIsModalOpen(true);
  };

  // ---------------------------------------------------------------------------
  // Close Create Modal
  // ---------------------------------------------------------------------------

  const handleCloseCreate = () => {
    if (isCreating) {
      return;
    }

    setForm(INITIAL_FORM);
    setErrors({});
    setIsModalOpen(false);
  };

  // ---------------------------------------------------------------------------
  // Create Workspace
  // ---------------------------------------------------------------------------

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!selectedAccountId) {
      showToast({
        type: "error",
        message: "Please select an account first.",
      });
      return;
    }

    const validationErrors = validateCreateWorkspace(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLastHandledError(null);

    const result = await dispatch(
      createWorkspace({
        accountId: selectedAccountId,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        type: form.type,
        description: form.description.trim() || null,
      }),
    );

    if (createWorkspace.fulfilled.match(result)) {
      showToast({
        type: "success",
        message: WORKSPACE_MESSAGES.CREATED,
      });

      setForm(INITIAL_FORM);
      setErrors({});
      setIsModalOpen(false);
      setSearch("");

      // Refresh only once after a successful create.
      dispatch(
        getWorkspaces({
          accountId: selectedAccountId,
          page: 1,
          limit: pagination?.limit ?? 20,
        }),
      );

      return;
    }

    const payload = result.payload;
    const errorMessage =
      typeof payload === "string"
        ? payload
        : payload?.message || WORKSPACE_MESSAGES.CREATE_FAILED;

    if (payload?.errors) {
      setErrors(payload.errors);
    }

    showToast({
      type: "error",
      message: errorMessage,
    });
  };

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (!selectedAccountId) {
      return;
    }

    dispatch(
      getWorkspaces({
        accountId: selectedAccountId,
        page: 1,
        limit: pagination?.limit ?? 20,
        ...(value.trim() ? { search: value.trim() } : {}),
      }),
    );
  };

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const handlePageChange = (page) => {
    fetchWorkspaces({
      page,
      limit: pagination?.limit ?? 20,
    });
  };

  // ---------------------------------------------------------------------------
  // Table Columns
  // ---------------------------------------------------------------------------

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
      },
      {
        key: "code",
        label: "Code",
      },
      {
        key: "type",
        label: "Type",
      },
      {
        key: "status",
        label: "Status",
      },
      {
        key: "description",
        label: "Description",
      },
      {
        key: "createdAt",
        label: "Created At",
        render: (workspace) =>
          workspace.createdAt
            ? new Date(workspace.createdAt).toLocaleDateString()
            : "-",
      },
    ],
    [],
  );

  // ---------------------------------------------------------------------------
  // Select Options
  // ---------------------------------------------------------------------------

  const typeOptions = Object.values(WORKSPACE_TYPES).map((type) => ({
    value: type,
    label: type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()),
  }));

  const accountOptions = accounts.map((account) => ({
    value: account._id,
    label: account.name,
  }));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <PageHeader
        title="Workspaces"
        description="Manage your business workspaces."
        actions={
          <Button type="button" variant="primary" onClick={handleOpenCreate}>
            Create Workspace
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

      {/* Workspace List */}

      <div className="page-section">
        <div className="table-toolbar">
          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search workspaces..."
            disabled={!selectedAccountId}
          />
        </div>

        <Table
          columns={columns}
          data={selectedAccountId ? workspaces : []}
          loading={Boolean(selectedAccountId) && isListLoading}
          emptyMessage={
            !selectedAccountId
              ? "Please select an account to view workspaces."
              : listError || "No workspaces found."
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

      {/* Create Workspace Modal */}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseCreate}
        title="Create Workspace"
      >
        <form onSubmit={handleCreate}>
          <div className="form-section">
            <Input
              label="Workspace Name"
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              error={errors.name}
              required
              disabled={isCreating}
            />

            <Input
              label="Workspace Code"
              value={form.code}
              onChange={(event) => handleChange("code", event.target.value)}
              error={errors.code}
              required
              disabled={isCreating}
            />

            <Select
              label="Workspace Type"
              value={form.type}
              options={typeOptions}
              onChange={(event) => handleChange("type", event.target.value)}
              error={errors.type}
              required
              disabled={isCreating}
            />

            <Textarea
              label="Description"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              error={errors.description}
              rows={4}
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
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default WorkspacePage;
