"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Clock, MapPin, Video } from "lucide-react";
import { format } from "date-fns";

interface Interview {
    id: string;
    company: string;
    position: string;
    type: string;
    date: string;
    time: string;
    location?: string;
    round: number;
    logo?: string;
}

export function UpcomingInterviews() {
    // Sample interviews data
    const interviews: Interview[] = [
        {
            id: "1",
            company: "TechCorp",
            position: "Software Engineer",
            type: "Technical",
            date: "2023-12-22",
            time: "14:00",
            round: 2,
            logo: "/placeholder.svg?height=40&width=40&text=TC",
        },
        {
            id: "2",
            company: "CloudNet",
            position: "DevOps Engineer",
            type: "Behavioral",
            date: "2023-12-24",
            time: "10:30",
            location: "Remote (Zoom)",
            round: 1,
            logo: "/placeholder.svg?height=40&width=40&text=CN",
        },
        {
            id: "3",
            company: "FinTech Solutions",
            position: "Full Stack Developer",
            type: "Initial Screening",
            date: "2023-12-26",
            time: "15:45",
            location: "Phone Call",
            round: 1,
            logo: "/placeholder.svg?height=40&width=40&text=FS",
        },
    ];

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "EEE, MMM d");
    };

    // Format time
    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(":");
        return format(
            new Date().setHours(
                Number.parseInt(hours),
                Number.parseInt(minutes)
            ),
            "h:mm a"
        );
    };

    // Get interview type color
    const getTypeColor = (type: string) => {
        switch (type) {
            case "Technical":
                return "bg-blue-900 text-blue-100";
            case "Behavioral":
                return "bg-purple-900 text-purple-100";
            case "Initial Screening":
                return "bg-green-900 text-green-100";
            case "Final":
                return "bg-yellow-900 text-yellow-100";
            default:
                return "bg-[#3c3c3c] text-[#cccccc]";
        }
    };

    return (
        <Card className="bg-background border-foreground/10 text-[#cccccc]">
            <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
                {interviews.length > 0 ? (
                    <div className="space-y-4">
                        {interviews.map((interview) => (
                            <div
                                key={interview.id}
                                className="p-3 rounded-md border bg-background border-foreground/10 hover:bg-[#2d2d2d] transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-md bg-background border-foreground/10 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={
                                                    interview.logo ||
                                                    "/placeholder.svg"
                                                }
                                                alt={interview.company}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium text-sm">
                                                    {interview.position}
                                                </h3>
                                                <div className="flex items-center text-xs text-[#8a8a8a]">
                                                    <Building2 className="h-3 w-3 mr-1" />
                                                    <span>
                                                        {interview.company}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge
                                                className={`${getTypeColor(
                                                    interview.type
                                                )}`}
                                            >
                                                {interview.type}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#8a8a8a]">
                                            <div className="flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span>
                                                    {formatDate(interview.date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>
                                                    {formatTime(interview.time)}
                                                </span>
                                            </div>
                                            {interview.location && (
                                                <div className="flex items-center">
                                                    {interview.location.includes(
                                                        "Remote"
                                                    ) ? (
                                                        <Video className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                    )}
                                                    <span>
                                                        {interview.location}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-[#0e639c]">
                                                    Round {interview.round}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-3 gap-2">
                                    <Button
                                        size="sm"
                                        className="h-7 text-xs bg-primary border-foreground/10"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-[#8a8a8a]">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No upcoming interviews</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
