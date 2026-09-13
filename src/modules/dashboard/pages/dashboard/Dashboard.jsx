import { useEffect, useState } from "react";
import { SummaryCard } from "../../../../components/common/card";
import { Grid } from "../../../../components/common/grid";
import { Table } from "../../../../components/common/table";
import PageHeader from "../../../../components/layout/page/components/PageHeader";
import PageSection from "../../../../components/layout/page/components/PageSection";

function Dashboard() {
  const columns = [
    {
      key: "invoiceNumber",
      label: "Invoice",
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "invoiceDate",
      label: "Date",
    },
    {
      key: "amount",
      label: "Amount",
    },
    {
      key: "status",
      label: "Status",
    },
  ];
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);
  return (
    <div className="dashboard">
      <PageHeader title="Dashboard" description="Overview of your business" />

      <PageSection title="Overview">
        <Grid columns={4} gap={16}>
          <SummaryCard
            title="Total Sales"
            value="₹0"
            description="vs last month"
            trend="+0%"
            trendType="positive"
          />

          <SummaryCard
            title="Total Purchases"
            value="₹0"
            description="vs last month"
            trend="+0%"
            trendType="neutral"
          />

          <SummaryCard
            title="Total Receivables"
            value="₹0"
            description="Outstanding"
            trend="0%"
            trendType="neutral"
          />

          <SummaryCard
            title="Total Payables"
            value="₹0"
            description="Outstanding"
            trend="0%"
            trendType="neutral"
          />
        </Grid>
      </PageSection>
      <PageSection title="Recent Invoices">
        <Table
          title="Recent Invoices"
          rowKey="_id"
          columns={columns}
          data={[]}
          emptyMessage="No recent invoices."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          pagination={null}
        />
      </PageSection>
    </div>
  );
}

export default Dashboard;
