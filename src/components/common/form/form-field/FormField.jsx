import "./form-field.scss";

function FormField({
  label,
  name,
  required = false,
  error,
  helperText,
  children,
}) {
  return (
    <div className="form-field">
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}

          {required && <span className="form-field__required">*</span>}
        </label>
      )}

      <div className="form-field__control">{children}</div>

      {error ? (
        <p className="form-field__error">{error}</p>
      ) : (
        helperText && <p className="form-field__helper">{helperText}</p>
      )}
    </div>
  );
}

export default FormField;
