const express = require('express');
const router = express.Router();

// Routes
router.get('/', (req, res) => {
    res.send('Express Backend is running!');
});

router.get('/data', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

module.exports = router;