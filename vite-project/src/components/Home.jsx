import React, { useState ,useRef} from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import Results from './Results';
const Home = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [error, setError] = useState('');
  const [showResults,setShowResults]=useState(false);
  const sourceRef=useRef();
  const destinationRef=useRef();

  const source = { lat: 48.8584, lng: 2.2945 };
  const destination= { lat: 48.8584, lng: 2.2945 };
const [directionResponse, setDirectionsResponse]=useState(null);
const [distance, setDistance]=useState('');
  const [duration, setDuration]=useState('');


  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAHDmQTWrGFNnlVbwGvYvTPJ3AkDPprTb0',
    libraries: ['places'],
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }
async function calculateRoute(){
    if(sourceRef.current.value===''|| destinationRef.current.value===''){
        return;
    }

const directionService=new google.maps.DirectionsService();
const results=await directionService.route({
    origin: sourceRef.current.value,
    destination: destinationRef.current.value,
    travelMode: google.maps.TravelMode.TRANSIT,
  });
  console.log(results);
  setDirectionsResponse(results);
  setDistance(results.routes[0].legs[0].distance.text);
  setDuration(results.routes[0].legs[0].duration.text);
}
function clearRoute(){
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    sourceRef.current.value='';
    destinationRef.current.value='';
}





  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startPoint || !endPoint) {
      setError('Both fields are required.');
      return;
    }
    // setError('');
   
    console.log(`Start Point: ${startPoint}, End Point: ${endPoint}`);
    setShowResults(true);
    calculateRoute();
    // Add logic to fetch routes here
  };



  return (
    <div className="">
       {isLoaded ? (
        <>
          <h1>Map Loaded</h1>
          <GoogleMap
            center={source}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '500px' }}
          >
            <Marker position={source} />
            {directionResponse&& <DirectionsRenderer directions={directionResponse}/>}
          </GoogleMap>
        </>
      ) : (
        <div>Loading...</div>
      )}

    <div className="flex pt-8 flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-blue-500">
    
      <h1 className="text-5xl font-extrabold text-white mb-8">Transit App</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="start" className="block text-lg font-medium text-gray-800 mb-2">Start Point</label>
          {/* <Autocomplete> */}
            <input
            ref={sourceRef}
              type="text"
              id="start"
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter start point"
            />
          {/* </Autocomplete> */}
        </div>
        <div className="mb-6">
          <label htmlFor="end" className="block text-lg font-medium text-gray-800 mb-2">End Point</label>
          {/* <Autocomplete> */}
            <input
            ref={destinationRef}
              type="text"
              id="end"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter end point"
            />
          {/* </Autocomplete> */}
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
   {/* <Results/> */}
    </div>
  );
};

export default Home;
