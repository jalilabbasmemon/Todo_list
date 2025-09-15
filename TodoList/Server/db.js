import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "user",          // your MySQL username
  password: "password", // your MySQL password
  database: "db_name",
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
