import { useEffect, useState } from "react";

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
  fetchProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "./store/product-category.thunks.js";

import {
  selectProductCategories,
  selectProductCategoryStatus,
} from "./store/product-category.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  name: "",
  code: "",
  description: "",
  status: "ACTIVE",
};

// ============================================================
// PAGE
// ============================================================

function ProductCategoryPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // PRODUCT CATEGORY REDUX STATE
  // ==========================================================

  const productCategories = useSelector(selectProductCategories);

  const status = useSelector(selectProductCategoryStatus);

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
  // SELECTED / EDITING PRODUCT CATEGORY
  // ==========================================================

  const [selectedProductCategory, setSelectedProductCategory] = useState(null);

  const [editingProductCategory, setEditingProductCategory] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH PRODUCT CATEGORIES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(fetchProductCategories(selectedWorkspace._id));
  }, [dispatch, selectedWorkspace?._id]);

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
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingProductCategory(null);
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

  const handleView = (productCategory) => {
    setSelectedProductCategory(productCategory);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (productCategory) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingProductCategory(productCategory);

    setFormData({
      name: productCategory.name || "",
      code: productCategory.code || "",
      description: productCategory.description || "",
      status: productCategory.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (productCategory) => {
    const result = await dispatch(deleteProductCategory(productCategory._id));

    if (deleteProductCategory.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Product Category Deleted",
        message: "Product category deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete product category.",
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
        message: "Please enter product category name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter product category code.",
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

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingProductCategory) {
      const result = await dispatch(
        updateProductCategory({
          id: editingProductCategory._id,
          payload,
        }),
      );

      if (updateProductCategory.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Product Category Updated",
          message: "Product category updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update product category.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createProductCategory(payload));

    if (createProductCategory.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Product Category Created",
        message: "Product category created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create product category.",
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
      key: "description",
      label: "Description",

      render: (row) => row.description || "-",
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
        title="Product Categories"
        description="Manage workspace product categories."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Product Category
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
          PRODUCT CATEGORY TABLE
      ==================================================== */}

      <Table
        title="Product Categories"
        columns={columns}
        data={productCategories}
        rowKey="_id"
        emptyMessage="No product categories found."
        loading={status === "loading"}
        searchPlaceholder="Search product categories..."
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
          editingProductCategory
            ? "Edit Product Category"
            : "Add Product Category"
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

            <Button type="submit" form="product-category-form">
              {editingProductCategory
                ? "Update Product Category"
                : "Create Product Category"}
            </Button>
          </>
        }
      >
        <form id="product-category-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product category name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter product category code"
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product category description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW PRODUCT CATEGORY MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedProductCategory(null);
        }}
        title="View Product Category"
      >
        {selectedProductCategory && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>

              <div>{selectedProductCategory.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedProductCategory.code || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedProductCategory.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedProductCategory.status}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default ProductCategoryPage;
