import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import TaskItem from "./components/TaskItem";

function App() {
  const [filter, setFilter] = useState("all");
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    setTasks([...tasks, { id: Date.now(), text: text, done: false }]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };
  const editTask = (id, newText) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    )
  );
};

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.done));
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <div className="app">
      <h1>Gilded Tasks</h1>
      <p className="subtitle">Your daily agenda, elegantly kept</p>
      <div className="divider"></div>

      <TaskForm onAdd={addTask} />
      <FilterBar filter={filter} onChange={setFilter} />

      <ul>
        {visibleTasks.map((task) => (
          <TaskItem
           key={task.id}
           task={task}
           onToggle={toggleTask}
           onDelete={deleteTask}
           onEdit={editTask}

          />
          
        ))}
      </ul>
      {visibleTasks.length === 0 && (
        <p className="empty">Nothing here yet. Add your first task above.</p>
      )}

      <div className="footer">
        <span>{remaining} tasks left</span>
        <button onClick={clearCompleted}>Clear completed</button>
      </div>
    </div>
  );
}

export default App;