import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

// ============================================================
// COMMON COMPONENTS
// ============================================================

import PageHeader from "../../components/layout/page/components/PageHeader.jsx";
import Table from "../../components/common/table/Table.jsx";
import Modal from "../../components/common/modal/Modal.jsx";
import Grid from "../../components/common/grid/Grid.jsx";
import Badge from "../../components/common/badge/Badge.jsx";

import {
  Input,
  Select,
  Textarea,
  Checkbox,
} from "../../components/common/form/index.js";

import { Button } from "../../components/common/index.js";

import { DeleteIcon, EditIcon, ViewIcon } from "../../components/common/icons";

import { useToast } from "../../components/common/toast/ToastProvider.jsx";

// ============================================================
// ITEM THUNKS
// ============================================================

import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "./store/item.thunks.js";

// ============================================================
// ITEM SELECTORS
// ============================================================

import { selectItems, selectItemStatus } from "./store/item.selectors.js";

// ============================================================
// RELATED MODULE SELECTORS
// ============================================================

import { selectProductCategories } from "../product-category/store/product-category.selectors.js";

import { selectHsnSacList } from "../hsn-sac/store/hsn-sac.selectors.js";

import { selectUnits } from "../unit/store/unit.selectors.js";

import { selectTaxes } from "../tax/store/tax.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  name: "",
  code: "",
  description: "",
  itemType: "PRODUCT",
  productCategoryId: "",
  hsnSacId: "",
  unitId: "",
  taxId: "",
  status: "ACTIVE",
  trackInventory: true,
  openingStock: 0,
  openingStockRate: 0,
  purchaseEnabled: true,
  salesEnabled: true,
};

// ============================================================
// PAGE
// ============================================================

function ItemPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // ITEM REDUX STATE
  // ==========================================================

  const items = useSelector(selectItems);

  const status = useSelector(selectItemStatus);

  // ==========================================================
  // RELATED MASTER DATA
  // ==========================================================

  const productCategories = useSelector(selectProductCategories);

  const hsnSacs = useSelector(selectHsnSacList);

  const units = useSelector(selectUnits);

  const taxes = useSelector(selectTaxes);

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING ITEM
  // ==========================================================

  const [selectedItem, setSelectedItem] = useState(null);

  const [editingItem, setEditingItem] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH ITEMS
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchItems(selectedWorkspace._id));
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
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingItem(null);
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

  const handleView = (item) => {
    setSelectedItem(item);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (item) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingItem(item);

    setFormData({
      name: item.name || "",
      code: item.code || "",
      description: item.description || "",
      itemType: item.itemType || "PRODUCT",
      productCategoryId:
        item.productCategoryId?._id || item.productCategoryId || "",
      hsnSacId: item.hsnSacId?._id || item.hsnSacId || "",
      unitId: item.unitId?._id || item.unitId || "",
      taxId: item.taxId?._id || item.taxId || "",
      status: item.status || "ACTIVE",
      trackInventory: item.trackInventory ?? true,
      openingStock: item.openingStock ?? 0,
      openingStockRate: item.openingStockRate ?? 0,
      purchaseEnabled: item.purchaseEnabled ?? true,
      salesEnabled: item.salesEnabled ?? true,
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (item) => {
    const result = await dispatch(deleteItem(item._id));

    if (deleteItem.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Item Deleted",
        message: "Item deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete item.",
    });
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // --------------------------------------------------------
    // Workspace Required
    // --------------------------------------------------------

    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    // --------------------------------------------------------
    // Basic Validation
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter item name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter item code.",
      });

      return;
    }

    if (!formData.itemType) {
      showToast({
        type: "error",
        title: "Item Type Required",
        message: "Please select item type.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      description: formData.description?.trim() || "",

      itemType: formData.itemType,

      productCategoryId: formData.productCategoryId || null,

      hsnSacId: formData.hsnSacId || null,

      unitId: formData.unitId || null,

      taxId: formData.taxId || null,

      status: formData.status,

      trackInventory: Boolean(formData.trackInventory),

      openingStock: Number(formData.openingStock) || 0,

      openingStockRate: Number(formData.openingStockRate) || 0,

      purchaseEnabled: Boolean(formData.purchaseEnabled),

      salesEnabled: Boolean(formData.salesEnabled),
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingItem) {
      const result = await dispatch(
        updateItem({
          id: editingItem._id,
          payload,
        }),
      );

      if (updateItem.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Item Updated",
          message: "Item updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update item.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createItem(payload));

    if (createItem.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Item Created",
        message: "Item created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create item.",
    });
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "name",
      label: "Name",
    },

    {
      key: "code",
      label: "Code",
    },

    {
      key: "itemType",
      label: "Type",

      render: (row) => row.itemType || "-",
    },

    {
      key: "productCategoryId",
      label: "Category",

      render: (row) =>
        row.productCategoryId?.name ||
        productCategories.find(
          (category) => category._id === row.productCategoryId,
        )?.name ||
        "-",
    },

    {
      key: "unitId",
      label: "Unit",

      render: (row) =>
        row.unitId?.name ||
        units.find((unit) => unit._id === row.unitId)?.name ||
        "-",
    },

    {
      key: "taxId",
      label: "Tax",

      render: (row) =>
        row.taxId?.name ||
        taxes.find((tax) => tax._id === row.taxId)?.name ||
        "-",
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
        title="Items"
        description="Manage workspace items."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Item
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
          ITEM TABLE
      ==================================================== */}

      <Table
        title="Items"
        columns={columns}
        data={items}
        rowKey="_id"
        emptyMessage="No items found."
        loading={status === "loading"}
        searchPlaceholder="Search items..."
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
        title={editingItem ? "Edit Item" : "Add Item"}
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

            <Button type="submit" form="item-form">
              {editingItem ? "Update Item" : "Create Item"}
            </Button>
          </>
        }
      >
        <form id="item-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter item code"
            />

            <Select
              label="Item Type"
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              options={[
                {
                  value: "PRODUCT",
                  label: "Product",
                },
                {
                  value: "SERVICE",
                  label: "Service",
                },
                {
                  value: "RAW_MATERIAL",
                  label: "Raw Material",
                },
                {
                  value: "FINISHED_GOOD",
                  label: "Finished Good",
                },
                {
                  value: "SEMI_FINISHED",
                  label: "Semi Finished",
                },
                {
                  value: "CONSUMABLE",
                  label: "Consumable",
                },
                {
                  value: "ASSET",
                  label: "Asset",
                },
              ]}
            />

            <Select
              label="Product Category"
              name="productCategoryId"
              value={formData.productCategoryId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Product Category",
                },
                ...productCategories.map((category) => ({
                  value: category._id,
                  label: category.name || category.code || "-",
                })),
              ]}
            />

            <Select
              label="HSN / SAC"
              name="hsnSacId"
              value={formData.hsnSacId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select HSN / SAC",
                },
                ...hsnSacs.map((hsnSac) => ({
                  value: hsnSac._id,
                  label: hsnSac.code || hsnSac.name || "-",
                })),
              ]}
            />

            <Select
              label="Unit"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Unit",
                },
                ...units.map((unit) => ({
                  value: unit._id,
                  label: unit.name || unit.code || "-",
                })),
              ]}
            />

            <Select
              label="Tax"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Tax",
                },
                ...taxes.map((tax) => ({
                  value: tax._id,
                  label: tax.name || tax.code || "-",
                })),
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

            <Input
              label="Opening Stock"
              name="openingStock"
              type="number"
              min="0"
              value={formData.openingStock}
              onChange={handleChange}
              placeholder="Enter opening stock"
            />

            <Input
              label="Opening Stock Rate"
              name="openingStockRate"
              type="number"
              min="0"
              value={formData.openingStockRate}
              onChange={handleChange}
              placeholder="Enter opening stock rate"
            />

            <Checkbox
              label="Track Inventory"
              name="trackInventory"
              checked={formData.trackInventory}
              onChange={handleChange}
            />

            <Checkbox
              label="Purchase Enabled"
              name="purchaseEnabled"
              checked={formData.purchaseEnabled}
              onChange={handleChange}
            />

            <Checkbox
              label="Sales Enabled"
              name="salesEnabled"
              checked={formData.salesEnabled}
              onChange={handleChange}
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW ITEM MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedItem(null);
        }}
        title="View Item"
      >
        {selectedItem && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>

              <div>{selectedItem.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedItem.code || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedItem.description || "-"}</div>
            </div>

            <div>
              <strong>Item Type</strong>

              <div>{selectedItem.itemType || "-"}</div>
            </div>

            <div>
              <strong>Product Category</strong>

              <div>
                {selectedItem.productCategoryId?.name ||
                  productCategories.find(
                    (category) =>
                      category._id === selectedItem.productCategoryId,
                  )?.name ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>HSN / SAC</strong>

              <div>
                {selectedItem.hsnSacId?.code ||
                  selectedItem.hsnSacId?.name ||
                  hsnSacs.find((hsnSac) => hsnSac._id === selectedItem.hsnSacId)
                    ?.code ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Unit</strong>

              <div>
                {selectedItem.unitId?.name ||
                  units.find((unit) => unit._id === selectedItem.unitId)
                    ?.name ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Tax</strong>

              <div>
                {selectedItem.taxId?.name ||
                  selectedItem.taxId?.code ||
                  taxes.find((tax) => tax._id === selectedItem.taxId)?.name ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedItem.status || "-"}</Badge>
              </div>
            </div>

            <div>
              <strong>Track Inventory</strong>

              <div>{selectedItem.trackInventory ? "Yes" : "No"}</div>
            </div>

            <div>
              <strong>Opening Stock</strong>

              <div>{selectedItem.openingStock ?? 0}</div>
            </div>

            <div>
              <strong>Opening Stock Rate</strong>

              <div>{selectedItem.openingStockRate ?? 0}</div>
            </div>

            <div>
              <strong>Purchase Enabled</strong>

              <div>{selectedItem.purchaseEnabled ? "Yes" : "No"}</div>
            </div>

            <div>
              <strong>Sales Enabled</strong>

              <div>{selectedItem.salesEnabled ? "Yes" : "No"}</div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default ItemPage;
