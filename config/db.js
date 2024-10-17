// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err.message);
//   } else {
//     console.log("Connected to MySQL database".bgMagenta.white);
//   }
// });

// export default db;

import mysql from "mysql2/promise"; // Use the promise-based version for async/await support
import dotenv from "dotenv"; // Import dotenv to use environment variables

// Load environment variables from .env file
dotenv.config();

// Create a pool connection using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // Maximum number of connections to create at once
});

// Function to test the pool connection
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    console.log("Database connection successful 🎉".bgMagenta.white);
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

// Call the test function to check the connection
testDbConnection();

export default pool; // Export the pool for use in other modules
