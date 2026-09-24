import { useEffect, useMemo, useState } from "react";

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

// ============================================================
// PURCHASE THUNKS
// ============================================================

import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} from "./store/purchase.thunks.js";

// ============================================================
// PURCHASE SELECTORS
// ============================================================

import {
  selectPurchases,
  selectPurchaseStatus,
} from "./store/purchase.selectors.js";

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
// PRODUCT
// ============================================================

import { getProducts } from "../product/store/product.thunks.js";

import { selectProducts } from "../product/store/product.selectors.js";

// ============================================================
// PARTNER
// ============================================================

import { fetchPartners } from "../partner/store/partner.thunks.js";

import { selectPartners } from "../partner/store/partner.selectors.js";

// ============================================================
// INITIAL ITEM
// ============================================================

const createInitialItem = () => ({
  productId: "",
  quantity: "",
  rate: "",
  discountPercent: "",
  taxPercent: "",
});

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  warehouseId: "",
  supplierId: "",

  purchaseNumber: "",

  supplierInvoiceNumber: "",

  purchaseDate: new Date().toISOString().split("T")[0],

  supplierInvoiceDate: "",

  otherCharges: "",

  roundOffAmount: "",

  paidAmount: "",

  status: "DRAFT",

  notes: "",
};

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
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

// ============================================================
// PAGE
// ============================================================

