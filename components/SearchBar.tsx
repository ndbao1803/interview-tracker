import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8a8a8a]" />
            <Input
                placeholder="Search companies..."
                className="pl-9 border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    )
}
