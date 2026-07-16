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
  const tooltipRef = useRef(null);
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

      const moveTooltip = (e) => {
        const tooltip = tooltipRef.current;
        if (!tooltip || tooltip.hidden) return;
        const pad = 14;
        const box = tooltip.getBoundingClientRect();
        let x = e.originalEvent.clientX + pad;
        let y = e.originalEvent.clientY + pad;
        if (x + box.width > window.innerWidth - pad) {
          x = e.originalEvent.clientX - box.width - pad;
        }
        if (y + box.height > window.innerHeight - pad) {
          y = e.originalEvent.clientY - box.height - pad;
        }
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      };

      L.geoJSON(geoData, {
        style: (feature) => ({
          fillColor: getColor(visaReqs[feature.properties.A3]),
          weight: 1,
          opacity: 1,
          color: "white",
          fillOpacity: 1,
        }),
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              e.target.setStyle({ weight: 1.5, color: "#1a1918" });
              e.target.bringToFront();
              const tooltip = tooltipRef.current;
              if (tooltip) {
                const iso3 = feature.properties.A3;
                const rows = selectedCountries
                  .map((country) => {
                    const passport = visaByPassport[COUNTRY_TO_ISO3[country]];
                    const requirement = passport && passport[iso3];
                    return `<tr><td>${country}</td><td>${formatRequirement(requirement)}</td></tr>`;
                  })
                  .join("");
                const together =
                  selectedCountries.length > 1
                    ? `<p class="verdict">Together: ${formatRequirement(visaReqs[iso3])}</p>`
                    : "";
                tooltip.innerHTML = `<h3>${ISO3_TO_COUNTRY[iso3] || iso3}</h3><table><tbody>${rows}</tbody></table>${together}`;
                tooltip.hidden = false;
                moveTooltip(e);
              }
            },
            mousemove: moveTooltip,
            mouseout: (e) => {
              e.target.setStyle({ weight: 1, color: "white" });
              if (tooltipRef.current) tooltipRef.current.hidden = true;
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
    <figure className="m-0 w-full border border-hairline rounded-[10px] bg-white p-2">
      <div
        ref={mapRef}
        className="w-full rounded-md"
        style={{
          height: "500px",
          minHeight: "250px",
          zIndex: 1,
        }}
      />
      <div ref={tooltipRef} className="map-tooltip" hidden />
    </figure>
  );
};

export default LeafletMap;
