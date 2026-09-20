import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./store/user.thunks.js";

import { selectUsers, selectUserStatus } from "./store/user.selectors.js";

function UserPage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const users = useSelector(selectUsers);
  const status = useSelector(selectUserStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    mobile: "",
    password: "",
    type: "USER",
    status: "ACTIVE",
    verificationStatus: "UNVERIFIED",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // =========================================================
  // Form Change
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // Reset Form
  // =========================================================

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      displayName: "",
      email: "",
      mobile: "",
      password: "",
      type: "USER",
      status: "ACTIVE",
      verificationStatus: "UNVERIFIED",
    });

    setEditingUser(null);
  };

  // =========================================================
  // Open Create Modal
  // =========================================================

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // =========================================================
  // Open View Modal
  // =========================================================

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // =========================================================
  // Open Edit Modal
  // =========================================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      displayName: user.displayName || "",
      email: user.email || "",
      mobile: user.mobile || "",
      password: "",
      type: user.type || "USER",
      status: user.status || "ACTIVE",
      verificationStatus: user.verificationStatus || "UNVERIFIED",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // Delete User
  // =========================================================

  const handleDelete = async (user) => {
    const result = await dispatch(deleteUser(user._id));

    if (deleteUser.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "User Deleted",
        message: "User deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete user.",
    });
  };

  // =========================================================
  // Submit
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------

    if (editingUser) {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email,
        mobile: formData.mobile,
        type: formData.type,
        status: formData.status,
        verificationStatus: formData.verificationStatus,
      };

      // Password only when entered during edit.
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const result = await dispatch(
        updateUser({
          id: editingUser._id,
          payload,
        }),
      );

      if (updateUser.fulfilled.match(result)) {
        setIsModalOpen(false);
        resetForm();

        showToast({
          type: "success",
          title: "User Updated",
          message: "User updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update user.",
      });

      return;
    }

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------

    const result = await dispatch(createUser(formData));

    if (createUser.fulfilled.match(result)) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: "User Created",
        message: "User created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create user.",
    });
  };

  // =========================================================
  // Table Columns
  // =========================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },

    {
      key: "firstName",
      label: "First Name",
    },

    {
      key: "lastName",
      label: "Last Name",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "mobile",
      label: "Mobile",
    },

    {
      key: "type",
      label: "Type",
    },

    {
      key: "status",
      label: "Status",

      render: (row) => <Badge>{row.status}</Badge>,
    },

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <>
          <ViewIcon size={5} onClick={() => handleView(row)} title="View" />

          <EditIcon size={5} onClick={() => handleEdit(row)} title="Edit" />

          <DeleteIcon
            size={5}
            onClick={() => handleDelete(row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  return (
    <section>
      {/* =====================================================
          Page Header
      ===================================================== */}

      <PageHeader
        title="Users"
        description="Manage Embex360 users."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add User
          </Button>
        }
      />

      {/* =====================================================
          User Table
      ===================================================== */}

      <Table
        title="Users"
        columns={columns}
        data={users}
        rowKey="_id"
        emptyMessage="No users found."
        loading={status === "loading"}
        searchPlaceholder="Search users..."
      />

      {/* =====================================================
          Create / Edit Modal
      ===================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingUser ? "Edit User" : "Add User"}
        footer={
          <>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" form="user-form">
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
            />

            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter display name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <Input
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />

            <Input
              label={editingUser ? "Password (optional)" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                editingUser
                  ? "Leave blank to keep current password"
                  : "Enter password"
              }
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "USER",
                  label: "User",
                },
              ]}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                {
                  value: "ACTIVE",
                  label: "Active",
                },
                {
                  value: "INACTIVE",
                  label: "Inactive",
                },
              ]}
            />

            <Select
              label="Verification Status"
              name="verificationStatus"
              value={formData.verificationStatus}
              onChange={handleChange}
              options={[
                {
                  value: "UNVERIFIED",
                  label: "Unverified",
                },
                {
                  value: "VERIFIED",
                  label: "Verified",
                },
              ]}
            />
          </Grid>
        </form>
      </Modal>

      {/* =====================================================
          View User Modal
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
        title="View User"
      >
        {selectedUser && (
          <Grid columns={1}>
            <div>
              <strong>First Name</strong>
              <div>{selectedUser.firstName || "-"}</div>
            </div>

            <div>
              <strong>Last Name</strong>
              <div>{selectedUser.lastName || "-"}</div>
            </div>

            <div>
              <strong>Display Name</strong>
              <div>{selectedUser.displayName || "-"}</div>
            </div>

            <div>
              <strong>Email</strong>
              <div>{selectedUser.email || "-"}</div>
            </div>

            <div>
              <strong>Mobile</strong>
              <div>{selectedUser.mobile || "-"}</div>
            </div>

            <div>
              <strong>Type</strong>
              <div>{selectedUser.type || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                <Badge>{selectedUser.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Verification Status</strong>
              <div>{selectedUser.verificationStatus || "-"}</div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default UserPage;
