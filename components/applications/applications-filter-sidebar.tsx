"use client";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface ApplicationsFilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStatuses: string[];
    selectedTags: string[];
    selectedIndustries: string[];
    selectedSources: string[];
    dateRange: { from: Date | undefined; to: Date | undefined };
    statuses: string[];
    tags: { id: string; name: string }[];
    industries: string[];
    sources: string[];
    onToggleStatus: (status: string) => void;
    onToggleTag: (tagId: string) => void;
    onToggleIndustry: (industry: string) => void;
    onToggleSource: (source: string) => void;
    onDateRangeChange: (range: {
        from: Date | undefined;
        to: Date | undefined;
    }) => void;
    onClearFilters: () => void;
}

export function ApplicationsFilterSidebar({
    isOpen,
    onClose,
    selectedStatuses,
    selectedTags,
    selectedIndustries,
    selectedSources,
    dateRange,
    statuses,
    tags,
    industries,
    sources,
    onToggleStatus,
    onToggleTag,
    onToggleIndustry,
    onToggleSource,
    onDateRangeChange,
    onClearFilters,
}: ApplicationsFilterSidebarProps) {
    // Check if any filters are applied
    const hasActiveFilters =
        selectedStatuses.length > 0 ||
        selectedTags.length > 0 ||
        selectedIndustries.length > 0 ||
        selectedSources.length > 0 ||
        dateRange.from ||
        dateRange.to;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] border-r-[#3c3c3c] bg-[#252526] text-[#cccccc] p-0"
            >
                <SheetHeader className="p-4 border-b border-[#3c3c3c]">
                    <SheetTitle className="text-[#cccccc]">
                        Filter Applications
                    </SheetTitle>
                </SheetHeader>

                <div className="overflow-y-auto h-[calc(100vh-60px)] p-4">
                    {/* Status Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Status</h3>
                        <div className="space-y-2">
                            {statuses.map((status) => (
                                <div
                                    key={status}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`status-${status}`}
                                        checked={selectedStatuses.includes(
                                            status
                                        )}
                                        onCheckedChange={() =>
                                            onToggleStatus(status)
                                        }
                                    />
                                    <Label
                                        htmlFor={`status-${status}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {status}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-[#3c3c3c] my-4" />

                    {/* Tags Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="space-y-2">
                            {tags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`tag-${tag.id}`}
                                        checked={selectedTags.includes(tag.id)}
                                        onCheckedChange={() =>
                                            onToggleTag(tag.id)
                                        }
                                    />
                                    <Label
                                        htmlFor={`tag-${tag.id}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {tag.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-[#3c3c3c] my-4" />

                    {/* Industry Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Industry</h3>
                        <div className="space-y-2">
                            {industries.map((industry) => (
                                <div
                                    key={industry}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`industry-${industry}`}
                                        checked={selectedIndustries.includes(
                                            industry
                                        )}
                                        onCheckedChange={() =>
                                            onToggleIndustry(industry)
                                        }
                                    />
                                    <Label
                                        htmlFor={`industry-${industry}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {industry}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-[#3c3c3c] my-4" />

                    {/* Source Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">
                            Source Channel
                        </h3>
                        <div className="space-y-2">
                            {sources.map((source) => (
                                <div
                                    key={source}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`source-${source}`}
                                        checked={selectedSources.includes(
                                            source
                                        )}
                                        onCheckedChange={() =>
                                            onToggleSource(source)
                                        }
                                    />
                                    <Label
                                        htmlFor={`source-${source}`}
                                        className="text-sm font-normal cursor-pointer"
                                    >
                                        {source}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-[#3c3c3c] my-4" />

                    {/* Date Range Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">
                            Application Date Range
                        </h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                    <Label className="text-xs text-[#8a8a8a]">
                                        From
                                    </Label>
                                    <div className="p-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] text-sm">
                                        {dateRange.from
                                            ? format(dateRange.from, "PPP")
                                            : "Select date"}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs text-[#8a8a8a]">
                                        To
                                    </Label>
                                    <div className="p-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] text-sm">
                                        {dateRange.to
                                            ? format(dateRange.to, "PPP")
                                            : "Select date"}
                                    </div>
                                </div>
                            </div>
                            <Calendar
                                mode="range"
                                selected={{
                                    from: dateRange.from,
                                    to: dateRange.to,
                                }}
                                onSelect={onDateRangeChange}
                                className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e]"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-6">
                        <Button
                            variant="outline"
                            className="flex-1 border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                            onClick={onClearFilters}
                            disabled={!hasActiveFilters}
                        >
                            Clear All
                        </Button>
                        <Button
                            className="flex-1 bg-[#0e639c] hover:bg-[#1177bb]"
                            onClick={onClose}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
