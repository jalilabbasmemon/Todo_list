import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // your MySQL username
  password: "root", // your MySQL password
  database: "todolist_db",
   multipleStatements: true  
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected...");
});

export default db;
