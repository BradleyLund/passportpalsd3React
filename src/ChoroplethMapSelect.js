import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = () => {
  const svgRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 600);

    d3.json('/countries-land-10km.geo.json')
      .then(data => {
        const projection = d3.geoMercator()
          .scale(130)
          .translate([800 / 2, 600 / 1.5]);
        const path = d3.geoPath().projection(projection);

        svg.selectAll('path')
          .data(data.features)
          .enter()
          .append('path')
          .attr('d', path)
          .attr('fill', d => selectedCountry === d.properties.name ? 'orange' : 'lightblue')
          .attr('stroke', 'black')
          .on('click', d => setSelectedCountry(d.properties.name));
      })
      .catch(error => {
        console.error('Error fetching the GeoJSON data:', error);
      });
  }, [selectedCountry]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <div>
        <button onClick={() => setSelectedCountry('Country1')}>Select Country1</button>
        <button onClick={() => setSelectedCountry('Country2')}>Select Country2</button>
      </div>
      {selectedCountry && <p>Selected Country: {selectedCountry}</p>}
    </div>
  );
};

export default ChoroplethMap;
