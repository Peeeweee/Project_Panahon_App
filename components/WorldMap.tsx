import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { WorldMapProps } from '../types';

const WorldMap: React.FC<WorldMapProps> = ({ onRegionClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  // Load Map Data
  useEffect(() => {
    // Using a reliable CDN for TopoJSON world data
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      });
  }, []);

  // Render Map
  useEffect(() => {
    if (!worldData || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = containerRef.current.getBoundingClientRect();

    // Clear previous render
    svg.selectAll("*").remove();

    // Projection: Mercator typically fills a screen better for a "wallpaper" feel than a globe
    const projection = d3.geoMercator()
      .scale(width / 6.5) // Scale relative to width
      .translate([width / 2, height / 1.6]); // Center vertically lower to leave room for header

    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // Draw Countries
    g.selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      // @ts-ignore - D3 typing issues with custom GeoJSON
      .attr("d", pathGenerator)
      .attr("class", "country")
      .attr("fill", "rgba(255, 255, 255, 0.05)") // Very subtle fill
      .attr("stroke", "rgba(255, 255, 255, 0.1)") // Subtle stroke
      .attr("stroke-width", 0.5)
      .style("cursor", "pointer")
      .style("transition", "fill 0.3s ease, stroke 0.3s ease") 
      .on("mouseover", function() {
        d3.select(this)
          .attr("fill", "rgba(167, 139, 250, 0.4)") // Highlight color (purple-400)
          .attr("stroke", "rgba(255, 255, 255, 1)") // Prominent white stroke
          .attr("stroke-width", 1.5)
          .raise(); // Bring to front
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("fill", "rgba(255, 255, 255, 0.05)")
          .attr("stroke", "rgba(255, 255, 255, 0.1)")
          .attr("stroke-width", 0.5);
      })
      .on("click", function(event, d: any) {
        if (onRegionClick && d.properties.name) {
          // Capture the path data string (d attribute)
          const pathData = d3.select(this).attr("d");
          // Capture the exact screen position of this element
          const rect = this.getBoundingClientRect();
          
          onRegionClick(d.properties.name, pathData, rect);
        }
      });

    // Add a glowing effect definition
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  }, [worldData, onRegionClick]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (worldData) setWorldData({...worldData});
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [worldData]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-transparent">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default WorldMap;