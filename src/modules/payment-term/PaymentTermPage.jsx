import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../components/common/icons/index.js";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

import {
  fetchPaymentTerms,
  createPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm,
} from "./store/payment-term.thunks.js";

import {
  selectPaymentTerms,
  selectPaymentTermStatus,
  selectPaymentTermError,
} from "./store/payment-term.selectors.js";
import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

function PaymentTermPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // REDUX STATE
  // ==========================================================

  const paymentTerms = useSelector(selectPaymentTerms);

  const status = useSelector(selectPaymentTermStatus);

  const error = useSelector(selectPaymentTermError);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PAYMENT TERM
  // ==========================================================

  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState(null);

  const [editingPaymentTerm, setEditingPaymentTerm] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    dueDays: "0",
    status: "ACTIVE",
  });

  // ==========================================================
  // FETCH PAYMENT TERMS
  // ==========================================================

  useEffect(() => {
    dispatch(fetchPaymentTerms());
  }, [dispatch]);

  // ==========================================================
  // HANDLE INPUT CHANGE
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
    setFormData({
      name: "",
      code: "",
      description: "",
      dueDays: "0",
      status: "ACTIVE",
    });

    setEditingPaymentTerm(null);
  };

  // ==========================================================
  // OPEN CREATE MODAL
  // ==========================================================

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // ==========================================================
  // OPEN VIEW MODAL
  // ==========================================================

  const handleView = (paymentTerm) => {
    setSelectedPaymentTerm(paymentTerm);
    setIsViewModalOpen(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const handleEdit = (paymentTerm) => {
    setEditingPaymentTerm(paymentTerm);

    setFormData({
      name: paymentTerm.name || "",
      code: paymentTerm.code || "",
      description: paymentTerm.description || "",
      dueDays:
        paymentTerm.dueDays !== undefined && paymentTerm.dueDays !== null
          ? String(paymentTerm.dueDays)
          : "0",
      status: paymentTerm.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE PAYMENT TERM
  // ==========================================================

  const handleDelete = async (paymentTerm) => {
    const result = await dispatch(deletePaymentTerm(paymentTerm._id));

    if (deletePaymentTerm.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Payment Term Deleted",
        message: "Payment term deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete payment term.",
    });
  };

  // ==========================================================
  // CREATE / UPDATE SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ==========================================================
    // Workspace Required
    // ==========================================================

    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    // ==========================================================
    // Payload
    // ==========================================================

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name,

      code: formData.code,

      description: formData.description,

      dueDays: Number(formData.dueDays),

      status: formData.status,
    };

    // ==========================================================
    // Debug - temporarily keep this
    // ==========================================================

    console.log("Selected Workspace:", selectedWorkspace);

    console.log("Payment Term Payload:", payload);

    // ==========================================================
    // UPDATE
    // ==========================================================

    if (editingPaymentTerm) {
      const result = await dispatch(
        updatePaymentTerm({
          id: editingPaymentTerm._id,
          payload,
        }),
      );

      if (updatePaymentTerm.fulfilled.match(result)) {
        setIsModalOpen(false);
        resetForm();

        showToast({
          type: "success",
          title: "Payment Term Updated",
          message: "Payment term updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update payment term.",
      });

      return;
    }

    // ==========================================================
    // CREATE
    // ==========================================================

    const result = await dispatch(createPaymentTerm(payload));

    if (createPaymentTerm.fulfilled.match(result)) {
      setIsModalOpen(false);
      resetForm();

      showToast({
        type: "success",
        title: "Payment Term Created",
        message: "Payment term created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create payment term.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
    },

    {
      key: "name",
      label: "Payment Term",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "description",
      label: "Description",
    },

    {
      key: "dueDays",
      label: "Due Days",
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

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <PageHeader
        title="Payment Terms"
        description="Manage payment terms used across your workspace."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Payment Term
          </Button>
        }
      />

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && <div>{error}</div>}

      {/* =====================================================
          PAYMENT TERM TABLE
      ===================================================== */}

      <Table
        title="Payment Terms"
        columns={columns}
        data={paymentTerms}
        rowKey="_id"
        emptyMessage="No payment terms found."
        loading={status === "loading"}
        searchPlaceholder="Search payment terms..."
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
        title={editingPaymentTerm ? "Edit Payment Term" : "Add Payment Term"}
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

            <Button type="submit" form="payment-term-form">
              {editingPaymentTerm
                ? "Update Payment Term"
                : "Create Payment Term"}
            </Button>
          </>
        }
      >
        <form id="payment-term-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Payment Term Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Net 30"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. NET30"
            />

            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />

            <Input
              label="Due Days"
              name="dueDays"
              type="number"
              value={formData.dueDays}
              onChange={handleChange}
              placeholder="Enter due days"
              min="0"
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
          </Grid>
        </form>
      </Modal>

      {/* =====================================================
          VIEW PAYMENT TERM MODAL
      ===================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedPaymentTerm(null);
        }}
        title="View Payment Term"
      >
        {selectedPaymentTerm && (
          <Grid columns={1}>
            <div>
              <strong>Payment Term Name</strong>

              <div>{selectedPaymentTerm.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedPaymentTerm.code || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedPaymentTerm.description || "-"}</div>
            </div>

            <div>
              <strong>Due Days</strong>

              <div>{selectedPaymentTerm.dueDays ?? "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPaymentTerm.status || "-"}</Badge>
              </div>
            </div>

            <div>
              <strong>Created At</strong>

              <div>
                {selectedPaymentTerm.createdAt
                  ? new Date(selectedPaymentTerm.createdAt).toLocaleString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Updated At</strong>

              <div>
                {selectedPaymentTerm.updatedAt
                  ? new Date(selectedPaymentTerm.updatedAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PaymentTermPage;
