const express = require('express');
const router = express.Router();
const {db} = require("../config/db");

// Routes
router.get('/', (req, res) => {
    const query = 'SHOW TABLES';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Error executing query' });
        }
        const tables = result.map(row => Object.values(row)[0]);
        res.json({ tables });
    })
});

router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

module.exports = router;