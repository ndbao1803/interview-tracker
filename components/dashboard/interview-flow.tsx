"use client";

import { ResponsiveSankey } from "@nivo/sankey";

export function InterviewFlow() {
    // Define the nodes (interview stages) with explicit positioning
    const nodes = [
        // Level 0
        {
            id: "Total Applicants",
            label: "Total Applicants (24)",
            nodeColor: "#3498db",
        },

        // Level 1 - All these nodes will be at the same vertical level
        { id: "Applied", label: "Applied (10)", nodeColor: "#0e639c" },
        { id: "Screening", label: "Screening (6)", nodeColor: "#9b59b6" },
        {
            id: "Rejected Initial",
            label: "Rejected Initial (8)",
            nodeColor: "#e74c3c",
        },

        // Level 2
        { id: "First Round", label: "First Round (8)", nodeColor: "#f39c12" },
        {
            id: "Rejected Screening",
            label: "Rejected Screening (2)",
            nodeColor: "#95a5a6",
        },

        // Level 3
        { id: "Second Round", label: "Second Round (6)", nodeColor: "#2ecc71" },
        {
            id: "Rejected First",
            label: "Rejected First (2)",
            nodeColor: "#95a5a6",
        },

        // Level 4
        { id: "Final Round", label: "Final Round (4)", nodeColor: "#1abc9c" },
        {
            id: "Rejected Second",
            label: "Rejected Second (2)",
            nodeColor: "#95a5a6",
        },

        // Level 5
        { id: "Offer", label: "Offer Extended (2)", nodeColor: "#f1c40f" },
        {
            id: "Rejected Final",
            label: "Rejected Final (2)",
            nodeColor: "#95a5a6",
        },
    ];

    // Define the links (flow between stages)
    const links = [
        { source: "Total Applicants", target: "Applied", value: 10 },
        { source: "Total Applicants", target: "Screening", value: 6 },
        { source: "Total Applicants", target: "Rejected Initial", value: 8 },

        { source: "Applied", target: "First Round", value: 4 },
        { source: "Screening", target: "First Round", value: 4 },
        { source: "Screening", target: "Rejected Screening", value: 2 },

        { source: "First Round", target: "Second Round", value: 6 },
        { source: "First Round", target: "Rejected First", value: 2 },

        { source: "Second Round", target: "Final Round", value: 4 },
        { source: "Second Round", target: "Rejected Second", value: 2 },

        { source: "Final Round", target: "Offer", value: 2 },
        { source: "Final Round", target: "Rejected Final", value: 2 },
    ];

    // Define the node groups for layout
    const nodeGroups = {
        "Total Applicants": 0,
        Applied: 1,
        Screening: 1,
        "Rejected Initial": 1,
        "First Round": 2,
        "Rejected Screening": 2,
        "Second Round": 3,
        "Rejected First": 3,
        "Final Round": 4,
        "Rejected Second": 4,
        Offer: 5,
        "Rejected Final": 5,
    };

    // Combine nodes and links for the Sankey diagram
    const data = {
        nodes: nodes.map((node: any) => ({
            ...node,
            // Add the group property to each node
            group: nodeGroups[node.id],
        })),
        links,
    };

    return (
        <div className="h-[400px] w-full">
            <ResponsiveSankey
                data={data}
                linkBlendMode="normal"
                margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                align="justify"
                colors={(node) => node.nodeColor || "#1e293b"}
                nodeOpacity={1}
                nodeHoverOpacity={1}
                theme={{
                    text: {
                        fill: "currentColor", // This will respect dark/light mode
                    },
                    tooltip: {
                        container: {
                            background: "var(--background)",
                            color: "var(--foreground)",
                            borderColor: "var(--border)",
                        },
                    },
                }}
                nodeThickness={18}
                nodeSpacing={24}
                nodeBorderWidth={0}
                nodeBorderColor={{
                    from: "color",
                    modifiers: [["darker", 0.8]],
                }}
                linkOpacity={0.5}
                linkHoverOpacity={0.8}
                linkContract={3}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="horizontal"
                labelPadding={16}
                labelTextColor="currentColor" // This will respect dark/light mode
                animate={true}
                motionConfig="gentle"
                nodeTooltip={({ node }) => (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-bold">{node.label}</div>
                    </div>
                )}
                linkTooltip={({ link }) => (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="font-bold">
                            {link.source.id} → {link.target.id}: {link.value}{" "}
                            applications
                        </div>
                    </div>
                )}
                // Use layout=horizontal to ensure nodes are positioned horizontally
                layout="horizontal"
                // Group nodes by their level
                nodeGroups="group"
                // Sort nodes within the same group
                sort={(a, b) => {
                    // If nodes are in the same group, sort alphabetically
                    if (a.group === b.group) {
                        return a.id.localeCompare(b.id);
                    }
                    // Otherwise sort by group
                    return a.group - b.group;
                }}
            />
        </div>
    );
}
