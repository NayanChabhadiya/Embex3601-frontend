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
  fetchPartnerCategories,
  createPartnerCategory,
  updatePartnerCategory,
  deletePartnerCategory,
} from "./store/partner-category.thunks.js";

import {
  selectPartnerCategories,
  selectPartnerCategoryStatus,
} from "./store/partner-category.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  name: "",
  code: "",
  type: "CUSTOMER",
  description: "",
  status: "ACTIVE",
};

// ============================================================
// PAGE
// ============================================================

function PartnerCategoryPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PARTNER CATEGORY REDUX STATE
  // ==========================================================

  const partnerCategories = useSelector(selectPartnerCategories);

  const status = useSelector(selectPartnerCategoryStatus);

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PARTNER CATEGORY
  // ==========================================================

  const [selectedPartnerCategory, setSelectedPartnerCategory] = useState(null);

  const [editingPartnerCategory, setEditingPartnerCategory] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH PARTNER CATEGORIES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchPartnerCategories(selectedWorkspace._id));
  }, [dispatch, selectedWorkspace?._id]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingPartnerCategory(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (partnerCategory) => {
    setSelectedPartnerCategory(partnerCategory);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (partnerCategory) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingPartnerCategory(partnerCategory);

    setFormData({
      name: partnerCategory.name || "",
      code: partnerCategory.code || "",
      type: partnerCategory.type || "CUSTOMER",
      description: partnerCategory.description || "",
      status: partnerCategory.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (partnerCategory) => {
    const result = await dispatch(deletePartnerCategory(partnerCategory._id));

    if (deletePartnerCategory.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Partner Category Deleted",
        message: "Partner category deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete partner category.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // Workspace Required
    // --------------------------------------------------------

    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    // --------------------------------------------------------
    // Basic Validation
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter partner category name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter partner category code.",
      });

      return;
    }

    if (!formData.type) {
      showToast({
        type: "error",
        title: "Type Required",
        message: "Please select partner type.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      type: formData.type,

      description: formData.description?.trim() || "",

      status: formData.status,
    };

    console.log("Selected Workspace:", selectedWorkspace);

    console.log("Partner Category Payload:", payload);

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingPartnerCategory) {
      const result = await dispatch(
        updatePartnerCategory({
          id: editingPartnerCategory._id,
          payload,
        }),
      );

      if (updatePartnerCategory.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Partner Category Updated",
          message: "Partner category updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update partner category.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createPartnerCategory(payload));

    if (createPartnerCategory.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Partner Category Created",
        message: "Partner category created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create partner category.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
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

      render: (row) => <Badge>{row.type || "-"}</Badge>,
    },

    {
      key: "description",
      label: "Description",

      render: (row) => row.description || "-",
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
          <ViewIcon size={5} title="View" onClick={() => handleView(row)} />

          <EditIcon size={5} title="Edit" onClick={() => handleEdit(row)} />

          <DeleteIcon
            size={5}
            title="Delete"
            onClick={() => handleDelete(row)}
          />
        </>
      ),
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        title="Partner Categories"
        description="Manage workspace partner categories."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Partner Category
          </Button>
        }
      />

      {/* ====================================================
          ACTIVE WORKSPACE
      ==================================================== */}

      {selectedWorkspace && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <strong>Active Workspace:</strong>{" "}
          {selectedWorkspace.name || selectedWorkspace.code || "-"}
        </div>
      )}

      {!selectedWorkspace && (
        <div
          style={{
            marginBottom: "16px",
          }}
        >
          <Badge>Please select a workspace</Badge>
        </div>
      )}

      {/* ====================================================
          PARTNER CATEGORY TABLE
      ==================================================== */}

      <Table
        title="Partner Categories"
        columns={columns}
        data={partnerCategories}
        rowKey="_id"
        emptyMessage="No partner categories found."
        loading={status === "loading"}
        searchPlaceholder="Search partner categories..."
      />

      {/* ====================================================
          CREATE / EDIT MODAL
      ==================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);

          resetForm();
        }}
        title={
          editingPartnerCategory
            ? "Edit Partner Category"
            : "Add Partner Category"
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

            <Button type="submit" form="partner-category-form">
              {editingPartnerCategory
                ? "Update Partner Category"
                : "Create Partner Category"}
            </Button>
          </>
        }
      >
        <form id="partner-category-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter partner category name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter partner category code"
            />

            <Select
              label="Partner Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "CUSTOMER",
                  label: "Customer",
                },
                {
                  value: "SUPPLIER",
                  label: "Supplier",
                },
                {
                  value: "BOTH",
                  label: "Both",
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
              placeholder="Enter description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW PARTNER CATEGORY MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedPartnerCategory(null);
        }}
        title="View Partner Category"
      >
        {selectedPartnerCategory && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>

              <div>{selectedPartnerCategory.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedPartnerCategory.code || "-"}</div>
            </div>

            <div>
              <strong>Partner Type</strong>

              <div>{selectedPartnerCategory.type || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedPartnerCategory.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPartnerCategory.status}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PartnerCategoryPage;
