import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleMap from './components/SimpleMap';
import InputForm from './components/InputForm';

function App() {
  const [ waypoint, setWaypoint ] = useState<[]>([]);
  

  return (
    <div className="App">
      <InputForm 
        setWaypoint={setWaypoint}
      />
      <SimpleMap
        center={{ lat: 22.3193, lng: 114.1694 }}
        zoom={11}
        waypoint={waypoint}
      />
    </div>
  );
}

export default App;