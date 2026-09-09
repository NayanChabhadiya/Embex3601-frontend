import "./checkbox.scss";

function Checkbox({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  required = false,
}) {
  return (
    <label className="common-checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />

      <span className="common-checkbox__box" />

      {label && <span className="common-checkbox__label">{label}</span>}
    </label>
  );
}

export default Checkbox;
