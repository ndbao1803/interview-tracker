"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/src/lib/utils";

export type SubmissionStep = {
    id: string;
    message: string;
    status: "pending" | "in-progress" | "completed" | "error";
};

interface SubmissionProgressDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    steps: SubmissionStep[];
    isSubmitting: boolean;
    title?: string;
}

export function SubmissionProgressDialog({
    isOpen,
    setIsOpen,
    steps,
    isSubmitting,
    title = "Submission Progress",
}: SubmissionProgressDialogProps) {
    const [progressValue, setProgressValue] = useState(0);

    // Calculate overall progress
    useEffect(() => {
        const completedSteps = steps.filter(
            (step) => step.status === "completed"
        ).length;
        const inProgressSteps = steps.filter(
            (step) => step.status === "in-progress"
        ).length;

        // Count in-progress steps as half complete
        const progress =
            ((completedSteps + inProgressSteps * 0.5) / steps.length) * 100;

        // Animate progress
        const start = progressValue;
        const targetProgress = progress;
        const duration = 300; // ms
        const startTime = performance.now();

        const animateProgress = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentValue = start + (targetProgress - start) * progress;

            setProgressValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            }
        };

        requestAnimationFrame(animateProgress);
    }, [steps]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Progress
                        value={progressValue}
                        className="h-2 mb-6 bg-muted [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-300"
                    />

                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-start gap-3 p-3 rounded-md transition-all",
                                    step.status === "completed"
                                        ? "bg-primary/10"
                                        : step.status === "in-progress"
                                        ? "bg-primary/5 border border-primary/20"
                                        : step.status === "error"
                                        ? "bg-destructive/10"
                                        : "bg-muted/30"
                                )}
                            >
                                {step.status === "completed" && (
                                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                )}
                                {step.status === "in-progress" && (
                                    <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0 mt-0.5" />
                                )}
                                {step.status === "error" && (
                                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                )}
                                {step.status === "pending" && (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0 mt-0.5" />
                                )}

                                <div className="flex-1">
                                    <p
                                        className={cn(
                                            "text-sm font-medium",
                                            step.status === "completed"
                                                ? "text-foreground"
                                                : step.status === "in-progress"
                                                ? "text-foreground"
                                                : step.status === "error"
                                                ? "text-destructive"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        {step.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isSubmitting &&
                        steps.every((step) => step.status !== "error") && (
                            <p className="text-sm text-muted-foreground mt-4 text-center">
                                {steps.every(
                                    (step) => step.status === "completed"
                                )
                                    ? "All steps completed successfully!"
                                    : "Processing your submission..."}
                            </p>
                        )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
