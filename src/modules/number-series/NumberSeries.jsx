import { useEffect, useMemo, useState } from "react";
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
  fetchNumberSeries,
  createNumberSeries,
  updateNumberSeries,
  deleteNumberSeries,
} from "./store/number-series.thunks.js";

import {
  selectNumberSeries,
  selectNumberSeriesStatus,
} from "./store/number-series.selectors.js";

import { selectCompanies } from "../company/store/company.selectors.js";

import { selectFinancialYears } from "../financial-year/store/financial-year.selectors.js";

import { fetchCompanies } from "../company/store/company.thunks.js";

import { fetchFinancialYears } from "../financial-year/store/financial-year.thunks.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  financialYearId: "",

  documentType: "SALES_INVOICE",

  prefix: "",

  includeFinancialYear: false,

  financialYearFormat: "YYYY-YY",

  separator: "-",

  numberPadding: 4,

  startingNumber: 1,

  currentNumber: 0,

  suffix: "",

  status: "ACTIVE",
};

// ============================================================
// DOCUMENT TYPE OPTIONS
// ============================================================

const documentTypeOptions = [
  {
    value: "QUOTATION",
    label: "Quotation",
  },
  {
    value: "SALES_ORDER",
    label: "Sales Order",
  },
  {
    value: "DELIVERY_CHALLAN",
    label: "Delivery Challan",
  },
  {
    value: "SALES_INVOICE",
    label: "Sales Invoice",
  },
  {
    value: "SALES_RETURN",
    label: "Sales Return",
  },
  {
    value: "PURCHASE_RFQ",
    label: "Purchase RFQ",
  },
  {
    value: "PURCHASE_ORDER",
    label: "Purchase Order",
  },
  {
    value: "GRN",
    label: "GRN",
  },
  {
    value: "PURCHASE_INVOICE",
    label: "Purchase Invoice",
  },
  {
    value: "PURCHASE_RETURN",
    label: "Purchase Return",
  },
  {
    value: "JOB_WORK",
    label: "Job Work",
  },
  {
    value: "JOB_WORK_INVOICE",
    label: "Job Work Invoice",
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
  {
    value: "CREDIT_NOTE",
    label: "Credit Note",
  },
  {
    value: "DEBIT_NOTE",
    label: "Debit Note",
  },
];

// ============================================================
// FINANCIAL YEAR FORMAT OPTIONS
// ============================================================

const financialYearFormatOptions = [
  {
    value: "YYYY-YY",
    label: "2026-27",
  },
  {
    value: "YY-YY",
    label: "26-27",
  },
  {
    value: "YYYY",
    label: "2026",
  },
  {
    value: "YY",
    label: "26",
  },
];

// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
];

// ============================================================
// PAGE
// ============================================================

