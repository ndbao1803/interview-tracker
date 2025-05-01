"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import { useParams } from "next/navigation";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "../ui/use-toast";

interface AddInterviewRoundDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddRound: (round: any) => void;
    roundNumber: number;
}

export function AddInterviewRoundDialog({
    open,
    onOpenChange,
    onAddRound,
    roundNumber,
}: AddInterviewRoundDialogProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("60");
    const [interviewer, setInterviewer] = useState("");
    const [notes, setNotes] = useState("");

    const params = useParams();
    const applicationId = params.id;

    const handleSubmit = async () => {
        if (!title || !applicationId) {
            toast({
                title: "destruction",
                description: "Please fill in date and title",
            });
            return;
        }
        let dateTime = null;
        if (date) {
            dateTime = new Date(date);
            if (time) {
                const [hours, minutes] = time.split(":").map(Number);
                dateTime.setHours(hours, minutes);
            }
        }

        const newRound = {
            seq_no: roundNumber,
            title,
            date_time: dateTime ? dateTime.toISOString() : null,
            duration_min: Number(duration),
            interviewer,
            notes,
            applicationId,
        };

        try {
            const res = await fetch("/api/application_rounds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRound),
            });

            if (!res.ok) {
                throw new Error("Failed to add round");
            }

            const savedRound = await res.json();
            onAddRound(savedRound);
            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding interview round:", error);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDate(undefined);
        setTime("");
        setDuration("60");
        setInterviewer("");
        setNotes("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                <DialogHeader>
                    <DialogTitle>Add Interview Round</DialogTitle>
                    <DialogDescription className="text-[#8a8a8a]">
                        Schedule a new interview round for this application.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="round" className="text-right">
                            Round
                        </Label>
                        <Input
                            id="round"
                            value={roundNumber}
                            disabled
                            className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. Technical Interview"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <div className="col-span-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start text-left font-normal bg-[#1e1e1e] border-[#3c3c3c] ${
                                            !date && "text-muted-foreground"
                                        }`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                            format(date, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[#252526] border-[#3c3c3c]">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Time
                        </Label>
                        <Input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration
                        </Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#252526] border-[#3c3c3c]">
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="interviewer" className="text-right">
                            Interviewer
                        </Label>
                        <Input
                            id="interviewer"
                            placeholder="Name and role"
                            value={interviewer}
                            onChange={(e) => setInterviewer(e.target.value)}
                            className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Any preparation notes or details"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="col-span-3 bg-[#1e1e1e] border-[#3c3c3c]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#0e639c] hover:bg-[#1177bb]"
                    >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Add Round
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
