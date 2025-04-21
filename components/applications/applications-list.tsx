"use client";

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
    applications: any[];
    loading: boolean;
}

export function ApplicationsList({
    applications,
    loading,
}: ApplicationsListProps) {
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

    const formatDate = (dateString: string) =>
        format(new Date(dateString), "MMM d, yyyy");

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e639c]"></div>
            </div>
        );
    }

    if (!applications || applications.length === 0) {
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
    console.log(applications);

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
                                            app.positions?.companies
                                                ?.logo_url || "/placeholder.svg"
                                        }
                                        alt={
                                            app.positions?.companies?.name ||
                                            "Company"
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h3 className="font-medium text-base">
                                            {app.positions?.title}
                                        </h3>
                                        <div className="flex items-center text-sm text-[#8a8a8a]">
                                            <Building2 className="h-3 w-3 mr-1" />
                                            <span>
                                                {app.positions?.companies?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`${getStatusColor(
                                            app.status?.name
                                        )} self-start sm:self-center`}
                                    >
                                        {app.status?.name}
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
                                        <span>
                                            {app.positions?.companies
                                                ?.location || "N/A"}
                                        </span>
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
                                            Round {app.current_round ?? 1} of{" "}
                                            {app.total_rounds ?? 1}
                                        </span>
                                    </div>
                                </div>

                                {app.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {app.tags.map((tag: any) => (
                                            <Badge
                                                key={tag.tags?.id}
                                                variant="outline"
                                                className="text-xs py-0 px-1.5 h-5 bg-[#2d2d2d] border-[#3c3c3c]"
                                            >
                                                {tag.tags?.name}
                                            </Badge>
                                        ))}
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
