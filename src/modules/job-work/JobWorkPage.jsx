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
// JOB WORK THUNKS
// ============================================================

import {
  createJobWork,
  getJobWorks,
  getJobWorkById,
  updateJobWork,
  deleteJobWork,
} from "./store/job-work.thunks.js";

// ============================================================
// JOB WORK SELECTORS
// ============================================================

import {
  selectJobWorks,
  selectJobWorkStatus,
} from "./store/job-work.selectors.js";

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
// WAREHOUSE
// ============================================================

import { fetchWarehouses } from "../warehouse/store/warehouse.thunks.js";

import { selectWarehouses } from "../warehouse/store/warehouse.selectors.js";

// ============================================================
// PARTNER
// ============================================================

import { fetchPartners } from "../partner/store/partner.thunks.js";

import { selectPartners } from "../partner/store/partner.selectors.js";

// ============================================================
// PRODUCT
// ============================================================

import { getProducts } from "../product/store/product.thunks.js";

import { selectProducts } from "../product/store/product.selectors.js";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  warehouseId: "",
  jobWorkerId: "",

  jobWorkNumber: "",

  jobWorkType: "ISSUE_FOR_JOB_WORK",

  jobWorkDate: new Date().toISOString().split("T")[0],

  referenceNumber: "",
  referenceDate: "",

  processName: "",
  processDescription: "",

  otherCharges: "",

  status: "DRAFT",

  notes: "",
};

// ============================================================
// INITIAL ITEM
// ============================================================

const createInitialItem = () => ({
  productId: "",
  unitId: "",
  hsnSacId: "",
  taxId: "",

  quantity: "",
  processedQuantity: "",
  receivedQuantity: "",

  wastageQuantity: "",
  shortageQuantity: "",
  excessQuantity: "",

  rate: "",
  taxPercent: "",

  description: "",

  batchId: "",
  lotId: "",
  serialNumberId: "",
});

// ============================================================
// JOB WORK TYPE OPTIONS
// ============================================================

