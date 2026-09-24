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
// SALES THUNKS
// ============================================================

import {
  createSales,
  getSales,
  getSalesById,
  updateSales,
  deleteSales,
} from "./store/sales.thunks.js";

// ============================================================
// SALES SELECTORS
// ============================================================

import { selectSales, selectSalesStatus } from "./store/sales.selectors.js";

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
  customerId: "",

  salesNumber: "",
  customerReferenceNumber: "",

  salesDate: new Date().toISOString().split("T")[0],

  customerReferenceDate: "",

  otherCharges: "",
  roundOffAmount: "",
  receivedAmount: "",

  status: "DRAFT",

  notes: "",
};

// ============================================================
// CREATE INITIAL ITEM
// ============================================================

const createInitialItem = () => ({
  productId: "",
  quantity: "",
  rate: "",
  discountPercent: "",
  taxPercent: "",
  description: "",

  deliveredQuantity: 0,

  unitId: "",
  hsnSacId: "",
  taxId: "",
});

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
// PAYMENT STATUS OPTIONS
// ============================================================

const paymentStatusOptions = [
  {
    value: "",
    label: "All Payment Status",
  },
  {
    value: "UNPAID",
    label: "Unpaid",
  },
  {
    value: "PARTIAL",
    label: "Partial",
  },
  {
    value: "PAID",
    label: "Paid",
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
// PRODUCT ID HELPER
// ============================================================

const getProductFieldId = (product, field) => {
  if (!product) {
    return "";
  }

  return getId(product[field]);
};

// ============================================================
// ITEM CALCULATION
// ============================================================

const calculateItem = (item) => {
  const quantity = Number(item.quantity || 0);

  const rate = Number(item.rate || 0);

  const discountPercent = Number(item.discountPercent || 0);

  const taxPercent = Number(item.taxPercent || 0);

  const grossAmount = quantity * rate;

  const discountAmount = (grossAmount * discountPercent) / 100;

  const taxableAmount = grossAmount - discountAmount;

  const taxAmount = (taxableAmount * taxPercent) / 100;

  const amount = taxableAmount + taxAmount;

  return {
    ...item,

    quantity,
    rate,

    discountPercent,
    discountAmount,

    taxableAmount,

    taxPercent,
    taxAmount,

    amount,
  };
};

// ============================================================
// PAGE
// ============================================================

function SalesPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX
  // ==========================================================

  const sales = useSelector(selectSales);

  const salesStatus = useSelector(selectSalesStatus);

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  const companies = useSelector(selectCompanies);

  const branches = useSelector(selectBranches);

  const warehouses = useSelector(selectWarehouses);

  const partners = useSelector(selectPartners);

  const products = useSelector(selectProducts);

  // ==========================================================
  // FORM STATE
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

  const [selectedSale, setSelectedSale] = useState(null);

  const [editingSale, setEditingSale] = useState(null);

  // ==========================================================
  // LIST FILTERS
  // ==========================================================

  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");

  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  const [selectedPaymentStatusFilter, setSelectedPaymentStatusFilter] =
    useState("");

  // ==========================================================
  // ACTIVE WORKSPACE ID
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
  // FETCH SALES
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(
      getSales({
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

    /*
     * Some Company APIs already
     * return workspace-filtered data.
     */
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
  // FETCH BRANCHES + CUSTOMERS
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
  // CUSTOMER OPTIONS
  // ==========================================================

  const customerOptions = useMemo(() => {
    return partners
      .filter((partner) => {
        return (
          partner.partnerType === "CUSTOMER" || partner.partnerType === "BOTH"
        );
      })
      .map((partner) => ({
        value: getId(partner._id),
        label:
          partner.name || partner.displayName || partner.code || partner._id,
      }));
  }, [partners]);

  // ==========================================================
  // WORKSPACE PRODUCTS
  // ==========================================================

  const workspaceProducts = useMemo(() => {
    return products.filter((product) => {
      const workspaceId = getId(product.workspaceId || product.workspace);

      if (!workspaceId) {
        /*
         * Some API responses may
         * already be workspace scoped.
         */
        return true;
      }

      return workspaceId === activeWorkspaceId;
    });
  }, [products, activeWorkspaceId]);

  // ==========================================================
  // PRODUCT OPTIONS
  // ==========================================================

  const productOptions = useMemo(() => {
    return workspaceProducts.map((product) => ({
      value: getId(product._id),
      label: product.name || product.code || product.sku || product._id,
    }));
  }, [workspaceProducts]);

  // ==========================================================
  // CALCULATED ITEMS
  // ==========================================================

  const calculatedItems = useMemo(() => {
    return items.map(calculateItem);
  }, [items]);

  // ==========================================================
  // TOTALS
  // ==========================================================

  const totals = useMemo(() => {
    const subtotal = calculatedItems.reduce(
      (total, item) =>
        total + Number(item.quantity || 0) * Number(item.rate || 0),
      0,
    );

    const discountAmount = calculatedItems.reduce(
      (total, item) => total + Number(item.discountAmount || 0),
      0,
    );

    const taxableAmount = calculatedItems.reduce(
      (total, item) => total + Number(item.taxableAmount || 0),
      0,
    );

    const taxAmount = calculatedItems.reduce(
      (total, item) => total + Number(item.taxAmount || 0),
      0,
    );

    const otherCharges = Number(formData.otherCharges || 0);

    const roundOffAmount = Number(formData.roundOffAmount || 0);

    const grandTotal =
      taxableAmount + taxAmount + otherCharges + roundOffAmount;

    const receivedAmount = Math.max(Number(formData.receivedAmount || 0), 0);

    const balanceAmount = Math.max(grandTotal - receivedAmount, 0);

    let paymentStatus = "UNPAID";

    if (receivedAmount > 0 && receivedAmount < grandTotal) {
      paymentStatus = "PARTIAL";
    }

    if (grandTotal > 0 && receivedAmount >= grandTotal) {
      paymentStatus = "PAID";
    }

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      otherCharges,
      roundOffAmount,
      grandTotal,
      receivedAmount,
      balanceAmount,
      paymentStatus,
    };
  }, [
    calculatedItems,
    formData.otherCharges,
    formData.roundOffAmount,
    formData.receivedAmount,
  ]);

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
  // FORM COMPANY CHANGE
  // ==========================================================

  const handleFormCompanyChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,

      companyId: value,

      branchId: "",
      warehouseId: "",
      customerId: "",
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
          currentItem.unitId = getProductFieldId(product, "unitId");

          currentItem.hsnSacId = getProductFieldId(product, "hsnSacId");

          currentItem.taxId = getProductFieldId(product, "taxId");

          /*
           * Sales price becomes
           * default rate.
           */
          if (currentItem.rate === "" || Number(currentItem.rate) === 0) {
            currentItem.rate =
              product.salesPrice ?? product.minimumSalesPrice ?? "";
          }

          /*
           * If the API returns tax
           * rate inside populated tax,
           * use it as default.
           */
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

    setEditingSale(null);
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

    if (!workspaceCompanies.length) {
      showToast({
        type: "error",
        title: "Company Required",
        message: "No company found for the selected workspace.",
      });

      return;
    }

    const firstCompanyId = workspaceCompanies[0]?._id;

    setEditingSale(null);

    setFormData({
      ...initialFormData,

      companyId: selectedCompanyId || firstCompanyId || "",
    });

    setItems([createInitialItem()]);

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = async (sale) => {
    const result = await dispatch(getSalesById(sale._id));

    if (getSalesById.fulfilled.match(result)) {
      setSelectedSale(result.payload);

      setIsViewModalOpen(true);

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to load sales.",
    });
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = async (sale) => {
    const result = await dispatch(getSalesById(sale._id));

    if (!getSalesById.fulfilled.match(result)) {
      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to load sales.",
      });

      return;
    }

    const detail = result.payload;

    const currentSale = detail?.sales || detail;

    const currentItems = detail?.items || [];

    setEditingSale(currentSale);

    setFormData({
      companyId: getId(currentSale.companyId),

      branchId: getId(currentSale.branchId),

      warehouseId: getId(currentSale.warehouseId),

      customerId: getId(currentSale.customerId),

      salesNumber: currentSale.salesNumber || "",

      customerReferenceNumber: currentSale.customerReferenceNumber || "",

      salesDate: currentSale.salesDate
        ? new Date(currentSale.salesDate).toISOString().split("T")[0]
        : "",

      customerReferenceDate: currentSale.customerReferenceDate
        ? new Date(currentSale.customerReferenceDate)
            .toISOString()
            .split("T")[0]
        : "",

      otherCharges: currentSale.otherCharges ?? "",

      roundOffAmount: currentSale.roundOffAmount ?? "",

      receivedAmount: currentSale.receivedAmount ?? "",

      status: currentSale.status || "DRAFT",

      notes: currentSale.notes || "",
    });

    setItems(
      currentItems.length > 0
        ? currentItems.map((item) => ({
            productId: getId(item.productId),

            unitId: getId(item.unitId),

            hsnSacId: getId(item.hsnSacId),

            taxId: getId(item.taxId),

            quantity: item.quantity ?? "",

            deliveredQuantity: item.deliveredQuantity ?? 0,

            rate: item.rate ?? "",

            discountPercent: item.discountPercent ?? "",

            taxPercent: item.taxPercent ?? "",

            description: item.description || "",
          }))
        : [createInitialItem()],
    );

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (sale) => {
    const confirmed = window.confirm(`Delete sales "${sale.salesNumber}"?`);

    if (!confirmed) {
      return;
    }

    const result = await dispatch(deleteSales(sale._id));

    if (deleteSales.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Sales Deleted",
        message: "Sales deleted successfully.",
      });

      dispatch(
        getSales({
          workspaceId: activeWorkspaceId,
        }),
      );

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete sales.",
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
    // WAREHOUSE
    // --------------------------------------------------------

    if (!formData.warehouseId) {
      showToast({
        type: "error",
        title: "Warehouse Required",
        message: "Please select a warehouse.",
      });

      return;
    }

    // --------------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------------

    if (!formData.customerId) {
      showToast({
        type: "error",
        title: "Customer Required",
        message: "Please select a customer.",
      });

      return;
    }

    // --------------------------------------------------------
    // SALES NUMBER
    // --------------------------------------------------------

    if (!formData.salesNumber?.trim()) {
      showToast({
        type: "error",
        title: "Sales Number Required",
        message: "Please enter sales number.",
      });

      return;
    }

    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    if (!formData.salesDate) {
      showToast({
        type: "error",
        title: "Sales Date Required",
        message: "Please select sales date.",
      });

      return;
    }

    // --------------------------------------------------------
    // ITEMS
    // --------------------------------------------------------

    if (!items.length) {
      showToast({
        type: "error",
        title: "Sales Items Required",
        message: "Add at least one sales item.",
      });

      return;
    }

    // --------------------------------------------------------
    // ITEM VALIDATION
    // --------------------------------------------------------

    const invalidItem = items.find(
      (item) =>
        !item.productId ||
        !Number(item.quantity || 0) ||
        Number(item.quantity || 0) <= 0 ||
        Number(item.rate || 0) < 0,
    );

    if (invalidItem) {
      showToast({
        type: "error",
        title: "Invalid Sales Item",
        message:
          "Please select product and enter valid quantity and rate for every item.",
      });

      return;
    }

    // --------------------------------------------------------
    // RECEIVED AMOUNT
    // --------------------------------------------------------

    const receivedAmount = Number(formData.receivedAmount || 0);

    if (receivedAmount < 0) {
      showToast({
        type: "error",
        title: "Invalid Amount",
        message: "Received amount cannot be negative.",
      });

      return;
    }

    if (receivedAmount > totals.grandTotal) {
      showToast({
        type: "error",
        title: "Invalid Received Amount",
        message: "Received amount cannot exceed grand total.",
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

      warehouseId: formData.warehouseId,

      customerId: formData.customerId,

      salesNumber: formData.salesNumber.trim().toUpperCase(),

      customerReferenceNumber: formData.customerReferenceNumber?.trim() || "",

      salesDate: formData.salesDate,

      customerReferenceDate: formData.customerReferenceDate || null,

      otherCharges: Number(formData.otherCharges || 0),

      roundOffAmount: Number(formData.roundOffAmount || 0),

      receivedAmount: receivedAmount,

      status: formData.status,

      notes: formData.notes?.trim() || "",

      items: items.map((item) => ({
        productId: item.productId,

        unitId: item.unitId || null,

        hsnSacId: item.hsnSacId || null,

        taxId: item.taxId || null,

        quantity: Number(item.quantity || 0),

        deliveredQuantity: Number(item.deliveredQuantity || 0),

        rate: Number(item.rate || 0),

        discountPercent: Number(item.discountPercent || 0),

        taxPercent: Number(item.taxPercent || 0),

        description: item.description?.trim() || "",
      })),
    };

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    if (editingSale) {
      const result = await dispatch(
        updateSales({
          id: editingSale._id,
          payload,
        }),
      );

      if (updateSales.fulfilled.match(result)) {
        showToast({
          type: "success",
          title: "Sales Updated",
          message: "Sales updated successfully.",
        });

        setIsModalOpen(false);

        resetForm();

        dispatch(
          getSales({
            workspaceId: activeWorkspaceId,
          }),
        );

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update sales.",
      });

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const result = await dispatch(createSales(payload));

    if (createSales.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Sales Created",
        message: "Sales created successfully.",
      });

      setIsModalOpen(false);

      resetForm();

      dispatch(
        getSales({
          workspaceId: activeWorkspaceId,
        }),
      );

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create sales.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "salesNumber",
      label: "Sales No.",
    },

    {
      key: "salesDate",
      label: "Date",

      render: (row) => {
        if (!row.salesDate) {
          return "-";
        }

        return new Date(row.salesDate).toLocaleDateString("en-IN");
      },
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
      key: "customerId",
      label: "Customer",

      render: (row) => {
        if (typeof row.customerId === "object") {
          return (
            row.customerId?.name ||
            row.customerId?.displayName ||
            row.customerId?.code ||
            "-"
          );
        }

        const customer = partners.find(
          (item) => getId(item._id) === getId(row.customerId),
        );

        return customer?.name || customer?.displayName || customer?.code || "-";
      },
    },

    {
      key: "grandTotal",
      label: "Grand Total",

      render: (row) => `₹ ${Number(row.grandTotal || 0).toFixed(2)}`,
    },

    {
      key: "receivedAmount",
      label: "Received",

      render: (row) => `₹ ${Number(row.receivedAmount || 0).toFixed(2)}`,
    },

    {
      key: "balanceAmount",
      label: "Balance",

      render: (row) => `₹ ${Number(row.balanceAmount || 0).toFixed(2)}`,
    },

    {
      key: "paymentStatus",
      label: "Payment",

      render: (row) => <Badge>{row.paymentStatus || "-"}</Badge>,
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
  // FILTERED SALES
  // ==========================================================

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleCompanyId = getId(sale.companyId);

      const companyMatch =
        !selectedCompanyFilter || saleCompanyId === selectedCompanyFilter;

      const statusMatch =
        !selectedStatusFilter || sale.status === selectedStatusFilter;

      const paymentMatch =
        !selectedPaymentStatusFilter ||
        sale.paymentStatus === selectedPaymentStatusFilter;

      return companyMatch && statusMatch && paymentMatch;
    });
  }, [
    sales,
    selectedCompanyFilter,
    selectedStatusFilter,
    selectedPaymentStatusFilter,
  ]);

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
      key: "rate",
      label: "Rate",

      render: (row) => `₹ ${Number(row.rate || 0).toFixed(2)}`,
    },

    {
      key: "discountPercent",
      label: "Discount %",

      render: (row) => `${Number(row.discountPercent || 0).toFixed(2)}%`,
    },

    {
      key: "taxPercent",
      label: "Tax %",

      render: (row) => `${Number(row.taxPercent || 0).toFixed(2)}%`,
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
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        title="Sales"
        description="Manage sales transactions."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Sales
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

        <Select
          label="Payment Status"
          name="selectedPaymentStatusFilter"
          value={selectedPaymentStatusFilter}
          onChange={(event) =>
            setSelectedPaymentStatusFilter(event.target.value)
          }
          options={paymentStatusOptions}
        />
      </Grid>

      {/* ====================================================
          SALES TABLE
      ==================================================== */}

      <Table
        title="Sales"
        columns={columns}
        data={filteredSales}
        rowKey="_id"
        emptyMessage="No sales found."
        loading={salesStatus === "loading"}
        searchPlaceholder="Search sales..."
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
        title={editingSale ? "Edit Sales" : "Add Sales"}
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

            <Button type="submit" form="sales-form">
              {editingSale ? "Update Sales" : "Create Sales"}
            </Button>
          </>
        }
      >
        <form id="sales-form" onSubmit={handleSubmit}>
          {/* ==================================================
              HEADER
          ================================================== */}

          <Grid>
            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleFormCompanyChange}
              options={companyOptions}
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
              label="Customer"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Customer",
                },
                ...customerOptions,
              ]}
            />

            <Input
              label="Sales Number"
              name="salesNumber"
              value={formData.salesNumber}
              onChange={handleChange}
              placeholder="Enter sales number"
            />

            <Input
              label="Sales Date"
              name="salesDate"
              type="date"
              value={formData.salesDate}
              onChange={handleChange}
            />

            <Input
              label="Customer Reference Number"
              name="customerReferenceNumber"
              value={formData.customerReferenceNumber}
              onChange={handleChange}
              placeholder="Customer PO / Reference"
            />

            <Input
              label="Customer Reference Date"
              name="customerReferenceDate"
              type="date"
              value={formData.customerReferenceDate}
              onChange={handleChange}
            />

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />
          </Grid>

          {/* ==================================================
              ITEMS
          ================================================== */}

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <strong>Sales Items</strong>

              <Button type="button" onClick={handleAddItem}>
                Add Item
              </Button>
            </div>

            {calculatedItems.map((item, index) => (
              <div
                key={`sales-item-${index}`}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                }}
              >
                <Grid>
                  <Select
                    label="Product"
                    name={`productId-${index}`}
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
                    label="Discount %"
                    type="number"
                    name={`discount-${index}`}
                    value={item.discountPercent}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "discountPercent",
                        event.target.value,
                      )
                    }
                    min="0"
                    max="100"
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
                    name={`amount-${index}`}
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

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <DeleteIcon
                    size={5}
                    title="Remove Item"
                    onClick={() => handleRemoveItem(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ==================================================
              TOTALS
          ================================================== */}

          <Grid>
            <Input
              label="Subtotal"
              name="subtotal"
              value={totals.subtotal.toFixed(2)}
              readOnly
            />

            <Input
              label="Discount"
              name="discountAmount"
              value={totals.discountAmount.toFixed(2)}
              readOnly
            />

            <Input
              label="Taxable Amount"
              name="taxableAmount"
              value={totals.taxableAmount.toFixed(2)}
              readOnly
            />

            <Input
              label="Tax Amount"
              name="taxAmount"
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
              label="Round Off"
              name="roundOffAmount"
              type="number"
              value={formData.roundOffAmount}
              onChange={handleChange}
              step="0.01"
            />

            <Input
              label="Grand Total"
              name="grandTotal"
              value={totals.grandTotal.toFixed(2)}
              readOnly
            />

            <Input
              label="Received Amount"
              name="receivedAmount"
              type="number"
              value={formData.receivedAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

            <Input
              label="Balance Amount"
              name="balanceAmount"
              value={totals.balanceAmount.toFixed(2)}
              readOnly
            />

            <Input
              label="Payment Status"
              name="paymentStatus"
              value={totals.paymentStatus}
              readOnly
            />

            <Textarea
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter sales notes"
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

          setSelectedSale(null);
        }}
        title="View Sales"
      >
        {selectedSale && (
          <>
            <Grid columns={1}>
              <div>
                <strong>Sales Number</strong>

                <div>
                  {selectedSale.sales?.salesNumber ||
                    selectedSale.salesNumber ||
                    "-"}
                </div>
              </div>

              <div>
                <strong>Sales Date</strong>

                <div>
                  {selectedSale.sales?.salesDate || selectedSale.salesDate
                    ? new Date(
                        selectedSale.sales?.salesDate || selectedSale.salesDate,
                      ).toLocaleDateString("en-IN")
                    : "-"}
                </div>
              </div>

              <div>
                <strong>Customer</strong>

                <div>
                  {getId(
                    selectedSale.sales?.customerId || selectedSale.customerId,
                  )}
                </div>
              </div>

              <div>
                <strong>Grand Total</strong>

                <div>
                  ₹{" "}
                  {Number(
                    selectedSale.sales?.grandTotal ||
                      selectedSale.grandTotal ||
                      0,
                  ).toFixed(2)}
                </div>
              </div>
            </Grid>

            <div
              style={{
                marginTop: "20px",
              }}
            >
              <Table
                title="Sales Items"
                columns={viewItemColumns}
                data={selectedSale.items || []}
                rowKey="_id"
                emptyMessage="No sales items found."
              />
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}

export default SalesPage;
