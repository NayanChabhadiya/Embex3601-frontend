import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../../../components/layout/page/components/PageHeader.jsx";
import Table from "../../../components/common/table/Table.jsx";
import Modal from "../../../components/common/modal/Modal.jsx";
import Grid from "../../../components/common/grid/Grid.jsx";
import Badge from "../../../components/common/badge/Badge.jsx";

import {
  Input,
  Select,
  Textarea,
} from "../../../components/common/form/index.js";

import { Button } from "../../../components/common/index.js";

import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../components/common/icons";

import { useToast } from "../../../components/common/toast/ToastProvider.jsx";

import {
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "./store/feature.thunks.js";

import {
  selectFeatures,
  selectFeatureStatus,
} from "./store/feature.selectors.js";

function FeaturePage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const features = useSelector(selectFeatures);
  const status = useSelector(selectFeatureStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleView = (feature) => {
    setSelectedFeature(feature);
    setIsViewModalOpen(true);
  };

  const handleEdit = (feature) => {
    setSelectedFeature(feature);

    setFormData({
      name: feature.name ?? "",
      code: feature.code ?? "",
      description: feature.description ?? "",
      status: feature.status ?? "ACTIVE",
    });

    setIsModalOpen(true);
  };

  const handleDelete = (feature) => {
    setFeatureToDelete(feature);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      status: formData.status,
    };

    // UPDATE
    if (selectedFeature) {
      const result = await dispatch(
        updateFeature({
          id: selectedFeature._id,
          payload,
        }),
      );

      if (updateFeature.fulfilled.match(result)) {
        setIsModalOpen(false);
        setSelectedFeature(null);

        setFormData({
          name: "",
          code: "",
          description: "",
          status: "ACTIVE",
        });

        showToast({
          type: "success",
          title: "Feature Updated",
          message: "Feature updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update feature.",
      });

      return;
    }

    // CREATE
    const result = await dispatch(createFeature(payload));

    if (createFeature.fulfilled.match(result)) {
      setIsModalOpen(false);

      setFormData({
        name: "",
        code: "",
        description: "",
        status: "ACTIVE",
      });

      showToast({
        type: "success",
        title: "Feature Created",
        message: "Feature created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create feature.",
    });
  };

  const handleConfirmDelete = async () => {
    if (!featureToDelete?._id) {
      return;
    }

    const result = await dispatch(deleteFeature(featureToDelete._id));

    if (deleteFeature.fulfilled.match(result)) {
      setIsDeleteModalOpen(false);
      setFeatureToDelete(null);

      showToast({
        type: "success",
        title: "Feature Deleted",
        message: "Feature deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete feature.",
    });
  };

  const columns = [
    {
      key: "_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "code",
      label: "Code",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <ViewIcon size={5} onClick={() => handleView(row)} title="View" />

          <EditIcon size={5} onClick={() => handleEdit(row)} title="Edit" />

          <DeleteIcon
            size={5}
            onClick={() => handleDelete(row)}
            title="Delete"
          />
        </>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        title="Features"
        description="Manage Embex360 platform features."
        actions={
          <Button
            type="button"
            onClick={() => {
              setSelectedFeature(null);

              setFormData({
                name: "",
                code: "",
                description: "",
                status: "ACTIVE",
              });

              setIsModalOpen(true);
            }}
          >
            Add Feature
          </Button>
        }
      />

      <Table
        title="Features"
        columns={columns}
        data={features}
        rowKey="_id"
        emptyMessage="No features found."
        loading={status === "loading"}
        searchPlaceholder="Search features..."
      />

      {/* Add Feature Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFeature ? "Edit Feature" : "Add Feature"}
        footer={
          <>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" form="feature-form">
              {selectedFeature ? "Update Feature" : "Create Feature"}
            </Button>
          </>
        }
      >
        <form id="feature-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter feature name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter feature code"
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
              placeholder="Enter feature description"
            />
          </Grid>
        </form>
      </Modal>

      {/* View Feature Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFeature(null);
        }}
        title="View Feature"
      >
        {selectedFeature && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>
              <div>{selectedFeature.name}</div>
            </div>

            <div>
              <strong>Code</strong>
              <div>{selectedFeature.code}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                <Badge>{selectedFeature.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Description</strong>
              <div>{selectedFeature.description || "No description"}</div>
            </div>
          </Grid>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setFeatureToDelete(null);
        }}
        title="Delete Feature"
        footer={
          <>
            <Button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setFeatureToDelete(null);
              }}
            >
              Cancel
            </Button>

            <Button type="button" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{featureToDelete?.name}</strong>?
        </p>

        <p>This action will remove the feature from the active list.</p>
      </Modal>
    </section>
  );
}

export default FeaturePage;
