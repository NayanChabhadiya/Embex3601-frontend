import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader";
import Table from "../../../components/common/table/Table";
import Modal from "../../../components/common/modal/Modal";
import { Button } from "../../../components/common";
import { Checkbox, Input, Select, Textarea } from "../../../components/common/form";
import Grid from "../../../components/common/grid/Grid";
import GridItem from "../../../components/common/grid/GridItem";

import {
  ActivateIcon,
  DeactivateIcon,
  DeleteIcon,
  EditIcon,
  RestoreIcon,
  ViewIcon,
} from "../../../components/common/icons";

import { useToast } from "../../../components/common/toast/ToastProvider";

import {
  selectFeatures,
  selectFeaturesCreateStatus,
  selectFeaturesError,
  selectFeaturesMeta,
  selectFeaturesStatus,
  selectFeaturesUpdateStatus,
} from "./store/feature.selectors";

import {
  fetchFeatures,
  fetchFeatureById,
  createFeature,
  updateFeature,
  activateFeature,
  deactivateFeature,
  deleteFeature,
  restoreFeature,
} from "./store/feature.thunks";

function Features() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ===========================================================================
  // Redux State
  // ===========================================================================

  const features = useSelector(selectFeatures);
  const meta = useSelector(selectFeaturesMeta);

  const status = useSelector(selectFeaturesStatus);
  const error = useSelector(selectFeaturesError);

  const createStatus = useSelector(selectFeaturesCreateStatus);
  const updateStatus = useSelector(selectFeaturesUpdateStatus);

  // ===========================================================================
  // List State
  // ===========================================================================

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [isDeleted, setIsDeleted] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
  });
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    code: true,
    type: true,
    status: true,
    sortOrder: true,
    actions: true,
  });

  // ===========================================================================
  // Modal State
  // ===========================================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // ===========================================================================
  // Action State
  // ===========================================================================

  const [actionLoading, setActionLoading] = useState(false);

  // ===========================================================================
  // Feature Form State
  // ===========================================================================

  const [featureData, setFeatureData] = useState({
    _id: "",
    name: "",
    code: "",
    description: "",
    type: "",
    status: "active",
    sortOrder: 0,
  });

  // ===========================================================================
  // Fetch Features
  // ===========================================================================

  useEffect(() => {
    const params = {
      page,
      limit,
      search,
      isDeleted,
      ...(filters.status && { status: filters.status }),
      ...(filters.type && { type: filters.type }),
    };

    dispatch(fetchFeatures(params));
  }, [dispatch, page, limit, search, isDeleted, filters]);
  // ===========================================================================
  // Error Toast
  // ===========================================================================

  useEffect(() => {
    if (error && status === "failed") {
      showToast({
        type: "error",
        title: "Unable to load features",
        message: error,
      });
    }
  }, [error, status, showToast]);

  // ===========================================================================
  // Reset Form
  // ===========================================================================

  const resetFeatureData = () => {
    setFeatureData({
      _id: "",
      name: "",
      code: "",
      description: "",
      type: "",
      status: "active",
      sortOrder: 0,
    });
  };

  // Fillter
  const openFilter = () => {
    setIsFilterOpen(true);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setPage(1);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      type: "",
    });

    setPage(1);
    setIsFilterOpen(false);
  };

  const openColumns = () => {
    setIsColumnsOpen(true);
  };

  const closeColumns = () => {
    setIsColumnsOpen(false);
  };

  const handleColumnChange = (event) => {
    const { name, checked } = event.target;

    setVisibleColumns((current) => ({
      ...current,
      [name]: checked,
    }));
  };

  // ===========================================================================
  // Open Modal
  // ===========================================================================

  const openModal = async (type, feature = null) => {
    setModalType(type);

    setFeatureData({
      _id: feature?._id ?? "",
      name: feature?.name ?? "",
      code: feature?.code ?? "",
      description: feature?.description ?? "",
      type: feature?.type ?? "",
      status: feature?.status ?? "active",
      sortOrder: feature?.sortOrder ?? 0,
    });

    setIsModalOpen(true);

    // -------------------------------------------------------------------------
    // GET /features/:id
    // -------------------------------------------------------------------------

    if (type === "view" && feature?._id) {
      setActionLoading(true);

      const result = await dispatch(fetchFeatureById(feature._id));

      setActionLoading(false);

      if (fetchFeatureById.fulfilled.match(result)) {
        const data = result.payload;

        setFeatureData({
          _id: data?._id ?? feature._id,
          name: data?.name ?? "",
          code: data?.code ?? "",
          description: data?.description ?? "",
          type: data?.type ?? "",
          status: data?.status ?? "active",
          sortOrder: data?.sortOrder ?? 0,
        });

        return;
      }

      if (fetchFeatureById.rejected.match(result)) {
        showToast({
          type: "error",
          title: "Unable to load feature",
          message: result.payload || "Unable to fetch feature details.",
        });
      }
    }
  };

  // ===========================================================================
  // Close Modal
  // ===========================================================================

  const closeModal = () => {
    if (actionLoading) {
      return;
    }

    setIsModalOpen(false);
    setModalType(null);
    resetFeatureData();
  };

  // ===========================================================================
  // Form Change
  // ===========================================================================

  const handleChangeFeatureData = (event) => {
    const { name, value } = event.target;

    setFeatureData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ===========================================================================
  // Refresh Features
  // ===========================================================================

  const refreshFeatures = () => {
    dispatch(
      fetchFeatures({
        page,
        limit,
        search,
        isDeleted,
      }),
    );
  };

  // ===========================================================================
  // Create Feature
  // ===========================================================================

  const handleCreate = async () => {
    const name = featureData.name.trim();
    const code = featureData.code.trim().toLowerCase();
    const description = featureData.description.trim();

    if (!name || !code || !featureData.type) {
      showToast({
        type: "error",
        title: "Validation failed",
        message: "Please enter feature name, code and type.",
      });

      return;
    }

    const payload = {
      name,
      code,
      description,
      type: featureData.type,
      status: featureData.status,
      sortOrder: Number(featureData.sortOrder) || 0,
    };

    const result = await dispatch(createFeature(payload));

    if (createFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature created",
        message: "Feature has been created successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (createFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Feature creation failed",
        message:
          result.payload ||
          "Unable to create feature. Please check the entered details and try again.",
      });
    }
  };

  // ===========================================================================
  // Update Feature
  // ===========================================================================

  const handleUpdate = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Update failed",
        message: "Feature identifier is missing.",
      });

      return;
    }

    const name = featureData.name.trim();
    const description = featureData.description.trim();

    if (!name || !featureData.type) {
      showToast({
        type: "error",
        title: "Validation failed",
        message: "Please enter feature name and type.",
      });

      return;
    }

    // Feature code remains immutable after creation.
    const payload = {
      name,
      description,
      type: featureData.type,
      sortOrder: Number(featureData.sortOrder) || 0,
    };

    const result = await dispatch(
      updateFeature({
        id: featureData._id,
        payload,
      }),
    );

    if (updateFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature updated",
        message: "Feature has been updated successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (updateFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Feature update failed",
        message:
          result.payload ||
          "Unable to update feature. Please check the entered details and try again.",
      });
    }
  };

  // ===========================================================================
  // Activate Feature
  // ===========================================================================

  const handleActivate = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Activation failed",
        message: "Feature identifier is missing.",
      });

      return;
    }

    setActionLoading(true);

    const result = await dispatch(activateFeature(featureData._id));

    setActionLoading(false);

    if (activateFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature activated",
        message: "Feature has been activated successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (activateFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Activation failed",
        message:
          result.payload || "Unable to activate feature. Please try again.",
      });
    }
  };

  // ===========================================================================
  // Deactivate Feature
  // ===========================================================================

  const handleDeactivate = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Deactivation failed",
        message: "Feature identifier is missing.",
      });

      return;
    }

    setActionLoading(true);

    const result = await dispatch(deactivateFeature(featureData._id));

    setActionLoading(false);

    if (deactivateFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature deactivated",
        message: "Feature has been deactivated successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (deactivateFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Deactivation failed",
        message:
          result.payload || "Unable to deactivate feature. Please try again.",
      });
    }
  };

  // ===========================================================================
  // Delete Feature
  // ===========================================================================

  const handleDelete = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Delete failed",
        message: "Feature identifier is missing.",
      });

      return;
    }

    setActionLoading(true);

    const result = await dispatch(deleteFeature(featureData._id));

    setActionLoading(false);

    if (deleteFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature deleted",
        message: "Feature has been deleted successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (deleteFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Feature deletion failed",
        message:
          result.payload || "Unable to delete feature. Please try again.",
      });
    }
  };

  // ===========================================================================
  // Restore Feature
  // ===========================================================================

  const handleRestore = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Restore failed",
        message: "Feature identifier is missing.",
      });

      return;
    }

    setActionLoading(true);

    const result = await dispatch(restoreFeature(featureData._id));

    setActionLoading(false);

    if (restoreFeature.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Feature restored",
        message: "Feature has been restored successfully.",
      });

      closeModal();
      refreshFeatures();

      return;
    }

    if (restoreFeature.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Feature restore failed",
        message:
          result.payload || "Unable to restore feature. Please try again.",
      });
    }
  };

  // ===========================================================================
  // Open Status Modal
  // ===========================================================================

  const openStatusModal = (type, feature) => {
    setModalType(type);

    setFeatureData({
      _id: feature?._id ?? "",
      name: feature?.name ?? "",
      code: feature?.code ?? "",
      description: feature?.description ?? "",
      type: feature?.type ?? "",
      status: feature?.status ?? "active",
      sortOrder: feature?.sortOrder ?? 0,
    });

    setIsModalOpen(true);
  };

  // ===========================================================================
  // Table Columns
  // ===========================================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
      render: (row) => row._id,
    },

    {
      key: "name",
      label: "Feature Name",
      render: (row) => row.name,
    },

    {
      key: "code",
      label: "Code",
      render: (row) => row.code,
    },

    {
      key: "type",
      label: "Type",
      render: (row) => row.type,
    },

    {
      key: "status",
      label: "Status",
      render: (row) => row.status,
    },

    {
      key: "actions",
      label: "Actions",

      render: (row) => (
        <>
          {/* View */}
          <ViewIcon
            size={5}
            onClick={() => openModal("view", row)}
            title="View"
          />

          {/* Edit */}
          <EditIcon
            size={5}
            onClick={() => openModal("edit", row)}
            title="Edit"
          />

          {/* Delete */}
          {!row.isDeleted && (
            <DeleteIcon
              size={5}
              onClick={() => openStatusModal("delete", row)}
              title="Delete"
            />
          )}

          {/* Activate */}
          {!row.isDeleted && row.status !== "active" && (
            <ActivateIcon
              type="button"
              size={5}
              onClick={() => openStatusModal("activate", row)}
            />
          )}

          {/* Deactivate */}
          {!row.isDeleted && row.status === "active" && (
            <DeactivateIcon
              type="button"
              size={5}
              onClick={() => openStatusModal("deactivate", row)}
            />
          )}

          {/* Restore */}
          {row.isDeleted && (
            <RestoreIcon
              type="button"
              size={5}
              onClick={() => openStatusModal("restore", row)}
            />
          )}
        </>
      ),
    },
  ];

  const displayedColumns = columns.filter((column) => {
    if (column.key === "name") return visibleColumns.name;
    if (column.key === "code") return visibleColumns.code;
    if (column.key === "type") return visibleColumns.type;
    if (column.key === "status") return visibleColumns.status;
    if (column.key === "sortOrder") return visibleColumns.sortOrder;
    if (column.key === "actions") return visibleColumns.actions;

    return true;
  });

  // ===========================================================================
  // Modal Title
  // ===========================================================================

  const getModalTitle = () => {
    switch (modalType) {
      case "view":
        return "View Feature";

      case "edit":
        return "Edit Feature";

      case "delete":
        return "Delete Feature";

      case "activate":
        return "Activate Feature";

      case "deactivate":
        return "Deactivate Feature";

      case "restore":
        return "Restore Feature";

      default:
        return "Create Feature";
    }
  };

  // ===========================================================================
  // Modal Footer
  // ===========================================================================

  const renderModalFooter = () => {
    if (modalType === "add") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleCreate}
            loading={createStatus === "loading"}
            loadingText="Creating..."
          >
            Create Feature
          </Button>
        </>
      );
    }

    if (modalType === "edit") {
      return (
        <>
          <Button type="button" onClick={closeModal}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleUpdate}
            loading={updateStatus === "loading"}
            loadingText="Updating..."
          >
            Update Feature
          </Button>
        </>
      );
    }

    if (modalType === "delete") {
      return (
        <>
          <Button type="button" onClick={closeModal} disabled={actionLoading}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            loading={actionLoading}
            loadingText="Deleting..."
          >
            Delete Feature
          </Button>
        </>
      );
    }

    if (modalType === "activate") {
      return (
        <>
          <Button type="button" onClick={closeModal} disabled={actionLoading}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleActivate}
            loading={actionLoading}
            loadingText="Activating..."
          >
            Activate Feature
          </Button>
        </>
      );
    }

    if (modalType === "deactivate") {
      return (
        <>
          <Button type="button" onClick={closeModal} disabled={actionLoading}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDeactivate}
            loading={actionLoading}
            loadingText="Deactivating..."
          >
            Deactivate Feature
          </Button>
        </>
      );
    }

    if (modalType === "restore") {
      return (
        <>
          <Button type="button" onClick={closeModal} disabled={actionLoading}>
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRestore}
            loading={actionLoading}
            loadingText="Restoring..."
          >
            Restore Feature
          </Button>
        </>
      );
    }

    return null;
  };

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section>
      {/* =====================================================================
          Page Header
      ====================================================================== */}

      <PageHeader
        title="Features"
        description="Manage Embex360 features."
        actions={
          <Button type="button" onClick={() => openModal("add")}>
            Add Feature
          </Button>
        }
      />

      {/* =====================================================================
          Feature Table
      ====================================================================== */}

      <Table
        title="Features"
        columns={displayedColumns}
        data={features}
        rowKey="_id"
        loading={status === "loading"}
        emptyMessage="No features found."
        pagination={meta}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search features..."
        onFilter={openFilter}
        onColumns={openColumns}
        action={
          <Select
            label="Records"
            value={isDeleted ? "deleted" : "active"}
            onChange={(event) => {
              setIsDeleted(event.target.value === "deleted");
              setPage(1);
            }}
            options={[
              {
                value: "active",
                label: "Active Features",
              },
              {
                value: "deleted",
                label: "Deleted Features",
              },
            ]}
          />
        }
      />

      {/* =====================================================================
          Feature Modal
      ====================================================================== */}
      <Modal
        isOpen={isColumnsOpen}
        onClose={closeColumns}
        title="Feature Columns"
        size="small"
        footer={
          <Button type="button" onClick={closeColumns}>
            Done
          </Button>
        }
      >
        <div>
          <Checkbox
            name="name"
            checked={visibleColumns.name}
            onChange={handleColumnChange}
            label="Name"
          />

          <Checkbox
            name="code"
            checked={visibleColumns.code}
            onChange={handleColumnChange}
            label="Code"
          />

          <Checkbox
            name="type"
            checked={visibleColumns.type}
            onChange={handleColumnChange}
            label="Type"
          />

          <Checkbox
            name="status"
            checked={visibleColumns.status}
            onChange={handleColumnChange}
            label="Status"
          />

          <Checkbox
            name="sortOrder"
            checked={visibleColumns.sortOrder}
            onChange={handleColumnChange}
            label="Sort Order"
          />

          <Checkbox
            name="actions"
            checked={visibleColumns.actions}
            onChange={handleColumnChange}
            label="Actions"
          />
        </div>
      </Modal>
      <Modal
        isOpen={isFilterOpen}
        onClose={closeFilter}
        title="Filter Features"
        size="medium"
        footer={
          <>
            <Button type="button" onClick={clearFilters}>
              Clear
            </Button>

            <Button type="button" onClick={applyFilters}>
              Apply Filters
            </Button>
          </>
        }
      >
        <Grid columns={2} gap={16}>
          <GridItem>
            <Select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              placeholder="All Statuses"
              options={[
                {
                  value: "active",
                  label: "Active",
                },
                {
                  value: "inactive",
                  label: "Inactive",
                },
              ]}
            />
          </GridItem>

          <GridItem>
            <Select
              label="Feature Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              placeholder="All Types"
              options={[
                {
                  value: "module",
                  label: "Module",
                },
                {
                  value: "capability",
                  label: "Capability",
                },
              ]}
            />
          </GridItem>
        </Grid>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={getModalTitle()}
        size="large"
        footer={renderModalFooter()}
      >
        {/* ===================================================================
            View
        ==================================================================== */}

        {modalType === "view" && (
          <Grid columns={3} gap={16}>
            <GridItem>
              <p>
                <strong>Name:</strong>{" "}
                {actionLoading ? "Loading..." : featureData.name}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Code:</strong> {featureData.code}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Type:</strong> {featureData.type}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Status:</strong> {featureData.status}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Sort Order:</strong> {featureData.sortOrder}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>ID:</strong> {featureData._id}
              </p>
            </GridItem>

            <GridItem columnSpan={3}>
              <p>
                <strong>Description:</strong> {featureData.description || "-"}
              </p>
            </GridItem>
          </Grid>
        )}

        {/* ===================================================================
            Create / Edit
        ==================================================================== */}

        {(modalType === "add" || modalType === "edit") && (
          <Grid columns={3} gap={16}>
            <GridItem>
              <Input
                label="Feature Name"
                name="name"
                type="text"
                placeholder="Enter feature name"
                value={featureData.name}
                onChange={handleChangeFeatureData}
                required
              />
            </GridItem>

            <GridItem>
              <Input
                label="Feature Code"
                name="code"
                type="text"
                placeholder="Enter feature code"
                value={featureData.code}
                onChange={handleChangeFeatureData}
                disabled={modalType === "edit"}
                required={modalType === "add"}
              />
            </GridItem>

            <GridItem>
              <Select
                label="Feature Type"
                name="type"
                value={featureData.type}
                onChange={handleChangeFeatureData}
                placeholder="Select feature type"
                options={[
                  {
                    value: "module",
                    label: "Module",
                  },
                  {
                    value: "capability",
                    label: "Capability",
                  },
                ]}
                required
              />
            </GridItem>

            <GridItem>
              <Input
                label="Sort Order"
                name="sortOrder"
                type="number"
                placeholder="Enter sort order"
                value={featureData.sortOrder}
                onChange={handleChangeFeatureData}
              />
            </GridItem>

            <GridItem columnSpan={3}>
              <Textarea
                label="Description"
                name="description"
                placeholder="Enter feature description"
                value={featureData.description}
                onChange={handleChangeFeatureData}
                rows={4}
              />
            </GridItem>
          </Grid>
        )}

        {/* ===================================================================
            Delete
        ==================================================================== */}

        {modalType === "delete" && (
          <p>
            Are you sure you want to delete <strong>{featureData.name}</strong>?
          </p>
        )}

        {/* ===================================================================
            Activate
        ==================================================================== */}

        {modalType === "activate" && (
          <p>
            Are you sure you want to activate{" "}
            <strong>{featureData.name}</strong>?
          </p>
        )}

        {/* ===================================================================
            Deactivate
        ==================================================================== */}

        {modalType === "deactivate" && (
          <p>
            Are you sure you want to deactivate{" "}
            <strong>{featureData.name}</strong>?
          </p>
        )}

        {/* ===================================================================
            Restore
        ==================================================================== */}

        {modalType === "restore" && (
          <p>
            Are you sure you want to restore <strong>{featureData.name}</strong>
            ?
          </p>
        )}
      </Modal>
    </section>
  );
}

export default Features;
