"use client";

import { useMemo } from "react";

interface ApplicationSankeyProps {
    application: any;
}

export function ApplicationSankey({ application }: ApplicationSankeyProps) {
    // Instead of using the Nivo Sankey diagram which might be causing issues,
    // let's create a simpler visualization of the application flow

    const stages = useMemo(
        () => [
            { id: "applied", label: "Applied", color: "#0e639c" },
            { id: "screening", label: "Screening", color: "#9b59b6" },
            { id: "interview", label: "Interview", color: "#f39c12" },
            { id: "final", label: "Final Round", color: "#2ecc71" },
            { id: "offer", label: "Offer", color: "#f1c40f" },
            { id: "accepted", label: "Accepted", color: "#27ae60" },
            { id: "rejected", label: "Rejected", color: "#e74c3c" },
            { id: "withdrawn", label: "Withdrawn", color: "#95a5a6" },
        ],
        []
    );

    // Determine the current stage based on application status and rounds
    const getCurrentStageIndex = () => {
        const status = application.status;
        const rounds = application.interview_rounds || [];

        if (status === "Rejected") {
            return 6; // Rejected
        }

        if (status === "Withdrawn") {
            return 7; // Withdrawn
        }

        if (status === "Accepted") {
            return 5; // Accepted
        }

        if (status === "Offer") {
            return 4; // Offer
        }

        if (rounds.length >= 2) {
            return 3; // Final Round
        }

        if (rounds.length === 1) {
            return 2; // Interview
        }

        if (status === "Screening" || rounds.length === 0) {
            return 1; // Screening
        }

        return 0; // Applied
    };

    const currentStageIndex = getCurrentStageIndex();

    return (
        <div className="h-full w-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-medium mb-1">Current Stage</h3>
                    <div
                        className="px-4 py-2 rounded-md text-white font-medium"
                        style={{
                            backgroundColor: stages[currentStageIndex].color,
                        }}
                    >
                        {stages[currentStageIndex].label}
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-sm font-medium mb-1">
                        Application Progress
                    </h3>
                    <div className="text-2xl font-bold">
                        {Math.round(
                            (currentStageIndex / (stages.length - 3)) * 100
                        )}
                        %
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <h3 className="text-sm font-medium mb-1">
                        Interview Rounds
                    </h3>
                    <div className="text-lg">
                        {application.current_round} of{" "}
                        {application.total_rounds}
                    </div>
                </div>
            </div>

            {/* Flow visualization */}
            <div className="relative h-24 w-full">
                <div className="absolute inset-0 flex items-center">
                    <div className="h-1 w-full bg-[#3c3c3c]"></div>
                </div>

                <div className="relative flex justify-between">
                    {stages.slice(0, 6).map((stage, index) => {
                        const isActive = index <= currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                            <div
                                key={stage.id}
                                className="flex flex-col items-center"
                            >
                                <div
                                    className={`
                    h-8 w-8 rounded-full flex items-center justify-center
                    ${
                        isCurrent
                            ? "ring-2 ring-offset-2 ring-offset-[#1e1e1e] ring-white"
                            : ""
                    }
                    ${isActive ? "text-white" : "text-[#8a8a8a] bg-[#2d2d2d]"}
                  `}
                                    style={{
                                        backgroundColor: isActive
                                            ? stage.color
                                            : "",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div className="mt-2 text-xs text-center">
                                    {stage.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status indicators for rejected/withdrawn */}
            {(currentStageIndex === 6 || currentStageIndex === 7) && (
                <div
                    className="mt-8 p-4 rounded-md text-white text-center"
                    style={{ backgroundColor: stages[currentStageIndex].color }}
                >
                    <h3 className="font-medium">
                        Application {stages[currentStageIndex].label}
                    </h3>
                    <p className="text-sm mt-1 opacity-80">
                        {currentStageIndex === 6
                            ? "This application was rejected. Consider reviewing feedback and applying for other positions."
                            : "You have withdrawn this application. You can always apply again in the future."}
                    </p>
                </div>
            )}
        </div>
    );
}
