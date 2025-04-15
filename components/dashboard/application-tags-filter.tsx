"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ApplicationTag {
    id: string;
    name: string;
}

interface ApplicationTagsFilterProps {
    tags: ApplicationTag[];
    selectedTags: string[];
    onTagToggle: (tagId: string) => void;
}

export function ApplicationTagsFilter({
    tags,
    selectedTags,
    onTagToggle,
}: ApplicationTagsFilterProps) {
    if (!tags.length) return null;

    return (
        <Card className="bg-background border-foreground/10 text-[#cccccc] my-4">
            <CardContent className="p-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center text-sm text-[#8a8a8a]">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Filter by tags:</span>
                    </div>

                    {tags.map((tag) => (
                        <Badge
                            key={tag.id}
                            variant="outline"
                            className={cn(
                                "cursor-pointer transition-colors",
                                selectedTags.includes(tag.id)
                                    ? "bg-primary hover:bg-primary/80 text-white border-foreground/10"
                                    : " hover:bg-[#3e3e3e]  bg-background border-foreground/10"
                            )}
                            onClick={() => onTagToggle(tag.id)}
                        >
                            {tag.name}
                        </Badge>
                    ))}

                    {selectedTags.length > 0 && (
                        <button
                            className="text-xs text-[#8a8a8a] hover:text-[#cccccc] ml-2"
                            onClick={() =>
                                selectedTags.forEach((tag) => onTagToggle(tag))
                            }
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
