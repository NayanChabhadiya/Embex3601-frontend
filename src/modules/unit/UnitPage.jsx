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
  fetchUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "./store/unit.thunks.js";

import { selectUnits, selectUnitStatus } from "./store/unit.selectors.js";

function UnitPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // =========================================================
  // Redux State
  // =========================================================

  const units = useSelector(selectUnits);
  const status = useSelector(selectUnitStatus);

  // =========================================================
  // Modal State
  // =========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // =========================================================
  // Selected / Editing Unit
  // =========================================================

  const [selectedUnit, setSelectedUnit] = useState(null);

  const [editingUnit, setEditingUnit] = useState(null);

  // =========================================================
  // Unit Form
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    symbol: "",
    description: "",
    type: "QUANTITY",
    status: "ACTIVE",
  });

  // =========================================================
  // Fetch Units
  // =========================================================

  useEffect(() => {
    dispatch(fetchUnits());
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
      name: "",
      code: "",
      symbol: "",
      description: "",
      type: "QUANTITY",
      status: "ACTIVE",
    });

    setEditingUnit(null);
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

  const handleView = (unit) => {
    setSelectedUnit(unit);

    setIsViewModalOpen(true);
  };

  // =========================================================
  // Open Edit Modal
  // =========================================================

  const handleEdit = (unit) => {
    setEditingUnit(unit);

    setFormData({
      name: unit.name || "",
      code: unit.code || "",
      symbol: unit.symbol || "",
      description: unit.description || "",
      type: unit.type || "QUANTITY",
      status: unit.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // =========================================================
  // Delete Unit
  // =========================================================

  const handleDelete = async (unit) => {
    const result = await dispatch(deleteUnit(unit._id));

    if (deleteUnit.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Unit Deleted",
        message: "Unit deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete unit.",
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

    if (editingUnit) {
      const payload = {
        name: formData.name,
        code: formData.code,
        symbol: formData.symbol,
        description: formData.description,
        type: formData.type,
        status: formData.status,
      };

      const result = await dispatch(
        updateUnit({
          id: editingUnit._id,
          payload,
        }),
      );

      if (updateUnit.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Unit Updated",
          message: "Unit updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update unit.",
      });

      return;
    }

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------

    const result = await dispatch(createUnit(formData));

    if (createUnit.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Unit Created",
        message: "Unit created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create unit.",
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
      key: "symbol",
      label: "Symbol",
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
        title="Units"
        description="Manage measurement units."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Unit
          </Button>
        }
      />

      {/* =====================================================
          Unit Table
      ===================================================== */}

      <Table
        title="Units"
        columns={columns}
        data={units}
        rowKey="_id"
        emptyMessage="No units found."
        loading={status === "loading"}
        searchPlaceholder="Search units..."
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
        title={editingUnit ? "Edit Unit" : "Add Unit"}
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

            <Button type="submit" form="unit-form">
              {editingUnit ? "Update Unit" : "Create Unit"}
            </Button>
          </>
        }
      >
        <form id="unit-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Unit Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter unit name"
            />

            <Input
              label="Unit Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter unit code"
            />

            <Input
              label="Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="Enter unit symbol"
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "QUANTITY",
                  label: "Quantity",
                },
                {
                  value: "WEIGHT",
                  label: "Weight",
                },
                {
                  value: "LENGTH",
                  label: "Length",
                },
                {
                  value: "AREA",
                  label: "Area",
                },
                {
                  value: "VOLUME",
                  label: "Volume",
                },
                {
                  value: "TIME",
                  label: "Time",
                },
                {
                  value: "OTHER",
                  label: "Other",
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
              placeholder="Enter unit description"
            />
          </Grid>
        </form>
      </Modal>

      {/* =====================================================
          View Unit Modal
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUnit(null);
        }}
        title="View Unit"
      >
        {selectedUnit && (
          <Grid columns={1}>
            <div>
              <strong>Unit Name</strong>

              <div>{selectedUnit.name || "-"}</div>
            </div>

            <div>
              <strong>Unit Code</strong>

              <div>{selectedUnit.code || "-"}</div>
            </div>

            <div>
              <strong>Symbol</strong>

              <div>{selectedUnit.symbol || "-"}</div>
            </div>

            <div>
              <strong>Type</strong>

              <div>{selectedUnit.type || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedUnit.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedUnit.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedUnit.createdAt
                  ? new Date(selectedUnit.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default UnitPage;
