import "./table-toolbar.scss";

function TableToolbar({
  title,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  onFilter,
  onColumns,
  onExport,
  action,
}) {
  return (
    <div className="table-toolbar">
      <div className="table-toolbar__left">
        {title && <h3 className="table-toolbar__title">{title}</h3>}

        {onSearchChange && (
          <div className="table-toolbar__search">
            <input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="table-toolbar__search-input"
              aria-label={searchPlaceholder}
            />
          </div>
        )}
      </div>

      <div className="table-toolbar__actions">
        {onFilter && (
          <button
            type="button"
            className="table-toolbar__button"
            onClick={onFilter}
          >
            Filter
          </button>
        )}

        {onColumns && (
          <button
            type="button"
            className="table-toolbar__button"
            onClick={onColumns}
          >
            Columns
          </button>
        )}

        {onExport && (
          <button
            type="button"
            className="table-toolbar__button"
            onClick={onExport}
          >
            Export
          </button>
        )}

        {action}
      </div>
    </div>
  );
}

export default TableToolbar;
