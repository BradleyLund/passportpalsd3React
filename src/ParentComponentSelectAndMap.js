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
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
          PassportPals
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          See where you and your friends from all around the world can travel to
          together, visa free.
        </p>
      </div>
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
