import { Checkbox } from "../form/checkbox";
import "./table-body.scss";

function TableBody({
  columns = [],
  data = [],
  rowKey = "id",
  selectable = false,
  selectedRowKeys = [],
  onRowSelectionChange,
  emptyMessage = "No data available.",
}) {
  if (data.length === 0) {
    return (
      <tbody className="table-body">
        <tr>
          <td
            className="table-body__empty"
            colSpan={columns.length + (selectable ? 1 : 0)}
          >
            {emptyMessage}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="table-body">
      {data.map((row, index) => {
        const key = row[rowKey] ?? index;
        const isSelected = selectedRowKeys.includes(key);

        return (
          <tr
            key={key}
            className={
              isSelected
                ? "table-body__row table-body__row--selected"
                : "table-body__row"
            }
          >
            {selectable && (
              <td className="table-body__selection">
                <Checkbox
                  checked={isSelected}
                  onChange={() => onRowSelectionChange?.(key)}
                  aria-label={`Select row ${index + 1}`}
                />
              </td>
            )}

            {columns.map((column) => (
              <td
                key={column.key}
                className={
                  column.align ? `table-body__cell--${column.align}` : ""
                }
              >
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
}

export default TableBody;
