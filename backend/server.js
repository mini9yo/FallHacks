const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Function to read GTFS stops data
function loadStops() {
    const filePath = path.join(__dirname, 'gtfs', 'stops.txt');
    const stops = [];
    
    fs.readFileSync(filePath, 'utf8').split('\n').slice(1).forEach(line => {
        const [id, code, name, desc, lat, lon] = line.split(',');
        if (id) {
            stops.push({ id, name, latitude: parseFloat(lat), longitude: parseFloat(lon) });
        }
    });
    return stops;
}

// Endpoint to get all stops
app.get('/api/stops', (req, res) => {
    const stops = loadStops();
    res.json(stops);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
