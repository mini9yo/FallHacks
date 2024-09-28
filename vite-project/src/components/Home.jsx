import React, { useState } from 'react';

const App = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startPoint || !endPoint) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    console.log(`Start Point: ${startPoint}, End Point: ${endPoint}`);
    // Add logic to fetch routes here
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-blue-500">
      <h1 className="text-5xl font-extrabold text-white mb-8">Transit App</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="start" className="block text-lg font-medium text-gray-800 mb-2">Start Point</label>
          <input
            type="text"
            id="start"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter start point"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="end" className="block text-lg font-medium text-gray-800 mb-2">End Point</label>
          <input
            type="text"
            id="end"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Enter end point"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg w-full hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
        >
          Find Routes
        </button>
      </form>
    </div>
  );
};

export default App;
