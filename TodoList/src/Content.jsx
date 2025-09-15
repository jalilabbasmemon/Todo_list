import React, { useEffect, useState } from "react";
import "./Content.css";

function Content({ refresh }) {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  // Fetch tasks
  useEffect(() => {
    fetch("http://localhost:5000/api/todo")
      .then((res) => res.json())
      .then((data) => {
        // Reassign display IDs (sequential for frontend)
        const reordered = data.map((task, index) => ({
          ...task,
          displayId: index + 1, // for showing in table
          db_id: task.id, // keep original DB ID for API calls
        }));
        setTasks(reordered);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [refresh]);

  // Delete
  const handleDelete = async (db_id) => {
    await fetch(`http://localhost:5000/api/todo/${db_id}`, { method: "DELETE" });
    setTasks((prev) =>
      prev
        .filter((task) => task.db_id !== db_id)
        .map((task, index) => ({ ...task, displayId: index + 1 })) // re-index after delete
    );
  };

  // Done
  const handleDone = async (db_id) => {
    await fetch(`http://localhost:5000/api/todo/${db_id}/done`, { method: "PUT" });
    setTasks((prev) =>
      prev.map((task) =>
        task.db_id === db_id
          ? { ...task, status: "Completed", completion_time: new Date() }
          : task
      )
    );
  };

  // Edit
  const handleEdit = (task) => {
    setEditingTaskId(task.db_id);
    setEditDescription(task.description);
  };

  const handleSave = async (db_id) => {
    await fetch(`http://localhost:5000/api/todo/${db_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editDescription }),
    });

    setTasks((prev) =>
      prev.map((task) =>
        task.db_id === db_id ? { ...task, description: editDescription } : task
      )
    );
    setEditingTaskId(null);
  };

  return (
    <div className="content">
      <h2>📋 To-Do List</h2>
      <table className="todo-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Date Added</th>
            <th>Status</th>
            <th>Completion Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6">No tasks available</td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.db_id}>
                <td>{task.displayId}</td>
                <td>
                  {editingTaskId === task.db_id ? (
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  ) : (
                    task.description
                  )}
                </td>
                <td>{new Date(task.date_added).toLocaleString()}</td>
                <td>{task.status}</td>
                <td>
                  {task.status === "Completed" && task.completion_time
                    ? new Date(task.completion_time).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {editingTaskId === task.db_id ? (
                    <>
                      <button onClick={() => handleSave(task.db_id)}>💾 Save</button>
                      <button onClick={() => setEditingTaskId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <>
                      {task.status !== "Completed" && (
                        <button onClick={() => handleDone(task.db_id)}>✅ Done</button>
                      )}
                      <button onClick={() => handleEdit(task)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(task.db_id)}>❌ Remove</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Content;
