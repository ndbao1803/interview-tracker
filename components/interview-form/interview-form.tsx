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
import { Form } from "@/components/ui/form";

import { ProgressTracker, type Step } from "./progress-tracker";
import {
    SubmissionProgressDialog,
    type SubmissionStep,
} from "./submission-progress";
import { CompanyStep } from "./steps/company-step";
import { PositionStep } from "./steps/position-step";
import { ApplicationStep } from "./steps/application-step";
import { ReviewStep } from "./steps/review-step";
import { formSchema } from "./schema";

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
    return result?.company?.id;
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
    return result?.position?.id;
}

async function createApplication(data: {
    companyId: string;
    positionId: string;
    totalRounds: number;
    note?: string;
}) {
    await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

// Define initial steps with status
const formSteps: Step[] = [
    { id: "company", label: "Company", status: "pending" },
    { id: "position", label: "Position", status: "pending" },
    { id: "application", label: "Application", status: "pending" },
    { id: "review", label: "Review", status: "pending" },
];

export default function InterviewForm({ companies }: { companies: any[] }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formStepsState, setFormStepsState] = useState<Step[]>(
        formSteps.map((step, index) =>
            index === 0 ? { ...step, status: "in-progress" } : step
        )
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [submissionSteps, setSubmissionSteps] = useState<SubmissionStep[]>(
        []
    );
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
    const isCurrentStepValid = isStepValid();

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
                field === "newPositionDescription"
            ) {
                return true;
            }
            return value !== undefined && value !== "";
        });

        if (isStepValid) {
            // Update the current step status to completed and next step to in-progress
            setFormStepsState((prev) =>
                prev.map((step, idx) =>
                    idx === currentStep
                        ? { ...step, status: "completed" }
                        : idx === currentStep + 1
                        ? { ...step, status: "in-progress" }
                        : step
                )
            );

            setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
        } else {
            // Trigger validation to show error messages
            await form.trigger(fieldsToValidate);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        // Update steps status - current to pending, previous to in-progress
        setFormStepsState((prev) =>
            prev.map((step, idx) =>
                idx === currentStep
                    ? { ...step, status: "pending" }
                    : idx === currentStep - 1
                    ? { ...step, status: "in-progress" }
                    : step
            )
        );

        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle skip step
    const handleSkip = () => {
        // Only allow skipping certain steps
        if (canSkipStep(currentStep)) {
            // Update step statuses
            setFormStepsState((prev) =>
                prev.map((step, idx) =>
                    idx === currentStep
                        ? { ...step, status: "completed" }
                        : idx === currentStep + 1
                        ? { ...step, status: "in-progress" }
                        : step
                )
            );

            setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
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

        // Initialize submission steps based on form data
        const initialSteps: SubmissionStep[] = [];

        // Add company step
        initialSteps.push({
            id: "company",
            message:
                data.companyType === "new"
                    ? "Creating new company..."
                    : "Using existing company...",
            status: "pending",
        });

        // Add position step
        initialSteps.push({
            id: "position",
            message:
                data.positionType === "new"
                    ? "Creating new position..."
                    : "Using existing position...",
            status: "pending",
        });

        // Add application step
        initialSteps.push({
            id: "application",
            message: "Creating application...",
            status: "pending",
        });

        // Add completion step
        initialSteps.push({
            id: "complete",
            message: "Finalizing submission...",
            status: "pending",
        });

        setSubmissionSteps(initialSteps);

        startTransition(async () => {
            try {
                let companyId: string | undefined;

                // Update company step to in-progress
                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "company"
                            ? { ...step, status: "in-progress" }
                            : step
                    )
                );
                let uploadedLogoUrl: string | undefined;

                if (data.newCompanyLogo instanceof File) {
                    uploadedLogoUrl = await uploadLogo(data.newCompanyLogo);
                } else if (typeof data.newCompanyLogo === "string") {
                    uploadedLogoUrl = data.newCompanyLogo; // If it's already a URL, keep it
                }
                if (data.companyType === "new") {
                    const companyData = {
                        name: data.newCompanyName!,
                        industry: data.newCompanyIndustry!,
                        location: data.newCompanyLocation!,
                        website: data.newCompanyWebsite,
                        logo_url: uploadedLogoUrl,
                    };

                    const newCompanyId = await createCompany(companyData);
                    if (!newCompanyId) {
                        throw new Error("Failed to create company");
                    }
                    companyId = newCompanyId;

                    // Update company step to completed
                    setSubmissionSteps((prev) =>
                        prev.map((step) =>
                            step.id === "company"
                                ? {
                                      ...step,
                                      message: "Company created successfully.",
                                      status: "completed",
                                  }
                                : step
                        )
                    );
                } else {
                    companyId = data.existingCompanyId;

                    // Update company step to completed
                    setSubmissionSteps((prev) =>
                        prev.map((step) =>
                            step.id === "company"
                                ? {
                                      ...step,
                                      message: "Using existing company.",
                                      status: "completed",
                                  }
                                : step
                        )
                    );
                }

                // Update position step to in-progress
                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "position"
                            ? { ...step, status: "in-progress" }
                            : step
                    )
                );

                let positionId: string | undefined;
                if (data.positionType === "new") {
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

                    // Update position step to completed
                    setSubmissionSteps((prev) =>
                        prev.map((step) =>
                            step.id === "position"
                                ? {
                                      ...step,
                                      message: "Position created successfully.",
                                      status: "completed",
                                  }
                                : step
                        )
                    );
                } else {
                    positionId = data.existingPositionId;

                    // Update position step to completed
                    setSubmissionSteps((prev) =>
                        prev.map((step) =>
                            step.id === "position"
                                ? {
                                      ...step,
                                      message: "Using existing position.",
                                      status: "completed",
                                  }
                                : step
                        )
                    );
                }

                // Update application step to in-progress
                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "application"
                            ? { ...step, status: "in-progress" }
                            : step
                    )
                );

                const applicationData = {
                    companyId: companyId!,
                    positionId: positionId!,
                    totalRounds: data.totalRounds!,
                    note: data.applicationNote,
                };
                await createApplication(applicationData);

                // Update application step to completed
                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "application"
                            ? {
                                  ...step,
                                  message: "Application created successfully.",
                                  status: "completed",
                              }
                            : step
                    )
                );

                // Update complete step to in-progress then completed
                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "complete"
                            ? { ...step, status: "in-progress" }
                            : step
                    )
                );

                // Add a small delay for visual effect
                await new Promise((resolve) => setTimeout(resolve, 800));

                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === "complete"
                            ? {
                                  ...step,
                                  message: "Submission complete!",
                                  status: "completed",
                              }
                            : step
                    )
                );

                toast({
                    title: "Success",
                    description: "Application submitted successfully.",
                });

                // Reset form after successful submission (with a delay)
                setTimeout(() => {
                    form.reset();
                    setIsDialogOpen(false);

                    // Reset steps status
                    setFormStepsState(
                        formSteps.map((step, index) =>
                            index === 0
                                ? { ...step, status: "in-progress" }
                                : { ...step, status: "pending" }
                        )
                    );
                }, 2000);
            } catch (error: any) {
                console.error("Submission error:", error);

                // Update current step to error
                const currentStepId = [
                    "company",
                    "position",
                    "application",
                    "complete",
                ][
                    submissionSteps.findIndex(
                        (step) => step.status === "in-progress"
                    )
                ];

                setSubmissionSteps((prev) =>
                    prev.map((step) =>
                        step.id === currentStepId
                            ? {
                                  ...step,
                                  message: `Error: ${
                                      error.message || "Failed to process"
                                  }`,
                                  status: "error",
                              }
                            : step
                    )
                );

                toast({
                    title: "Error",
                    description:
                        error.message || "Failed to submit application.",
                    variant: "destructive",
                });
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    // Render the current step
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CompanyStep />;
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

    const handleSubmit = () => {
        form.handleSubmit(onSubmit)();
    };

    return (
        <div className="max-w-4xl mx-auto">
            <SubmissionProgressDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                steps={submissionSteps}
                isSubmitting={isSubmitting}
                title="Transaction Progress"
            />

            <Card className="bg-background border-foreground/10 text-[#cccccc]">
                <CardContent className="pt-6">
                    <div className="mb-8">
                        <ProgressTracker
                            steps={formStepsState}
                            currentStepIndex={currentStep}
                            className="[&_.text-primary]:text-primary [&_.bg-primary]:bg-primary [&_.border-primary]:border-primary"
                        />
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(onSubmit);
                            }}
                            className="space-y-8"
                        >
                            {renderStep()}

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

                                    {currentStep < formSteps.length - 1 ? (
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
                                            // type="submit"
                                            disabled={isSubmitting}
                                            onClick={handleSubmit}
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
