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
// GST THUNKS
// ============================================================

import {
  getGSTDocuments,
  getGSTById,
  createGST,
  updateGST,
  deleteGST,
} from "./store/gst.thunks.js";

// ============================================================
// GST SELECTORS
// ============================================================

import {
  selectGSTDocuments,
  selectSelectedGST,
  selectGSTStatus,
} from "./store/gst.selectors.js";

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
// BRANCH
// ============================================================

import { fetchBranches } from "../branch/store/branch.thunks.js";

import { selectBranches } from "../branch/store/branch.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  financialYearId: "",

  documentType: "GSTR1",

  documentNumber: "",
  documentDate: new Date().toISOString().split("T")[0],

  taxPeriod: "",

  periodStart: "",
  periodEnd: "",

  sourceType: "MANUAL",

  referenceId: "",
  referenceNumber: "",

  gstin: "",

  irn: "",

  acknowledgementNumber: "",
  acknowledgementDate: "",

  eWayBillNumber: "",

  cancelledAt: "",
  cancelReason: "",

  status: "DRAFT",

  taxableAmount: "",
  cgstAmount: "",
  sgstAmount: "",
  igstAmount: "",
  cessAmount: "",
  totalTaxAmount: "",
  totalAmount: "",

  details: "[]",

  notes: "",
};

// ============================================================
// DOCUMENT TYPES
// ============================================================

const documentTypeOptions = [
  {
    value: "GSTR1",
    label: "GSTR1",
  },
  {
    value: "GSTR3B",
    label: "GSTR3B",
  },
  {
    value: "E_INVOICE",
    label: "E-Invoice",
  },
  {
    value: "E_WAY_BILL",
    label: "E-Way Bill",
  },
];

// ============================================================
// STATUS OPTIONS
// ============================================================

