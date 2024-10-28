import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback } from "react";

const countryCodesObject = {
  Afghanistan: "AFG",
  Albania: "ALB",
  Algeria: "DZA",
  Andorra: "AND",
  Angola: "AGO",
  "Antigua and Barbuda": "ATG",
  Argentina: "ARG",
  Armenia: "ARM",
  Australia: "AUS",
  Austria: "AUT",
  Azerbaijan: "AZE",
  Bahamas: "BHS",
  Bahrain: "BHR",
  Bangladesh: "BGD",
  Barbados: "BRB",
  Belarus: "BLR",
  Belgium: "BEL",
  Belize: "BLZ",
  Benin: "BEN",
  Bhutan: "BTN",
  Bolivia: "BOL",
  "Bosnia and Herzegovina": "BIH",
  Botswana: "BWA",
  Brazil: "BRA",
  "Brunei Darussalam": "BRN",
  Bulgaria: "BGR",
  "Burkina Faso": "BFA",
  Burundi: "BDI",
  "Cabo Verde": "CPV",
  Cambodia: "KHM",
  Cameroon: "CMR",
  Canada: "CAN",
  "Central African Republic": "CAF",
  Chad: "TCD",
  Chile: "CHL",
  China: "CHN",
  Colombia: "COL",
  Comoros: "COM",
  Congo: "COG",
  "Democratic Republic of the Congo": "COD",
  "Costa Rica": "CRI",
  Croatia: "HRV",
  Cuba: "CUB",
  Cyprus: "CYP",
  "Czech Republic": "CZE",
  Denmark: "DNK",
  Djibouti: "DJI",
  Dominica: "DMA",
  "Dominican Republic": "DOM",
  Ecuador: "ECU",
  Egypt: "EGY",
  "El Salvador": "SLV",
  "Equatorial Guinea": "GNQ",
  Eritrea: "ERI",
  Estonia: "EST",
  Eswatini: "SWZ",
  Ethiopia: "ETH",
  Fiji: "FJI",
  Finland: "FIN",
  France: "FRA",
  Gabon: "GAB",
  Gambia: "GMB",
  Georgia: "GEO",
  Germany: "DEU",
  Ghana: "GHA",
  Greece: "GRC",
  Grenada: "GRD",
  Guatemala: "GTM",
  Guinea: "GIN",
  "Guinea-Bissau": "GNB",
  Guyana: "GUY",
  Haiti: "HTI",
  Honduras: "HND",
  Hungary: "HUN",
  Iceland: "ISL",
  India: "IND",
  Indonesia: "IDN",
  Iran: "IRN",
  Iraq: "IRQ",
  Ireland: "IRL",
  Israel: "ISR",
  Italy: "ITA",
  "Ivory Coast": "CIV",
  Jamaica: "JAM",
  Japan: "JPN",
  Jordan: "JOR",
  Kazakhstan: "KAZ",
  Kenya: "KEN",
  Kiribati: "KIR",
  Kuwait: "KWT",
  Kyrgyzstan: "KGZ",
  Laos: "LAO",
  Latvia: "LVA",
  Lebanon: "LBN",
  Lesotho: "LSO",
  Liberia: "LBR",
  Libya: "LBY",
  Liechtenstein: "LIE",
  Lithuania: "LTU",
  Luxembourg: "LUX",
  Madagascar: "MDG",
  Malawi: "MWI",
  Malaysia: "MYS",
  Maldives: "MDV",
  Mali: "MLI",
  Malta: "MLT",
  "Marshall Islands": "MHL",
  Mauritania: "MRT",
  Mauritius: "MUS",
  Mexico: "MEX",
  Micronesia: "FSM",
  Moldova: "MDA",
  Monaco: "MCO",
  Mongolia: "MNG",
  Montenegro: "MNE",
  Morocco: "MAR",
  Mozambique: "MOZ",
  Myanmar: "MMR",
  Namibia: "NAM",
  Nauru: "NRU",
  Nepal: "NPL",
  Netherlands: "NLD",
  "New Zealand": "NZL",
  Nicaragua: "NIC",
  Niger: "NER",
  Nigeria: "NGA",
  "North Korea": "PRK",
  "North Macedonia": "MKD",
  Norway: "NOR",
  Oman: "OMN",
  Pakistan: "PAK",
  Palau: "PLW",
  Palestine: "PSE",
  Panama: "PAN",
  "Papua New Guinea": "PNG",
  Paraguay: "PRY",
  Peru: "PER",
  Philippines: "PHL",
  Poland: "POL",
  Portugal: "PRT",
  Qatar: "QAT",
  Romania: "ROU",
  Russia: "RUS",
  Rwanda: "RWA",
  "Saint Kitts and Nevis": "KNA",
  "Saint Lucia": "LCA",
  "Saint Vincent and the Grenadines": "VCT",
  Samoa: "WSM",
  "San Marino": "SMR",
  "Sao Tome and Principe": "STP",
  "Saudi Arabia": "SAU",
  Senegal: "SEN",
  Serbia: "SRB",
  Seychelles: "SYC",
  "Sierra Leone": "SLE",
  Singapore: "SGP",
  Slovakia: "SVK",
  Slovenia: "SVN",
  "Solomon Islands": "SLB",
  Somalia: "SOM",
  "South Africa": "ZAF",
  "South Korea": "KOR",
  "South Sudan": "SSD",
  Spain: "ESP",
  "Sri Lanka": "LKA",
  Sudan: "SDN",
  Suriname: "SUR",
  Sweden: "SWE",
  Switzerland: "CHE",
  Syria: "SYR",
  Taiwan: "TWN",
  Tajikistan: "TJK",
  Tanzania: "TZA",
  Thailand: "THA",
  "Timor-Leste": "TLS",
  Togo: "TGO",
  Tonga: "TON",
  "Trinidad and Tobago": "TTO",
  Tunisia: "TUN",
  Turkey: "TUR",
  Turkmenistan: "TKM",
  Tuvalu: "TUV",
  Uganda: "UGA",
  Ukraine: "UKR",
  "United Arab Emirates": "ARE",
  "United Kingdom": "GBR",
  "United States": "USA",
  Uruguay: "URY",
  Uzbekistan: "UZB",
  Vanuatu: "VUT",
  "Vatican City": "VAT",
  Venezuela: "VEN",
  Vietnam: "VNM",
  Yemen: "YEM",
  Zambia: "ZMB",
  Zimbabwe: "ZWE",
};

