import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import React ,{useState,useRef}from 'react';

export default function Gsaapi() {
  const source = { lat: 48.8584, lng: 2.2945 };
  const destination= { lat: 48.8584, lng: 2.2945 };
// const [directionResponse, setDirectionsResponse]=useState(null);
// const [distance, setDistance]=useState('');
//   const [duration, setDuration]=useState('');
const sourceRef=useRef();
const destinationRef=useRef();

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
  return (
    <>
      {isLoaded ? (
        <>
          <h1>Map Loaded</h1>
          <GoogleMap
            center={source}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '500px' }}
          >
            <Marker position={source} />
          </GoogleMap>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
