const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const { pool } = require("../config/db");

function verifyAdminStatus(req, res, next) {
  const user_role = req.params.user_role;
  if (!user_role) {
    return res.status(400).json({ error: "User role is required" });
  }

  if (user_role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}

// Add log
router.post("/add_log", (req, res) => {
  const {
    mentor_id,
    mentor_to_student_id,
    date,
    start_time,
    end_time,
    hours_logged,
    activity,
    meeting_circumstance,
    comments,
  } = req.body;

  const query = `
      INSERT INTO MENTOR_LOGS (mentor_id, mentor_to_student_id, date, start_time, end_time, hours_logged, activity, meeting_circumstance, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

  // Second query adds the log to the DB
  pool.query(
    query,
    [
      mentor_id,
      mentor_to_student_id,
      date,
      start_time,
      end_time,
      hours_logged,
      activity,
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

// Delete log
router.post("/delete_log", (req, res) => {
  const { id } = req.body;
  const query = `DELETE FROM MENTOR_LOGS WHERE id = ?;`;
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.status(201).json({ message: "Success" });
  });
});

// Add user (authentication process)
router.post("/add_user", (req, res) => {
  const { firebase_id, email, name } = req.body;
  const role = "unassigned";
  const verified = false;

  const query = `
    INSERT INTO USERS (firebase_id, email, name, role, verified)
    VALUES (?, ?, ?, ?, ?);
  `;

  pool.query(
    query,
    [firebase_id, email, name, role, verified],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error executing query" });
      }

      // Return the newly created user data
      res.status(201).json({
        user: {
          id: result.insertId,
          name: name,
          role: role,
          verified: verified,
        },
      });
    }
  );
});

// Add a mentor-student relationship (admin only)
router.post(
  "/add_mentor_to_student/:user_role",
  verifyAdminStatus,
  (req, res) => {
    const {
      mentor_id,
      school_contact_id,
      student_name,
      start_date,
      end_date,
      student_birthday,
      student_school,
    } = req.body;
    const query = `
    INSERT INTO MENTOR_TO_STUDENT (mentor_id, school_contact_id, student_name, start_date, end_date, student_birthday, student_school)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

    pool.query(
      query,
      [
        mentor_id,
        school_contact_id,
        student_name,
        start_date,
        end_date,
        student_birthday,
        student_school,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(201).json({ message: "Success" });
      }
    );
  }
);

// Update a mentor-student relationship (admin only)
router.post(
  "/update_mentor_to_student/:user_role",
  verifyAdminStatus,
  (req, res) => {
    const {
      relationship_id, // required to identify which row to update
      school_contact_id,
      student_name,
      start_date,
      end_date,
      student_birthday,
      student_school,
    } = req.body;

    const query = `
      UPDATE MENTOR_TO_STUDENT
      SET school_contact_id = ?,
          student_name = ?,
          start_date = ?,
          end_date = ?,
          student_birthday = ?,
          student_school = ?
      WHERE mentor_to_student_id = ?;
    `;

    pool.query(
      query,
      [
        school_contact_id,
        student_name,
        start_date,
        end_date,
        student_birthday,
        student_school,
        relationship_id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(200).json({ message: "Relationship updated successfully" });
      }
    );
  }
);

// Update user profile
router.post(
  "/update_user_profile/:user_role",
  verifyAdminStatus,
  (req, res) => {
    const { email, name, role, id } = req.body;
    const query = `
    UPDATE USERS
    SET email = ?, name = ?, role = ?, verified = TRUE
    WHERE id = ?;
  `;

    pool.query(query, [email, name, role, id], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error executing query" });
      }
      res.status(200).json({ message: "User profile updated successfully" });
    });
  }
);

// Delete user
router.post(
  "/delete_user/:user_role",
  verifyAdminStatus,
  async (req, res) => {
    
    const { firebase_id } = req.body;
    if (!firebase_id) {
      return res.status(400).json({ error: "Firebase ID is required" });
    }

    try {
      await admin.auth().deleteUser(firebase_id);
      const query = `DELETE FROM USERS WHERE firebase_id = ?;`;
      pool.query(query, [firebase_id], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(200).json({ message: "User deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting user from Firebase:", error.message);
      return res
        .status(500)
        .json({ error: "Error deleting user from Firebase" });
    }
  }
);

// Delete log
router.post(
  "/delete_log/:user_role",
  verifyAdminStatus,
  async (req, res) => {
    
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Log ID is required" });
    }

    try {
      const query = `DELETE FROM MENTOR_LOGS WHERE id = ?;`;
      pool.query(query, [id], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(200).json({ message: "Log deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting log:", error.message);
      return res
        .status(500)
        .json({ error: "Error deleting log" });
    }
  }
);

// Delete relationship
router.post(
  "/delete_relationship/:user_role",
  verifyAdminStatus,
  async (req, res) => {
    
    const { mentor_to_student_id } = req.body;
    if (!mentor_to_student_id) {
      return res.status(400).json({ error: "Relationship ID is required" });
    }

    try {
      const query = `DELETE FROM MENTOR_TO_STUDENT WHERE mentor_to_student_id = ?;`;
      pool.query(query, [mentor_to_student_id], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Error executing query" });
        }
        res.status(200).json({ message: "Relationship deleted successfully" });
      });
    } catch (error) {
      console.error("Error deleting relationship:", error.message);
      return res
        .status(500)
        .json({ error: "Error deleting relationship" });
    }
  }
);

module.exports = router;
