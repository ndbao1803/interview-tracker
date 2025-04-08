"use client";

import { useEffect, useRef } from "react";
import { Check, Search, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator, // Added for better visual separation
} from "@/components/ui/command";

interface Company {
    id: string;
    name: string;
    industry_id?: string;
    industry?: {
        id?: string;
        name?: string;
    };
    location?: string;
    created_at?: string;
    updated_at?: string;
    logo?: string | null;
    website?: string | null;
}

interface CompanySearchProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    companies: Company[];
    industries: string[];
    selectedIndustries: string[];
    onToggleIndustry: (industry: string) => void;
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    groupedCompanies: Record<string, Company[]>;
    sortedIndustries: string[];
    selectedCompanyId?: string;
    onSelectCompany: (companyId: string) => void;
    fetchCompanies: (isNewSearch?: boolean) => Promise<void>;
    isOpen: boolean;
}

export function CompanySearch({
    searchQuery,
    onSearchChange,
    companies,
    industries,
    selectedIndustries,
    onToggleIndustry,
    loading,
    error,
    hasMore,
    groupedCompanies,
    sortedIndustries,
    selectedCompanyId,
    onSelectCompany,
    fetchCompanies,
    isOpen,
}: CompanySearchProps) {
    // Create refs for infinite scrolling
    const loadingRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Setup intersection observer for infinite scrolling
    useEffect(() => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && isOpen) {
                    fetchCompanies(false); // Load more, not a new search
                }
            },
            { threshold: 0.5 }
        );

        observerRef.current = observer;

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loading, hasMore, fetchCompanies, isOpen]);

    // Initial fetch
    useEffect(() => {
        if (isOpen && companies.length === 0 && !loading) {
            console.log("Initial fetch triggered");
            fetchCompanies(true);
        }
    }, [isOpen, companies.length, loading, fetchCompanies]);

    // Refetch when selected industries change
    useEffect(() => {
        if (isOpen && selectedIndustries.length > 0) {
            console.log("Industry filter changed, refetching");
            fetchCompanies(true);
        }
    }, [selectedIndustries, fetchCompanies, isOpen]);

    // Debug function to log company data
    const debugCompanies = () => {
        console.log("All companies:", companies);
        console.log("Grouped companies:", groupedCompanies);
        console.log("Sorted industries:", sortedIndustries);
        console.log("Companies length:", companies.length);
        console.log("GroupedCompanies keys:", Object.keys(groupedCompanies));
        console.log("GroupedCompanies length:", Object.keys(groupedCompanies).length);

        // Check if any companies exist
        if (companies.length > 0) {
            console.log("First company:", companies[0]);
        }
    };

    // Call debug function when companies change
    useEffect(() => {
        if (companies.length > 0) {
            debugCompanies();
        }
    }, [companies]);

    return (
        <Command className="bg-transparent" shouldFilter={false}>
            {/* Search Input */}
            <div className="flex items-center border-b border-[#3c3c3c] px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                    placeholder="Search company..."
                    className="h-9 flex-1 bg-transparent focus:outline-none placeholder:text-[#8a8a8a]"
                    value={searchQuery}
                    onValueChange={onSearchChange}
                />
            </div>

            {/* Industry filters */}
            {industries.length > 0 && (
                <div className="border-b border-[#3c3c3c] p-2">
                    <div className="text-xs text-[#8a8a8a] mb-1.5 px-1">
                        Filter by industry:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {industries.map((industry) => (
                            <Badge
                                key={industry}
                                variant={
                                    selectedIndustries.includes(industry)
                                        ? "default"
                                        : "outline"
                                }
                                className={cn(
                                    "cursor-pointer text-xs py-0.5",
                                    selectedIndustries.includes(industry)
                                        ? "bg-[#0e639c] hover:bg-[#0e639c]/80"
                                        : "bg-transparent hover:bg-[#3c3c3c] border-[#3c3c3c]"
                                )}
                                onClick={() => onToggleIndustry(industry)}
                            >
                                {industry}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <CommandList className="max-h-[300px] overflow-auto">
                {/* Error Message */}
                {error && (
                    <div className="py-6 text-center text-sm text-red-500">
                        Error: {error}. Please try again.
                    </div>
                )}

                {/* Empty State */}
                {!companies.length && !loading && !error && (
                    <CommandEmpty className="py-6 text-center text-sm">
                        No company found.
                    </CommandEmpty>
                )}

                {/* Debug Info */}
                <div className="px-3 py-1 text-xs text-[#8a8a8a] border-b border-[#3c3c3c]">
                    Query: "{searchQuery}", Results: {companies.length},
                    Industries: {sortedIndustries.length},
                    Grouped: {Object.keys(groupedCompanies).length}
                </div>

                {/* Company List */}
                {companies.length > 0 && (
                    <CommandGroup heading="Companies">
                        {companies.map((company) => (
                            <CommandItem
                                key={company.id}
                                value={company.name}
                                onSelect={() => onSelectCompany(company.id)}
                                className="cursor-pointer"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        company.id === selectedCompanyId
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {company.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                {/* Loading indicator for infinite scroll */}
                <div ref={loadingRef} className="py-2 text-center">
                    {loading && (
                        <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className="text-xs text-[#8a8a8a]">
                                Loading more...
                            </span>
                        </div>
                    )}
                    {!loading && hasMore && companies.length > 0 && (
                        <span className="text-xs text-[#8a8a8a]">
                            Scroll for more
                        </span>
                    )}
                    {!hasMore && companies.length > 0 && (
                        <span className="text-xs text-[#8a8a8a]">
                            No more companies to load
                        </span>
                    )}
                </div>
            </CommandList>
        </Command>
    );
}
