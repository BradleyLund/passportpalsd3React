import React, { useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import ChoroplethMap from "./ChoroplethMap";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(['Afghanistan']);

  const handleSelectChange = (index, value) => {
    const newSelectedCountries = [...selectedCountries];
    console.log(newSelectedCountries)
    newSelectedCountries[index] = value;
    setSelectedCountries(newSelectedCountries);
    console.log('Changed')
  };

  return (
    <div>
      <SelectBoxComponent
        selectedCountries={selectedCountries}   
        onSelectChange={handleSelectChange}
      />
      <ChoroplethMap selectedCountries={selectedCountries} />
    </div>
  );
};

export default ParentComponent;
