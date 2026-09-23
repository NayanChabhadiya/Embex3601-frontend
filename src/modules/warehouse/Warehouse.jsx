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
  fetchWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "./store/warehouse.thunks.js";

import {
  selectWarehouses,
  selectWarehouseStatus,
} from "./store/warehouse.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

import { fetchCompanies } from "../company/store/company.thunks.js";
import { selectCompanies } from "../company/store/company.selectors.js";

import { fetchBranches } from "../branch/store/branch.thunks.js";
import { selectBranches } from "../branch/store/branch.selectors.js";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
  companyId: "",
  branchId: "",
  name: "",
  code: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  isDefault: false,
  status: "ACTIVE",
};

// ============================================================
// PAGE
// ============================================================

function WarehousePage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // REDUX
  // ==========================================================

  const warehouses = useSelector(selectWarehouses);

  const warehouseStatus = useSelector(selectWarehouseStatus);

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  const companies = useSelector(selectCompanies);

  const branches = useSelector(selectBranches);

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const [editingWarehouse, setEditingWarehouse] = useState(null);

  // ==========================================================
  // ID NORMALIZER
  // ==========================================================

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

  // ==========================================================
  // ACTIVE WORKSPACE ID
  // ==========================================================

  const activeWorkspaceId = getId(selectedWorkspace?._id);

  // ==========================================================
  // FETCH COMPANIES
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(fetchCompanies(activeWorkspaceId));
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // FETCH WAREHOUSES
  // ==========================================================

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    dispatch(fetchWarehouses());
  }, [dispatch, activeWorkspaceId]);

  // ==========================================================
  // SELECTED COMPANY ID
  // ==========================================================

  const selectedCompanyId = getId(formData.companyId);

  // ==========================================================
  // FETCH BRANCHES FOR SELECTED COMPANY
  // ==========================================================

  useEffect(() => {
    /*
     * Branch belongs to Company.
     *
     * Therefore Branch API must receive companyId,
     * NOT workspaceId.
     */

    if (!selectedCompanyId) {
      return;
    }

    dispatch(fetchBranches(selectedCompanyId));
  }, [dispatch, selectedCompanyId]);

  // ==========================================================
  // WORKSPACE COMPANIES
  // ==========================================================

  const workspaceCompanies = companies.filter((company) => {
    const companyWorkspaceId = getId(company.workspaceId || company.workspace);

    /*
     * Some APIs may already return companies
     * filtered by workspace.
     */

    if (!companyWorkspaceId) {
      return false;
    }

    return companyWorkspaceId === activeWorkspaceId;
  });

  // ==========================================================
  // AVAILABLE COMPANIES
  // ==========================================================

  /*
   * If backend already filtered companies by
   * workspace and workspaceId is not populated,
   * use returned companies.
   */

  const availableCompanies =
    workspaceCompanies.length > 0
      ? workspaceCompanies
      : activeWorkspaceId
        ? companies
        : [];

  // ==========================================================
  // FILTER BRANCHES BY SELECTED COMPANY
  // ==========================================================

  const filteredBranches = selectedCompanyId
    ? branches.filter((branch) => {
        const branchCompanyId = getId(branch.companyId || branch.company);

        return branchCompanyId === selectedCompanyId;
      })
    : [];

  // ==========================================================
  // WAREHOUSES OF CURRENT WORKSPACE
  // ==========================================================

  const workspaceCompanyIds = new Set(
    availableCompanies.map((company) => getId(company._id)),
  );

  const workspaceWarehouses = warehouses.filter((warehouse) => {
    const warehouseCompanyId = getId(warehouse.companyId || warehouse.company);

    return workspaceCompanyIds.has(warehouseCompanyId);
  });

  // ==========================================================
  // FORM CHANGE
  // ==========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,

      /*
       * Company changed.
       *
       * Previous branch can belong to
       * another company, so reset it.
       */

      ...(name === "companyId"
        ? {
            branchId: "",
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

    setEditingWarehouse(null);
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

    resetForm();

    setIsModalOpen(true);
  };

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (warehouse) => {
    setSelectedWarehouse(warehouse);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (warehouse) => {
    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    const companyId = getId(warehouse.companyId || warehouse.company);

    const branchId = getId(warehouse.branchId || warehouse.branch);

    setEditingWarehouse(warehouse);

    setFormData({
      companyId,

      branchId,

      name: warehouse.name || "",

      code: warehouse.code || "",

      description: warehouse.description || "",

      address: warehouse.address || "",

      city: warehouse.city || "",

      state: warehouse.state || "",

      country: warehouse.country || "India",

      pincode: warehouse.pincode || "",

      isDefault: Boolean(warehouse.isDefault),

      status: warehouse.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (warehouse) => {
    if (!activeWorkspaceId) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    const result = await dispatch(deleteWarehouse(warehouse._id));

    if (deleteWarehouse.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Warehouse Deleted",
        message: "Warehouse deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete warehouse.",
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
    // BRANCH
    // --------------------------------------------------------

    if (!formData.branchId) {
      showToast({
        type: "error",
        title: "Branch Required",
        message: "Please select a branch.",
      });

      return;
    }

    // --------------------------------------------------------
    // VERIFY BRANCH BELONGS TO COMPANY
    // --------------------------------------------------------

    const selectedBranch = filteredBranches.find(
      (branch) => getId(branch._id) === getId(formData.branchId),
    );

    if (!selectedBranch) {
      showToast({
        type: "error",
        title: "Invalid Branch",
        message: "Selected branch does not belong to the selected company.",
      });

      return;
    }

    // --------------------------------------------------------
    // NAME
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter warehouse name.",
      });

      return;
    }

    // --------------------------------------------------------
    // CODE
    // --------------------------------------------------------

    if (!formData.code?.trim()) {
      showToast({
        type: "error",
        title: "Code Required",
        message: "Please enter warehouse code.",
      });

      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    /*
     * IMPORTANT
     *
     * workspaceId is NOT sent.
     *
     * Hierarchy:
     *
     * Workspace
     *     ↓
     * Company
     *     ↓
     * Branch
     *     ↓
     * Warehouse
     *
     * Workspace is used as application context.
     * Warehouse itself is linked through:
     *
     * companyId
     * branchId
     */

    const payload = {
      companyId: formData.companyId,

      branchId: formData.branchId,

      name: formData.name.trim(),

      code: formData.code.trim().toUpperCase(),

      description: formData.description?.trim() || null,

      address: formData.address?.trim() || null,

      city: formData.city?.trim() || null,

      state: formData.state?.trim() || null,

      country: formData.country?.trim() || "India",

      pincode: formData.pincode?.trim() || null,

      isDefault: Boolean(formData.isDefault),

      status: formData.status,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingWarehouse) {
      const result = await dispatch(
        updateWarehouse({
          id: editingWarehouse._id,

          data: payload,
        }),
      );

      if (updateWarehouse.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Warehouse Updated",
          message: "Warehouse updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update warehouse.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createWarehouse(payload));

    if (createWarehouse.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Warehouse Created",
        message: "Warehouse created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create warehouse.",
    });
  };

  // ==========================================================
  // COMPANY NAME
  // ==========================================================

  const getCompanyName = (warehouse) => {
    if (warehouse.companyId?.name) {
      return warehouse.companyId.name;
    }

    const companyId = getId(warehouse.companyId || warehouse.company);

    return (
      availableCompanies.find((company) => getId(company._id) === companyId)
        ?.name || "-"
    );
  };

  // ==========================================================
  // BRANCH NAME
  // ==========================================================

  const getBranchName = (warehouse) => {
    if (warehouse.branchId?.name) {
      return warehouse.branchId.name;
    }

    const branchId = getId(warehouse.branchId || warehouse.branch);

    return (
      branches.find((branch) => getId(branch._id) === branchId)?.name || "-"
    );
  };

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "company",
      label: "Company",

      render: (row) => getCompanyName(row),
    },

    {
      key: "branch",
      label: "Branch",

      render: (row) => getBranchName(row),
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
      key: "city",
      label: "City",

      render: (row) => row.city || "-",
    },

    {
      key: "status",
      label: "Status",

      render: (row) => <Badge>{row.status || "-"}</Badge>,
    },

    {
      key: "isDefault",
      label: "Default",

      render: (row) => <Badge>{row.isDefault ? "YES" : "NO"}</Badge>,
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
        title="Warehouses"
        description="Manage company and branch warehouses."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Warehouse
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
          TABLE
      ==================================================== */}

      <Table
        title="Warehouses"
        columns={columns}
        data={workspaceWarehouses}
        rowKey="_id"
        emptyMessage="No warehouses found."
        loading={warehouseStatus === "loading"}
        searchPlaceholder="Search warehouses..."
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
        title={editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
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

            <Button type="submit" form="warehouse-form">
              {editingWarehouse ? "Update Warehouse" : "Create Warehouse"}
            </Button>
          </>
        }
      >
        <form id="warehouse-form" onSubmit={handleSubmit}>
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

                ...availableCompanies.map((company) => ({
                  value: getId(company._id),

                  label: company.name || company.code || getId(company._id),
                })),
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

                ...filteredBranches.map((branch) => ({
                  value: getId(branch._id),

                  label: branch.name || branch.code || getId(branch._id),
                })),
              ]}
            />

            {/* =================================================
                NAME
            ================================================= */}

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter warehouse name"
            />

            {/* =================================================
                CODE
            ================================================= */}

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter warehouse code"
            />

            {/* =================================================
                STATUS
            ================================================= */}

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

            {/* =================================================
                DEFAULT
            ================================================= */}

            <Select
              label="Default Warehouse"
              name="isDefault"
              value={formData.isDefault ? "true" : "false"}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,

                  isDefault: event.target.value === "true",
                }));
              }}
              options={[
                {
                  value: "false",
                  label: "No",
                },

                {
                  value: "true",
                  label: "Yes",
                },
              ]}
            />

            {/* =================================================
                ADDRESS
            ================================================= */}

            <Textarea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter warehouse address"
            />

            {/* =================================================
                CITY
            ================================================= */}

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
            />

            {/* =================================================
                STATE
            ================================================= */}

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
            />

            {/* =================================================
                COUNTRY
            ================================================= */}

            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
            />

            {/* =================================================
                PINCODE
            ================================================= */}

            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter warehouse description"
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

          setSelectedWarehouse(null);
        }}
        title="View Warehouse"
      >
        {selectedWarehouse && (
          <Grid columns={1}>
            <div>
              <strong>Company</strong>

              <div>{getCompanyName(selectedWarehouse)}</div>
            </div>

            <div>
              <strong>Branch</strong>

              <div>{getBranchName(selectedWarehouse)}</div>
            </div>

            <div>
              <strong>Name</strong>

              <div>{selectedWarehouse.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{selectedWarehouse.code || "-"}</div>
            </div>

            <div>
              <strong>Address</strong>

              <div>{selectedWarehouse.address || "-"}</div>
            </div>

            <div>
              <strong>City</strong>

              <div>{selectedWarehouse.city || "-"}</div>
            </div>

            <div>
              <strong>State</strong>

              <div>{selectedWarehouse.state || "-"}</div>
            </div>

            <div>
              <strong>Country</strong>

              <div>{selectedWarehouse.country || "-"}</div>
            </div>

            <div>
              <strong>Pincode</strong>

              <div>{selectedWarehouse.pincode || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedWarehouse.status || "-"}</Badge>
              </div>
            </div>

            <div>
              <strong>Default Warehouse</strong>

              <div>
                <Badge>{selectedWarehouse.isDefault ? "YES" : "NO"}</Badge>
              </div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{selectedWarehouse.description || "-"}</div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default WarehousePage;
