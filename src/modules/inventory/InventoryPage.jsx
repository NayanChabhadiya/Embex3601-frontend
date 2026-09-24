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
  createInventory,
  getInventories,
  updateInventory,
  deleteInventory,
} from "./store/inventory.thunks.js";

import {
  selectInventories,
  selectInventoryStatus,
} from "./store/inventory.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

import { fetchCompanies } from "../company/store/company.thunks.js";
import { selectCompanies } from "../company/store/company.selectors.js";

import { fetchBranches } from "../branch/store/branch.thunks.js";
import { selectBranches } from "../branch/store/branch.selectors.js";

import { fetchWarehouses } from "../warehouse/store/warehouse.thunks.js";
import { selectWarehouses } from "../warehouse/store/warehouse.selectors.js";

import { getProducts } from "../product/store/product.thunks.js";
import { selectProducts } from "../product/store/product.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  warehouseId: "",
  productId: "",

  openingQuantity: "",
  quantity: "",
  reservedQuantity: "",
  availableQuantity: "",

  openingRate: "",
  averageRate: "",
  stockValue: "",

  batchId: "",
  lotId: "",
  serialNumberId: "",

  status: "ACTIVE",
};

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
// ID NORMALIZER
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
// PAGE
// ============================================================

function InventoryPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // INVENTORY
  // ==========================================================

  const inventories = useSelector(selectInventories);

  const inventoryStatus = useSelector(selectInventoryStatus);

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
  // ACTIVE WORKSPACE ID
  // ==========================================================

  const activeWorkspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING INVENTORY
  // ==========================================================

  const [selectedInventory, setSelectedInventory] = useState(null);

  const [editingInventory, setEditingInventory] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  // ==========================================================
  // SELECTED FORM COMPANY
  // ==========================================================

  const selectedFormCompanyId = getId(formData.companyId);

  // ==========================================================
  // FETCH MASTER DATA
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(fetchCompanies(activeWorkspaceId));

    /*
     * Branch API works with companyId.
     *
     * Therefore we do NOT call:
     * fetchBranches(activeWorkspaceId)
     */
    dispatch(fetchWarehouses());

    dispatch(getProducts());

    /*
     * Inventory API currently does not require
     * workspaceId as query parameter.
     *
     * Workspace filtering is handled below
     * through company relationship.
     */
    dispatch(getInventories());
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // FETCH BRANCHES WHEN COMPANY CHANGES
  // ==========================================================

  useEffect(() => {
    if (!selectedFormCompanyId) {
      return;
    }

    dispatch(fetchBranches(selectedFormCompanyId));
  }, [dispatch, selectedFormCompanyId]);

  // ==========================================================
  // RESET FILTERS ON WORKSPACE CHANGE
  // ==========================================================

  useEffect(() => {
    setSelectedCompanyId("");
    setSelectedWarehouseId("");
    setSelectedProductId("");
    setSelectedStatus("");
  }, [activeWorkspaceId]);

  // ==========================================================
  // WORKSPACE COMPANIES
  // ==========================================================

  const workspaceCompanies = useMemo(() => {
    if (!activeWorkspaceId) {
      return [];
    }

    return companies.filter((company) => {
      const companyWorkspaceId = getId(
        company.workspaceId?._id || company.workspaceId,
      );

      return companyWorkspaceId === activeWorkspaceId;
    });
  }, [companies, activeWorkspaceId]);

  // ==========================================================
  // WORKSPACE PRODUCTS
  // ==========================================================

  const workspaceProducts = useMemo(() => {
    if (!activeWorkspaceId) {
      return [];
    }

    return products.filter((product) => {
      const productWorkspaceId = getId(
        product.workspaceId?._id || product.workspaceId,
      );

      return productWorkspaceId === activeWorkspaceId;
    });
  }, [products, activeWorkspaceId]);

  // ==========================================================
  // WORKSPACE COMPANY IDS
  // ==========================================================

  const workspaceCompanyIds = useMemo(() => {
    return new Set(workspaceCompanies.map((company) => getId(company._id)));
  }, [workspaceCompanies]);

  // ==========================================================
  // WORKSPACE WAREHOUSES
  // ==========================================================

  const workspaceWarehouses = useMemo(() => {
    if (!activeWorkspaceId) {
      return [];
    }

    return warehouses.filter((warehouse) => {
      const warehouseCompanyId = getId(
        warehouse.companyId || warehouse.company,
      );

      return workspaceCompanyIds.has(warehouseCompanyId);
    });
  }, [warehouses, activeWorkspaceId, workspaceCompanyIds]);

  // ==========================================================
  // FORM BRANCHES
  // ==========================================================

  const filteredBranches = useMemo(() => {
    if (!selectedFormCompanyId) {
      return [];
    }

    return branches.filter((branch) => {
      const branchCompanyId = getId(branch.companyId || branch.company);

      return branchCompanyId === selectedFormCompanyId;
    });
  }, [branches, selectedFormCompanyId]);

  // ==========================================================
  // FORM WAREHOUSES
  // ==========================================================

  const filteredWarehouses = useMemo(() => {
    if (!selectedFormCompanyId) {
      return [];
    }

    return workspaceWarehouses.filter((warehouse) => {
      const warehouseCompanyId = getId(
        warehouse.companyId || warehouse.company,
      );

      return warehouseCompanyId === selectedFormCompanyId;
    });
  }, [workspaceWarehouses, selectedFormCompanyId]);

  // ==========================================================
  // FILTERED INVENTORIES
  // ==========================================================

  const filteredInventories = useMemo(() => {
    return inventories.filter((inventory) => {
      const companyId = getId(inventory.companyId?._id || inventory.companyId);

      const warehouseId = getId(
        inventory.warehouseId?._id || inventory.warehouseId,
      );

      const productId = getId(inventory.productId?._id || inventory.productId);

      const workspaceMatch = workspaceCompanyIds.has(companyId);

      const companyMatch =
        !selectedCompanyId || companyId === selectedCompanyId;

      const warehouseMatch =
        !selectedWarehouseId || warehouseId === selectedWarehouseId;

      const productMatch =
        !selectedProductId || productId === selectedProductId;

      const statusMatch =
        !selectedStatus || inventory.status === selectedStatus;

      return (
        workspaceMatch &&
        companyMatch &&
        warehouseMatch &&
        productMatch &&
        statusMatch
      );
    });
  }, [
    inventories,
    workspaceCompanyIds,
    selectedCompanyId,
    selectedWarehouseId,
    selectedProductId,
    selectedStatus,
  ]);

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
    return filteredBranches.map((branch) => ({
      value: getId(branch._id),
      label: branch.name || branch.code || getId(branch._id),
    }));
  }, [filteredBranches]);

  // ==========================================================
  // WAREHOUSE OPTIONS
  // ==========================================================

  const warehouseOptions = useMemo(() => {
    return filteredWarehouses.map((warehouse) => ({
      value: getId(warehouse._id),
      label: warehouse.name || warehouse.code || getId(warehouse._id),
    }));
  }, [filteredWarehouses]);

  // ==========================================================
  // FILTER WAREHOUSE OPTIONS
  // ==========================================================

  const inventoryFilterWarehouseOptions = useMemo(() => {
    const filtered = selectedCompanyId
      ? workspaceWarehouses.filter((warehouse) => {
          const warehouseCompanyId = getId(
            warehouse.companyId || warehouse.company,
          );

          return warehouseCompanyId === selectedCompanyId;
        })
      : workspaceWarehouses;

    return filtered.map((warehouse) => ({
      value: getId(warehouse._id),
      label: warehouse.name || warehouse.code || getId(warehouse._id),
    }));
  }, [workspaceWarehouses, selectedCompanyId]);

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
    });

    setEditingInventory(null);
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

    setEditingInventory(null);

    /*
     * Keep current table filters as
     * initial values for the form.
     */
    setFormData({
      ...initialFormData,

      companyId: selectedCompanyId || "",

      warehouseId: selectedWarehouseId || "",

      productId: selectedProductId || "",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (inventory) => {
    setSelectedInventory(inventory);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (inventory) => {
    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    const companyId = getId(inventory.companyId?._id || inventory.companyId);

    const branchId = getId(inventory.branchId?._id || inventory.branchId);

    const warehouseId = getId(
      inventory.warehouseId?._id || inventory.warehouseId,
    );

    const productId = getId(inventory.productId?._id || inventory.productId);

    setEditingInventory(inventory);

    setFormData({
      companyId,

      branchId,

      warehouseId,

      productId,

      openingQuantity: inventory.openingQuantity ?? "",

      quantity: inventory.quantity ?? "",

      reservedQuantity: inventory.reservedQuantity ?? "",

      availableQuantity: inventory.availableQuantity ?? "",

      openingRate: inventory.openingRate ?? "",

      averageRate: inventory.averageRate ?? "",

      stockValue: inventory.stockValue ?? "",

      batchId: getId(inventory.batchId?._id || inventory.batchId),

      lotId: getId(inventory.lotId?._id || inventory.lotId),

      serialNumberId: getId(
        inventory.serialNumberId?._id || inventory.serialNumberId,
      ),

      status: inventory.status || "ACTIVE",
    });

    setSelectedCompanyId(companyId);

    setSelectedWarehouseId(warehouseId);

    setSelectedProductId(productId);

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (inventory) => {
    const result = await dispatch(deleteInventory(inventory._id));

    if (deleteInventory.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Inventory Deleted",
        message: "Inventory deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete inventory.",
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
    // VERIFY COMPANY
    // --------------------------------------------------------

    const selectedCompany = workspaceCompanies.find(
      (company) => getId(company._id) === getId(formData.companyId),
    );

    if (!selectedCompany) {
      showToast({
        type: "error",
        title: "Invalid Company",
        message: "Selected company does not belong to the active workspace.",
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
    // VERIFY WAREHOUSE
    // --------------------------------------------------------

    const selectedWarehouse = filteredWarehouses.find(
      (warehouse) => getId(warehouse._id) === getId(formData.warehouseId),
    );

    if (!selectedWarehouse) {
      showToast({
        type: "error",
        title: "Invalid Warehouse",
        message: "Selected warehouse does not belong to the selected company.",
      });

      return;
    }

    // --------------------------------------------------------
    // PRODUCT
    // --------------------------------------------------------

    if (!formData.productId) {
      showToast({
        type: "error",
        title: "Product Required",
        message: "Please select a product.",
      });

      return;
    }

    // --------------------------------------------------------
    // VERIFY PRODUCT
    // --------------------------------------------------------

    const selectedProduct = workspaceProducts.find(
      (product) => getId(product._id) === getId(formData.productId),
    );

    if (!selectedProduct) {
      showToast({
        type: "error",
        title: "Invalid Product",
        message: "Selected product does not belong to the active workspace.",
      });

      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      companyId: getId(formData.companyId),

      branchId: getId(formData.branchId) || null,

      warehouseId: getId(formData.warehouseId),

      productId: getId(formData.productId),

      openingQuantity:
        formData.openingQuantity === "" ? 0 : Number(formData.openingQuantity),

      quantity: formData.quantity === "" ? 0 : Number(formData.quantity),

      reservedQuantity:
        formData.reservedQuantity === ""
          ? 0
          : Number(formData.reservedQuantity),

      availableQuantity:
        formData.availableQuantity === ""
          ? 0
          : Number(formData.availableQuantity),

      openingRate:
        formData.openingRate === "" ? 0 : Number(formData.openingRate),

      averageRate:
        formData.averageRate === "" ? 0 : Number(formData.averageRate),

      stockValue: formData.stockValue === "" ? 0 : Number(formData.stockValue),

      batchId: getId(formData.batchId) || null,

      lotId: getId(formData.lotId) || null,

      serialNumberId: getId(formData.serialNumberId) || null,

      status: formData.status || "ACTIVE",
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingInventory) {
      const result = await dispatch(
        updateInventory({
          id: editingInventory._id,
          data: payload,
        }),
      );

      if (updateInventory.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Inventory Updated",
          message: "Inventory updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update inventory.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createInventory(payload));

    if (createInventory.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Inventory Created",
        message: "Inventory created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create inventory.",
    });
  };

  // ==========================================================
  // COMPANY NAME
  // ==========================================================

  const getCompanyName = (inventory) => {
    if (inventory.companyId?.name) {
      return inventory.companyId.name;
    }

    const companyId = getId(inventory.companyId?._id || inventory.companyId);

    return (
      workspaceCompanies.find((company) => getId(company._id) === companyId)
        ?.name || "-"
    );
  };

  // ==========================================================
  // BRANCH NAME
  // ==========================================================

  const getBranchName = (inventory) => {
    if (inventory.branchId?.name) {
      return inventory.branchId.name;
    }

    const branchId = getId(inventory.branchId?._id || inventory.branchId);

    return (
      branches.find((branch) => getId(branch._id) === branchId)?.name || "-"
    );
  };

  // ==========================================================
  // WAREHOUSE NAME
  // ==========================================================

  const getWarehouseName = (inventory) => {
    if (inventory.warehouseId?.name) {
      return inventory.warehouseId.name;
    }

    const warehouseId = getId(
      inventory.warehouseId?._id || inventory.warehouseId,
    );

    return (
      warehouses.find((warehouse) => getId(warehouse._id) === warehouseId)
        ?.name || "-"
    );
  };

  // ==========================================================
  // PRODUCT NAME
  // ==========================================================

  const getProductName = (inventory) => {
    if (inventory.productId?.name) {
      return inventory.productId.name;
    }

    const productId = getId(inventory.productId?._id || inventory.productId);

    return (
      products.find((product) => getId(product._id) === productId)?.name || "-"
    );
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
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
      key: "warehouseId",
      label: "Warehouse",

      render: (row) => getWarehouseName(row),
    },

    {
      key: "productId",
      label: "Product",

      render: (row) => getProductName(row),
    },

    {
      key: "openingQuantity",
      label: "Opening",

      render: (row) => row.openingQuantity ?? 0,
    },

    {
      key: "quantity",
      label: "Quantity",

      render: (row) => row.quantity ?? 0,
    },

    {
      key: "reservedQuantity",
      label: "Reserved",

      render: (row) => row.reservedQuantity ?? 0,
    },

    {
      key: "availableQuantity",
      label: "Available",

      render: (row) => row.availableQuantity ?? 0,
    },

    {
      key: "stockValue",
      label: "Stock Value",

      render: (row) => `₹${Number(row.stockValue || 0).toFixed(2)}`,
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
        title="Inventory"
        description="Manage opening stock and inventory records."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Inventory
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
          onChange={(event) => {
            const value = event.target.value;

            setSelectedCompanyId(value);

            setSelectedWarehouseId("");
          }}
          options={[
            {
              value: "",
              label: "All Companies",
            },

            ...companyOptions,
          ]}
        />

        {/* WAREHOUSE FILTER */}

        <Select
          label="Warehouse"
          name="selectedWarehouseId"
          value={selectedWarehouseId}
          onChange={(event) => setSelectedWarehouseId(event.target.value)}
          options={[
            {
              value: "",
              label: "All Warehouses",
            },

            ...inventoryFilterWarehouseOptions,
          ]}
        />

        {/* PRODUCT FILTER */}

        <Select
          label="Product"
          name="selectedProductId"
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
          options={[
            {
              value: "",
              label: "All Products",
            },

            ...productOptions,
          ]}
        />

        {/* STATUS FILTER */}

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

      {/* ====================================================
          INVENTORY TABLE
      ==================================================== */}

      <Table
        title="Inventory"
        columns={columns}
        data={filteredInventories}
        rowKey="_id"
        emptyMessage="No inventory records found."
        loading={inventoryStatus === "loading"}
        searchPlaceholder="Search inventory..."
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
        title={editingInventory ? "Edit Inventory" : "Add Inventory"}
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

            <Button type="submit" form="inventory-form">
              {editingInventory ? "Update Inventory" : "Create Inventory"}
            </Button>
          </>
        }
      >
        <form id="inventory-form" onSubmit={handleSubmit}>
          <Grid>
            {/* =================================================
                COMPANY
            ================================================= */}

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

            {/* =================================================
                BRANCH
            ================================================= */}

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
                    : filteredBranches.length > 0
                      ? "Select Branch"
                      : "No Branch Found",
                },

                ...branchOptions,
              ]}
            />

            {/* =================================================
                WAREHOUSE
            ================================================= */}

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
                    : filteredWarehouses.length > 0
                      ? "Select Warehouse"
                      : "No Warehouse Found",
                },

                ...warehouseOptions,
              ]}
            />

            {/* =================================================
                PRODUCT
            ================================================= */}

            <Select
              label="Product"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Product",
                },

                ...productOptions,
              ]}
            />

            {/* =================================================
                OPENING QUANTITY
            ================================================= */}

            <Input
              label="Opening Quantity"
              name="openingQuantity"
              type="number"
              value={formData.openingQuantity}
              onChange={handleChange}
              placeholder="Enter opening quantity"
            />

            {/* =================================================
                QUANTITY
            ================================================= */}

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
            />

            {/* =================================================
                RESERVED QUANTITY
            ================================================= */}

            <Input
              label="Reserved Quantity"
              name="reservedQuantity"
              type="number"
              value={formData.reservedQuantity}
              onChange={handleChange}
              placeholder="Enter reserved quantity"
            />

            {/* =================================================
                AVAILABLE QUANTITY
            ================================================= */}

            <Input
              label="Available Quantity"
              name="availableQuantity"
              type="number"
              value={formData.availableQuantity}
              onChange={handleChange}
              placeholder="Enter available quantity"
            />

            {/* =================================================
                OPENING RATE
            ================================================= */}

            <Input
              label="Opening Rate"
              name="openingRate"
              type="number"
              value={formData.openingRate}
              onChange={handleChange}
              placeholder="Enter opening rate"
            />

            {/* =================================================
                AVERAGE RATE
            ================================================= */}

            <Input
              label="Average Rate"
              name="averageRate"
              type="number"
              value={formData.averageRate}
              onChange={handleChange}
              placeholder="Enter average rate"
            />

            {/* =================================================
                STOCK VALUE
            ================================================= */}

            <Input
              label="Stock Value"
              name="stockValue"
              type="number"
              value={formData.stockValue}
              onChange={handleChange}
              placeholder="Enter stock value"
            />

            {/* =================================================
                BATCH
            ================================================= */}

            <Input
              label="Batch ID"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              placeholder="Optional Batch ID"
            />

            {/* =================================================
                LOT
            ================================================= */}

            <Input
              label="Lot ID"
              name="lotId"
              value={formData.lotId}
              onChange={handleChange}
              placeholder="Optional Lot ID"
            />

            {/* =================================================
                SERIAL NUMBER
            ================================================= */}

            <Input
              label="Serial Number ID"
              name="serialNumberId"
              value={formData.serialNumberId}
              onChange={handleChange}
              placeholder="Optional Serial Number ID"
            />

            {/* =================================================
                STATUS
            ================================================= */}

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
          VIEW INVENTORY MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedInventory(null);
        }}
        title="View Inventory"
      >
        {selectedInventory && (
          <Grid columns={1}>
            {/* COMPANY */}

            <div>
              <strong>Company</strong>

              <div>{getCompanyName(selectedInventory)}</div>
            </div>

            {/* BRANCH */}

            <div>
              <strong>Branch</strong>

              <div>{getBranchName(selectedInventory)}</div>
            </div>

            {/* WAREHOUSE */}

            <div>
              <strong>Warehouse</strong>

              <div>{getWarehouseName(selectedInventory)}</div>
            </div>

            {/* PRODUCT */}

            <div>
              <strong>Product</strong>

              <div>{getProductName(selectedInventory)}</div>
            </div>

            {/* OPENING QUANTITY */}

            <div>
              <strong>Opening Quantity</strong>

              <div>{selectedInventory.openingQuantity ?? 0}</div>
            </div>

            {/* QUANTITY */}

            <div>
              <strong>Quantity</strong>

              <div>{selectedInventory.quantity ?? 0}</div>
            </div>

            {/* RESERVED QUANTITY */}

            <div>
              <strong>Reserved Quantity</strong>

              <div>{selectedInventory.reservedQuantity ?? 0}</div>
            </div>

            {/* AVAILABLE QUANTITY */}

            <div>
              <strong>Available Quantity</strong>

              <div>{selectedInventory.availableQuantity ?? 0}</div>
            </div>

            {/* OPENING RATE */}

            <div>
              <strong>Opening Rate</strong>

              <div>
                ₹{Number(selectedInventory.openingRate || 0).toFixed(2)}
              </div>
            </div>

            {/* AVERAGE RATE */}

            <div>
              <strong>Average Rate</strong>

              <div>
                ₹{Number(selectedInventory.averageRate || 0).toFixed(2)}
              </div>
            </div>

            {/* STOCK VALUE */}

            <div>
              <strong>Stock Value</strong>

              <div>₹{Number(selectedInventory.stockValue || 0).toFixed(2)}</div>
            </div>

            {/* BATCH */}

            <div>
              <strong>Batch ID</strong>

              <div>
                {getId(
                  selectedInventory.batchId?._id || selectedInventory.batchId,
                ) || "-"}
              </div>
            </div>

            {/* LOT */}

            <div>
              <strong>Lot ID</strong>

              <div>
                {getId(
                  selectedInventory.lotId?._id || selectedInventory.lotId,
                ) || "-"}
              </div>
            </div>

            {/* SERIAL NUMBER */}

            <div>
              <strong>Serial Number ID</strong>

              <div>
                {getId(
                  selectedInventory.serialNumberId?._id ||
                    selectedInventory.serialNumberId,
                ) || "-"}
              </div>
            </div>

            {/* STATUS */}

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedInventory.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default InventoryPage;
