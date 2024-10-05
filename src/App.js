import React from 'react';
import ChoroplethMap from './ChoroplethMap';
import ChoroplethMapSelect from './ChoroplethMapSelect';
import SelectComponent from './SelectComponent';

function App() {
  return (
    <div className="App">
      <SelectComponent />
      <h1>Choropleth Map</h1>
      <ChoroplethMap />
 
      <ChoroplethMapSelect />


    </div>
  );
}

export default App;
