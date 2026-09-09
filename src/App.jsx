import { useState } from "react";
import Toast from "./components/common/toast/Toast";

const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = (type) => {
    const toastConfig = {
      success: {
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
      },

      error: {
        title: "Something went wrong",
        message: "Unable to save changes. Please try again.",
      },

      warning: {
        title: "Subscription Limit",
        message: "You are close to reaching your user limit.",
      },

      info: {
        title: "Session Expiring",
        message: "Your session will expire in 5 minutes.",
      },

      loading: {
        title: "Processing...",
        message: "Please wait while we complete the operation.",
      },

      undo: {
        title: "Item Deleted",
        message: "The item has been moved to trash.",
      },
    };

    setToast({
      type,
      ...toastConfig[type],
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleUndo = () => {
    setToast({
      type: "success",
      title: "Item Restored",
      message: "The item has been successfully restored.",
    });
  };

  return (
    <div
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
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "36px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#172033",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Embex360
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            Toast Notification Test
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <button
            type="button"
            onClick={() => showToast("success")}
            style={buttonStyle}
          >
            Test Success
          </button>

          <button
            type="button"
            onClick={() => showToast("error")}
            style={buttonStyle}
          >
            Test Error
          </button>

          <button
            type="button"
            onClick={() => showToast("warning")}
            style={buttonStyle}
          >
            Test Warning
          </button>

          <button
            type="button"
            onClick={() => showToast("info")}
            style={buttonStyle}
          >
            Test Info
          </button>

          <button
            type="button"
            onClick={() => showToast("loading")}
            style={buttonStyle}
          >
            Test Loading
          </button>

          <button
            type="button"
            onClick={() => showToast("undo")}
            style={buttonStyle}
          >
            Test Undo
          </button>
        </div>

        {toast && (
          <div
            style={{
              position: "fixed",
              top: "28px",
              right: "28px",
              zIndex: 9999,
            }}
          >
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.type === "loading" ? 0 : 5000}
              onClose={closeToast}
              action={
                toast.type === "undo"
                  ? {
                      label: "Undo",
                      onClick: handleUndo,
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  height: "52px",
  padding: "0 20px",
  border: "1px solid #d7dee8",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#172033",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};

export default App;
