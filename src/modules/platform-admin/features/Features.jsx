import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader";
import Table from "../../../components/common/table/Table";
import Modal from "../../../components/common/modal/Modal";
import { Button } from "../../../components/common";
import { Input, Select, Textarea } from "../../../components/common/form";
import Grid from "../../../components/common/grid/Grid";
import GridItem from "../../../components/common/grid/GridItem";

import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../components/common/icons";

import { useToast } from "../../../components/common/toast/ToastProvider";

import {
  selectFeatures,
  selectFeaturesMeta,
  selectFeaturesStatus,
  selectFeaturesError,
  selectSelectedFeature,
  selectFeaturesCreateStatus,
  selectFeaturesCreateError,
  selectFeaturesUpdateStatus,
  selectFeaturesUpdateError,
  selectFeaturesActivateStatus,
  selectFeaturesActivateError,
  selectFeaturesDeactivateStatus,
  selectFeaturesDeactivateError,
  selectFeaturesDeleteStatus,
  selectFeaturesDeleteError,
  selectFeaturesRestoreStatus,
  selectFeaturesRestoreError,
} from "./store/feature.selectors";

import {
  fetchFeatures,
  createFeature,
  getFeatureById,
  updateFeature,
  activateFeature,
  deactivateFeature,
  deleteFeature,
  restoreFeature,
} from "./store/feature.thunks.js";

const FEATURE_TYPES = [
  {
    value: "module",
    label: "Module",
  },
  {
    value: "capability",
    label: "Capability",
  },
];

const FEATURE_STATUSES = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

const EMPTY_FEATURE = {
  _id: "",
  name: "",
  code: "",
  description: "",
  type: "",
  status: "active",
  sortOrder: 0,
};

