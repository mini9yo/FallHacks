import React from 'react';
import Home from './components/Home'; // Correct import
import Gsaapi from './components/Gsaapi'; // Correct import

const App = () => {
  return (
    <div className="app-container w-full min-h-screen">
      {/* <Gsaapi /> */}
      <Home /> {/* Render the Home component */}
    
    </div>
  );
};

export default App;
