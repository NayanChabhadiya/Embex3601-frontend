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
  fetchBanks,
  createBank,
  updateBank,
  deleteBank,
} from "./store/bank.thunks.js";

import {
  selectBanks,
  selectBankStatus,
  selectSelectedBank,
} from "./store/bank.selectors.js";

import { selectSelectedWorkspace } from "../workspace/store/workspace.selectors.js";
import { selectCurrencies } from "../currency/store/currency.selectors.js";
import { fetchCurrencies } from "../currency/store/currency.thunks.js";

const initialFormData = {
  name: "",
  code: "",
  bankName: "",
  branchName: "",
  accountNumber: "",
  ifscCode: "",
  swiftCode: "",
  accountHolderName: "",
  accountType: "CURRENT",
  currencyId: "",
  openingBalance: 0,
  description: "",
  status: "ACTIVE",
};

function BankPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchCurrencies());
  }, [dispatch]);
  const currencies = useSelector(selectCurrencies);

  console.log(currencies);
  // ==========================================================
  // BANK REDUX STATE
  // ==========================================================

  const banks = useSelector(selectBanks);

  const status = useSelector(selectBankStatus);

  const selectedBank = useSelector(selectSelectedBank);

  // ==========================================================
  // ACTIVE WORKSPACE
  // ==========================================================

  const selectedWorkspace = useSelector(selectSelectedWorkspace);

  // ==========================================================
  // LOCAL STATE
  // ==========================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [viewBank, setViewBank] = useState(null);

  const [editingBank, setEditingBank] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  // ==========================================================
  // FETCH BANKS
  // ==========================================================

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

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

    setEditingBank(null);
  };

  // ==========================================================
  // OPEN CREATE
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

  const handleView = (bank) => {
    setViewBank(bank);

    setIsViewModalOpen(true);
  };

  // ==========================================================
  // EDIT
  // ==========================================================

  const handleEdit = (bank) => {
    if (!selectedWorkspace?._id) {
      showToast({
        type: "error",
        title: "Workspace Required",
        message: "Please select a workspace first.",
      });

      return;
    }

    setEditingBank(bank);

    setFormData({
      name: bank.name || "",

      code: bank.code || "",

      bankName: bank.bankName || "",

      branchName: bank.branchName || "",

      accountNumber: bank.accountNumber || "",

      ifscCode: bank.ifscCode || "",

      swiftCode: bank.swiftCode || "",

      accountHolderName: bank.accountHolderName || "",

      accountType: bank.accountType || "CURRENT",

      currencyId: bank.currencyId?._id || bank.currencyId || "",

      openingBalance: bank.openingBalance ?? 0,

      description: bank.description || "",

      status: bank.status || "ACTIVE",
    });

    setIsModalOpen(true);
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (bank) => {
    const result = await dispatch(deleteBank(bank._id));

    if (deleteBank.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Bank Deleted",
        message: "Bank deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete bank.",
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
    // Payload
    // --------------------------------------------------------

    const payload = {
      workspaceId: selectedWorkspace._id,

      name: formData.name,

      code: formData.code,

      bankName: formData.bankName,

      branchName: formData.branchName,

      accountNumber: formData.accountNumber,

      ifscCode: formData.ifscCode,

      swiftCode: formData.swiftCode,

      accountHolderName: formData.accountHolderName,

      accountType: formData.accountType,

      currencyId: formData.currencyId || null,

      openingBalance: Number(formData.openingBalance) || 0,

      description: formData.description,

      status: formData.status,
    };

    console.log("Selected Workspace:", selectedWorkspace);

    console.log("Bank Payload:", payload);

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    if (editingBank) {
      const result = await dispatch(
        updateBank({
          id: editingBank._id,
          payload,
        }),
      );

      if (updateBank.fulfilled.match(result)) {
        setIsModalOpen(false);

        resetForm();

        showToast({
          type: "success",
          title: "Bank Updated",
          message: "Bank updated successfully.",
        });

        return;
      }

      showToast({
        type: "error",
        title: "Error",
        message: result?.payload || "Failed to update bank.",
      });

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const result = await dispatch(createBank(payload));

    if (createBank.fulfilled.match(result)) {
      setIsModalOpen(false);

      resetForm();

      showToast({
        type: "success",
        title: "Bank Created",
        message: "Bank created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to create bank.",
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
      key: "bankName",
      label: "Bank",
    },

    {
      key: "branchName",
      label: "Branch",

      render: (row) => row.branchName || "-",
    },

    {
      key: "accountNumber",
      label: "Account Number",

      render: (row) => row.accountNumber || "-",
    },

    {
      key: "ifscCode",
      label: "IFSC",

      render: (row) => row.ifscCode || "-",
    },

    {
      key: "accountType",
      label: "Account Type",
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
        title="Banks"
        description="Manage workspace bank accounts."
        actions={
          <Button type="button" onClick={handleCreate}>
            Add Bank
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
          BANK TABLE
      ==================================================== */}

      <Table
        title="Banks"
        columns={columns}
        data={banks}
        rowKey="_id"
        emptyMessage="No banks found."
        loading={status === "loading"}
        searchPlaceholder="Search banks..."
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
        title={editingBank ? "Edit Bank" : "Add Bank"}
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

            <Button type="submit" form="bank-form">
              {editingBank ? "Update Bank" : "Create Bank"}
            </Button>
          </>
        }
      >
        <form id="bank-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Enter bank name"
            />

            <Input
              label="Master Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter bank master name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter bank code"
            />

            <Input
              label="Branch Name"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              placeholder="Enter branch name"
            />

            <Input
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter account number"
            />

            <Input
              label="IFSC Code"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="Enter IFSC code"
            />

            <Input
              label="SWIFT Code"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleChange}
              placeholder="Enter SWIFT code"
            />

            <Input
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              placeholder="Enter account holder name"
            />

            <Select
              label="Account Type"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              options={[
                {
                  value: "CURRENT",
                  label: "Current",
                },
                {
                  value: "SAVINGS",
                  label: "Savings",
                },
                {
                  value: "CASH_CREDIT",
                  label: "Cash Credit",
                },
                {
                  value: "OVERDRAFT",
                  label: "Overdraft",
                },
                {
                  value: "OTHER",
                  label: "Other",
                },
              ]}
            />

            <Select
              label="Currency"
              name="currencyId"
              value={formData.currencyId}
              onChange={handleChange}
              options={[
                {
                  value: "",
                  label: "Select Currency",
                },

                ...currencies.map((currency) => ({
                  value: currency._id,
                  label: `${currency.name} (${currency.code})`,
                })),
              ]}
            />

            <Input
              label="Opening Balance"
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter opening balance"
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
              placeholder="Enter description"
            />
          </Grid>
        </form>
      </Modal>

      {/* ====================================================
          VIEW BANK MODAL
      ==================================================== */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);

          setViewBank(null);
        }}
        title="View Bank"
      >
        {viewBank && (
          <Grid columns={1}>
            <div>
              <strong>Bank Name</strong>

              <div>{viewBank.bankName || "-"}</div>
            </div>

            <div>
              <strong>Master Name</strong>

              <div>{viewBank.name || "-"}</div>
            </div>

            <div>
              <strong>Code</strong>

              <div>{viewBank.code || "-"}</div>
            </div>

            <div>
              <strong>Branch</strong>

              <div>{viewBank.branchName || "-"}</div>
            </div>

            <div>
              <strong>Account Number</strong>

              <div>{viewBank.accountNumber || "-"}</div>
            </div>

            <div>
              <strong>IFSC</strong>

              <div>{viewBank.ifscCode || "-"}</div>
            </div>

            <div>
              <strong>SWIFT</strong>

              <div>{viewBank.swiftCode || "-"}</div>
            </div>

            <div>
              <strong>Account Holder</strong>

              <div>{viewBank.accountHolderName || "-"}</div>
            </div>

            <div>
              <strong>Account Type</strong>

              <div>{viewBank.accountType || "-"}</div>
            </div>

            <div>
              <strong>Currency</strong>

              <div>
                {viewBank.currencyId?.name ||
                  viewBank.currencyId?.code ||
                  viewBank.currencyId ||
                  "-"}
              </div>
            </div>

            <div>
              <strong>Opening Balance</strong>

              <div>{viewBank.openingBalance ?? 0}</div>
            </div>

            <div>
              <strong>Description</strong>

              <div>{viewBank.description || "-"}</div>
            </div>

            <div>
              <strong>Status</strong>

              <div>
                <Badge>{viewBank.status}</Badge>
              </div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default BankPage;
