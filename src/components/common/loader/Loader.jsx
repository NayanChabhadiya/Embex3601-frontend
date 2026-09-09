import "./loader.scss";

const Loader = ({
  type = "inline",
  size = "medium",
  text = "Loading...",
  fullPage = false,
  overlay = false,
  brand = false,
  className = "",
}) => {
  const loaderClassName = [
    "loader",
    `loader--${type}`,
    `loader--${size}`,
    fullPage ? "loader--full-page" : "",
    overlay ? "loader--overlay" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <span className="loader__spinner" aria-hidden="true">
      <span className="loader__spinner-ring" />
    </span>
  );

  const content = (
    <div
      className={loaderClassName}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {spinner}

      {brand && (
        <div className="loader__brand">
          <span className="loader__brand-name">
            Embex<span>360</span>
          </span>
        </div>
      )}

      {text && <span className="loader__text">{text}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="loader__page"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {spinner}

        {brand && (
          <div className="loader__brand">
            <span className="loader__brand-name">
              Embex<span>360</span>
            </span>
          </div>
        )}

        {text && <span className="loader__text">{text}</span>}

        <div className="loader__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className="loader__overlay"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="loader__overlay-content">
          {spinner}

          {brand && (
            <div className="loader__brand">
              <span className="loader__brand-name">
                Embex<span>360</span>
              </span>
            </div>
          )}

          {text && <span className="loader__text">{text}</span>}
        </div>
      </div>
    );
  }

  return content;
};

export default Loader;
