import { FaPlus, FaTrash } from "react-icons/fa";
import "./itemTable.scss";

const ItemTable = ({
  items,
  columns,
  onItemChange,
  onRemoveItem,
  onAddItem,
  itemOptions = [],
}) => {
  return (
    <div className="input-group">
      <label>Items</label>
      <div className="item-table-wrapper">
        <table className="item-table">
          <thead>
            <tr>
              {columns?.map((col) => (
                <th key={col.key} style={{ width: col.width || "auto" }}>
                  {col.label}
                </th>
              ))}
              <th style={{ width: "80px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((row, index) => (
              <tr key={index}>
                {columns?.map((col) => {
                  const cellValue = row[col.key];

                  if (col.key === "srNo") {
                    return (
                      <td key={col.key} style={{ width: col.width }}>
                        {index + 1}
                      </td>
                    );
                  }
                  return (
                    <td key={col.key} style={{ width: col.width }}>
                      {col.type === "readonly" ? (
                        <span>{cellValue}</span>
                      ) : col.type === "number" ? (
                        <input
                          type="number"
                          value={cellValue}
                          onChange={(e) =>
                            onItemChange(index, col.key, e.target.value)
                          }
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) =>
                            ["e", "E", "-", "+"].includes(e.key) &&
                            e.preventDefault()
                          }
                        />
                      ) : col.type === "dropdown" ? (
                        <select
                          value={cellValue}
                          onChange={(e) =>
                            onItemChange(index, col.key, e.target.value)
                          }
                        >
                          <option value="">Select Item</option>
                          {itemOptions?.map((opt, i) => (
                            <option key={i} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={cellValue}
                          onChange={(e) =>
                            onItemChange(index, col.key, e.target.value)
                          }
                        />
                      )}
                    </td>
                  );
                })}

                <td className="action-cell">
                  <div className="action-inline">
                    <button
                      type="button"
                      onClick={onAddItem}
                      className="btn-add"
                    >
                      <FaPlus />
                    </button>

                    {items?.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => onRemoveItem(index)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="item-table-footer">
        <button type="button" onClick={onAddItem} className="btn-add">
          <FaPlus />
        </button>
      </div> */}
    </div>
  );
};

export default ItemTable;
