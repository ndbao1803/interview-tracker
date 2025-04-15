"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function InterviewRoundSuccess() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Sample data
        const data = [
            { round: "Initial Screening", success: 75, total: 20 },
            { round: "Technical Round", success: 60, total: 15 },
            { round: "Manager Round", success: 50, total: 10 },
            { round: "Team Interview", success: 40, total: 5 },
            { round: "Final Round", success: 30, total: 3 },
        ];

        // Set up dimensions
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const margin = { top: 30, right: 120, bottom: 50, left: 120 };
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
        const x = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

        const y = d3
            .scaleBand()
            .domain(data.map((d) => d.round))
            .range([0, innerHeight])
            .padding(0.3);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(
                d3
                    .axisBottom(x)
                    .ticks(5)
                    .tickFormat((d) => `${d}%`)
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
            .attr("y", (d) => y(d.round) || 0)
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("width", (d) => x(d.success))
            .attr("fill", "#0e639c")
            .attr("rx", 4);

        // Add success rate labels
        svg.selectAll(".success-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "success-label")
            .attr("y", (d) => (y(d.round) || 0) + y.bandwidth() / 2)
            .attr("x", (d) => x(d.success) + 5)
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#cccccc")
            .text((d) => `${d.success}%`);

        // Add total count labels
        svg.selectAll(".total-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "total-label")
            .attr("y", (d) => (y(d.round) || 0) + y.bandwidth() / 2)
            .attr("x", (d) => x(d.success) + 50)
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#8a8a8a")
            .text((d) => `(${d.total} interviews)`);
    }, []);

    return <svg ref={svgRef} className="w-full h-full" />;
}
