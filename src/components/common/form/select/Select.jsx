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
  const inputRef = useRef(null);

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

  const handleOpen = () => {
    if (disabled) return;

    setIsOpen(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSelectOption = (option) => {
    onChange({
      target: {
        name,
        value: option.value,
      },
    });

    setSearch("");
    setIsOpen(false);

    onBlur?.();
  };

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (disabled) return;

    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (disabled) return;

    if (event.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`form-select ${error ? "form-select--error" : ""}`}
    >
      {label && (
        <label htmlFor={id || name}>
          {label}
          {required && <span className="form-select__required">*</span>}
        </label>
      )}

      <div className="form-select__wrapper">
        <input
          ref={inputRef}
          id={id || name}
          name={name}
          type="text"
          value={isOpen ? search : (selectedOption?.label ?? "")}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="form-select__input"
          aria-invalid={Boolean(error)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={handleOpen}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onBlur={() => {
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                setSearch("");
                onBlur?.();
              }
            }, 0);
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="form-select__arrow"
          onClick={handleOpen}
          disabled={disabled}
          tabIndex={-1}
          aria-label="Open select"
        >
          {isOpen ? "▲" : "▼"}
        </button>
      </div>

      {isOpen && (
        <div className="form-select__dropdown">
          <div className="form-select__options" role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = String(option.value) === String(value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`form-select__option ${
                      isSelected ? "form-select__option--selected" : ""
                    }`}
                    onMouseDown={(event) => {
                      event.preventDefault();
                    }}
                    onClick={() => handleSelectOption(option)}
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
