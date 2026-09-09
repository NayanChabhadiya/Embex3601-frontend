import "./loader.scss";

function Loader({ size = "medium", text = "Loading...", type = "inline" }) {
  return (
    <div
      className={`loader loader--${size} loader--${type}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="loader__spinner" aria-hidden="true" />

      {text && <span className="loader__text">{text}</span>}
    </div>
  );
}

export default Loader;