function PurchasePage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PURCHASE REDUX
  // ==========================================================

  const purchases = useSelector(selectPurchases);

  const status = useSelector(selectPurchaseStatus);

  // ==========================================================
  // WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // COMPANY
  // ==========================================================

  const companies = useSelector(selectCompanies);

  // ==========================================================
  // BRANCH
  // ==========================================================

  const branches = useSelector(selectBranches);

  // ==========================================================
  // WAREHOUSE
  // ==========================================================

  const warehouses = useSelector(selectWarehouses);

  // ==========================================================
  // PRODUCT
  // ==========================================================

  const products = useSelector(selectProducts);

  // ==========================================================
  // PARTNER
  // ==========================================================

  const partners = useSelector(selectPartners);

  // ==========================================================
  // WORKSPACE ID
  // ==========================================================

  const workspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // TABLE FILTERS
  // ==========================================================

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  // ==========================================================
  // MODAL
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PURCHASE
  // ==========================================================

  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [editingPurchase, setEditingPurchase] = useState(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  // ==========================================================
  // ITEMS
  // ==========================================================

  const [items, setItems] = useState([createInitialItem()]);

  // ==========================================================
  // FORM COMPANY ID
  // ==========================================================

  const formCompanyId = getId(formData.companyId);

  // ==========================================================
  // ACTIVE PARTNER FETCH COMPANY
  // ==========================================================

  const partnerCompanyId = formCompanyId || getId(selectedCompanyId);

  // ==========================================================
  // FETCH MASTER DATA
  // ==========================================================

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    dispatch(fetchCompanies(workspaceId));

    dispatch(fetchWarehouses());

    dispatch(getProducts());

    dispatch(
      getPurchases({
        workspaceId,
      }),
    );
  }, [dispatch, workspaceId]);

  // ==========================================================
  // WORKSPACE COMPANIES
  // ==========================================================

  const workspaceCompanies = useMemo(() => {
    if (!workspaceId) {
      return [];
    }

    return companies.filter((company) => {
      const companyWorkspaceId = getId(
        company.workspaceId?._id || company.workspaceId,
      );

      return companyWorkspaceId === workspaceId;
    });
  }, [companies, workspaceId]);

  // ==========================================================
  // FETCH BRANCHES + PARTNERS
  // ==========================================================

  useEffect(() => {
    if (!partnerCompanyId) {
      return;
    }

    // --------------------------------------------------------
    // BRANCHES
    // --------------------------------------------------------

    dispatch(fetchBranches(partnerCompanyId));

    // --------------------------------------------------------
    // PARTNERS
    // --------------------------------------------------------

    /*
     * Important:
     *
     * Do NOT pass partnerType here.
     *
     * Partner module can return all partners
     * for the selected company.
     *
     * Purchase page then filters:
     *
     * SUPPLIER
     * BOTH
     *
     * This allows Customer & Supplier partners
     * to appear as Purchase suppliers.
     */

    dispatch(
      fetchPartners({
        companyId: partnerCompanyId,
      }),
    );
  }, [dispatch, partnerCompanyId]);

  // ==========================================================
  // WORKSPACE PRODUCTS
  // ==========================================================

  const workspaceProducts = useMemo(() => {
    if (!workspaceId) {
      return [];
    }

    return products.filter((product) => {
      const productWorkspaceId = getId(
        product.workspaceId?._id || product.workspaceId,
      );

      return productWorkspaceId === workspaceId;
    });
  }, [products, workspaceId]);

  // ==========================================================
  // FORM BRANCHES
  // ==========================================================

  const formBranches = useMemo(() => {
    if (!formCompanyId) {
      return [];
    }

    return branches.filter((branch) => {
      const branchCompanyId = getId(branch.companyId || branch.company);

      return branchCompanyId === formCompanyId;
    });
  }, [branches, formCompanyId]);

  // ==========================================================
  // FORM WAREHOUSES
  // ==========================================================

  const formWarehouses = useMemo(() => {
    if (!formCompanyId) {
      return [];
    }

    return warehouses.filter((warehouse) => {
      const warehouseCompanyId = getId(
        warehouse.companyId || warehouse.company,
      );

      return warehouseCompanyId === formCompanyId;
    });
  }, [warehouses, formCompanyId]);

  // ==========================================================
  // SUPPLIERS
  // ==========================================================

  const suppliers = useMemo(() => {
    return partners.filter((partner) => {
      return (
        partner.partnerType === "SUPPLIER" || partner.partnerType === "BOTH"
      );
    });
  }, [partners]);

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = useMemo(() => {
    return workspaceCompanies.map((company) => ({
      value: getId(company._id),

      label: company.name || company.code || getId(company._id),
    }));
  }, [workspaceCompanies]);

  // ==========================================================
  // BRANCH OPTIONS
  // ==========================================================

  const branchOptions = useMemo(() => {
    return formBranches.map((branch) => ({
      value: getId(branch._id),

      label: branch.name || branch.code || getId(branch._id),
    }));
  }, [formBranches]);

  // ==========================================================
  // WAREHOUSE OPTIONS
  // ==========================================================

  const warehouseOptions = useMemo(() => {
    return formWarehouses.map((warehouse) => ({
      value: getId(warehouse._id),

      label: warehouse.name || warehouse.code || getId(warehouse._id),
    }));
  }, [formWarehouses]);

  // ==========================================================
  // SUPPLIER OPTIONS
  // ==========================================================

  const supplierOptions = useMemo(() => {
    return suppliers.map((supplier) => ({
      value: getId(supplier._id),

      label:
        supplier.name ||
        supplier.displayName ||
        supplier.code ||
        getId(supplier._id),
    }));
  }, [suppliers]);

  // ==========================================================
  // PRODUCT OPTIONS
  // ==========================================================

  const productOptions = useMemo(() => {
    return workspaceProducts.map((product) => ({
      value: getId(product._id),

      label: product.name || product.code || getId(product._id),
    }));
  }, [workspaceProducts]);

  // ==========================================================
  // FILTER SUPPLIER OPTIONS
  // ==========================================================

  const selectedCompanySupplierOptions = useMemo(() => {
    if (!selectedCompanyId) {
      return supplierOptions;
    }

    return suppliers
      .filter((supplier) => {
        const supplierCompanyId = getId(
          supplier.companyId?._id || supplier.companyId,
        );

        return supplierCompanyId === selectedCompanyId;
      })
      .map((supplier) => ({
        value: getId(supplier._id),

        label:
          supplier.name ||
          supplier.displayName ||
          supplier.code ||
          getId(supplier._id),
      }));
  }, [suppliers, supplierOptions, selectedCompanyId]);

  // ==========================================================
  // FILTER PURCHASES
  // ==========================================================

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const companyId = getId(purchase.companyId?._id || purchase.companyId);

      const supplierId = getId(purchase.supplierId?._id || purchase.supplierId);

      const companyMatch =
        !selectedCompanyId || companyId === selectedCompanyId;

      const supplierMatch =
        !selectedSupplierId || supplierId === selectedSupplierId;

      const statusMatch = !selectedStatus || purchase.status === selectedStatus;

      return companyMatch && supplierMatch && statusMatch;
    });
  }, [purchases, selectedCompanyId, selectedSupplierId, selectedStatus]);

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
            warehouseId: "",
            supplierId: "",
          }
        : {}),
    }));
  };

  // ==========================================================
  // TABLE COMPANY FILTER
  // ==========================================================

  const handleCompanyFilterChange = (event) => {
    const { value } = event.target;

    setSelectedCompanyId(value);

    setSelectedSupplierId("");

    if (value) {
      dispatch(
        fetchPartners({
          companyId: value,
        }),
      );
    }
  };

  // ==========================================================
  // TABLE SUPPLIER FILTER
  // ==========================================================

  const handleSupplierFilterChange = (event) => {
    setSelectedSupplierId(event.target.value);
  };

  // ==========================================================
  // TABLE STATUS FILTER
  // ==========================================================

  const handleStatusFilterChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // ==========================================================
  // ITEM CHANGE
  // ==========================================================

  const handleItemChange = (index, field, value) => {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  // ==========================================================
  // ADD ITEM
  // ==========================================================

  const addItem = () => {
    setItems((previous) => [...previous, createInitialItem()]);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const removeItem = (index) => {
    setItems((previous) => {
      if (previous.length === 1) {
        return previous;
      }

      return previous.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  // ==========================================================
  // CALCULATE ITEM
  // ==========================================================

  const calculateItem = (item) => {
    const quantity = toNumber(item.quantity);

    const rate = toNumber(item.rate);

    const discountPercent = toNumber(item.discountPercent);

    const taxPercent = toNumber(item.taxPercent);

    const gross = quantity * rate;

    const discountAmount = (gross * discountPercent) / 100;

    const taxableAmount = gross - discountAmount;

    const taxAmount = (taxableAmount * taxPercent) / 100;

    const amount = taxableAmount + taxAmount;

    return {
      gross,

      discountAmount,

      taxableAmount,

      taxAmount,

      amount,
    };
  };

  // ==========================================================
  // TOTALS
  // ==========================================================

  const totals = useMemo(() => {
    const result = items.reduce(
      (total, item) => {
        const calculated = calculateItem(item);

        return {
          subtotal: total.subtotal + calculated.gross,

          discountAmount: total.discountAmount + calculated.discountAmount,

          taxableAmount: total.taxableAmount + calculated.taxableAmount,

          taxAmount: total.taxAmount + calculated.taxAmount,
        };
      },
      {
        subtotal: 0,

        discountAmount: 0,

        taxableAmount: 0,

        taxAmount: 0,
      },
    );

    const otherCharges = toNumber(formData.otherCharges);

    const roundOff = toNumber(formData.roundOffAmount);

    const grandTotal =
      result.taxableAmount + result.taxAmount + otherCharges + roundOff;

    const paid = toNumber(formData.paidAmount);

    const balance = Math.max(grandTotal - paid, 0);

    return {
      ...result,

      otherCharges,

      roundOff,

      grandTotal,

      paid,

      balance,
    };
  }, [
    items,
    formData.otherCharges,
    formData.roundOffAmount,
    formData.paidAmount,
  ]);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData({
      ...initialFormData,
    });

    setItems([createInitialItem()]);

    setEditingPurchase(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    if (!workspaceId) {
      showToast({
        type: "error",

        title: "Workspace Required",

        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingPurchase(null);

    setFormData({
      ...initialFormData,

      companyId: selectedCompanyId || "",

      supplierId: selectedSupplierId || "",
    });

    setItems([createInitialItem()]);

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (purchase) => {
    setSelectedPurchase(purchase);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = async (purchase) => {
    const companyId = getId(purchase.companyId?._id || purchase.companyId);

    const branchId = getId(purchase.branchId?._id || purchase.branchId);

    const warehouseId = getId(
      purchase.warehouseId?._id || purchase.warehouseId,
    );

    const supplierId = getId(purchase.supplierId?._id || purchase.supplierId);

    setEditingPurchase(purchase);

    setFormData({
      companyId,

      branchId,

      warehouseId,

      supplierId,

      purchaseNumber: purchase.purchaseNumber || "",

      supplierInvoiceNumber: purchase.supplierInvoiceNumber || "",

      purchaseDate: purchase.purchaseDate
        ? new Date(purchase.purchaseDate).toISOString().split("T")[0]
        : "",

      supplierInvoiceDate: purchase.supplierInvoiceDate
        ? new Date(purchase.supplierInvoiceDate).toISOString().split("T")[0]
        : "",

      otherCharges: purchase.otherCharges ?? "",

      roundOffAmount: purchase.roundOffAmount ?? "",

      paidAmount: purchase.paidAmount ?? "",

      status: purchase.status || "DRAFT",

      notes: purchase.notes || "",
    });

    setSelectedCompanyId(companyId);

    setSelectedSupplierId(supplierId);

    setIsModalOpen(true);

    // --------------------------------------------------------
    // GET COMPLETE PURCHASE
    // --------------------------------------------------------

    const result = await dispatch(getPurchaseById(purchase._id));

    if (getPurchaseById.fulfilled.match(result)) {
      const data = result.payload?.data ?? result.payload;

      const purchaseItems = data?.items ?? [];

      setItems(
        purchaseItems.length > 0
          ? purchaseItems.map((item) => ({
              productId: getId(item.productId?._id || item.productId),

              quantity: item.quantity ?? "",

              rate: item.rate ?? "",

              discountPercent: item.discountPercent ?? "",

              taxPercent: item.taxPercent ?? "",
            }))
          : [createInitialItem()],
      );
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (purchase) => {
    const result = await dispatch(deletePurchase(purchase._id));

    if (deletePurchase.fulfilled.match(result)) {
      showToast({
        type: "success",

        title: "Purchase Deleted",

        message: "Purchase deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",

      title: "Error",

      message: result?.payload || "Failed to delete purchase.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ------------------------------------------------------
    // WORKSPACE
    // ------------------------------------------------------

    if (!workspaceId) {
      showToast({
        type: "error",

        title: "Workspace Required",

        message: "Please select a workspace first.",
      });

      return;
    }

    // ------------------------------------------------------
    // COMPANY
    // ------------------------------------------------------

    if (!formData.companyId) {
      showToast({
        type: "error",

        title: "Company Required",

        message: "Please select a company.",
      });

      return;
    }

    // ------------------------------------------------------
    // WAREHOUSE
    // ------------------------------------------------------

    if (!formData.warehouseId) {
      showToast({
        type: "error",

        title: "Warehouse Required",

        message: "Please select a warehouse.",
      });

      return;
    }

    // ------------------------------------------------------
    // SUPPLIER
    // ------------------------------------------------------

    if (!formData.supplierId) {
      showToast({
        type: "error",

        title: "Supplier Required",

        message: "Please select a supplier.",
      });

      return;
    }

    // ------------------------------------------------------
    // PURCHASE NUMBER
    // ------------------------------------------------------

    if (!formData.purchaseNumber?.trim()) {
      showToast({
        type: "error",

        title: "Purchase Number Required",

        message: "Please enter purchase number.",
      });

      return;
    }

    // ------------------------------------------------------
    // ITEMS
    // ------------------------------------------------------

    if (!items.length) {
      showToast({
        type: "error",

        title: "Items Required",

        message: "Please add at least one purchase item.",
      });

      return;
    }

    // ------------------------------------------------------
    // CREATE PAYLOAD ITEMS
    // ------------------------------------------------------

    const payloadItems = items.map((item) => {
      const product = workspaceProducts.find(
        (productItem) => getId(productItem._id) === getId(item.productId),
      );

      const calculated = calculateItem(item);

      return {
        productId: item.productId,

        unitId: getId(product?.unitId?._id || product?.unitId),

        hsnSacId: getId(product?.hsnSacId?._id || product?.hsnSacId) || null,

        taxId: getId(product?.taxId?._id || product?.taxId) || null,

        quantity: toNumber(item.quantity),

        receivedQuantity: toNumber(item.quantity),

        rate: toNumber(item.rate),

        discountPercent: toNumber(item.discountPercent),

        discountAmount: calculated.discountAmount,

        taxableAmount: calculated.taxableAmount,

        taxPercent: toNumber(item.taxPercent),

        taxAmount: calculated.taxAmount,

        amount: calculated.amount,
      };
    });

    // ------------------------------------------------------
    // VALIDATE ITEMS
    // ------------------------------------------------------

    for (let index = 0; index < payloadItems.length; index += 1) {
      const item = payloadItems[index];

      if (!item.productId) {
        showToast({
          type: "error",

          title: "Product Required",

          message: `Please select product for item ${index + 1}.`,
        });

        return;
      }

      if (!item.unitId) {
        showToast({
          type: "error",

          title: "Unit Missing",

          message: `Selected product has no unit for item ${index + 1}.`,
        });

        return;
      }

      if (item.quantity <= 0) {
        showToast({
          type: "error",

          title: "Invalid Quantity",

          message: `Quantity must be greater than 0 for item ${index + 1}.`,
        });

        return;
      }

      if (item.rate < 0) {
        showToast({
          type: "error",

          title: "Invalid Rate",

          message: `Rate cannot be negative for item ${index + 1}.`,
        });

        return;
      }
    }

    // ------------------------------------------------------
    // FINAL PAYLOAD
    // ------------------------------------------------------

    const payload = {
      workspaceId,

      companyId: formData.companyId,

      branchId: formData.branchId || null,

      warehouseId: formData.warehouseId,

      supplierId: formData.supplierId,

      purchaseNumber: formData.purchaseNumber.trim().toUpperCase(),

      supplierInvoiceNumber: formData.supplierInvoiceNumber?.trim() || "",

      purchaseDate: formData.purchaseDate || new Date(),

      supplierInvoiceDate: formData.supplierInvoiceDate || null,

      otherCharges: totals.otherCharges,

      roundOffAmount: totals.roundOff,

      paidAmount: totals.paid,

      status: formData.status,

      notes: formData.notes?.trim() || "",

      items: payloadItems,
    };

    // ======================================================
    // UPDATE
    // ======================================================

    if (editingPurchase) {
      const result = await dispatch(
        updatePurchase({
          id: editingPurchase._id,

          data: payload,
        }),
      );

      if (updatePurchase.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",

          title: "Purchase Updated",

          message: "Purchase updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",

        title: "Error",

        message: result?.payload || "Failed to update purchase.",
      });

      return;
    }

    // ======================================================
    // CREATE
    // ======================================================

    const result = await dispatch(createPurchase(payload));

    if (createPurchase.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",

        title: "Purchase Created",

        message: "Purchase created successfully.",
      });

      return;
    }

    showToast({
      type: "error",

      title: "Error",

      message: result?.payload || "Failed to create purchase.",
    });
  };

  // ==========================================================
  // DISPLAY HELPERS
  // ==========================================================

  const getCompanyName = (purchase) => {
    if (purchase.companyId?.name) {
      return purchase.companyId.name;
    }

    const companyId = getId(purchase.companyId?._id || purchase.companyId);

    return (
      workspaceCompanies.find((company) => getId(company._id) === companyId)
        ?.name || "-"
    );
  };

  const getSupplierName = (purchase) => {
    if (purchase.supplierId?.name) {
      return purchase.supplierId.name;
    }

    const supplierId = getId(purchase.supplierId?._id || purchase.supplierId);

    return (
      partners.find((partner) => getId(partner._id) === supplierId)?.name || "-"
    );
  };

  const getWarehouseName = (purchase) => {
    if (purchase.warehouseId?.name) {
      return purchase.warehouseId.name;
    }

    const warehouseId = getId(
      purchase.warehouseId?._id || purchase.warehouseId,
    );

    return (
      warehouses.find((warehouse) => getId(warehouse._id) === warehouseId)
        ?.name || "-"
    );
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "purchaseNumber",

      label: "Purchase No.",
    },

    {
      key: "supplierId",

      label: "Supplier",

      render: (row) => getSupplierName(row),
    },

    {
      key: "companyId",

      label: "Company",

      render: (row) => getCompanyName(row),
    },

    {
      key: "warehouseId",

      label: "Warehouse",

      render: (row) => getWarehouseName(row),
    },

    {
      key: "purchaseDate",

      label: "Date",

      render: (row) =>
        row.purchaseDate
          ? new Date(row.purchaseDate).toLocaleDateString()
          : "-",
    },

    {
      key: "grandTotal",

      label: "Grand Total",

      render: (row) => `₹${Number(row.grandTotal || 0).toFixed(2)}`,
    },

    {
      key: "paymentStatus",

      label: "Payment",

      render: (row) => <Badge>{row.paymentStatus || "UNPAID"}</Badge>,
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
        title="Purchases"
        description="Manage purchase bills and purchase items."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Purchase
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
          FILTERS
      ==================================================== */}

      <Grid>
        {/* COMPANY FILTER */}

        <Select
          label="Company"
          name="selectedCompanyId"
          value={selectedCompanyId}
          onChange={handleCompanyFilterChange}
          options={[
            {
              value: "",
              label: "All Companies",
            },

            ...companyOptions,
          ]}
        />

        {/* SUPPLIER FILTER */}

        <Select
          label="Supplier"
          name="selectedSupplierId"
          value={selectedSupplierId}
          onChange={handleSupplierFilterChange}
          options={[
            {
              value: "",
              label: "All Suppliers",
            },

            ...selectedCompanySupplierOptions,
          ]}
        />

        {/* STATUS FILTER */}

        <Select
          label="Status"
          name="selectedStatus"
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          options={[
            {
              value: "",
              label: "All Statuses",
            },

            ...statusOptions,
          ]}
        />
      </Grid>

      {/* ====================================================
          PURCHASE TABLE
      ==================================================== */}

      <Table
        title="Purchases"
        columns={columns}
        data={filteredPurchases}
        rowKey="_id"
        emptyMessage="No purchases found."
        loading={status === "loading"}
        searchPlaceholder="Search purchases..."
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
        title={editingPurchase ? "Edit Purchase" : "Add Purchase"}
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

            <Button type="submit" form="purchase-form">
              {editingPurchase ? "Update Purchase" : "Create Purchase"}
            </Button>
          </>
        }
      >
        <form id="purchase-form" onSubmit={handleSubmit}>
          {/* =================================================
              PURCHASE HEADER
          ================================================= */}

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

            {/* BRANCH */}

            <Select
              label="Branch"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: !formData.companyId
                    ? "Select Company First"
                    : "Select Branch",
                },

                ...branchOptions,
              ]}
            />

            {/* WAREHOUSE */}

            <Select
              label="Warehouse"
              name="warehouseId"
              value={formData.warehouseId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: !formData.companyId
                    ? "Select Company First"
                    : formWarehouses.length > 0
                      ? "Select Warehouse"
                      : "No Warehouse Found",
                },

                ...warehouseOptions,
              ]}
            />

            {/* SUPPLIER */}

            <Select
              label="Supplier"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: !formData.companyId
                    ? "Select Company First"
                    : supplierOptions.length > 0
                      ? "Select Supplier"
                      : "No Supplier Found",
                },

                ...supplierOptions,
              ]}
            />

            {/* PURCHASE NUMBER */}

            <Input
              label="Purchase Number"
              name="purchaseNumber"
              value={formData.purchaseNumber}
              onChange={handleChange}
              placeholder="PUR-00001"
            />

            {/* SUPPLIER INVOICE NUMBER */}

            <Input
              label="Supplier Invoice Number"
              name="supplierInvoiceNumber"
              value={formData.supplierInvoiceNumber}
              onChange={handleChange}
              placeholder="Supplier invoice number"
            />

            {/* PURCHASE DATE */}

            <Input
              label="Purchase Date"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
            />

            {/* SUPPLIER INVOICE DATE */}

            <Input
              label="Supplier Invoice Date"
              name="supplierInvoiceDate"
              type="date"
              value={formData.supplierInvoiceDate}
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
          </Grid>

          {/* =================================================
              PURCHASE ITEMS
          ================================================= */}

          <div
            style={{
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                marginBottom: "16px",
              }}
            >
              <strong>Purchase Items</strong>

              <Button type="button" onClick={addItem}>
                Add Item
              </Button>
            </div>

            {items.map((item, index) => {
              const calculated = calculateItem(item);

              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "16px",

                    padding: "16px",

                    border: "1px solid var(--border-color, #ddd)",

                    borderRadius: "8px",
                  }}
                >
                  <Grid>
                    {/* PRODUCT */}

                    <Select
                      label={`Product ${index + 1}`}
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

                    {/* QUANTITY */}

                    <Input
                      label="Quantity"
                      type="number"
                      min="0"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, "quantity", event.target.value)
                      }
                      placeholder="0"
                    />

                    {/* RATE */}

                    <Input
                      label="Rate"
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(event) =>
                        handleItemChange(index, "rate", event.target.value)
                      }
                      placeholder="0"
                    />

                    {/* DISCOUNT */}

                    <Input
                      label="Discount %"
                      type="number"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          "discountPercent",
                          event.target.value,
                        )
                      }
                      placeholder="0"
                    />

                    {/* TAX */}

                    <Input
                      label="Tax %"
                      type="number"
                      min="0"
                      max="100"
                      value={item.taxPercent}
                      onChange={(event) =>
                        handleItemChange(
                          index,
                          "taxPercent",
                          event.target.value,
                        )
                      }
                      placeholder="0"
                    />

                    {/* AMOUNT */}

                    <Input
                      label="Amount"
                      value={Number(calculated.amount || 0).toFixed(2)}
                      readOnly
                    />

                    {/* REMOVE */}

                    <div
                      style={{
                        display: "flex",

                        alignItems: "end",
                      }}
                    >
                      <Button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </Grid>
                </div>
              );
            })}
          </div>

          {/* =================================================
              TOTALS
          ================================================= */}

          <Grid>
            {/* SUBTOTAL */}

            <Input
              label="Subtotal"
              value={totals.subtotal.toFixed(2)}
              readOnly
            />

            {/* DISCOUNT */}

            <Input
              label="Discount"
              value={totals.discountAmount.toFixed(2)}
              readOnly
            />

            {/* TAXABLE */}

            <Input
              label="Taxable Amount"
              value={totals.taxableAmount.toFixed(2)}
              readOnly
            />

            {/* TAX */}

            <Input
              label="Tax Amount"
              value={totals.taxAmount.toFixed(2)}
              readOnly
            />

            {/* OTHER CHARGES */}

            <Input
              label="Other Charges"
              name="otherCharges"
              type="number"
              value={formData.otherCharges}
              onChange={handleChange}
            />

            {/* ROUND OFF */}

            <Input
              label="Round Off"
              name="roundOffAmount"
              type="number"
              value={formData.roundOffAmount}
              onChange={handleChange}
            />

            {/* PAID */}

            <Input
              label="Paid Amount"
              name="paidAmount"
              type="number"
              value={formData.paidAmount}
              onChange={handleChange}
            />

            {/* GRAND TOTAL */}

            <Input
              label="Grand Total"
              value={totals.grandTotal.toFixed(2)}
              readOnly
            />

            {/* BALANCE */}

            <Input label="Balance" value={totals.balance.toFixed(2)} readOnly />

            {/* NOTES */}

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Purchase notes"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW PURCHASE
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedPurchase(null);
        }}
        title="View Purchase"
      >
        {selectedPurchase && (
          <Grid>
            {/* PURCHASE NUMBER */}

            <div>
              <strong>Purchase Number</strong>

              <div>{selectedPurchase.purchaseNumber}</div>
            </div>

            {/* SUPPLIER */}

            <div>
              <strong>Supplier</strong>

              <div>{getSupplierName(selectedPurchase)}</div>
            </div>

            {/* COMPANY */}

            <div>
              <strong>Company</strong>

              <div>{getCompanyName(selectedPurchase)}</div>
            </div>

            {/* WAREHOUSE */}

            <div>
              <strong>Warehouse</strong>

              <div>{getWarehouseName(selectedPurchase)}</div>
            </div>

            {/* PURCHASE DATE */}

            <div>
              <strong>Purchase Date</strong>

              <div>
                {selectedPurchase.purchaseDate
                  ? new Date(selectedPurchase.purchaseDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            {/* SUPPLIER INVOICE */}

            <div>
              <strong>Supplier Invoice</strong>

              <div>{selectedPurchase.supplierInvoiceNumber || "-"}</div>
            </div>

            {/* SUBTOTAL */}

            <div>
              <strong>Subtotal</strong>

              <div>₹{Number(selectedPurchase.subtotal || 0).toFixed(2)}</div>
            </div>

            {/* DISCOUNT */}

            <div>
              <strong>Discount</strong>

              <div>
                ₹{Number(selectedPurchase.discountAmount || 0).toFixed(2)}
              </div>
            </div>

            {/* TAX */}

            <div>
              <strong>Tax</strong>

              <div>₹{Number(selectedPurchase.taxAmount || 0).toFixed(2)}</div>
            </div>

            {/* GRAND TOTAL */}

            <div>
              <strong>Grand Total</strong>

              <div>₹{Number(selectedPurchase.grandTotal || 0).toFixed(2)}</div>
            </div>

            {/* PAID */}

            <div>
              <strong>Paid Amount</strong>

              <div>₹{Number(selectedPurchase.paidAmount || 0).toFixed(2)}</div>
            </div>

            {/* BALANCE */}

            <div>
              <strong>Balance</strong>

              <div>
                ₹{Number(selectedPurchase.balanceAmount || 0).toFixed(2)}
              </div>
            </div>

            {/* PAYMENT */}

            <div>
              <strong>Payment Status</strong>

              <div>
                <Badge>{selectedPurchase.paymentStatus || "UNPAID"}</Badge>
              </div>
            </div>

            {/* STATUS */}

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedPurchase.status || "-"}</Badge>
              </div>
            </div>

            {/* NOTES */}

            <div>
              <strong>Notes</strong>

              <div>{selectedPurchase.notes || "-"}</div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default PurchasePage;
