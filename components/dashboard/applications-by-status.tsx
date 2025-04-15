"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function ApplicationsByStatus() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Sample data
        const data = [
            { status: "In Progress", count: 10, color: "#0e639c" },
            { status: "Screening", count: 6, color: "#9b59b6" },
            { status: "Interview", count: 4, color: "#f39c12" },
            { status: "Offer", count: 2, color: "#2ecc71" },
            { status: "Rejected", count: 2, color: "#e74c3c" },
        ];

        // Set up dimensions
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const margin = { top: 30, right: 30, bottom: 50, left: 40 };
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
            .scaleBand()
            .domain(data.map((d) => d.status))
            .range([0, innerWidth])
            .padding(0.3);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count) * 1.2 || 0])
            .range([innerHeight, 0]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .attr("color", "#8a8a8a")
            .selectAll("text")
            .attr("font-size", "10px")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        svg.append("g")
            .call(
                d3
                    .axisLeft(y)
                    .ticks(5)
                    .tickFormat((d) => `${d}`)
            )
            .attr("color", "#8a8a8a")
            .selectAll("text")
            .attr("font-size", "10px");

        // Add bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => x(d.status) || 0)
            .attr("y", (d) => y(d.count))
            .attr("width", x.bandwidth())
            .attr("height", (d) => innerHeight - y(d.count))
            .attr("fill", (d) => d.color)
            .attr("rx", 4);

        // Add value labels
        svg.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", (d) => (x(d.status) || 0) + x.bandwidth() / 2)
            .attr("y", (d) => y(d.count) - 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "#cccccc")
            .text((d) => d.count);
    }, []);

    return <svg ref={svgRef} className="w-full h-full" />;
}