function NumberSeries() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX STATE
  // ==========================================================

  const numberSeries = useSelector(selectNumberSeries);

  const status = useSelector(selectNumberSeriesStatus);

  const companies = useSelector(selectCompanies);

  const financialYears = useSelector(selectFinancialYears);

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING
  // ==========================================================

  const [selectedNumberSeries, setSelectedNumberSeries] = useState(null);

  const [editingNumberSeries, setEditingNumberSeries] = useState(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = useMemo(() => {
    return (
      companies?.map((company) => ({
        label: company.name || company.code || "Unnamed Company",

        value: company._id,
      })) ?? []
    );
  }, [companies]);

  // ==========================================================
  // FINANCIAL YEAR OPTIONS
  // ==========================================================

  const financialYearOptions = useMemo(() => {
    return (
      financialYears
        ?.filter((financialYear) => {
          if (!formData.companyId) {
            return true;
          }

          const financialYearCompanyId =
            financialYear.companyId?._id || financialYear.companyId;

          return financialYearCompanyId === formData.companyId;
        })
        .map((financialYear) => ({
          label:
            financialYear.name ||
            financialYear.label ||
            financialYear.code ||
            "Unnamed Financial Year",

          value: financialYear._id,
        })) ?? []
    );
  }, [financialYears, formData.companyId]);

  // ==========================================================
  // INITIAL FETCH
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(
      fetchCompanies({
        workspaceId: selectedWorkspace._id,
      }),
    );

    dispatch(
      fetchFinancialYears({
        workspaceId: selectedWorkspace._id,
      }),
    );

    dispatch(
      fetchNumberSeries({
        workspaceId: selectedWorkspace._id,
      }),
    );
  }, [dispatch, selectedWorkspace?._id]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));

    // --------------------------------------------------------
    // COMPANY CHANGED
    // --------------------------------------------------------

    if (name === "companyId") {
      setFormData((previous) => ({
        ...previous,

        companyId: value,

        financialYearId: "",
      }));
    }
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingNumberSeries(null);
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

  const handleView = (numberSeriesItem) => {
    setSelectedNumberSeries(numberSeriesItem);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (numberSeriesItem) => {
    setEditingNumberSeries(numberSeriesItem);

    const companyId =
      numberSeriesItem.companyId?._id || numberSeriesItem.companyId || "";

    setFormData({
      companyId,

      financialYearId:
        numberSeriesItem.financialYearId?._id ||
        numberSeriesItem.financialYearId ||
        "",

      documentType: numberSeriesItem.documentType || "SALES_INVOICE",

      prefix: numberSeriesItem.prefix || "",

      includeFinancialYear: numberSeriesItem.includeFinancialYear || false,

      financialYearFormat: numberSeriesItem.financialYearFormat || "YYYY-YY",

      separator: numberSeriesItem.separator || "-",

      numberPadding: numberSeriesItem.numberPadding ?? 4,

      startingNumber: numberSeriesItem.startingNumber ?? 1,

      currentNumber: numberSeriesItem.currentNumber ?? 0,

      suffix: numberSeriesItem.suffix || "",

      status: numberSeriesItem.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (numberSeriesItem) => {
    const result = await dispatch(deleteNumberSeries(numberSeriesItem._id));

    if (deleteNumberSeries.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Number Series Deleted",
        message: "Number series deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete number series.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedWorkspace?._id) {
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

    if (!formData.financialYearId) {
      showToast({
        type: "error",
        title: "Financial Year Required",
        message: "Please select a financial year.",
      });

      return;
    }

    if (!formData.documentType) {
      showToast({
        type: "error",
        title: "Document Type Required",
        message: "Please select a document type.",
      });

      return;
    }

    if (Number(formData.startingNumber) < 1) {
      showToast({
        type: "error",
        title: "Invalid Starting Number",
        message: "Starting number must be at least 1.",
      });

      return;
    }

    if (
      Number(formData.numberPadding) < 0 ||
      Number(formData.numberPadding) > 10
    ) {
      showToast({
        type: "error",
        title: "Invalid Number Padding",
        message: "Number padding must be between 0 and 10.",
      });

      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      workspaceId: selectedWorkspace._id,

      companyId: formData.companyId,

      financialYearId: formData.financialYearId,

      documentType: formData.documentType,

      prefix: formData.prefix?.trim().toUpperCase() || "",

      includeFinancialYear: Boolean(formData.includeFinancialYear),

      financialYearFormat: formData.financialYearFormat,

      separator: formData.separator ?? "",

      numberPadding: Number(formData.numberPadding),

      startingNumber: Number(formData.startingNumber),

      currentNumber: Number(formData.currentNumber),

      suffix: formData.suffix?.trim().toUpperCase() || "",

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingNumberSeries) {
      const result = await dispatch(
        updateNumberSeries({
          id: editingNumberSeries._id,
          payload,
        }),
      );

      if (updateNumberSeries.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Number Series Updated",
          message: "Number series updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update number series.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createNumberSeries(payload));

    if (createNumberSeries.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Number Series Created",
        message: "Number series created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create number series.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "documentType",
      label: "Document Type",

      render: (row) => row.documentType || "-",
    },

    {
      key: "companyId",
      label: "Company",

      render: (row) =>
        row.companyId?.name || row.companyId?.code || row.companyId || "-",
    },

    {
      key: "financialYearId",
      label: "Financial Year",

      render: (row) =>
        row.financialYearId?.name ||
        row.financialYearId?.code ||
        row.financialYearId ||
        "-",
    },

    {
      key: "prefix",
      label: "Prefix",

      render: (row) => row.prefix || "-",
    },

    {
      key: "includeFinancialYear",
      label: "Financial Year",

      render: (row) =>
        row.includeFinancialYear ? row.financialYearFormat : "No",
    },

    {
      key: "numberPadding",
      label: "Padding",

      render: (row) => row.numberPadding ?? 0,
    },

    {
      key: "startingNumber",
      label: "Start",

      render: (row) => row.startingNumber ?? 1,
    },

    {
      key: "currentNumber",
      label: "Current",

      render: (row) => row.currentNumber ?? 0,
    },

    {
      key: "status",
      label: "Status",

      render: (row) => <Badge>{row.status || "-"}</Badge>,
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
        title="Number Series"
        description="Manage company and financial year wise document numbering."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Number Series
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
          TABLE
      ==================================================== */}

      <Table
        title="Number Series"
        columns={columns}
        data={numberSeries}
        rowKey="_id"
        emptyMessage="No number series found."
        loading={status === "loading"}
        searchPlaceholder="Search number series..."
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
        title={editingNumberSeries ? "Edit Number Series" : "Add Number Series"}
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

            <Button type="submit" form="number-series-form">
              {editingNumberSeries
                ? "Update Number Series"
                : "Create Number Series"}
            </Button>
          </>
        }
      >
        <form id="number-series-form" onSubmit={handleSubmit}>
          <Grid>
            {/* ------------------------------------------------
                COMPANY
            ------------------------------------------------ */}

            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              options={companyOptions}
            />

            {/* ------------------------------------------------
                FINANCIAL YEAR
            ------------------------------------------------ */}

            <Select
              label="Financial Year"
              name="financialYearId"
              value={formData.financialYearId}
              onChange={handleChange}
              options={financialYearOptions}
            />

            {/* ------------------------------------------------
                DOCUMENT TYPE
            ------------------------------------------------ */}

            <Select
              label="Document Type"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              options={documentTypeOptions}
            />

            {/* ------------------------------------------------
                PREFIX
            ------------------------------------------------ */}

            <Input
              label="Prefix"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              placeholder="Example: INV"
            />

            {/* ------------------------------------------------
                INCLUDE FINANCIAL YEAR
            ------------------------------------------------ */}

            <Select
              label="Include Financial Year"
              name="includeFinancialYear"
              value={formData.includeFinancialYear ? "true" : "false"}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,

                  includeFinancialYear: event.target.value === "true",
                }));
              }}
              options={[
                {
                  value: "true",
                  label: "Yes",
                },
                {
                  value: "false",
                  label: "No",
                },
              ]}
            />

            {/* ------------------------------------------------
                FINANCIAL YEAR FORMAT
            ------------------------------------------------ */}

            <Select
              label="Financial Year Format"
              name="financialYearFormat"
              value={formData.financialYearFormat}
              onChange={handleChange}
              options={financialYearFormatOptions}
            />

            {/* ------------------------------------------------
                SEPARATOR
            ------------------------------------------------ */}

            <Input
              label="Separator"
              name="separator"
              value={formData.separator}
              onChange={handleChange}
              placeholder="Example: -"
            />

            {/* ------------------------------------------------
                NUMBER PADDING
            ------------------------------------------------ */}

            <Input
              label="Number Padding"
              name="numberPadding"
              type="number"
              min="0"
              max="10"
              value={formData.numberPadding}
              onChange={handleChange}
              placeholder="Example: 4"
            />

            {/* ------------------------------------------------
                STARTING NUMBER
            ------------------------------------------------ */}

            <Input
              label="Starting Number"
              name="startingNumber"
              type="number"
              min="1"
              value={formData.startingNumber}
              onChange={handleChange}
              placeholder="Example: 1"
            />

            {/* ------------------------------------------------
                CURRENT NUMBER
            ------------------------------------------------ */}

            <Input
              label="Current Number"
              name="currentNumber"
              type="number"
              min="0"
              value={formData.currentNumber}
              onChange={handleChange}
              placeholder="Example: 0"
            />

            {/* ------------------------------------------------
                SUFFIX
            ------------------------------------------------ */}

            <Input
              label="Suffix"
              name="suffix"
              value={formData.suffix}
              onChange={handleChange}
              placeholder="Example: FY"
            />

            {/* ------------------------------------------------
                STATUS
            ------------------------------------------------ */}

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
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

          setSelectedNumberSeries(null);
        }}
        title="View Number Series"
      >
        {selectedNumberSeries && (
          <Grid columns={1}>
            <div>
              <strong>Document Type</strong>

              <div>{selectedNumberSeries.documentType || "-"}</div>
            </div>

            <div>
              <strong>Company</strong>

              <div>
                {selectedNumberSeries.companyId?.name ||
                  selectedNumberSeries.companyId?.code ||
                  selectedNumberSeries.companyId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Financial Year</strong>

              <div>
                {selectedNumberSeries.financialYearId?.name ||
                  selectedNumberSeries.financialYearId?.code ||
                  selectedNumberSeries.financialYearId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Prefix</strong>

              <div>{selectedNumberSeries.prefix || "-"}</div>
            </div>

            <div>
              <strong>Include Financial Year</strong>

              <div>
                {selectedNumberSeries.includeFinancialYear ? "Yes" : "No"}
              </div>
            </div>

            <div>
              <strong>Financial Year Format</strong>

              <div>{selectedNumberSeries.financialYearFormat || "-"}</div>
            </div>

            <div>
              <strong>Separator</strong>

              <div>{selectedNumberSeries.separator || "-"}</div>
            </div>

            <div>
              <strong>Number Padding</strong>

              <div>{selectedNumberSeries.numberPadding ?? 0}</div>
            </div>

            <div>
              <strong>Starting Number</strong>

              <div>{selectedNumberSeries.startingNumber ?? 1}</div>
            </div>

            <div>
              <strong>Current Number</strong>

              <div>{selectedNumberSeries.currentNumber ?? 0}</div>
            </div>

            <div>
              <strong>Suffix</strong>

              <div>{selectedNumberSeries.suffix || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedNumberSeries.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default NumberSeries;
