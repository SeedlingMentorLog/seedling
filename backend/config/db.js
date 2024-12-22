const mysql = require("mysql");
require("dotenv").config({ path: __dirname + "/../.env" });

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Number of connections in the pool
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the pool connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to the MySQL database via pool.");
  connection.release(); // Release the connection back to the pool
});

/**
 * Creates the users table in the database if it doesn't already exist.
 *
 * The table has the following columns:
 *
 * - id: INT AUTO_INCREMENT PRIMARY KEY
 * - name: VARCHAR(255) NOT NULL
 * - email: VARCHAR(255) NOT NULL UNIQUE
 * - password: VARCHAR(255) NOT NULL
 * - created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *
 * If the table already exists, this function does nothing.
 */
function createUsersTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }
    console.log("Users table created or already exists.");
  });
}

module.exports = { pool, createUsersTable };
