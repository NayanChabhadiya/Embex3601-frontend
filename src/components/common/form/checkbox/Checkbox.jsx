import { useEffect, useRef } from "react";
import "./checkbox.scss";

function Checkbox({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  indeterminate = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  return (
    <label className="common-checkbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        ref={inputRef}
      />

      <span className="common-checkbox__box" />

      {label && <span className="common-checkbox__label">{label}</span>}
    </label>
  );
}

export default Checkbox;
