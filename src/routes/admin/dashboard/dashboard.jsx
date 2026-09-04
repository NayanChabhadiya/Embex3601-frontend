import "./dashboard.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUsers } from "../../../store/apiSlice/userSlice";
import CountUp from "../../../components/countUp/countUp";
import { getSubscriptionPlans } from "../../../store/apiSlice/subscriptionPlanSlice";
import { getItemsByUser } from "../../../store/apiSlice/itemSlice";
import { getSupplierCategoriesByUser } from "../../../store/apiSlice/supplierCategorySlice";
import { getSuppliersByUser } from "../../../store/apiSlice/supplierSlice";
import { getPurchaseCompanyByUser } from "../../../store/apiSlice/purchaseCompanySlice";
import { getPurchasedItemsByUser } from "../../../store/apiSlice/purchasedItemSlice";
import { getCompaniesByUser } from "../../../store/apiSlice/companySlice";
import { getMerchantsByUser } from "../../../store/apiSlice/merchantSlice";
import { getBillByUser } from "../../../store/apiSlice/billSlice";
import { FaFileInvoiceDollar, FaUser, FaUserTie } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatRupees } from "../../../utils/formatters";
import { getBuyersByUser } from "../../../store/apiSlice/buyerSlice";
import { getSellingsByUser } from "../../../store/apiSlice/sellingSlice";
import { getWorkerByUser } from "../../../store/apiSlice/workerSlice";
import { getMachinesByUser } from "../../../store/apiSlice/machineSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const loggedInUserId = JSON.parse(localStorage.getItem("authUser"))?._id;

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getSubscriptionPlans());
    dispatch(getItemsByUser(loggedInUserId));
    dispatch(getSupplierCategoriesByUser(loggedInUserId));
    dispatch(getSuppliersByUser(loggedInUserId));
    dispatch(getPurchaseCompanyByUser(loggedInUserId));
    dispatch(getPurchasedItemsByUser(loggedInUserId));
    dispatch(getCompaniesByUser(loggedInUserId));
    dispatch(getMerchantsByUser(loggedInUserId));
    dispatch(getBillByUser(loggedInUserId));
    dispatch(getBuyersByUser(loggedInUserId));
    dispatch(getSellingsByUser(loggedInUserId));
    dispatch(getWorkerByUser(loggedInUserId));
    dispatch(getMachinesByUser(loggedInUserId));
  }, [dispatch]);

  const { user } = useSelector((state) => state.auth);

  const { suppliers } = useSelector((state) => state.suppliers);
  const { purchaseCompanies } = useSelector((state) => state.purchaseCompanies);
  const { companies } = useSelector((state) => state.companies);
  const { merchants } = useSelector((state) => state.merchants);
  const { bills } = useSelector((state) => state.bills);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const totalPurchasesAmount = purchaseCompanies?.reduce((total, company) => {
    const companyTotal = company.monthlyBills?.reduce(
      (sum, bill) => sum + (bill?.totalAmount || 0),
      0
    );
    return total + companyTotal;
  }, 0);

  const totalPaidAmount = purchaseCompanies?.reduce((total, company) => {
    const companyTotal = company.paidAmountHistory?.reduce(
      (sum, paidAmountHistory) => sum + (paidAmountHistory?.amount || 0),
      0
    );
    return total + companyTotal;
  }, 0);

  const totalPendingAmount = totalPurchasesAmount - totalPaidAmount;

  const totalJobWorkBilling = merchants?.reduce((total, merchant) => {
    const merchantTotal = merchant.monthlyJobWorks?.reduce(
      (sum, bill) => sum + (bill?.totalAmount || 0),
      0
    );
    return total + merchantTotal;
  }, 0);

  const totalReceivedAmount = merchants?.reduce((total, merchant) => {
    const merchantTotal = merchant.receivedAmountHistory?.reduce(
      (sum, receivedAmountHistory) =>
        sum + (receivedAmountHistory?.amount || 0),
      0
    );
    return total + merchantTotal;
  }, 0);

  const totalPendingPayment = totalJobWorkBilling - totalReceivedAmount;

  const generateMerchantMonthlyTotals = (
    merchants = [],
    selectedYear = new Date().getFullYear()
  ) => {
    const monthMap = Array(12).fill(0); // Jan to Dec

    merchants?.forEach((merchant) => {
      merchant.monthlyJobWorks?.forEach((job) => {
        const { year, month, totalAmount } = job;
        if (year === selectedYear && month) {
          const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // Convert month name to index
          if (!isNaN(monthIndex)) {
            monthMap[monthIndex] += parseFloat(totalAmount) || 0;
          }
        }
      });
    });

    return monthMap.map((amount) => parseFloat(amount.toFixed(2))); // Round to 2 decimals
  };

  const generateMonthlyExpenseTotals = (
    expenses = [],
    selectedYear = new Date().getFullYear()
  ) => {
    const monthMap = Array(12).fill(0);
    purchaseCompanies?.forEach((purchaseCompany) => {
      purchaseCompany.monthlyBills?.forEach((job) => {
        const { year, month, totalAmount } = job;
        if (year === selectedYear && month) {
          const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // Convert month name to index
          if (!isNaN(monthIndex)) {
            monthMap[monthIndex] += parseFloat(totalAmount) || 0;
          }
        }
      });
    });

    // expenses?.forEach((bill) => {
    //   const { year, month, totalAmount } = bill;
    //   if (year === selectedYear && month) {
    //     const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    //     if (!isNaN(monthIndex)) {
    //       monthMap[monthIndex] += parseFloat(totalAmount) || 0;
    //     }
    //   }
    // });

    return monthMap.map((amount) => parseFloat(amount.toFixed(2)));
  };

  const merchantTotals = generateMerchantMonthlyTotals(merchants, selectedYear);

  // const expenseTotals = generateMonthlyExpenseTotals(
  //   purchaseCompanies,
  //   selectedYear
  // );

  const expenseTotals = generateMonthlyExpenseTotals(
    purchaseCompanies,
    selectedYear
  );

  const maxMerchantValue = Math.max(...merchantTotals);
  const maxExpenseValue = Math.max(...expenseTotals);
  const maxValue = Math.max(maxMerchantValue, maxExpenseValue);
  const roundedMax = Math.ceil(maxValue / 1000000) * 1000000;

  const chartData = months?.map((month, index) => ({
    name: month,
    merchants: merchantTotals[index],
    expenses: expenseTotals[index],
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>WELCOME BACK, {user?.firstName + " " + user?.lastName} 👋</p>
      </div>
      <div className="dashboard-cards">
        <div className="card card-cyan">
          <div className="card-icon">
            <FaUserTie />
          </div>
          <h4>Purchase Companies</h4>
          <p>
            <CountUp end={purchaseCompanies?.length || 0} />
          </p>
        </div>
        <div className="card card-violet">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Purchases Amount</h4>
          <p>
            <CountUp
              end={totalPurchasesAmount ? totalPurchasesAmount.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-teal">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Paid Amount</h4>
          <p>
            <CountUp
              end={totalPaidAmount ? totalPaidAmount.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-red">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Pending Amount</h4>
          <p>
            <CountUp
              end={totalPendingAmount ? totalPendingAmount.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-pink">
          <div className="card-icon">
            <FaUserTie />
          </div>
          <h4>Total Merchants</h4>
          <p>
            <CountUp end={merchants?.length || 0} />
          </p>
        </div>
        <div className="card card-violet">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Job Work Billing</h4>
          <p>
            <CountUp
              end={totalJobWorkBilling ? totalJobWorkBilling.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-teal">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Received Payment</h4>
          <p>
            <CountUp
              end={totalReceivedAmount ? totalReceivedAmount.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-red">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Pending Payment</h4>
          <p>
            <CountUp
              end={totalPendingPayment ? totalPendingPayment.toFixed(2) : 0}
              prefix="₹"
            />
          </p>
        </div>
        <div className="card card-green">
          <div className="card-icon">
            <FaFileInvoiceDollar />
          </div>
          <h4>Total Bills</h4>
          <p>
            <CountUp end={bills?.length || 0} />
          </p>
        </div>
        <div className="card card-red">
          <div className="card-icon">
            <FaUserTie />
          </div>
          <h4>Suppliers</h4>
          <p>
            <CountUp end={suppliers?.length || 0} />
          </p>
        </div>

        <div className="card card-brown">
          <div className="card-icon">
            <FaUser />
          </div>
          <h4>Total Companies</h4>
          <p>
            <CountUp end={companies?.length || 0} />
          </p>
        </div>
      </div>
      <div className="year-filter">
        <label htmlFor="year">Filter by Year: </label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {[currentYear, currentYear - 1, currentYear - 2]?.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="dashboard-charts-row">
        <div className="chart-box">
          <h3>Monthly Job Work Billing Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                allowDecimals={false}
                domain={[0, roundedMax]}
                tickFormatter={(value) => formatRupees(value)}
              />
              <Tooltip formatter={(value) => formatRupees(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="merchants"
                stroke="#ffc107"
                strokeWidth={2}
                name="Job Work Billing"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Monthly Expenses Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 60, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                allowDecimals={false}
                domain={[0, roundedMax]}
                tickFormatter={(value) => formatRupees(value)}
              />
              <Tooltip formatter={(value) => formatRupees(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#00bcd4"
                strokeWidth={2}
                name="Monthly Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
