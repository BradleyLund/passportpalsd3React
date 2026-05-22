import React, { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  COUNTRY_TO_ISO3,
  ISO3_TO_COUNTRY,
  VISA_REQUIREMENTS_PRIORITY,
} from "./constants/countries";

const VISA_FREE_DAY_VALUES = new Set([
  "7", "10", "14", "15", "21", "28", "30",
  "31", "42", "45", "60", "90", "120", "180", "240", "360",
]);

const getColor = (requirement) => {
  const colorMap = {
    "Selected Country": "#1E40AF",
    "-1": "#1E40AF",
    "no admission": "gray",
    "covid ban": "gray",
    "visa required": "#C0C0C0",
    "e-visa": "#61C7A1",
    "visa on arrival": "#B5E61D",
    "visa free": "#22B14C",
  };

  if (VISA_FREE_DAY_VALUES.has(requirement)) {
    return Number(requirement) <= 30 ? "#BAFFAA" : "#9EFF9E";
  }

  return colorMap[requirement] || "#C0C0C0";
};

const combineVisaRequirements = (passportObjects) => {
  const result = {};
  passportObjects.forEach((obj) => {
    if (!obj) return;
    for (const key in obj) {
      if (
        !result[key] ||
        VISA_REQUIREMENTS_PRIORITY.indexOf(obj[key]) <
          VISA_REQUIREMENTS_PRIORITY.indexOf(result[key])
      ) {
        result[key] = obj[key];
      }
    }
  });
  return result;
};

const parseVisaCsv = (csvText) => {
  const lines = csvText.split("\n");
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
      const requirements = [
        "Selected Country",
        "visa free",
        "90",
        "30",
        "visa on arrival",
        "e-visa",
        "visa required",
        "no admission",
      ];
      div.innerHTML =
        "<h4>Visa Requirements</h4>" +
        requirements
          .map(
            (req) =>
              `<i style="background:${getColor(req)}"></i>${req}<br>`
          )
          .join("");
      return div;
    };
    legend.addTo(mapInstanceRef.current);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
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
                infoRef.current.innerHTML = `
                  <strong>${ISO3_TO_COUNTRY[iso3] || iso3}</strong><br/>
                  Requirement: ${visaReqs[iso3] || "N/A"}
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
