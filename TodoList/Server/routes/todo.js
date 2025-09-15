import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ GET all tasks
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching tasks:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ POST new task
router.post("/", (req, res) => {
  const { description } = req.body;
  const sql = "INSERT INTO tasks (description, status, remarks) VALUES (?, ?, ?)";
  db.query(sql, [description, "Pending", ""], (err, result) => {
    if (err) {
      console.error("❌ Error inserting task:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({
      id: result.insertId,
      description,
      status: "Pending",
      remarks: "",
      date_added: new Date()
    });
  });
});

// ✅ PUT - Mark as done
router.put("/:id/done", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE tasks SET status = 'Completed', completion_time = NOW() WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, status: "Completed" });
  });
});

// ✅ PUT - Update description
router.put("/:id", (req, res) => {
  const { description } = req.body;
  const { id } = req.params;
  const sql = "UPDATE tasks SET description = ? WHERE id = ?";
  db.query(sql, [description, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, description });
  });
});

// ✅ DELETE task and reorder IDs
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete task" });

    // Reorder IDs properly
    const reorderQuery = `
      SET @count = 0;
      UPDATE tasks SET id = (@count := @count + 1) ORDER BY id;
      ALTER TABLE tasks AUTO_INCREMENT = 1;
    `;

    db.query(reorderQuery, (err2) => {
      if (err2) {
        console.error("❌ Failed to reorder IDs:", err2);
        return res.status(500).json({ error: "Failed to reorder IDs" });
      }
      res.json({ message: "Task deleted and IDs reordered" });
    });
  });
});




export default router;
