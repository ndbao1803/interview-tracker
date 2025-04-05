// components/CompaniesDashboardComponent.tsx
import { useState, useEffect } from "react";
import { CompanyList } from "./CompanyList";
import { IndustryFilter } from "./IndustryFilter";
import { SearchBar } from "@/components/SearchBar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function CompaniesDashboardComponent() {
    const [companies, setCompanies] = useState<any[]>([]);
    const [industries, setIndustries] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("applicationsCount");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `/api/companies?search=${searchQuery}&industries=${selectedIndustries.join(
                    ","
                )}&page=${currentPage}&limit=${itemsPerPage}`
            );
            const data = await res.json();
            setCompanies(data.companies);
            setIndustries(data.industries);
        };

        fetchData();
    }, [searchQuery, selectedIndustries, sortBy, currentPage]);

    const totalPages = Math.ceil(companies?.length / itemsPerPage);

    return (
        <div className="container px-4 md:px-6 py-6">
            <h1 className="text-xl font-semibold">Companies</h1>
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <IndustryFilter
                industries={industries}
                selectedIndustries={selectedIndustries}
                setSelectedIndustries={setSelectedIndustries}
            />
            <div className="flex gap-2 mb-4">
                <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                >
                    <SelectTrigger className="w-[180px] border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="applicationsCount">
                            Most Applications
                        </SelectItem>
                        <SelectItem value="successRate">
                            Success Rate
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <CompanyList
                companies={companies}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                viewMode="grid"
            />
        </div>
    );
}
