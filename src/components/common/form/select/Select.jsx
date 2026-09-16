import "./select.scss";

function Select({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Select an option",
  error,
  required = false,
  disabled = false,
}) {
  return (
    <>
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="form-select__required">*</span>}
        </label>
      )}

      <select
        id={id || name}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`form-select${error ? " form-select--error" : ""}`}
        aria-invalid={Boolean(error)}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span className="form-select__error">{error}</span>}
    </>
  );
}

export default Select;
