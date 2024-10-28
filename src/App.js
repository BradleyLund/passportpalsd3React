import React from "react";
import ChoroplethMap from "./ChoroplethMap";
import SelectBoxComponent from "./SelectBoxComponent";
import ParentComponent from "./ParentComponentSelectAndMap";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="App">
      <ParentComponent />
    </div>
  );
}

export default App;
