"use client";

import { useMemo, useState } from "react";
import {
    CheckCircle,
    ArrowRight,
    Plus,
    GripVertical,
    ArrowDown,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApplicationSankeyProps {
    application: any;
    onCompleteStep: () => void;
    onAddRound: () => void;
    onAddRoundAt: (position: number) => void;
    onReorderRounds: (rounds: any[]) => void;
}

// Sortable round item component
function SortableRoundItem({
    round,
    index,
    isCompleted,
    isCurrent,
    isPending,
    onCompleteStep,
}: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: round.id || `round-${index}`,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const roundNumber = index + 1;

    return (
        <div ref={setNodeRef} style={style} className="relative">
            {/* Connector Line */}
            {index < round.totalRounds - 1 && (
                <div className="absolute left-6 top-12 h-[calc(100%-12px)] w-0.5 border-l-2 border-dashed border-[#3c3c3c]"></div>
            )}

            <div
                className={`
          flex items-start gap-4 
          ${isCurrent ? "opacity-100" : isPending ? "opacity-50" : "opacity-90"}
        `}
            >
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-[-24px] top-3 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                >
                    <GripVertical className="h-5 w-5 text-[#8a8a8a] hover:text-white" />
                </div>

                {/* Status Icon */}
                <div
                    className={`
            h-12 w-12 rounded-full flex items-center justify-center
            ${
                isCompleted
                    ? "bg-green-600"
                    : isCurrent
                    ? "bg-yellow-600"
                    : isPending
                    ? "bg-[#3c3c3c]"
                    : "bg-blue-600"
            }
            ${
                isCurrent
                    ? "ring-2 ring-offset-2 ring-offset-[#1e1e1e] ring-white"
                    : ""
            }
          `}
                >
                    {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                    ) : isPending ? (
                        <span className="text-white font-medium">
                            {roundNumber}
                        </span>
                    ) : (
                        <ArrowRight className="h-6 w-6 text-white" />
                    )}
                </div>

                {/* Round Details */}
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                            {round.title || `Round ${roundNumber}`}
                        </h3>
                        {round.status && (
                            <Badge
                                variant={isCompleted ? "default" : "outline"}
                                className="ml-2"
                            >
                                {round.status || "Pending"}
                            </Badge>
                        )}
                    </div>

                    {round.date && (
                        <div className="mt-1 text-sm text-[#8a8a8a]">
                            <div className="flex items-center gap-1">
                                <span>
                                    Scheduled:{" "}
                                    {new Date(round.date).toLocaleDateString()}
                                </span>
                            </div>
                            {round.interviewer && (
                                <div className="mt-1">
                                    <span>With: {round.interviewer}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Feedback (if completed) */}
                    {round.feedback && (
                        <div className="mt-2 p-3 bg-[#252526] border border-[#3c3c3c] rounded-md">
                            <h4 className="text-xs font-medium mb-1">
                                Feedback
                            </h4>
                            <p className="text-sm">{round.feedback}</p>
                        </div>
                    )}

                    {/* Complete Button (only for current round) */}
                    {isCurrent && !isCompleted && (
                        <Button
                            className="mt-3 bg-primary hover:bg-[#1177bb]"
                            onClick={onCompleteStep}
                        >
                            Complete This Step
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Droppable zone component for adding new rounds between existing ones
function DropZone({ index, onDrop }: { index: number; onDrop: () => void }) {
    return (
        <div className="relative py-2 z-10">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#3c3c3c]"></div>
            <div
                className="flex items-center justify-center h-8 ml-[22px] cursor-pointer group"
                onClick={onDrop}
            >
                <div className="h-8 w-8 rounded-full border-2 border-dashed border-[#3c3c3c] flex items-center justify-center bg-[#252526] group-hover:border-[#2ecc71] group-hover:bg-[#2ecc71]/10 transition-colors">
                    <ArrowDown className="h-4 w-4 text-[#8a8a8a] group-hover:text-[#2ecc71]" />
                </div>
                <div className="ml-2 text-xs text-[#8a8a8a] group-hover:text-white">
                    Drop here to add a round
                </div>
            </div>
        </div>
    );
}

export function ApplicationSankey({
    application,
    onCompleteStep,
    onAddRound,
    onAddRoundAt,
    onReorderRounds,
}: ApplicationSankeyProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showDropZones, setShowDropZones] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Get application rounds from the application
    const rounds = useMemo(() => {
        return application.application_rounds || [];
    }, [application]);

    // Get current round
    const currentRound = application.current_round || 1;
    const totalRounds = rounds.length;

    // Calculate progress percentage
    const progressPercentage = Math.min(
        Math.round((currentRound / totalRounds) * 100),
        100
    );

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle adding a round at a specific position
    const handleAddRoundAt = (position: number) => {
        // This would open the AddInterviewRoundDialog with the position information
        console.log(`Add round at position: ${position}`);
        onAddRoundAt(position);
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied":
                return "#2ecc71"; // blue
            case "Screening":
                return "#9b59b6"; // purple
            case "Interview":
                return "#f39c12"; // yellow
            case "Final Round":
                return "#2ecc71"; // green
            case "Offer":
                return "#f1c40f"; // gold
            case "Accepted":
                return "#27ae60"; // emerald
            case "Rejected":
                return "#e74c3c"; // red
            case "Withdrawn":
                return "#95a5a6"; // gray
            default:
                return "#3c3c3c"; // default gray
        }
    };

    // Get current status
    const getCurrentStatus = () => {
        if (application.status === "Rejected") return "Rejected";
        if (application.status === "Withdrawn") return "Withdrawn";
        if (application.status === "Accepted") return "Accepted";
        if (application.status === "Offer") return "Offer";

        if (currentRound > 3) return "Final Round";
        if (currentRound > 1) return "Interview";
        if (currentRound === 1) return "Screening";

        return "Applied";
    };

    const currentStatus = getCurrentStatus();

    // Check if we can add more rounds
    const canAddRound = !["Rejected", "Withdrawn", "Accepted"].includes(
        application.status
    );

    // Prepare rounds for sortable context
    const sortableRounds = rounds.map((round: any, index: number) => ({
        ...round,
        index,
        totalRounds,
    }));

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        if (!isEditMode) return;
        setActiveId(event.active.id as string);
        setShowDropZones(true);
    };

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        if (!isEditMode) return;
        setActiveId(null);
        setShowDropZones(false);

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortableRounds.findIndex(
                (item: any) => item.id === active.id
            );
            const newIndex = sortableRounds.findIndex(
                (item: any) => item.id === over.id
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                const newRounds = arrayMove(sortableRounds, oldIndex, newIndex);

                // Update seq_no and round_number for each round
                const updatedRounds = newRounds.map((round: any, index) => ({
                    ...round,
                    seq_no: index + 1,
                    round_number: index + 1,
                }));

                onReorderRounds(updatedRounds);
            }
        }
    };
    return (
        <div className="h-full w-full flex flex-col justify-center">
            {/* Status and Progress Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-medium mb-1">Current Status</h3>
                    <Badge
                        className="px-4 py-2 text-white font-medium"
                        style={{
                            backgroundColor: getStatusColor(currentStatus),
                        }}
                    >
                        {currentStatus}
                    </Badge>
                </div>

                <div className="text-center">
                    <h3 className="text-sm font-medium mb-1">
                        Application Progress
                    </h3>
                    <div className="flex items-center gap-2">
                        <Progress
                            value={progressPercentage}
                            className="h-2 w-[150px]"
                        />
                        <span className="text-sm font-medium">
                            {progressPercentage}%
                        </span>
                    </div>
                </div>

                <div className="text-center md:text-right">
                    <h3 className="text-sm font-medium mb-1">
                        Interview Rounds
                    </h3>
                    <div className="text-lg">
                        {currentRound} of {totalRounds}
                    </div>
                </div>
            </div>

            {/* Application Flow Visualization */}
            <div className="border border-[#3c3c3c] rounded-md p-6 bg-[#1e1e1e]">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="mb-4 flex items-center text-sm text-[#8a8a8a]">
                                <GripVertical className="h-4 w-4 mr-1" />
                                <span>
                                    Drag rounds to reorder or add new rounds
                                    between existing ones
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                You can drag and drop to reorder interview
                                rounds
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* Add Edit Mode Toggle Button */}
                <div className="mb-4 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`border-[#3c3c3c] ${
                            isEditMode
                                ? "bg-[#2ecc71] text-white"
                                : "bg-[#2d2d2d]"
                        } hover:bg-[#3e3e3e]`}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        {isEditMode ? "Done Editing" : "Edit Order"}
                    </Button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Round Steps */}
                    {rounds.map((round: any, index: number) => {
                        const roundNumber = index + 1;
                        const isCompleted = round.isFinish == true;
                        const isCurrent = roundNumber === currentRound;
                        const isPending = roundNumber > currentRound;

                        return (
                            <div
                                key={round.id || `round-${index}`}
                                className="relative"
                            >
                                {/* Connector Line */}
                                {index < rounds.length - 1 && (
                                    <div className="absolute left-6 top-12 h-[calc(100%-12px)] w-0.5 border-l-2 border-dashed border-[#3c3c3c]"></div>
                                )}

                                <div
                                    className={`
                    flex items-start gap-4 
                    ${
                        isCurrent
                            ? "opacity-100"
                            : isPending
                            ? "opacity-50"
                            : "opacity-90"
                    }
                  `}
                                >
                                    {/* Drag Handle - Only show in edit mode */}
                                    {isEditMode && (
                                        <div
                                            className="absolute left-[-24px] top-3 cursor-grab active:cursor-grabbing"
                                            title="Drag to reorder"
                                        >
                                            <GripVertical className="h-5 w-5 text-[#8a8a8a] hover:text-white" />
                                        </div>
                                    )}

                                    {/* Status Icon */}
                                    <div
                                        className={`
                      h-12 w-12 rounded-full flex items-center justify-center
                      ${
                          isCompleted
                              ? "bg-green-600"
                              : isCurrent
                              ? "bg-yellow-600"
                              : isPending
                              ? "bg-[#3c3c3c]"
                              : "bg-blue-600"
                      }
                      ${
                          isCurrent
                              ? "ring-2 ring-offset-2 ring-offset-[#1e1e1e] ring-white"
                              : ""
                      }
                    `}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        ) : isPending ? (
                                            <span className="text-white font-medium">
                                                {roundNumber}
                                            </span>
                                        ) : (
                                            <ArrowRight className="h-6 w-6 text-white" />
                                        )}
                                    </div>

                                    {/* Round Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                {round.title ||
                                                    `Round ${roundNumber}`}
                                            </h3>
                                            {round.status && (
                                                <Badge
                                                    variant={
                                                        isCompleted
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className="ml-2"
                                                >
                                                    {round.status || "Pending"}
                                                </Badge>
                                            )}
                                        </div>

                                        {round.date_time && (
                                            <div className="mt-1 text-sm text-[#8a8a8a]">
                                                <div className="flex items-center gap-1">
                                                    <span>
                                                        Scheduled:{" "}
                                                        {new Date(
                                                            round.date_time
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                {round.interviewer && (
                                                    <div className="mt-1">
                                                        <span>
                                                            With:{" "}
                                                            {round.interviewer}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Feedback (if completed) */}
                                        {round.feedback && (
                                            <div className="mt-2 p-3 bg-[#252526] border border-[#3c3c3c] rounded-md">
                                                <h4 className="text-xs font-medium mb-1">
                                                    Feedback
                                                </h4>
                                                <p className="text-sm">
                                                    {round.feedback}
                                                </p>
                                            </div>
                                        )}
                                        {round.note && (
                                            <div className="mt-2 p-3 bg-[#252526] border border-[#3c3c3c] rounded-md">
                                                <h4 className="text-xs font-medium mb-1">
                                                    Note
                                                </h4>
                                                <p className="text-sm">
                                                    {round.note}
                                                </p>
                                            </div>
                                        )}

                                        {/* Complete Button (only for current round) */}
                                        {isCurrent && !isCompleted && (
                                            <Button
                                                className="mt-3 bg-primary hover:bg-[#1177bb]"
                                                onClick={onCompleteStep}
                                            >
                                                Complete This Step
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Insert Round Button */}
                                {canAddRound && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    className="absolute left-6 top-[calc(100%+8px)] transform -translate-x-1/2 z-10 group"
                                                    onClick={() =>
                                                        onAddRoundAt(index + 1)
                                                    }
                                                >
                                                    <div className="h-6 w-6 rounded-full border-2 border-dashed border-[#3c3c3c] flex items-center justify-center bg-[#252526] group-hover:border-[#2ecc71] group-hover:bg-[#2ecc71]/10 transition-colors">
                                                        <Plus className="h-3 w-3 text-[#8a8a8a] group-hover:text-[#2ecc71]" />
                                                    </div>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p>
                                                    Insert round after{" "}
                                                    {round.title ||
                                                        `Round ${roundNumber}`}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        );
                    })}

                    {/* Add New Round Button */}
                    {canAddRound && (
                        <div className="relative">
                            {rounds.length > 0 && (
                                <div className="absolute left-6 top-0 h-6 w-0.5 border-l-2 border-dashed border-[#3c3c3c]"></div>
                            )}
                            <div className="flex items-start gap-4 pt-6">
                                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[#2d2d2d] border-2 border-dashed border-[#3c3c3c]">
                                    <Plus className="h-6 w-6 text-[#8a8a8a]" />
                                </div>
                                <div className="flex-1">
                                    <Button
                                        variant="outline"
                                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                        onClick={onAddRound}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Round
                                    </Button>
                                    <p className="text-xs text-[#8a8a8a] mt-2">
                                        Add another interview round to track
                                        your application progress
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status indicators for rejected/withdrawn */}
            {(application.status === "Rejected" ||
                application.status === "Withdrawn") && (
                <div
                    className="mt-8 p-4 rounded-md text-white text-center"
                    style={{
                        backgroundColor: getStatusColor(application.status),
                    }}
                >
                    <h3 className="font-medium">
                        Application {application.status}
                    </h3>
                    <p className="text-sm mt-1 opacity-80">
                        {application.status === "Rejected"
                            ? "This application was rejected. Consider reviewing feedback and applying for other positions."
                            : "You have withdrawn this application. You can always apply again in the future."}
                    </p>
                </div>
            )}
        </div>
    );
}
