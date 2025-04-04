const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

function verifyAdminOrStaffStatus(req, res, next) {
  const user_role = req.params.user_role;
  if (!user_role) {
    return res.status(400).json({ error: "User role is required" });
  }

  if (user_role !== "admin" && user_role !== "staff") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}

// Get user by firebase id
router.get("/user/:firebase_id", (req, res) => {
  const firebase_id = req.params.firebase_id;
  const query = `
    SELECT id, name, role, verified
    FROM USERS u
    WHERE u.firebase_id = ?;
  `;
  pool.query(query, [firebase_id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      user: {
        id: result[0].id,
        name: result[0].name,
        role: result[0].role,
        verified: result[0].verified,
      },
    });
  });
});

// Get all mentors (admin and staff only)
router.get("/mentors/:user_role", verifyAdminOrStaffStatus, (req, res) => {
  const query = `SELECT id, name FROM USERS WHERE role = 'mentor';`;
  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ mentors: result });
  });
});

// Get all school contacts (admin and staff only)
router.get(
  "/school_contacts/:user_role",
  verifyAdminOrStaffStatus,
  (req, res) => {
    const query = `SELECT id, name FROM USERS WHERE role = 'school contact';`;
    pool.query(query, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error executing query" });
      }
      res.status(200).json({ school_contacts: result });
    });
  }
);

router.get("/students/:mentor_id", (req, res) => {
  const mentor_id = req.params.mentor_id;
  const query = `
        SELECT mts.mentor_to_student_id,
               mts.mentor_id,
               mts.school_contact_id,
               mts.student_name,
               mts.student_birthday,
               mts.student_school,
               u.name AS mentor_name,
               sc.name AS school_contact_name
        FROM MENTOR_TO_STUDENT mts
        JOIN USERS u ON mts.mentor_id = u.id
        JOIN USERS sc ON mts.school_contact_id = sc.id
        WHERE mts.mentor_id = ?;
    `;

  pool.query(query, [mentor_id], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ error: "Error retrieving mentor-to-student records" });
    }
    res.json(results);
  });
});

// Get all mentor logs (admin and staff only)
router.get("/mentor_logs", (req, res) => {
  const query = `
    SELECT ml.id,
           ml.created_at,
           ml.date,
           ml.start_time,
           ml.end_time,
           ml.hours_logged,
           ml.activity,
           ml.met,
           ml.meeting_circumstance,
           ml.comments,
           u.name AS mentor_name,
           mts.student_name AS student_name,
           mts.student_school AS student_school,
           sc.name AS school_contact_name
    FROM MENTOR_LOGS ml
    JOIN USERS u ON ml.mentor_id = u.id
    JOIN MENTOR_TO_STUDENT mts ON ml.mentor_to_student_id = mts.mentor_to_student_id
    JOIN USERS sc ON mts.school_contact_id = sc.id
    ORDER BY ml.created_at DESC;
  `;

  pool.query(query, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(200).json({ logs: result });
  });
});

// Get logs by mentor id
router.get("/mentor_logs/:mentor_id", (req, res) => {
  const mentor_id = req.params.mentor_id;
  const query = `
    SELECT ml.id,
           ml.created_at,
           ml.date,
           ml.start_time,
           ml.end_time,
           ml.hours_logged,
           ml.activity,
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
           ml.date,
           ml.start_time,
           ml.end_time,
           ml.hours_logged,
           ml.activity,
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

// Get logs by date range (for a mentor or school contact)
router.post("/get_logs_by_date_range", (req, res) => {
  const { start_date, end_date, mentor_id, school_contact_id } = req.body;
  const query = `
    SELECT ml.id, 
           ml.created_at, 
           ml.date, 
           ml.start_time, 
           ml.end_time, 
           ml.hours_logged, 
           ml.activity,
           ml.met, 
           ml.meeting_circumstance, 
           ml.comments,
           u.name AS mentor_name, mts.student_name
    FROM MENTOR_LOGS ml
    JOIN USERS u ON ml.mentor_id = u.id
    JOIN MENTOR_TO_STUDENT mts ON ml.mentor_to_student_id = mts.mentor_to_student_id
    WHERE ml.date BETWEEN ? AND ?
    AND (ml.mentor_id = ? OR mts.school_contact_id = ?)
    ORDER BY ml.date DESC;
  `;

  pool.query(
    query,
    [start_date, end_date, mentor_id, school_contact_id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error executing query" });
      }
      res.status(200).json({ logs: result });
    }
  );
});

module.exports = router;
