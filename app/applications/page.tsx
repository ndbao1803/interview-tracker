"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
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
import SharedLayout from "@/components/SharedLayout";
import { getOwnApplicationsService } from "@/src/services/applications/getOwnApplications";

export default function ApplicationsPage() {
    const { push } = useRouter();

    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid" | "table">("list");
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({ from: undefined, to: undefined });

    const [sortBy, setSortBy] = useState<string>("applied_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                const { items, totalPages } = await getOwnApplicationsService({
                    page: currentPage,
                    search: searchQuery,
                    statuses: selectedStatuses,
                    tags: selectedTags,
                    industries: selectedIndustries,
                    sources: selectedSources,
                    dateRange,
                    sortBy,
                    sortDirection,
                });

                setApplications(items);
                setTotalPages(totalPages);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [
        searchQuery,
        selectedStatuses,
        selectedTags,
        selectedIndustries,
        selectedSources,
        dateRange,
        sortBy,
        sortDirection,
        currentPage,
    ]);

    // Filter toggle handlers
    const toggle = (value: string, setFn: any) => {
        console.log(value);
        setFn((prev: string[]) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };
    const toggleStatus = (status: string) =>
        toggle(status, setSelectedStatuses);
    const toggleTag = (tagId: string) => toggle(tagId, setSelectedTags);
    const toggleIndustry = (industry: string) =>
        toggle(industry, setSelectedIndustries);
    const toggleSource = (source: string) => toggle(source, setSelectedSources);

    const clearAllFilters = () => {
        setSelectedStatuses([]);
        setSelectedTags([]);
        setSelectedIndustries([]);
        setSelectedSources([]);
        setDateRange({ from: undefined, to: undefined });
        setSearchQuery("");
    };

    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            setSortDirection("desc");
        }
    };

    const hasActiveFilters =
        selectedStatuses.length ||
        selectedTags.length ||
        selectedIndustries.length ||
        selectedSources.length ||
        dateRange.from ||
        dateRange.to ||
        searchQuery.trim() !== "";

    return (
        <SharedLayout>
            <main className=" to-muted h-full">
                <section className="w-full py-6 md:py-12 lg:py-24">
                    <div className="container px-4 md:px-6 flex h-full">
                        {/* Sidebar */}
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
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h1 className="text-xl font-semibold">
                                            All Applications
                                        </h1>
                                        <p className="text-sm text-muted">
                                            Manage and track your job
                                            applications
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setFilterOpen(true)}
                                            variant="outline"
                                        >
                                            <Filter className="mr-1 h-4 w-4" />
                                            Filters
                                            {hasActiveFilters && (
                                                <Badge className="ml-1 bg-blue-600">
                                                    {selectedStatuses.length +
                                                        selectedTags.length +
                                                        selectedIndustries.length +
                                                        selectedSources.length +
                                                        (dateRange.from ||
                                                        dateRange.to
                                                            ? 1
                                                            : 0) +
                                                        (searchQuery.trim() !==
                                                        ""
                                                            ? 1
                                                            : 0)}
                                                </Badge>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                push("/new-application")
                                            }
                                            className="bg-primary"
                                        >
                                            <Plus className="mr-1 h-4 w-4" />{" "}
                                            New Application
                                        </Button>
                                    </div>
                                </div>

                                {/* Search, Sort & View */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                                        <Input
                                            placeholder="Search applications..."
                                            className="pl-9"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="flex gap-2 items-center">
                                        <DateRangePicker
                                            date={dateRange}
                                            onChange={setDateRange}
                                        />

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                                    Sort{" "}
                                                    <ChevronDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {[
                                                    "applied_date",
                                                    "company",
                                                    "position",
                                                    "status",
                                                ].map((field) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={field}
                                                        checked={
                                                            sortBy === field
                                                        }
                                                        onCheckedChange={() =>
                                                            handleSortChange(
                                                                field
                                                            )
                                                        }
                                                    >
                                                        {field
                                                            .replace("_", " ")
                                                            .replace(
                                                                /\b\w/g,
                                                                (c) =>
                                                                    c.toUpperCase()
                                                            )}
                                                        {sortBy === field
                                                            ? sortDirection ===
                                                              "desc"
                                                                ? " ↓"
                                                                : " ↑"
                                                            : ""}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Tabs
                                            value={viewMode}
                                            onValueChange={(v) =>
                                                setViewMode(v as any)
                                            }
                                        >
                                            <TabsList>
                                                <TabsTrigger value="list">
                                                    List
                                                </TabsTrigger>
                                                <TabsTrigger value="grid">
                                                    Grid
                                                </TabsTrigger>
                                                <TabsTrigger value="table">
                                                    Table
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>

                                {/* View Area */}
                                <div className="mt-2">
                                    {viewMode === "list" && (
                                        <ApplicationsList
                                            applications={applications}
                                            loading={loading}
                                        />
                                    )}
                                    {viewMode === "grid" && (
                                        <ApplicationsGrid
                                            applications={applications}
                                            loading={loading}
                                        />
                                    )}
                                    {viewMode === "table" && (
                                        <ApplicationsTable
                                            applications={applications}
                                            loading={loading}
                                            onSortChange={handleSortChange}
                                        />
                                    )}
                                </div>

                                {/* Pagination */}
                                <div className="mt-4 flex justify-center">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </SharedLayout>
    );
}
