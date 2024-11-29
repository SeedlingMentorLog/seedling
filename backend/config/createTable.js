const pool = require('./db'); // Import the database connection

const createAndSeedTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const insertUserQuery = `
    INSERT INTO users (name, email, password)
    VALUES ('Test User', 'test@example.com', 'password123')
    ON CONFLICT (email) DO NOTHING;
  `;

  const fetchUsersQuery = `SELECT * FROM users;`;

  try {
    // Create the table
    await pool.query(createTableQuery);
    console.log("Table 'users' created successfully.");

    // Insert a default user
    await pool.query(insertUserQuery);
    console.log("Default user added successfully.");

    // Fetch and log all users
    const result = await pool.query(fetchUsersQuery);
    console.log("Current Users:", result.rows);
  } catch (error) {
    console.error("Error in createAndSeedTable:", error.message);
  } finally {
    pool.end(); // Close the database connection
  }
};

createAndSeedTable();