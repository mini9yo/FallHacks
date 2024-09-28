<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./components/Home"

function App() {
  const [stops, setStops] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // useEffect(() => {
  //   fetch('http://localhost:8080/api/stops') 
  //       .then((response) => {
  //           if (!response.ok) {
  //               throw new Error('Network response was not ok');
  //           }
  //           return response.json();
  //       })
  //       .then((data) => {
  //           setStops(data); 
  //           setLoading(false); 
  //       })
  //       .catch((error) => {
  //           setError(error); 
  //           setLoading(false); 
  //       });
  // }, []); 
=======
import React from 'react';
import Home from './components/Home'; // Correct import
>>>>>>> refs/remotes/origin/main

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Transit Route Finder</h1>
      </header>
      <Home /> {/* Render the Home component */}
    </div>
  );
};

export default App;
