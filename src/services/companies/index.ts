import { itemsPerPagination } from "@/src/data";
import { Company } from "@/types/company";

type CompaniesApiResponse = {
    companies: Company[];
    industries: string[];
    pages: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
};
export const getSearchFilterPaginationCompanies = async (
    searchQuery: string,
    selectedIndustries: string[],
    currentPage: number,
    sortBy: string
): Promise<CompaniesApiResponse> => {
    const res = await fetch(
        `/api/companies?search=${searchQuery}&industries=${selectedIndustries.join(
            ","
        )}&sortBy=${sortBy}&page=${currentPage}&limit=${itemsPerPagination}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch companies");
    }

    return res.json();
};
