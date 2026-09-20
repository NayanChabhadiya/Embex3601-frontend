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
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "./store/account.thunks.js";

import {
  selectAccounts,
  selectAccountStatus,
} from "./store/account.selectors.js";

function AccountPage() {
  const dispatch = useDispatch();

  const { showToast } = useToast();

  const accounts = useSelector(selectAccounts);
  const status = useSelector(selectAccountStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    type: "BUSINESS",
    status: "ACTIVE",
    verificationStatus: "PENDING",
  });

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      type: "BUSINESS",
      status: "ACTIVE",
      verificationStatus: "PENDING",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleView = (account) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);

    setFormData({
      name: account.name ?? "",
      code: account.code ?? "",
      description: account.description ?? "",
      type: account.type ?? "BUSINESS",
      status: account.status ?? "ACTIVE",
      verificationStatus: account.verificationStatus ?? "PENDING",
    });

    setIsModalOpen(true);
  };

  const handleDelete = async (account) => {
    const result = await dispatch(deleteAccount(account._id));

    if (deleteAccount.fulfilled.match(result)) {
      showToast({
        type: "success",
        title: "Account Deleted",
        message: "Account deleted successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message: result?.payload || "Failed to delete account.",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isEditing = Boolean(selectedAccount?._id);

    const result = isEditing
      ? await dispatch(
          updateAccount({
            id: selectedAccount._id,
            payload: formData,
          }),
        )
      : await dispatch(createAccount(formData));

    if (
      (isEditing && updateAccount.fulfilled.match(result)) ||
      (!isEditing && createAccount.fulfilled.match(result))
    ) {
      setIsModalOpen(false);
      setSelectedAccount(null);
      resetForm();

      showToast({
        type: "success",
        title: isEditing ? "Account Updated" : "Account Created",
        message: isEditing
          ? "Account updated successfully."
          : "Account created successfully.",
      });

      return;
    }

    showToast({
      type: "error",
      title: "Error",
      message:
        result?.payload ||
        `Failed to ${isEditing ? "update" : "create"} account.`,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
    resetForm();
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
      key: "type",
      label: "Type",
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <Badge>{row.status}</Badge>,
    },

    {
      key: "verificationStatus",
      label: "Verification",
      render: (row) => <Badge>{row.verificationStatus}</Badge>,
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
        title="Accounts"
        description="Manage your business accounts."
        actions={
          <Button
            type="button"
            onClick={() => {
              setSelectedAccount(null);
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Add Account
          </Button>
        }
      />

      <Table
        title="Accounts"
        columns={columns}
        data={accounts}
        rowKey="_id"
        emptyMessage="No accounts found."
        loading={status === "loading"}
        searchPlaceholder="Search accounts..."
      />

      {/* Add / Edit Account Modal */}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedAccount ? "Edit Account" : "Add Account"}
        footer={
          <>
            <Button type="button" onClick={handleCloseModal}>
              Cancel
            </Button>

            <Button type="submit" form="account-form">
              {selectedAccount ? "Update Account" : "Create Account"}
            </Button>
          </>
        }
      >
        <form id="account-form" onSubmit={handleSubmit}>
          <Grid>
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter account name"
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter account code"
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                {
                  value: "BUSINESS",
                  label: "Business",
                },
                {
                  value: "COMPANY",
                  label: "Company",
                },
                {
                  value: "ORGANIZATION",
                  label: "Organization",
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

            <Select
              label="Verification Status"
              name="verificationStatus"
              value={formData.verificationStatus}
              onChange={handleChange}
              options={[
                {
                  value: "PENDING",
                  label: "Pending",
                },
                {
                  value: "VERIFIED",
                  label: "Verified",
                },
                {
                  value: "REJECTED",
                  label: "Rejected",
                },
              ]}
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter account description"
            />
          </Grid>
        </form>
      </Modal>

      {/* View Account Modal */}

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAccount(null);
        }}
        title="View Account"
      >
        {selectedAccount && (
          <Grid columns={1}>
            <div>
              <strong>Name</strong>
              <div>{selectedAccount.name}</div>
            </div>

            <div>
              <strong>Code</strong>
              <div>{selectedAccount.code}</div>
            </div>

            <div>
              <strong>Type</strong>
              <div>{selectedAccount.type}</div>
            </div>

            <div>
              <strong>Status</strong>
              <div>
                <Badge>{selectedAccount.status}</Badge>
              </div>
            </div>

            <div>
              <strong>Verification Status</strong>
              <div>
                <Badge>{selectedAccount.verificationStatus}</Badge>
              </div>
            </div>

            <div>
              <strong>Description</strong>
              <div>{selectedAccount.description || "No description"}</div>
            </div>
          </Grid>
        )}
      </Modal>
    </section>
  );
}

export default AccountPage;
