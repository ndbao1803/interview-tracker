// components/CompaniesDashboardComponent.tsx
import { useState, useEffect } from "react";
import { CompanyList } from "./CompanyList";
import { IndustryFilter } from "./IndustryFilter";
import { SearchBar } from "@/components/SearchBar";
import { SortSelect } from "./SortSelect";
import { ViewModeToggle } from "./ViewModeToogle";
import { itemsPerPagination } from "@/src/data";
import { getSearchFilterPaginationCompanies } from "@/src/services/companies";

export default function CompaniesDashboardComponent() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [industries, setIndustries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("applicationsCount");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const res = await getSearchFilterPaginationCompanies(
                searchQuery,
                selectedIndustries,
                currentPage,
                sortBy
            );
            setCompanies(res.companies);
            setIndustries(res.industries);
            setPageInfo(res.pages);
        };

        fetchData();
    }, [searchQuery, selectedIndustries, sortBy, currentPage]);

    const totalPages = Math.ceil(companies?.length / itemsPerPagination);

    return (
        <div className="container px-4 md:px-6 py-6">
            <h1 className="text-xl font-semibold">Companies</h1>
            <div className="flex mb-8">
                {" "}
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <IndustryFilter
                    industries={industries}
                    selectedIndustries={selectedIndustries}
                    setSelectedIndustries={setSelectedIndustries}
                />
                <SortSelect sortBy={sortBy} setSortBy={setSortBy} />
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            <CompanyList
                companies={companies}
                currentPage={currentPage}
                pageInfo={pageInfo}
                setCurrentPage={setCurrentPage}
                viewMode={viewMode}
            />
        </div>
    );
}
