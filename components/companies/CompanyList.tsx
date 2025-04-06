import { CompanyCard } from "@/components/CompanyCard";
import { Pagination } from "@/components/ui/pagination";
import PaginationComponent from "../PaginationComponent";

interface CompanyListProps {
    companies: any[];
    currentPage: number;
    pageInfo: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
    setCurrentPage: (page: number) => void;
    viewMode: "grid" | "list";
}

export const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    currentPage,
    pageInfo,
    setCurrentPage,
    viewMode,
}) => {
    return (
        <>
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                }
            >
                {companies.map((company) => (
                    <CompanyCard
                        key={company.id}
                        company={company}
                        viewMode={viewMode}
                    />
                ))}
            </div>

            {pageInfo.totalPages > 1 && (
                <PaginationComponent
                    currentPage={pageInfo.currentPage}
                    totalPages={pageInfo.totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </>
    );
};