function Features() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // ===========================================================================
  // Redux State
  // ===========================================================================

  const features = useSelector(selectFeatures);
  const meta = useSelector(selectFeaturesMeta);

  const listStatus = useSelector(selectFeaturesStatus);
  const listError = useSelector(selectFeaturesError);

  const selectedFeature = useSelector(selectSelectedFeature);

  const createStatus = useSelector(selectFeaturesCreateStatus);
  const createError = useSelector(selectFeaturesCreateError);

  const updateStatus = useSelector(selectFeaturesUpdateStatus);
  const updateError = useSelector(selectFeaturesUpdateError);

  const activateStatus = useSelector(selectFeaturesActivateStatus);
  const activateError = useSelector(selectFeaturesActivateError);

  const deactivateStatus = useSelector(selectFeaturesDeactivateStatus);
  const deactivateError = useSelector(selectFeaturesDeactivateError);

  const deleteStatus = useSelector(selectFeaturesDeleteStatus);
  const deleteError = useSelector(selectFeaturesDeleteError);

  const restoreStatus = useSelector(selectFeaturesRestoreStatus);
  const restoreError = useSelector(selectFeaturesRestoreError);

  // ===========================================================================
  // List State
  // ===========================================================================

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // ===========================================================================
  // Modal State
  // ===========================================================================

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [featureData, setFeatureData] = useState(EMPTY_FEATURE);

  // ===========================================================================
  // Fetch Features
  // ===========================================================================

  useEffect(() => {
    dispatch(
      fetchFeatures({
        page,
        limit,
        search,
      }),
    );
  }, [dispatch, page, limit, search]);

  // ===========================================================================
  // Loading States
  // ===========================================================================

  const isCreateLoading = createStatus === "loading";
  const isUpdateLoading = updateStatus === "loading";
  const isActivateLoading = activateStatus === "loading";
  const isDeactivateLoading = deactivateStatus === "loading";
  const isDeleteLoading = deleteStatus === "loading";
  const isRestoreLoading = restoreStatus === "loading";

  // ===========================================================================
  // Modal Helpers
  // ===========================================================================

  const openModal = (type, feature = null) => {
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

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setFeatureData(EMPTY_FEATURE);
  };

  // ===========================================================================
  // Feature Form Change
  // ===========================================================================

  const handleChangeFeatureData = (event) => {
    const { name, value } = event.target;

    setFeatureData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ===========================================================================
  // Refresh List
  // ===========================================================================

  const refreshFeatures = () => {
    dispatch(
      fetchFeatures({
        page,
        limit,
        search,
      }),
    );
  };

  // ===========================================================================
  // Create Feature
  // ===========================================================================

  const handleCreate = async () => {
    const payload = {
      name: featureData.name.trim(),
      code: featureData.code.trim().toLowerCase(),
      description: featureData.description.trim(),
      type: featureData.type,
      status: featureData.status,
      sortOrder: Number(featureData.sortOrder),
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
          "Unable to create feature. Please check the entered details.",
      });
    }
  };

  // ===========================================================================
  // Get Feature By ID
  // ===========================================================================

  const handleView = async (feature) => {
    const result = await dispatch(getFeatureById(feature._id));

    if (getFeatureById.fulfilled.match(result)) {
      const data = result.payload;

      setFeatureData({
        _id: data?._id ?? "",
        name: data?.name ?? "",
        code: data?.code ?? "",
        description: data?.description ?? "",
        type: data?.type ?? "",
        status: data?.status ?? "active",
        sortOrder: data?.sortOrder ?? 0,
      });

      setModalType("view");
      setIsModalOpen(true);

      return;
    }

    if (getFeatureById.rejected.match(result)) {
      showToast({
        type: "error",
        title: "Unable to load feature",
        message: result.payload || "Unable to fetch feature details.",
      });
    }
  };

  // ===========================================================================
  // Update Feature
  // ===========================================================================

  const handleUpdate = async () => {
    if (!featureData._id) {
      return;
    }

    const payload = {
      name: featureData.name.trim(),
      description: featureData.description.trim(),
      type: featureData.type,
      sortOrder: Number(featureData.sortOrder),
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
          result.payload || "Unable to update feature. Please try again.",
      });
    }
  };

  // ===========================================================================
  // Activate Feature
  // ===========================================================================

  const handleActivate = async () => {
    if (!featureData._id) {
      return;
    }

    const result = await dispatch(activateFeature(featureData._id));

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
      return;
    }

    const result = await dispatch(deactivateFeature(featureData._id));

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
      return;
    }

    const result = await dispatch(deleteFeature(featureData._id));

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
      return;
    }

    const result = await dispatch(restoreFeature(featureData._id));

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
  // Table Columns
  // ===========================================================================

  const columns = [
    {
      key: "_id",
      label: "ID",
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
          <ViewIcon size={5} onClick={() => handleView(row)} title="View" />

          <EditIcon
            size={5}
            onClick={() => openModal("edit", row)}
            title="Edit"
          />

          {row.status === "active" ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => openModal("deactivate", row)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => openModal("activate", row)}
            >
              Activate
            </Button>
          )}

          <DeleteIcon
            size={5}
            onClick={() => openModal("delete", row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  // ===========================================================================
  // Modal Title
  // ===========================================================================

  const modalTitle =
    modalType === "view"
      ? "View Feature"
      : modalType === "edit"
        ? "Edit Feature"
        : modalType === "delete"
          ? "Delete Feature"
          : modalType === "activate"
            ? "Activate Feature"
            : modalType === "deactivate"
              ? "Deactivate Feature"
              : modalType === "restore"
                ? "Restore Feature"
                : "Create Feature";

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <section>
      <PageHeader
        title="Features"
        description="Manage Embex360 platform features."
      />

      {listError && <p>{listError}</p>}

      <Table
        title="Features"
        columns={columns}
        data={features}
        rowKey="_id"
        loading={listStatus === "loading"}
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
        actions={
          <Button
            type="button"
            variant="primary"
            onClick={() => openModal("add")}
          >
            Add Feature
          </Button>
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        size="large"
        footer={
          <>
            {modalType === "add" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreate}
                  loading={isCreateLoading}
                  loadingText="Creating..."
                >
                  Create Feature
                </Button>
              </>
            )}

            {modalType === "edit" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleUpdate}
                  loading={isUpdateLoading}
                  loadingText="Updating..."
                >
                  Update Feature
                </Button>
              </>
            )}

            {modalType === "delete" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleDelete}
                  loading={isDeleteLoading}
                  loadingText="Deleting..."
                >
                  Delete Feature
                </Button>
              </>
            )}

            {modalType === "activate" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleActivate}
                  loading={isActivateLoading}
                  loadingText="Activating..."
                >
                  Activate Feature
                </Button>
              </>
            )}

            {modalType === "deactivate" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleDeactivate}
                  loading={isDeactivateLoading}
                  loadingText="Deactivating..."
                >
                  Deactivate Feature
                </Button>
              </>
            )}

            {modalType === "restore" && (
              <>
                <Button type="button" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleRestore}
                  loading={isRestoreLoading}
                  loadingText="Restoring..."
                >
                  Restore Feature
                </Button>
              </>
            )}
          </>
        }
      >
        {/* ================================================================== */}
        {/* CREATE / EDIT */}
        {/* ================================================================== */}

        {(modalType === "add" || modalType === "edit") && (
          <Grid columns={4} gap={16}>
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
                options={FEATURE_TYPES}
                required
              />
            </GridItem>

            <GridItem>
              <Select
                label="Status"
                name="status"
                value={featureData.status}
                onChange={handleChangeFeatureData}
                options={FEATURE_STATUSES}
                disabled={modalType === "edit"}
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

            <GridItem columnSpan={4}>
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

        {/* ================================================================== */}
        {/* VIEW */}
        {/* ================================================================== */}

        {modalType === "view" && (
          <Grid columns={2} gap={16}>
            <GridItem>
              <strong>Name</strong>
              <p>{featureData.name || "-"}</p>
            </GridItem>

            <GridItem>
              <strong>Code</strong>
              <p>{featureData.code || "-"}</p>
            </GridItem>

            <GridItem>
              <strong>Type</strong>
              <p>{featureData.type || "-"}</p>
            </GridItem>

            <GridItem>
              <strong>Status</strong>
              <p>{featureData.status || "-"}</p>
            </GridItem>

            <GridItem>
              <strong>Sort Order</strong>
              <p>{featureData.sortOrder ?? "-"}</p>
            </GridItem>

            <GridItem columnSpan={2}>
              <strong>Description</strong>
              <p>{featureData.description || "-"}</p>
            </GridItem>
          </Grid>
        )}

        {/* ================================================================== */}
        {/* DELETE */}
        {/* ================================================================== */}

        {modalType === "delete" && (
          <div>
            <p>
              Are you sure you want to delete{" "}
              <strong>{featureData.name}</strong>?
            </p>
          </div>
        )}

        {/* ================================================================== */}
        {/* ACTIVATE */}
        {/* ================================================================== */}

        {modalType === "activate" && (
          <div>
            <p>
              Are you sure you want to activate{" "}
              <strong>{featureData.name}</strong>?
            </p>
          </div>
        )}

        {/* ================================================================== */}
        {/* DEACTIVATE */}
        {/* ================================================================== */}

        {modalType === "deactivate" && (
          <div>
            <p>
              Are you sure you want to deactivate{" "}
              <strong>{featureData.name}</strong>?
            </p>
          </div>
        )}

        {/* ================================================================== */}
        {/* RESTORE */}
        {/* ================================================================== */}

        {modalType === "restore" && (
          <div>
            <p>
              Are you sure you want to restore{" "}
              <strong>{featureData.name}</strong>?
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default Features;
