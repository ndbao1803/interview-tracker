"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    Filter,
    Calendar,
    ChevronDown,
    Plus,
    Tag,
    Building2,
    X,
    ArrowUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsList } from "@/components/applications/applications-list";
import { ApplicationsGrid } from "@/components/applications/applications-grid";
import { ApplicationsTable } from "@/components/applications/applications-table";
import { ApplicationsFilterSidebar } from "@/components/applications/applications-filter-sidebar";
import { Pagination } from "@/components/ui/pagination";
import { DateRangePicker } from "@/components/date-range-picker";

export default function ApplicationsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for UI controls
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid" | "table">("list");
    const [filterOpen, setFilterOpen] = useState(false);
    const [addApplicationOpen, setAddApplicationOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // State for filters
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    // State for sorting
    const [sortBy, setSortBy] = useState<string>("applied_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    // Mock data for filters
    const statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"];
    const tags = [
        { id: "1", name: "Remote" },
        { id: "2", name: "Onsite" },
        { id: "3", name: "Urgent" },
        { id: "4", name: "Dream Job" },
        { id: "5", name: "Networking" },
        { id: "6", name: "Referral" },
    ];
    const industries = [
        "Technology",
        "Finance",
        "Healthcare",
        "E-commerce",
        "Entertainment",
    ];
    const sources = [
        "LinkedIn",
        "Company Website",
        "Job Board",
        "Referral",
        "Recruiter",
        "Other",
    ];

    // Toggle filter functions
    const toggleStatus = (status: string) => {
        setSelectedStatuses((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustries((prev) =>
            prev.includes(industry)
                ? prev.filter((i) => i !== industry)
                : [...prev, industry]
        );
    };

    const toggleSource = (source: string) => {
        setSelectedSources((prev) =>
            prev.includes(source)
                ? prev.filter((s) => s !== source)
                : [...prev, source]
        );
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedStatuses([]);
        setSelectedTags([]);
        setSelectedIndustries([]);
        setSelectedSources([]);
        setDateRange({ from: undefined, to: undefined });
        setSearchQuery("");
    };

    // Handle sort change
    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDirection("desc");
        }
    };

    // Check if any filters are applied
    const hasActiveFilters =
        selectedStatuses.length > 0 ||
        selectedTags.length > 0 ||
        selectedIndustries.length > 0 ||
        selectedSources.length > 0 ||
        dateRange.from ||
        dateRange.to ||
        searchQuery.trim() !== "";

    return (
        <div className="flex h-full">
            {/* Filter Sidebar */}
            <ApplicationsFilterSidebar
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                selectedStatuses={selectedStatuses}
                selectedTags={selectedTags}
                selectedIndustries={selectedIndustries}
                selectedSources={selectedSources}
                dateRange={dateRange}
                statuses={statuses}
                tags={tags}
                industries={industries}
                sources={sources}
                onToggleStatus={toggleStatus}
                onToggleTag={toggleTag}
                onToggleIndustry={toggleIndustry}
                onToggleSource={toggleSource}
                onDateRangeChange={setDateRange}
                onClearFilters={clearAllFilters}
            />

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto">
                <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-semibold">
                                All Applications
                            </h1>
                            <p className="text-sm text-[#8a8a8a]">
                                Manage and track all your job applications
                            </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                onClick={() => setFilterOpen(true)}
                            >
                                <Filter className="mr-1 h-4 w-4" />
                                Filters
                                {hasActiveFilters && (
                                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-[#0e639c]">
                                        {selectedStatuses.length +
                                            selectedTags.length +
                                            selectedIndustries.length +
                                            selectedSources.length +
                                            (dateRange.from || dateRange.to
                                                ? 1
                                                : 0) +
                                            (searchQuery.trim() !== "" ? 1 : 0)}
                                    </Badge>
                                )}
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-[#0e639c] hover:bg-[#1177bb] w-full sm:w-auto"
                                onClick={() => setAddApplicationOpen(true)}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                New Application
                            </Button>
                        </div>
                    </div>

                    {/* Search and View Controls */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8a8a8a]" />
                            <Input
                                placeholder="Search applications..."
                                className="pl-9 border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <DateRangePicker
                                date={dateRange}
                                onChange={setDateRange}
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                    >
                                        <ArrowUpDown className="mr-2 h-4 w-4" />
                                        Sort
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy === "applied_date"}
                                        onCheckedChange={() =>
                                            handleSortChange("applied_date")
                                        }
                                    >
                                        Date Applied{" "}
                                        {sortBy === "applied_date" &&
                                            (sortDirection === "desc"
                                                ? "↓"
                                                : "↑")}
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy === "company"}
                                        onCheckedChange={() =>
                                            handleSortChange("company")
                                        }
                                    >
                                        Company{" "}
                                        {sortBy === "company" &&
                                            (sortDirection === "desc"
                                                ? "↓"
                                                : "↑")}
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy === "position"}
                                        onCheckedChange={() =>
                                            handleSortChange("position")
                                        }
                                    >
                                        Position{" "}
                                        {sortBy === "position" &&
                                            (sortDirection === "desc"
                                                ? "↓"
                                                : "↑")}
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={sortBy === "status"}
                                        onCheckedChange={() =>
                                            handleSortChange("status")
                                        }
                                    >
                                        Status{" "}
                                        {sortBy === "status" &&
                                            (sortDirection === "desc"
                                                ? "↓"
                                                : "↑")}
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Tabs
                                defaultValue="list"
                                value={viewMode}
                                onValueChange={(v) => setViewMode(v as any)}
                            >
                                <TabsList className="bg-[#252526] border border-[#3c3c3c]">
                                    <TabsTrigger value="list">List</TabsTrigger>
                                    <TabsTrigger value="grid">Grid</TabsTrigger>
                                    <TabsTrigger value="table">
                                        Table
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilters && (
                        <Card className="bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                            <CardContent className="p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-[#8a8a8a]">
                                        Active filters:
                                    </span>

                                    {selectedStatuses.map((status) => (
                                        <Badge
                                            key={status}
                                            variant="outline"
                                            className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                        >
                                            <span>{status}</span>
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    toggleStatus(status)
                                                }
                                            />
                                        </Badge>
                                    ))}

                                    {selectedTags.map((tagId) => {
                                        const tag = tags.find(
                                            (t) => t.id === tagId
                                        );
                                        return tag ? (
                                            <Badge
                                                key={tagId}
                                                variant="outline"
                                                className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                            >
                                                <Tag className="h-3 w-3" />
                                                <span>{tag.name}</span>
                                                <X
                                                    className="h-3 w-3 cursor-pointer"
                                                    onClick={() =>
                                                        toggleTag(tagId)
                                                    }
                                                />
                                            </Badge>
                                        ) : null;
                                    })}

                                    {selectedIndustries.map((industry) => (
                                        <Badge
                                            key={industry}
                                            variant="outline"
                                            className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                        >
                                            <Building2 className="h-3 w-3" />
                                            <span>{industry}</span>
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    toggleIndustry(industry)
                                                }
                                            />
                                        </Badge>
                                    ))}

                                    {selectedSources.map((source) => (
                                        <Badge
                                            key={source}
                                            variant="outline"
                                            className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                        >
                                            <span>{source}</span>
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    toggleSource(source)
                                                }
                                            />
                                        </Badge>
                                    ))}

                                    {(dateRange.from || dateRange.to) && (
                                        <Badge
                                            variant="outline"
                                            className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                        >
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                                {dateRange.from
                                                    ? dateRange.from.toLocaleDateString()
                                                    : "Any"}{" "}
                                                -
                                                {dateRange.to
                                                    ? dateRange.to.toLocaleDateString()
                                                    : "Any"}
                                            </span>
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    setDateRange({
                                                        from: undefined,
                                                        to: undefined,
                                                    })
                                                }
                                            />
                                        </Badge>
                                    )}

                                    {searchQuery.trim() !== "" && (
                                        <Badge
                                            variant="outline"
                                            className="bg-[#2d2d2d] border-[#3c3c3c] flex items-center gap-1"
                                        >
                                            <Search className="h-3 w-3" />
                                            <span>{searchQuery}</span>
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() =>
                                                    setSearchQuery("")
                                                }
                                            />
                                        </Badge>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-[#8a8a8a] hover:text-[#cccccc]"
                                        onClick={clearAllFilters}
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Applications Content */}
                    <div className="mt-2">
                        {viewMode === "list" && (
                            <ApplicationsList
                                searchQuery={searchQuery}
                                selectedStatuses={selectedStatuses}
                                selectedTags={selectedTags}
                                selectedIndustries={selectedIndustries}
                                selectedSources={selectedSources}
                                dateRange={dateRange}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                            />
                        )}

                        {viewMode === "grid" && (
                            <ApplicationsGrid
                                searchQuery={searchQuery}
                                selectedStatuses={selectedStatuses}
                                selectedTags={selectedTags}
                                selectedIndustries={selectedIndustries}
                                selectedSources={selectedSources}
                                dateRange={dateRange}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                            />
                        )}

                        {viewMode === "table" && (
                            <ApplicationsTable
                                searchQuery={searchQuery}
                                selectedStatuses={selectedStatuses}
                                selectedTags={selectedTags}
                                selectedIndustries={selectedIndustries}
                                selectedSources={selectedSources}
                                dateRange={dateRange}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                onSortChange={handleSortChange}
                            />
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={5}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
