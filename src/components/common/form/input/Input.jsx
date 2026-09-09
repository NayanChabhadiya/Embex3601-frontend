import { useState } from "react";

import "./input.scss";

function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  required = false,
  disabled = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="common-input">
      {label && (
        <label htmlFor={id || name}>
          {label}

          {required && <span className="common-input__required">*</span>}
        </label>
      )}

      <div
        className={`common-input__field ${
          error ? "common-input__field--error" : ""
        }`}
      >
        <input
          id={id || name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
        />

        {isPassword && (
          <button
            type="button"
            className="common-input__password-toggle"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <span className="common-input__error">{error}</span>}
    </div>
  );
}

export default Input;
