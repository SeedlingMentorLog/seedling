const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const getRoutes = require('./routes/getRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 5000; // Set your desired port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/get', getRoutes);
app.use('/post', postRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
