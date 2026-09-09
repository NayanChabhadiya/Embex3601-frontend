import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import ToastProvider from "./components/common/toast/ToastProvider";
import LoaderProvider from "./components/common/loader/LoaderProvider";

import "./styles/main.scss";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ToastProvider>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </ToastProvider>
  </StrictMode>,
);
