const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'DELETE', 'HEAD', 'OPTIONS'], // Allowed methods
    credentials: true, // Allow credentials
}));

// Sample endpoint to handle DELETE requests
app.delete('/data', (req, res) => {
    // Handle DELETE request logic here
    res.json({ message: 'Data deleted successfully!' });
});

// Optional: Handle OPTIONS requests explicitly
app.options('/data', (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5175");
    res.header("Access-Control-Allow-Methods", "GET, DELETE, HEAD, OPTIONS");
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
