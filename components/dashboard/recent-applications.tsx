"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Application {
    id: string;
    company: string;
    position: string;
    status: string;
    date: string;
    logo?: string;
    tags?: string[];
}

export function RecentApplications() {
    // Sample applications data
    const applications: Application[] = [
        {
            id: "1",
            company: "TechCorp",
            position: "Software Engineer",
            status: "Interview",
            date: "2023-12-15",
            logo: "/placeholder.svg?height=40&width=40&text=TC",
            tags: ["Remote", "Urgent"],
        },
        {
            id: "2",
            company: "DataSystems Inc",
            position: "Frontend Developer",
            status: "Rejected",
            date: "2023-12-01",
            logo: "/placeholder.svg?height=40&width=40&text=DS",
            tags: ["Onsite"],
        },
        {
            id: "3",
            company: "CloudNet",
            position: "DevOps Engineer",
            status: "Applied",
            date: "2023-12-10",
            logo: "/placeholder.svg?height=40&width=40&text=CN",
            tags: ["Remote", "Referral"],
        },
        {
            id: "4",
            company: "FinTech Solutions",
            position: "Full Stack Developer",
            status: "Screening",
            date: "2023-12-08",
            logo: "/placeholder.svg?height=40&width=40&text=FS",
            tags: ["Hybrid"],
        },
    ];

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy");
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied":
                return "bg-blue-900 text-blue-100";
            case "Screening":
                return "bg-purple-900 text-purple-100";
            case "Interview":
                return "bg-yellow-900 text-yellow-100";
            case "Offer":
                return "bg-green-900 text-green-100";
            case "Rejected":
                return "bg-red-900 text-red-100";
            default:
                return "bg-[#3c3c3c] text-[#cccccc]";
        }
    };

    return (
        <Card className="bg-background border-foreground/10 text-[#cccccc]">
            <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div
                            key={app.id}
                            className="flex items-start gap-3 p-3 rounded-md border bg-background border-foreground/10 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-md bg-background border-foreground/10 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={app.logo || "/placeholder.svg"}
                                        alt={app.company}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium text-sm">
                                            {app.position}
                                        </h3>
                                        <div className="flex items-center text-xs text-[#8a8a8a]">
                                            <Building2 className="h-3 w-3 mr-1" />
                                            <span>{app.company}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`${getStatusColor(
                                            app.status
                                        )}`}
                                    >
                                        {app.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center text-xs text-[#8a8a8a]">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>{formatDate(app.date)}</span>
                                    </div>

                                    {app.tags && app.tags.length > 0 && (
                                        <div className="flex gap-1">
                                            {app.tags.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs py-1 px-1 h-4 bg-background border-foreground/10"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <a
                                href={`/dashboard/applications/${app.id}`}
                                className="flex-shrink-0 text-[#8a8a8a] hover:text-[#cccccc]"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
