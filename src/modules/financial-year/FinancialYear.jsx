import { useEffect, useState } from "react";

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
  fetchFinancialYears,
  createFinancialYear,
  updateFinancialYear,
  deleteFinancialYear,
} from "./store/financial-year.thunks.js";

import {
  selectFinancialYears,
  selectFinancialYearStatus,
} from "./store/financial-year.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";

import { selectCompanies } from "../company/store/company.selectors.js";

// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  companyId: "",
  name: "",
  startDate: "",
  endDate: "",
  status: "ACTIVE",
  isCurrent: false,
};

// ============================================================
// PAGE
// ============================================================

function FinancialYear() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  // ==========================================================
  // FINANCIAL YEAR REDUX STATE
  // ==========================================================

  const financialYears = useSelector(selectFinancialYears);

  const status = useSelector(selectFinancialYearStatus);

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
  // SELECTED / EDITING FINANCIAL YEAR
  // ==========================================================

  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);

  const [editingFinancialYear, setEditingFinancialYear] = useState(null);

  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH FINANCIAL YEARS
  // ==========================================================

  useEffect(() => {
    if (!selectedWorkspace?._id) {
      return;
    }

    dispatch(
      fetchFinancialYears({
        workspaceId: selectedWorkspace._id,
      }),
    );
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

    setEditingFinancialYear(null);
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

  const handleView = (financialYear) => {
    setSelectedFinancialYear(financialYear);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (financialYear) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingFinancialYear(financialYear);

    setFormData({
      companyId: financialYear.companyId?._id || financialYear.companyId || "",

      name: financialYear.name || "",

      startDate: financialYear.startDate
        ? financialYear.startDate.slice(0, 10)
        : "",

      endDate: financialYear.endDate ? financialYear.endDate.slice(0, 10) : "",

      status: financialYear.status || "ACTIVE",

      isCurrent: financialYear.isCurrent || false,
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (financialYear) => {
    const result = await dispatch(deleteFinancialYear(financialYear._id));

    if (deleteFinancialYear.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Financial Year Deleted",
        message: "Financial year deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete financial year.",
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
    // Name Required
    // --------------------------------------------------------

    if (!formData.name?.trim()) {
      showToast({
        type: "error",
        title: "Name Required",
        message: "Please enter financial year name.",
      });

      return;
    }

    // --------------------------------------------------------
    // Start Date Required
    // --------------------------------------------------------

    if (!formData.startDate) {
      showToast({
        type: "error",
        title: "Start Date Required",
        message: "Please select start date.",
      });

      return;
    }

    // --------------------------------------------------------
    // End Date Required
    // --------------------------------------------------------

    if (!formData.endDate) {
      showToast({
        type: "error",
        title: "End Date Required",
        message: "Please select end date.",
      });

      return;
    }

    // --------------------------------------------------------
    // Date Validation
    // --------------------------------------------------------

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showToast({
        type: "error",
        title: "Invalid Dates",
        message: "End date must be after start date.",
      });

      return;
    }

    // ========================================================
    // PAYLOAD
    // ========================================================

    const payload = {
      workspaceId: selectedWorkspace._id,

      companyId: formData.companyId,

      name: formData.name.trim(),

      startDate: formData.startDate,

      endDate: formData.endDate,

      status: formData.status,

      isCurrent: formData.isCurrent,
    };

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingFinancialYear) {
      const result = await dispatch(
        updateFinancialYear({
          id: editingFinancialYear._id,
          payload,
        }),
      );

      if (updateFinancialYear.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Financial Year Updated",
          message: "Financial year updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update financial year.",
      });

      return;
    }

    // ========================================================
    // CREATE
    // ========================================================

    const result = await dispatch(createFinancialYear(payload));

    if (createFinancialYear.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Financial Year Created",
        message: "Financial year created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create financial year.",
    });
  };

  // ==========================================================
  // COMPANY OPTIONS
  // ==========================================================

  const companyOptions = companies.map((company) => ({
    value: company._id,
    label: company.name || company.legalName || company.code || company._id,
  }));

  // ==========================================================
  // TABLE COLUMNS
  // ==========================================================

  const columns = [
    {
      key: "name",
      label: "Financial Year",
    },

    {
      key: "company",
      label: "Company",

      render: (row) =>
        row.companyId?.name ||
        companies.find(
          (company) => company._id === (row.companyId?._id || row.companyId),
        )?.name ||
        "-",
    },

    {
      key: "startDate",
      label: "Start Date",

      render: (row) =>
        row.startDate ? new Date(row.startDate).toLocaleDateString() : "-",
    },

    {
      key: "endDate",
      label: "End Date",

      render: (row) =>
        row.endDate ? new Date(row.endDate).toLocaleDateString() : "-",
    },

    {
      key: "isCurrent",
      label: "Current",

      render: (row) => <Badge>{row.isCurrent ? "Current" : "No"}</Badge>,
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
        title="Financial Years"
        description="Manage company financial years."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Financial Year
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
          FINANCIAL YEAR TABLE
      ==================================================== */}

      <Table
        title="Financial Years"
        columns={columns}
        data={financialYears}
        rowKey="_id"
        emptyMessage="No financial years found."
        loading={status === "loading"}
        searchPlaceholder="Search financial years..."
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
          editingFinancialYear ? "Edit Financial Year" : "Add Financial Year"
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

            <Button type="submit" form="financial-year-form">
              {editingFinancialYear
                ? "Update Financial Year"
                : "Create Financial Year"}
            </Button>
          </>
        }
      >
        <form id="financial-year-form" onSubmit={handleSubmit}>
          <Grid>
            <Select
              label="Company"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              options={companyOptions}
            />

            <Input
              label="Financial Year"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: 2026-27"
            />

            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />

            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
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

            <Select
              label="Current Financial Year"
              name="isCurrent"
              value={formData.isCurrent ? "true" : "false"}
              onChange={(event) => {
                setFormData((previous) => ({
                  ...previous,
                  isCurrent: event.target.value === "true",
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
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW FINANCIAL YEAR MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setSelectedFinancialYear(null);
        }}
        title="View Financial Year"
      >
        {selectedFinancialYear && (
          <Grid columns={1}>
            <div>
              <strong>Financial Year</strong>

              <div>{selectedFinancialYear.name || "-"}</div>
            </div>

            <div>
              <strong>Company</strong>

              <div>
                {selectedFinancialYear.companyId?.name ||
                  companies.find(
                    (company) =>
                      company._id ===
                      (selectedFinancialYear.companyId?._id ||
                        selectedFinancialYear.companyId),
                  )?.name ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Start Date</strong>

              <div>
                {selectedFinancialYear.startDate
                  ? new Date(
                      selectedFinancialYear.startDate,
                    ).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>End Date</strong>

              <div>
                {selectedFinancialYear.endDate
                  ? new Date(selectedFinancialYear.endDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>

            <div>
              <strong>Current</strong>

              <div>
                <Badge>
                  {selectedFinancialYear.isCurrent ? "Current" : "No"}
                </Badge>
              </div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{selectedFinancialYear.status || "-"}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default FinancialYear;
