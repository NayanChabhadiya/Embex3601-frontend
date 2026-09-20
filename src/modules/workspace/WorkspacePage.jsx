import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select, Textarea } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from "./store/workspace.thunks.js";

import {
  selectWorkspaces,
  selectWorkspaceStatus,
} from "./store/workspace.selectors.js";

function WorkspacePage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // =========================================================
  // Redux State
  // =========================================================

  const workspaces = useSelector(selectWorkspaces);
  const status = useSelector(selectWorkspaceStatus);

  // =========================================================
  // Modal State
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // =========================================================
  // Selected / Editing Workspace
  // =========================================================

  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [editingWorkspace, setEditingWorkspace] = useState(null);

  // =========================================================
  // Workspace Form
  // =========================================================

  const [formData, setFormData] = useState({
    accountId: "",
    name: "",
    code: "",
    description: "",
    type: "BUSINESS_UNIT",
    status: "ACTIVE",
  });

  // =========================================================
  // Fetch Workspaces
  // =========================================================

  useEffect(() => {
    dispatch(fetchWorkspaces());
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
      accountId: "",
      name: "",
      code: "",
      description: "",
      type: "BUSINESS_UNIT",
      status: "ACTIVE",
    });

    setEditingWorkspace(null);
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

  const handleView = (workspace) => {
    setSelectedWorkspace(workspace);
    setIsViewModalOpen(true);
  };

  // =========================================================
  // Open Edit Modal
  // =========================================================

  const handleEdit = (workspace) => {
    setEditingWorkspace(workspace);

    setFormData({
      accountId: workspace.accountId?._id || workspace.accountId || "",

      name: workspace.name || "",

      code: workspace.code || "",

      description: workspace.description || "",

      type: workspace.type || "BUSINESS_UNIT",

      status: workspace.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // Delete Workspace
  // =========================================================

  const handleDelete = async (workspace) => {
    const result = await dispatch(deleteWorkspace(workspace._id));

    if (deleteWorkspace.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Workspace Deleted",
        message: "Workspace deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete workspace.",
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

    if (editingWorkspace) {
      const payload = {
        accountId: formData.accountId,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        type: formData.type,
        status: formData.status,
      };

      const result = await dispatch(
        updateWorkspace({
          id: editingWorkspace._id,
          payload,
        }),
      );

      if (updateWorkspace.fulfilled.match(result)) {
        setIsModalOpen(false);
        resetForm();

        showToast({
          type: "success",
          title: "Workspace Updated",
          message: "Workspace updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update workspace.",
      });

      return;
    }

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------

    const result = await dispatch(createWorkspace(formData));

    if (createWorkspace.fulfilled.match(result)) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: "Workspace Created",
        message: "Workspace created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create workspace.",
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
      key: "name",
      label: "Name",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "accountId",
      label: "Account",
      render: (row) =>
        row.accountId?.name || row.accountId?.code || row.accountId || "-",
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
        title="Workspaces"
        description="Manage Embex360 workspaces."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Workspace
          </Button>
        }
      />

      {/* =====================================================
          Workspace Table
      ===================================================== */}

      <Table
        title="Workspaces"
        columns={columns}
        data={workspaces}
        rowKey="_id"
        emptyMessage="No workspaces found."
        loading={status === "loading"}
        searchPlaceholder="Search workspaces..."
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
        title={editingWorkspace ? "Edit Workspace" : "Add Workspace"}
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

            <Button type="submit" form="workspace-form">
              {editingWorkspace ? "Update Workspace" : "Create Workspace"}
            </Button>
          </>
        }
      >
        <form id="workspace-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Account ID"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              placeholder="Enter account ID"
            />

            <Input
              label="Workspace Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter workspace name"
            />

            <Input
              label="Workspace Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter workspace code"
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "BUSINESS_GROUP",
                  label: "Business Group",
                },
                {
                  value: "BUSINESS_UNIT",
                  label: "Business Unit",
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter workspace description"
            />
          </Grid>
        </form>
      </Modal>

      {/* =====================================================
          View Workspace Modal
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedWorkspace(null);
        }}
        title="View Workspace"
      >
        {selectedWorkspace && (
          <Grid columns={1}>
            <div>
              <strong>Workspace Name</strong>
              <div>{selectedWorkspace.name || "-"}</div>
            </div>

            <div>
              <strong>Workspace Code</strong>
              <div>{selectedWorkspace.code || "-"}</div>
            </div>

            <div>
              <strong>Account</strong>
              <div>
                {selectedWorkspace.accountId?.name ||
                  selectedWorkspace.accountId?.code ||
                  selectedWorkspace.accountId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Type</strong>
              <div>{selectedWorkspace.type || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>
              <div>{selectedWorkspace.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                <Badge>{selectedWorkspace.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>
              <div>
                {selectedWorkspace.createdAt
                  ? new Date(selectedWorkspace.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default WorkspacePage;
