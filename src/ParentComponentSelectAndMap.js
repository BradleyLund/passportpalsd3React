import React, { useEffect, useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import VisaRequirementsTable from "./VisaRequirementsTable";
import LeafletMap from "./LeafLetMap";

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(["Afghanistan"]);
  const [combinedVisaReqs, setCombinedVisaReqs] = useState({});
  const [dataLastUpdated, setDataLastUpdated] = useState(null);

  useEffect(() => {
    fetch("data-meta.json")
      .then((response) => response.json())
      .then((meta) => setDataLastUpdated(meta.lastUpdated))
      .catch((error) =>
        console.error("Error fetching data metadata:", error)
      );
  }, []);

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
      <footer className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center max-w-3xl mx-auto space-y-1">
        <p>
          Visa requirement data from{" "}
          <a
            className="text-blue-700 underline"
            href="https://github.com/imorte/passport-index-data"
          >
            imorte/passport-index-data
          </a>{" "}
          (a maintained fork of{" "}
          <a
            className="text-blue-700 underline"
            href="https://github.com/ilyankou/passport-index-dataset"
          >
            ilyankou/passport-index-dataset
          </a>
          , both sourced from{" "}
          <a className="text-blue-700 underline" href="https://www.passportindex.org/">
            Passport Index
          </a>
          ){dataLastUpdated ? `. Data last updated: ${dataLastUpdated}` : ""}.
        </p>
        <p>
          Always double-check entry requirements with official sources before
          booking — this map is a planning aid, not travel advice.
        </p>
      </footer>
    </div>
  );
};

export default ParentComponent;
