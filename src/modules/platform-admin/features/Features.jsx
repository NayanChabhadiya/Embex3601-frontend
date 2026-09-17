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
  selectFeaturesError,
  selectFeaturesMeta,
  selectFeaturesStatus,
} from "./store/feature.selectors";

import {
  fetchFeatures,
  createFeature,
  updateFeature,
} from "./store/feature.thunks";

function Features() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const features = useSelector(selectFeatures);
  const status = useSelector(selectFeaturesStatus);
  const error = useSelector(selectFeaturesError);
  const meta = useSelector(selectFeaturesMeta);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [featureData, setFeatureData] = useState({
    _id: "",
    name: "",
    code: "",
    description: "",
    type: "",
    status: "active",
    sortOrder: 0,
  });

  useEffect(() => {
    dispatch(
      fetchFeatures({
        page,
        limit,
        search,
      }),
    );
  }, [dispatch, page, limit, search]);

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
    resetFeatureData();
  };

  const handleChangeFeatureData = (event) => {
    const { name, value } = event.target;

    setFeatureData((current) => ({
      ...current,
      [name]: value,
    }));
  };

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

      dispatch(
        fetchFeatures({
          page,
          limit,
          search,
        }),
      );

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

  const handleUpdate = async () => {
    if (!featureData._id) {
      showToast({
        type: "error",
        title: "Update failed",
        message: "Feature identifier is missing.",
      });

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

      dispatch(
        fetchFeatures({
          page,
          limit,
          search,
        }),
      );

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
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <ViewIcon
            size={5}
            onClick={() => openModal("view", row)}
            title="View"
          />

          <EditIcon
            size={5}
            onClick={() => openModal("edit", row)}
            title="Edit"
          />

          <DeleteIcon
            size={5}
            onClick={() => openModal("delete", row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  return (
    <section>
      <PageHeader title="Features" description="Manage Embex360 features." />

      {error && <p>{error}</p>}

      <Table
        title="Features"
        columns={columns}
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
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Feature"
            : modalType === "edit"
              ? "Edit Feature"
              : modalType === "delete"
                ? "Delete Feature"
                : "Create Feature"
        }
        size="large"
        footer={
          modalType === "add" ? (
            <>
              <Button type="button" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleCreate}
                loading={status === "loading"}
                loadingText="Creating..."
              >
                Create Feature
              </Button>
            </>
          ) : modalType === "edit" ? (
            <>
              <Button type="button" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleUpdate}
                loading={status === "loading"}
                loadingText="Updating..."
              >
                Update Feature
              </Button>
            </>
          ) : null
        }
      >
        {modalType === "view" && featureData ? (
          <Grid columns={4} gap={16}>
            <GridItem>
              <p>
                <strong>Name:</strong> {featureData.name}
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

            <GridItem columnSpan={4}>
              <p>
                <strong>Description:</strong> {featureData.description || "-"}
              </p>
            </GridItem>

            <GridItem>
              <p>
                <strong>Sort Order:</strong> {featureData.sortOrder}
              </p>
            </GridItem>
          </Grid>
        ) : (modalType === "add" || modalType === "edit") && featureData ? (
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
        ) : modalType === "delete" && featureData ? (
          <p>
            Are you sure you want to delete <strong>{featureData.name}</strong>?
          </p>
        ) : null}
      </Modal>
    </section>
  );
}

export default Features;
