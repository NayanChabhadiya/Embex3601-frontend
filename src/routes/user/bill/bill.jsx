import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../contexts/toastContext/toastContext";
import { getCompaniesByUser } from "../../../store/apiSlice/companySlice";
import { getMerchantsByUser } from "../../../store/apiSlice/merchantSlice";
import {
  FaEdit,
  FaEye,
  FaFilePdf,
  FaPlus,
  FaPrint,
  FaTrash,
} from "react-icons/fa";
import {
  addBill,
  deleteBill,
  getBillByUser,
  updateBill,
} from "../../../store/apiSlice/billSlice";
import DataTable from "../../../components/datatable/dataTable";
import Modal from "../../../components/modal/modal";
import ItemTable from "../../../components/itemTable/itemTable";
import PrintBill from "../../../components/printBill/printBill";
import { printElement } from "../../../utils/printElement";
import {
  convertToWords,
  formatDate,
  formatDateForInput,
  formatRupees,
  getDueDate,
} from "../../../utils/formatters";
import PdfBill from "../../../components/pdfBill/pdfBill";
import { downloadPDF } from "../../../utils/downloadPDF";
import {
  startLoading,
  stopLoading,
} from "../../../store/apiSlice/componentSlice";

const Bill = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getCompaniesByUser(loggedInUserId));
    dispatch(getMerchantsByUser(loggedInUserId));
    dispatch(getBillByUser(loggedInUserId));
  }, [dispatch]);

  const { companies } = useSelector((state) => state.companies);
  const { merchants } = useSelector((state) => state.merchants);
  const { bills } = useSelector((state) => state.bills);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const today = new Date();
  const formattedToday = formatDateForInput(today);
  const defaultDueDate = getDueDate(today, 44);

  const [billData, setBillData] = useState({
    loggedInUserId: loggedInUserId,
    password: "",
    _id: "",
    companyId: "",
    merchantId: "",
    billDate: formattedToday,
    dueDate: defaultDueDate,
    partyChallanNo: "",
    partyChallanDate: "",
    items: [
      {
        srNo: 1,
        description: "",
        hsn: "",
        meters: parseFloat(0).toFixed(2),
        pricePerUnit: parseFloat(0).toFixed(2),
        amount: parseFloat(0).toFixed(2),
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
    if (billData.billDate) {
      const calculatedDueDate = getDueDate(billData.billDate, 44);

      setBillData((prev) => {
        if (!prev.dueDate || prev.dueDate === "") {
          return { ...prev, dueDate: calculatedDueDate };
        }
        return prev;
      });
    }
  }, [billData.billDate]);

  const handleChangeBillData = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...billData, [name]: value };

    if (name === "billDate") {
      const newDueDate = getDueDate(value, 44);
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

    // const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;
    // const roundedTotal = Math.round(totalAmount);
    // const roundOff = +(roundedTotal - totalAmount).toFixed(2);
    // const finalAmount = roundedTotal;
    const totalAmount = Number(
      (subTotal + cgstAmount + sgstAmount + igstAmount).toFixed(2),
    );

    const roundedTotal = Math.round(totalAmount);
    const roundOff = Number((roundedTotal - totalAmount).toFixed(2));
    const finalAmount = roundedTotal;

    updatedData.total = total.toFixed(2);
    updatedData.discountAmount = discountAmount.toFixed(2);
    updatedData.subTotal = subTotal.toFixed(2);
    updatedData.cgstAmount = cgstAmount.toFixed(2);
    updatedData.sgstAmount = sgstAmount.toFixed(2);
    updatedData.igstAmount = igstAmount.toFixed(2);
    updatedData.totalAmount = totalAmount.toFixed(2);

    updatedData.roundOff = roundOff.toFixed(2);
    updatedData.finalAmount = finalAmount.toFixed(2);
    updatedData.finalAmountInWords = convertToWords(finalAmount);

    setBillData(updatedData);
  };

  const calculateTotal = (items) => {
    const total = items?.reduce((sum, item) => {
      const amt = parseFloat(item.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const discountRate = parseFloat(billData.discountRate) || 0;
    const discountAmount = (total * discountRate) / 100;
    const subTotal = total - discountAmount;
    const cgstRate = parseFloat(billData.cgstRate) || 0;
    const cgstAmount = (subTotal * cgstRate) / 100;
    const sgstRate = parseFloat(billData.sgstRate) || 0;
    const sgstAmount = (subTotal * sgstRate) / 100;
    const igstRate = parseFloat(billData.igstRate) || 0;
    const igstAmount = (subTotal * igstRate) / 100;
    // const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

    // const roundedTotal = Math.round(totalAmount);
    // const roundOff = +(roundedTotal - totalAmount).toFixed(2);
    // const finalAmount = roundedTotal;

    const totalAmount = Number(
      (subTotal + cgstAmount + sgstAmount + igstAmount).toFixed(2),
    );

    const roundedTotal = Math.round(totalAmount);
    const roundOff = Number((roundedTotal - totalAmount).toFixed(2));
    const finalAmount = roundedTotal;

    setBillData((prev) => ({
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
      roundOff: roundOff.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      finalAmountInWords: convertToWords(finalAmount),
    }));
  };

  const itemsColumns = [
    { key: "srNo", label: "#", type: "readonly", width: "5%" },
    { key: "description", label: "Description", type: "text", width: "35%" },
    { key: "hsn", label: "HSN Code", type: "number", width: "15%" },
    { key: "meters", label: "Meters", type: "number", width: "15%" },
    {
      key: "pricePerUnit",
      label: "Price Per Unit",
      type: "number",
      width: "15%",
    },
    { key: "amount", label: "Amount", type: "readonly", width: "15%" },
  ];

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...billData.items];

    if (field === "item") {
      updatedItems[index][field] = value;

      const selectedItem = items?.find((opt) => opt._id === value);
      updatedItems[index].unitType = selectedItem ? selectedItem.unitType : "";
    } else {
      updatedItems[index][field] = value;
    }

    const meters = parseFloat(updatedItems[index].meters) || 0;
    const price = parseFloat(updatedItems[index].pricePerUnit) || 0;
    if (meters > 0 && price > 0) {
      updatedItems[index].amount = (meters * price).toFixed(2);
    } else {
      updatedItems[index].amount = 0;
    }

    setBillData({
      ...billData,
      items: updatedItems,
    });

    calculateTotal(updatedItems);
  };

  const addItem = () => {
    setBillData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          hsn: "",
          meters: parseFloat(0).toFixed(2),
          pricePerUnit: parseFloat(0).toFixed(2),
          amount: parseFloat(0).toFixed(2),
        },
      ],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = billData.items?.filter((_, i) => i !== index);
    setBillData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
    calculateTotal(updatedItems);
  };

  const openModal = (type, bill = null) => {
    setModalType(type);
    if (type === "view") {
      setBillData({
        loggedInUserId: loggedInUserId,
        _id: bill._id,
        billNo: bill.billNo,
        companyId: bill.companyId,
        merchantId: bill.merchantId,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        partyChallanNo: bill.partyChallanNo,
        partyChallanDate: bill.partyChallanDate,
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
      setBillData({
        loggedInUserId,
        _id: bill ? bill._id : "",
        billNo: bill ? bill.billNo : "",
        companyId: bill ? bill.companyId : "",
        merchantId: bill ? bill.merchantId : "",
        billDate: bill ? formatDateForInput(bill.billDate) : formattedToday,
        dueDate: bill ? formatDateForInput(bill.dueDate) : defaultDueDate,
        partyChallanNo: bill ? bill.partyChallanNo : "",
        partyChallanDate:
          bill && bill.partyChallanDate
            ? formatDateForInput(bill.partyChallanDate)
            : "",
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
                description: "",
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
      setBillData({
        loggedInUserId: loggedInUserId,
        password: "",
        _id: bill._id,
        billNo: bill.billNo,
        companyId: bill.companyId,
        merchantId: bill.merchantId,
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
    setBillData({
      loggedInUserId: loggedInUserId,
      password: "",
      _id: "",
      companyId: "",
      merchantId: "",
      billDate: formattedToday,
      dueDate: getDueDate(formattedToday, 44),
      partyChallanNo: "",
      partyChallanDate: "",
      items: [
        {
          srNo: 1,
          description: "",
          hsn: "",
          meters: parseFloat(0).toFixed(2),
          pricePerUnit: parseFloat(0).toFixed(2),
          amount: parseFloat(0).toFixed(2),
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
      if (!billData.companyId) {
        showToast("Please select a company.", "error");
        return;
      } else if (!billData.merchantId) {
        showToast("Please select a merchant.", "error");
        return;
      } else if (!billData.billDate) {
        showToast("Please select a bill date.", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(updateBill(billData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Bill updated successfully.", "success");
            dispatch(getBillByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to update bill.", "error");
          }
        });
      }
    } else {
      if (!billData.companyId) {
        showToast("Please select a company.", "error");
        return;
      } else if (!billData.merchantId) {
        showToast("Please select a merchant.", "error");
        return;
      } else if (!billData.billDate) {
        showToast("Please select a bill date.", "error");
        return;
      } else {
        dispatch(startLoading());
        dispatch(addBill(billData)).then((res) => {
          if (res.payload.success) {
            dispatch(stopLoading());
            showToast("Bill added successfully.", "success");
            dispatch(getBillByUser(loggedInUserId));
            closeModal();
          } else {
            dispatch(stopLoading());
            showToast("Failed to add bill.", "error");
          }
        });
      }
    }
  };

  const handleDelete = () => {
    if (!billData.password) {
      showToast("Please enter your password to confirm deletion.", "error");
      return;
    } else {
      dispatch(startLoading());
      dispatch(deleteBill(billData)).then((res) => {
        if (res.payload.message === "Incorrect password!") {
          dispatch(stopLoading());
          showToast("Incorrect password!", "error");
        } else if (res.payload.success) {
          dispatch(stopLoading());
          showToast("Bill deleted successfully.", "success");
          dispatch(getBillByUser(loggedInUserId));
          closeModal();
        } else {
          dispatch(stopLoading());
          showToast("Failed to delete bill.", "error");
        }
      });
    }
  };

  const billRef = useRef();
  const pdfRef = useRef();
  const [companyData, setCompanyData] = useState(null);
  const [merchantData, setMerchantData] = useState(null);
  const [shouldPrint, setShouldPrint] = useState(false);

  const handlePrint = (row) => {
    const singleCompanyData = companies?.find(
      (company) => company?._id === row?.companyId,
    );

    const singleMerchantData = merchants?.find(
      (merchant) => merchant?._id === row?.merchantId,
    );

    setBillData(row);
    setCompanyData(singleCompanyData);
    setMerchantData(singleMerchantData);
    setShouldPrint(true);
  };

  const handleDownloadPDF = (row) => {
    const singleCompanyData = companies?.find(
      (company) => company?._id === row?.companyId,
    );
    const singleMerchantData = merchants?.find(
      (merchant) => merchant?._id === row?.merchantId,
    );
    setBillData(row);
    setCompanyData(singleCompanyData);
    setMerchantData(singleMerchantData);
    downloadPDF(pdfRef, `${row.billNo}-${singleMerchantData.name}.pdf`);
  };

  useEffect(() => {
    if (shouldPrint && billData && companyData && merchantData) {
      printElement(billRef.current);
      setShouldPrint(false);
    }
  }, [shouldPrint, billData, companyData, merchantData]);
  const extractBillNumber = (billNo) => {
    if (!billNo) return 0;
    const match = billNo.match(/(\d+)$/);
    return match ? parseInt(match[1]) : 0;
  };
  const data = bills
    ?.slice()
    ?.sort((a, b) => {
      const dateA = new Date(a.billDate);
      const dateB = new Date(b.billDate);

      // Sort by date (latest first)
      if (dateB - dateA !== 0) return dateB - dateA;

      // If same date → sort by last number (DESC)
      const numA = extractBillNumber(a.billNo);
      const numB = extractBillNumber(b.billNo);

      return numB - numA;
    })
    ?.map((bill, index) => ({
      ...bill,
      srNo: index + 1,
      billNo: bill.billNo || "N/A",
      billDate: bill.billDate,
      dueDate: bill.dueDate,
      companyName: companies?.find((c) => c._id === bill.companyId)?.name,
      merchantName: merchants?.find((m) => m._id === bill.merchantId)?.name,
    }));

  const columns = [
    {
      header: "Sr No",
      accessor: "srNo",
      filterType: "text",
    },
    { header: "Bill No", accessor: "billNo", filterType: "text" },
    {
      header: "Bill Date",
      accessor: "billDate",
      render: (value) => formatDate(value),
      filterType: "date-range",
      size: "md",
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      render: (value) => formatDate(value),
    },
    { header: "Company Name", accessor: "companyName", filterType: "text" },
    { header: "Merchant Name", accessor: "merchantName", filterType: "text" },
    { header: "Dis. Rate", accessor: "discountRate", filterType: "text" },
    {
      header: "Final Amount",
      accessor: "finalAmount",
      render: (value) => formatRupees(value),
      filterType: "text",
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

  const exportFields = [
    { accessor: "billNo", header: "Bill No" },
    {
      accessor: "billDate",
      header: "Bill Date",
      render: (value) => formatDate(value),
    },
    {
      accessor: "dueDate",
      header: "Due Date",
      render: (value) => formatDate(value),
    },
    { accessor: "companyName", header: "Company Name" },
    { accessor: "merchantName", header: "Party Name" },
    {
      accessor: "partyChallanDate",
      header: "Party Challan Date",
      render: (value) => formatDate(value),
    },
    { accessor: "partyChallanNo", header: "Party Challan No" },
    {
      accessor: "merchantGstNo",
      header: "Party GST No",
      render: (_, row) => {
        const merchant = merchants?.find((m) => m._id === row.merchantId);
        return merchant?.gstNo || "--";
      },
    },
    { accessor: "srNo", header: "Item Sr No" },
    { accessor: "description", header: "Description" },
    { accessor: "hsn", header: "HSN Code" },
    { accessor: "meters", header: "Meters" },
    { accessor: "pricePerUnit", header: "Per/Meters" },
    {
      accessor: "amount",
      header: "Total Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "total",
      header: "Taxable Amount",
      render: (value) => formatRupees(value),
    },
    { accessor: "discountRate", header: "Discount Rate (%)" },
    {
      accessor: "discountAmount",
      header: "Discount Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "subTotal",
      header: "Sub Total",
      render: (value) => formatRupees(value),
    },
    { accessor: "cgstRate", header: "CGST Rate (%)" },
    {
      accessor: "cgstAmount",
      header: "CGST Amount",
      render: (value) => formatRupees(value),
    },
    { accessor: "sgstRate", header: "SGST Rate (%)" },
    {
      accessor: "sgstAmount",
      header: "SGST Amount",
      render: (value) => formatRupees(value),
    },
    { accessor: "igstRate", header: "IGST Rate (%)" },
    {
      accessor: "igstAmount",
      header: "IGST Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "totalAmount",
      header: "Total Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "roundOff",
      header: "Round Off",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "finalAmount",
      header: "Final Amount",
      render: (value) => formatRupees(value),
    },
    { accessor: "finalAmountInWords", header: "Final Amount in Words" },
  ];
  const ledgerFields = [
    { accessor: "billNo", header: "Bill No" },
    {
      accessor: "billDate",
      header: "Bill Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
    {
      accessor: "total",
      header: "Taxable Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "discountAmount",
      header: "Discount Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "cgstAmount",
      header: "CGST Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "sgstAmount",
      header: "SGST Amount",
      render: (value) => formatRupees(value),
    },
    {
      accessor: "finalAmount",
      header: "Bill Amount",
      grandTotal: true,
      render: (val) => `₹${parseFloat(val || 0).toLocaleString("en-IN")}`,
    },
    {
      accessor: "einv",
      header: "E-inv.",
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="header-actions">
          <h2 className="page-title">Bill Management</h2>
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
            selectedIds.includes(i + 1),
          );
          setSelectedData(selected);
        }}
        exportFields={exportFields}
        ledgerFields={ledgerFields}
      />

      <PrintBill
        ref={billRef}
        billData={billData}
        companyData={companyData}
        merchantData={merchantData}
      />

      <PdfBill
        ref={pdfRef}
        billData={billData}
        companyData={companyData}
        merchantData={merchantData}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          modalType === "view"
            ? "View Bill"
            : modalType === "edit"
              ? "Edit Bill"
              : modalType === "delete"
                ? "Delete Bill"
                : "Add Bill"
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
        {modalType === "view" && billData ? (
          <div>
            <div className="row">
              <div className="col-3">
                <strong>Bill No</strong>
                <p>{billData.billNo || "N/A"}</p>
              </div>
              <div className="col-4">
                <strong>Company</strong>
                <p>
                  {companies?.find(
                    (company) => company._id === billData.companyId,
                  )?.name || "N/A"}
                </p>
              </div>
              <div className="col-5">
                <strong>Merchant</strong>
                <p>
                  {merchants?.find(
                    (merchant) => merchant._id === billData.merchantId,
                  )?.name || "N/A"}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <strong>Bill Date</strong>
                <p>
                  {billData.billDate ? formatDate(billData.billDate) : "--"}
                </p>
              </div>
              <div className="col-3">
                <strong>Due Date</strong>
                <p>{billData.dueDate ? formatDate(billData.dueDate) : "--"}</p>
              </div>
              <div className="col-3">
                <strong>Party Challan No</strong>
                <p>{billData.partyChallanNo || "--"}</p>
              </div>
              <div className="col-3">
                <strong>Party Challan Date</strong>
                <p>
                  {billData.partyChallanDate
                    ? formatDate(billData.partyChallanDate)
                    : "--"}
                </p>
              </div>
            </div>
            <ItemTable
              items={billData.items}
              columns={itemsColumns}
              readOnly={true}
              onItemChange={handleItemChange}
              onRemoveItem={removeItem}
              onAddItem={addItem}
            />
            <div className="row">
              <div className="col-2">
                <strong>Total</strong>
                <p>{formatRupees(billData.total) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Discount</strong>
                <p>{billData.discountRate || "0"} %</p>
                <p>{formatRupees(billData.discountAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Sub Total</strong>
                <p>{formatRupees(billData.subTotal) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>CGST</strong>
                <p>{billData.cgstRate || "0"} %</p>
                <p>{formatRupees(billData.cgstAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>SGST</strong>
                <p>{billData.sgstRate || "0"} %</p>
                <p>{formatRupees(billData.sgstAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>IGST</strong>
                <p>{billData.igstRate || "0"} %</p>
                <p>{formatRupees(billData.igstAmount) || "0"}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-2">
                <strong>Total Amount</strong>
                <p>{formatRupees(billData.totalAmount) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Round Off</strong>
                <p>{formatRupees(billData.roundOff) || "0"}</p>
              </div>
              <div className="col-2">
                <strong>Final Amount:</strong>
                <p>{formatRupees(billData.finalAmount) || "0"}</p>
              </div>
              <div className="col-6">
                <strong>Final Amount in Words:</strong>
                <p>{billData.finalAmountInWords || "Zero"}</p>
              </div>
            </div>
          </div>
        ) : modalType === "edit" || modalType === "add" ? (
          <>
            <div className="row">
              {modalType === "edit" && (
                <>
                  <div className="col-2">
                    <div className="input-group">
                      <label htmlFor="billNo">Bill No</label>
                      <input
                        type="text"
                        name="billNo"
                        value={billData.billNo}
                        onChange={handleChangeBillData}
                        placeholder="Bill No"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className={`col-${modalType === "edit" ? "5" : "6"}`}>
                <div className="input-group">
                  <label htmlFor="companyId">Select Company</label>
                  <select
                    name="companyId"
                    value={billData.companyId}
                    onChange={handleChangeBillData}
                  >
                    <option value="">Select Company</option>
                    {companies
                      ?.slice()
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={`col-${modalType === "edit" ? "5" : "6"}`}>
                <div className="input-group">
                  <label htmlFor="merchantId">Select Merchant</label>
                  <select
                    name="merchantId"
                    value={billData.merchantId}
                    onChange={handleChangeBillData}
                  >
                    <option value="">Select Merchant</option>
                    {merchants
                      ?.slice()
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((merchant) => (
                        <option key={merchant._id} value={merchant._id}>
                          {merchant.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="billDate">Bill Date</label>
                  <input
                    type="date"
                    name="billDate"
                    value={billData.billDate}
                    onChange={handleChangeBillData}
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={billData.dueDate}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="partyChallanNo">Party Challan No</label>
                  <input
                    type="text"
                    name="partyChallanNo"
                    value={billData.partyChallanNo}
                    onChange={handleChangeBillData}
                    placeholder="Party challan No"
                  />
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <label htmlFor="partyChallanDate">Party Challan Date</label>
                  <input
                    type="date"
                    name="partyChallanDate"
                    value={billData.partyChallanDate}
                    onChange={handleChangeBillData}
                  />
                </div>
              </div>
            </div>
            <ItemTable
              items={billData.items}
              columns={itemsColumns}
              onItemChange={handleItemChange}
              onRemoveItem={removeItem}
              onAddItem={addItem}
            />
            <div className="row">
              <div className="col-2">
                <div className="input-group">
                  <label htmlFor="total">Total</label>
                  <input
                    type="number"
                    name="total"
                    value={billData.total}
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
                    value={billData.discountRate}
                    onChange={handleChangeBillData}
                    placeholder="Discount Rate"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                  <input
                    type="number"
                    name="discountAmount"
                    value={billData.discountAmount}
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
                    value={billData.subTotal}
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
                    value={billData.cgstRate}
                    onChange={handleChangeBillData}
                    placeholder="CGST Rate"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                  <input
                    type="number"
                    name="cgstAmount"
                    value={billData.cgstAmount}
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
                    value={billData.sgstRate}
                    onChange={handleChangeBillData}
                    placeholder="SGST Rate"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                  <input
                    type="number"
                    name="sgstAmount"
                    value={billData.sgstAmount}
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
                    value={billData.igstRate}
                    onChange={handleChangeBillData}
                    placeholder="IGST Rate"
                    onKeyDown={(e) => {
                      if (
                        e.keyCode === 38 ||
                        e.keyCode === 40 ||
                        e.key === "e" ||
                        e.key === "E" ||
                        e.key === "-" ||
                        e.key === "+"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onWheel={(event) => event.currentTarget.blur()}
                  />
                  <input
                    type="number"
                    name="igstAmount"
                    value={billData.igstAmount}
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
                    value={billData.totalAmount}
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
                    value={billData.roundOff}
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
                    value={billData.finalAmount}
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
                    value={billData.finalAmountInWords}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </>
        ) : modalType === "delete" && billData ? (
          <>
            <p>Are you sure you want to delete the bill "{billData.billNo}"?</p>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={billData.password}
                onChange={handleChangeBillData}
                placeholder="Enter password"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default Bill;
