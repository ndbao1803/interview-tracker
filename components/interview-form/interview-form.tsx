"use client";

import { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

import { Toaster } from "@/components/ui/toaster";
import { Progress } from "@/components/ui/progress";
import { CompanyStep } from "./steps/company-step";
import { PositionStep } from "./steps/position-step";
import { ApplicationStep } from "./steps/application-step";
import { ReviewStep } from "./steps/review-step";
import { formSchema } from "./schema";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormItem, FormLabel } from "@/components/ui/form";

const SubmissionProgressDialog = ({
    isOpen,
    setIsOpen,
    progress,
    isSubmitting,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    progress: string[];
    isSubmitting: boolean;
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submission Progress</DialogTitle>
                </DialogHeader>
                <div className="py-2">
                    {progress.map((message, index) => (
                        <p key={index}>{message}</p>
                    ))}
                    {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

async function createCompany(data: {
    name: string;
    industry: string;
    location: string;
    website?: string;
    logo?: string;
}) {
    const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.id;
}

async function createPosition(data: {
    title: string;
    description?: string;
    companyId: string;
}) {
    const response = await fetch("/api/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.id;
}

async function createApplication(data: {
    companyId: string;
    positionId: string;
    totalRounds: number;
    note?: string;
}) {
    await fetch("/api/applications", {
        // Assuming you have an /api/applications endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

const steps = [
    { id: "company", label: "Company" },
    { id: "position", label: "Position" },
    { id: "application", label: "Application" },
    { id: "review", label: "Review" },
];

export default function InterviewForm({ companies }: { companies: any[] }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState<any>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submissionProgress, setSubmissionProgress] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyType: "existing",
            positionType: "existing",
            totalRounds: 1,
        },
        mode: "onTouched",
    });

    const { formState } = form;
    const { errors, dirtyFields } = formState;

    // Custom isValid calculation based on current step
    const isStepValid = () => {
        const currentValues = form.getValues();

        switch (currentStep) {
            case 0: // Company step
                if (currentValues.companyType === "existing") {
                    console.log(
                        "existingCompanyId",
                        currentValues.existingCompanyId
                    );
                    return !!currentValues.existingCompanyId;
                } else {
                    return !!(
                        currentValues.newCompanyName &&
                        currentValues.newCompanyIndustry &&
                        currentValues.newCompanyLocation
                    );
                }
            case 1: // Position step
                if (currentValues.positionType === "existing") {
                    return !!currentValues.existingPositionId;
                } else {
                    return !!currentValues.newPositionTitle;
                }
            case 2: // Application step
                return !!currentValues.totalRounds;
            case 3: // Review step
                return true;
            default:
                return false;
        }
    };

    // Calculate if the current step is valid and dirty
    const isCurrentStepValid = isStepValid() && form.formState.isDirty;

    // Debug form state
    useEffect(() => {
        console.log("Form State:", {
            isValid: isCurrentStepValid,
            isDirty: formState.isDirty,
            dirtyFields,
            errors,
            values: form.getValues(),
            currentStep,
        });
    }, [
        isCurrentStepValid,
        formState.isDirty,
        dirtyFields,
        errors,
        currentStep,
    ]);

    // Calculate progress percentage
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Get fields to validate for the current step
    const getFieldsToValidate = (
        step: number
    ): Array<keyof z.infer<typeof formSchema>> => {
        switch (step) {
            case 0: // Company step
                return form.watch("companyType") === "existing"
                    ? ["companyType", "existingCompanyId"]
                    : [
                          "companyType",
                          "newCompanyName",
                          "newCompanyIndustry",
                          "newCompanyLocation",
                      ];
            case 1: // Position step
                return form.watch("positionType") === "existing"
                    ? ["positionType", "existingPositionId"]
                    : ["positionType", "newPositionTitle"];
            case 2: // Application step
                return ["totalRounds", "applicationNote"];
            case 3: // Interview step
                return form.watch("interviewType") === "existing"
                    ? [
                          "interviewType",
                          "existingInterviewId",
                          "interviewStatus",
                      ]
                    : ["interviewType", "newInterviewTitle", "interviewStatus"];
            default:
                return [];
        }
    };

    // Handle next step
    const handleNext = async () => {
        const fieldsToValidate = getFieldsToValidate(currentStep);

        // Check if any required fields are empty
        const currentValues = form.getValues();
        const isStepValid = fieldsToValidate.every((field) => {
            const value = currentValues[field];
            // Skip validation for optional fields
            if (
                field === "applicationNote" ||
                field === "newCompanyWebsite" ||
                field === "newCompanyLogo" ||
                field === "newPositionDescription" ||
                field === "interviewFeedback" ||
                field === "interviewNote"
            ) {
                return true;
            }
            return value !== undefined && value !== "";
        });

        if (isStepValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        } else {
            // Trigger validation to show error messages
            await form.trigger(fieldsToValidate);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle skip step
    const handleSkip = () => {
        // Only allow skipping certain steps
        if (canSkipStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    // Check if the current step can be skipped
    const canSkipStep = (step: number) => {
        // Position step can be skipped if using existing company
        if (step === 1 && form.watch("companyType") === "existing") {
            return true;
        }
        // Interview step can be skipped initially
        if (step === 3) {
            return true;
        }
        return false;
    };

    // Function to upload logo file
    const uploadLogo = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload logo");
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading logo:", error);
            return null;
        }
    };

    // Handle form submission
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        setIsDialogOpen(true);
        setSubmissionProgress(["Starting submission..."]);

        startTransition(async () => {
            try {
                let companyId: string | undefined;
                if (data.companyType === "new") {
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Creating new company...",
                    ]);
                    const companyData = {
                        name: data.newCompanyName!,
                        industry: data.newCompanyIndustry!,
                        location: data.newCompanyLocation!,
                        website: data.newCompanyWebsite,
                        logo: data.newCompanyLogo,
                    };

                    const newCompanyId = await createCompany(companyData);
                    if (!newCompanyId) {
                        throw new Error("Failed to create company");
                    }
                    companyId = newCompanyId;
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Company created successfully.",
                    ]);
                } else {
                    companyId = data.existingCompanyId;
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Using existing company.",
                    ]);
                }

                let positionId: string | undefined;
                if (data.positionType === "new") {
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Creating new position...",
                    ]);
                    const positionData = {
                        title: data.newPositionTitle!,
                        description: data.newPositionDescription,
                        companyId: companyId!,
                    };
                    const newPositionId = await createPosition(positionData);
                    if (!newPositionId) {
                        throw new Error("Failed to create position");
                    }
                    positionId = newPositionId;
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Position created successfully.",
                    ]);
                } else {
                    positionId = data.existingPositionId;
                    setSubmissionProgress((prev) => [
                        ...prev,
                        "Using existing position.",
                    ]);
                }

                setSubmissionProgress((prev) => [
                    ...prev,
                    "Creating application...",
                ]);
                const applicationData = {
                    companyId: companyId!,
                    positionId: positionId!,
                    totalRounds: data.totalRounds!,
                    note: data.applicationNote,
                };
                await createApplication(applicationData);

                setSubmissionProgress((prev) => [
                    ...prev,
                    "Application created successfully.",
                ]);
                setSubmissionProgress((prev) => [
                    ...prev,
                    "Submission complete!",
                ]);
                toast({
                    title: "Success",
                    description: "Application submitted successfully.",
                });
                form.reset();
            } catch (error: any) {
                console.error("Submission error:", error);
                toast({
                    title: "Error",
                    description:
                        error.message || "Failed to submit application.",
                    variant: "destructive",
                });
                setSubmissionProgress((prev) => [
                    ...prev,
                    `Error: ${error.message || "Submission failed."}`,
                ]);
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    // Render the current step
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CompanyStep form={form} />;
            case 1:
                return <PositionStep form={form} />;
            case 2:
                return <ApplicationStep form={form} />;
            case 3:
                return <ReviewStep form={form} />;
            default:
                return null;
        }
    };

    // Add debug display in the form
    const renderDebugInfo = () => {
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SubmissionProgressDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                progress={submissionProgress}
                isSubmitting={isSubmitting}
            />
            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                <CardContent className="pt-6">
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step, index) => (
                                <div
                                    key={step.id}
                                    className={`text-sm font-bold ${
                                        index === currentStep
                                            ? "text-primary"
                                            : index < currentStep
                                            ? "text-[#cccccc]"
                                            : "text-[#8a8a8a]"
                                    }`}
                                >
                                    {step.label}
                                </div>
                            ))}
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 bg-[#3c3c3c] [&>div]:bg-primary"
                        />
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {renderStep()}
                            {renderDebugInfo()}

                            <div className="flex justify-between pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="border-[#3c3c3c] bg-[#2d2d2d] hover:bg-[#3e3e3e]"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>

                                <div className="flex gap-2">
                                    {canSkipStep(currentStep) && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleSkip}
                                            className="text-[#8a8a8a] hover:bg-[#3e3e3e] hover:text-[#cccccc]"
                                        >
                                            Skip
                                        </Button>
                                    )}

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!isCurrentStepValid}
                                            className="bg-primary hover:bg-primary-hover"
                                        >
                                            Next
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            onClick={onSubmit}
                                            className="bg-[#0e639c] hover:bg-[#1177bb]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Submit
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Toaster />
        </div>
    );
}
