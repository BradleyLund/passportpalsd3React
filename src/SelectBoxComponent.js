import React from "react";
import { Trash, Plus, Shuffle } from "lucide-react";
import { COUNTRIES, COUNTRY_TO_ISO2 } from "./constants/countries";

const SelectBoxComponent = ({ selectedCountries, onSelectChange }) => {
  const addSelectBox = () => {
    onSelectChange(selectedCountries.length, "Afghanistan", false);
  };

  const removeSelectBox = (index) => {
    const updatedCountries = selectedCountries.filter((_, i) => i !== index);
    onSelectChange(index, updatedCountries, true);
  };

  const randomizeSelectBox = (index) => {
    const randomIndex = Math.floor(Math.random() * COUNTRIES.length);
    onSelectChange(index, COUNTRIES[randomIndex], false, true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="space-y-4">
        {selectedCountries.map((country, index) => {
          const iso2 = COUNTRY_TO_ISO2[country];
          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-white rounded-lg shadow-sm"
            >
              {iso2 && (
                <span
                  className={`fi fi-${iso2.toLowerCase()} w-12 h-12 sm:w-14 sm:h-14`}
                />
              )}
              <select
                value={country}
                onChange={(e) => onSelectChange(index, e.target.value)}
                className="w-full sm:w-auto flex-grow p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  onClick={() => removeSelectBox(index)}
                  aria-label="Remove country"
                >
                  <Trash size={20} />
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => randomizeSelectBox(index)}
                  aria-label="Randomize country"
                >
                  <Shuffle size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={addSelectBox}
          className="mt-4 w-full sm:w-auto flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors button-17"
        >
          <Plus size={20} />
          <span>Add Country</span>
        </button>
      </div>
    </div>
  );
};

export default SelectBoxComponent;
