import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import ToastProvider from "./components/common/toast/ToastProvider";
import LoaderProvider from "./components/common/loader/LoaderProvider";

import "./styles/main.scss";
import store from "./store";
import { Provider } from "react-redux";

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
