"use client";

import { format } from "date-fns";
import { Calendar, Clock, User, Check, X, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InterviewRoundsListProps {
    rounds: any[];
}

export function InterviewRoundsList({ rounds }: InterviewRoundsListProps) {
    // Sort rounds by round number
    const sortedRounds = [...rounds].sort(
        (a, b) => a.round_number - b.round_number
    );

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "MMM d, yyyy");
    };

    // Format time
    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        return format(new Date(dateString), "h:mm a");
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Scheduled":
                return "bg-blue-900 text-blue-100";
            case "Completed":
                return "bg-green-900 text-green-100";
            case "Cancelled":
                return "bg-red-900 text-red-100";
            case "Pending":
                return "bg-yellow-900 text-yellow-100";
            default:
                return "bg-[#3c3c3c] text-[#cccccc]";
        }
    };

    if (rounds.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-[#8a8a8a]">No interview rounds added yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sortedRounds.map((round) => (
                <Card
                    key={round.id}
                    className="bg-[#1e1e1e] border-[#3c3c3c] text-[#cccccc]"
                >
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#0e639c] flex items-center justify-center text-white font-medium">
                                    {round.round_number}
                                </div>
                                <div>
                                    <h3 className="font-medium">
                                        {round.title}
                                    </h3>
                                    <div className="flex items-center text-xs text-[#8a8a8a] mt-0.5">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>
                                            {formatDate(round.date)} at{" "}
                                            {formatTime(round.date)}
                                        </span>
                                        {round.duration && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>
                                                    {round.duration} minutes
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(round.status)}>
                                    {round.status}
                                </Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]"
                                    >
                                        <DropdownMenuItem>
                                            Edit Round
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Add Feedback
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                                        <DropdownMenuItem className="text-red-400">
                                            Delete Round
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {round.interviewer && (
                            <div className="flex items-center text-sm mb-3">
                                <User className="h-4 w-4 mr-2 text-[#8a8a8a]" />
                                <span>{round.interviewer}</span>
                            </div>
                        )}

                        {round.feedback && (
                            <div className="mb-3">
                                <h4 className="text-xs text-[#8a8a8a] mb-1">
                                    Feedback
                                </h4>
                                <p className="text-sm">{round.feedback}</p>
                            </div>
                        )}

                        {round.notes && (
                            <div>
                                <h4 className="text-xs text-[#8a8a8a] mb-1">
                                    Notes
                                </h4>
                                <p className="text-sm">{round.notes}</p>
                            </div>
                        )}

                        {round.status === "Scheduled" && (
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                >
                                    <Clock className="mr-1 h-4 w-4" />
                                    Reschedule
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                >
                                    <Check className="mr-1 h-4 w-4" />
                                    Mark as Completed
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
