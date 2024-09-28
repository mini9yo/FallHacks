import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [stops, setStops] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:8080/api/stops') 
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            setStops(data); 
            setLoading(false); 
        })
        .catch((error) => {
            setError(error); 
            setLoading(false); 
        });
  }, []); 

  return (
    <>
      <h1>Transit Route Finder</h1>

      {loading && <p>Loading stops...</p>} 
      {error && <p>Error fetching stops: {error.message}</p>} 

      <div className="stops-list">
          {stops.map((stop) => (
              <div key={stop.id} className="stop">
                  <p>{stop.name}</p>
                  <p>Lat: {stop.latitude}, Lon: {stop.longitude}</p>
              </div>
          ))}
      </div>
    </>
  );
}

export default App;
