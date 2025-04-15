"use client";

import { format } from "date-fns";
import {
    Calendar,
    Briefcase,
    CheckCircle,
    XCircle,
    MessageSquare,
    Building2,
} from "lucide-react";

interface TimelineEvent {
    id: string;
    date: string;
    type: "application" | "interview" | "offer" | "rejection" | "note";
    title: string;
    description: string;
    company: string;
    position?: string;
}

export function ApplicationTimeline() {
    // Sample timeline data
    const events: TimelineEvent[] = [
        {
            id: "1",
            date: "2023-12-20",
            type: "offer",
            title: "Received Job Offer",
            description:
                "Received offer for Software Engineer position with competitive compensation package",
            company: "TechCorp",
            position: "Software Engineer",
        },
        {
            id: "2",
            date: "2023-12-15",
            type: "interview",
            title: "Final Interview",
            description: "Completed final round with the CTO and team leads",
            company: "TechCorp",
            position: "Software Engineer",
        },
        {
            id: "3",
            date: "2023-12-10",
            type: "interview",
            title: "Technical Interview",
            description:
                "Completed technical interview with coding challenges and system design questions",
            company: "TechCorp",
            position: "Software Engineer",
        },
        {
            id: "4",
            date: "2023-12-05",
            type: "application",
            title: "Applied to Position",
            description: "Submitted application for Software Engineer role",
            company: "TechCorp",
            position: "Software Engineer",
        },
        {
            id: "5",
            date: "2023-12-01",
            type: "rejection",
            title: "Application Rejected",
            description: "Received rejection email after final interview",
            company: "DataSystems Inc",
            position: "Frontend Developer",
        },
        {
            id: "6",
            date: "2023-11-25",
            type: "note",
            title: "Research Note",
            description: "Researched company culture and recent projects",
            company: "TechCorp",
        },
        {
            id: "7",
            date: "2023-11-20",
            type: "interview",
            title: "Initial Screening",
            description: "Completed phone screening with HR representative",
            company: "DataSystems Inc",
            position: "Frontend Developer",
        },
    ];

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy");
    };

    // Get icon for event type
    const getEventIcon = (type: string) => {
        switch (type) {
            case "application":
                return <Briefcase className="h-5 w-5 text-blue-500" />;
            case "interview":
                return <Calendar className="h-5 w-5 text-yellow-500" />;
            case "offer":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "rejection":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "note":
                return <MessageSquare className="h-5 w-5 text-gray-500" />;
            default:
                return <Building2 className="h-5 w-5 text-gray-500" />;
        }
    };

    // Get color for event type
    const getEventColor = (type: string) => {
        switch (type) {
            case "application":
                return "border-blue-500/20 bg-blue-500/10";
            case "interview":
                return "border-yellow-500/20 bg-yellow-500/10";
            case "offer":
                return "border-green-500/20 bg-green-500/10";
            case "rejection":
                return "border-red-500/20 bg-red-500/10";
            case "note":
                return "border-gray-500/20 bg-gray-500/10";
            default:
                return "border-gray-500/20 bg-gray-500/10";
        }
    };

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-[#3c3c3c]"></div>

            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-14">
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
                                    <span>{formatDate(event.date)}</span>
                                </div>
                            </div>
                            <p className="text-sm mb-2">{event.description}</p>
                            <div className="flex items-center text-xs text-[#8a8a8a]">
                                <Building2 className="h-3 w-3 mr-1" />
                                <span>{event.company}</span>
                                {event.position && (
                                    <>
                                        <span className="mx-1">•</span>
                                        <Briefcase className="h-3 w-3 mr-1" />
                                        <span>{event.position}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
