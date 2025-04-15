"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function ApplicationsBySource() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Sample data
        const data = [
            { source: "LinkedIn", count: 8, color: "#0077B5" },
            { source: "Company Website", count: 5, color: "#2ecc71" },
            { source: "Referral", count: 4, color: "#9b59b6" },
            { source: "Job Board", count: 3, color: "#f39c12" },
            { source: "Recruiter", count: 2, color: "#e74c3c" },
            { source: "Other", count: 2, color: "#95a5a6" },
        ];

        // Set up dimensions
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const margin = { top: 30, right: 120, bottom: 50, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count) * 1.2 || 0])
            .range([0, innerWidth]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.source))
            .range([0, innerHeight])
            .padding(0.3);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(5)
                    .tickFormat((d) => `${d}`)
            )
            .attr("color", "#8a8a8a")
            .selectAll("text")
            .attr("font-size", "10px");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("color", "#8a8a8a")
            .selectAll("text")
            .attr("font-size", "10px");

        // Add bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => y(d.source) || 0)
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("width", (d) => x(d.count))
            .attr("fill", (d) => d.color)
            .attr("rx", 4);

        // Add value labels
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("y", (d) => (y(d.source) || 0) + y.bandwidth() / 2)
            .attr("x", (d) => x(d.count) + 5)
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#cccccc")
            .text((d) => d.count);

        // Add percentage labels
        const total = d3.sum(data, (d) => d.count);
        svg.selectAll(".percentage")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "percentage")
            .attr("y", (d) => (y(d.source) || 0) + y.bandwidth() / 2)
            .attr("x", (d) => x(d.count) + 30)
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#8a8a8a")
            .text((d) => `(${Math.round((d.count / total) * 100)}%)`);
    }, []);

    return <svg ref={svgRef} className="w-full h-full" />;
}
