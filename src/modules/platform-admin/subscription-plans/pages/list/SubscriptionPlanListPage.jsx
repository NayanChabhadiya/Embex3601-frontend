import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Table from "../../../../../components/common/table/Table";
import PageHeader from "../../../../../components/layout/page/components/PageHeader";

import { fetchSubscriptionPlans } from "../../store/subscription-plan.thunks.js";

import {
  selectSubscriptionPlans,
  selectSubscriptionPlansStatus,
  selectSubscriptionPlansError,
} from "../../store/subscription-plan.selectors.js";
import { selectSubscriptionPlansMeta } from "../../store/subscription-plan.selectors.js";

function SubscriptionPlanListPage() {
  const dispatch = useDispatch();

  const plans = useSelector(selectSubscriptionPlans);
  const status = useSelector(selectSubscriptionPlansStatus);
  const error = useSelector(selectSubscriptionPlansError);
  const meta = useSelector(selectSubscriptionPlansMeta);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    dispatch(
      fetchSubscriptionPlans({
        page,
        limit,
        search,
      }),
    );
  }, [dispatch, page, limit, search]);

  const columns = [
    {
      key: "_id",
      label: "ID",
    },
    {
      key: "name",
      label: "Plan Name",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  return (
    <section>
      <PageHeader
        title="Subscription Plans"
        description="Manage Embex360 subscription plans."
      />

      {error && <p>{error}</p>}

      <Table
        title="Subscription Plans"
        columns={columns}
        data={plans}
        rowKey="_id"
        loading={status === "loading"}
        emptyMessage="No subscription plans found."
        pagination={meta}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search subscription plans..."
      />
    </section>
  );
}

export default SubscriptionPlanListPage;
