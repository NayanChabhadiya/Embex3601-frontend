import { createContext, useContext, useState } from "react";

import Toast from "./Toast";

const ToastContext = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = ({
    type = "info",
    title,
    message,
    duration = 4000,
  } = {}) => {
    const id = Date.now();

    setToasts((current) => [
      ...current.slice(-4),
      {
        id,
        type,
        title,
        message,
        duration,
      },
    ]);

    if (duration > 0) {
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        removeToast,
        removeAllToasts,
      }}
    >
      {children}

      <div className="toast-container" aria-label="Notifications">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}

export default ToastProvider;
