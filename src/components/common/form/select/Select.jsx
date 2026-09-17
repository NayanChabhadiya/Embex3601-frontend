import { useEffect, useMemo, useRef, useState } from "react";
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
  searchPlaceholder = "Search...",
  error,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  const filteredOptions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return options;
    }

    return options.filter((option) =>
      String(option.label ?? "")
        .toLowerCase()
        .includes(searchValue),
    );
  }, [options, search]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((current) => !current);

    if (isOpen) {
      setSearch("");
    }
  };

  const handleSelectOption = (optionValue) => {
    onChange({
      target: {
        name,
        value: optionValue,
      },
    });

    setIsOpen(false);
    setSearch("");

    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`form-select-wrapper ${
        error ? "form-select-wrapper--error" : ""
      }`}
    >
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="form-select-wrapper__required">*</span>}
        </label>
      )}

      <button
        type="button"
        id={id || name}
        className="form-select__control"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span
          className={
            selectedOption ? "form-select__value" : "form-select__placeholder"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <span className="form-select__arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="form-select__dropdown">
          <div className="form-select__search">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
          </div>

          <div
            className="form-select__options"
            role="listbox"
            aria-label={label || name}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`form-select__option ${
                      isSelected ? "form-select__option--selected" : ""
                    }`}
                    onClick={() => handleSelectOption(option.value)}
                  >
                    <span>
                      <strong>{option.label}</strong>

                      {option.description && (
                        <small>{option.description}</small>
                      )}
                    </span>

                    {isSelected && (
                      <span className="form-select__check">✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="form-select__empty">No options found.</p>
            )}
          </div>
        </div>
      )}

      {error && <span className="form-select__error">{error}</span>}
    </div>
  );
}

export default Select;
