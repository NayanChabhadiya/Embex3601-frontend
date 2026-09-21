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
  fetchWorkspaceMemberships,
  createWorkspaceMembership,
  updateWorkspaceMembership,
  deleteWorkspaceMembership,
} from "./store/workspace-membership.thunks.js";

import {
  selectWorkspaceMemberships,
  selectWorkspaceMembershipStatus,
} from "./store/workspace-membership.selectors.js";

const WorkspaceMembershipPage = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ============================================================
  // Redux State
  // ============================================================

  const memberships = useSelector(selectWorkspaceMemberships);

  const status = useSelector(selectWorkspaceMembershipStatus);

  // ============================================================
  // Modal State
  // ============================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ============================================================
  // Selected / Editing Membership
  // ============================================================

  const [selectedMembership, setSelectedMembership] = useState(null);

  const [editingMembership, setEditingMembership] = useState(null);

  // ============================================================
  // Form State
  // ============================================================

  const [formData, setFormData] = useState({
    workspaceId: "",
    userId: "",
    role: "MEMBER",
    status: "ACTIVE",
  });

  // ============================================================
  // Fetch Memberships
  // ============================================================

  useEffect(() => {
    dispatch(fetchWorkspaceMemberships());
  }, [dispatch]);

  // ============================================================
  // Form Change
  // ============================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================================
  // Reset Form
  // ============================================================

  const resetForm = () => {
    setFormData({
      workspaceId: "",
      userId: "",
      role: "MEMBER",
      status: "ACTIVE",
    });

    setEditingMembership(null);
  };

  // ============================================================
  // Create
  // ============================================================

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // ============================================================
  // View
  // ============================================================

  const handleView = (membership) => {
    setSelectedMembership(membership);
    setIsViewModalOpen(true);
  };

  // ============================================================
  // Edit
  // ============================================================

  const handleEdit = (membership) => {
    setEditingMembership(membership);

    setFormData({
      workspaceId: membership.workspaceId?._id || membership.workspaceId || "",

      userId: membership.userId?._id || membership.userId || "",

      role: membership.role || "MEMBER",

      status: membership.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ============================================================
  // Delete
  // ============================================================

  const handleDelete = async (membership) => {
    const result = await dispatch(deleteWorkspaceMembership(membership._id));

    if (deleteWorkspaceMembership.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Membership Deleted",
        message: "Workspace membership deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete workspace membership.",
    });
  };

  // ============================================================
  // Submit
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------

    if (editingMembership) {
      const result = await dispatch(
        updateWorkspaceMembership({
          id: editingMembership._id,
          payload: {
            workspaceId: formData.workspaceId,
            userId: formData.userId,
            role: formData.role,
            status: formData.status,
          },
        }),
      );

      if (updateWorkspaceMembership.fulfilled.match(result)) {
        setIsModalOpen(false);
        resetForm();

        showToast({
          type: "success",
          title: "Membership Updated",
          message: "Workspace membership updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update workspace membership.",
      });

      return;
    }

    // ----------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------

    const result = await dispatch(createWorkspaceMembership(formData));

    if (createWorkspaceMembership.fulfilled.match(result)) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: "Membership Created",
        message: "Workspace membership created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create workspace membership.",
    });
  };

  // ============================================================
  // Table Columns
  // ============================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },

    {
      key: "workspaceId",
      label: "Workspace",
      render: (row) =>
        row.workspaceId?.name ||
        row.workspaceId?.code ||
        row.workspaceId ||
        "-",
    },

    {
      key: "userId",
      label: "User",
      render: (row) =>
        row.userId?.displayName || row.userId?.email || row.userId || "-",
    },

    {
      key: "role",
      label: "Role",
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },

    {
      key: "joinedAt",
      label: "Joined At",
      render: (row) =>
        row.joinedAt ? new Date(row.joinedAt).toLocaleDateString() : "-",
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
      {/* ======================================================
          Page Header
      ====================================================== */}

      <PageHeader
        title="Workspace Memberships"
        description="Manage users assigned to workspaces."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Membership
          </Button>
        }
      />

      {/* ======================================================
          Membership Table
      ====================================================== */}

      <Table
        title="Workspace Memberships"
        columns={columns}
        data={memberships}
        rowKey="_id"
        emptyMessage="No workspace memberships found."
        loading={status === "loading"}
        searchPlaceholder="Search workspace memberships..."
      />

      {/* ======================================================
          Create / Edit Modal
      ====================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={
          editingMembership
            ? "Edit Workspace Membership"
            : "Add Workspace Membership"
        }
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

            <Button type="submit" form="workspace-membership-form">
              {editingMembership ? "Update Membership" : "Create Membership"}
            </Button>
          </>
        }
      >
        <form id="workspace-membership-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Workspace ID"
              name="workspaceId"
              value={formData.workspaceId}
              onChange={handleChange}
              placeholder="Enter workspace ID"
            />

            <Input
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="Enter user ID"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                {
                  value: "OWNER",
                  label: "Owner",
                },
                {
                  value: "ADMIN",
                  label: "Admin",
                },
                {
                  value: "MANAGER",
                  label: "Manager",
                },
                {
                  value: "MEMBER",
                  label: "Member",
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
                {
                  value: "SUSPENDED",
                  label: "Suspended",
                },
              ]}
            />
          </Grid>
        </form>
      </Modal>

      {/* ======================================================
          View Modal
      ====================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedMembership(null);
        }}
        title="View Workspace Membership"
      >
        {selectedMembership && (
          <Grid columns={1}>
            <div>
              <strong>Workspace</strong>

              <div>
                {selectedMembership.workspaceId?.name ||
                  selectedMembership.workspaceId?.code ||
                  selectedMembership.workspaceId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>User</strong>

              <div>
                {selectedMembership.userId?.displayName ||
                  selectedMembership.userId?.email ||
                  selectedMembership.userId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Role</strong>

              <div>{selectedMembership.role || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedMembership.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Joined At</strong>

              <div>
                {selectedMembership.joinedAt
                  ? new Date(selectedMembership.joinedAt).toLocaleString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedMembership.createdAt
                  ? new Date(selectedMembership.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
};

export default WorkspaceMembershipPage;
