"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
    date: { from: Date | undefined; to: Date | undefined };
    onChange: (date: { from: Date | undefined; to: Date | undefined }) => void;
    className?: string;
}

export function DateRangePicker({
    date,
    onChange,
    className,
}: DateRangePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "w-[240px] justify-start text-left font-normal border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 border-[#3c3c3c] bg-[#252526] text-[#cccccc]"
                    align="start"
                >
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={(range: any) => {
                            if (range) {
                                onChange(range);
                            }
                        }}
                        numberOfMonths={2}
                        className="bg-[#252526]"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
