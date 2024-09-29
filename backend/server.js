const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path'); // Import path module
const loadStops = require('./loadStops'); // Load mock stops data

const app = express();
const port = process.env.PORT || 3000;

// Load the stops data
const stops = loadStops();

// Enable CORS
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API route to interact with OTP and fetch transit routes
app.get('/api/plan', async (req, res) => {
    const { fromPlace, toPlace, time } = req.query;

    // Convert stop IDs to coordinates
    const fromCoordinates = stops[fromPlace];
    const toCoordinates = stops[toPlace];

    if (!fromCoordinates || !toCoordinates) {
        return res.status(400).json({ error: 'Invalid stop ID(s) provided.' });
    }

    // Construct OTP URL with latitude and longitude
    const otpUrl = `http://localhost:8080/otp/routers/default/plan?fromPlace=${fromCoordinates.lat},${fromCoordinates.lon}&toPlace=${toCoordinates.lat},${toCoordinates.lon}&time=${time}&mode=TRANSIT,WALK`;

    try {
        const response = await fetch(otpUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from OTP:', error);
        res.status(500).json({ error: 'Error fetching data from OTP server' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
