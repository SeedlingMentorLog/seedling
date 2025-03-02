const mysql = require("mysql2");
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

function createUsersTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS USERS (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firebase_id VARCHAR(28) UNIQUE NOT NULL,
          email VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(50) NOT NULL,
          role ENUM('unassigned', 'mentor', 'school contact', 'staff', 'admin') NOT NULL,
          verified BOOLEAN NOT NULL
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

function createMentorToStudentTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS MENTOR_TO_STUDENT (
          mentor_to_student_id INT AUTO_INCREMENT PRIMARY KEY,
          mentor_id INT NOT NULL,
          school_contact_id INT NOT NULL,
          student_name VARCHAR(50) NOT NULL,
          student_birthday DATE NOT NULL,
          student_school VARCHAR(80) NOT NULL,
          FOREIGN KEY (mentor_id) REFERENCES USERS (id),
          FOREIGN KEY (school_contact_id) REFERENCES USERS (id)
      );
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }
    console.log("Mentor to student table created or already exists.");
  });
}

function createMentorLogsTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS MENTOR_LOGS (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mentor_id INT NOT NULL,
          mentor_to_student_id INT NOT NULL,
          date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          hours_logged FLOAT NOT NULL,
          met BOOLEAN NOT NULL,
          meeting_circumstance ENUM('in-person', 'virtual', 'did not meet') NOT NULL,
          comments TEXT,
          FOREIGN KEY (mentor_id) REFERENCES USERS (id),
          FOREIGN KEY (mentor_to_student_id) REFERENCES MENTOR_TO_STUDENT (mentor_to_student_id)
      );
  `;

  pool.query(createTableQuery, (err, result) => {
    if (err) {
      console.error("Error creating table:", err.message);
      return;
    }
    console.log("Mentor logs table created or already exists.");
  });
}

module.exports = { pool, createUsersTable, createMentorToStudentTable, createMentorLogsTable };
