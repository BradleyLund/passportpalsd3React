import React, { useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import ChoroplethMap from "./ChoroplethMap";
import VisaRequirementsTable from "./VisaRequirementsTable";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(["Afghanistan"]);
  const [combinedVisaReqs, setCombinedVisaReqs] = useState({});

  const handleSelectChange = (index, value, remove, randomize) => {
    if (remove) {
      const updatedCountries = selectedCountries.filter((_, i) => i !== index);
      setSelectedCountries(updatedCountries);
    } else if (randomize) {
      console.log("Hi in random function");
      const updatedCountries = [...selectedCountries];
      updatedCountries[index] = value;
      console.log(index, value, updatedCountries, remove, randomize);
      setSelectedCountries(updatedCountries);
    } else {
      const newSelectedCountries = [...selectedCountries];
      newSelectedCountries[index] = value;
      setSelectedCountries(newSelectedCountries);
    }
  };

  return (
    <div className="containerPage">
      <h1>
        <strong>PassportPals</strong>
      </h1>
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
