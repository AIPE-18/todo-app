import { useState, useEffect } from "react";

const CATEGORIES = [
  { name: "Idea", icon: "💡" },
  { name: "Food", icon: "🍔" },
  { name: "Work", icon: "💼" },
  { name: "Sport", icon: "🏋️" },
  { name: "Music", icon: "🎵" },
];

const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const iconFor = (name) => CATEGORIES.find((c) => c.name === name)?.icon;
const isLong = (t) => t.type === "long";
const fmt = (key) =>
  new Date(key + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const daysLeft = (due) => {
  const today = new Date(toKey(new Date()) + "T00:00:00");
  return Math.round((new Date(due + "T00:00:00") - today) / 86400000);
};

function Hero({ dateText, title, sub, onAdd }) {
  return (
    <div className="hero">
      <div className="hero-date">{dateText}</div>
      <div className="hero-row">
        <div>
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>
        <button className="btn-light" onClick={onAdd}>
          Add New
        </button>
      </div>
    </div>
  );
}

function TaskRow({ t, highlight, onToggle, onDelete, onProgress }) {
  if (isLong(t)) {
    const left = daysLeft(t.due);
    const label = t.done
      ? "Completed"
      : left < 0
      ? `${-left} days overdue`
      : left === 0
      ? "Due today"
      : `${left} days left`;
    return (
      <div className={"long" + (t.done ? " done" : "")}>
        <div className="long-top">
          <div className="task-info">
            <small>Due {fmt(t.due)}</small>
            <strong>
              {iconFor(t.category)} {t.title}
            </strong>
            {t.desc && <span>{t.desc}</span>}
          </div>
          <input
            type="checkbox"
            checked={t.done}
            onChange={() => onToggle(t.id)}
          />
          <button className="x" onClick={() => onDelete(t.id)}>
            ×
          </button>
        </div>
        <div className="bar">
          <div className="bar-fill" style={{ width: t.progress + "%" }} />
        </div>
        <div className="long-bottom">
          <small>{label}</small>
          <small>{t.progress}%</small>
        </div>
        <input
          className="range"
          type="range"
          min="0"
          max="100"
          step="5"
          value={t.progress}
          onChange={(e) => onProgress(t.id, Number(e.target.value))}
        />
      </div>
    );
  }

  return (
    <div
      className={"task" + (highlight ? " next" : "") + (t.done ? " done" : "")}
    >
      <div className="task-info">
        <small>
          {t.start} - {t.end}
        </small>
        <strong>
          {iconFor(t.category)} {t.title}
        </strong>
        {t.desc && <span>{t.desc}</span>}
      </div>
      <input
        type="checkbox"
        checked={t.done}
        onChange={() => onToggle(t.id)}
      />
      <button className="x" onClick={() => onDelete(t.id)}>
        ×
      </button>
    </div>
  );
}

function Home({ tasks, selectedDate, onSelectDate, onAdd, ...actions }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  const selected = new Date(selectedDate + "T00:00:00");
  const isToday = selectedDate === toKey(new Date());
  const dayTasks = tasks
    .filter((t) => !isLong(t) && t.date === selectedDate)
    .sort((a, b) => a.start.localeCompare(b.start));
  const nextId = dayTasks.find((t) => !t.done)?.id;

  return (
    <div>
      <Hero
        dateText={selected.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })}
        title={
          isToday
            ? "Today"
            : selected.toLocaleDateString("en-US", { weekday: "long" })
        }
        sub={`${dayTasks.length} ${dayTasks.length === 1 ? "Task" : "Tasks"}`}
        onAdd={onAdd}
      />

      <div className="days">
        {days.map((d) => {
          const key = toKey(d);
          return (
            <button
              key={key}
              className={"day" + (key === selectedDate ? " active" : "")}
              onClick={() => onSelectDate(key)}
            >
              <strong>{d.getDate()}</strong>
              <span>{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
            </button>
          );
        })}
      </div>

      <h2 className="section-title">My Tasks</h2>
      <div className="task-list">
        {dayTasks.length === 0 && (
          <p className="empty">No tasks for this day. Tap Add New.</p>
        )}
        {dayTasks.map((t) => (
          <TaskRow key={t.id} t={t} highlight={t.id === nextId} {...actions} />
        ))}
      </div>
    </div>
  );
}

function LongTerm({ tasks, onAdd, ...actions }) {
  const list = tasks
    .filter(isLong)
    .sort((a, b) => a.due.localeCompare(b.due));
  const active = list.filter((t) => !t.done).length;

  return (
    <div>
      <Hero
        dateText={new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })}
        title="Long Term"
        sub={`${active} active goals`}
        onAdd={onAdd}
      />
      <h2 className="section-title">My Goals</h2>
      <div className="task-list">
        {list.length === 0 && (
          <p className="empty">No long-term tasks yet. Tap Add New.</p>
        )}
        {list.map((t) => (
          <TaskRow key={t.id} t={t} {...actions} />
        ))}
      </div>
    </div>
  );
}

