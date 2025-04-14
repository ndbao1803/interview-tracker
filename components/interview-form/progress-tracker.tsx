"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/src/lib/utils";

export type Step = {
    id: string;
    label: string;
    status: "pending" | "in-progress" | "completed" | "error";
};

interface ProgressTrackerProps {
    steps: Step[];
    currentStepIndex: number;
    className?: string;
}

export function ProgressTracker({
    steps,
    currentStepIndex,
    className,
}: ProgressTrackerProps) {
    const [progressValue, setProgressValue] = useState(0);

    // Calculate progress percentage
    useEffect(() => {
        // Add animation effect
        const targetProgress = ((currentStepIndex + 1) / steps.length) * 100;

        // Animate progress bar
        const start = progressValue;
        const duration = 500; // ms
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
    }, [currentStepIndex, steps.length]);

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex flex-col items-center space-y-2"
                    >
                        <div
                            className={cn(
                                "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                                index < currentStepIndex
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : index === currentStepIndex
                                    ? "border-primary bg-background text-primary"
                                    : "border-muted-foreground/30 bg-background text-muted-foreground/50"
                            )}
                        >
                            {index < currentStepIndex ? (
                                <Check className="h-4 w-4" />
                            ) : index === currentStepIndex ? (
                                step.status === "in-progress" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {index + 1}
                                    </span>
                                )
                            ) : (
                                <span className="text-xs font-bold">
                                    {index + 1}
                                </span>
                            )}

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "absolute top-1/2 left-full w-[calc(100%-2rem)] h-0.5 -translate-y-1/2",
                                        index < currentStepIndex
                                            ? "bg-primary"
                                            : "bg-muted-foreground/30"
                                    )}
                                />
                            )}
                        </div>

                        <span
                            className={cn(
                                "text-xs font-medium whitespace-nowrap",
                                index === currentStepIndex
                                    ? "text-primary"
                                    : index < currentStepIndex
                                    ? "text-foreground"
                                    : "text-muted-foreground/50"
                            )}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            <Progress
                value={progressValue}
                className="h-2 bg-muted [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500"
            />
        </div>
    );
}
