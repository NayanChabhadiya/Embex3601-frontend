import { useEffect, useMemo } from "react";
import "./toast.scss";

const ICONS = {
  success: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),

  error: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  ),

  warning: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.3 3.9 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),

  info: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  ),

  loading: <span className="toast-spinner" aria-hidden="true" />,

  undo: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7 4 12l5 5" />
      <path d="M4 12h10a6 6 0 0 1 6 6" />
    </svg>
  ),
};

const DEFAULT_TITLES = {
  success: "Success",
  error: "Something went wrong",
  warning: "Warning",
  info: "Information",
  loading: "Processing...",
  undo: "Action completed",
};

const Toast = ({
  type = "info",
  title,
  message,
  duration = 4000,
  onClose,
  action,
  showClose = true,
}) => {
  const normalizedType = useMemo(() => (ICONS[type] ? type : "info"), [type]);

  useEffect(() => {
    if (normalizedType === "loading" || duration <= 0 || !onClose) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [normalizedType, duration, onClose]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
    }
  };

  return (
    <div
      className={`toast toast--${normalizedType}`}
      role={normalizedType === "error" ? "alert" : "status"}
      aria-live={normalizedType === "error" ? "assertive" : "polite"}
    >
      <div className="toast__icon">{ICONS[normalizedType]}</div>

      <div className="toast__content">
        <div className="toast__title">
          {title || DEFAULT_TITLES[normalizedType]}
        </div>

        {message && <div className="toast__message">{message}</div>}
      </div>

      {(action || showClose) && (
        <div className="toast__actions">
          {action && (
            <button
              type="button"
              className="toast__action"
              onClick={handleAction}
            >
              {action.label}
            </button>
          )}

          {showClose && (
            <button
              type="button"
              className="toast__close"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {normalizedType !== "loading" && duration > 0 && (
        <span
          className="toast__progress"
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      )}
    </div>
  );
};

export default Toast;
