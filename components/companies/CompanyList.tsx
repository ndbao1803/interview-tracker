import { CompanyCard } from "@/components/CompanyCard";
import { Pagination } from "@/components/ui/pagination";

interface CompanyListProps {
    companies: any[];
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    viewMode: "grid" | "list";
}

export const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    currentPage,
    totalPages,
    setCurrentPage,
    viewMode,
}) => {
    console.log(companies);
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

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-6"
                />
            )}
        </>
    );
};
