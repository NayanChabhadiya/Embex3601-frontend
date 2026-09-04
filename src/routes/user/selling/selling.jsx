import {
  FaEdit,
  FaEye,
  FaFilePdf,
  FaPlus,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import {
  addSelling,
  deleteSelling,
  getSellingsByUser,
  updateSelling,
} from "../../../store/apiSlice/sellingSlice";
import { getBuyersByUser } from "../../../store/apiSlice/buyerSlice";
import { getCompaniesByUser } from "../../../store/apiSlice/companySlice";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";
import { useEffect, useRef, useState } from "react";
import { getItemsByUser } from "../../../store/apiSlice/itemSlice";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import ItemTable from "../../../components/itemTable/itemTable";
import {
  convertToWords,
  formatDate,
  formatDateForInput,
  formatRupees,
  getDueDate,
} from "../../../utils/formatters";
import { render } from "react-dom";
import PrintSellingBill from "../../../components/printSellingBill/printSellingBill";
import PdfSellingBill from "../../../components/pdfSellingBill/pdfSellingBill";
import { downloadPDFLandscape } from "../../../utils/downloadPDFLandscape";
import { printElementLandscape } from "../../../utils/printElimentLandscape";
import { printElement } from "../../../utils/printElement";

const Selling = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getItemsByUser(loggedInUserId));
    dispatch(getCompaniesByUser(loggedInUserId));
    dispatch(getBuyersByUser(loggedInUserId));
    dispatch(getSellingsByUser(loggedInUserId));
  }, [dispatch]);

  const { items } = useSelector((state) => state.items);
  const { companies } = useSelector((state) => state.companies);
  const { buyers } = useSelector((state) => state.buyers);
  const { sellings } = useSelector((state) => state.sellings);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const today = new Date();
  const formattedToday = formatDateForInput(today);
  const defaultDueDate = getDueDate(today, 6);

  const [sellingData, setSellingData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    companyId: "",
    buyerId: "",
    billDate: formattedToday,
    dueDate: defaultDueDate,
    items: [
      {
        srNo: 1,
        item: "",
        unitType: "",
        hsn: "",
        qty: parseFloat(0.0).toFixed(2),
        pricePerUnit: parseFloat(0.0).toFixed(2),
        amount: parseFloat(0.0).toFixed(2),
      },
    ],
    total: parseFloat(0.0).toFixed(2),
    discountRate: parseFloat(0.0).toFixed(2),
    discountAmount: parseFloat(0.0).toFixed(2),
    subTotal: parseFloat(0.0).toFixed(2),
    cgstRate: parseFloat(0.0).toFixed(2),
    cgstAmount: parseFloat(0.0).toFixed(2),
    sgstRate: parseFloat(0.0).toFixed(2),
    sgstAmount: parseFloat(0.0).toFixed(2),
    igstRate: parseFloat(0.0).toFixed(2),
    igstAmount: parseFloat(0.0).toFixed(2),
    totalAmount: parseFloat(0.0).toFixed(2),
    roundOff: parseFloat(0.0).toFixed(2),
    finalAmount: parseFloat(0.0).toFixed(2),
    finalAmountInWords: convertToWords(parseFloat(0.0).toFixed(2)),
  });

  useEffect(() => {
    if (sellingData.billDate) {
      const calculatedDueDate = getDueDate(sellingData.billDate, 6);

      setSellingData((prev) => {
        if (!prev.dueDate || prev.dueDate === "") {
          return { ...prev, dueDate: calculatedDueDate };
        }
        return prev;
      });
    }
  }, [sellingData.billDate]);

  const itemsColumns = [
    { key: "srNo", label: "Sr No", type: "readonly", width: "5%" },
    {
      key: "item",
      label: "Item",
      type: "dropdown",
      width: "25%",
    },
    { key: "unitType", label: "Unit Type", type: "readonly", width: "15%" },
    { key: "hsn", label: "HSN", type: "readonly", width: "10%" },
    {
      key: "qty",
      label: "Quantity",
      type: "number",
      width: "10%",
    },
    {
      key: "pricePerUnit",
      label: "Price Per Unit",
      type: "number",
      width: "10%",
    },
    {
      key: "amount",
      label: "Amount",
      type: "readonly",
      width: "10%",
    },
  ];

  const allItemOptions = items?.map((item) => ({
    value: item._id,
    label: item.name,
    unitType: item.unitType,
  }));

  const handleChangeSellingData = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...sellingData, [name]: value };

    if (name === "billDate") {
      const newDueDate = getDueDate(value, 6);
      updatedData.dueDate = newDueDate;
    }

    const total = parseFloat(updatedData.total) || 0;
    const discountRate = parseFloat(updatedData.discountRate) || 0;
    const cgstRate = parseFloat(updatedData.cgstRate) || 0;
    const sgstRate = parseFloat(updatedData.sgstRate) || 0;
    const igstRate = parseFloat(updatedData.igstRate) || 0;

    const discountAmount = (total * discountRate) / 100;

    const subTotal = total - discountAmount;

    const cgstAmount = (subTotal * cgstRate) / 100;
    const sgstAmount = (subTotal * sgstRate) / 100;
    const igstAmount = (subTotal * igstRate) / 100;

    const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

    const roundedTotal = Math.round(totalAmount);
    const roundOff = (roundedTotal - totalAmount).toFixed(2);
    const finalAmount = totalAmount + parseFloat(roundOff);

    updatedData.total = total.toFixed(2);
    updatedData.discountAmount = discountAmount.toFixed(2);
    updatedData.subTotal = subTotal.toFixed(2);
    updatedData.cgstAmount = cgstAmount.toFixed(2);
    updatedData.sgstAmount = sgstAmount.toFixed(2);
    updatedData.igstAmount = igstAmount.toFixed(2);
    updatedData.totalAmount = totalAmount.toFixed(2);
    updatedData.roundOff = roundOff;
    updatedData.finalAmount = finalAmount.toFixed(2);
    updatedData.finalAmountInWords = convertToWords(finalAmount);

    setSellingData(updatedData);
  };

  const calculateTotal = (items) => {
    const total = items?.reduce((sum, item) => {
      const amt = parseFloat(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const discountRate = parseFloat(sellingData.discountRate) || 0;
    const discountAmount = (total * discountRate) / 100;
    const subTotal = total - discountAmount;
    const cgstRate = parseFloat(sellingData.cgstRate) || 0;
    const cgstAmount = (subTotal * cgstRate) / 100;
    const sgstRate = parseFloat(sellingData.sgstRate) || 0;
    const sgstAmount = (subTotal * sgstRate) / 100;
    const igstRate = parseFloat(sellingData.igstRate) || 0;
    const igstAmount = (subTotal * igstRate) / 100;
    const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

    const roundedTotal = Math.round(totalAmount);
    const roundOff = (roundedTotal - totalAmount).toFixed(2);
    const finalAmount = totalAmount + parseFloat(roundOff);

    setSellingData((prev) => ({
      ...prev,
      total: total.toFixed(2),
      discountRate: discountRate.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      subTotal: subTotal.toFixed(2),
      cgstRate: cgstRate.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstRate: sgstRate.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      igstRate: igstRate.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      roundOff: roundOff,
      finalAmount: finalAmount.toFixed(2),
      finalAmountInWords: convertToWords(finalAmount),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...sellingData.items];

    if (field === "item") {
      updatedItems[index][field] = value;

      const selectedItem = items?.find((opt) => opt._id === value);
      updatedItems[index].unitType = selectedItem ? selectedItem.unitType : "";
      updatedItems[index].hsn = selectedItem ? selectedItem.hsn : "";
    } else {
      updatedItems[index][field] = value;
    }

    const qty = parseFloat(updatedItems[index].qty) || 0;
    const price = parseFloat(updatedItems[index].pricePerUnit) || 0;
    if (qty > 0 && price > 0) {
      updatedItems[index].amount = (qty * price).toFixed(2);
    } else {
      updatedItems[index].amount = 0;
    }

    setSellingData({
      ...sellingData,
      items: updatedItems,
    });

    calculateTotal(updatedItems);
  };

  const addItem = () => {
    setSellingData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          unitType: "",
          hsn: "",
          qty: parseFloat(0).toFixed(2),
          pricePerUnit: parseFloat(0).toFixed(2),
          amount: parseFloat(0).toFixed(2),
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = sellingData.items?.filter((_, i) => i !== index);
    setSellingData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
    calculateTotal(updatedItems);
  };

  const openModal = (type, bill = null) => {
    setModalType(type);
    if (type === "view") {
      setSellingData({
        loggedInUserId: loggedInUserId,
        _id: bill._id,
        billNo: bill.billNo,
        companyId: bill.companyId,
        buyerId: bill.buyerId,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        items: bill.items,
        total: bill.total,
        discountRate: bill.discountRate,
        discountAmount: bill.discountAmount,
        subTotal: bill.subTotal,
        cgstRate: bill.cgstRate,
        cgstAmount: bill.cgstAmount,
        sgstRate: bill.sgstRate,
        sgstAmount: bill.sgstAmount,
        igstRate: bill.igstRate,
        igstAmount: bill.igstAmount,
        totalAmount: bill.totalAmount,
        roundOff: bill.roundOff,
        finalAmount: bill.finalAmount,
        finalAmountInWords: bill.finalAmountInWords,
      });
    } else if (type === "edit" || type === "add") {
      setSellingData({
        loggedInUserId,
        _id: bill ? bill._id : "",
        billNo: bill ? bill.billNo : "",
        companyId: bill ? bill.companyId : "",
        buyerId: bill ? bill.buyerId : "",
        billDate: bill ? formatDateForInput(bill.billDate) : formattedToday,
        dueDate: bill ? formatDateForInput(bill.dueDate) : defaultDueDate,
        items: bill
          ? bill.items?.map((item, index) => ({
              ...item,
              srNo: index + 1,
              pricePerUnit: parseFloat(item.pricePerUnit).toFixed(2),
              amount: parseFloat(item.amount).toFixed(2),
            }))
          : [
              {
                srNo: 1,
                item: "",
                unitType: "",
                hsn: "",
                meters: parseFloat(0).toFixed(2),
                pricePerUnit: parseFloat(0).toFixed(2),
                amount: parseFloat(0).toFixed(2),
              },
            ],
        total: bill
          ? parseFloat(bill.total).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        discountAmount: bill
          ? parseFloat(bill.discountAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        discountRate: bill
          ? parseFloat(bill.discountRate).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        subTotal: bill
          ? parseFloat(bill.subTotal).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        cgstRate: bill
          ? parseFloat(bill.cgstRate).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        cgstAmount: bill
          ? parseFloat(bill.cgstAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        sgstRate: bill
          ? parseFloat(bill.sgstRate).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        sgstAmount: bill
          ? parseFloat(bill.sgstAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        igstRate: bill
          ? parseFloat(bill.igstRate).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        igstAmount: bill
          ? parseFloat(bill.igstAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        totalAmount: bill
          ? parseFloat(bill.totalAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        roundOff: bill
          ? parseFloat(bill.roundOff).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        finalAmount: bill
          ? parseFloat(bill.finalAmount).toFixed(2)
          : parseFloat(0.0).toFixed(2),
        finalAmountInWords: bill
          ? convertToWords(parseFloat(bill.finalAmount).toFixed(2))
          : convertToWords(parseFloat(0.0).toFixed(2)),
      });
    } else if (type === "delete") {
      setSellingData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: bill._id,
        billNo: bill.billNo,
        companyId: bill.companyId,
        buyerId: bill.buyerId,
        billDate: new Date(bill.billDate).toISOString().split("T")[0],
        dueDate: bill.dueDate,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedData(null);
    setSellingData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      companyId: "",
      buyerId: "",
      billDate: formattedToday,
      dueDate: defaultDueDate,
      items: [
        {
          srNo: 1,
          item: "",
          unitType: "",
          hsn: "",
          qty: parseFloat(0.0).toFixed(2),
          pricePerUnit: parseFloat(0.0).toFixed(2),
          amount: parseFloat(0.0).toFixed(2),
        },
      ],
      total: parseFloat(0.0).toFixed(2),
      discountRate: parseFloat(0.0).toFixed(2),
      discountAmount: parseFloat(0.0).toFixed(2),
      subTotal: parseFloat(0.0).toFixed(2),
      cgstRate: parseFloat(0.0).toFixed(2),
      cgstAmount: parseFloat(0.0).toFixed(2),
      sgstRate: parseFloat(0.0).toFixed(2),
      sgstAmount: parseFloat(0.0).toFixed(2),
      igstRate: parseFloat(0.0).toFixed(2),
      igstAmount: parseFloat(0.0).toFixed(2),
      totalAmount: parseFloat(0.0).toFixed(2),
      roundOff: parseFloat(0.0).toFixed(2),
      finalAmount: parseFloat(0.0).toFixed(2),
      finalAmountInWords: convertToWords(parseFloat(0.0).toFixed(2)),
    });
  };

  const handleSave = () => {
    if (modalType === "edit") {
      if (sellingData.companyId === "") {
        showToast("Please select a buyer", "error");
        return;
      } else if (!sellingData.billDate) {
        showToast("Please select a bill date", "error");
        return;
      } else if (sellingData.items?.length === 0) {
        showToast("Please add at least one item", "error");
        return;
      } else if (
        sellingData.items.some(
          (item) =>
            !item.item ||
            !item.unitType ||
            item.qty <= 0 ||
            item.pricePerUnit <= 0
        )
      ) {
        showToast("Please fill all item details correctly", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateSelling(sellingData))
          .then((res) => {
            if (res.payload.message === "Insufficient stock!") {
              dispatch(stopLoading());
              showToast("Insufficient stock for this items", "error");
            } else if (res.payload?.success) {
              dispatch(stopLoading());
              showToast("Selling bill updated successfully", "success");
              dispatch(getSellingsByUser(loggedInUserId));
              closeModal();
            } else {
              dispatch(stopLoading());
              showToast("Failed to update item", "error");
            }
          })
          .catch((error) => {
            dispatch(stopLoading());
            showToast(
              "An error occurred while updating the selling bill",
              "error"
            );
          });
      }
    } else {
      if (sellingData.companyId === "") {
        showToast("Please select a buyer", "error");
        return;
      } else if (!sellingData.billDate) {
        showToast("Please select a bill date", "error");
        return;
      } else if (sellingData.items?.length === 0) {
        showToast("Please add at least one item", "error");
        return;
      } else if (
        sellingData.items.some(
          (item) =>
            !item.item ||
            !item.unitType ||
            item.qty <= 0 ||
            item.pricePerUnit <= 0
        )
      ) {
        showToast("Please fill all item details correctly", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addSelling(sellingData)).then((res) => {
          if (res.payload.message === "Insufficient stock!") {
            dispatch(stopLoading());
            showToast("Insufficient stock for this items", "error");
          } else if (res.payload?.success) {
            showToast("Selling bill added successfully", "success");
            dispatch(getSellingsByUser(loggedInUserId));
            closeModal();
            dispatch(stopLoading());
          } else {
            showToast("Failed to add selling bill", "error");
            dispatch(stopLoading());
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!sellingData.password) {
      showToast("Please enter your password", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteSelling(sellingData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password", "error");
        } else if (res.payload?.success) {
          dispatch(stopLoading());
          showToast("Selling bill deleted successfully", "success");
          dispatch(getSellingsByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete selling bill", "error");
        }
      });
    }
  };

  const billRef = useRef();
  const pdfRef = useRef();
  const [companyData, setCompanyData] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  const handlePrint = (row) => {
    const singleCompanyData = companies?.find(
      (company) => company?._id === row?.companyId
    );

    const singleBuyerData = buyers?.find(
      (buyer) => buyer?._id === row?.buyerId
    );

    setSellingData(row);
    setCompanyData(singleCompanyData);
    setBuyerData(singleBuyerData);
    setShouldPrint(true);
  };

  const handleDownloadPDF = (row) => {
    const singleCompanyData = companies?.find(
      (company) => company?._id === row?.companyId
    );
    const singleBuyerData = buyers?.find(
      (buyer) => buyer?._id === row?.buyerId
    );
    setSellingData(row);
    setCompanyData(singleCompanyData);
    setBuyerData(singleBuyerData);
    downloadPDFLandscape(pdfRef, `${row.billNo}-${singleBuyerData.name}.pdf`);
  };

  useEffect(() => {
    if (shouldPrint && sellingData && companyData && buyerData) {
      printElementLandscape(billRef.current);
      setShouldPrint(false);
    }
  }, [shouldPrint, sellingData, companyData, buyerData]);

  const data = sellings?.map((selling, index) => ({
    ...selling,
    srNo: index + 1,
    _id: selling._id,
    buyerId: selling.buyerId,
    companyId: selling.companyId,
    billDate: selling.billDate,
    totalAmount: selling.totalAmount,
    roundOff: selling.roundOff,
    finalAmount: selling.finalAmount,
    finalAmountInWords: selling.finalAmountInWords,
  }));

  const columns = [
    { header: "Bill No", accessor: "billNo", filterType: "text" },
    {
      header: "Buyer",
      accessor: "buyerId",
      filterType: "text",
      render: (row) => {
        const buyer = buyers?.find((buyer) => buyer._id === row);
        return buyer ? buyer.name : "N/A";
      },
    },
    {
      header: "Bill Date",
      accessor: "billDate",
      filterType: "text",
      render: (value) => formatDate(value),
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },

    {
      header: "Final Amount",
      accessor: "finalAmount",
      filterType: "text",
      render: (value) => formatRupees(value),
    },
    {
      header: "Actions",
      accessor: "actions",
      isActions: true,
      actions: [
        {
          icon: FaEye,
          onClick: (row) => openModal("view", row),
          title: "View",
          type: "view",
        },
        {
          icon: FaEdit,
          onClick: (row) => openModal("edit", row),
          title: "Edit",
          type: "edit",
        },
        {
          icon: FaTrash,
          onClick: (row) => openModal("delete", row),
          title: "Delete",
          type: "delete",
        },
        {
          icon: FaPrint,
          onClick: (row) => {
            handlePrint(row);
          },
          title: "Print",
          type: "print",
        },
        {
          icon: FaFilePdf,
          onClick: (row) => {
            handleDownloadPDF(row);
          },
          title: "Download PDF",
          type: "download",
        },
      ],
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Selling Management</h2>
          <button className="btn-add" onClick={() => openModal("add")}>
            <FaPlus />
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onSelectionChange={(selectedIds) => {
          const selected = selectedData?.filter((_, i) =>
            selectedIds.includes(i + 1)
          );
          setSelectedData(selected);
        }}
      />

      <PrintSellingBill
        ref={billRef}
        sellingData={sellingData}
        companyData={companyData}
        buyerData={buyerData}
      />

      <PdfSellingBill
        ref={pdfRef}
        sellingData={sellingData}
        companyData={companyData}
        buyerData={buyerData}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Selling Bill"
            : modalType === "edit"
            ? "Edit Selling Bill"
            : modalType === "delete"
            ? "Delete Selling Bill"
            : "Add Selling Bill"
        }
        footer={
          <>
            {modalType === "delete" ? (
              <button className="btn-danger" onClick={handleDelete}>
                Delete
              </button>
            ) : modalType === "view" ? (
              <button onClick={closeModal}>Close</button>
            ) : (
              <button className="btn-primary" onClick={handleSave}>
                {modalType === "edit" ? "Update" : "Add"}
              </button>
            )}
          </>
        }
      >
        {modalType === "view" && sellingData ? (
          <>
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <label>Buyer : </label>
                  <p>
                    {buyers?.find((buyer) => buyer._id === sellingData.buyerId)
                      ?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label>Reference : </label>
                  <p>
                    {buyers?.find((buyer) => buyer._id === sellingData.buyerId)
                      ?.reference || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-4">
                <div className="input-group">
                  <label>Company : </label>
                  <p>
                    {companies?.find(
                      (company) => company._id === sellingData.companyId
                    )?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label>Date : </label>
                  <p>{formatDate(sellingData.billDate)}</p>
                </div>
              </div>
            </div>
            <ItemTable
              items={sellingData.items}
              columns={itemsColumns}
              onItemChange={handleItemChange}
              itemOptions={allItemOptions}
            />
            <div className="row">
              <div className="col-2">
                <strong>Total</strong>
                <p>{formatRupees(sellingData.total) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Discount</strong>
                <p>{sellingData.discountRate || "0"} %</p>
                <p>{formatRupees(sellingData.discountAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Sub Total</strong>
                <p>{formatRupees(sellingData.subTotal) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>CGST</strong>
                <p>{sellingData.cgstRate || "0"} %</p>
                <p>{formatRupees(sellingData.cgstAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>SGST</strong>
                <p>{sellingData.sgstRate || "0"} %</p>
                <p>{formatRupees(sellingData.sgstAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>IGST</strong>
                <p>{sellingData.igstRate || "0"} %</p>
                <p>{formatRupees(sellingData.igstAmount) || "0"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <strong>Total Amount</strong>
                <p>{formatRupees(sellingData.totalAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Round Off</strong>
                <p>{formatRupees(sellingData.roundOff) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Final Amount:</strong>
                <p>{formatRupees(sellingData.finalAmount) || "0"}</p>
              </div>
              <div className="col-6">
                <strong>Final Amount in Words:</strong>
                <p>{sellingData.finalAmountInWords || "Zero"}</p>
              </div>
            </div>
          </>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="companyId">Company</label>
                  <select
                    name="companyId"
                    value={sellingData.companyId}
                    onChange={handleChangeSellingData}
                  >
                    <option value="">Select Company</option>
                    {companies?.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="buyerId">Buyer</label>
                  <select
                    name="buyerId"
                    value={sellingData.buyerId}
                    onChange={handleChangeSellingData}
                  >
                    <option value="">Select Merchant</option>
                    {buyers?.map((buyer) => (
                      <option key={buyer._id} value={buyer._id}>
                        {buyer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              {modalType === "edit" && (
                <div className="col-4">
                  <div className="input-group">
                    <label htmlFor="billNo">Bill No</label>
                    <input
                      type="text"
                      name="billNo"
                      value={sellingData.billNo}
                      onChange={handleChangeSellingData}
                      placeholder="Bill No"
                    />
                  </div>
                </div>
              )}

              <div className={modalType === "edit" ? "col-4" : "col-6"}>
                <div className="input-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    name="billDate"
                    value={sellingData.billDate}
                    onChange={handleChangeSellingData}
                  />
                </div>
              </div>
              <div className={modalType === "edit" ? "col-4" : "col-6"}>
                <div className="input-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={sellingData.dueDate}
                    onChange={handleChangeSellingData}
                  />
                </div>
              </div>
            </div>
            <ItemTable
              items={sellingData.items}
              columns={itemsColumns}
              onItemChange={handleItemChange}
              onRemoveItem={removeItem}
              onAddItem={addItem}
              itemOptions={allItemOptions}
            />
            <div className="row">
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="total">Total</label>
                  <input
                    type="number"
                    name="total"
                    value={sellingData.total}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="discountRate">Discount Rate (%)</label>
                  <input
                    type="number"
                    name="discountRate"
                    value={sellingData.discountRate}
                    onChange={handleChangeSellingData}
                    placeholder="Discount Rate"
                  />
                  <input
                    type="number"
                    name="discountAmount"
                    value={sellingData.discountAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="subTotal">Sub Total</label>
                  <input
                    type="number"
                    name="subTotal"
                    value={sellingData.subTotal}
                    placeholder="Sub Total"
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="cgstRate">CGST Rate (%)</label>
                  <input
                    type="number"
                    name="cgstRate"
                    value={sellingData.cgstRate}
                    onChange={handleChangeSellingData}
                    placeholder="CGST Rate"
                  />
                  <input
                    type="number"
                    name="cgstAmount"
                    value={sellingData.cgstAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="sgstRate">SGST Rate (%)</label>
                  <input
                    type="number"
                    name="sgstRate"
                    value={sellingData.sgstRate}
                    onChange={handleChangeSellingData}
                    placeholder="SGST Rate"
                  />
                  <input
                    type="number"
                    name="sgstAmount"
                    value={sellingData.sgstAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="igstRate">IGST Rate (%)</label>
                  <input
                    type="number"
                    name="igstRate"
                    value={sellingData.igstRate}
                    onChange={handleChangeSellingData}
                    placeholder="IGST Rate"
                  />
                  <input
                    type="number"
                    name="igstAmount"
                    value={sellingData.igstAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="totalAmount">Total Amount</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={sellingData.totalAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="roundOff">Round Off</label>
                  <input
                    type="number"
                    name="roundOff"
                    value={sellingData.roundOff}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="finalAmount">Final Amount</label>
                  <input
                    type="number"
                    name="finalAmount"
                    value={sellingData.finalAmount}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="input-group">
                  <label htmlFor="finalAmountInWords">
                    Final Amount in Words
                  </label>
                  <input
                    type="text"
                    name="finalAmountInWords"
                    value={sellingData.finalAmountInWords}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && sellingData ? (
          <>
            <p>Are you sure you want to delete the bill?</p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={sellingData.password}
                onChange={handleChangeSellingData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Selling;
