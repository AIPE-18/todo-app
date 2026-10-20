import { useState } from "react";

function TaskForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="add-row">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="What needs doing?"
      />
      <button className="add-btn" onClick={handleAdd}>Add</button>
    </div>
  );
}

export default TaskForm;