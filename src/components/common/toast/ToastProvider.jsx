import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import Toast from "./Toast";

const ToastContext = createContext(null);

const MAX_VISIBLE_TOASTS = 5;
const DEFAULT_DURATION = 5000;

const createToastId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({
      type = "info",
      title,
      message,
      duration = DEFAULT_DURATION,
      action,
      showClose = true,
    } = {}) => {
      const id = createToastId();

      const toast = {
        id,
        type,
        title,
        message,
        duration,
        action,
        showClose,
      };

      setToasts((currentToasts) => {
        const nextToasts = [...currentToasts, toast];

        if (nextToasts.length <= MAX_VISIBLE_TOASTS) {
          return nextToasts;
        }

        const removedToast = nextToasts.shift();

        const timer = timersRef.current.get(removedToast.id);

        if (timer) {
          window.clearTimeout(timer);
          timersRef.current.delete(removedToast.id);
        }

        return nextToasts;
      });

      if (type !== "loading" && duration > 0) {
        const timer = window.setTimeout(() => {
          removeToast(id);
        }, duration);

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  const updateToast = useCallback((id, updates = {}) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              ...updates,
            }
          : toast,
      ),
    );
  }, []);

  const dismissAllToasts = useCallback(() => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
    });

    timersRef.current.clear();

    setToasts([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      removeToast,
      updateToast,
      dismissAllToasts,
    }),
    [showToast, removeToast, updateToast, dismissAllToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="toast-container" aria-label="Notifications">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            action={toast.action}
            showClose={toast.showClose}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
};

export default ToastProvider;
