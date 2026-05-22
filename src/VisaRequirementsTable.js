import React from "react";
import { COUNTRY_TO_ISO2, ISO3_TO_COUNTRY } from "./constants/countries";

const VisaRequirementsTable = ({ combinedVisaReqs }) => {
  const entries = Object.entries(combinedVisaReqs);

  const selectedCountries = entries.filter(
    ([, requirement]) => requirement === "-1"
  );
  const eVisaCountries = entries.filter(
    ([, requirement]) => requirement === "e-visa"
  );
  const visaOnArrivalCountries = entries.filter(
    ([, requirement]) => requirement === "visa on arrival"
  );
  const visaFreeCountries = entries.filter(([, requirement]) => {
    const number = parseInt(requirement, 10);
    return !isNaN(number) && number > 0;
  });

  const renderCountryRows = (countries) =>
    countries.map(([iso3]) => {
      const name = ISO3_TO_COUNTRY[iso3];
      const iso2 = name ? COUNTRY_TO_ISO2[name] : null;
      return (
        <tr key={iso3} className="border-b border-gray-200 last:border-0">
          <td className="px-4 py-2">
            {iso2 && (
              <span className={`fi fi-${iso2.toLowerCase()}`}></span>
            )}
            {" " + (name || iso3)}
          </td>
        </tr>
      );
    });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="border-b md:border-r lg:border-r border-gray-200">
            <div className="bg-blue-50 px-6 py-3">
              <h2 className="font-semibold text-lg text-blue-800">
                Pals Passports
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {renderCountryRows(selectedCountries)}
            </div>
          </div>

          <div className="border-b lg:border-r border-gray-200">
            <div className="bg-green-50 px-6 py-3">
              <h2 className="font-semibold text-lg text-green-800">
                Visa Free
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {renderCountryRows(visaFreeCountries)}
            </div>
          </div>

          <div className="border-b md:border-r lg:border-b-0 border-gray-200">
            <div className="bg-purple-50 px-6 py-3">
              <h2 className="font-semibold text-lg text-purple-800">eVisa</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {renderCountryRows(eVisaCountries)}
            </div>
          </div>

          <div>
            <div className="bg-amber-50 px-6 py-3">
              <h2 className="font-semibold text-lg text-amber-800">
                Visa On Arrival
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {renderCountryRows(visaOnArrivalCountries)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaRequirementsTable;
