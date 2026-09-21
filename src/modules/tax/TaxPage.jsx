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
  fetchTaxes,
  createTax,
  updateTax,
  deleteTax,
} from "./store/tax.thunks.js";

import { selectTaxes, selectTaxStatus } from "./store/tax.selectors.js";

function TaxPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // Redux State
  // ==========================================================

  const taxes = useSelector(selectTaxes);
  const status = useSelector(selectTaxStatus);

  // ==========================================================
  // Modal State
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // Selected / Editing Tax
  // ==========================================================

  const [selectedTax, setSelectedTax] = useState(null);

  const [editingTax, setEditingTax] = useState(null);

  // ==========================================================
  // Form
  // ==========================================================

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "GST",
    rate: "",
    description: "",
    status: "ACTIVE",
  });

  // ==========================================================
  // Fetch Taxes
  // ==========================================================

  useEffect(() => {
    dispatch(fetchTaxes());
  }, [dispatch]);

  // ==========================================================
  // Form Change
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // Reset Form
  // ==========================================================

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "GST",
      rate: "",
      description: "",
      status: "ACTIVE",
    });

    setEditingTax(null);
  };

  // ==========================================================
  // Create
  // ==========================================================

  const handleCreate = () => {
    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // View
  // ==========================================================

  const handleView = (tax) => {
    setSelectedTax(tax);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // Edit
  // ==========================================================

  const handleEdit = (tax) => {
    setEditingTax(tax);

    setFormData({
      name: tax.name || "",
      code: tax.code || "",
      type: tax.type || "GST",
      rate: tax.rate !== undefined && tax.rate !== null ? String(tax.rate) : "",
      description: tax.description || "",
      status: tax.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // Delete
  // ==========================================================

  const handleDelete = async (tax) => {
    const result = await dispatch(deleteTax(tax._id));

    if (deleteTax.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Tax Deleted",
        message: "Tax deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete tax.",
    });
  };

  // ==========================================================
  // Submit
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      type: formData.type,
      rate: Number(formData.rate),
      description: formData.description,
      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingTax) {
      const result = await dispatch(
        updateTax({
          id: editingTax._id,
          payload,
        }),
      );

      if (updateTax.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Tax Updated",
          message: "Tax updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update tax.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createTax(payload));

    if (createTax.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Tax Created",
        message: "Tax created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create tax.",
    });
  };

  // ==========================================================
  // Table Columns
  // ==========================================================

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
      key: "type",
      label: "Type",
    },

    {
      key: "rate",
      label: "Rate",
      render: (row) => `${row.rate}%`,
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
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title="Taxes"
        description="Manage tax rates and tax types."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Tax
          </Button>
        }
      />

      {/* =====================================================
          TAX TABLE
      ===================================================== */}

      <Table
        title="Taxes"
        columns={columns}
        data={taxes}
        rowKey="_id"
        emptyMessage="No taxes found."
        loading={status === "loading"}
        searchPlaceholder="Search taxes..."
      />

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTax ? "Edit Tax" : "Add Tax"}
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

            <Button type="submit" form="tax-form">
              {editingTax ? "Update Tax" : "Create Tax"}
            </Button>
          </>
        }
      >
        <form id="tax-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Tax Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tax name"
            />

            <Input
              label="Tax Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter tax code"
            />

            <Select
              label="Tax Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "GST",
                  label: "GST",
                },
                {
                  value: "IGST",
                  label: "IGST",
                },
                {
                  value: "CGST",
                  label: "CGST",
                },
                {
                  value: "SGST",
                  label: "SGST",
                },
                {
                  value: "UTGST",
                  label: "UTGST",
                },
                {
                  value: "CESS",
                  label: "CESS",
                },
                {
                  value: "TDS",
                  label: "TDS",
                },
                {
                  value: "OTHER",
                  label: "Other",
                },
              ]}
            />

            <Input
              label="Tax Rate (%)"
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
              placeholder="Enter tax rate"
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
              placeholder="Enter tax description"
            />
          </Grid>
        </form>
      </Modal>

      {/* =====================================================
          VIEW TAX MODAL
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTax(null);
        }}
        title="View Tax"
      >
        {selectedTax && (
          <Grid columns={1}>
            <div>
              <strong>Tax Name</strong>

              <div>{selectedTax.name || "-"}</div>
            </div>

            <div>
              <strong>Tax Code</strong>

              <div>{selectedTax.code || "-"}</div>
            </div>

            <div>
              <strong>Tax Type</strong>

              <div>{selectedTax.type || "-"}</div>
            </div>

            <div>
              <strong>Tax Rate</strong>

              <div>{selectedTax.rate ?? "-"}%</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedTax.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedTax.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedTax.createdAt
                  ? new Date(selectedTax.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default TaxPage;
