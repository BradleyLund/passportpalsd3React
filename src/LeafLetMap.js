import React, { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  COUNTRY_TO_ISO3,
  ISO3_TO_COUNTRY,
  formatRequirement,
  isDayLimited,
  visaRank,
} from "./constants/countries";

// Diverging red/blue scale (colourblind-safe; worst adjacent CVD deltaE
// 15.3): red shades mean someone needs a visa, blue shades mean the whole
// group can just go. Amber marks the group's own passports; grey is no data.
const NO_DATA_COLOR = "#d9d7d0";

const getColor = (requirement) => {
  const colorMap = {
    "Selected Country": "#eda100",
    "-1": "#eda100",
    "no admission": "#8c2323",
    "visa required": "#d03b3b",
    "e-visa": "#e98d8b",
    eta: "#86b6ef",
    "visa on arrival": "#5598e7",
    "visa free": "#0d366b",
  };

  if (isDayLimited(requirement)) return "#256abf";

  return colorMap[requirement] || NO_DATA_COLOR;
};

const LEGEND_ENTRIES = [
  ["Selected Country", "Your passports"],
  ["no admission", "No admission"],
  ["visa required", "Visa required"],
  ["e-visa", "E-visa"],
  ["eta", "eTA"],
  ["visa on arrival", "Visa on arrival"],
  ["90", "Visa free (limited stay)"],
  ["visa free", "Visa free"],
  [undefined, "No data"],
];

const combineVisaRequirements = (passportObjects) => {
  const result = {};
  passportObjects.forEach((obj) => {
    if (!obj) return;
    for (const key in obj) {
      if (!result[key] || visaRank(obj[key]) < visaRank(result[key])) {
        result[key] = obj[key];
      }
    }
  });
  return result;
};

const parseVisaCsv = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  const byPassport = {};
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const values = lines[i].split(",");
    const entry = {};
    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = values[j];
    }
    if (!byPassport[entry.Passport]) byPassport[entry.Passport] = {};
    byPassport[entry.Passport][entry.Destination] = entry.Requirement;
  }
  return byPassport;
};

const LeafletMap = ({ selectedCountries, setCombinedVisaReqs }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoRef = useRef(null);
  const visaDataRef = useRef(null);
  const geoDataRef = useRef(null);

  const loadVisaData = useCallback(async () => {
    if (visaDataRef.current) return visaDataRef.current;
    const response = await fetch("passport-index-tidy-iso3.csv");
    const csvText = await response.text();
    visaDataRef.current = parseVisaCsv(csvText);
    return visaDataRef.current;
  }, []);

  const loadGeoData = useCallback(async () => {
    if (geoDataRef.current) return geoDataRef.current;
    const response = await fetch("countries-land-10km.geo.json");
    geoDataRef.current = await response.json();
    return geoDataRef.current;
  }, []);

  // Initialize map once.
  useEffect(() => {
    if (mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 5,
      scrollWheelZoom: true,
      touchZoom: true,
      zoomControl: true,
    });

    const info = L.control();
    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this._div.innerHTML = "Hover over a country";
      infoRef.current = this._div;
      return this._div;
    };
    info.addTo(mapInstanceRef.current);

    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML =
        "<h4>Visa Requirements</h4>" +
        LEGEND_ENTRIES.map(
          ([req, label]) =>
            `<i style="background:${getColor(req)}"></i>${label}<br>`
        ).join("");
      return div;
    };
    legend.addTo(mapInstanceRef.current);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      { attribution: "©OpenStreetMap, ©CartoDB" }
    ).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render / re-render choropleth layer when selection changes.
  useEffect(() => {
    let cancelled = false;
    const updateMap = async () => {
      if (!mapInstanceRef.current) return;

      const [visaByPassport, geoData] = await Promise.all([
        loadVisaData(),
        loadGeoData(),
      ]);
      if (cancelled || !mapInstanceRef.current) return;

      const passportObjects = selectedCountries.map(
        (country) => visaByPassport[COUNTRY_TO_ISO3[country]]
      );
      const visaReqs = combineVisaRequirements(passportObjects);
      setCombinedVisaReqs(visaReqs);

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      L.geoJSON(geoData, {
        style: (feature) => ({
          fillColor: getColor(visaReqs[feature.properties.A3]),
          weight: 1,
          opacity: 1,
          color: "white",
          fillOpacity: 0.7,
        }),
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              e.target.setStyle({
                weight: 2,
                color: "#666",
                fillOpacity: 0.9,
              });
              e.target.bringToFront();
              if (infoRef.current) {
                const iso3 = feature.properties.A3;
                const rows = selectedCountries
                  .map((country) => {
                    const passport = visaByPassport[COUNTRY_TO_ISO3[country]];
                    const requirement = passport && passport[iso3];
                    return `${country}: ${formatRequirement(requirement)}`;
                  })
                  .join("<br/>");
                const together =
                  selectedCountries.length > 1
                    ? `<br/><strong>Together: ${formatRequirement(visaReqs[iso3])}</strong>`
                    : "";
                infoRef.current.innerHTML = `
                  <strong>${ISO3_TO_COUNTRY[iso3] || iso3}</strong><br/>
                  ${rows}${together}
                `;
              }
            },
            mouseout: (e) => {
              e.target.setStyle({
                weight: 1,
                color: "white",
                fillOpacity: 0.7,
              });
              if (infoRef.current) {
                infoRef.current.innerHTML = "Hover over a country";
              }
            },
            click: (e) => {
              mapInstanceRef.current.fitBounds(e.target.getBounds());
            },
          });
        },
      }).addTo(mapInstanceRef.current);
    };

    updateMap().catch((error) =>
      console.error("Error updating map:", error)
    );

    return () => {
      cancelled = true;
    };
  }, [selectedCountries, setCombinedVisaReqs, loadVisaData, loadGeoData]);

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="w-full"
        style={{
          height: "500px",
          minHeight: "250px",
          maxWidth: "1200px",
          margin: "0 auto",
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default LeafletMap;
