const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Set your Graphhopper API key
const GRAPHOPPER_API_KEY = '3707abc8-3fc0-4f47-8dc9-da9e334a3796';
const GRAPHOPPER_URL = 'https://graphhopper.com/api/1/route';

// Function to load GTFS stops data
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

// Function to load trips data
function loadTrips() {
    const filePath = path.join(__dirname, 'gtfs', 'trips.txt');
    const trips = [];
    
    fs.readFileSync(filePath, 'utf8').split('\n').slice(1).forEach(line => {
        const [route_id, service_id, trip_id, trip_headsign, trip_short_name, direction_id, block_id, shape_id] = line.split(',');
        if (trip_id) {
            trips.push({ route_id, service_id, trip_id, trip_headsign });
        }
    });
    return trips;
}

// Function to load stop times data
function loadStopTimes() {
    const filePath = path.join(__dirname, 'gtfs', 'stop_times.txt');
    const stopTimes = [];
    
    fs.readFileSync(filePath, 'utf8').split('\n').slice(1).forEach(line => {
        const [trip_id, arrival_time, departure_time, stop_id, stop_sequence, stop_headsign] = line.split(',');
        if (trip_id) {
            stopTimes.push({ trip_id, arrival_time, departure_time, stop_id });
        }
    });
    return stopTimes;
}

// Endpoint to calculate routes based on user inputs
app.get('/api/routes', async (req, res) => {
    const { start, end } = req.query;

    // Validate inputs
    if (!start || !end) {
        return res.status(400).json({ error: "Start and end points are required." });
    }

    // Load necessary data
    const stops = loadStops();
    const trips = loadTrips();
    const stopTimes = loadStopTimes();
    
    // Find start and end stop coordinates from GTFS data
    const startStop = stops.find(stop => stop.id === start);
    const endStop = stops.find(stop => stop.id === end);

    if (!startStop || !endStop) {
        return res.status(404).json({ error: "Start or end stop not found." });
    }

    const startCoords = `${startStop.latitude},${startStop.longitude}`;
    const endCoords = `${endStop.latitude},${endStop.longitude}`;

    try {
        // Call the Graphhopper API for routing
        const response = await axios.get(GRAPHOPPER_URL, {
            params: {
                point: [startCoords, endCoords],
                key: GRAPHOPPER_API_KEY,
                vehicle: 'public_transport',
                algorithm: 'dijkstra'
            }
        });

        const routes = response.data.paths;
        res.json(routes);
    } catch (error) {
        console.error("Error fetching route data:", error);
        res.status(500).json({ error: 'Error fetching route data from Graphhopper' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
