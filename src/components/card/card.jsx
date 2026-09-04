import React from "react";
import "./card.scss";

const Card = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onAdd,
  onSearch,
  titleKeys,
  bodyKeys, // can be strings or objects { label, render }
}) => {
  return (
    <div className="card-wrapper">
      {/* Search & Add */}
      {(onSearch || onAdd) && (
        <div className="card-header-actions">
          {onSearch && (
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
            />
          )}
          {onAdd && (
            <button className="btn add-btn" onClick={onAdd}>
              + Add
            </button>
          )}
        </div>
      )}

      {/* Card Grid */}
      <div className="card-grid">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={item.id} className="card-item">
              {/* Title */}
              {titleKeys && (
                <div className="card-title">
                  {titleKeys.map((key) =>
                    typeof key === "object" && key.render
                      ? key.render(item, index)
                      : item[key]
                  )}
                </div>
              )}

              {/* Body */}
              {bodyKeys && (
                <div className="card-body">
                  {bodyKeys.map((key) => {
                    if (typeof key === "string") {
                      return (
                        <div className="card-row" key={key}>
                          <span className="label">{key}:</span>
                          <span className="value">{item[key]}</span>
                        </div>
                      );
                    } else if (typeof key === "object") {
                      return (
                        <div className="card-row" key={key.label}>
                          <span className="label">{key.label}:</span>
                          <span className="value">{key.render(item)}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="card-footer">
                {onView && (
                  <button className="btn view-btn" onClick={() => onView(item)}>
                    View
                  </button>
                )}
                {onEdit && (
                  <button className="btn edit-btn" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    className="btn delete-btn"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>
    </div>
  );
};

export default Card;
