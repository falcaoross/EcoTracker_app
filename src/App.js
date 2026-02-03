import "./App.css";
import React, { useState, useEffect, useMemo } from "react";
import ActionList from "./components/ActionList";
import ImpactSummary from "./components/ImpactSummary";

const ecoActions = [
  {
    id: 1,
    name: "Use a reusable water bottle",
    co2Reduction: 0.5,
    category: "Lifestyle",
    description: "Replace disposable plastic bottles.",
  },
  {
    id: 2,
    name: "Take public transport",
    co2Reduction: 2.6,
    category: "Travel",
    description: "Swap a car ride for a bus or train.",
  },
  {
    id: 3,
    name: "Eat a plant-based meal",
    co2Reduction: 0.8,
    category: "Food",
    description: "Choose vegetarian meals a few times a week.",
  },
  {
    id: 4,
    name: "Use energy-efficient light bulbs",
    co2Reduction: 0.1,
    category: "Home",
    description: "LEDs use 75% less energy.",
  },
  {
    id: 5,
    name: "Recycle paper",
    co2Reduction: 0.2,
    category: "Waste",
    description: "Keep paper out of landfills.",
  },
  {
    id: 6,
    name: "Air-dry laundry",
    co2Reduction: 1.4,
    category: "Home",
    description: "Skip the dryer for one load.",
  },
  {
    id: 7,
    name: "Carpool with a friend",
    co2Reduction: 1.9,
    category: "Travel",
    description: "Share rides to cut emissions.",
  },
  {
    id: 8,
    name: "Bring a reusable shopping bag",
    co2Reduction: 0.3,
    category: "Lifestyle",
    description: "Avoid single-use bags.",
  },
];

