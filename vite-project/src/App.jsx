import React from 'react';
import Home from './components/Home'; // Correct import

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
