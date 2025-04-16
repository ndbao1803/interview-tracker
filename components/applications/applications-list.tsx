"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Building2,
    Calendar,
    MapPin,
    Tag,
    Clock,
    MoreHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApplicationsListProps {
    searchQuery: string;
    selectedStatuses: string[];
    selectedTags: string[];
    selectedIndustries: string[];
    selectedSources: string[];
    dateRange: { from: Date | undefined; to: Date | undefined };
    sortBy: string;
    sortDirection: "asc" | "desc";
}

export function ApplicationsList({
    searchQuery,
    selectedStatuses,
    selectedTags,
    selectedIndustries,
    selectedSources,
    dateRange,
    sortBy,
    sortDirection,
}: ApplicationsListProps) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for applications
    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            const mockApplications = [
                {
                    id: "1",
                    position: "Software Engineer",
                    company: {
                        id: "c1",
                        name: "TechCorp",
                        industry: "Technology",
                        location: "San Francisco, CA",
                        logo: "/placeholder.svg?height=40&width=40&text=TC",
                    },
                    status: "Interview",
                    source_channel: "LinkedIn",
                    applied_date: "2023-12-15",
                    current_round: 2,
                    total_rounds: 3,
                    tags: ["Remote", "Urgent"],
                    note: "Great company culture, focus on work-life balance",
                },
                {
                    id: "2",
                    position: "Frontend Developer",
                    company: {
                        id: "c2",
                        name: "DataSystems Inc",
                        industry: "Technology",
                        location: "Remote",
                        logo: "/placeholder.svg?height=40&width=40&text=DS",
                    },
                    status: "Rejected",
                    source_channel: "Job Board",
                    applied_date: "2023-12-01",
                    current_round: 3,
                    total_rounds: 3,
                    tags: ["Onsite"],
                    note: "Position requires 5+ years of experience",
                },
                {
                    id: "3",
                    position: "DevOps Engineer",
                    company: {
                        id: "c3",
                        name: "CloudNet",
                        industry: "Technology",
                        location: "Seattle, WA",
                        logo: "/placeholder.svg?height=40&width=40&text=CN",
                    },
                    status: "Applied",
                    source_channel: "Referral",
                    applied_date: "2023-12-10",
                    current_round: 1,
                    total_rounds: 4,
                    tags: ["Remote", "Referral"],
                    note: "Referred by John from engineering team",
                },
                {
                    id: "4",
                    position: "Full Stack Developer",
                    company: {
                        id: "c4",
                        name: "FinTech Solutions",
                        industry: "Finance",
                        location: "New York, NY",
                        logo: "/placeholder.svg?height=40&width=40&text=FS",
                    },
                    status: "Screening",
                    source_channel: "Company Website",
                    applied_date: "2023-12-08",
                    current_round: 1,
                    total_rounds: 3,
                    tags: ["Hybrid"],
                    note: "Initial call scheduled for next week",
                },
                {
                    id: "5",
                    position: "UX Designer",
                    company: {
                        id: "c5",
                        name: "HealthTech",
                        industry: "Healthcare",
                        location: "Boston, MA",
                        logo: "/placeholder.svg?height=40&width=40&text=HT",
                    },
                    status: "Offer",
                    source_channel: "Recruiter",
                    applied_date: "2023-11-20",
                    current_round: 3,
                    total_rounds: 3,
                    tags: ["Onsite", "Dream Job"],
                    note: "Offer received, negotiating compensation",
                },
                {
                    id: "6",
                    position: "Product Manager",
                    company: {
                        id: "c6",
                        name: "E-Shop",
                        industry: "E-commerce",
                        location: "Chicago, IL",
                        logo: "/placeholder.svg?height=40&width=40&text=ES",
                    },
                    status: "Applied",
                    source_channel: "LinkedIn",
                    applied_date: "2023-12-18",
                    current_round: 1,
                    total_rounds: 4,
                    tags: ["Onsite"],
                    note: "Position aligns well with my experience",
                },
                {
                    id: "7",
                    position: "Data Scientist",
                    company: {
                        id: "c7",
                        name: "StreamMedia",
                        industry: "Entertainment",
                        location: "Los Angeles, CA",
                        logo: "/placeholder.svg?height=40&width=40&text=SM",
                    },
                    status: "Interview",
                    source_channel: "Job Board",
                    applied_date: "2023-12-05",
                    current_round: 2,
                    total_rounds: 3,
                    tags: ["Remote", "Networking"],
                    note: "Technical interview scheduled for next week",
                },
            ];

            // Apply filters
            let filteredApplications = [...mockApplications];

            // Search query filter
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                filteredApplications = filteredApplications.filter(
                    (app) =>
                        app.position.toLowerCase().includes(query) ||
                        app.company.name.toLowerCase().includes(query) ||
                        app.note.toLowerCase().includes(query)
                );
            }

            // Status filter
            if (selectedStatuses.length > 0) {
                filteredApplications = filteredApplications.filter((app) =>
                    selectedStatuses.includes(app.status)
                );
            }

            // Tags filter
            if (selectedTags.length > 0) {
                filteredApplications = filteredApplications.filter((app) =>
                    app.tags.some((tag: string) => selectedTags.includes(tag))
                );
            }

            // Industry filter
            if (selectedIndustries.length > 0) {
                filteredApplications = filteredApplications.filter((app) =>
                    selectedIndustries.includes(app.company.industry)
                );
            }

            // Source filter
            if (selectedSources.length > 0) {
                filteredApplications = filteredApplications.filter((app) =>
                    selectedSources.includes(app.source_channel)
                );
            }

            // Date range filter
            if (dateRange.from || dateRange.to) {
                filteredApplications = filteredApplications.filter((app) => {
                    const appDate = new Date(app.applied_date);
                    if (dateRange.from && dateRange.to) {
                        return (
                            appDate >= dateRange.from && appDate <= dateRange.to
                        );
                    } else if (dateRange.from) {
                        return appDate >= dateRange.from;
                    } else if (dateRange.to) {
                        return appDate <= dateRange.to;
                    }
                    return true;
                });
            }

            // Apply sorting
            filteredApplications.sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                    case "applied_date":
                        comparison =
                            new Date(a.applied_date).getTime() -
                            new Date(b.applied_date).getTime();
                        break;
                    case "company":
                        comparison = a.company.name.localeCompare(
                            b.company.name
                        );
                        break;
                    case "position":
                        comparison = a.position.localeCompare(b.position);
                        break;
                    case "status":
                        comparison = a.status.localeCompare(b.status);
                        break;
                    default:
                        comparison =
                            new Date(a.applied_date).getTime() -
                            new Date(b.applied_date).getTime();
                }
                return sortDirection === "asc" ? comparison : -comparison;
            });

            setApplications(filteredApplications);
            setLoading(false);
        }, 500);
    }, [
        searchQuery,
        selectedStatuses,
        selectedTags,
        selectedIndustries,
        selectedSources,
        dateRange,
        sortBy,
        sortDirection,
    ]);

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

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e639c]"></div>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-[#252526] flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-[#8a8a8a]" />
                </div>
                <h3 className="text-lg font-medium">No applications found</h3>
                <p className="text-sm text-[#8a8a8a] mt-1 mb-4 max-w-md">
                    Try adjusting your filters or create a new application to
                    get started.
                </p>
                <Button className="bg-[#0e639c] hover:bg-[#1177bb]">
                    Add New Application
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((app) => (
                <Card
                    key={app.id}
                    className="bg-[#252526] border-[#3c3c3c] text-[#cccccc] hover:border-[#0e639c] transition-colors"
                >
                    <div className="p-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-md bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
                                    <img
                                        src={
                                            app.company.logo ||
                                            "/placeholder.svg"
                                        }
                                        alt={app.company.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h3 className="font-medium text-base">
                                            {app.position}
                                        </h3>
                                        <div className="flex items-center text-sm text-[#8a8a8a]">
                                            <Building2 className="h-3 w-3 mr-1" />
                                            <span>{app.company.name}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`${getStatusColor(
                                            app.status
                                        )} self-start sm:self-center`}
                                    >
                                        {app.status}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-[#8a8a8a]">
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>
                                            Applied:{" "}
                                            {formatDate(app.applied_date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span>{app.company.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Tag className="h-3 w-3 mr-1" />
                                        <span>
                                            Source: {app.source_channel}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>
                                            Round {app.current_round} of{" "}
                                            {app.total_rounds}
                                        </span>
                                    </div>
                                </div>

                                {app.tags && app.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {app.tags.map(
                                            (tag: string, index: number) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="text-xs py-0 px-1.5 h-5 bg-[#2d2d2d] border-[#3c3c3c]"
                                                >
                                                    {tag}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                )}

                                {app.note && (
                                    <div className="mt-3 text-sm border-t border-[#3c3c3c] pt-2">
                                        <p className="text-[#cccccc] line-clamp-2">
                                            {app.note}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex-shrink-0">
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
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="flex items-center w-full"
                                            >
                                                View Details
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Edit Application
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Add Interview Round
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            Update Status
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                                        <DropdownMenuItem className="text-red-400">
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
