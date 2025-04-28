"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Edit, Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { AddNoteDialog } from "./add-note-dialog";

interface ApplicationNotesProps {
    notes: any[];
}

export function ApplicationNotes({
    notes: initialNotes,
}: ApplicationNotesProps) {
    const [notes, setNotes] = useState(initialNotes);
    const [open, setOpen] = useState(false);

    const handleAddNote = (note: any) => {
        setNotes((prev) => [...prev, note]);
        setOpen(false);
    };

    const sortedNotes = [...notes].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return format(new Date(dateString), "MMM d, yyyy");
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        return format(new Date(dateString), "h:mm a");
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="text-base">Notes</CardTitle>
                    <CardDescription className="text-[#8a8a8a]">
                        Your notes about this application
                    </CardDescription>
                </div>
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-[#0e639c] hover:bg-[#1177bb] text-white"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Note
                </Button>
            </div>

            <AddNoteDialog
                open={open}
                onOpenChange={setOpen}
                onAddNote={handleAddNote}
            />

            {sortedNotes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[#8a8a8a]">No notes added yet.</p>
                </div>
            ) : (
                sortedNotes.map((note) => (
                    <Card
                        key={note.id}
                        className="bg-[#1e1e1e] border-[#3c3c3c] text-[#cccccc]"
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-xs text-[#8a8a8a]">
                                    {formatDate(note.created_at)} at{" "}
                                    {formatTime(note.created_at)}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 text-red-400"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm whitespace-pre-line">
                                {note.content}
                            </p>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
