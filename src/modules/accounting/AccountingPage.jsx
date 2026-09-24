import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

// ============================================================
// COMMON UI
// ============================================================

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";

import Table from "../../components/common/table/Table.jsx";

import Modal from "../../components/common/modal/Modal.jsx";

import Grid from "../../components/common/grid/Grid.jsx";

import Badge from "../../components/common/badge/Badge.jsx";

import { Input, Select, Textarea } from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

// ============================================================
// ACCOUNTING STORE
// ============================================================

import {
  getAccountingTransactions,
  createAccounting,
  updateAccounting,
  deleteAccounting,
} from "./store/accounting.thunks.js";

import {
  selectAccountingTransactions,
  selectAccountingStatus,
} from "./store/accounting.selectors.js";

// ============================================================
// WORKSPACE
// ============================================================

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// COMPANY
// ============================================================

import { fetchCompanies } from "../company/store/company.thunks.js";

import { selectCompanies } from "../company/store/company.selectors.js";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  financialYearId: "",

  transactionType: "CASH",

  transactionNumber: "",

  transactionDate: new Date().toISOString().split("T")[0],

  paymentMode: "",

  bankAccountId: "",
  partnerId: "",
  currencyId: "",

  referenceNumber: "",
  referenceDate: "",

  amount: "",

  chequeNumber: "",
  chequeDate: "",

  narration: "",
  notes: "",

  status: "DRAFT",
};

// ============================================================
// TRANSACTION TYPES
// ============================================================

const transactionTypeOptions = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "BANK",
    label: "Bank",
  },
  {
    value: "RECEIPT",
    label: "Receipt",
  },
  {
    value: "PAYMENT",
    label: "Payment",
  },
  {
    value: "CONTRA",
    label: "Contra",
  },
  {
    value: "JOURNAL",
    label: "Journal",
  },
  {
    value: "EXPENSE",
    label: "Expense",
  },
  {
    value: "INCOME",
    label: "Income",
  },
];

// ============================================================
// PAYMENT MODES
// ============================================================

const paymentModeOptions = [
  {
    value: "",
    label: "Select Payment Mode",
  },
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "CHEQUE",
    label: "Cheque",
  },
  {
    value: "RTGS",
    label: "RTGS",
  },
  {
    value: "NEFT",
    label: "NEFT",
  },
  {
    value: "IMPS",
    label: "IMPS",
  },
  {
    value: "UPI",
    label: "UPI",
  },
];

// ============================================================
// STATUS
// ============================================================

const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "POSTED",
    label: "Posted",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "object") {
    return value?._id || "";
  }

  return value;
};

const getRelationLabel = (value) => {
  if (!value) {
    return "-";
  }

  if (typeof value === "object") {
    return value?.name || value?.code || value?._id || "-";
  }

  return value;
};

const formatLabel = (value) => {
  if (!value) {
    return "-";
  }

  return String(value)
    .replaceAll("_", " ")
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
};

const getNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// ============================================================
// PAGE
// ============================================================

function AccountingPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX
  // ==========================================================

  const transactions = useSelector(selectAccountingTransactions);

  const status = useSelector(selectAccountingStatus);

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  const companies = useSelector(selectCompanies);

  // ==========================================================
  // WORKSPACE
  // ==========================================================

  const activeWorkspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING
  // ==========================================================

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [editingTransaction, setEditingTransaction] = useState(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // LIST FILTERS
  // ==========================================================

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");

  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");

  const [selectedPaymentModeFilter, setSelectedPaymentModeFilter] =
    useState("");

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  // ==========================================================
  // FETCH COMPANIES
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(fetchCompanies(activeWorkspaceId));
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // FETCH ACCOUNTING
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(
      getAccountingTransactions({
        workspaceId: activeWorkspaceId,
      }),
    );
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = useMemo(() => {
    return companies
      .filter((company) => {
        const companyWorkspaceId = getId(
          company?.workspaceId || company?.workspace,
        );

        if (!companyWorkspaceId) {
          return true;
        }

        return companyWorkspaceId === activeWorkspaceId;
      })
      .map((company) => ({
        value: getId(company._id),
        label: company.name || company.code || company._id,
      }));
  }, [companies, activeWorkspaceId]);

  // ==========================================================
  // FILTERED TRANSACTIONS
  // ==========================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const companyId = getId(transaction.companyId);

      const companyMatch =
        !selectedCompanyFilter || companyId === selectedCompanyFilter;

      const typeMatch =
        !selectedTypeFilter ||
        transaction.transactionType === selectedTypeFilter;

      const paymentModeMatch =
        !selectedPaymentModeFilter ||
        transaction.paymentMode === selectedPaymentModeFilter;

      const statusMatch =
        !selectedStatusFilter || transaction.status === selectedStatusFilter;

      return companyMatch && typeMatch && paymentModeMatch && statusMatch;
    });
  }, [
    transactions,
    selectedCompanyFilter,
    selectedTypeFilter,
    selectedPaymentModeFilter,
    selectedStatusFilter,
  ]);

  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      transactionDate: new Date().toISOString().split("T")[0],
    });

    setEditingTransaction(null);
  };

  // ==========================================================
  // OPEN CREATE
  // ==========================================================

  const handleCreate = () => {
    setEditingTransaction(null);

    setFormData({
      ...initialFormData,
      transactionDate: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // OPEN VIEW
  // ==========================================================

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // OPEN EDIT
  // ==========================================================

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);

    setFormData({
      companyId: getId(transaction.companyId),

      branchId: getId(transaction.branchId),

      financialYearId: getId(transaction.financialYearId),

      transactionType: transaction.transactionType || "CASH",

      transactionNumber: transaction.transactionNumber || "",

      transactionDate: transaction.transactionDate
        ? new Date(transaction.transactionDate).toISOString().split("T")[0]
        : "",

      paymentMode: transaction.paymentMode || "",

      bankAccountId: getId(transaction.bankAccountId),

      partnerId: getId(transaction.partnerId),

      currencyId: getId(transaction.currencyId),

      referenceNumber: transaction.referenceNumber || "",

      referenceDate: transaction.referenceDate
        ? new Date(transaction.referenceDate).toISOString().split("T")[0]
        : "",

      amount: transaction.amount ?? "",

      chequeNumber: transaction.chequeNumber || "",

      chequeDate: transaction.chequeDate
        ? new Date(transaction.chequeDate).toISOString().split("T")[0]
        : "",

      narration: transaction.narration || "",

      notes: transaction.notes || "",

      status: transaction.status || "DRAFT",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (transaction) => {
    const confirmed = window.confirm(
      `Delete accounting transaction "${transaction.transactionNumber}"?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteAccounting(transaction._id));

    if (deleteAccounting.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Deleted",
        message: "Accounting transaction deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete accounting transaction.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    if (!formData.companyId) {
      showToast({
        type: "error",
        title: "Company Required",
        message: "Please select a company.",
      });

      return;
    }

    if (!formData.transactionNumber?.trim()) {
      showToast({
        type: "error",
        title: "Transaction Number Required",
        message: "Please enter transaction number.",
      });

      return;
    }

    if (!formData.transactionDate) {
      showToast({
        type: "error",
        title: "Date Required",
        message: "Please select transaction date.",
      });

      return;
    }

    const amount = getNumber(formData.amount);

    if (amount < 0) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        message: "Amount cannot be negative.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      workspaceId: activeWorkspaceId,

      companyId: formData.companyId,

      branchId: formData.branchId || null,

      financialYearId: formData.financialYearId || null,

      transactionType: formData.transactionType,

      transactionNumber: formData.transactionNumber.trim().toUpperCase(),

      transactionDate: formData.transactionDate,

      paymentMode: formData.paymentMode || null,

      bankAccountId: formData.bankAccountId || null,

      partnerId: formData.partnerId || null,

      currencyId: formData.currencyId || null,

      referenceNumber: formData.referenceNumber?.trim() || "",

      referenceDate: formData.referenceDate || null,

      amount,

      chequeNumber: formData.chequeNumber?.trim() || "",

      chequeDate: formData.chequeDate || null,

      narration: formData.narration?.trim() || "",

      notes: formData.notes?.trim() || "",

      status: formData.status,

      entries: [],
    };

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    if (editingTransaction) {
      const result = await dispatch(
        updateAccounting({
          id: editingTransaction._id,
          payload,
        }),
      );

      if (updateAccounting.fulfilled.match(result)) {
        showToast({
          type: "success",
          title: "Transaction Updated",
          message: "Accounting transaction updated successfully.",
        });

        setIsModalOpen(false);

        resetForm();

        dispatch(
          getAccountingTransactions({
            workspaceId: activeWorkspaceId,
          }),
        );

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update accounting transaction.",
      });

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const result = await dispatch(createAccounting(payload));

    if (createAccounting.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Transaction Created",
        message: "Accounting transaction created successfully.",
      });

      setIsModalOpen(false);

      resetForm();

      dispatch(
        getAccountingTransactions({
          workspaceId: activeWorkspaceId,
        }),
      );

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create accounting transaction.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "transactionNumber",
      label: "Transaction No.",
    },

    {
      key: "transactionDate",
      label: "Date",

      render: (row) => {
        if (!row.transactionDate) {
          return "-";
        }

        return new Date(row.transactionDate).toLocaleDateString("en-IN");
      },
    },

    {
      key: "transactionType",
      label: "Type",

      render: (row) => formatLabel(row.transactionType),
    },

    {
      key: "companyId",
      label: "Company",

      render: (row) => getRelationLabel(row.companyId),
    },

    {
      key: "paymentMode",
      label: "Payment Mode",

      render: (row) => (row.paymentMode ? formatLabel(row.paymentMode) : "-"),
    },

    {
      key: "amount",
      label: "Amount",

      render: (row) =>
        Number(row.amount || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
    },

    {
      key: "status",
      label: "Status",

      render: (row) => <Badge>{formatLabel(row.status)}</Badge>,
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
        title="Accounting"
        description="Manage accounting transactions."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Transaction
          </Button>
        }
      />

      {/* ====================================================
          FILTERS
      ==================================================== */}

      <Grid>
        <Select
          label="Company"
          name="selectedCompanyFilter"
          value={selectedCompanyFilter}
          onChange={(event) => setSelectedCompanyFilter(event.target.value)}
          options={[
            {
              value: "",
              label: "All Companies",
            },
            ...companyOptions,
          ]}
        />

        <Select
          label="Transaction Type"
          name="selectedTypeFilter"
          value={selectedTypeFilter}
          onChange={(event) => setSelectedTypeFilter(event.target.value)}
          options={[
            {
              value: "",
              label: "All Types",
            },
            ...transactionTypeOptions,
          ]}
        />

        <Select
          label="Payment Mode"
          name="selectedPaymentModeFilter"
          value={selectedPaymentModeFilter}
          onChange={(event) => setSelectedPaymentModeFilter(event.target.value)}
          options={[
            {
              value: "",
              label: "All Payment Modes",
            },
            ...paymentModeOptions.filter((option) => option.value),
          ]}
        />

        <Select
          label="Status"
          name="selectedStatusFilter"
          value={selectedStatusFilter}
          onChange={(event) => setSelectedStatusFilter(event.target.value)}
          options={[
            {
              value: "",
              label: "All Status",
            },
            ...statusOptions,
          ]}
        />
      </Grid>

      {/* ====================================================
          TABLE
      ==================================================== */}

      <Table
        title="Accounting Transactions"
        columns={columns}
        data={filteredTransactions}
        rowKey="_id"
        emptyMessage="No accounting transactions found."
        loading={status === "loading"}
        searchPlaceholder="Search transactions..."
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
          editingTransaction
            ? "Edit Accounting Transaction"
            : "Add Accounting Transaction"
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

            <Button type="submit" form="accounting-form">
              {editingTransaction ? "Update Transaction" : "Create Transaction"}
            </Button>
          </>
        }
      >
        <form id="accounting-form" onSubmit={handleSubmit}>
          <Grid>
            {/* COMPANY */}

            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Company",
                },
                ...companyOptions,
              ]}
            />

            {/* TRANSACTION TYPE */}

            <Select
              label="Transaction Type"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              options={transactionTypeOptions}
            />

            {/* TRANSACTION NUMBER */}

            <Input
              label="Transaction Number"
              name="transactionNumber"
              value={formData.transactionNumber}
              onChange={handleChange}
              placeholder="Enter transaction number"
            />

            {/* DATE */}

            <Input
              type="date"
              label="Transaction Date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
            />

            {/* PAYMENT MODE */}

            <Select
              label="Payment Mode"
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              options={paymentModeOptions}
            />

            {/* AMOUNT */}

            <Input
              type="number"
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />

            {/* REFERENCE NUMBER */}

            <Input
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="Enter reference number"
            />

            {/* REFERENCE DATE */}

            <Input
              type="date"
              label="Reference Date"
              name="referenceDate"
              value={formData.referenceDate}
              onChange={handleChange}
            />

            {/* CHEQUE NUMBER */}

            <Input
              label="Cheque Number"
              name="chequeNumber"
              value={formData.chequeNumber}
              onChange={handleChange}
              placeholder="Enter cheque number"
            />

            {/* CHEQUE DATE */}

            <Input
              type="date"
              label="Cheque Date"
              name="chequeDate"
              value={formData.chequeDate}
              onChange={handleChange}
            />

            {/* STATUS */}

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            {/* NARRATION */}

            <Textarea
              label="Narration"
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              placeholder="Enter narration"
            />

            {/* NOTES */}

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="View Accounting Transaction"
        footer={
          <Button
            type="button"
            onClick={() => {
              setIsViewModalOpen(false);
              setSelectedTransaction(null);
            }}
          >
            Close
          </Button>
        }
      >
        {selectedTransaction ? (
          <Grid>
            <Input
              label="Transaction Number"
              value={selectedTransaction.transactionNumber || ""}
              readOnly
            />

            <Input
              label="Transaction Type"
              value={formatLabel(selectedTransaction.transactionType)}
              readOnly
            />

            <Input
              label="Company"
              value={getRelationLabel(selectedTransaction.companyId)}
              readOnly
            />

            <Input
              label="Date"
              value={
                selectedTransaction.transactionDate
                  ? new Date(
                      selectedTransaction.transactionDate,
                    ).toLocaleDateString("en-IN")
                  : ""
              }
              readOnly
            />

            <Input
              label="Payment Mode"
              value={
                selectedTransaction.paymentMode
                  ? formatLabel(selectedTransaction.paymentMode)
                  : ""
              }
              readOnly
            />

            <Input
              label="Amount"
              value={String(selectedTransaction.amount ?? "")}
              readOnly
            />

            <Input
              label="Reference Number"
              value={selectedTransaction.referenceNumber || ""}
              readOnly
            />

            <Input
              label="Status"
              value={formatLabel(selectedTransaction.status)}
              readOnly
            />

            <Textarea
              label="Narration"
              value={selectedTransaction.narration || ""}
              readOnly
            />

            <Textarea
              label="Notes"
              value={selectedTransaction.notes || ""}
              readOnly
            />
          </Grid>
        ) : (
          <p>No transaction selected.</p>
        )}
      </Modal>
    </section>
  );
}

export default AccountingPage;
