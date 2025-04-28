"use client";

import { useMemo } from "react";
import { Button } from "../ui/button";

interface ApplicationSankeyProps {
    application: any;
    onCompleteStep: () => void;
}

export function ApplicationSankey({
    application,
    onCompleteStep,
}: ApplicationSankeyProps) {
    const stages = useMemo(
        () =>
            application.application_rounds
                ?.sort((a: any, b: any) => a.seq_no - b.seq_no)
                .map((round: any) => ({
                    id: round.id,
                    label: round.title,
                    isFinish: round.isFinish,
                })) || [],
        [application.application_rounds]
    );

    const finishedStagesCount = stages.filter(
        (stage: any) => stage.isFinish
    ).length;
    const totalStagesCount = stages.length;

    const currentStageIndex = finishedStagesCount;

    return (
        <div className="h-full w-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-medium mb-1">Current Stage</h3>
                    <div className="px-4 py-2 rounded-md text-white font-medium bg-blue-600">
                        {stages[currentStageIndex]?.label || "Not Started"}
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-sm font-medium mb-1">
                        Application Progress
                    </h3>
                    <div className="text-2xl font-bold">
                        {totalStagesCount > 0
                            ? Math.round(
                                  (finishedStagesCount / totalStagesCount) * 100
                              )
                            : 0}
                        %
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <h3 className="text-sm font-medium mb-1">
                        Interview Rounds
                    </h3>
                    <div className="text-lg">
                        {finishedStagesCount} of {totalStagesCount}
                    </div>
                </div>
            </div>

            {/* Flow visualization */}
            <div className="relative h-24 w-full">
                <div className="absolute inset-0 flex items-center top-10">
                    <div className="h-1 w-full bg-[#3c3c3c]"></div>
                </div>
                <div>
                    <div className="relative flex justify-between">
                        {stages.map((stage: any, index: number) => {
                            const isActive = index < currentStageIndex;
                            const isCurrent = index === currentStageIndex;

                            return (
                                <div
                                    key={stage.id}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center
                                        ${
                                            isCurrent
                                                ? "ring-2 ring-offset-2 ring-offset-[#1e1e1e] ring-white"
                                                : ""
                                        }
                                        ${
                                            isActive
                                                ? "text-white bg-blue-600"
                                                : "text-[#8a8a8a] bg-[#2d2d2d]"
                                        }
                                    `}
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
                    <div className="w-full flex items-center justify-center my-4">
                        <Button
                            className="mt-3 bg-primary hover:bg-[#1177bb]"
                            onClick={onCompleteStep}
                        >
                            Complete Step
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
