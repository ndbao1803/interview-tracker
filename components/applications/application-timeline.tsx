"use client";

import { format } from "date-fns";
import {
    Calendar,
    MessageSquare,
    Briefcase,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
} from "lucide-react";

interface ApplicationTimelineProps {
    events: any[];
}

export function ApplicationTimeline({ events }: ApplicationTimelineProps) {
    // Sort events by date (newest first)
    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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

    // Get icon for event type
    const getEventIcon = (type: string) => {
        switch (type) {
            case "application":
                return <Briefcase className="h-5 w-5 text-blue-500" />;
            case "interview":
                return <Calendar className="h-5 w-5 text-yellow-500" />;
            case "note":
                return <MessageSquare className="h-5 w-5 text-gray-500" />;
            case "status_change":
                return <RefreshCw className="h-5 w-5 text-purple-500" />;
            case "offer":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "rejection":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    // Get color for event type
    const getEventColor = (type: string) => {
        switch (type) {
            case "application":
                return "border-blue-500/20 bg-blue-500/10";
            case "interview":
                return "border-yellow-500/20 bg-yellow-500/10";
            case "note":
                return "border-gray-500/20 bg-gray-500/10";
            case "status_change":
                return "border-purple-500/20 bg-purple-500/10";
            case "offer":
                return "border-green-500/20 bg-green-500/10";
            case "rejection":
                return "border-red-500/20 bg-red-500/10";
            default:
                return "border-gray-500/20 bg-gray-500/10";
        }
    };

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[#3c3c3c]"></div>

            <div className="space-y-6">
                {sortedEvents.map((event, index) => (
                    <div key={index} className="relative pl-14">
                        {/* Timeline dot */}
                        <div className="absolute left-[22px] top-0 h-3 w-3 rounded-full bg-[#0e639c]"></div>

                        {/* Timeline icon */}
                        <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border border-[#3c3c3c] bg-[#252526]">
                            {getEventIcon(event.type)}
                        </div>

                        <div
                            className={`rounded-lg border p-4 ${getEventColor(
                                event.type
                            )}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="font-medium">{event.title}</h3>
                                <div className="flex items-center text-xs text-[#8a8a8a] mt-1 sm:mt-0">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>
                                        {formatDate(event.date)} at{" "}
                                        {formatTime(event.date)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
