import { useState } from "react";

import { useToast } from "./components/common/toast/ToastProvider";
import { useLoader } from "./components/common/loader/LoaderProvider";

const App = () => {
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const [loadingId, setLoadingId] = useState(null);

  const testSuccessToast = () => {
    showToast({
      type: "success",
      title: "Success",
      message: "Operation completed successfully.",
    });
  };

  const testErrorToast = () => {
    showToast({
      type: "error",
      title: "Something went wrong",
      message: "Unable to complete the requested operation.",
    });
  };

  const testWarningToast = () => {
    showToast({
      type: "warning",
      title: "Warning",
      message: "Your subscription limit is almost reached.",
    });
  };

  const testInfoToast = () => {
    showToast({
      type: "info",
      title: "Information",
      message: "Your session will expire soon.",
    });
  };

  const testLoader = () => {
    const id = showLoader({
      type: "overlay",
      size: "medium",
      text: "Processing...",
      brand: true,
    });

    setLoadingId(id);
  };

  const stopLoader = () => {
    if (loadingId) {
      hideLoader(loadingId);
      setLoadingId(null);
    }
  };

  const testApiFlow = async () => {
    const loaderId = showLoader({
      type: "overlay",
      size: "medium",
      text: "Saving changes...",
      brand: true,
    });

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 2500);
      });

      showToast({
        type: "success",
        title: "Saved Successfully",
        message: "Your changes have been saved successfully.",
      });
    } catch {
      showToast({
        type: "error",
        title: "Save Failed",
        message: "Unable to save your changes.",
      });
    } finally {
      hideLoader(loaderId);
      setLoadingId(null);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px",
        background: "#f8fafc",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#172033",
          }}
        >
          Embex360
        </h1>

        <p
          style={{
            marginTop: "8px",
            color: "#64748b",
          }}
        >
          Global Toast & Loader Test
        </p>

        <section
          style={{
            marginTop: "32px",
            padding: "28px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
          }}
        >
          <h2>Toast Tests</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={testSuccessToast}
              style={buttonStyle}
            >
              Success
            </button>

            <button type="button" onClick={testErrorToast} style={buttonStyle}>
              Error
            </button>

            <button
              type="button"
              onClick={testWarningToast}
              style={buttonStyle}
            >
              Warning
            </button>

            <button type="button" onClick={testInfoToast} style={buttonStyle}>
              Info
            </button>
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            padding: "28px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
          }}
        >
          <h2>Loader Tests</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={testLoader}
              disabled={Boolean(loadingId)}
              style={{
                ...buttonStyle,
                opacity: loadingId ? 0.6 : 1,
                cursor: loadingId ? "not-allowed" : "pointer",
              }}
            >
              Start Loader
            </button>

            <button
              type="button"
              onClick={stopLoader}
              disabled={!loadingId}
              style={{
                ...buttonStyle,
                opacity: !loadingId ? 0.6 : 1,
                cursor: !loadingId ? "not-allowed" : "pointer",
              }}
            >
              Stop Loader
            </button>
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            padding: "28px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
          }}
        >
          <h2>Real API Flow Simulation</h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            This simulates an API request with a global loader and success
            toast.
          </p>

          <button type="button" onClick={testApiFlow} style={buttonStyle}>
            Save Changes
          </button>
        </section>
      </div>
    </main>
  );
};

const buttonStyle = {
  minWidth: "120px",
  height: "44px",
  padding: "0 18px",
  border: "1px solid #d7dee8",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#172033",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

export default App;
