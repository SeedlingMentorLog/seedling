const express = require("express");
const router = express.Router();

// Add log
router.post("/add_log", (req, res) => {
  const {
    mentor_id,
    student_name,
    hours_logged,
    met,
    meeting_circumstance,
    comments,
  } = req.body;
  const query = `
    SELECT mts.mentor_to_student_id
    FROM MENTOR_TO_STUDENT mts
    WHERE mts.mentor_id = ? AND mts.student_name = ?;
  `;

  // First query retrieves the mentor to student ID for the given mentor ID and student name
  pool.query(query, [mentor_id, student_name], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    const mentor_to_student_id = result[0].mentor_to_student_id;
    const insertQuery = `
      INSERT INTO MENTOR_LOGS (mentor_id, mentor_to_student_id, hours_logged, met, meeting_circumstance, comments)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    // Second query adds the log to the DB
    pool.query(
      insertQuery,
      [
        mentor_id,
        mentor_to_student_id,
        hours_logged,
        met,
        meeting_circumstance,
        comments,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(201).json({ message: "Success" });
      }
    );
  });
});

// Add user (authentication process)
router.post("/add_user", (req, res) => {
  const { firebase_id, email, name } = req.body;
  const role = 'unassigned';
  const verified = false;
  
  const query = `
    INSERT INTO USERS (firebase_id, email, name, role, verified)
    VALUES (?, ?, ?, ?, ?);
  `;

  pool.query(query, [firebase_id, email, name, role, verified], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(201).json({ message: "User added successfully" });
  });
});


// Add a mentor-student relationship (admin only)
router.post("/add_mentor_to_student", (req, res) => {
  const { mentor_id, school_contact_id, student_name } = req.body;
  const query = `
    INSERT INTO MENTOR_TO_STUDENT (mentor_id, school_contact_id, student_name)
    VALUES (?, ?, ?);
  `;

  pool.query(
    query,
    [mentor_id, school_contact_id, student_name],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error executing query" });
      }
      res.status(201).json({ message: "Success" });
    }
  );
});

// Verify a user (admin only)
router.post("/verify_user", (req, res) => {
  const { id, role } = req.body;
  const query = `
    UPDATE USERS
    SET role = ?, verified = TRUE
    WHERE id = ?;
  `;

  pool.query(query, [role, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(201).json({ message: "Success" });
  });
});

// Update user profile
router.post("/update_user_profile", (req, res) => {
  const { email, name, role, id } = req.body;
  const query = `
    UPDATE USERS
    SET email = ?, name = ?, role = ?
    WHERE id = ?;
  `;

  pool.query(query, [email, name, role, id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ message: "User profile updated successfully" });
  });
});


module.exports = router;
