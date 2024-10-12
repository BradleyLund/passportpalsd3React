import React, { useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import ChoroplethMap from "./ChoroplethMap";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(["Afghanistan"]);

  const handleSelectChange = (index, value, remove) => {
    console.log(index, value, remove);
    if (remove) {
      const updatedCountries = selectedCountries.filter((_, i) => i !== index);
      setSelectedCountries(updatedCountries);
    } else {
      const newSelectedCountries = [...selectedCountries];
      newSelectedCountries[index] = value;
      setSelectedCountries(newSelectedCountries);
    }
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
