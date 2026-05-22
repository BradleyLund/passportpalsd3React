import React, { useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import VisaRequirementsTable from "./VisaRequirementsTable";
import LeafletMap from "./LeafLetMap";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(["Afghanistan"]);
  const [combinedVisaReqs, setCombinedVisaReqs] = useState({});

  const handleSelectChange = (index, value, remove) => {
    if (remove) {
      setSelectedCountries((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setSelectedCountries((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="containerPage">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent py-2">
          PassportPals
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          See where you and your friends from all around the world can travel
          together. Try out the shuffle!
        </p>
      </div>
      <SelectBoxComponent
        selectedCountries={selectedCountries}
        onSelectChange={handleSelectChange}
      />
      <br />
      <LeafletMap
        selectedCountries={selectedCountries}
        setCombinedVisaReqs={setCombinedVisaReqs}
      />
      <VisaRequirementsTable combinedVisaReqs={combinedVisaReqs} />
    </div>
  );
};

export default ParentComponent;
