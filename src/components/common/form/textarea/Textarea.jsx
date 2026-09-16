import "./textarea.scss";

function Textarea({
  label,
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  required = false,
  disabled = false,
  autoComplete,
  rows = 4,
  maxLength,
}) {
  return (
    <div className="common-textarea">
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && (
            <span className="common-textarea__required">*</span>
          )}
        </label>
      )}

      <textarea
        id={id || name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
      />

      {error && (
        <span className="common-textarea__error">
          {error}
        </span>
      )}
    </div>
  );
}

export default Textarea;