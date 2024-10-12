import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

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

const ChoroplethMap = ({ selectedCountries }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear the existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Call the function to render the map
    renderMap();
  }, [selectedCountries]);

  const renderMap = () => {
    const selectedCountryCodes = [];

    // Create a tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "10px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    for (let i = 0; i < selectedCountries.length; i++) {
      selectedCountryCodes.push(countryCodesObject[selectedCountries[i]]);
    }

    // Function to parse CSV data into arrays and objects
    function parseCSVData(csvData) {
      const lines = csvData.split("\r\n");
      const headers = lines[0].split(",");
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        const entry = {};

        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = currentLine[j];
        }

        data.push(entry);
      }

      return data;
    }

    var visaData = [];

    fetch("/passport-index-tidy-iso3.csv")
      .then((response) => response.text())
      .then((csvData) => {
        visaData = parseCSVData(csvData);

        const svg = d3
          .select(svgRef.current)
          .attr("width", 800)
          .attr("height", 600);

        // Your D3.js code to create the choropleth map goes here
        // For example, loading GeoJSON data and drawing the map

        d3.json("/countries-land-10km.geo.json").then((data) => {
          //actually first we just need to show south africa's and then we can go from here

          //work out what the possible values are and then come up with a scale of colors for them

          //   maybe we convert the csv into one object with each country as a key to an array

          var countriesObject = {};

          var countryCodes = [];

          var visaRequirementPossibilities = [];

          for (let i = 0; i < visaData.length; i++) {
            // create an array of the country codes
            if (countryCodes.includes(visaData[i].Passport) != true) {
              countryCodes.push(visaData[i].Passport);
              countriesObject[visaData[i].Passport] = {};
            }

            if (
              visaRequirementPossibilities.includes(visaData[i].Requirement) !=
              true
            ) {
              visaRequirementPossibilities.push(visaData[i].Requirement);
            }

            countriesObject[visaData[i].Passport][visaData[i].Destination] =
              visaData[i].Requirement;
          }

          // I could literally save this in a new json file and just import it going forwards

          visaRequirementPossibilities.sort();

          let sortedVisaRequirements = [
            "-1",
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

          //all i want to do now and here is combine usa with zaf to have the overlapping worst
          // requirement
          let combinedVisaReqs = {};

          //get the countries that we want to compare from the select boxes like usa and south africa
          //get whichever countriesobject is the longest and then use that one to loop through below.

          function getCombinedVisaReqs(...objects) {
            let result = {};

            objects.forEach((obj) => {
              for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                  if (
                    !result[key] ||
                    sortedVisaRequirements.indexOf(obj[key]) <
                      sortedVisaRequirements.indexOf(result[key])
                  ) {
                    result[key] = obj[key];
                  }
                }
              }
            });

            return result;
          }

          //get an array of all the objects we need to pass into this function below
          const allCountriesArray = [];
          for (let i = 0; i < selectedCountryCodes.length; i++) {
            allCountriesArray.push(countriesObject[selectedCountryCodes[i]]);
          }

          console.log(allCountriesArray);

          combinedVisaReqs = getCombinedVisaReqs(...allCountriesArray);

          for (let i = 0; i < data.features.length; i++) {
            data.features[i].properties.value =
              combinedVisaReqs[data.features[i].properties.A3];
          }

          const projection = d3
            .geoMercator()
            .scale(130)
            .translate([800 / 2, 600 / 1.5]);
          // Create a path generator using the projection
          var path = d3.geoPath().projection(projection);

          // Define your custom color scale
          var colorScale = d3
            .scaleOrdinal()
            .domain([
              "-1",
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
              undefined,
            ]) // Your specific values
            .range([
              "#002377",
              "red", //small edit
              "red",
              "red",
              "#C0C0C0",
              "#61C7A1",
              "#B5E61D",
              "#BAFFAA",
              "#BAFFAA",
              "#BAFFAA",
              "#BAFFAA",
              "#BAFFAA",
              "#BAFFAA",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#9EFF9E",
              "#22B14C",
              "red",
            ]);

          let activeTooltip = null;

          const showTooltip = (event, d) => {
            // Hide any existing tooltip
            if (activeTooltip != d) {
              hideTooltip(activeTooltip);
            }

            let name = "";
            for (const property in countryCodesObject) {
              if (countryCodesObject[property] == d.properties.A3) {
                name = property;
              }
            }

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip
              .html(
                `
              <strong>${name}</strong><br/>
              Requirement: ${d.properties.value || "N/A"}<br/>
              ISO Code: ${d.properties.A3}
            `
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px");

            activeTooltip = d;
          };

          const hideTooltip = (d) => {
            console.log(d);
            if (activeTooltip === d) {
              tooltip.transition().duration(500).style("opacity", 0);
              activeTooltip = null;
            }
          };

          svg
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", (d) => {
              // Your color scale logic here
              // console.log(d.properties.value, d.properties);
              return colorScale(d.properties.value);
            })
            .attr("stroke", "grey")
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", (event, d) => {
              event.stopPropagation(); // Prevent the click from bubbling up
              if (activeTooltip === d) {
                hideTooltip();
              } else {
                showTooltip(event, d);
              }
            });

          // Close tooltip when clicking outside of a country
          // svg.on("click", () => {
          //   if (activeTooltip) {
          //     hideTooltip(activeTooltip);
          //   }
          // });
        });
      })
      .catch((error) => console.error("Error fetching CSV data:", error));
  };

  return <svg ref={svgRef}></svg>;
};

export default ChoroplethMap;
