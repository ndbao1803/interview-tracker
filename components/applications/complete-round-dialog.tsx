"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CompleteRoundDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    round: any;
    onComplete: (data: {
        round: any;
        isFinish: boolean;
        feedback: string;
        note: string;
        isRejected: boolean;
    }) => void;
}

export function CompleteRoundDialog({
    open,
    onOpenChange,
    round,
    onComplete,
}: CompleteRoundDialogProps) {
    const [outcome, setOutcome] = useState<"success" | "rejected">("success");
    const [feedback, setFeedback] = useState("");
    const [note, setNote] = useState("");

    const handleSubmit = () => {
        onComplete({
            round,
            isFinish: true,
            feedback,
            note,
            isRejected: outcome === "rejected",
        });
        resetForm();
    };

    const resetForm = () => {
        setOutcome("success");
        setFeedback("");
        setNote("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                <DialogHeader>
                    <DialogTitle>
                        Complete Round {round?.seq_no}: {round?.title}
                    </DialogTitle>
                    <DialogDescription className="text-[#8a8a8a]">
                        Record the outcome and feedback for this interview
                        round.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Round Outcome</Label>
                        <RadioGroup
                            value={outcome}
                            onValueChange={(value) =>
                                setOutcome(value as "success" | "rejected")
                            }
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2 rounded-md border border-[#3c3c3c] p-3 bg-[#1e1e1e]">
                                <RadioGroupItem value="success" id="success" />
                                <Label
                                    htmlFor="success"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    <span>
                                        Successful - Proceed to next round
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border border-[#3c3c3c] p-3 bg-[#1e1e1e]">
                                <RadioGroupItem
                                    value="rejected"
                                    id="rejected"
                                />
                                <Label
                                    htmlFor="rejected"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <XIcon className="h-4 w-4 text-red-500" />
                                    <span>Rejected - Application ended</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="feedback">Feedback</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Enter any feedback received from the interviewer"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="bg-[#1e1e1e] border-[#3c3c3c] min-h-[100px]"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Personal Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add your personal notes about this round"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="bg-[#1e1e1e] border-[#3c3c3c] min-h-[100px]"
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
                    <Button onClick={handleSubmit} className="bg-primary">
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Complete Round
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
