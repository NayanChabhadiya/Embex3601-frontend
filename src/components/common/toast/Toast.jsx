import { useEffect } from "react";

import "./toast.scss";

const ICONS = {
  success: "✓",
  error: "×",
  warning: "!",
  info: "i",
};

const DEFAULT_TITLES = {
  success: "Success",
  error: "Something went wrong",
  warning: "Warning",
  info: "Information",
};

function Toast({
  type = "info",
  title,
  message,
  duration = 4000,
  onClose,
  action,
  showClose = true,
}) {
  const toastType = ICONS[type] ? type : "info";

  useEffect(() => {
    if (!onClose || duration <= 0) {
      return;
    }

    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`toast toast--${toastType}`}
      role={toastType === "error" ? "alert" : "status"}
    >
      <div className="toast__icon" aria-hidden="true">
        {ICONS[toastType]}
      </div>

      <div className="toast__content">
        <div className="toast__title">{title || DEFAULT_TITLES[toastType]}</div>

        {message && <div className="toast__message">{message}</div>}
      </div>

      {(action || showClose) && (
        <div className="toast__actions">
          {action && (
            <button
              type="button"
              className="toast__action"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}

          {showClose && (
            <button
              type="button"
              className="toast__close"
              onClick={onClose}
              aria-label="Close notification"
            >
              ×
            </button>
          )}
        </div>
      )}

      {duration > 0 && (
        <span
          className="toast__progress"
          style={{
            animationDuration: `${duration}ms`,
          }}
        />
      )}
    </div>
  );
}

export default Toast;
