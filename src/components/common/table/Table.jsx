import "./table.scss";

function Table({
  columns = [],
  data = [],
  rowKey = "id",
  emptyMessage = "No data available.",
}) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead className="table__head">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={column.align ? `table__cell--${column.align}` : ""}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="table__body">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row[rowKey] ?? index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={
                      column.align ? `table__cell--${column.align}` : ""
                    }
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="table__empty" colSpan={columns.length || 1}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
