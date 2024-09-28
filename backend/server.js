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

// Function to read GTFS stop times data
function loadStopTimes() {
    const filePath = path.join(__dirname, 'gtfs', 'stop_times.txt');
    const stopTimes = [];

    fs.readFileSync(filePath, 'utf8').split('\n').slice(1).forEach(line => {
        const [trip_id, arrival_time, departure_time, stop_id, stop_sequence, stop_headsign, pickup_type, drop_off_type, shape_dist_traveled, timepoint] = line.split(',');
        if (trip_id) {
            stopTimes.push({ trip_id, arrival_time, departure_time, stop_id, stop_sequence });
        }
    });
    return stopTimes;
}

// Function to find the best route from start to end
function findRoute(startId, endId, arrivalTime) {
    const stopTimes = loadStopTimes();
    const startTrips = stopTimes.filter((st) => st.stop_id === startId && st.arrival_time >= arrivalTime);

    const routes = [];

    startTrips.forEach((startStopTime) => {
        const tripId = startStopTime.trip_id;
        const tripStopTimes = stopTimes.filter((st) => st.trip_id === tripId);
        const endStopTime = tripStopTimes.find((st) => st.stop_id === endId);

        if (endStopTime) {
            const departureTime = startStopTime.departure_time;
            const arrivalTimeAtEnd = endStopTime.arrival_time;

            routes.push({
                trip_id: tripId,
                startStopId: startId,
                endStopId: endId,
                departureTime,
                arrivalTime: arrivalTimeAtEnd
            });
        }
    });

    return routes;
}

// Endpoint to get all stops
app.get('/api/stops', (req, res) => {
    const stops = loadStops();
    res.json(stops);
});

// Endpoint to calculate routes based on user inputs
app.get('/api/routes', (req, res) => {
    const { start, end, arrivalTime } = req.query;

    if (!start || !end || !arrivalTime) {
        return res.status(400).json({ error: "Start, end points, and arrival time are required." });
    }
    console.log(`Received Start: ${start}, End: ${end}, Arrival Time: ${arrivalTime}`);

    // Find routes
    const routes = findRoute(start, end, arrivalTime);

    if (routes.length === 0) {
        return res.json({ message: "No routes found." });
    }
    res.json(routes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
