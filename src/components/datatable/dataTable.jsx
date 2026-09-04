import React from "react";
import "./dataTable.scss";
import { getPaginationRange } from "../../utils/getPaginationRange";
import { exportToCSV } from "../../utils/exportToCSV";
import { useToast } from "../../contexts/toastContext/toastContext";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { formatRupees } from "../../utils/formatters";
import { generateLedgerHtmlPdf } from "../../utils/generateLedgerHtmlPdf";
import { useSelector } from "react-redux";

const DataTable = ({
  columns,
  data = [],
  onSelectionChange,
  initialRowsPerPage = 10,
  exportFields = [],
  ledgerFields = [],
  showSelection = true,
  showClearFilters = true,
  showExportCSV = true,
  showLedgerPDF = true,
  showSearch = true,
  showFilters = true,
}) => {
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  const [columnFilters, setColumnFilters] = React.useState({});
  const { showToast } = useToast();

  const filteredData = React.useMemo(() => {
    return data?.filter((row) => {
      if (searchTerm.trim() !== "") {
        const searchValue = searchTerm.toLowerCase();
        const hasMatch = columns.some(({ accessor }) => {
          const cellValue = row[accessor];
          return cellValue?.toString().toLowerCase().includes(searchValue);
        });

        if (!hasMatch) return false;
      }
      return columns.every(({ accessor, filterType }) => {
        const value = row[accessor];

        if (filterType === "multi-select") {
          const selectedOptions = columnFilters[accessor];
          if (selectedOptions && selectedOptions?.length > 0) {
            const valueArray = Array.isArray(value)
              ? value?.map(String)
              : [String(value)];
            const hasMatch = selectedOptions.some((opt) =>
              valueArray.includes(opt)
            );
            if (!hasMatch) return false;
          }
        }

        if (filterType === "dropdown" || filterType === "text") {
          const filterValue = columnFilters[accessor];
          if (
            filterValue &&
            !String(value).toLowerCase().includes(filterValue.toLowerCase())
          ) {
            return false;
          }
        }

        if (filterType === "date-range") {
          const from = columnFilters[`${accessor}_from`];
          const to = columnFilters[`${accessor}_to`];
          const dateValue = new Date(value);
          if (from && new Date(from) > dateValue) return false;
          if (to && new Date(to) < dateValue) return false;
        }

        return true;
      });
    });
  }, [data, columns, columnFilters, searchTerm]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;

    const { key, direction } = sortConfig;
    return [...filteredData]?.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        const comparison = aVal.localeCompare(bVal);
        return direction === "asc" ? comparison : -comparison;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortConfig]);

  const { merchants } = useSelector((state) => state.merchants);

  const totalPages = Math.ceil(sortedData?.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData?.slice(startIdx, startIdx + rowsPerPage);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;

    // Select from all filtered data (across all pages)
    const allIds = filteredData.map(
      (row, idx) => row?.id ?? row?._id ?? `${row?.name}-${idx}`
    );

    const updatedSelection = checked ? allIds : [];

    setSelectedRows(updatedSelection);
    onSelectionChange && onSelectionChange(updatedSelection);
  };
  const handleSelectRow = (id) => {
    const updatedSelection = selectedRows.includes(id)
      ? selectedRows?.filter((selectedId) => selectedId !== id)
      : [...selectedRows, id];

    setSelectedRows(updatedSelection);
    onSelectionChange && onSelectionChange(updatedSelection);
  };

  const isAllSelected =
    filteredData?.length > 0 &&
    filteredData.every((row, idx) => {
      const rowId = row?.id ?? row?._id ?? `${row?.name}-${idx}`;
      return selectedRows.includes(rowId);
    });

  const handleSort = (accessor) => {
    if (!sortConfig || sortConfig.key !== accessor) {
      setSortConfig({ key: accessor, direction: "asc" });
    } else if (sortConfig.direction === "asc") {
      setSortConfig({ key: accessor, direction: "desc" });
    } else {
      setSortConfig(null);
    }
    setCurrentPage(1);
  };

  const getSortArrow = (accessor) => {
    if (!sortConfig || sortConfig.key !== accessor) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const onRowsPerPageChange = (e) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const selectedRow = filteredData.find((row) =>
    selectedRows.includes(row._id ?? row.id ?? "")
  );

  const companyName = selectedRow?.companyName || "Company";
  // const merchantName = selectedRow?.merchantName || "Merchant";
  const merchantName =
    merchants?.find((m) => m._id === selectedRow?.merchantId)?.name ||
    "Merchant";

  return (
    <div className="table-wrapper">
      <div className="table-controls">
        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="table-search"
          />
        )}

        {showClearFilters && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              setColumnFilters({});
              setSearchTerm("");
              setCurrentPage(1);
              setSelectedRows([]);
              onSelectionChange && onSelectionChange([]);
            }}
          >
            Clear All Filters
          </button>
        )}
        {showExportCSV && (
          <button
            className="export-btn"
            onClick={() => {
              if (selectedRows?.length === 0) {
                showToast("Please select at least one row to export.", "error");
                return;
              } else {
                const numericFieldsToSum = [
                  "amount",
                  "total",
                  "discountAmount",
                  "subTotal",
                  "cgstAmount",
                  "sgstAmount",
                  "igstAmount",
                  "totalAmount",
                  "roundOff",
                  "finalAmount",
                  "monthlyJobWorks",
                  "receivedAmountHistory",
                  "pendingAmount",
                ];

                const exportData = filteredData?.filter((row) =>
                  selectedRows.includes(row._id)
                );

                const flattenedData = [];
                const grandTotals = {};

                numericFieldsToSum?.forEach((key) => {
                  grandTotals[key] = 0;
                });

                exportData?.forEach((bill) => {
                  const items =
                    Array.isArray(bill.items) && bill.items.length > 0
                      ? bill.items
                      : [{}];

                  items?.forEach((item, index) => {
                    const row = {};

                    exportFields?.forEach(({ accessor, render }) => {
                      let rawValue;

                      if (accessor === "srNo") {
                        rawValue = index + 1;
                      } else if (item.hasOwnProperty(accessor)) {
                        rawValue = item[accessor];
                      } else {
                        rawValue = bill[accessor];
                      }

                      // Special handling for nested array sums
                      if (accessor === "monthlyJobWorks") {
                        const jobs = Array.isArray(bill.monthlyJobWorks)
                          ? bill.monthlyJobWorks
                          : [];
                        const total = jobs.reduce(
                          (acc, job) => acc + (job?.totalAmount || 0),
                          0
                        );
                        grandTotals[accessor] += total;
                        rawValue = total;
                      }

                      if (accessor === "receivedAmountHistory") {
                        const history = Array.isArray(
                          bill.receivedAmountHistory
                        )
                          ? bill.receivedAmountHistory
                          : [];
                        const total = history.reduce(
                          (acc, h) => acc + (h?.amount || 0),
                          0
                        );
                        grandTotals[accessor] += total;
                        rawValue = total;
                      }

                      // Sum flat numeric fields
                      if (
                        numericFieldsToSum.includes(accessor) &&
                        accessor !== "monthlyJobWorks" &&
                        accessor !== "receivedAmountHistory"
                      ) {
                        grandTotals[accessor] += Number(rawValue) || 0;
                      }

                      row[accessor] = render
                        ? render(rawValue, { ...bill, ...item })
                        : rawValue ?? "--";
                    });

                    flattenedData.push(row);
                  });
                });

                // Grand Total Row
                const grandTotalRow = {};
                exportFields?.forEach(({ accessor }) => {
                  if (["description", "name"].includes(accessor)) {
                    grandTotalRow[accessor] = "Grand Total";
                  } else if (numericFieldsToSum.includes(accessor)) {
                    grandTotalRow[accessor] = formatRupees(
                      grandTotals[accessor]
                    );
                  } else {
                    grandTotalRow[accessor] = "";
                  }
                });

                flattenedData.push(grandTotalRow);

                const headers = exportFields.map(({ accessor, header }) => ({
                  accessor,
                  header,
                }));

                exportToCSV(flattenedData, headers, "data.csv");
              }
            }}
          >
            Export data CSV
          </button>
        )}
        {showLedgerPDF && (
          <button
            className="export-btn"
            onClick={() => {
              if (selectedRows?.length === 0) {
                showToast(
                  "Please select at least one row to generate ledger.",
                  "error"
                );
                return;
              }

              generateLedgerHtmlPdf("ledger-pdf", "ledger.pdf");
            }}
          >
            Generate Ledger PDF
          </button>
        )}

        <div className="rows-per-page">
          <label htmlFor="rowsSelect">Rows per page:</label>
          <select
            id="rowsSelect"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
            className="rows-select"
          >
            {[5, 10, 15, 20, 25]?.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="reusable-table">
        <thead>
          <tr>
            {showSelection && (
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns?.map(({ header, accessor }) => (
              <th
                key={accessor}
                onClick={() => handleSort(accessor)}
                style={{ cursor: "pointer", n: "none", textAlign: "center" }}
              >
                {header}
                {getSortArrow(accessor)}
              </th>
            ))}
          </tr>

          <tr>
            {showSelection && <td></td>}
            {showFilters &&
              columns?.map(({ accessor, isActions, filterType, options }) => (
                <td key={`filter-${accessor}`}>
                  {!isActions &&
                    (filterType === "multi-select" ? (
                      <div>
                        <select
                          multiple
                          value={columnFilters[accessor] || []}
                          onChange={(e) => {
                            const selected = Array.from(
                              e.target.selectedOptions,
                              (opt) => opt.value
                            );
                            setColumnFilters((prev) => ({
                              ...prev,
                              [accessor]: selected,
                            }));
                          }}
                          className="table-filter"
                        >
                          {options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>

                        <div className="chip-container">
                          {(columnFilters[accessor] || [])?.map((item) => (
                            <span className="chip" key={item}>
                              {item}
                              <button
                                className="chip-close"
                                onClick={() => {
                                  const updated = columnFilters[
                                    accessor
                                  ]?.filter((val) => val !== item);
                                  setColumnFilters((prev) => ({
                                    ...prev,
                                    [accessor]: updated,
                                  }));
                                }}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : filterType === "dropdown" ? (
                      <select
                        value={columnFilters[accessor] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [accessor]: e.target.value,
                          }))
                        }
                        className="table-filter"
                      >
                        <option value="">All</option>
                        {options?.map((opt) => (
                          <option
                            key={opt.value || opt}
                            value={opt.value || opt}
                          >
                            {opt.label || opt}
                          </option>
                        ))}
                      </select>
                    ) : filterType === "date-range" ? (
                      <div className="date-range-filter">
                        <input
                          type="date"
                          value={columnFilters[`${accessor}_from`] || ""}
                          onChange={(e) =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [`${accessor}_from`]: e.target.value,
                            }))
                          }
                        />
                        <input
                          type="date"
                          value={columnFilters[`${accessor}_to`] || ""}
                          onChange={(e) =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [`${accessor}_to`]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={columnFilters[accessor] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [accessor]: e.target.value,
                          }))
                        }
                        className="table-filter"
                      />
                    ))}
                </td>
              ))}
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 || filteredData?.length === 0 ? (
            <tr>
              <td colSpan={columns?.length + 1} className="no-data-found">
                <div className="no-data-box">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <p>No data found</p>
                </div>
              </td>
            </tr>
          ) : (
            paginatedData?.map((row, idx) => {
              const rowId = row?.id ?? row?._id ?? `${row?.name}-${idx}`;
              return (
                <tr key={rowId}>
                  {showSelection && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(rowId)}
                        onChange={() => handleSelectRow(rowId)}
                      />
                    </td>
                  )}
                  {columns?.map(({ accessor, isActions, actions, render }) => (
                    <td key={accessor}>
                      {isActions ? (
                        <div className="table-actions">
                          {actions?.map(
                            ({ icon: Icon, onClick, title, type }, i) => (
                              <button
                                key={i}
                                title={title}
                                className={`action-btn action-btn--${type}`}
                                onClick={() => onClick(row)}
                              >
                                <Icon />
                              </button>
                            )
                          )}
                        </div>
                      ) : render ? (
                        render(row[accessor])
                      ) : (
                        row[accessor]
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div id="ledger-pdf" style={{ display: "none", padding: "10px" }}>
        <h2 style={{ textAlign: "center" }}>
          Ledger Report
          <p>
            {companyName} - {merchantName}
          </p>
        </h2>

        <table
          border="1"
          cellPadding="6"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              {ledgerFields.map(({ header }) => (
                <th
                  key={header}
                  style={{
                    backgroundColor: "#f0f0f0",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData
              .filter((row) => selectedRows.includes(row._id ?? row.id ?? ""))
              .map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {ledgerFields.map(({ accessor, render }) => {
                    let value = row[accessor];
                    if (render) {
                      value = render(value, row);
                    }

                    return (
                      <td key={accessor} style={{ textAlign: "center" }}>
                        {value ?? "--"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            {/* Grand Total Row */}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
              {ledgerFields.map((field, index) => {
                if (index === 0) {
                  return (
                    <td key="grand-total-label" style={{ textAlign: "center" }}>
                      Grand Total
                    </td>
                  );
                }

                if (field.grandTotal) {
                  const total = filteredData
                    .filter((row) =>
                      selectedRows.includes(row._id ?? row.id ?? "")
                    )
                    .reduce(
                      (sum, row) =>
                        sum + (parseFloat(row[field.accessor]) || 0),
                      0
                    );

                  return (
                    <td key={field.accessor} style={{ textAlign: "center" }}>
                      {formatRupees(total)}
                    </td>
                  );
                }

                return <td key={field.accessor}></td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <FaAngleDoubleLeft />
            </button>

            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <FaAngleLeft />
            </button>

            {getPaginationRange({
              totalPages,
              currentPage,
              siblingCount: 1,
              boundaryCount: 1,
            })?.map((page, i) =>
              page === "..." ? (
                <span key={`dots-${i}`} className="pagination-dots">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`pagination-btn ${
                    page === currentPage ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <FaAngleRight />
            </button>

            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
