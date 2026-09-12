import "./page-section.scss";

function PageSection({ children, title, actions }) {
  return (
    <section className="page-section">
      {(title || actions) && (
        <div className="page-section__header">
          {title && <h2 className="page-section__title">{title}</h2>}

          {actions && <div className="page-section__actions">{actions}</div>}
        </div>
      )}

      <div className="page-section__content">{children}</div>
    </section>
  );
}

export default PageSection;
