import { useEffect } from "react";
import "./toast.scss";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="icon" />;
      case "error":
        return <FaExclamationCircle className="icon" />;
      case "info":
      default:
        return <FaInfoCircle className="icon" />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      {renderIcon()}
      <div className="message">{message}</div>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
      <div className="progress-bar" />
    </div>
  );
};

export default Toast;
