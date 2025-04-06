import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SortSelect({
    sortBy,
    setSortBy,
}: {
    sortBy: string;
    setSortBy: (value: string) => void;
}) {
    return (
        <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]">
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="applicationsCount">
                    Most Applications
                </SelectItem>
                <SelectItem value="successRate">Success Rate</SelectItem>
            </SelectContent>
        </Select>
    );
}
