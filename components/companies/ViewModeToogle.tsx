import { Button } from "@/components/ui/button";

export function ViewModeToggle({
    viewMode,
    setViewMode,
}: {
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
}) {
    return (
        <div className="flex border rounded-md border-[#3c3c3c] bg-[#2d2d2d] h-full mx-2">
            <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${
                    viewMode === "grid" ? "bg-[#3e3e3e]" : ""
                }`}
                onClick={() => setViewMode("grid")}
            >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                        d="M1.5 1.5H6.5V6.5H1.5V1.5ZM8.5 1.5H13.5V6.5H8.5V1.5ZM1.5 8.5H6.5V13.5H1.5V8.5ZM8.5 8.5H13.5V13.5H8.5V8.5Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                    />
                </svg>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${
                    viewMode === "list" ? "bg-[#3e3e3e]" : ""
                }`}
                onClick={() => setViewMode("list")}
            >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path
                        d="M1.5 2.5H13.5M1.5 7.5H13.5M1.5 12.5H13.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                    />
                </svg>
            </Button>
        </div>
    );
}
