export const SIDEBAR_MENU = [
  {
    key: "dashboard",
    type: "item",
    label: "Dashboard",
    path: "/",
    icon: "dashboard",
  },

  // --------------------------------------------------------------------------
  // Customer Subscription
  // --------------------------------------------------------------------------

  {
    key: "subscription",
    type: "item",
    label: "Subscription",
    path: "/subscription",
    icon: "credit-card",
  },

  // --------------------------------------------------------------------------
  // Platform Administration
  // --------------------------------------------------------------------------

  {
    key: "platform-admin",
    type: "group",
    label: "Platform Administration",
    access: "platform-admin",
    children: [
      {
        key: "users",
        type: "item",
        label: "Users",
        path: "/users",
        icon: "users",
        access: "platform-admin",
      },
      {
        key: "platform-admin-subscription-plans",
        type: "item",
        label: "Subscription Plans",
        path: "/subscription-plans",
        icon: "credit-card",
        access: "platform-admin",
      },
      {
        key: "platform-admin-features",
        type: "item",
        label: "Features",
        path: "/features",
        icon: "credit-card",
        access: "platform-admin",
      },
      {
        key: "platform-admin-plan-features",
        type: "item",
        label: "Plan Features",
        path: "/plan-features",
        icon: "credit-card",
        access: "platform-admin",
      },
    ],
  },

  {
    key: "masters",
    type: "group",
    label: "Masters",
    children: [
      {
        key: "customers",
        type: "item",
        label: "Customers",
        path: "/customers",
        icon: "customers",
      },
      {
        key: "vendors",
        type: "item",
        label: "Vendors",
        path: "/vendors",
        icon: "vendors",
      },
      {
        key: "products",
        type: "item",
        label: "Products",
        path: "/products",
        icon: "products",
      },
    ],
  },

  {
    key: "sales",
    type: "group",
    label: "Sales",
    children: [
      {
        key: "invoices",
        type: "item",
        label: "Invoices",
        path: "/invoices",
        icon: "invoices",
      },
      {
        key: "sales-orders",
        type: "item",
        label: "Sales Orders",
        path: "/sales-orders",
        icon: "sales",
      },
    ],
  },

  {
    key: "purchase",
    type: "group",
    label: "Purchase",
    children: [
      {
        key: "purchase-orders",
        type: "item",
        label: "Purchase Orders",
        path: "/purchase-orders",
        icon: "purchases",
      },
    ],
  },
];
