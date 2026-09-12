import "./select.scss";

function Select({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = "Select an option",
  disabled = false,
}) {
  return (
    <select
      id={id}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className="form-select"
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
  );
}

export default Select;
