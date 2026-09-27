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
} from "../../components/common";

import { createUser, getUsers } from "./store/user.thunks.js";
import { validateCreateUser } from "./validations/user.validation.js";

import {
  selectUsers,
  selectUserPagination,
  selectUserListLoading,
  selectUserListError,
  selectCreateUserLoading,
} from "./store/user.selectors.js";

import {
  USER_TYPE,
  USER_STATUS,
  USER_VERIFICATION_STATUS,
} from "./constants/user.constants";

import USER_MESSAGES from "./constants/user.messages.js";

import { useToast } from "../../components/common";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  mobile: "",
  password: "",
  type: USER_TYPE.CUSTOMER_USER,
  status: USER_STATUS.ACTIVE,
  verificationStatus: USER_VERIFICATION_STATUS.UNVERIFIED,
};

function UserPage() {
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);

  const loading = useSelector(selectUserListLoading);
  const submitting = useSelector(selectCreateUserLoading);
  const error = useSelector(selectUserListError);
  const pagination = useSelector(selectUserPagination);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    dispatch(
      getUsers({
        page: 1,
        limit: pagination?.limit || 20,
      }),
    );
  }, [dispatch]);

  const userTypeOptions = useMemo(
    () => [
      {
        value: USER_TYPE.CUSTOMER_ADMIN,
        label: "Customer Admin",
      },
      {
        value: USER_TYPE.CUSTOMER_USER,
        label: "Customer User",
      },
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [
      {
        value: USER_STATUS.ACTIVE,
        label: "Active",
      },
      {
        value: USER_STATUS.INACTIVE,
        label: "Inactive",
      },
    ],
    [],
  );

  const verificationStatusOptions = useMemo(
    () => [
      {
        value: USER_VERIFICATION_STATUS.VERIFIED,
        label: "Verified",
      },
      {
        value: USER_VERIFICATION_STATUS.UNVERIFIED,
        label: "Unverified",
      },
    ],
    [],
  );

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      password: form.password,
      type: form.type,
      status: form.status,
      verificationStatus: form.verificationStatus,
    };

    // ------------------------------------------------------------
    // Validation
    // ------------------------------------------------------------

    const validationErrors = validateCreateUser(values);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    // ------------------------------------------------------------
    // Create User
    // ------------------------------------------------------------

    const result = await dispatch(createUser(values));

    // ------------------------------------------------------------
    // Success
    // ------------------------------------------------------------

    if (createUser.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "User Created",
        message: USER_MESSAGES.CREATE_SUCCESS,
      });

      setIsCreateModalOpen(false);
      setForm(INITIAL_FORM);
      setFormErrors({});

      dispatch(
        getUsers({
          page: pagination?.page || 1,
          limit: pagination?.limit || 20,
          search,
        }),
      );

      return;
    }

    // ------------------------------------------------------------
    // Backend Validation Errors
    // ------------------------------------------------------------

    if (result.payload?.errors) {
      setFormErrors(result.payload.errors);
    }

    // ------------------------------------------------------------
    // Error Toast
    // ------------------------------------------------------------

    showToast({
      type: "error",
      title: "Create User Failed",
      message: result.payload?.message || USER_MESSAGES.CREATE_ERROR,
    });
  };

  const handlePageChange = (page) => {
    dispatch(
      getUsers({
        page,
        limit: pagination?.limit || 20,
        search,
      }),
    );
  };

  const handleLimitChange = (limit) => {
    dispatch(
      getUsers({
        page: 1,
        limit,
        search,
      }),
    );
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    dispatch(
      getUsers({
        page: 1,
        limit: pagination?.limit || 20,
        search: value,
      }),
    );
  };

  const getStatusVariant = (status) => {
    if (status === USER_STATUS.ACTIVE) {
      return "success";
    }

    return "neutral";
  };

  const getVerificationVariant = (status) => {
    if (status === USER_VERIFICATION_STATUS.VERIFIED) {
      return "success";
    }

    return "neutral";
  };

  const columns = [
    {
      key: "firstName",
      label: "Name",
      render: (user) => {
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

        return user.displayName || name || "-";
      },
    },
    {
      key: "email",
      label: "Email",
      render: (user) => user.email || "-",
    },
    {
      key: "mobile",
      label: "Mobile",
      render: (user) => user.mobile || "-",
    },
    {
      key: "type",
      label: "Type",
      render: (user) => {
        const label =
          user.type === USER_TYPE.CUSTOMER_ADMIN
            ? "Customer Admin"
            : user.type === USER_TYPE.CUSTOMER_USER
              ? "Customer User"
              : user.type;

        return label;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
      ),
    },
    {
      key: "verificationStatus",
      label: "Verification",
      render: (user) => (
        <Badge variant={getVerificationVariant(user.verificationStatus)}>
          {user.verificationStatus}
        </Badge>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        description="Manage users and their access status."
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create User
          </Button>
        }
      />

      <Table
        title="User List"
        columns={columns}
        data={users}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search users..."
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        emptyMessage={error || USER_MESSAGES?.FETCH_ERROR || "No users found."}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create User"
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
              form="create-user-form"
              variant="primary"
              loading={submitting}
              loadingText="Creating..."
            >
              Create User
            </Button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={handleSubmit}>
          <FormField
            label="First Name"
            name="firstName"
            required
            error={formErrors.firstName}
          >
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleFormChange}
              placeholder="Enter first name"
              required
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Last Name"
            name="lastName"
            required
            error={formErrors.lastName}
          >
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleFormChange}
              placeholder="Enter last name"
              required
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Display Name"
            name="displayName"
            error={formErrors.displayName}
          >
            <Input
              name="displayName"
              value={form.displayName}
              onChange={handleFormChange}
              placeholder="Enter display name"
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Email"
            name="email"
            required
            error={formErrors.email}
          >
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              placeholder="Enter email"
              required
              autoComplete="email"
              disabled={submitting}
            />
          </FormField>

          <FormField label="Mobile" name="mobile" error={formErrors.mobile}>
            <Input
              name="mobile"
              value={form.mobile}
              onChange={handleFormChange}
              placeholder="Enter mobile number"
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Password"
            name="password"
            required
            error={formErrors.password}
          >
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              placeholder="Enter password"
              required
              autoComplete="new-password"
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="User Type"
            name="type"
            required
            error={formErrors.type}
          >
            <Select
              name="type"
              value={form.type}
              onChange={handleFormChange}
              options={userTypeOptions}
              placeholder="Select user type"
              required
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Status"
            name="status"
            required
            error={formErrors.status}
          >
            <Select
              name="status"
              value={form.status}
              onChange={handleFormChange}
              options={statusOptions}
              placeholder="Select status"
              required
              disabled={submitting}
            />
          </FormField>

          <FormField
            label="Verification Status"
            name="verificationStatus"
            required
            error={formErrors.verificationStatus}
          >
            <Select
              name="verificationStatus"
              value={form.verificationStatus}
              onChange={handleFormChange}
              options={verificationStatusOptions}
              placeholder="Select verification status"
              required
              disabled={submitting}
            />
          </FormField>
        </form>
      </Modal>
    </PageContainer>
  );
}

export default UserPage;
