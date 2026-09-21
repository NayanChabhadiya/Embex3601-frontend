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
  fetchHsnSac,
  createHsnSac,
  updateHsnSac,
  deleteHsnSac,
} from "./store/hsn-sac.thunks.js";

import {
  selectHsnSacList,
  selectHsnSacStatus,
} from "./store/hsn-sac.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

const initialFormData = {
  type: "HSN",
  code: "",
  description: "",
  gstRate: 0,
  cgstRate: 0,
  sgstRate: 0,
  igstRate: 0,
  cessRate: 0,
  status: "ACTIVE",
};

function HsnSacPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // HSN / SAC REDUX STATE
  // ==========================================================

  const hsnSacList = useSelector(selectHsnSacList);

  const status = useSelector(selectHsnSacStatus);

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
  // SELECTED / EDITING HSN / SAC
  // ==========================================================

  const [selectedHsnSac, setSelectedHsnSac] = useState(null);

  const [editingHsnSac, setEditingHsnSac] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH HSN / SAC
  // ==========================================================

  useEffect(() => {
    dispatch(fetchHsnSac());
  }, [dispatch]);

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

    setEditingHsnSac(null);
  };

  // ==========================================================
  // OPEN CREATE
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

  const handleView = (hsnSac) => {
    setSelectedHsnSac(hsnSac);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (hsnSac) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingHsnSac(hsnSac);

    setFormData({
      type: hsnSac.type || "HSN",

      code: hsnSac.code || "",

      description: hsnSac.description || "",

      gstRate: hsnSac.gstRate ?? 0,

      cgstRate: hsnSac.cgstRate ?? 0,

      sgstRate: hsnSac.sgstRate ?? 0,

      igstRate: hsnSac.igstRate ?? 0,

      cessRate: hsnSac.cessRate ?? 0,

      status: hsnSac.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (hsnSac) => {
    const result = await dispatch(deleteHsnSac(hsnSac._id));

    if (deleteHsnSac.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "HSN / SAC Deleted",
        message: "HSN / SAC deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete HSN / SAC.",
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

    if (!formData.type) {
      showToast({
        type: "error",
        title: "Type Required",
        message: "Please select HSN or SAC.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter HSN / SAC code.",
      });

      return;
    }

    // --------------------------------------------------------
    // Payload
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      type: formData.type,

      code: formData.code.trim().toUpperCase(),

      description: formData.description,

      gstRate: Number(formData.gstRate) || 0,

      cgstRate: Number(formData.cgstRate) || 0,

      sgstRate: Number(formData.sgstRate) || 0,

      igstRate: Number(formData.igstRate) || 0,

      cessRate: Number(formData.cessRate) || 0,

      status: formData.status,
    };

    console.log("Selected Workspace:", selectedWorkspace);

    console.log("HSN / SAC Payload:", payload);

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingHsnSac) {
      const result = await dispatch(
        updateHsnSac({
          id: editingHsnSac._id,
          payload,
        }),
      );

      if (updateHsnSac.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "HSN / SAC Updated",
          message: "HSN / SAC updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update HSN / SAC.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createHsnSac(payload));

    if (createHsnSac.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "HSN / SAC Created",
        message: "HSN / SAC created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create HSN / SAC.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "type",
      label: "Type",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "description",
      label: "Description",

      render: (row) => row.description || "-",
    },

    {
      key: "gstRate",
      label: "GST %",
      render: (row) => row.gstRate ?? 0,
    },

    {
      key: "cgstRate",
      label: "CGST %",
      render: (row) => row.cgstRate ?? 0,
    },

    {
      key: "sgstRate",
      label: "SGST %",
      render: (row) => row.sgstRate ?? 0,
    },

    {
      key: "igstRate",
      label: "IGST %",
      render: (row) => row.igstRate ?? 0,
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
        title="HSN / SAC"
        description="Manage workspace HSN and SAC codes."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add HSN / SAC
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
          HSN / SAC TABLE
      ==================================================== */}

      <Table
        title="HSN / SAC"
        columns={columns}
        data={hsnSacList}
        rowKey="_id"
        emptyMessage="No HSN / SAC found."
        loading={status === "loading"}
        searchPlaceholder="Search HSN / SAC..."
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
        title={editingHsnSac ? "Edit HSN / SAC" : "Add HSN / SAC"}
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

            <Button type="submit" form="hsn-sac-form">
              {editingHsnSac ? "Update HSN / SAC" : "Create HSN / SAC"}
            </Button>
          </>
        }
      >
        <form id="hsn-sac-form" onSubmit={handleSubmit}>
          <Grid>
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "HSN",
                  label: "HSN",
                },
                {
                  value: "SAC",
                  label: "SAC",
                },
              ]}
            />

            <Input
              label="HSN / SAC Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter HSN / SAC code"
            />

            <Input
              label="GST Rate (%)"
              name="gstRate"
              type="number"
              value={formData.gstRate}
              onChange={handleChange}
              placeholder="Enter GST rate"
            />

            <Input
              label="CGST Rate (%)"
              name="cgstRate"
              type="number"
              value={formData.cgstRate}
              onChange={handleChange}
              placeholder="Enter CGST rate"
            />

            <Input
              label="SGST Rate (%)"
              name="sgstRate"
              type="number"
              value={formData.sgstRate}
              onChange={handleChange}
              placeholder="Enter SGST rate"
            />

            <Input
              label="IGST Rate (%)"
              name="igstRate"
              type="number"
              value={formData.igstRate}
              onChange={handleChange}
              placeholder="Enter IGST rate"
            />

            <Input
              label="CESS Rate (%)"
              name="cessRate"
              type="number"
              value={formData.cessRate}
              onChange={handleChange}
              placeholder="Enter CESS rate"
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
          VIEW HSN / SAC MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedHsnSac(null);
        }}
        title="View HSN / SAC"
      >
        {selectedHsnSac && (
          <Grid columns={1}>
            <div>
              <strong>Type</strong>

              <div>{selectedHsnSac.type || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedHsnSac.code || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedHsnSac.description || "-"}</div>
            </div>

            <div>
              <strong>GST Rate</strong>

              <div>{selectedHsnSac.gstRate ?? 0}%</div>
            </div>

            <div>
              <strong>CGST Rate</strong>

              <div>{selectedHsnSac.cgstRate ?? 0}%</div>
            </div>

            <div>
              <strong>SGST Rate</strong>

              <div>{selectedHsnSac.sgstRate ?? 0}%</div>
            </div>

            <div>
              <strong>IGST Rate</strong>

              <div>{selectedHsnSac.igstRate ?? 0}%</div>
            </div>

            <div>
              <strong>CESS Rate</strong>

              <div>{selectedHsnSac.cessRate ?? 0}%</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedHsnSac.status}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default HsnSacPage;
