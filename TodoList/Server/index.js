import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import todoRoutes from "./routes/todo.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/todo", todoRoutes);

app.get("/", (req, res) => {
  res.send("✅ Todo API running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
