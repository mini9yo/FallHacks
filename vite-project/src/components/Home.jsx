import React, { useState } from 'react';

const Home = () => {
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

    fetch(`http://localhost:8080/api/routes?start=${startPoint}&end=${endPoint}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setRoutes(data);
      })
      .catch((error) => {
        setError('Error fetching routes: ' + error.message);
      });
  };

  return (
    <div className="flex justify-center border-2 border-red-500">
      <h1 className="text-red-500 mb-6">Transit App</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">Start Point</label>
          <input
            type="text"
            id="start"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter start point"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">End Point</label>
          <input
            type="text"
            id="end"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Enter end point"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Find Routes
        </button>
      </form>
    </div>
  );
};

export default Home;
