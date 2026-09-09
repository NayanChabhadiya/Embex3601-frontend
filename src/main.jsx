import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import ToastProvider from "./components/common/toast/ToastProvider";
import LoaderProvider from "./components/common/loader/LoaderProvider";

import "./styles/main.scss";

class ApplicationErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Embex360 application error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          boxSizing: "border-box",
          background: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "480px",
            padding: "40px 32px",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            background: "#ffffff",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "52px",
              height: "52px",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "#fee2e2",
              color: "#dc2626",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            !
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#172033",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              margin: "0 0 24px",
              color: "#64748b",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Embex360 encountered an unexpected application error. Please reload
            the application and try again.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            style={{
              minWidth: "120px",
              height: "44px",
              padding: "0 20px",
              border: 0,
              borderRadius: "8px",
              background: "#2563eb",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </section>
      </main>
    );
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Embex360 application root element was not found.");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastProvider>
      <LoaderProvider>
        <ApplicationErrorBoundary>
          <App />
        </ApplicationErrorBoundary>
      </LoaderProvider>
    </ToastProvider>
  </StrictMode>,
);
