"use client";

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function AddApplicationDialog({
    open,
    onClose,
}: {
    open: any;
    onClose: any;
}) {
    const [date, setDate] = useState(new Date());
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Mock tags data
    const tags = [
        { id: "1", name: "Remote" },
        { id: "2", name: "Onsite" },
        { id: "3", name: "Urgent" },
        { id: "4", name: "Dream Job" },
        { id: "5", name: "Networking" },
        { id: "6", name: "Referral" },
    ];

    const toggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                <DialogHeader>
                    <DialogTitle>Add New Application</DialogTitle>
                    <DialogDescription className="text-[#8a8a8a]">
                        Track a new job application in your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            placeholder="Company name"
                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            placeholder="Job title"
                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select defaultValue="Applied">
                                <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                    <SelectItem value="Applied">
                                        Applied
                                    </SelectItem>
                                    <SelectItem value="Screening">
                                        Screening
                                    </SelectItem>
                                    <SelectItem value="Interview">
                                        Interview
                                    </SelectItem>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                    <SelectItem value="Rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Application Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="border-[#3c3c3c] bg-[#1e1e1e] text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                            format(date, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto border-[#3c3c3c] bg-[#252526] p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        className="bg-[#252526] text-[#cccccc]"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="source">Source Channel</Label>
                        <Select>
                            <SelectTrigger className="border-[#3c3c3c] bg-[#1e1e1e] focus:ring-[#0e639c]">
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent className="border-[#3c3c3c] bg-[#252526] text-[#cccccc]">
                                <SelectItem value="linkedin">
                                    LinkedIn
                                </SelectItem>
                                <SelectItem value="company_website">
                                    Company Website
                                </SelectItem>
                                <SelectItem value="job_board">
                                    Job Board
                                </SelectItem>
                                <SelectItem value="referral">
                                    Referral
                                </SelectItem>
                                <SelectItem value="recruiter">
                                    Recruiter
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md border-[#3c3c3c] bg-[#1e1e1e] min-h-[42px]">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant={
                                        selectedTags.includes(tag.id)
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`cursor-pointer ${
                                        selectedTags.includes(tag.id)
                                            ? "bg-[#0e639c] hover:bg-[#0e639c]/80"
                                            : "bg-[#2d2d2d] hover:bg-[#3e3e3e] border-[#3c3c3c]"
                                    }`}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    {tag.name}
                                    {selectedTags.includes(tag.id) && (
                                        <X className="ml-1 h-3 w-3" />
                                    )}
                                </Badge>
                            ))}
                            {selectedTags.length === 0 && (
                                <span className="text-xs text-[#8a8a8a] py-1">
                                    Select tags or create new ones
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any notes about this application"
                            className="border-[#3c3c3c] bg-[#1e1e1e] focus-visible:ring-[#0e639c]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onClose}
                        className="bg-[#0e639c] hover:bg-[#1177bb]"
                    >
                        Add Application
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
