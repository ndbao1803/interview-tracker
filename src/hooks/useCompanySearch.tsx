"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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

export function useCompanySearch() {
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

    // Keep a ref to the current search query to use in fetchCompanies
    const searchQueryRef = useRef(searchQuery);

    // Update the ref whenever searchQuery changes
    useEffect(() => {
        searchQueryRef.current = searchQuery;
    }, [searchQuery]);

    // Group companies by industry
    const groupedCompanies = companies.reduce((acc, company) => {
        // Handle cases where industry might be null, undefined, or missing the name property
        const industry = company.industry?.name || "Other";
        if (!acc[industry]) {
            acc[industry] = [];
        }
        acc[industry].push(company);
        return acc;
    }, {} as Record<string, Company[]>);

    // Sort industries alphabetically
    const sortedIndustries = Object.keys(groupedCompanies).sort();

    // Debug grouped companies
    useEffect(() => {
        if (companies.length > 0) {
            console.log("Grouped companies in hook:", groupedCompanies);
            console.log("Sorted industries in hook:", sortedIndustries);
        }
    }, [companies, groupedCompanies, sortedIndustries]);

    // Fetch companies from API
    const fetchCompanies = useCallback(
        async (isNewSearch = false) => {
            try {
                const currentPage = isNewSearch ? 1 : page;
                if (isNewSearch) {
                    setCompanies([]);
                    setPage(1);
                }

                setLoading(true);
                setError(null);

                // Use the current value from the ref to ensure we have the latest
                const currentSearchQuery = searchQueryRef.current;
                const industriesParam = selectedIndustries.join(",");

                console.log(`Fetching with query: "${currentSearchQuery}"`);

                const response = await fetch(
                    `/api/companies?search=${currentSearchQuery}&industries=${industriesParam}&page=${currentPage}&limit=20`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch companies");
                }

                const data: CompaniesResponse = await response.json();

                console.log("API Response:", data);
                console.log("Companies from API:", data.companies);

                // Check if companies have the expected structure
                if (data.companies.length > 0) {
                    console.log("First company structure:", JSON.stringify(data.companies[0], null, 2));
                }

                setCompanies((prev) =>
                    isNewSearch ? data.companies : [...prev, ...data.companies]
                );
                setIndustries(data.industries);
                setHasMore(data.pageInfo.hasMore);
                if (!isNewSearch) setPage((prev) => prev + 1);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred"
                );
            } finally {
                setLoading(false);
            }
        },
        [selectedIndustries, page] // Remove searchQuery from dependencies, using ref instead
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        // Clear any existing timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set a new timeout to debounce the search
        const timeout = setTimeout(() => {
            fetchCompanies(true);
        }, 300); // 300ms debounce

        setDebounceTimeout(timeout);
    };

    const toggleIndustry = (industry: string) => {
        setSelectedIndustries((prev) =>
            prev.includes(industry)
                ? prev.filter((i) => i !== industry)
                : [...prev, industry]
        );
    };

    // Clean up the timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    return {
        searchQuery,
        companies,
        industries,
        selectedIndustries,
        loading,
        error,
        hasMore,
        groupedCompanies,
        sortedIndustries,
        handleSearchChange,
        toggleIndustry,
        fetchCompanies,
    };
}
