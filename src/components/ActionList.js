import React from "react";

const ActionList = ({
  actions,
  categories,
  selectedCategory,
  searchTerm,
  onCategoryChange,
  onSearchChange,
  onAddAction,
}) => (
  <div className="action-list">
    <div className="action-list-header">
      <div>
        <h3>Suggested eco actions</h3>
        <p>Pick a habit to log today.</p>
      </div>
      <div className="action-filters">
        <input
          type="text"
          placeholder="Search actions"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                category === selectedCategory ? "tab active" : "tab ghost"
              }
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div className="action-grid">
      {actions.map((action) => (
        <div key={action.id} className="action-card">
          <div>
            <div className="action-meta">
              <span className="pill">{action.category}</span>
              <span className="impact">
                {action.co2Reduction.toFixed(2)} kg CO2
              </span>
            </div>
            <h4>{action.name}</h4>
            <p>{action.description}</p>
          </div>
          <button
            className="secondary-button"
            onClick={() => onAddAction(action)}
          >
            Log this action
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ActionList;
