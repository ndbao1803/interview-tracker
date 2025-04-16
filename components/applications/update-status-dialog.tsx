"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface UpdateStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentStatus: string;
    onUpdate: (status: string) => void;
}

export function UpdateStatusDialog({
    open,
    onOpenChange,
    currentStatus,
    onUpdate,
}: UpdateStatusDialogProps) {
    const [status, setStatus] = useState(currentStatus);
    const [notes, setNotes] = useState("");

    const handleSubmit = () => {
        onUpdate(status);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                <DialogHeader>
                    <DialogTitle>Update Application Status</DialogTitle>
                    <DialogDescription className="text-[#8a8a8a]">
                        Change the current status of your application.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="status" className="text-sm font-medium">
                            Status
                        </label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger
                                id="status"
                                className="bg-[#1e1e1e] border-[#3c3c3c]"
                            >
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#252526] border-[#3c3c3c]">
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Screening">
                                    Screening
                                </SelectItem>
                                <SelectItem value="Interview">
                                    Interview
                                </SelectItem>
                                <SelectItem value="Offer">Offer</SelectItem>
                                <SelectItem value="Accepted">
                                    Accepted
                                </SelectItem>
                                <SelectItem value="Rejected">
                                    Rejected
                                </SelectItem>
                                <SelectItem value="Withdrawn">
                                    Withdrawn
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="notes" className="text-sm font-medium">
                            Notes (Optional)
                        </label>
                        <Textarea
                            id="notes"
                            placeholder="Add any notes about this status change"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
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
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#0e639c] hover:bg-[#1177bb]"
                    >
                        <CheckIcon className="mr-2 h-4 w-4" />
                        Update Status
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
