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
  searchPlaceholder = "Search...",
  error,
  required = false,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);

  const selectedValues = Array.isArray(value) ? value : [];

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
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleToggleOption = (optionValue) => {
    if (selectedValues.includes(optionValue)) {
      onChange(
        selectedValues.filter((selectedValue) => selectedValue !== optionValue),
      );

      return;
    }

    onChange([...selectedValues, optionValue]);
  };

  const handleRemoveOption = (optionValue) => {
    onChange(
      selectedValues.filter((selectedValue) => selectedValue !== optionValue),
    );
  };

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

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

      <button
        type="button"
        id={id || name}
        className="multi-select__control"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="multi-select__value">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span key={option.value} className="multi-select__tag">
                {option.label}

                <span
                  role="button"
                  tabIndex={0}
                  className="multi-select__tag-remove"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveOption(option.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      handleRemoveOption(option.value);
                    }
                  }}
                  aria-label={`Remove ${option.label}`}
                >
                  ×
                </span>
              </span>
            ))
          ) : (
            <span className="multi-select__placeholder">{placeholder}</span>
          )}
        </div>

        <span className="multi-select__arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="multi-select__dropdown">
          <div className="multi-select__search">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
          </div>

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

                    <span>
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
