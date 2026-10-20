import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  const save = () => {
    if (draft.trim() !== "") {
      onEdit(task.id, draft);
    } else {
      setDraft(task.text);
    }
    setEditing(false);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />

      {editing ? (
        <input
          className="edit-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === "Enter" && save()}
        />
      ) : (
        <span
          className={task.done ? "done" : ""}
          onDoubleClick={() => setEditing(true)}
        >
          {task.text}
        </span>
      )}

      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  );
}

export default TaskItem;