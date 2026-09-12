// export const SIDEBAR_MENU = [
//   {
//     key: "dashboard",
//     label: "Dashboard",
//     path: "/",
//     permission: "dashboard.view",
//   },

//   {
//     key: "customers",
//     label: "Customers",
//     path: "/customers",
//     permission: "customers.view",
//   },

//   {
//     key: "vendors",
//     label: "Vendors",
//     path: "/vendors",
//     permission: "vendors.view",
//   },

//   {
//     key: "products",
//     label: "Products",
//     path: "/products",
//     permission: "products.view",
//   },

//   {
//     key: "invoices",
//     label: "Invoices",
//     path: "/invoices",
//     permission: "invoices.view",
//   },

//   {
//     key: "sales",
//     label: "Sales",
//     path: "/sales",
//     permission: "sales.view",
//   },

//   {
//     key: "purchases",
//     label: "Purchases",
//     path: "/purchases",
//     permission: "purchases.view",
//   },
// ];
export const SIDEBAR_MENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/",
  },

  {
    key: "business",
    label: "Business",
    children: [
      {
        key: "customers",
        label: "Customers",
        path: "/customers",
      },
      {
        key: "vendors",
        label: "Vendors",
        path: "/vendors",
      },
      {
        key: "products",
        label: "Products",
        path: "/products",
      },
    ],
  },

  {
    key: "transactions",
    label: "Transactions",
    children: [
      {
        key: "invoices",
        label: "Invoices",
        path: "/invoices",
      },
      {
        key: "sales",
        label: "Sales",
        path: "/sales",
      },
      {
        key: "purchases",
        label: "Purchases",
        path: "/purchases",
      },
    ],
  },
];
