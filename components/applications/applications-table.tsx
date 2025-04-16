"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface ApplicationsTableProps {
    searchQuery: string;
    selectedStatuses: string[];
    selectedTags: string[];
    selectedIndustries: string[];
    selectedSources: string[];
    dateRange: { from: Date | undefined; to: Date | undefined };
    sortBy: string;
    sortDirection: "asc" | "desc";
    onSortChange: (field: string) => void;
}

export function ApplicationsTable({
    searchQuery,
    selectedStatuses,
    selectedTags,
    selectedIndustries,
    selectedSources,
    dateRange,
    sortBy,
    sortDirection,
    onSortChange,
}: ApplicationsTableProps) {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for applications - same as in ApplicationsList
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

            // Apply filters - same logic as in ApplicationsList
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

    // Render sort indicator
    const renderSortIndicator = (field: string) => {
        if (sortBy === field) {
            return sortDirection === "asc" ? (
                <ArrowUp className="ml-1 h-3 w-3" />
            ) : (
                <ArrowDown className="ml-1 h-3 w-3" />
            );
        }
        return null;
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-[#8a8a8a]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
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
        <div className="rounded-md border border-[#3c3c3c] overflow-hidden">
            <Table>
                <TableHeader className="bg-[#252526]">
                    <TableRow className="hover:bg-[#2d2d2d] border-b-[#3c3c3c]">
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => onSortChange("company")}
                        >
                            <div className="flex items-center">
                                Company {renderSortIndicator("company")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => onSortChange("position")}
                        >
                            <div className="flex items-center">
                                Position {renderSortIndicator("position")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => onSortChange("status")}
                        >
                            <div className="flex items-center">
                                Status {renderSortIndicator("status")}
                            </div>
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => onSortChange("applied_date")}
                        >
                            <div className="flex items-center">
                                Applied Date{" "}
                                {renderSortIndicator("applied_date")}
                            </div>
                        </TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow
                            key={app.id}
                            className="hover:bg-[#2d2d2d] border-b-[#3c3c3c]"
                        >
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-md bg-[#1e1e1e] flex items-center justify-center overflow-hidden">
                                        <img
                                            src={
                                                app.company.logo ||
                                                "/placeholder.svg"
                                            }
                                            alt={app.company.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">
                                            {app.company.name}
                                        </div>
                                        <div className="text-xs text-[#8a8a8a]">
                                            {app.company.industry}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">
                                    {app.position}
                                </div>
                                <div className="text-xs text-[#8a8a8a]">
                                    {app.company.location}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={`${getStatusColor(app.status)}`}
                                >
                                    {app.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {formatDate(app.applied_date)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {app.source_channel}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={
                                            (app.current_round /
                                                app.total_rounds) *
                                            100
                                        }
                                        className="h-1.5 w-16 bg-[#3c3c3c]"
                                        indicatorClassName="bg-[#0e639c]"
                                    />
                                    <span className="text-xs text-[#8a8a8a]">
                                        {app.current_round}/{app.total_rounds}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
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
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
