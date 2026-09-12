import "./form-section.scss";

function FormSection({ title, description, actions, children }) {
  return (
    <section className="form-section">
      {(title || description || actions) && (
        <div className="form-section__header">
          <div className="form-section__info">
            {title && <h2 className="form-section__title">{title}</h2>}

            {description && (
              <p className="form-section__description">{description}</p>
            )}
          </div>

          {actions && <div className="form-section__actions">{actions}</div>}
        </div>
      )}

      <div className="form-section__content">{children}</div>
    </section>
  );
}

export default FormSection;
