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
        res.json({ message: "Log added successfully" });
      }
    );
  });
});

module.exports = router;
