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
    <section className="my-7" aria-label="Passports in your group">
      <span className="block font-mono text-[0.72rem] font-medium tracking-[0.18em] uppercase text-ink-muted mb-2.5">
        Passports in your group
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        {selectedCountries.map((country, index) => {
          const iso2 = COUNTRY_TO_ISO2[country];
          return (
            <div
              key={index}
              className="inline-flex items-center bg-white border border-hairline border-l-4 border-l-navy rounded-md"
            >
              {iso2 && (
                <span
                  className={`fi fi-${iso2.toLowerCase()} ml-2.5 rounded-[2px]`}
                />
              )}
              <select
                value={country}
                onChange={(e) => onSelectChange(index, e.target.value)}
                aria-label={`Passport ${index + 1}`}
                className="font-mono text-sm text-ink bg-transparent py-2 pl-2 pr-1 max-w-[13rem] cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                className="p-2 border-l border-hairline text-ink-muted hover:text-navy hover:bg-navy-soft transition-colors"
                onClick={() => randomizeSelectBox(index)}
                aria-label={`Shuffle passport ${index + 1}`}
                type="button"
              >
                <Shuffle size={15} />
              </button>
              {selectedCountries.length > 1 && (
                <button
                  className="p-2 border-l border-hairline rounded-r-md text-ink-muted hover:text-[#d03b3b] hover:bg-red-50 transition-colors"
                  onClick={() => removeSelectBox(index)}
                  aria-label={`Remove ${country} passport`}
                  type="button"
                >
                  <Trash size={15} />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={addSelectBox}
          type="button"
          className="inline-flex items-center gap-1.5 border border-dashed border-navy rounded-md px-3.5 py-2 font-mono text-[0.8rem] text-navy hover:bg-navy-soft transition-colors"
        >
          <Plus size={15} />
          <span>Add a passport</span>
        </button>
      </div>
    </section>
  );
};

export default SelectBoxComponent;
