const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// Routes
router.get("/", (req, res) => {
  const query = "SHOW TABLES";
  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    const tables = result.map((row) => Object.values(row)[0]);
    res.status(200).json({ tables });
  });
});

// Get user by firebase id
router.get("/user/:firebase_id", (req, res) => {
  const firebase_id = req.params.firebase_id;
  const query = `
    SELECT *
    FROM USERS u
    WHERE u.firebase_id = ?;
  `;
  pool.query(query, [firebase_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ user: result[0] });
  });
});

// Get all mentors (admin and staff only)
router.get("/mentors", (req, res) => {
  const query = `SELECT id, name FROM USERS WHERE role = 'mentor';`;
  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ mentors: result });
  });
})

// Get all school contacts (admin and staff only)
router.get("/school_contacts", (req, res) => {
  const query = `SELECT id, name FROM USERS WHERE role = 'school contact';`;
  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ school_contacts: result });
  });
})

// Get logs by mentor id
router.get("/mentor_logs/:mentor_id", (req, res) => {
  const mentor_id = req.params.mentor_id;
  const query = `
    SELECT ml.id,
           ml.created_at,
           ml.hours_logged,
           ml.met,
           ml.meeting_circumstance,
           ml.comments,
           u.name AS mentor_name,
           mts.student_name AS student_name
    FROM MENTOR_LOGS ml
    JOIN USERS u ON ml.mentor_id = u.id
    JOIN MENTOR_TO_STUDENT mts ON ml.mentor_to_student_id = mts.mentor_to_student_id
    WHERE ml.mentor_id = ?
    ORDER BY ml.created_at DESC;
  `;
  pool.query(query, [mentor_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ logs: result });
  });
});

// Get logs by school contact id
router.get("/school_logs/:school_id", (req, res) => {
  const school_contact_id = req.params.school_id;
  const query = `
    SELECT ml.id,
           ml.created_at,
           ml.hours_logged,
           ml.met,
           ml.meeting_circumstance,
           ml.comments,
           u.name AS mentor_name,
           mts.student_name AS student_name
    FROM MENTOR_LOGS ml
    JOIN USERS u ON ml.mentor_id = u.id
    JOIN MENTOR_TO_STUDENT mts ON ml.mentor_to_student_id = mts.mentor_to_student_id
    WHERE mts.school_contact_id = ?
    ORDER BY ml.created_at DESC;
  `;
  pool.query(query, [school_contact_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ logs: result });
  });
});

router.get("/data", (req, res) => {
  res.status(200).json({ message: "Hello from the backend!" });
});

module.exports = router;

// Get logs by date range (for a mentor or school contact)
router.post("/get_logs_by_date_range", (req, res) => {
  const { start_date, end_date, mentor_id, school_contact_id } = req.body;
  const query = `
    SELECT ml.id, ml.created_at, ml.hours_logged, ml.met, ml.meeting_circumstance, ml.comments,
           u.name AS mentor_name, mts.student_name
    FROM MENTOR_LOGS ml
    JOIN USERS u ON ml.mentor_id = u.id
    JOIN MENTOR_TO_STUDENT mts ON ml.mentor_to_student_id = mts.mentor_to_student_id
    WHERE ml.created_at BETWEEN ? AND ?
    AND (ml.mentor_id = ? OR mts.school_contact_id = ?)
    ORDER BY ml.created_at DESC;
  `;
  
  pool.query(query, [start_date, end_date, mentor_id, school_contact_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ logs: result });
  });
});
