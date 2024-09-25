import React, { useState } from 'react';
import { MapContainer, ImageOverlay, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';  // Load Leaflet CSS

function MapComponent() {
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState(null); // Store popup position

  // Function to generate random depth
  const getRandomDepth = () => {
    return Math.floor(Math.random() * 10000);  // Random number between 0 and 10,000
  };

  // Function to handle click on the map and fetch data
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        // Fetch data from the backend
        axios.get(`http://localhost:5000/get-data`, { params: { lat, lng } })
          .then(response => {
            const randomDepth = getRandomDepth();  // Get random depth
            setPopupData({
              lat,
              lng,
              depth: randomDepth,  // Use the random depth
              ...response.data
            });
            setPopupPosition(e.latlng);  // Set the position for the popup
          })
          .catch(error => console.error('Error fetching data:', error));
      }
    });
    return null;
  }

  const mapStyle = {
    height: '90vh',
    width: '100%'
  };

  return (
    <div>
      <MapContainer
        center={[21, 82]}
        zoom={5}
        style={mapStyle}
        crs={L.CRS.Simple}  // Use Simple CRS for static image
      >
        <ImageOverlay
          url={`${process.env.PUBLIC_URL}/map.png`}
          bounds={[[6.0, 68.0], [36.0, 97.5]]} // Image bounds based on the map region
        />
        <MapClickHandler />

        {/* Display a popup if data is available */}
        {popupData && popupPosition && (
          <Popup position={popupPosition}>
            <div>
              <p><strong>Latitude:</strong> {popupData.lat}</p>
              <p><strong>Longitude:</strong> {popupData.lng}</p>
              <p><strong>Depth:</strong> {popupData.depth} meters</p> {/* Random depth */}
              <p><strong>Salinity:</strong> {popupData.salinity} PSU</p>
              <p><strong>Conductivity:</strong> {popupData.conductivity} S/m</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
