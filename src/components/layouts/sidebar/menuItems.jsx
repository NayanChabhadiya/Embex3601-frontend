import {
  FcBusinessContact,
  FcBusinessman,
  FcCalculator,
  FcComboChart,
  FcContacts,
  FcDebt,
  FcEngineering,
  FcFactory,
  FcHome,
  FcManager,
  FcPackage,
  FcShop,
} from "react-icons/fc";

const Menuitems = [
  {
    path: "/",
    name: "Dashboard",
    icon: FcComboChart,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  // {
  //   path: "/home",
  //   name: "Home",
  //   icon: FcHome,
  //   allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  // },
  {
    path: "/user",
    name: "Users",
    icon: FcManager,
    allowedPlans: ["ADMIN"],
  },
  {
    path: "/subscription-plans",
    name: "Subscription Plans",
    icon: FcBusinessman,
    allowedPlans: ["ADMIN"],
  },
  {
    name: "Items",
    icon: FcPackage,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
    subMenu: [
      {
        path: "/items",
        name: "Items",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
      {
        path: "/purchase-companies",
        name: "Purchase Companies",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
      {
        path: "/purchased-items",
        name: "Purchased Items",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
    ],
  },
  {
    path: "/workers",
    name: "Worker",
    icon: FcContacts,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  {
    path: "/machine",
    name: "Machine",
    icon: FcEngineering,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  {
    path: "/companies",
    name: "Company",
    icon: FcFactory,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  {
    path: "/buyers",
    name: "Buyer",
    icon: FcShop,
    allowedPlans: ["ADMIN"],
  },
  {
    path: "/sellings",
    name: "Selling",
    icon: FcDebt,
    allowedPlans: ["ADMIN"],
  },
  {
    path: "/merchants",
    name: "Merchants",
    icon: FcShop,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  {
    path: "/bills",
    name: "Bills",
    icon: FcDebt,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
  },
  {
    name: "Supplier",
    icon: FcBusinessContact,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
    subMenu: [
      {
        path: "/supplier",
        name: "Suppliers",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
      {
        path: "/supplier-categories",
        name: "Supplier Categories",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
    ],
  },
  {
    name: "Calculator",
    icon: FcCalculator,
    allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
    subMenu: [
      {
        path: "/cbm-calculator",
        name: "CBM Calculator",
        allowedPlans: ["ADMIN", "ENTERPRISE", "PREMIUM", "BASIC", "FREE"],
      },
    ],
  },
];

export default Menuitems;
