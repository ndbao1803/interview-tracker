"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function ApplicationsByIndustry() {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear any existing SVG content
        d3.select(svgRef.current).selectAll("*").remove();

        // Sample data
        const data = [
            { industry: "Technology", count: 8 },
            { industry: "Finance", count: 4 },
            { industry: "Healthcare", count: 3 },
            { industry: "E-commerce", count: 5 },
            { industry: "Entertainment", count: 2 },
            { industry: "Other", count: 2 },
        ];

        // Set up dimensions
        const width = svgRef.current.clientWidth;
        const height = svgRef.current.clientHeight;
        const radius = Math.min(width, height) / 2 - 40;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Set up color scale
        const color = d3
            .scaleOrdinal()
            .domain(data.map((d) => d.industry))
            .range([
                "#3498db",
                "#9b59b6",
                "#2ecc71",
                "#f1c40f",
                "#e74c3c",
                "#95a5a6",
            ]);

        // Set up pie layout
        const pie = d3
            .pie<any>()
            .value((d) => d.count)
            .sort(null);

        // Set up arc generator
        const arc = d3
            .arc()
            .innerRadius(radius * 0.5) // Donut chart
            .outerRadius(radius);

        // Set up label arc
        const labelArc = d3
            .arc()
            .innerRadius(radius * 0.8)
            .outerRadius(radius * 0.8);

        // Generate pie chart
        const arcs = svg
            .selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        // Add slices
        arcs.append("path")
            .attr("d", arc as any)
            .attr("fill", (d) => color(d.data.industry) as string)
            .attr("stroke", "#1e1e1e")
            .attr("stroke-width", 1)
            .style("opacity", 0.8);

        // Add labels
        arcs.append("text")
            .attr(
                "transform",
                (d) => `translate(${labelArc.centroid(d as any)})`
            )
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .attr("fill", "#cccccc")
            .attr("font-size", "10px")
            .text((d) => (d.data.count > 2 ? d.data.industry : ""));

        // Add legend
        const legend = svg
            .selectAll(".legend")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr(
                "transform",
                (d, i) => `translate(${radius + 20}, ${-radius + 20 + i * 20})`
            );

        legend
            .append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (d) => color(d.industry) as string);

        legend
            .append("text")
            .attr("x", 20)
            .attr("y", 6)
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#cccccc")
            .text((d) => `${d.industry} (${d.count})`);
    }, []);

    return <svg ref={svgRef} className="w-full h-full" />;
}
