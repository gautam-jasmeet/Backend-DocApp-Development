import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for a connection if all are in use
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // No limit to the queue
});

pool.on("error", (err) => {
  console.error("MySQL Pool Error:", err.message);
});

// Test the connection and log the "MySQL connected" message
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL❌:", err.message);
  } else {
    console.log("Connected to MySQL database🎉".bgMagenta.white);
    connection.release(); // Release the connection back to the pool
  }
});

export default pool.promise(); // Export the pool as a promise for async/await usage
