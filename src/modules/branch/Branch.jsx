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
  fetchBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "./store/branch.thunks.js";

import {
  selectBranches,
  selectBranchStatus,
} from "./store/branch.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

import { selectCompanies } from "../company/store/company.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  name: "",
  code: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  phone: "",
  email: "",
  gstin: "",
  isMainBranch: false,
  status: "ACTIVE",
};

// ============================================================
// PAGE
// ============================================================

function Branch() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // BRANCH REDUX STATE
  // ==========================================================

  const branches = useSelector(selectBranches);

  const status = useSelector(selectBranchStatus);

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // COMPANIES
  // ==========================================================

  const companies = useSelector(selectCompanies);

  // ==========================================================
  // MODAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // ==========================================================
  // SELECTED / EDITING BRANCH
  // ==========================================================

  const [selectedBranch, setSelectedBranch] = useState(null);

  const [editingBranch, setEditingBranch] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH BRANCHES
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    /*
     * Branch API is company based.
     *
     * If a company is already selected in the form,
     * fetch is handled after company selection.
     *
     * For now, when workspace changes, clear old branch data
     * by fetching without company filter.
     */

    dispatch(fetchBranches());
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
  // COMPANY CHANGE
  // ==========================================================

  const handleCompanyChange = (event) => {
    const { value } = event.target;

    setFormData((previous) => ({
      ...previous,
      companyId: value,
    }));

    if (value) {
      dispatch(fetchBranches(value));
    }
  };

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setFormData(initialFormData);

    setEditingBranch(null);
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

  const handleView = (branch) => {
    setSelectedBranch(branch);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (branch) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingBranch(branch);

    setFormData({
      companyId: branch.companyId?._id || branch.companyId || "",
      name: branch.name || "",
      code: branch.code || "",
      description: branch.description || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "India",
      pincode: branch.pincode || "",
      phone: branch.phone || "",
      email: branch.email || "",
      gstin: branch.gstin || "",
      isMainBranch: branch.isMainBranch || false,
      status: branch.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (branch) => {
    const result = await dispatch(deleteBranch(branch._id));

    if (deleteBranch.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Branch Deleted",
        message: "Branch deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete branch.",
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
    // Company Required
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
    // Basic Validation
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter branch name.",
      });

      return;
    }

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter branch code.",
      });

      return;
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      companyId: formData.companyId,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      description: formData.description?.trim() || null,

      address: formData.address?.trim() || null,

      city: formData.city?.trim() || null,

      state: formData.state?.trim() || null,

      country: formData.country?.trim() || "India",

      pincode: formData.pincode?.trim() || null,

      phone: formData.phone?.trim() || null,

      email: formData.email?.trim().toLowerCase() || null,

      gstin: formData.gstin?.trim().toUpperCase() || null,

      isMainBranch: Boolean(formData.isMainBranch),

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingBranch) {
      const result = await dispatch(
        updateBranch({
          id: editingBranch._id,
          payload,
        }),
      );

      if (updateBranch.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Branch Updated",
          message: "Branch updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update branch.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createBranch(payload));

    if (createBranch.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Branch Created",
        message: "Branch created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create branch.",
    });
  };

  // ============================================================
  // TABLE COLUMNS
  // ============================================================

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
      key: "companyId",
      label: "Company",
      render: (row) => {
        if (typeof row.companyId === "object") {
          return row.companyId?.name || row.companyId?.code || "-";
        }

        const company = companies.find((item) => item._id === row.companyId);

        return company?.name || company?.code || "-";
      },
    },

    {
      key: "city",
      label: "City",
      render: (row) => row.city || "-",
    },

    {
      key: "gstin",
      label: "GSTIN",
      render: (row) => row.gstin || "-",
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

  // ============================================================
  // COMPANY OPTIONS
  // ============================================================

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.name || company.code || company._id,
  }));

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section>
      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <PageHeader
        title="Branches"
        description="Manage company branches."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Branch
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
          BRANCH TABLE
      ==================================================== */}

      <Table
        title="Branches"
        columns={columns}
        data={branches}
        rowKey="_id"
        emptyMessage="No branches found."
        loading={status === "loading"}
        searchPlaceholder="Search branches..."
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
        title={editingBranch ? "Edit Branch" : "Add Branch"}
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

            <Button type="submit" form="branch-form">
              {editingBranch ? "Update Branch" : "Create Branch"}
            </Button>
          </>
        }
      >
        <form id="branch-form" onSubmit={handleSubmit}>
          <Grid>
            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleCompanyChange}
              options={companyOptions}
            />

            <Input
              label="Branch Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter branch name"
            />

            <Input
              label="Branch Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter branch code"
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter branch address"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="Enter GSTIN"
            />

            <Select
              label="Main Branch"
              name="isMainBranch"
              value={String(formData.isMainBranch)}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,
                  isMainBranch: event.target.value === "true",
                }));
              }}
              options={[
                {
                  value: "true",
                  label: "Yes",
                },
                {
                  value: "false",
                  label: "No",
                },
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

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter branch description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW BRANCH MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedBranch(null);
        }}
        title="View Branch"
      >
        {selectedBranch && (
          <Grid columns={1}>
            <div>
              <strong>Company</strong>

              <div>
                {typeof selectedBranch.companyId === "object"
                  ? selectedBranch.companyId?.name ||
                    selectedBranch.companyId?.code ||
                    "-"
                  : companies.find(
                      (company) => company._id === selectedBranch.companyId,
                    )?.name || "-"}
              </div>
            </div>

            <div>
              <strong>Branch Name</strong>

              <div>{selectedBranch.name || "-"}</div>
            </div>

            <div>
              <strong>Branch Code</strong>

              <div>{selectedBranch.code || "-"}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedBranch.description || "-"}</div>
            </div>

            <div>
              <strong>Address</strong>

              <div>{selectedBranch.address || "-"}</div>
            </div>

            <div>
              <strong>City</strong>

              <div>{selectedBranch.city || "-"}</div>
            </div>

            <div>
              <strong>State</strong>

              <div>{selectedBranch.state || "-"}</div>
            </div>

            <div>
              <strong>Country</strong>

              <div>{selectedBranch.country || "-"}</div>
            </div>

            <div>
              <strong>Pincode</strong>

              <div>{selectedBranch.pincode || "-"}</div>
            </div>

            <div>
              <strong>Phone</strong>

              <div>{selectedBranch.phone || "-"}</div>
            </div>

            <div>
              <strong>Email</strong>

              <div>{selectedBranch.email || "-"}</div>
            </div>

            <div>
              <strong>GSTIN</strong>

              <div>{selectedBranch.gstin || "-"}</div>
            </div>

            <div>
              <strong>Main Branch</strong>

              <div>{selectedBranch.isMainBranch ? "Yes" : "No"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedBranch.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default Branch;
