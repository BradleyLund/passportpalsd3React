import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = () => {
  const svgRef = useRef();

  
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

  useEffect(() => {

    fetch("/passport-index-tidy-iso3.csv")
    .then((response) => response.text())
    .then((csvData) => {
    visaData = parseCSVData(csvData);
        console.log("hi")
        console.log(csvData)

    const svg = d3.select(svgRef.current)
    .attr('width', 800)
    .attr('height', 600);

  // Your D3.js code to create the choropleth map goes here
  // For example, loading GeoJSON data and drawing the map
  console.log('what');
  d3.json('/countries-land-10km.geo.json').then(data => {

      
    //actually first we just need to show south africa's and then we can go from here

    //work out what the possible values are and then come up with a scale of colors for them

    //   maybe we convert the csv into one object with each country as a key to an array
    

    var countriesObject = {};

    var countryCodes = [];

    var visaRequirementPossibilities = [];

    console.log(visaData)

    for (let i = 0; i < visaData.length; i++) {
      // create an array of the country codes
      if (countryCodes.includes(visaData[i].Passport) != true) {
        countryCodes.push(visaData[i].Passport);
        countriesObject[visaData[i].Passport] = {};
      }

      if (
        visaRequirementPossibilities.includes(visaData[i].Requirement) != true
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
  
      objects.forEach(obj => {
          for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                  if (!result[key] || sortedVisaRequirements.indexOf(obj[key]) < sortedVisaRequirements.indexOf(result[key])) {
                      result[key] = obj[key];
                  }
              }
          }
      });
  
      return result;
    }
  
    combinedVisaReqs =getCombinedVisaReqs(countriesObject.USA, countriesObject.ZAF)

  console.log(combinedVisaReqs);

    for (let i=0;i< data.features.length;i++)
    {
      data.features[i].properties.value = combinedVisaReqs[data.features[i].properties.A3]

    }

  
      const projection = d3
      .geoMercator()
      .scale(130)
      .translate([800 / 2, 600 / 1.5]);
        // Create a path generator using the projection
      var path = d3.geoPath().projection(projection);

              // Define your custom color scale
    var colorScale = d3.scaleOrdinal()
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
      undefined
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
      "red"
    ]);
  
      svg.selectAll('path')
        .data(data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', d => {
          // Your color scale logic here
          // console.log(d.properties.value, d.properties);
          return colorScale(d.properties.value);
        })
        .attr('stroke', 'black');
      });

  })
  .catch((error) => console.error("Error fetching CSV data:", error));

  }, []);

  return <svg ref={svgRef}></svg>;
};

export default ChoroplethMap;
