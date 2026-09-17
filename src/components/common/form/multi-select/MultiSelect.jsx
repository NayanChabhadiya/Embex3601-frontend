import { useEffect, useMemo, useRef, useState } from "react";
import "./multi-select.scss";

function MultiSelect({
  label,
  name,
  id,
  value = [],
  onChange,
  options = [],
  placeholder = "Select options",
  searchPlaceholder = "Select options",
  error,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : [];

  const filteredOptions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return options;
    }

    return options.filter((option) => {
      const labelValue = String(option.label ?? "").toLowerCase();
      const descriptionValue = String(option.description ?? "").toLowerCase();

      return (
        labelValue.includes(searchValue) ||
        descriptionValue.includes(searchValue)
      );
    });
  }, [options, search]);

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

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

  const handleOpen = () => {
    if (disabled) {
      return;
    }

    setIsOpen(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleToggleOption = (optionValue) => {
    if (selectedValues.includes(optionValue)) {
      onChange(
        selectedValues.filter((selectedValue) => selectedValue !== optionValue),
      );

      return;
    }

    onChange([...selectedValues, optionValue]);

    setSearch("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleRemoveOption = (optionValue) => {
    onChange(
      selectedValues.filter((selectedValue) => selectedValue !== optionValue),
    );
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      return;
    }

    if (
      event.key === "Backspace" &&
      search === "" &&
      selectedValues.length > 0
    ) {
      const lastSelectedValue = selectedValues[selectedValues.length - 1];

      handleRemoveOption(lastSelectedValue);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`multi-select ${error ? "multi-select--error" : ""}`}
    >
      {label && (
        <label htmlFor={id || name}>
          {label}

          {required && <span className="multi-select__required">*</span>}
        </label>
      )}

      <div
        className={`multi-select__control ${
          isOpen ? "multi-select__control--open" : ""
        } ${disabled ? "multi-select__control--disabled" : ""}`}
        onClick={handleOpen}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id || name}-listbox`}
      >
        <div className="multi-select__value">
          {selectedOptions.map((option) => (
            <span key={option.value} className="multi-select__tag">
              <span className="multi-select__tag-label">{option.label}</span>

              <button
                type="button"
                className="multi-select__tag-remove"
                onClick={(event) => {
                  event.stopPropagation();

                  if (!disabled) {
                    handleRemoveOption(option.value);
                  }
                }}
                disabled={disabled}
                aria-label={`Remove ${option.label}`}
              >
                ×
              </button>
            </span>
          ))}

          <input
            ref={inputRef}
            id={id || name}
            name={name}
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedOptions.length === 0
                ? placeholder || searchPlaceholder
                : ""
            }
            disabled={disabled}
            autoComplete="off"
            className="multi-select__input"
            aria-autocomplete="list"
          />
        </div>

        <span
          className={`multi-select__arrow ${
            isOpen ? "multi-select__arrow--open" : ""
          }`}
        >
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {isOpen && !disabled && (
        <div className="multi-select__dropdown" id={`${id || name}-listbox`}>
          <div
            className="multi-select__options"
            role="listbox"
            aria-multiselectable="true"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`multi-select__option ${
                      isSelected ? "multi-select__option--selected" : ""
                    }`}
                    onClick={() => handleToggleOption(option.value)}
                  >
                    <span className="multi-select__checkbox">
                      {isSelected ? "✓" : ""}
                    </span>

                    <span className="multi-select__option-content">
                      <strong>{option.label}</strong>

                      {option.description && (
                        <small>{option.description}</small>
                      )}
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="multi-select__empty">No options found.</p>
            )}
          </div>
        </div>
      )}

      {error && <span className="multi-select__error">{error}</span>}
    </div>
  );
}

export default MultiSelect;