function CalendarScreen({ tasks, onAdd, ...actions }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [sel, setSel] = useState(toKey(new Date()));
  const todayKey = toKey(new Date());

  const year = month.getFullYear();
  const m = month.getMonth();
  const offset = (new Date(year, m, 1).getDay() + 6) % 7;
  const total = new Date(year, m + 1, 0).getDate();
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  const keyOf = (day) => `${year}-${pad(m + 1)}-${pad(day)}`;
  const tasksOn = (key) =>
    tasks.filter((t) => (isLong(t) ? t.due : t.date) === key);
  const selTasks = tasksOn(sel);

  return (
    <div>
      <Hero
        dateText={new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        })}
        title="Calendar"
        sub="Tap a day to see its tasks"
        onAdd={() => onAdd(sel)}
      />

      <div className="cal">
        <div className="cal-head">
          <button onClick={() => setMonth(new Date(year, m - 1, 1))}>‹</button>
          <h3>
            {month.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button onClick={() => setMonth(new Date(year, m + 1, 1))}>›</button>
        </div>

        <div className="cal-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((w, i) => (
            <div key={i} className="cal-wd">
              {w}
            </div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={"b" + i} />;
            const key = keyOf(day);
            const has = tasksOn(key).length > 0;
            return (
              <button
                key={key}
                className={
                  "cal-day" +
                  (key === todayKey ? " today" : "") +
                  (key === sel ? " sel" : "")
                }
                onClick={() => setSel(key)}
              >
                {day}
                <i className="dot" style={{ opacity: has ? 1 : 0 }} />
              </button>
            );
          })}
        </div>
      </div>

      <h2 className="section-title">{fmt(sel)}</h2>
      <div className="task-list">
        {selTasks.length === 0 && (
          <p className="empty">Nothing planned for this day.</p>
        )}
        {selTasks.map((t) => (
          <TaskRow key={t.id} t={t} {...actions} />
        ))}
      </div>
    </div>
  );
}

function CreateTask({ tasks, defaults, onBack, onSave }) {
  const [type, setType] = useState(defaults.type);
  const [category, setCategory] = useState("Idea");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(defaults.date);
  const [due, setDue] = useState(defaults.date);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");

  const count = (name) => tasks.filter((t) => t.category === name).length;

  const save = () => {
    if (!title.trim()) return;
    if (type === "long") {
      if (!due) return;
      onSave({
        type: "long",
        title: title.trim(),
        desc: desc.trim(),
        category,
        due,
        progress: 0,
      });
    } else {
      onSave({
        type: "daily",
        title: title.trim(),
        desc: desc.trim(),
        category,
        date,
        start,
        end,
      });
    }
  };

  return (
    <div className="create">
      <div className="topbar">
        <button className="back" onClick={onBack}>
          ←
        </button>
        <h2>Create Task</h2>
      </div>

      <div className="type-toggle">
        <button
          className={type === "daily" ? "active" : ""}
          onClick={() => setType("daily")}
        >
          Daily Task
        </button>
        <button
          className={type === "long" ? "active" : ""}
          onClick={() => setType("long")}
        >
          Long Term
        </button>
      </div>

      <h3 className="label">Choose Activity</h3>
      {CATEGORIES.map((c) => {
        const n = count(c.name);
        return (
          <button
            key={c.name}
            className={"cat" + (category === c.name ? " active" : "")}
            onClick={() => setCategory(c.name)}
          >
            <span className="cat-icon">{c.icon}</span>
            <span className="cat-text">
              <strong>{c.name}</strong>
              <small>
                {n} {n === 1 ? "Task" : "Tasks"}
              </small>
            </span>
            <span>{category === c.name ? "✓" : "›"}</span>
          </button>
        );
      })}

      <input
        className="field"
        placeholder="Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="field"
        placeholder="Task Description..."
        rows="3"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      {type === "daily" ? (
        <>
          <label className="label">Date</label>
          <input
            className="field"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="time-row">
            <div>
              <label className="label">Start</label>
              <input
                className="field"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="label">End</label>
              <input
                className="field"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <label className="label">Due date</label>
          <input
            className="field"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </>
      )}

      <button className="btn-main" onClick={save}>
        Create Task
      </button>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("daily");
  const [prev, setPrev] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(toKey(new Date()));
  const [defaults, setDefaults] = useState({
    type: "daily",
    date: toKey(new Date()),
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks-v2");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks-v2", JSON.stringify(tasks));
  }, [tasks]);

  const openCreate = (type, date) => {
    setPrev(screen);
    setDefaults({ type, date: date || toKey(new Date()) });
    setScreen("create");
  };

  const addTask = (task) => {
    setTasks([...tasks, { id: Date.now(), done: false, ...task }]);
    if (task.type === "long") {
      setScreen("long");
    } else {
      setSelectedDate(task.date);
      setScreen("daily");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              done: !t.done,
              ...(isLong(t) ? { progress: !t.done ? 100 : 0 } : {}),
            }
          : t
      )
    );
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const setProgress = (id, value) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, progress: value, done: value === 100 } : t
      )
    );
  };

  const actions = {
    onToggle: toggleTask,
    onDelete: deleteTask,
    onProgress: setProgress,
  };

  return (
    <div className="phone">
      {screen === "daily" && (
        <Home
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onAdd={() => openCreate("daily", selectedDate)}
          {...actions}
        />
      )}
      {screen === "long" && (
        <LongTerm
          tasks={tasks}
          onAdd={() => openCreate("long")}
          {...actions}
        />
      )}
      {screen === "calendar" && (
        <CalendarScreen
          tasks={tasks}
          onAdd={(date) => openCreate("daily", date)}
          {...actions}
        />
      )}
      {screen === "create" && (
        <CreateTask
          tasks={tasks}
          defaults={defaults}
          onBack={() => setScreen(prev)}
          onSave={addTask}
        />
      )}

      {screen !== "create" && (
        <nav className="nav">
          {[
            ["daily", "☀️", "Daily"],
            ["long", "🎯", "Long Term"],
            ["calendar", "📆", "Calendar"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              className={screen === id ? "active" : ""}
              onClick={() => setScreen(id)}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;