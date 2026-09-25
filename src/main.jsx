import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App.jsx";
import store from "./store/index.js";

import ToastProvider from "./components/common/toast/ToastProvider.jsx";
import LoaderProvider from "./components/common/loader/LoaderProvider.jsx";

import "./styles/main.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <LoaderProvider>
          <App />
        </LoaderProvider>
      </ToastProvider>
    </Provider>
  </StrictMode>,
);
