import React, { useEffect, useState } from "react";
import SelectBoxComponent from "./SelectBoxComponent";
import VisaRequirementsTable from "./VisaRequirementsTable";
import LeafletMap from "./LeafLetMap";
import { COUNTRY_TO_ISO3, ISO3_TO_COUNTRY } from "./constants/countries";

// Selection is shareable via the query string, e.g. ?p=USA,ZAF
const countriesFromUrl = () => {
  const codes = new URLSearchParams(window.location.search).get("p");
  if (!codes) return null;
  const names = codes
    .split(",")
    .map((code) => ISO3_TO_COUNTRY[code])
    .filter(Boolean);
  return names.length > 0 ? names : null;
};

const ParentComponent = () => {
  const [selectedCountries, setSelectedCountries] = useState(
    () => countriesFromUrl() || ["Afghanistan"]
  );
  const [combinedVisaReqs, setCombinedVisaReqs] = useState({});
  const [dataLastUpdated, setDataLastUpdated] = useState(null);

  useEffect(() => {
    const codes = selectedCountries
      .map((country) => COUNTRY_TO_ISO3[country])
      .join(",");
    window.history.replaceState(null, "", `?p=${codes}`);
  }, [selectedCountries]);

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

  const mrz = `P<${selectedCountries
    .map((country) => COUNTRY_TO_ISO3[country])
    .join("<")}<<WHERE<CAN<WE<ALL<GO`
    .padEnd(64, "<")
    .slice(0, 64);

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-10">
      <header className="mb-7">
        <p className="font-mono text-xs font-medium tracking-[0.22em] uppercase text-navy mb-2">
          Passport Pals
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-[24ch] mb-2">
          Where can we all go together?
        </h1>
        <p className="text-ink-secondary max-w-[58ch]">
          Pick everyone's passports below. Each country is coloured by the
          toughest visa requirement anyone in your group would face — blue
          means you can all just go, red means someone needs a visa. Try out
          the shuffle!
        </p>
        <p className="mrz mt-6" aria-hidden="true">
          {mrz}
        </p>
      </header>
      <SelectBoxComponent
        selectedCountries={selectedCountries}
        onSelectChange={handleSelectChange}
      />
      <LeafletMap
        selectedCountries={selectedCountries}
        setCombinedVisaReqs={setCombinedVisaReqs}
      />
      <VisaRequirementsTable combinedVisaReqs={combinedVisaReqs} />
      <footer className="mt-6 pt-4 border-t border-hairline text-[0.82rem] text-ink-muted space-y-1">
        <p className="max-w-[72ch]">
          Visa requirement data from{" "}
          <a
            className="text-navy underline"
            href="https://github.com/imorte/passport-index-data"
          >
            imorte/passport-index-data
          </a>{" "}
          (a maintained fork of{" "}
          <a
            className="text-navy underline"
            href="https://github.com/ilyankou/passport-index-dataset"
          >
            ilyankou/passport-index-dataset
          </a>
          , both sourced from{" "}
          <a className="text-navy underline" href="https://www.passportindex.org/">
            Passport Index
          </a>
          ){dataLastUpdated ? `. Data last updated: ${dataLastUpdated}` : ""}.
        </p>
        <p className="max-w-[72ch]">
          Always double-check entry requirements with official sources before
          booking — this map is a planning aid, not travel advice.
        </p>
      </footer>
    </div>
  );
};

export default ParentComponent;
