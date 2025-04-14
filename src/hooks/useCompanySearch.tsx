"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getAllIndustries } from "../prisma/industryService";
import { getSearchFilterPaginationCompanies } from "../services/companies";

interface Company {
    id: string;
    name: string;
    industry?: {
        id: string;
        name: string;
        created_at?: string;
        updated_at?: string;
        logo_url?: string;
    } | null;
    logo_url?: File;
}

interface CompaniesResponse {
    companies: Company[];
    industries: string[];
    pageInfo: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
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
    const groupedCompanies = companies.reduce((acc: any, company: Company) => {
        // Handle cases where industry might be null, undefined, or missing the name property
        const industry: string = company.industry?.name || "Other";
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
                let currentPage;
                if (isNewSearch) {
                    setCompanies([]);
                    setPage(1);
                    currentPage = 1;
                } else {
                    currentPage = page + 1;
                    setPage(currentPage);
                }
                console.log(
                    `isNewSearch: ${isNewSearch}, page: ${currentPage}`
                );
                setLoading(true);
                setError(null);

                const currentSearchQuery = searchQueryRef.current;
                const response = await getSearchFilterPaginationCompanies(
                    currentSearchQuery,
                    selectedIndustries,
                    currentPage,
                    ""
                );

                setCompanies((prev: any) =>
                    isNewSearch
                        ? response.companies
                        : [...prev, ...response.companies]
                );
                setIndustries(response.industries);
                setHasMore(
                    response.pageInfo.currentPage < response.pageInfo.totalPages
                );
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
        [selectedIndustries, page]
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
        // Update selected industries state
        const newSelectedIndustries = selectedIndustries.includes(industry)
            ? selectedIndustries.filter((i) => i !== industry)
            : [...selectedIndustries, industry];

        setSelectedIndustries(newSelectedIndustries);

        // Reset page to 1 and trigger new search with updated filters
        setPage(1);
        setCompanies([]);
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
