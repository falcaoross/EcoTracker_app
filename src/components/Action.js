import React from "react";

const Action = ({ action, onRemove, onIncrement, onDecrement }) => (
  <div className="tracked-action">
    <div>
      <h4>{action.name}</h4>
      <p>
        {(action.co2Reduction * action.count).toFixed(2)} kg CO2 · {action.count}
        x
      </p>
    </div>
    <div className="action-controls">
      <button
        className="icon-button"
        onClick={() => onDecrement(action.id)}
      >
        -
      </button>
      <button
        className="icon-button"
        onClick={() => onIncrement(action)}
      >
        +
      </button>
      <button
        className="danger-button"
        onClick={() => onRemove(action.id)}
      >
        Remove
      </button>
    </div>
  </div>
);

export default Action;
