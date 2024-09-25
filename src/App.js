import React from 'react';
import './App.css';
import MapComponent from './components/MapComponent';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Bathymetric Map Application</h1>
      </nav>
      <MapComponent />
    </div>
  );
}

export default App;