const statusOptions = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "GENERATED",
    label: "Generated",
  },
  {
    value: "FILED",
    label: "Filed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

// ============================================================
// SOURCE TYPE OPTIONS
// ============================================================

const sourceTypeOptions = [
  {
    value: "PURCHASE",
    label: "Purchase",
  },
  {
    value: "SALES",
    label: "Sales",
  },
  {
    value: "JOB_WORK",
    label: "Job Work",
  },
  {
    value: "MANUAL",
    label: "Manual",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

// ============================================================
// HELPERS
// ============================================================

const getId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value?._id) {
    return String(value._id);
  }

  return String(value);
};

const formatDateInput = (value) => {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  try {
    return new Date(value).toLocaleDateString("en-IN");
  } catch {
    return "-";
  }
};

const formatAmount = (value) => {
  return `₹ ${Number(value || 0).toFixed(2)}`;
};

const formatDocumentType = (value) => {
  if (!value) {
    return "-";
  }

  return value.replaceAll("_", " ");
};

// ============================================================
// PAGE
// ============================================================

function GstPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // GST REDUX
  // ==========================================================

  const documents = useSelector(selectGSTDocuments);

  const selectedDocument = useSelector(selectSelectedGST);

  const status = useSelector(selectGSTStatus);

  // ==========================================================
  // WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  const activeWorkspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // COMPANY
  // ==========================================================

  const companies = useSelector(selectCompanies);

  // ==========================================================
  // BRANCH
  // ==========================================================

  const branches = useSelector(selectBranches);

  // ==========================================================
  // LOCAL FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // MODALS
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING
  // ==========================================================

  const [selectedGST, setSelectedGST] = useState(null);

  const [editingGST, setEditingGST] = useState(null);

  // ==========================================================
  // LIST FILTERS
  // ==========================================================

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");

  const [selectedDocumentTypeFilter, setSelectedDocumentTypeFilter] =
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
  // FETCH GST DOCUMENTS
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(
      getGSTDocuments({
        workspaceId: activeWorkspaceId,
      }),
    );
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const workspaceCompanies = useMemo(() => {
    if (!activeWorkspaceId) {
      return [];
    }

    const filteredCompanies = companies.filter((company) => {
      const companyWorkspaceId = getId(
        company.workspaceId || company.workspace,
      );

      return companyWorkspaceId === activeWorkspaceId;
    });

    return filteredCompanies.length > 0 ? filteredCompanies : companies;
  }, [companies, activeWorkspaceId]);

  const companyOptions = useMemo(() => {
    return workspaceCompanies.map((company) => ({
      value: getId(company._id),

      label: company.name || company.code || getId(company._id),
    }));
  }, [workspaceCompanies]);

  // ==========================================================
  // SELECTED COMPANY
  // ==========================================================

  const selectedFormCompanyId = getId(formData.companyId);

  // ==========================================================
  // FETCH BRANCHES FOR COMPANY
  // ==========================================================

  useEffect(() => {
    if (!selectedFormCompanyId) {
      return;
    }

    dispatch(fetchBranches(selectedFormCompanyId));
  }, [dispatch, selectedFormCompanyId]);

  // ==========================================================
  // BRANCH OPTIONS
  // ==========================================================

  const branchOptions = useMemo(() => {
    if (!selectedFormCompanyId) {
      return [];
    }

    return branches
      .filter((branch) => {
        const branchCompanyId = getId(branch.companyId || branch.company);

        return branchCompanyId === selectedFormCompanyId;
      })
      .map((branch) => ({
        value: getId(branch._id),

        label: branch.name || branch.code || getId(branch._id),
      }));
  }, [branches, selectedFormCompanyId]);

  // ==========================================================
  // COMPANY NAME
  // ==========================================================

  const getCompanyName = (document) => {
    if (document?.companyId?.name) {
      return document.companyId.name;
    }

    const companyId = getId(document?.companyId);

    const company = companies.find((item) => getId(item._id) === companyId);

    return company?.name || company?.code || "-";
  };

  // ==========================================================
  // BRANCH NAME
  // ==========================================================

  const getBranchName = (document) => {
    if (document?.branchId?.name) {
      return document.branchId.name;
    }

    const branchId = getId(document?.branchId);

    const branch = branches.find((item) => getId(item._id) === branchId);

    return branch?.name || branch?.code || "-";
  };

  // ==========================================================
  // FILTERED DOCUMENTS
  // ==========================================================

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const companyId = getId(document.companyId);

      const companyMatch =
        !selectedCompanyFilter || companyId === selectedCompanyFilter;

      const documentTypeMatch =
        !selectedDocumentTypeFilter ||
        document.documentType === selectedDocumentTypeFilter;

      const statusMatch =
        !selectedStatusFilter || document.status === selectedStatusFilter;

      return companyMatch && documentTypeMatch && statusMatch;
    });
  }, [
    documents,
    selectedCompanyFilter,
    selectedDocumentTypeFilter,
    selectedStatusFilter,
  ]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,

      ...(name === "companyId"
        ? {
            branchId: "",
          }
        : {}),
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      documentDate: new Date().toISOString().split("T")[0],
    });

    setEditingGST(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingGST(null);

    const firstCompanyId = workspaceCompanies[0]?._id || "";

    setFormData({
      ...initialFormData,

      companyId: firstCompanyId,

      documentDate: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = async (document) => {
    const result = await dispatch(getGSTById(document._id));

    if (getGSTById.fulfilled.match(result)) {
      setSelectedGST(result.payload);

      setIsViewModalOpen(true);

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to load GST document.",
    });
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = async (document) => {
    const result = await dispatch(getGSTById(document._id));

    if (!getGSTById.fulfilled.match(result)) {
      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to load GST document.",
      });

      return;
    }

    const current = result.payload?.data || result.payload;

    setEditingGST(current);

    setFormData({
      companyId: getId(current.companyId),

      branchId: getId(current.branchId),

      financialYearId: getId(current.financialYearId),

      documentType: current.documentType || "GSTR1",

      documentNumber: current.documentNumber || "",

      documentDate: formatDateInput(current.documentDate),

      taxPeriod: current.taxPeriod || "",

      periodStart: formatDateInput(current.periodStart),

      periodEnd: formatDateInput(current.periodEnd),

      sourceType: current.sourceType || "MANUAL",

      referenceId: current.referenceId || "",

      referenceNumber: current.referenceNumber || "",

      gstin: current.gstin || "",

      irn: current.irn || "",

      acknowledgementNumber: current.acknowledgementNumber || "",

      acknowledgementDate: formatDateInput(current.acknowledgementDate),

      eWayBillNumber: current.eWayBillNumber || "",

      cancelledAt: formatDateInput(current.cancelledAt),

      cancelReason: current.cancelReason || "",

      status: current.status || "DRAFT",

      taxableAmount: current.taxableAmount ?? "",

      cgstAmount: current.cgstAmount ?? "",

      sgstAmount: current.sgstAmount ?? "",

      igstAmount: current.igstAmount ?? "",

      cessAmount: current.cessAmount ?? "",

      totalTaxAmount: current.totalTaxAmount ?? "",

      totalAmount: current.totalAmount ?? "",

      details: JSON.stringify(current.details || [], null, 2),

      notes: current.notes || "",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (document) => {
    const confirmed = window.confirm(
      `Delete GST document "${document.documentNumber}"?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteGST(document._id));

    if (deleteGST.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "GST Deleted",
        message: "GST document deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete GST document.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // WORKSPACE
    // --------------------------------------------------------

    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    // --------------------------------------------------------
    // COMPANY
    // --------------------------------------------------------

    if (!formData.companyId) {
      showToast({
        type: "error",
        title: "Company Required",
        message: "Please select a company.",
      });

      return;
    }

    // --------------------------------------------------------
    // DOCUMENT TYPE
    // --------------------------------------------------------

    if (!formData.documentType) {
      showToast({
        type: "error",
        title: "Document Type Required",
        message: "Please select GST document type.",
      });

      return;
    }

    // --------------------------------------------------------
    // DOCUMENT NUMBER
    // --------------------------------------------------------

    if (!formData.documentNumber?.trim()) {
      showToast({
        type: "error",
        title: "Document Number Required",
        message: "Please enter document number.",
      });

      return;
    }

    // --------------------------------------------------------
    // DOCUMENT DATE
    // --------------------------------------------------------

    if (!formData.documentDate) {
      showToast({
        type: "error",
        title: "Document Date Required",
        message: "Please select document date.",
      });

      return;
    }

    // --------------------------------------------------------
    // DETAILS JSON
    // --------------------------------------------------------

    let parsedDetails = [];

    if (formData.details?.trim()) {
      try {
        parsedDetails = JSON.parse(formData.details);

        if (!Array.isArray(parsedDetails)) {
          showToast({
            type: "error",
            title: "Invalid Details",
            message: "Details must be a JSON array.",
          });

          return;
        }
      } catch {
        showToast({
          type: "error",
          title: "Invalid Details",
          message: "Please enter valid JSON in Details.",
        });

        return;
      }
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      workspaceId: activeWorkspaceId,

      companyId: formData.companyId,

      branchId: formData.branchId || null,

      financialYearId: formData.financialYearId || null,

      documentType: formData.documentType,

      documentNumber: formData.documentNumber.trim().toUpperCase(),

      documentDate: formData.documentDate,

      taxPeriod: formData.taxPeriod?.trim() || "",

      periodStart: formData.periodStart || null,

      periodEnd: formData.periodEnd || null,

      sourceType: formData.sourceType,

      referenceId: formData.referenceId?.trim() || "",

      referenceNumber: formData.referenceNumber?.trim().toUpperCase() || "",

      gstin: formData.gstin?.trim().toUpperCase() || "",

      irn: formData.irn?.trim() || "",

      acknowledgementNumber: formData.acknowledgementNumber?.trim() || "",

      acknowledgementDate: formData.acknowledgementDate || null,

      eWayBillNumber: formData.eWayBillNumber?.trim() || "",

      cancelledAt: formData.cancelledAt || null,

      cancelReason: formData.cancelReason?.trim() || "",

      status: formData.status,

      taxableAmount:
        formData.taxableAmount === "" ? 0 : Number(formData.taxableAmount),

      cgstAmount: formData.cgstAmount === "" ? 0 : Number(formData.cgstAmount),

      sgstAmount: formData.sgstAmount === "" ? 0 : Number(formData.sgstAmount),

      igstAmount: formData.igstAmount === "" ? 0 : Number(formData.igstAmount),

      cessAmount: formData.cessAmount === "" ? 0 : Number(formData.cessAmount),

      totalTaxAmount:
        formData.totalTaxAmount === "" ? 0 : Number(formData.totalTaxAmount),

      totalAmount:
        formData.totalAmount === "" ? 0 : Number(formData.totalAmount),

      details: parsedDetails,

      notes: formData.notes?.trim() || "",
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingGST) {
      const result = await dispatch(
        updateGST({
          id: editingGST._id,
          payload,
        }),
      );

      if (updateGST.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        dispatch(
          getGSTDocuments({
            workspaceId: activeWorkspaceId,
          }),
        );

        showToast({
          type: "success",
          title: "GST Updated",
          message: "GST document updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update GST document.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createGST(payload));

    if (createGST.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      dispatch(
        getGSTDocuments({
          workspaceId: activeWorkspaceId,
        }),
      );

      showToast({
        type: "success",
        title: "GST Created",
        message: "GST document created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create GST document.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "documentNumber",

      label: "Document No.",
    },

    {
      key: "documentType",

      label: "Type",

      render: (row) => formatDocumentType(row.documentType),
    },

    {
      key: "documentDate",

      label: "Date",

      render: (row) => formatDate(row.documentDate),
    },

    {
      key: "companyId",

      label: "Company",

      render: (row) => getCompanyName(row),
    },

    {
      key: "branchId",

      label: "Branch",

      render: (row) => getBranchName(row),
    },

    {
      key: "gstin",

      label: "GSTIN",

      render: (row) => row.gstin || "-",
    },

    {
      key: "taxableAmount",

      label: "Taxable",

      render: (row) => formatAmount(row.taxableAmount),
    },

    {
      key: "totalTaxAmount",

      label: "Tax",

      render: (row) => formatAmount(row.totalTaxAmount),
    },

    {
      key: "totalAmount",

      label: "Total",

      render: (row) => formatAmount(row.totalAmount),
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
        title="GST"
        description="Manage GST documents."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add GST Document
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
          label="Document Type"
          name="selectedDocumentTypeFilter"
          value={selectedDocumentTypeFilter}
          onChange={(event) =>
            setSelectedDocumentTypeFilter(event.target.value)
          }
          options={[
            {
              value: "",
              label: "All Document Types",
            },
            ...documentTypeOptions,
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
          GST TABLE
      ==================================================== */}

      <Table
        title="GST Documents"
        columns={columns}
        data={filteredDocuments}
        rowKey="_id"
        emptyMessage="No GST documents found."
        loading={status === "loading"}
        searchPlaceholder="Search GST documents..."
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
        title={editingGST ? "Edit GST Document" : "Add GST Document"}
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

            <Button type="submit" form="gst-form">
              {editingGST ? "Update GST" : "Create GST"}
            </Button>
          </>
        }
      >
        <form id="gst-form" onSubmit={handleSubmit}>
          {/* ================================================
              DOCUMENT INFORMATION
          ================================================= */}

          <Grid>
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

            <Select
              label="Branch"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Branch",
                },
                ...branchOptions,
              ]}
            />

            <Select
              label="Document Type"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              options={documentTypeOptions}
            />

            <Input
              label="Document Number"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              placeholder="Enter document number"
            />

            <Input
              label="Document Date"
              name="documentDate"
              type="date"
              value={formData.documentDate}
              onChange={handleChange}
            />

            <Select
              label="Source Type"
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              options={sourceTypeOptions}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            <Input
              label="Tax Period"
              name="taxPeriod"
              value={formData.taxPeriod}
              onChange={handleChange}
              placeholder="e.g. 2026-09"
            />

            <Input
              label="Period Start"
              name="periodStart"
              type="date"
              value={formData.periodStart}
              onChange={handleChange}
            />

            <Input
              label="Period End"
              name="periodEnd"
              type="date"
              value={formData.periodEnd}
              onChange={handleChange}
            />
          </Grid>

          {/* ================================================
              REFERENCE INFORMATION
          ================================================= */}

          <Grid>
            {/* <Input
              label="Reference ID"
              name="referenceId"
              value={formData.referenceId}
              onChange={handleChange}
              placeholder="Reference document ID"
            /> */}

            <Input
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="Reference number"
            />

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="GSTIN"
            />

            <Input
              label="IRN"
              name="irn"
              value={formData.irn}
              onChange={handleChange}
              placeholder="Invoice Reference Number"
            />

            <Input
              label="Acknowledgement Number"
              name="acknowledgementNumber"
              value={formData.acknowledgementNumber}
              onChange={handleChange}
              placeholder="Acknowledgement number"
            />

            <Input
              label="Acknowledgement Date"
              name="acknowledgementDate"
              type="date"
              value={formData.acknowledgementDate}
              onChange={handleChange}
            />

            <Input
              label="E-Way Bill Number"
              name="eWayBillNumber"
              value={formData.eWayBillNumber}
              onChange={handleChange}
              placeholder="E-Way Bill number"
            />
          </Grid>

          {/* ================================================
              TAX / AMOUNTS
          ================================================= */}

          <Grid>
            <Input
              label="Taxable Amount"
              name="taxableAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.taxableAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="CGST Amount"
              name="cgstAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.cgstAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="SGST Amount"
              name="sgstAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.sgstAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="IGST Amount"
              name="igstAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.igstAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Cess Amount"
              name="cessAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.cessAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Total Tax Amount"
              name="totalTaxAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalTaxAmount}
              onChange={handleChange}
              placeholder="0.00"
            />

            <Input
              label="Total Amount"
              name="totalAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </Grid>

          {/* ================================================
              CANCELLATION
          ================================================= */}

          <Grid>
            <Input
              label="Cancelled At"
              name="cancelledAt"
              type="date"
              value={formData.cancelledAt}
              onChange={handleChange}
            />

            <Textarea
              label="Cancel Reason"
              name="cancelReason"
              value={formData.cancelReason}
              onChange={handleChange}
              placeholder="Enter cancellation reason"
            />
          </Grid>

          {/* ================================================
              DETAILS
          ================================================= */}

          <Textarea
            label="Details (JSON Array)"
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder='[{"key":"example","value":"value"}]'
            rows={8}
          />

          {/* ================================================
              NOTES
          ================================================= */}

          <Textarea
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter notes"
            rows={4}
          />
        </form>
      </Modal>

      {/* ====================================================
          VIEW MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedGST(null);
        }}
        title="View GST Document"
      >
        {selectedGST && (
          <>
            <Grid>
              <div>
                <strong>Document Number</strong>

                <div>{selectedGST.documentNumber || "-"}</div>
              </div>

              <div>
                <strong>Document Type</strong>

                <div>{formatDocumentType(selectedGST.documentType)}</div>
              </div>

              <div>
                <strong>Document Date</strong>

                <div>{formatDate(selectedGST.documentDate)}</div>
              </div>

              <div>
                <strong>Company</strong>

                <div>{getCompanyName(selectedGST)}</div>
              </div>

              <div>
                <strong>Branch</strong>

                <div>{getBranchName(selectedGST)}</div>
              </div>

              <div>
                <strong>Source Type</strong>

                <div>{selectedGST.sourceType || "-"}</div>
              </div>

              <div>
                <strong>Status</strong>

                <div>
                  <Badge>{selectedGST.status || "-"}</Badge>
                </div>
              </div>

              <div>
                <strong>GSTIN</strong>

                <div>{selectedGST.gstin || "-"}</div>
              </div>

              <div>
                <strong>Taxable Amount</strong>

                <div>{formatAmount(selectedGST.taxableAmount)}</div>
              </div>

              <div>
                <strong>Total Tax</strong>

                <div>{formatAmount(selectedGST.totalTaxAmount)}</div>
              </div>

              <div>
                <strong>Total Amount</strong>

                <div>{formatAmount(selectedGST.totalAmount)}</div>
              </div>

              <div>
                <strong>E-Way Bill</strong>

                <div>{selectedGST.eWayBillNumber || "-"}</div>
              </div>

              <div>
                <strong>IRN</strong>

                <div>{selectedGST.irn || "-"}</div>
              </div>

              <div>
                <strong>Acknowledgement Number</strong>

                <div>{selectedGST.acknowledgementNumber || "-"}</div>
              </div>

              <div>
                <strong>Tax Period</strong>

                <div>{selectedGST.taxPeriod || "-"}</div>
              </div>
            </Grid>

            <Grid>
              <div>
                <strong>CGST</strong>

                <div>{formatAmount(selectedGST.cgstAmount)}</div>
              </div>

              <div>
                <strong>SGST</strong>

                <div>{formatAmount(selectedGST.sgstAmount)}</div>
              </div>

              <div>
                <strong>IGST</strong>

                <div>{formatAmount(selectedGST.igstAmount)}</div>
              </div>

              <div>
                <strong>Cess</strong>

                <div>{formatAmount(selectedGST.cessAmount)}</div>
              </div>
            </Grid>

            <div>
              <strong>Notes</strong>

              <div>{selectedGST.notes || "-"}</div>
            </div>

            <div>
              <strong>Details</strong>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: "8px",
                }}
              >
                {JSON.stringify(selectedGST.details || [], null, 2)}
              </pre>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}

export default GstPage;
