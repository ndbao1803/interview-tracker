import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, ChevronDown } from "lucide-react";

interface IndustryFilterProps {
    industries: string[];
    selectedIndustries: string[];
    setSelectedIndustries: (industries: string[]) => void;
}

export const IndustryFilter: React.FC<IndustryFilterProps> = ({
    industries,
    selectedIndustries,
    setSelectedIndustries,
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e] mx-2"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Industry
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                {industries?.map((industry) => (
                    <DropdownMenuCheckboxItem
                        key={industry}
                        checked={selectedIndustries.includes(industry)}
                        onCheckedChange={(checked) => {
                            setSelectedIndustries(
                                checked
                                    ? [...selectedIndustries, industry]
                                    : selectedIndustries.filter(
                                          (i) => i !== industry
                                      )
                            );
                        }}
                    >
                        {industry}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