const LeafletMap = ({ selectedCountries, setCombinedVisaReqs }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoRef = useRef(null);
  const legendRef = useRef(null);

  // Color scale function
  const getColor = (requirement) => {
    const colorMap = {
      "-1": "#1E40AF",
      "no admission": "gray",
      "covid ban": "gray",
      "visa required": "#C0C0C0",
      "e-visa": "#61C7A1",
      "visa on arrival": "#B5E61D",
      "visa free": "#22B14C",
    };

    // Handle visa-free days
    const days = [
      "7",
      "10",
      "14",
      "15",
      "21",
      "28",
      "30",
      "31",
      "42",
      "45",
      "60",
      "90",
      "120",
      "180",
      "240",
      "360",
    ];
    if (days.includes(requirement)) {
      return requirement <= "30" ? "#BAFFAA" : "#9EFF9E";
    }

    return colorMap[requirement] || "#C0C0C0";
  };

  // Function to get country name from ISO code
  const getCountryName = useCallback((isoCode) => {
    return Object.keys(countryCodesObject).find(
      (key) => countryCodesObject[key] === isoCode
    );
  }, []);

  // Process visa requirements data
  const processVisaData = useCallback(async () => {
    try {
      const response = await fetch("/passport-index-tidy-iso3.csv");
      const csvData = await response.text();
      const lines = csvData.split("\n");
      const headers = lines[0].split(",");
      const visaData = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = currentLine[j];
        }
        visaData.push(entry);
      }

      const countriesObject = {};
      visaData.forEach((entry) => {
        if (!countriesObject[entry.Passport]) {
          countriesObject[entry.Passport] = {};
        }
        countriesObject[entry.Passport][entry.Destination] = entry.Requirement;
      });

      const selectedCountryCodes = selectedCountries.map(
        (country) => countryCodesObject[country]
      );
      const allCountriesArray = selectedCountryCodes.map(
        (code) => countriesObject[code]
      );

      // Combine visa requirements
      const combinedVisaReqs = getCombinedVisaReqs(...allCountriesArray);
      setCombinedVisaReqs(combinedVisaReqs);
      return combinedVisaReqs;
    } catch (error) {
      console.error("Error processing visa data:", error);
      return {};
    }
  }, [selectedCountries, setCombinedVisaReqs]);

  // Function to combine visa requirements
  const getCombinedVisaReqs = (...objects) => {
    const sortedVisaRequirements = [
      "Selected Country",
      null,
      "no admission",
      "covid ban",
      "visa required",
      "e-visa",
      "visa on arrival",
      "7",
      "10",
      "14",
      "15",
      "21",
      "28",
      "30",
      "31",
      "42",
      "45",
      "60",
      "90",
      "120",
      "180",
      "240",
      "360",
      "visa free",
    ];

    let result = {};
    objects.forEach((obj) => {
      for (let key in obj) {
        if (
          !result[key] ||
          sortedVisaRequirements.indexOf(obj[key]) <
            sortedVisaRequirements.indexOf(result[key])
        ) {
          result[key] = obj[key];
        }
      }
    });
    return result;
  };

  // Initialize map
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

    // Add custom control for info
    const info = L.control();
    info.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      infoRef.current = this._div;
      return this._div;
    };
    info.update = function (props) {
      this._div.innerHTML = props
        ? `<strong>${getCountryName(props.A3) || props.A3}</strong><br/>
           Requirement: ${props.requirement || "N/A"}`
        : "Hover over a country";
    };
    info.addTo(mapInstanceRef.current);

    // Add legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      legendRef.current = div;
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

      div.innerHTML = "<h4>Visa Requirements</h4>";
      requirements.forEach((req) => {
        div.innerHTML += `<i style="background:${getColor(
          req
        )}"></i>${req}<br>`;
      });
      return div;
    };
    legend.addTo(mapInstanceRef.current);

    // Add dark theme map tiles
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution: "©OpenStreetMap, ©CartoDB",
      }
    ).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [getCountryName]);

  // Update map data
  useEffect(() => {
    const updateMap = async () => {
      if (!mapInstanceRef.current) return;

      const visaReqs = await processVisaData();
      const response = await fetch("/countries-land-10km.geo.json");
      const geoData = await response.json();

      // Remove existing layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.GeoJSON) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new choropleth layer
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
              const layer = e.target;
              layer.setStyle({
                weight: 2,
                color: "#666",
                fillOpacity: 0.9,
              });
              layer.bringToFront();
              infoRef.current.innerHTML = `
                <strong>${
                  getCountryName(feature.properties.A3) || feature.properties.A3
                }</strong><br/>
                Requirement: ${visaReqs[feature.properties.A3] || "N/A"}
              `;
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 1,
                color: "white",
                fillOpacity: 0.7,
              });
              infoRef.current.innerHTML = "Hover over a country";
            },
            click: (e) => {
              mapInstanceRef.current.fitBounds(e.target.getBounds());
            },
          });
        },
      }).addTo(mapInstanceRef.current);
    };

    updateMap();
  }, [selectedCountries, processVisaData, getCountryName]);

  return (
    <div className="relative w-full">
      <style jsx global>{`
        .info {
          padding: 6px 8px;
          font: 14px/16px Arial, Helvetica, sans-serif;
          background: white;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
        .legend {
          background: white;
          background: rgba(255, 255, 255, 0.8);
          padding: 6px 8px;
          border-radius: 5px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }
        .legend i {
          width: 18px;
          height: 18px;
          float: left;
          margin-right: 8px;
          opacity: 0.7;
        }
        .legend h4 {
          margin: 0 0 5px;
          color: #777;
        }
      `}</style>
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
