"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { formSchema } from "../schema";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";

type FormValues = z.infer<typeof formSchema>;

interface Company {
    id: string;
    name: string;
    industry: {
        name: string;
    };
}

interface CompaniesResponse {
    companies: Company[];
    industries: string[];
    pageInfo: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
    };
}

export function CompanyStep({ form }: { form: UseFormReturn<FormValues> }) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [industries, setIndustries] = useState<string[]>([]);
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [debounceTimeout, setDebounceTimeout] =
        useState<NodeJS.Timeout | null>(null);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement | null>(null);

    // Group companies by industry
    const groupedCompanies = companies.reduce((acc, company) => {
        const industry = company.industry?.name || "Other";
        if (!acc[industry]) {
            acc[industry] = [];
        }
        acc[industry].push(company);
        return acc;
    }, {} as Record<string, Company[]>);

    // Sort industries alphabetically
    const sortedIndustries = Object.keys(groupedCompanies).sort();

    // Fetch companies from API
    const fetchCompanies = useCallback(
        async (isNewSearch = false) => {
            try {
                if (isNewSearch) {
                    setPage(1);
                    setCompanies([]);
                }

                setLoading(true);
                setError(null);

                const currentPage = isNewSearch ? 1 : page;
                const industriesParam = selectedIndustries.join(",");

                const response = await fetch(
                    `/api/companies?search=${searchQuery}&industries=${industriesParam}&page=${currentPage}&limit=20`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch companies");
                }

                const data: CompaniesResponse = await response.json();

                if (isNewSearch) {
                    setCompanies(data.companies);
                } else {
                    setCompanies((prev) => [...prev, ...data.companies]);
                }

                setIndustries(data.industries);
                setHasMore(data.pageInfo.hasMore);

                if (!isNewSearch) {
                    setPage((prev) => prev + 1);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        },
        [searchQuery, selectedIndustries, page]
    );

    // Handle search query change with debounce
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchCompanies(true);
        }, 300);

        setDebounceTimeout(timeout);
    };

    // Handle industry selection
    const toggleIndustry = (industry: string) => {
        setSelectedIndustries((prev) => {
            if (prev.includes(industry)) {
                return prev.filter((i) => i !== industry);
            } else {
                return [...prev, industry];
            }
        });
    };

    // Setup intersection observer for infinite scrolling
    useEffect(() => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && open) {
                    fetchCompanies();
                }
            },
            { threshold: 1.0 }
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
    }, [loading, hasMore, fetchCompanies, open]);

    // Initial fetch
    useEffect(() => {
        if (open && companies.length === 0 && !loading) {
            fetchCompanies(true);
        }
    }, [open, companies.length, loading, fetchCompanies]);

    // Refetch when selected industries change
    useEffect(() => {
        if (open) {
            fetchCompanies(true);
        }
    }, [selectedIndustries, fetchCompanies, open]);

    // Check if any companies match the search query
    const hasMatchingCompanies = companies.length > 0;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="companyType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Selection</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                                        <SelectValue placeholder="Select company option" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                    <SelectItem value="existing">
                                        Select an existing company
                                    </SelectItem>
                                    <SelectItem value="new">
                                        Add a new company
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch("companyType") === "existing" && (
                    <FormField
                        control={form.control}
                        name="existingCompanyId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Select Company</FormLabel>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between border-[#3c3c3c] bg-[#1e1e1e] hover:bg-[#2d2d2d] text-left font-normal"
                                            >
                                                {field.value
                                                    ? companies.find(
                                                          (company) =>
                                                              company.id ===
                                                              field.value
                                                      )?.name || "Loading..."
                                                    : "Search for a company..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0 border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                        <Command className="bg-transparent">
                                            <div className="flex items-center border-b border-[#3c3c3c] px-3">
                                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                                <CommandInput
                                                    placeholder="Search company..."
                                                    className="h-9 flex-1 bg-transparent focus:outline-none placeholder:text-[#8a8a8a]"
                                                    value={searchQuery}
                                                    onValueChange={
                                                        handleSearchChange
                                                    }
                                                />
                                            </div>

                                            {/* Industry filters */}
                                            {industries.length > 0 && (
                                                <div className="border-b border-[#3c3c3c] p-2">
                                                    <div className="text-xs text-[#8a8a8a] mb-1.5 px-1">
                                                        Filter by industry:
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {industries.map(
                                                            (industry) => (
                                                                <Badge
                                                                    key={
                                                                        industry
                                                                    }
                                                                    variant={
                                                                        selectedIndustries.includes(
                                                                            industry
                                                                        )
                                                                            ? "default"
                                                                            : "outline"
                                                                    }
                                                                    className={cn(
                                                                        "cursor-pointer text-xs py-0.5",
                                                                        selectedIndustries.includes(
                                                                            industry
                                                                        )
                                                                            ? "bg-[#0e639c] hover:bg-[#0e639c]/80"
                                                                            : "bg-transparent hover:bg-[#3c3c3c] border-[#3c3c3c]"
                                                                    )}
                                                                    onClick={() =>
                                                                        toggleIndustry(
                                                                            industry
                                                                        )
                                                                    }
                                                                >
                                                                    {industry}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <CommandList className="max-h-[300px] overflow-auto">
                                                {error && (
                                                    <div className="py-6 text-center text-sm text-red-500">
                                                        Error: {error}. Please
                                                        try again.
                                                    </div>
                                                )}

                                                {!hasMatchingCompanies &&
                                                    !loading &&
                                                    !error && (
                                                        <CommandEmpty className="py-6 text-center text-sm">
                                                            No company found.
                                                        </CommandEmpty>
                                                    )}

                                                {sortedIndustries.map(
                                                    (industry) => {
                                                        const industryCompanies =
                                                            groupedCompanies[
                                                                industry
                                                            ] || [];
                                                        if (
                                                            industryCompanies.length ===
                                                            0
                                                        )
                                                            return null;

                                                        return (
                                                            <CommandGroup
                                                                key={industry}
                                                                heading={
                                                                    industry
                                                                }
                                                                className="capitalize"
                                                            >
                                                                {industryCompanies.map(
                                                                    (
                                                                        company
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                company.id
                                                                            }
                                                                            value={
                                                                                company.id
                                                                            }
                                                                            onSelect={() => {
                                                                                form.setValue(
                                                                                    "existingCompanyId",
                                                                                    company.id
                                                                                );
                                                                                setOpen(
                                                                                    false
                                                                                );
                                                                            }}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    company.id ===
                                                                                        field.value
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            {
                                                                                company.name
                                                                            }
                                                                        </CommandItem>
                                                                    )
                                                                )}
                                                                <CommandSeparator className="bg-[#3c3c3c] my-1" />
                                                            </CommandGroup>
                                                        );
                                                    }
                                                )}

                                                {/* Loading indicator for infinite scroll */}
                                                <div
                                                    ref={loadingRef}
                                                    className="py-2 text-center"
                                                >
                                                    {loading && (
                                                        <div className="flex items-center justify-center py-2">
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            <span className="text-xs text-[#8a8a8a]">
                                                                Loading more...
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!hasMore &&
                                                        companies.length >
                                                            0 && (
                                                            <span className="text-xs text-[#8a8a8a]">
                                                                No more
                                                                companies to
                                                                load
                                                            </span>
                                                        )}
                                                </div>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {form.watch("companyType") === "new" && (
                    <>
                        <FormField
                            control={form.control}
                            name="newCompanyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter company name"
                                            {...field}
                                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyIndustry"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Industry</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                                                <SelectValue placeholder="Select an industry" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                            {industries.map((industry) => (
                                                <SelectItem
                                                    key={industry}
                                                    value={industry}
                                                >
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newCompanyLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. San Francisco, CA"
                                            {...field}
                                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
