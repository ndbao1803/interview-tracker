import { CompanyCard } from "@/components/CompanyCard";
import { Pagination } from "@/components/ui/pagination";
import PaginationComponent from "../PaginationComponent";
import Loading from "../Loading";

interface CompanyListProps {
    companies: any[];
    currentPage: number;
    pageInfo: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
    };
    isLoading: boolean;
    setCurrentPage: (page: number) => void;
    viewMode: "grid" | "list";
}

export const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    currentPage,
    pageInfo,
    setCurrentPage,
    viewMode,
    isLoading,
}) => {
    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loading size={80} />
                </div>
            ) : (
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
            )}

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
