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
import { Textarea } from "@/components/ui/textarea";

interface AddNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddNote: (note: any) => void;
}

export function AddNoteDialog({
    open,
    onOpenChange,
    onAddNote,
}: AddNoteDialogProps) {
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        if (!content.trim()) return;

        const newNote = {
            id: `note-${Date.now()}`,
            content: content.trim(),
            created_at: new Date().toISOString(),
        };

        onAddNote(newNote);
        resetForm();
    };

    const resetForm = () => {
        setContent("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#252526] border-[#3c3c3c] text-[#cccccc]">
                <DialogHeader>
                    <DialogTitle>Add Note</DialogTitle>
                    <DialogDescription className="text-[#8a8a8a]">
                        Add a note to track important information about this
                        application.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label
                            htmlFor="content"
                            className="text-sm font-medium"
                        >
                            Note Content
                        </label>
                        <Textarea
                            id="content"
                            placeholder="Enter your note here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-[#1e1e1e] border-[#3c3c3c] min-h-[150px]"
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
                        Add Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
