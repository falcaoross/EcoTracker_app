import React from "react";
import Action from "./Action";

const ImpactSummary = ({
  actions,
  totalCO2 = 0,
  totalActions,
  treesSaved,
  topAction,
  goalProgress,
  weeklyGoal,
  onGoalChange,
  onClear,
  onRemove,
  onIncrement,
  onDecrement,
  recentActions,
}) => {
  const impactColor =
    totalCO2 < 2 ? "red" : totalCO2 < 8 ? "orange" : "green";
  const goalPercentage = Math.round(goalProgress * 100);

  return (
    <div className="impact-summary">
      <div className={`summary-hero ${impactColor}`}>
        <div>
          <h2>Weekly impact</h2>
          <p>
            You have saved <strong>{totalCO2.toFixed(2)} kg</strong> of CO2 so
            far.
          </p>
        </div>
        <div className="hero-metrics">
          <div>
            <span>Logged actions</span>
            <strong>{totalActions}</strong>
          </div>
          <div>
            <span>Trees saved</span>
            <strong>{treesSaved}</strong>
          </div>
        </div>
      </div>

      <div className="goal-card">
        <div className="goal-header">
          <div>
            <h3>Weekly goal</h3>
            <p>Stay on track with a CO2 reduction target.</p>
          </div>
          <div className="goal-input">
            <input
              type="number"
              min="1"
              step="0.5"
              value={weeklyGoal}
              onChange={onGoalChange}
            />
            <span>kg</span>
          </div>
        </div>
        <div className="progress-bar">
          <span style={{ width: `${goalPercentage}%` }} />
        </div>
        <p className="progress-text">{goalPercentage}% of your goal reached</p>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <h4>Top action</h4>
          {topAction ? (
            <>
              <p>{topAction.name}</p>
              <span>{topAction.totalImpact.toFixed(2)} kg CO2</span>
            </>
          ) : (
            <p>Log your first action to see this.</p>
          )}
        </div>
        <div className="insight-card">
          <h4>Momentum</h4>
          <p>
            {totalActions > 0
              ? `You're averaging ${(totalCO2 / totalActions).toFixed(2)} kg per action.`
              : "Add actions to unlock insights."}
          </p>
        </div>
        <div className="insight-card">
          <h4>Next milestone</h4>
          <p>
            {totalCO2 >= weeklyGoal
              ? "Goal achieved! Set a higher target."
              : `${(weeklyGoal - totalCO2).toFixed(1)} kg left to hit your goal.`}
          </p>
        </div>
      </div>

      <div className="recent-activity">
        <div className="section-header">
          <h3>Recent activity</h3>
          <button className="ghost-button" onClick={onClear}>
            Reset week
          </button>
        </div>
        {recentActions.length === 0 ? (
          <p className="no-actions-message">No actions tracked yet.</p>
        ) : (
          <ul>
            {recentActions.map((action) => (
              <li key={action.id}>
                <span>{action.name}</span>
                <span>{action.count}x</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tracked-actions">
        <div className="section-header">
          <h3>Tracked actions</h3>
          <span className="hint">Edit counts or remove actions</span>
        </div>
        {actions.length === 0 ? (
          <p className="no-actions-message">No actions tracked yet.</p>
        ) : (
          actions.map((action) => (
            <Action
              key={action.id}
              action={action}
              onRemove={onRemove}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ImpactSummary;