const App = () => {
  const [availableActions, setAvailableActions] = useState(ecoActions);
  const [actions, setActions] = useState([]);
  const [totalCO2, setTotalCO2] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weeklyGoal, setWeeklyGoal] = useState(12);
  const [customAction, setCustomAction] = useState({
    name: "",
    co2Reduction: "",
    category: "Lifestyle",
    description: "",
  });

  // Load data from localStorage when the app loads
  useEffect(() => {
    const storedActions =
      JSON.parse(localStorage.getItem("trackedActions")) || [];
    const storedCustomActions =
      JSON.parse(localStorage.getItem("customActions")) || [];
    const storedGoal = Number(localStorage.getItem("weeklyGoal"));
    if (!Number.isNaN(storedGoal) && storedGoal > 0) {
      setWeeklyGoal(storedGoal);
    }
    setAvailableActions([...ecoActions, ...storedCustomActions]);
    setActions(storedActions);
    calculateTotalCO2(storedActions);
  }, []);

  // Update localStorage whenever actions change
  useEffect(() => {
    localStorage.setItem("trackedActions", JSON.stringify(actions));
    calculateTotalCO2(actions);
  }, [actions]);

  useEffect(() => {
    const customActionsToStore = availableActions.filter(
      (action) => action.isCustom
    );
    localStorage.setItem("customActions", JSON.stringify(customActionsToStore));
  }, [availableActions]);

  useEffect(() => {
    localStorage.setItem("weeklyGoal", weeklyGoal);
  }, [weeklyGoal]);

  const calculateTotalCO2 = (actions) => {
    const total = actions.reduce(
      (sum, action) => sum + action.co2Reduction * action.count,
      0
    );
    setTotalCO2(total);
  };

  const handleAddAction = (action) => {
    const existingAction = actions.find((a) => a.id === action.id);
    if (existingAction) {
      setActions(
        actions.map((a) =>
          a.id === action.id
            ? { ...a, count: a.count + 1, updatedAt: Date.now() }
            : a
        )
      );
    } else {
      setActions([
        ...actions,
        { ...action, count: 1, updatedAt: Date.now() },
      ]);
    }
  };

  const handleClearActions = () => setActions([]);

  const handleRemoveAction = (id) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const handleDecrementAction = (id) => {
    setActions((prevActions) =>
      prevActions
        .map((action) =>
          action.id === id
            ? {
                ...action,
                count: action.count - 1,
                updatedAt: Date.now(),
              }
            : action
        )
        .filter((action) => action.count > 0)
    );
  };

  const handleGoalChange = (event) => {
    const value = Number(event.target.value);
    if (!Number.isNaN(value)) {
      setWeeklyGoal(value);
    }
  };

  const handleCustomActionChange = (event) => {
    const { name, value } = event.target;
    setCustomAction((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomAction = (event) => {
    event.preventDefault();
    const trimmedName = customAction.name.trim();
    const trimmedDescription = customAction.description.trim();
    const parsedCo2 = Number(customAction.co2Reduction);
    if (!trimmedName || Number.isNaN(parsedCo2) || parsedCo2 <= 0) {
      return;
    }

    const newAction = {
      id: Date.now(),
      name: trimmedName,
      co2Reduction: parsedCo2,
      category: customAction.category || "Lifestyle",
      description: trimmedDescription || "Custom action",
      isCustom: true,
    };
    setAvailableActions((prev) => [...prev, newAction]);
    setCustomAction({
      name: "",
      co2Reduction: "",
      category: customAction.category,
      description: "",
    });
  };

  const filteredActions = useMemo(() => {
    return availableActions.filter((action) => {
      const matchesSearch = action.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || action.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableActions, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(availableActions.map((action) => action.category))
    );
    return ["All", ...unique];
  }, [availableActions]);

  const totalActionsCount = actions.reduce(
    (sum, action) => sum + action.count,
    0
  );
  const treesSaved = Math.floor(totalCO2 / 10);
  const topAction = actions.reduce(
    (top, action) => {
      const totalImpact = action.co2Reduction * action.count;
      if (!top || totalImpact > top.totalImpact) {
        return { ...action, totalImpact };
      }
      return top;
    },
    null
  );
  const goalProgress = weeklyGoal > 0 ? Math.min(totalCO2 / weeklyGoal, 1) : 0;
  const recentActions = [...actions]
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 3);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">EcoTracker</p>
          <h1>Track your daily climate wins</h1>
          <p className="subtitle">
            Build sustainable habits, measure your impact, and hit your weekly
            goals.
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <p>Total CO2 saved</p>
            <h2>{totalCO2.toFixed(2)} kg</h2>
          </div>
          <div className="stat-card">
            <p>Actions logged</p>
            <h2>{totalActionsCount}</h2>
          </div>
          <div className="stat-card">
            <p>Trees saved</p>
            <h2>{treesSaved}</h2>
          </div>
        </div>
      </header>

      <main className="app-grid">
        <section className="panel action-panel">
          <ActionList
            actions={filteredActions}
            categories={categories}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
            onAddAction={handleAddAction}
          />
          <form className="custom-action" onSubmit={handleAddCustomAction}>
            <div className="custom-header">
              <div>
                <h3>Create a custom action</h3>
                <p>Add something unique to your routine.</p>
              </div>
              <span className="badge">New</span>
            </div>
            <div className="custom-grid">
              <label>
                Action name
                <input
                  type="text"
                  name="name"
                  value={customAction.name}
                  onChange={handleCustomActionChange}
                  placeholder="Bike to work"
                />
              </label>
              <label>
                CO2 reduction (kg)
                <input
                  type="number"
                  name="co2Reduction"
                  value={customAction.co2Reduction}
                  onChange={handleCustomActionChange}
                  placeholder="1.2"
                  min="0"
                  step="0.1"
                />
              </label>
              <label>
                Category
                <select
                  name="category"
                  value={customAction.category}
                  onChange={handleCustomActionChange}
                >
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>
              <label className="span-two">
                Description
                <input
                  type="text"
                  name="description"
                  value={customAction.description}
                  onChange={handleCustomActionChange}
                  placeholder="Short tip or motivation"
                />
              </label>
            </div>
            <button className="primary-button" type="submit">
              Add custom action
            </button>
          </form>
        </section>

        <section className="panel summary-panel">
          <ImpactSummary
            actions={actions}
            totalCO2={totalCO2}
            totalActions={totalActionsCount}
            treesSaved={treesSaved}
            topAction={topAction}
            goalProgress={goalProgress}
            weeklyGoal={weeklyGoal}
            onGoalChange={handleGoalChange}
            onClear={handleClearActions}
            onRemove={handleRemoveAction}
            onIncrement={handleAddAction}
            onDecrement={handleDecrementAction}
            recentActions={recentActions}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
