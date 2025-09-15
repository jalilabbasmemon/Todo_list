import React, { useState } from "react";
import "./Create.css";

function Create({ onTaskAdded }) {
  const [task, setTask] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (task.trim() !== "") {
      try {
        const response = await fetch("http://localhost:5000/api/todo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: task }),
        });

        const newTask = await response.json();
        onTaskAdded(); // trigger refresh
        setTask("");   // clear input
      } catch (err) {
        console.error("Error adding task:", err);
      }
    }
  };

  return (
    <form className="Create" onSubmit={handleAdd}>
      <label htmlFor="tasks">Task</label>
      <input
        type="text"
        id="tasks"
        placeholder="Enter your Task here..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit" className="add-btn">Add</button>
    </form>
  );
}

export default Create;
