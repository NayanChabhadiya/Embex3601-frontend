import "./table-pagination.scss";

function TablePagination({
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
}) {
  if (!pagination) {
    return null;
  }

  const { page, limit, total, totalPages, hasNextPage, hasPreviousPage } =
    pagination;

  const visiblePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter((pageNumber) => {
    if (totalPages <= 5) {
      return true;
    }

    return (
      pageNumber === 1 ||
      pageNumber === totalPages ||
      Math.abs(pageNumber - page) <= 1
    );
  });

  const start = total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  const handleLimitChange = (event) => {
    onLimitChange?.(Number(event.target.value));
  };

  return (
    <div className="table-pagination">
      <div className="table-pagination__summary">
        Showing {start}–{end} of {total}
      </div>

      <div className="table-pagination__controls">
        <select
          value={limit}
          onChange={handleLimitChange}
          className="table-pagination__select"
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <div className="table-pagination__pages">
          <button
            type="button"
            disabled={!hasPreviousPage}
            onClick={() => onPageChange?.(page - 1)}
            className="table-pagination__button"
            aria-label="Previous page"
          >
            Previous
          </button>

          <div className="table-pagination__page-numbers">
            {visiblePages.map((pageNumber, index) => {
              const previousPage = visiblePages[index - 1];

              return (
                <div key={pageNumber} className="table-pagination__page-group">
                  {previousPage && pageNumber - previousPage > 1 && (
                    <span className="table-pagination__ellipsis">...</span>
                  )}

                  <button
                    type="button"
                    className={`table-pagination__number ${
                      pageNumber === page
                        ? "table-pagination__number--active"
                        : ""
                    }`}
                    onClick={() => onPageChange?.(pageNumber)}
                    aria-current={pageNumber === page ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => onPageChange?.(page + 1)}
            className="table-pagination__button"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default TablePagination;