const jobWorkTypeOptions = [
  {
    value: "RECEIVE_FABRIC",
    label: "Receive Fabric",
  },
  {
    value: "RECEIVE_ACCESSORIES",
    label: "Receive Accessories",
  },
  {
    value: "ISSUE_FOR_JOB_WORK",
    label: "Issue for Job Work",
  },
  {
    value: "PROCESS",
    label: "Process",
  },
  {
    value: "RECEIVE_BACK",
    label: "Receive Back",
  },
  {
    value: "WASTAGE",
    label: "Wastage",
  },
  {
    value: "SHORTAGE",
    label: "Shortage",
  },
  {
    value: "EXCESS",
    label: "Excess",
  },
  {
    value: "BALANCE_FABRIC",
    label: "Balance Fabric",
  },
  {
    value: "JOB_WORK_INVOICE",
    label: "Job Work Invoice",
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
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "PARTIALLY_PROCESSED",
    label: "Partially Processed",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

// ============================================================
// ID HELPER
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

// ============================================================
// NUMBER HELPER
// ============================================================

const toNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// ============================================================
// ITEM CALCULATION
// ============================================================

const calculateItem = (item) => {
  const quantity = toNumber(item.quantity);

  const processedQuantity = toNumber(item.processedQuantity);

  const receivedQuantity = toNumber(item.receivedQuantity);

  const wastageQuantity = toNumber(item.wastageQuantity);

  const shortageQuantity = toNumber(item.shortageQuantity);

  const excessQuantity = toNumber(item.excessQuantity);

  const rate = toNumber(item.rate);

  const taxPercent = toNumber(item.taxPercent);

  const taxableAmount = quantity * rate;

  const taxAmount = (taxableAmount * taxPercent) / 100;

  const amount = taxableAmount + taxAmount;

  const balanceQuantity = Math.max(
    quantity -
      receivedQuantity -
      wastageQuantity -
      shortageQuantity +
      excessQuantity,
    0,
  );

  return {
    ...item,

    quantity,
    processedQuantity,
    receivedQuantity,

    wastageQuantity,
    shortageQuantity,
    excessQuantity,

    balanceQuantity,

    rate,
    taxPercent,

    taxableAmount,
    taxAmount,
    amount,
  };
};

// ============================================================
// PAGE
// ============================================================

function JobWorkPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX
  // ==========================================================

  const jobWorks = useSelector(selectJobWorks);

  const jobWorkStatus = useSelector(selectJobWorkStatus);

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  const companies = useSelector(selectCompanies);

  const branches = useSelector(selectBranches);

  const warehouses = useSelector(selectWarehouses);

  const partners = useSelector(selectPartners);

  const products = useSelector(selectProducts);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  const [items, setItems] = useState([createInitialItem()]);

  // ==========================================================
  // MODALS
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING
  // ==========================================================

  const [selectedJobWork, setSelectedJobWork] = useState(null);

  const [editingJobWork, setEditingJobWork] = useState(null);

  // ==========================================================
  // LIST FILTERS
  // ==========================================================

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");

  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const activeWorkspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // FETCH MASTER DATA
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(fetchCompanies(activeWorkspaceId));

    dispatch(fetchWarehouses());

    dispatch(getProducts());
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // FETCH JOB WORKS
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(
      getJobWorks({
        workspaceId: activeWorkspaceId,
      }),
    );
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // WORKSPACE COMPANIES
  // ==========================================================

  const workspaceCompanies = useMemo(() => {
    if (!activeWorkspaceId) {
      return [];
    }

    const filtered = companies.filter((company) => {
      const workspaceId = getId(company.workspaceId || company.workspace);

      return workspaceId === activeWorkspaceId;
    });

    return filtered.length > 0 ? filtered : companies;
  }, [companies, activeWorkspaceId]);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = useMemo(
    () =>
      workspaceCompanies.map((company) => ({
        value: getId(company._id),

        label: company.name || company.code || company._id,
      })),
    [workspaceCompanies],
  );

  // ==========================================================
  // SELECTED COMPANY
  // ==========================================================

  const selectedCompanyId = getId(formData.companyId);

  // ==========================================================
  // FETCH BRANCHES + PARTNERS
  // ==========================================================

  useEffect(() => {
    if (!selectedCompanyId) {
      return;
    }

    dispatch(fetchBranches(selectedCompanyId));

    dispatch(
      fetchPartners({
        companyId: selectedCompanyId,
      }),
    );
  }, [dispatch, selectedCompanyId]);

  // ==========================================================
  // BRANCH OPTIONS
  // ==========================================================

  const branchOptions = useMemo(() => {
    return branches
      .filter((branch) => {
        const companyId = getId(branch.companyId || branch.company);

        return companyId === selectedCompanyId;
      })
      .map((branch) => ({
        value: getId(branch._id),

        label: branch.name || branch.code || branch._id,
      }));
  }, [branches, selectedCompanyId]);

  // ==========================================================
  // WAREHOUSE OPTIONS
  // ==========================================================

  const warehouseOptions = useMemo(() => {
    return warehouses
      .filter((warehouse) => {
        const companyId = getId(warehouse.companyId || warehouse.company);

        return companyId === selectedCompanyId;
      })
      .map((warehouse) => ({
        value: getId(warehouse._id),

        label: warehouse.name || warehouse.code || warehouse._id,
      }));
  }, [warehouses, selectedCompanyId]);

  // ==========================================================
  // JOB WORKER OPTIONS
  // ==========================================================

  const jobWorkerOptions = useMemo(() => {
    return partners
      .filter((partner) => partner.partnerType === "JOB_WORKER")
      .map((partner) => ({
        value: getId(partner._id),
        label:
          partner.name || partner.displayName || partner.code || partner._id,
      }));
  }, [partners]);
  // ==========================================================
  // PRODUCT OPTIONS
  // ==========================================================

  const workspaceProducts = useMemo(() => {
    return products.filter((product) => {
      const workspaceId = getId(product.workspaceId || product.workspace);

      if (!workspaceId) {
        return true;
      }

      return workspaceId === activeWorkspaceId;
    });
  }, [products, activeWorkspaceId]);

  const productOptions = useMemo(() => {
    return workspaceProducts.map((product) => ({
      value: getId(product._id),

      label: product.name || product.code || product.sku || product._id,
    }));
  }, [workspaceProducts]);

  // ==========================================================
  // CALCULATED ITEMS
  // ==========================================================

  const calculatedItems = useMemo(() => items.map(calculateItem), [items]);

  // ==========================================================
  // TOTALS
  // ==========================================================

  const totals = useMemo(() => {
    const totalQuantity = calculatedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalReceivedQuantity = calculatedItems.reduce(
      (total, item) => total + item.receivedQuantity,
      0,
    );

    const totalIssuedQuantity = calculatedItems.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const totalWastageQuantity = calculatedItems.reduce(
      (total, item) => total + item.wastageQuantity,
      0,
    );

    const totalShortageQuantity = calculatedItems.reduce(
      (total, item) => total + item.shortageQuantity,
      0,
    );

    const totalExcessQuantity = calculatedItems.reduce(
      (total, item) => total + item.excessQuantity,
      0,
    );

    const balanceQuantity = calculatedItems.reduce(
      (total, item) => total + item.balanceQuantity,
      0,
    );

    const subtotal = calculatedItems.reduce(
      (total, item) => total + item.taxableAmount,
      0,
    );

    const taxAmount = calculatedItems.reduce(
      (total, item) => total + item.taxAmount,
      0,
    );

    const otherCharges = toNumber(formData.otherCharges);

    const grandTotal = subtotal + taxAmount + otherCharges;

    return {
      totalQuantity,
      totalReceivedQuantity,
      totalIssuedQuantity,

      totalWastageQuantity,
      totalShortageQuantity,
      totalExcessQuantity,
      balanceQuantity,

      subtotal,
      taxAmount,
      otherCharges,
      grandTotal,
    };
  }, [calculatedItems, formData.otherCharges]);

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
  // COMPANY CHANGE
  // ==========================================================

  const handleCompanyChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,

      companyId: value,

      branchId: "",
      warehouseId: "",
      jobWorkerId: "",
    }));
  };

  // ==========================================================
  // ITEM CHANGE
  // ==========================================================

  const handleItemChange = (index, field, value) => {
    setItems((previous) => {
      const nextItems = [...previous];

      const currentItem = {
        ...nextItems[index],

        [field]: value,
      };

      // ----------------------------------------------------
      // PRODUCT CHANGE
      // ----------------------------------------------------

      if (field === "productId") {
        const product = workspaceProducts.find(
          (item) => getId(item._id) === value,
        );

        if (product) {
          currentItem.unitId = getId(product.unitId);

          currentItem.hsnSacId = getId(product.hsnSacId);

          currentItem.taxId = getId(product.taxId);

          if (currentItem.rate === "" || toNumber(currentItem.rate) === 0) {
            currentItem.rate =
              product.salesPrice ?? product.purchasePrice ?? "";
          }

          if (currentItem.taxPercent === "" && product.tax?.rate != null) {
            currentItem.taxPercent = product.tax.rate;
          }

          if (currentItem.taxPercent === "" && product.taxId?.rate != null) {
            currentItem.taxPercent = product.taxId.rate;
          }

          if (currentItem.taxPercent === "" && product.taxRate != null) {
            currentItem.taxPercent = product.taxRate;
          }
        }
      }

      nextItems[index] = currentItem;

      return nextItems;
    });
  };

  // ==========================================================
  // ADD ITEM
  // ==========================================================

  const handleAddItem = () => {
    setItems((previous) => [...previous, createInitialItem()]);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemoveItem = (index) => {
    setItems((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setItems([createInitialItem()]);

    setEditingJobWork(null);
  };

  // ==========================================================
  // CREATE MODAL
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

    const firstCompanyId = workspaceCompanies[0]?._id;

    setEditingJobWork(null);

    setFormData({
      ...initialFormData,

      companyId: firstCompanyId || "",
    });

    setItems([createInitialItem()]);

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = async (jobWork) => {
    const result = await dispatch(getJobWorkById(jobWork._id));

    if (getJobWorkById.fulfilled.match(result)) {
      setSelectedJobWork(result.payload);

      setIsViewModalOpen(true);

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to load job work.",
    });
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = async (jobWork) => {
    const result = await dispatch(getJobWorkById(jobWork._id));

    if (!getJobWorkById.fulfilled.match(result)) {
      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to load job work.",
      });

      return;
    }

    const detail = result.payload;

    const currentJobWork = detail?.jobWork || detail;

    const currentItems = detail?.items || [];

    setEditingJobWork(currentJobWork);

    setFormData({
      companyId: getId(currentJobWork.companyId),

      branchId: getId(currentJobWork.branchId),

      warehouseId: getId(currentJobWork.warehouseId),

      jobWorkerId: getId(currentJobWork.jobWorkerId),

      jobWorkNumber: currentJobWork.jobWorkNumber || "",

      jobWorkType: currentJobWork.jobWorkType || "ISSUE_FOR_JOB_WORK",

      jobWorkDate: currentJobWork.jobWorkDate
        ? new Date(currentJobWork.jobWorkDate).toISOString().split("T")[0]
        : "",

      referenceNumber: currentJobWork.referenceNumber || "",

      referenceDate: currentJobWork.referenceDate
        ? new Date(currentJobWork.referenceDate).toISOString().split("T")[0]
        : "",

      processName: currentJobWork.processName || "",

      processDescription: currentJobWork.processDescription || "",

      otherCharges: currentJobWork.otherCharges ?? "",

      status: currentJobWork.status || "DRAFT",

      notes: currentJobWork.notes || "",
    });

    setItems(
      currentItems.length
        ? currentItems.map((item) => ({
            productId: getId(item.productId),

            unitId: getId(item.unitId),

            hsnSacId: getId(item.hsnSacId),

            taxId: getId(item.taxId),

            quantity: item.quantity ?? "",

            processedQuantity: item.processedQuantity ?? "",

            receivedQuantity: item.receivedQuantity ?? "",

            wastageQuantity: item.wastageQuantity ?? "",

            shortageQuantity: item.shortageQuantity ?? "",

            excessQuantity: item.excessQuantity ?? "",

            rate: item.rate ?? "",

            taxPercent: item.taxPercent ?? "",

            description: item.description || "",

            batchId: getId(item.batchId),

            lotId: getId(item.lotId),

            serialNumberId: getId(item.serialNumberId),
          }))
        : [createInitialItem()],
    );

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (jobWork) => {
    const confirmed = window.confirm(
      `Delete job work "${jobWork.jobWorkNumber}"?`,
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteJobWork(jobWork._id));

    if (deleteJobWork.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Job Work Deleted",
        message: "Job work deleted successfully.",
      });

      dispatch(
        getJobWorks({
          workspaceId: activeWorkspaceId,
        }),
      );

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete job work.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ------------------------------------------------------
    // REQUIRED
    // ------------------------------------------------------

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

    if (!formData.warehouseId) {
      showToast({
        type: "error",
        title: "Warehouse Required",
        message: "Please select a warehouse.",
      });

      return;
    }

    if (!formData.jobWorkerId) {
      showToast({
        type: "error",
        title: "Job Worker Required",
        message: "Please select a job worker.",
      });

      return;
    }

    if (!formData.jobWorkNumber?.trim()) {
      showToast({
        type: "error",
        title: "Job Work Number Required",
        message: "Please enter job work number.",
      });

      return;
    }

    if (!formData.jobWorkDate) {
      showToast({
        type: "error",
        title: "Date Required",
        message: "Please select job work date.",
      });

      return;
    }

    if (!items.length) {
      showToast({
        type: "error",
        title: "Items Required",
        message: "Add at least one job work item.",
      });

      return;
    }

    // ------------------------------------------------------
    // ITEM VALIDATION
    // ------------------------------------------------------

    const invalidItem = items.find(
      (item) => !item.productId || toNumber(item.quantity) <= 0,
    );

    if (invalidItem) {
      showToast({
        type: "error",
        title: "Invalid Item",
        message: "Select product and enter valid quantity for every item.",
      });

      return;
    }

    // ------------------------------------------------------
    // PAYLOAD
    // ------------------------------------------------------

    const payload = {
      workspaceId: activeWorkspaceId,

      companyId: formData.companyId,

      branchId: formData.branchId || null,

      warehouseId: formData.warehouseId,

      jobWorkerId: formData.jobWorkerId,

      jobWorkNumber: formData.jobWorkNumber.trim().toUpperCase(),

      jobWorkType: formData.jobWorkType,

      jobWorkDate: formData.jobWorkDate,

      referenceNumber: formData.referenceNumber?.trim() || "",

      referenceDate: formData.referenceDate || null,

      processName: formData.processName?.trim() || "",

      processDescription: formData.processDescription?.trim() || "",

      otherCharges: toNumber(formData.otherCharges),

      status: formData.status,

      notes: formData.notes?.trim() || "",

      items: items.map((item) => ({
        productId: item.productId,

        unitId: item.unitId || null,

        hsnSacId: item.hsnSacId || null,

        taxId: item.taxId || null,

        quantity: toNumber(item.quantity),

        processedQuantity: toNumber(item.processedQuantity),

        receivedQuantity: toNumber(item.receivedQuantity),

        wastageQuantity: toNumber(item.wastageQuantity),

        shortageQuantity: toNumber(item.shortageQuantity),

        excessQuantity: toNumber(item.excessQuantity),

        rate: toNumber(item.rate),

        taxPercent: toNumber(item.taxPercent),

        description: item.description?.trim() || "",

        batchId: item.batchId || null,

        lotId: item.lotId || null,

        serialNumberId: item.serialNumberId || null,
      })),
    };

    // ------------------------------------------------------
    // UPDATE
    // ------------------------------------------------------

    if (editingJobWork) {
      const result = await dispatch(
        updateJobWork({
          id: editingJobWork._id,
          payload,
        }),
      );

      if (updateJobWork.fulfilled.match(result)) {
        showToast({
          type: "success",
          title: "Job Work Updated",
          message: "Job work updated successfully.",
        });

        setIsModalOpen(false);

        resetForm();

        dispatch(
          getJobWorks({
            workspaceId: activeWorkspaceId,
          }),
        );

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update job work.",
      });

      return;
    }

    // ------------------------------------------------------
    // CREATE
    // ------------------------------------------------------

    const result = await dispatch(createJobWork(payload));

    if (createJobWork.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Job Work Created",
        message: "Job work created successfully.",
      });

      setIsModalOpen(false);

      resetForm();

      dispatch(
        getJobWorks({
          workspaceId: activeWorkspaceId,
        }),
      );

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create job work.",
    });
  };

  // ==========================================================
  // FILTERED JOB WORKS
  // ==========================================================

  const filteredJobWorks = useMemo(() => {
    return jobWorks.filter((jobWork) => {
      const companyId = getId(jobWork.companyId);

      const companyMatch =
        !selectedCompanyFilter || companyId === selectedCompanyFilter;

      const typeMatch =
        !selectedTypeFilter || jobWork.jobWorkType === selectedTypeFilter;

      const statusMatch =
        !selectedStatusFilter || jobWork.status === selectedStatusFilter;

      return companyMatch && typeMatch && statusMatch;
    });
  }, [
    jobWorks,
    selectedCompanyFilter,
    selectedTypeFilter,
    selectedStatusFilter,
  ]);

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "jobWorkNumber",
      label: "Job Work No.",
    },

    {
      key: "jobWorkDate",
      label: "Date",

      render: (row) => {
        if (!row.jobWorkDate) {
          return "-";
        }

        return new Date(row.jobWorkDate).toLocaleDateString("en-IN");
      },
    },

    {
      key: "jobWorkType",
      label: "Type",

      render: (row) => row.jobWorkType?.replaceAll("_", " ") || "-",
    },

    {
      key: "companyId",
      label: "Company",

      render: (row) => {
        if (typeof row.companyId === "object") {
          return row.companyId?.name || row.companyId?.code || "-";
        }

        const company = companies.find(
          (item) => getId(item._id) === getId(row.companyId),
        );

        return company?.name || company?.code || "-";
      },
    },

    {
      key: "jobWorkerId",
      label: "Job Worker",

      render: (row) => {
        if (typeof row.jobWorkerId === "object") {
          return (
            row.jobWorkerId?.name ||
            row.jobWorkerId?.displayName ||
            row.jobWorkerId?.code ||
            "-"
          );
        }

        const partner = partners.find(
          (item) => getId(item._id) === getId(row.jobWorkerId),
        );

        return partner?.name || partner?.displayName || partner?.code || "-";
      },
    },

    {
      key: "totalQuantity",
      label: "Qty",
    },

    {
      key: "receivedQuantity",
      label: "Received",

      render: (row) => Number(row.totalReceivedQuantity || 0).toFixed(2),
    },

    {
      key: "balanceQuantity",
      label: "Balance",

      render: (row) => Number(row.balanceQuantity || 0).toFixed(2),
    },

    {
      key: "grandTotal",
      label: "Amount",

      render: (row) => `₹ ${Number(row.grandTotal || 0).toFixed(2)}`,
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
  // VIEW ITEM COLUMNS
  // ==========================================================

  const viewItemColumns = [
    {
      key: "productId",
      label: "Product",

      render: (row) => {
        if (typeof row.productId === "object") {
          return row.productId?.name || row.productId?.code || "-";
        }

        return getId(row.productId);
      },
    },

    {
      key: "quantity",
      label: "Qty",
    },

    {
      key: "processedQuantity",
      label: "Processed",
    },

    {
      key: "receivedQuantity",
      label: "Received",
    },

    {
      key: "wastageQuantity",
      label: "Wastage",
    },

    {
      key: "shortageQuantity",
      label: "Shortage",
    },

    {
      key: "excessQuantity",
      label: "Excess",
    },

    {
      key: "balanceQuantity",
      label: "Balance",
    },

    {
      key: "rate",
      label: "Rate",

      render: (row) => `₹ ${Number(row.rate || 0).toFixed(2)}`,
    },

    {
      key: "amount",
      label: "Amount",

      render: (row) => `₹ ${Number(row.amount || 0).toFixed(2)}`,
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section>
      {/* ====================================================
          HEADER
      ==================================================== */}

      <PageHeader
        title="Job Work"
        description="Manage job work transactions."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Job Work
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
          label="Job Work Type"
          name="selectedTypeFilter"
          value={selectedTypeFilter}
          onChange={(event) => setSelectedTypeFilter(event.target.value)}
          options={[
            {
              value: "",
              label: "All Types",
            },
            ...jobWorkTypeOptions,
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
        title="Job Work"
        columns={columns}
        data={filteredJobWorks}
        rowKey="_id"
        emptyMessage="No job work found."
        loading={jobWorkStatus === "loading"}
        searchPlaceholder="Search job work..."
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
        title={editingJobWork ? "Edit Job Work" : "Add Job Work"}
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

            <Button type="submit" form="job-work-form">
              {editingJobWork ? "Update Job Work" : "Create Job Work"}
            </Button>
          </>
        }
      >
        <form id="job-work-form" onSubmit={handleSubmit}>
          {/* ==================================================
              HEADER
          ================================================== */}

          <Grid>
            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleCompanyChange}
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
              label="Warehouse"
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Warehouse",
                },
                ...warehouseOptions,
              ]}
            />

            <Select
              label="Job Worker"
              name="jobWorkerId"
              value={formData.jobWorkerId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Job Worker",
                },
                ...jobWorkerOptions,
              ]}
            />

            <Input
              label="Job Work Number"
              name="jobWorkNumber"
              value={formData.jobWorkNumber}
              onChange={handleChange}
              placeholder="Enter job work number"
            />

            <Select
              label="Job Work Type"
              name="jobWorkType"
              value={formData.jobWorkType}
              onChange={handleChange}
              options={jobWorkTypeOptions}
            />

            <Input
              label="Job Work Date"
              name="jobWorkDate"
              type="date"
              value={formData.jobWorkDate}
              onChange={handleChange}
            />

            <Input
              label="Reference Number"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="Reference / Challan No."
            />

            <Input
              label="Reference Date"
              name="referenceDate"
              type="date"
              value={formData.referenceDate}
              onChange={handleChange}
            />

            <Input
              label="Process Name"
              name="processName"
              value={formData.processName}
              onChange={handleChange}
              placeholder="e.g. Embroidery"
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </Grid>

          <Textarea
            label="Process Description"
            name="processDescription"
            value={formData.processDescription}
            onChange={handleChange}
            placeholder="Enter process description"
          />

          {/* ==================================================
              ITEMS
          ================================================== */}

          <div>
            <div>
              <strong>Job Work Items</strong>

              <Button type="button" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>

            {calculatedItems.map((item, index) => (
              <div key={`job-work-item-${index}`}>
                <Grid>
                  <Select
                    label="Product"
                    name={`product-${index}`}
                    value={item.productId}
                    onChange={(event) =>
                      handleItemChange(index, "productId", event.target.value)
                    }
                    options={[
                      {
                        value: "",
                        label: "Select Product",
                      },
                      ...productOptions,
                    ]}
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    name={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(event) =>
                      handleItemChange(index, "quantity", event.target.value)
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Processed Qty"
                    type="number"
                    name={`processed-${index}`}
                    value={item.processedQuantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "processedQuantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Received Qty"
                    type="number"
                    name={`received-${index}`}
                    value={item.receivedQuantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "receivedQuantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Wastage Qty"
                    type="number"
                    name={`wastage-${index}`}
                    value={item.wastageQuantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "wastageQuantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Shortage Qty"
                    type="number"
                    name={`shortage-${index}`}
                    value={item.shortageQuantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "shortageQuantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Excess Qty"
                    type="number"
                    name={`excess-${index}`}
                    value={item.excessQuantity}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "excessQuantity",
                        event.target.value,
                      )
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Balance Qty"
                    name={`balance-${index}`}
                    value={Number(item.balanceQuantity || 0).toFixed(2)}
                    readOnly
                  />

                  <Input
                    label="Rate"
                    type="number"
                    name={`rate-${index}`}
                    value={item.rate}
                    onChange={(event) =>
                      handleItemChange(index, "rate", event.target.value)
                    }
                    min="0"
                    step="0.01"
                  />

                  <Input
                    label="Tax %"
                    type="number"
                    name={`tax-${index}`}
                    value={item.taxPercent}
                    onChange={(event) =>
                      handleItemChange(index, "taxPercent", event.target.value)
                    }
                    min="0"
                    max="100"
                    step="0.01"
                  />

                  <Input
                    label="Amount"
                    value={Number(item.amount || 0).toFixed(2)}
                    readOnly
                  />

                  <Textarea
                    label="Description"
                    name={`description-${index}`}
                    value={item.description}
                    onChange={(event) =>
                      handleItemChange(index, "description", event.target.value)
                    }
                    placeholder="Item description"
                  />
                </Grid>

                <DeleteIcon
                  size={5}
                  title="Remove Item"
                  onClick={() => handleRemoveItem(index)}
                />
              </div>
            ))}
          </div>

          {/* ==================================================
              TOTALS
          ================================================== */}

          <Grid>
            <Input
              label="Total Quantity"
              value={totals.totalQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Total Issued"
              value={totals.totalIssuedQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Total Received"
              value={totals.totalReceivedQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Total Wastage"
              value={totals.totalWastageQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Total Shortage"
              value={totals.totalShortageQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Total Excess"
              value={totals.totalExcessQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Balance Quantity"
              value={totals.balanceQuantity.toFixed(2)}
              readOnly
            />

            <Input
              label="Subtotal"
              value={totals.subtotal.toFixed(2)}
              readOnly
            />

            <Input
              label="Tax Amount"
              value={totals.taxAmount.toFixed(2)}
              readOnly
            />

            <Input
              label="Other Charges"
              name="otherCharges"
              type="number"
              value={formData.otherCharges}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <Input
              label="Grand Total"
              value={totals.grandTotal.toFixed(2)}
              readOnly
            />

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

          setSelectedJobWork(null);
        }}
        title="View Job Work"
      >
        {selectedJobWork && (
          <>
            <Grid>
              <div>
                <strong>Job Work Number</strong>

                <div>
                  {selectedJobWork.jobWork?.jobWorkNumber ||
                    selectedJobWork.jobWorkNumber ||
                    "-"}
                </div>
              </div>

              <div>
                <strong>Type</strong>

                <div>
                  {(
                    selectedJobWork.jobWork?.jobWorkType ||
                    selectedJobWork.jobWorkType ||
                    "-"
                  ).replaceAll("_", " ")}
                </div>
              </div>

              <div>
                <strong>Date</strong>

                <div>
                  {selectedJobWork.jobWork?.jobWorkDate ||
                  selectedJobWork.jobWorkDate
                    ? new Date(
                        selectedJobWork.jobWork?.jobWorkDate ||
                          selectedJobWork.jobWorkDate,
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </div>
              </div>

              <div>
                <strong>Grand Total</strong>

                <div>
                  ₹{" "}
                  {Number(
                    selectedJobWork.jobWork?.grandTotal ||
                      selectedJobWork.grandTotal ||
                      0,
                  ).toFixed(2)}
                </div>
              </div>
            </Grid>

            <Table
              title="Job Work Items"
              columns={viewItemColumns}
              data={selectedJobWork.items || []}
              rowKey="_id"
              emptyMessage="No job work items found."
            />
          </>
        )}
      </Modal>
    </section>
  );
}

export default JobWorkPage;
