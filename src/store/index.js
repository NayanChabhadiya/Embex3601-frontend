import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage/session";
import { persistReducer, persistStore } from "redux-persist";
import componentSlice from "./apiSlice/componentSlice";
import authSlice from "./apiSlice/authSlice";
import userSlice from "./apiSlice/userSlice";
import companySlice from "./apiSlice/companySlice";
import merchantSlice from "./apiSlice/merchantSlice";
import workerSlice from "./apiSlice/workerSlice";
import billSlice from "./apiSlice/billSlice";
import jobWorkerSlice from "./apiSlice/jobWorkerSlice";
import itemSlice from "./apiSlice/itemSlice";
import purchaseCompanySlice from "./apiSlice/purchaseCompanySlice";
import purchasedItemSlice from "./apiSlice/purchasedItemSlice";
import subscriptionPlanSlice from "./apiSlice/subscriptionPlanSlice";
import supplierCategorySlice from "./apiSlice/supplierCategorySlice";
import supplierSlice from "./apiSlice/supplierSlice";
import buyerSlice from "./apiSlice/buyerSlice";
import sellingSlice from "./apiSlice/sellingSlice";
import machineSlice from "./apiSlice/machineSlice";

const reducer = combineReducers({
  auth: authSlice,
  components: componentSlice,
  users: userSlice,
  companies: companySlice,
  merchants: merchantSlice,
  workers: workerSlice,
  bills: billSlice,
  jobWorkers: jobWorkerSlice,
  items: itemSlice,
  purchaseCompanies: purchaseCompanySlice,
  purchasedItems: purchasedItemSlice,
  subscriptionPlans: subscriptionPlanSlice,
  supplierCategories: supplierCategorySlice,
  suppliers: supplierSlice,
  buyers: buyerSlice,
  sellings: sellingSlice,
  machines: machineSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "components",
    "users",
    "companies",
    "merchants",
    "workers",
    "bills",
    "jobWorkers",
    "items",
    "purchaseCompanies",
    "purchasedItems",
    "subscriptionPlans",
    "supplierCategories",
    "suppliers",
    "buyers",
    "sellings",
    "machines",
  ],
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
