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

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./store/product.thunks.js";

import {
  selectProducts,
  selectProductStatus,
} from "./store/product.selectors.js";

import { selectWorkspaces } from "../workspace/store/workspace.selectors.js";

import { selectProductCategories } from "../product-category/store/product-category.selectors.js";

import { selectUnits } from "../unit/store/unit.selectors.js";

import { selectHsnSacList } from "../hsn-sac/store/hsn-sac.selectors.js";

import { selectTaxes } from "../tax/store/tax.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  workspaceId: "",
  companyId: "",

  code: "",
  name: "",
  description: "",
  type: "RAW_MATERIAL",

  categoryId: "",
  unitId: "",
  hsnSacId: "",
  taxId: "",

  sku: "",
  barcode: "",
  brand: "",
  color: "",
  size: "",
  material: "",

  purchasePrice: "",
  salesPrice: "",
  mrp: "",
  minimumSalesPrice: "",

  isPurchaseEnabled: true,
  isSalesEnabled: true,
  isStockItem: true,

  trackBatch: false,
  trackLot: false,
  trackSerialNumber: false,

  minimumStockLevel: "",
  maximumStockLevel: "",

  status: "ACTIVE",
};

// ============================================================
// PRODUCT TYPE OPTIONS
// ============================================================

const productTypeOptions = [
  {
    value: "RAW_MATERIAL",
    label: "Raw Material",
  },
  {
    value: "SEMI_FINISHED",
    label: "Semi Finished",
  },
  {
    value: "FINISHED",
    label: "Finished",
  },
  {
    value: "SERVICE",
    label: "Service",
  },
  {
    value: "FABRIC",
    label: "Fabric",
  },
  {
    value: "PACKING",
    label: "Packing",
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
// BOOLEAN OPTIONS
// ============================================================

const yesNoOptions = [
  {
    value: "true",
    label: "Yes",
  },
  {
    value: "false",
    label: "No",
  },
];

// ============================================================
// PAGE
// ============================================================

function ProductPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PRODUCT REDUX STATE
  // ==========================================================

  const products = useSelector(selectProducts);

  const status = useSelector(selectProductStatus);

  // ==========================================================
  // WORKSPACES
  // ==========================================================

  const workspaces = useSelector(selectWorkspaces);

  // ==========================================================
  // PRODUCT CATEGORIES
  // ==========================================================

  const productCategories = useSelector(selectProductCategories);

  // ==========================================================
  // UNITS
  // ==========================================================

  const units = useSelector(selectUnits);

  // ==========================================================
  // HSN / SAC
  // ==========================================================

  const hsnSacs = useSelector(selectHsnSacList);

  // ==========================================================
  // TAXES
  // ==========================================================

  const taxes = useSelector(selectTaxes);

  // ==========================================================
  // WORKSPACE FILTER
  // ==========================================================

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");

  // ==========================================================
  // PRODUCT TYPE FILTER
  // ==========================================================

  const [selectedProductType, setSelectedProductType] = useState("");

  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  const [selectedStatus, setSelectedStatus] = useState("");

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING PRODUCT
  // ==========================================================

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // WORKSPACE OPTIONS
  // ==========================================================

  const workspaceOptions = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace._id,
        label: workspace.name || workspace.code || workspace._id,
      })),
    [workspaces],
  );

  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  const categoryOptions = useMemo(
    () =>
      productCategories.map((category) => ({
        value: category._id,
        label: category.name || category.code || category._id,
      })),
    [productCategories],
  );

  // ==========================================================
  // UNIT OPTIONS
  // ==========================================================

  const unitOptions = useMemo(
    () =>
      units.map((unit) => ({
        value: unit._id,
        label: unit.name || unit.code || unit.symbol || unit._id,
      })),
    [units],
  );

  // ==========================================================
  // HSN / SAC OPTIONS
  // ==========================================================

  const hsnSacOptions = useMemo(
    () =>
      hsnSacs.map((item) => ({
        value: item._id,
        label:
          item.code || item.hsnCode || item.sacCode || item.name || item._id,
      })),
    [hsnSacs],
  );

  // ==========================================================
  // TAX OPTIONS
  // ==========================================================

  const taxOptions = useMemo(
    () =>
      taxes.map((tax) => ({
        value: tax._id,
        label:
          tax.name ||
          tax.code ||
          `${tax.name || "Tax"}${
            tax.rate !== undefined ? ` (${tax.rate}%)` : ""
          }`,
      })),
    [taxes],
  );

  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ==========================================================
  // FILTERED PRODUCTS
  // ==========================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productWorkspaceId =
        typeof product.workspaceId === "object"
          ? product.workspaceId?._id
          : product.workspaceId;

      const workspaceMatch =
        !selectedWorkspaceId || productWorkspaceId === selectedWorkspaceId;

      const typeMatch =
        !selectedProductType || product.type === selectedProductType;

      const statusMatch = !selectedStatus || product.status === selectedStatus;

      return workspaceMatch && typeMatch && statusMatch;
    });
  }, [products, selectedWorkspaceId, selectedProductType, selectedStatus]);

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  // ==========================================================
  // CREATE
  // ==========================================================

  const handleCreate = () => {
    resetForm();

    if (selectedWorkspaceId) {
      setFormData((previous) => ({
        ...previous,
        workspaceId: selectedWorkspaceId,
      }));
    }

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (product) => {
    setSelectedProduct(product);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (product) => {
    const workspaceId =
      typeof product.workspaceId === "object"
        ? product.workspaceId?._id
        : product.workspaceId;

    const companyId =
      typeof product.companyId === "object"
        ? product.companyId?._id
        : product.companyId;

    const categoryId =
      typeof product.categoryId === "object"
        ? product.categoryId?._id
        : product.categoryId;

    const unitId =
      typeof product.unitId === "object" ? product.unitId?._id : product.unitId;

    const hsnSacId =
      typeof product.hsnSacId === "object"
        ? product.hsnSacId?._id
        : product.hsnSacId;

    const taxId =
      typeof product.taxId === "object" ? product.taxId?._id : product.taxId;

    setEditingProduct(product);

    setFormData({
      workspaceId: workspaceId || "",
      companyId: companyId || "",

      code: product.code || "",
      name: product.name || "",
      description: product.description || "",
      type: product.type || "RAW_MATERIAL",

      categoryId: categoryId || "",
      unitId: unitId || "",
      hsnSacId: hsnSacId || "",
      taxId: taxId || "",

      sku: product.sku || "",
      barcode: product.barcode || "",
      brand: product.brand || "",
      color: product.color || "",
      size: product.size || "",
      material: product.material || "",

      purchasePrice: product.purchasePrice ?? "",
      salesPrice: product.salesPrice ?? "",
      mrp: product.mrp ?? "",
      minimumSalesPrice: product.minimumSalesPrice ?? "",

      isPurchaseEnabled: product.isPurchaseEnabled ?? true,

      isSalesEnabled: product.isSalesEnabled ?? true,

      isStockItem: product.isStockItem ?? true,

      trackBatch: product.trackBatch ?? false,

      trackLot: product.trackLot ?? false,

      trackSerialNumber: product.trackSerialNumber ?? false,

      minimumStockLevel: product.minimumStockLevel ?? "",

      maximumStockLevel: product.maximumStockLevel ?? "",

      status: product.status || "ACTIVE",
    });

    setSelectedWorkspaceId(workspaceId || "");

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (product) => {
    const result = await dispatch(deleteProduct(product._id));

    if (deleteProduct.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Product Deleted",
        message: "Product deleted successfully.",
      });

      if (editingProduct?._id === product._id) {
        resetForm();
      }

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete product.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // WORKSPACE REQUIRED
    // --------------------------------------------------------

    if (!formData.workspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace.",
      });

      return;
    }

    // --------------------------------------------------------
    // NAME REQUIRED
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter product name.",
      });

      return;
    }

    // --------------------------------------------------------
    // CODE REQUIRED
    // --------------------------------------------------------

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter product code.",
      });

      return;
    }

    // --------------------------------------------------------
    // TYPE REQUIRED
    // --------------------------------------------------------

    if (!formData.type) {
      showToast({
        type: "error",
        title: "Product Type Required",
        message: "Please select product type.",
      });

      return;
    }

    // --------------------------------------------------------
    // CATEGORY REQUIRED
    // --------------------------------------------------------

    if (!formData.categoryId) {
      showToast({
        type: "error",
        title: "Category Required",
        message: "Please select product category.",
      });

      return;
    }

    // --------------------------------------------------------
    // UNIT REQUIRED
    // --------------------------------------------------------

    if (!formData.unitId) {
      showToast({
        type: "error",
        title: "Unit Required",
        message: "Please select unit.",
      });

      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      workspaceId: formData.workspaceId,

      companyId: formData.companyId || null,

      code: formData.code.trim().toUpperCase(),

      name: formData.name.trim(),

      description: formData.description?.trim() || "",

      type: formData.type,

      categoryId: formData.categoryId,

      unitId: formData.unitId,

      hsnSacId: formData.hsnSacId || null,

      taxId: formData.taxId || null,

      sku: formData.sku?.trim().toUpperCase() || "",

      barcode: formData.barcode?.trim() || "",

      brand: formData.brand?.trim() || "",

      color: formData.color?.trim() || "",

      size: formData.size?.trim() || "",

      material: formData.material?.trim() || "",

      purchasePrice:
        formData.purchasePrice === "" ? 0 : Number(formData.purchasePrice),

      salesPrice: formData.salesPrice === "" ? 0 : Number(formData.salesPrice),

      mrp: formData.mrp === "" ? 0 : Number(formData.mrp),

      minimumSalesPrice:
        formData.minimumSalesPrice === ""
          ? 0
          : Number(formData.minimumSalesPrice),

      isPurchaseEnabled: formData.isPurchaseEnabled,

      isSalesEnabled: formData.isSalesEnabled,

      isStockItem: formData.isStockItem,

      trackBatch: formData.trackBatch,

      trackLot: formData.trackLot,

      trackSerialNumber: formData.trackSerialNumber,

      minimumStockLevel:
        formData.minimumStockLevel === ""
          ? 0
          : Number(formData.minimumStockLevel),

      maximumStockLevel:
        formData.maximumStockLevel === ""
          ? 0
          : Number(formData.maximumStockLevel),

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingProduct) {
      const result = await dispatch(
        updateProduct({
          id: editingProduct._id,
          data: payload,
        }),
      );

      if (updateProduct.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Product Updated",
          message: "Product updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update product.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createProduct(payload));

    if (createProduct.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Product Created",
        message: "Product created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create product.",
    });
  };

  // ==========================================================
  // WORKSPACE NAME
  // ==========================================================

  const getWorkspaceName = (workspaceId) => {
    if (!workspaceId) {
      return "-";
    }

    if (typeof workspaceId === "object") {
      return workspaceId?.name || workspaceId?.code || "-";
    }

    return (
      workspaces.find((workspace) => workspace._id === workspaceId)?.name ||
      workspaces.find((workspace) => workspace._id === workspaceId)?.code ||
      "-"
    );
  };

  // ==========================================================
  // CATEGORY NAME
  // ==========================================================

  const getCategoryName = (categoryId) => {
    if (!categoryId) {
      return "-";
    }

    if (typeof categoryId === "object") {
      return categoryId?.name || categoryId?.code || "-";
    }

    const category = productCategories.find((item) => item._id === categoryId);

    return category?.name || category?.code || "-";
  };

  // ==========================================================
  // UNIT NAME
  // ==========================================================

  const getUnitName = (unitId) => {
    if (!unitId) {
      return "-";
    }

    if (typeof unitId === "object") {
      return unitId?.name || unitId?.code || unitId?.symbol || "-";
    }

    const unit = units.find((item) => item._id === unitId);

    return unit?.name || unit?.code || unit?.symbol || "-";
  };

  // ==========================================================
  // HSN / SAC NAME
  // ==========================================================

  const getHsnSacName = (hsnSacId) => {
    if (!hsnSacId) {
      return "-";
    }

    if (typeof hsnSacId === "object") {
      return (
        hsnSacId?.code ||
        hsnSacId?.hsnCode ||
        hsnSacId?.sacCode ||
        hsnSacId?.name ||
        "-"
      );
    }

    const item = hsnSacs.find((hsnSac) => hsnSac._id === hsnSacId);

    return item?.code || item?.hsnCode || item?.sacCode || item?.name || "-";
  };

  // ==========================================================
  // TAX NAME
  // ==========================================================

  const getTaxName = (taxId) => {
    if (!taxId) {
      return "-";
    }

    if (typeof taxId === "object") {
      return taxId?.name || taxId?.code || "-";
    }

    const tax = taxes.find((item) => item._id === taxId);

    return tax?.name || tax?.code || "-";
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "code",
      label: "Code",
    },

    {
      key: "name",
      label: "Name",
    },

    {
      key: "type",
      label: "Type",

      render: (row) =>
        productTypeOptions.find((item) => item.value === row.type)?.label ||
        row.type ||
        "-",
    },

    {
      key: "categoryId",
      label: "Category",

      render: (row) => getCategoryName(row.categoryId),
    },

    {
      key: "unitId",
      label: "Unit",

      render: (row) => getUnitName(row.unitId),
    },

    {
      key: "sku",
      label: "SKU",

      render: (row) => row.sku || "-",
    },

    {
      key: "salesPrice",
      label: "Sales Price",

      render: (row) =>
        row.salesPrice !== undefined
          ? `₹${Number(row.salesPrice || 0).toFixed(2)}`
          : "-",
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
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title="Products"
        description="Manage products, services and inventory settings."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Product
          </Button>
        }
      />

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <Grid>
        <Select
          label="Workspace"
          name="selectedWorkspaceId"
          value={selectedWorkspaceId}
          onChange={(event) => setSelectedWorkspaceId(event.target.value)}
          options={[
            {
              value: "",
              label: "All Workspaces",
            },
            ...workspaceOptions,
          ]}
        />

        <Select
          label="Product Type"
          name="selectedProductType"
          value={selectedProductType}
          onChange={(event) => setSelectedProductType(event.target.value)}
          options={[
            {
              value: "",
              label: "All Types",
            },
            ...productTypeOptions,
          ]}
        />

        <Select
          label="Status"
          name="selectedStatus"
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
          options={[
            {
              value: "",
              label: "All Statuses",
            },
            ...statusOptions,
          ]}
        />
      </Grid>

      {/* ======================================================
          PRODUCT TABLE
      ====================================================== */}

      <Table
        title="Products"
        columns={columns}
        data={filteredProducts}
        rowKey="_id"
        emptyMessage="No products found."
        loading={status === "loading"}
        searchPlaceholder="Search products..."
      />

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? "Edit Product" : "Add Product"}
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

            <Button type="submit" form="product-form">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit}>
          <Grid>
            {/* ==================================================
                WORKSPACE
            ================================================== */}

            <Select
              label="Workspace"
              name="workspaceId"
              value={formData.workspaceId}
              onChange={handleChange}
              options={workspaceOptions}
            />

            {/* ==================================================
                COMPANY
            ================================================== */}

            <Input
              label="Company ID"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              placeholder="Optional company ID"
            />

            {/* ==================================================
                CODE
            ================================================== */}

            <Input
              label="Product Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter product code"
            />

            {/* ==================================================
                NAME
            ================================================== */}

            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />

            {/* ==================================================
                TYPE
            ================================================== */}

            <Select
              label="Product Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={productTypeOptions}
            />

            {/* ==================================================
                CATEGORY
            ================================================== */}

            <Select
              label="Product Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={categoryOptions}
            />

            {/* ==================================================
                UNIT
            ================================================== */}

            <Select
              label="Unit"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              options={unitOptions}
            />

            {/* ==================================================
                HSN / SAC
            ================================================== */}

            <Select
              label="HSN / SAC"
              name="hsnSacId"
              value={formData.hsnSacId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "No HSN / SAC",
                },
                ...hsnSacOptions,
              ]}
            />

            {/* ==================================================
                TAX
            ================================================== */}

            <Select
              label="Tax"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "No Tax",
                },
                ...taxOptions,
              ]}
            />

            {/* ==================================================
                SKU
            ================================================== */}

            <Input
              label="SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
            />

            {/* ==================================================
                BARCODE
            ================================================== */}

            <Input
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Enter barcode"
            />

            {/* ==================================================
                BRAND
            ================================================== */}

            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand"
            />

            {/* ==================================================
                COLOR
            ================================================== */}

            <Input
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter color"
            />

            {/* ==================================================
                SIZE
            ================================================== */}

            <Input
              label="Size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter size"
            />

            {/* ==================================================
                MATERIAL
            ================================================== */}

            <Input
              label="Material"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="Enter material"
            />

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />

            {/* ==================================================
                PURCHASE PRICE
            ================================================== */}

            <Input
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              value={formData.purchasePrice}
              onChange={handleChange}
              placeholder="Enter purchase price"
            />

            {/* ==================================================
                SALES PRICE
            ================================================== */}

            <Input
              label="Sales Price"
              name="salesPrice"
              type="number"
              value={formData.salesPrice}
              onChange={handleChange}
              placeholder="Enter sales price"
            />

            {/* ==================================================
                MRP
            ================================================== */}

            <Input
              label="MRP"
              name="mrp"
              type="number"
              value={formData.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
            />

            {/* ==================================================
                MINIMUM SALES PRICE
            ================================================== */}

            <Input
              label="Minimum Sales Price"
              name="minimumSalesPrice"
              type="number"
              value={formData.minimumSalesPrice}
              onChange={handleChange}
              placeholder="Enter minimum sales price"
            />

            {/* ==================================================
                PURCHASE ENABLED
            ================================================== */}

            <Select
              label="Purchase Enabled"
              name="isPurchaseEnabled"
              value={String(formData.isPurchaseEnabled)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  isPurchaseEnabled: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                SALES ENABLED
            ================================================== */}

            <Select
              label="Sales Enabled"
              name="isSalesEnabled"
              value={String(formData.isSalesEnabled)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  isSalesEnabled: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                STOCK ITEM
            ================================================== */}

            <Select
              label="Stock Item"
              name="isStockItem"
              value={String(formData.isStockItem)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  isStockItem: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                TRACK BATCH
            ================================================== */}

            <Select
              label="Track Batch"
              name="trackBatch"
              value={String(formData.trackBatch)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  trackBatch: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                TRACK LOT
            ================================================== */}

            <Select
              label="Track Lot"
              name="trackLot"
              value={String(formData.trackLot)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  trackLot: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                TRACK SERIAL NUMBER
            ================================================== */}

            <Select
              label="Track Serial Number"
              name="trackSerialNumber"
              value={String(formData.trackSerialNumber)}
              onChange={(event) =>
                setFormData((previous) => ({
                  ...previous,
                  trackSerialNumber: event.target.value === "true",
                }))
              }
              options={yesNoOptions}
            />

            {/* ==================================================
                MINIMUM STOCK LEVEL
            ================================================== */}

            <Input
              label="Minimum Stock Level"
              name="minimumStockLevel"
              type="number"
              value={formData.minimumStockLevel}
              onChange={handleChange}
              placeholder="Enter minimum stock level"
            />

            {/* ==================================================
                MAXIMUM STOCK LEVEL
            ================================================== */}

            <Input
              label="Maximum Stock Level"
              name="maximumStockLevel"
              type="number"
              value={formData.maximumStockLevel}
              onChange={handleChange}
              placeholder="Enter maximum stock level"
            />

            {/* ==================================================
                STATUS
            ================================================== */}

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

      {/* ======================================================
          VIEW PRODUCT MODAL
      ====================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
        title="View Product"
      >
        {selectedProduct && (
          <Grid columns={1}>
            {/* ==================================================
                WORKSPACE
            ================================================== */}

            <div>
              <strong>Workspace</strong>

              <div>{getWorkspaceName(selectedProduct.workspaceId)}</div>
            </div>

            {/* ==================================================
                CODE
            ================================================== */}

            <div>
              <strong>Product Code</strong>

              <div>{selectedProduct.code || "-"}</div>
            </div>

            {/* ==================================================
                NAME
            ================================================== */}

            <div>
              <strong>Product Name</strong>

              <div>{selectedProduct.name || "-"}</div>
            </div>

            {/* ==================================================
                TYPE
            ================================================== */}

            <div>
              <strong>Product Type</strong>

              <div>
                {productTypeOptions.find(
                  (item) => item.value === selectedProduct.type,
                )?.label ||
                  selectedProduct.type ||
                  "-"}
              </div>
            </div>

            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div>
              <strong>Category</strong>

              <div>{getCategoryName(selectedProduct.categoryId)}</div>
            </div>

            {/* ==================================================
                UNIT
            ================================================== */}

            <div>
              <strong>Unit</strong>

              <div>{getUnitName(selectedProduct.unitId)}</div>
            </div>

            {/* ==================================================
                HSN / SAC
            ================================================== */}

            <div>
              <strong>HSN / SAC</strong>

              <div>{getHsnSacName(selectedProduct.hsnSacId)}</div>
            </div>

            {/* ==================================================
                TAX
            ================================================== */}

            <div>
              <strong>Tax</strong>

              <div>{getTaxName(selectedProduct.taxId)}</div>
            </div>

            {/* ==================================================
                SKU
            ================================================== */}

            <div>
              <strong>SKU</strong>

              <div>{selectedProduct.sku || "-"}</div>
            </div>

            {/* ==================================================
                BARCODE
            ================================================== */}

            <div>
              <strong>Barcode</strong>

              <div>{selectedProduct.barcode || "-"}</div>
            </div>

            {/* ==================================================
                BRAND
            ================================================== */}

            <div>
              <strong>Brand</strong>

              <div>{selectedProduct.brand || "-"}</div>
            </div>

            {/* ==================================================
                COLOR
            ================================================== */}

            <div>
              <strong>Color</strong>

              <div>{selectedProduct.color || "-"}</div>
            </div>

            {/* ==================================================
                SIZE
            ================================================== */}

            <div>
              <strong>Size</strong>

              <div>{selectedProduct.size || "-"}</div>
            </div>

            {/* ==================================================
                MATERIAL
            ================================================== */}

            <div>
              <strong>Material</strong>

              <div>{selectedProduct.material || "-"}</div>
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div>
              <strong>Description</strong>

              <div>{selectedProduct.description || "-"}</div>
            </div>

            {/* ==================================================
                PURCHASE PRICE
            ================================================== */}

            <div>
              <strong>Purchase Price</strong>

              <div>
                ₹{Number(selectedProduct.purchasePrice || 0).toFixed(2)}
              </div>
            </div>

            {/* ==================================================
                SALES PRICE
            ================================================== */}

            <div>
              <strong>Sales Price</strong>

              <div>₹{Number(selectedProduct.salesPrice || 0).toFixed(2)}</div>
            </div>

            {/* ==================================================
                MRP
            ================================================== */}

            <div>
              <strong>MRP</strong>

              <div>₹{Number(selectedProduct.mrp || 0).toFixed(2)}</div>
            </div>

            {/* ==================================================
                STOCK ITEM
            ================================================== */}

            <div>
              <strong>Stock Item</strong>

              <div>{selectedProduct.isStockItem ? "Yes" : "No"}</div>
            </div>

            {/* ==================================================
                BATCH
            ================================================== */}

            <div>
              <strong>Track Batch</strong>

              <div>{selectedProduct.trackBatch ? "Yes" : "No"}</div>
            </div>

            {/* ==================================================
                LOT
            ================================================== */}

            <div>
              <strong>Track Lot</strong>

              <div>{selectedProduct.trackLot ? "Yes" : "No"}</div>
            </div>

            {/* ==================================================
                SERIAL NUMBER
            ================================================== */}

            <div>
              <strong>Track Serial Number</strong>

              <div>{selectedProduct.trackSerialNumber ? "Yes" : "No"}</div>
            </div>

            {/* ==================================================
                STATUS
            ================================================== */}

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedProduct.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default ProductPage;
