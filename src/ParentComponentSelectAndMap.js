import React, { useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import ChoroplethMap from "./ChoroplethMap";
import VisaRequirementsTable from "./VisaRequirementsTable";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(["Afghanistan"]);
  const [combinedVisaReqs, setCombinedVisaReqs] = useState({});

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
    <div className="containerPage">
      <h2>PassportPals</h2>
      <p>
        See where you and your friends from all around the world can travel to
        together, visa free.
      </p>
      <SelectBoxComponent
        selectedCountries={selectedCountries}
        onSelectChange={handleSelectChange}
      />
      <ChoroplethMap
        selectedCountries={selectedCountries}
        setCombinedVisaReqs={setCombinedVisaReqs}
      />
      <VisaRequirementsTable combinedVisaReqs={combinedVisaReqs} />
    </div>
  );
};

export default ParentComponent;
