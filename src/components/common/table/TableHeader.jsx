import { Checkbox } from "../form/checkbox";
import "./table-header.scss";

function TableHeader({
  columns = [],
  selectable = false,
  allSelected = false,
  partiallySelected = false,
  onSelectAll,
}) {
  return (
    <thead className="table-header">
      <tr>
        {selectable && (
          <th className="table-header__selection">
            <Checkbox
              checked={allSelected}
              indeterminate={partiallySelected}
              onChange={onSelectAll}
              aria-label="Select all rows"
            />
          </th>
        )}

        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={
              column.align ? `table-header__cell--${column.align}` : ""
            }
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
