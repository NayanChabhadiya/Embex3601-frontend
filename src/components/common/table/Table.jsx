import "./table.scss";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableToolbar from "./TableToolbar";

function Table({
  columns = [],
  data = [],
  rowKey = "_id",
  emptyMessage = "No data available.",
  loading = false,
  pagination = null,
  onPageChange,
  onLimitChange,
  selectable = false,
  selectedRowKeys = [],
  onSelectionChange,
  title,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  onFilter,
  onColumns,
  onExport,
  action,
}) {
  const rowKeys = data.map((row) => row[rowKey]).filter(Boolean);

  const selectedCount = rowKeys.filter((key) =>
    selectedRowKeys.includes(key),
  ).length;

  const allSelected = data.length > 0 && selectedCount === data.length;

  const partiallySelected = selectedCount > 0 && !allSelected;

  const onSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.(
        selectedRowKeys.filter((key) => !rowKeys.includes(key)),
      );

      return;
    }

    onSelectionChange?.([...new Set([...selectedRowKeys, ...rowKeys])]);
  };

  const onRowSelectionChange = (key) => {
    if (selectedRowKeys.includes(key)) {
      onSelectionChange?.(
        selectedRowKeys.filter((selectedKey) => selectedKey !== key),
      );

      return;
    }

    onSelectionChange?.([...selectedRowKeys, key]);
  };
  return (
    <div className="table-wrapper">
      {(title ||
        onSearchChange ||
        onFilter ||
        onColumns ||
        onExport ||
        action) && (
        <TableToolbar
          title={title}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          onFilter={onFilter}
          onColumns={onColumns}
          onExport={onExport}
          action={action}
        />
      )}
      <table className="table">
        <TableHeader
          columns={columns}
          selectable={selectable}
          allSelected={allSelected}
          partiallySelected={partiallySelected}
          onSelectAll={onSelectAll}
        />

        {loading ? (
          <tbody className="table-body">
            <tr>
              <td
                className="table-body__loading"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                Loading...
              </td>
            </tr>
          </tbody>
        ) : (
          <TableBody
            columns={columns}
            data={data}
            rowKey={rowKey}
            selectable={selectable}
            selectedRowKeys={selectedRowKeys}
            onRowSelectionChange={onRowSelectionChange}
            emptyMessage={emptyMessage}
          />
        )}
      </table>

      <TablePagination
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}

export default Table;
