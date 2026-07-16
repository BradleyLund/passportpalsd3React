import React from "react";
import {
  COUNTRY_TO_ISO2,
  ISO3_TO_COUNTRY,
  isDayLimited,
} from "./constants/countries";

const VisaRequirementsTable = ({ combinedVisaReqs }) => {
  const entries = Object.entries(combinedVisaReqs);

  const selectedCountries = entries.filter(
    ([, requirement]) => requirement === "-1"
  );
  const eVisaCountries = entries.filter(
    ([, requirement]) => requirement === "e-visa"
  );
  const etaCountries = entries.filter(
    ([, requirement]) => requirement === "eta"
  );
  const visaOnArrivalCountries = entries.filter(
    ([, requirement]) => requirement === "visa on arrival"
  );
  // Unlimited "visa free" and day-limited stays ("90", "360", ...) both count.
  const visaFreeCountries = entries.filter(
    ([, requirement]) =>
      requirement === "visa free" || isDayLimited(requirement)
  );

  const renderCountryRows = (countries) =>
    countries.map(([iso3]) => {
      const name = ISO3_TO_COUNTRY[iso3];
      const iso2 = name ? COUNTRY_TO_ISO2[name] : null;
      return (
        <div key={iso3} className="px-5 py-2 text-sm text-ink">
          {iso2 && <span className={`fi fi-${iso2.toLowerCase()}`}></span>}
          {" " + (name || iso3)}
        </div>
      );
    });

  // Column headers carry the same colours as the map so the table reads as a
  // breakdown of the choropleth.
  const columns = [
    { title: "Pals Passports", swatch: "#eda100", rows: selectedCountries },
    { title: "Visa Free", swatch: "#0d366b", rows: visaFreeCountries },
    { title: "Visa On Arrival", swatch: "#5598e7", rows: visaOnArrivalCountries },
    { title: "eTA", swatch: "#86b6ef", rows: etaCountries },
    { title: "eVisa", swatch: "#e98d8b", rows: eVisaCountries },
  ];

  return (
    <div className="w-full my-6">
      <div className="bg-white rounded-[10px] overflow-hidden border border-hairline">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {columns.map(({ title, swatch, rows }, index) => (
            <div
              key={title}
              className={`border-hairline border-b lg:border-b-0 ${
                index < columns.length - 1 ? "md:border-r" : ""
              }`}
            >
              <div className="bg-paper border-b border-hairline px-5 py-2.5 flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-[3px] flex-none"
                  style={{ background: swatch }}
                />
                <h2 className="font-mono text-[0.72rem] font-medium tracking-[0.18em] uppercase text-ink-secondary">
                  {title}
                </h2>
              </div>
              <div className="divide-y divide-hairline">
                {renderCountryRows(rows)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaRequirementsTable;
