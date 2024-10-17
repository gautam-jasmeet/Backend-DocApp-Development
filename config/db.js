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

import mysql from "mysql2/promise"; // Use promise-based API
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for a connection to be available
  connectionLimit: 10, // Adjust the number of connections as needed
  queueLimit: 0, // No limit on the queue of waiting connections
});

// Function to query the database
const queryDatabase = async (query, params) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (err) {
    console.error("Database query error:", err.message);
    throw err; // Rethrow the error for further handling if needed
  }
};

// Connect to the database and log a message
const connectToDatabase = async () => {
  try {
    await pool.getConnection(); // Get a connection to test connectivity
    console.log(" Connected to MySQL database ".bgMagenta.white); // Colored connection message
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};

// Example usage of the queryDatabase function
const exampleQuery = async () => {
  const query = "SELECT * FROM documents"; // Replace with your actual table name
  try {
    const results = await queryDatabase(query);
    console.log(results);
  } catch (err) {
    console.error("Error executing query:", err);
  }
};

// Call the database connection function
connectToDatabase();

// Uncomment the following line to call the example query
// exampleQuery();

export { pool, queryDatabase };
