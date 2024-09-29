// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');
// const path = require('path'); // Import path module
// const loadStops = require('./loadStops'); // Load mock stops data

// const app = express();
// const port = process.env.PORT || 3000;

// // Load the stops data
// const stops = loadStops();

// // Enable CORS
// app.use(cors());

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));

// // API route to interact with OTP and fetch transit routes
// app.get('/api/plan', async (req, res) => {
//     const { fromPlace, toPlace, time } = req.query;

//     // Convert stop IDs to coordinates
//     const fromCoordinates = stops[fromPlace];
//     const toCoordinates = stops[toPlace];

//     if (!fromCoordinates || !toCoordinates) {
//         return res.status(400).json({ error: 'Invalid stop ID(s) provided.' });
//     }

//     // Construct OTP URL with latitude and longitude
//     const otpUrl = `http://localhost:8080/otp/routers/default/plan?fromPlace=${fromCoordinates.lat},${fromCoordinates.lon}&toPlace=${toCoordinates.lat},${toCoordinates.lon}&time=${time}&mode=TRANSIT,WALK`;

//     try {
//         const response = await fetch(otpUrl);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error('Error fetching data from OTP:', error);
//         res.status(500).json({ error: 'Error fetching data from OTP server' });
//     }
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


// Function to load GTFS stops data
function loadStops() {
    const filePath = path.join(__dirname, 'gtfs', 'stops.txt');
    const stops = [];
    
    fs.readFileSync(filePath, 'utf8').split('\n').slice(1).forEach(line => {
        const [id, code, name, desc, lat, lon] = line.split(',');
        if (id) {
            stops.push({ code, name, latitude: parseFloat(lat), longitude: parseFloat(lon) });
        }
    });
    return stops;
}
 
async function coorToAddress(lat,long)
{
    const apiKey = "AIzaSyBMf52_BRl8QKID5lwoEHk92KQ2yu9fQzU" ;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;
    // Covert longitude and longitude to 
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK') {
            return data.results[0].formatted_address;  // Return the formatted address
        } else {
            throw new Error(`Geocoding error: ${data.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Re-throw the error to be handled in the calling function
    }
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
    
    // Find start and end stop coordinates from GTFS data
    const startStop = stops.find(stop => stop.code === start);
    const endStop = stops.find(stop => stop.code === end);

    if (!startStop || !endStop) {
        return res.status(404).json({ error: "Start or end stop not found." });
    }
    const startAddress = await coorToAddress(startStop.latitude, startStop.longitude);
    const endAddress = await coorToAddress(endStop.latitude, endStop.longitude);
    // Prepare Distance Matrix API call
    const apiKey = "AIzaSyBMf52_BRl8QKID5lwoEHk92KQ2yu9fQzU";  // Your API key
    const origin = encodeURI(startAddress);  // The starting point address
    const destination = encodeURI(endAddress);  // The ending point address

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=transit&key=${apiKey}`;

    // Fetch distance and duration from Google Distance Matrix API
    const fetchResponse = await fetch(url);
    const data = await fetchResponse.json();
    if (data.status === 'OK') {
        const element = data.rows[0].elements[0];
        const distance = element.distance.text;
        const duration = element.duration.text;

        return res.status(200).json({
            startAddress,
            endAddress,
            distance,
            duration
        });
    }
    });

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
