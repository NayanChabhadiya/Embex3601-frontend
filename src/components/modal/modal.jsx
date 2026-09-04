import "./modal.scss";

const Modal = ({ isOpen, onClose, title, footer, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal-body">{children}</div>

        <footer className="modal-footer">{footer}</footer>
      </div>
    </div>
  );
};

export default Modal;
