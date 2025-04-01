"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"

import { CompanyStep } from "./steps/company-step"
import { PositionStep } from "./steps/position-step"
import { ApplicationStep } from "./steps/application-step"
import { InterviewStep } from "./steps/interview-step"
import { ReviewStep } from "./steps/review-step"
import { formSchema } from "./schema"
import { createApplication } from "./action/action"

// Mock data for companies and positions
// In a real app, you would fetch this from your database
export const mockCompanies = [
  { id: "1", name: "Google" },
  { id: "2", name: "Microsoft" },
  { id: "3", name: "Amazon" },
]

export const mockPositions = [
  { id: "1", companyId: "1", title: "Software Engineer" },
  { id: "2", companyId: "1", title: "Product Manager" },
  { id: "3", companyId: "2", title: "Frontend Developer" },
  { id: "4", companyId: "3", title: "Data Scientist" },
]

const steps = [
  { id: "company", label: "Company" },
  { id: "position", label: "Position" },
  { id: "application", label: "Application" },
  { id: "review", label: "Review" },
]

export default function InterviewForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyType: "existing",
      positionType: "existing",
      totalRounds: 3,
      interviewStatus: "Scheduled",
    },
    mode: "onChange",
  })

  const { formState } = form
  const { isValid } = formState

  // Calculate progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100

  // Handle next step
  const handleNext = async () => {
    // Validate the current step before proceeding
    const fieldsToValidate = getFieldsToValidate(currentStep)
    const isStepValid = await form.trigger(fieldsToValidate)

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  // Handle skip step
  const handleSkip = () => {
    // Only allow skipping certain steps
    if (canSkipStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  // Check if the current step can be skipped
  const canSkipStep = (step: number) => {
    // Position step can be skipped if using existing company
    if (step === 1 && form.watch("companyType") === "existing") {
      return true
    }
    // Interview step can be skipped initially
    if (step === 3) {
      return true
    }
    return false
  }

  // Get fields to validate for the current step
  const getFieldsToValidate = (step: number): Array<keyof z.infer<typeof formSchema>> => {
    switch (step) {
      case 0: // Company step
        return form.watch("companyType") === "existing"
          ? ["companyType", "existingCompanyId"]
          : ["companyType", "newCompanyName"]
      case 1: // Position step
        return form.watch("positionType") === "existing"
          ? ["positionType", "existingPositionId"]
          : ["positionType", "newPositionTitle"]
      case 2: // Application step
        return ["totalRounds"]
      case 3: // Interview step
        return ["interviewStatus"]
      default:
        return []
    }
  }

  // Filter positions based on selected company
  const getFilteredPositions = () => {
    const companyId = form.watch("existingCompanyId")
    if (!companyId) return []
    return mockPositions.filter((pos) => pos.companyId === companyId)
  }

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Format the data to match the expected structure
      const formattedData = {
        company: {
          companyType: data.companyType,
          existingCompanyId: data.existingCompanyId,
          newCompanyName: data.newCompanyName,
          newCompanyIndustry: data.newCompanyIndustry,
          newCompanyLocation: data.newCompanyLocation,
        },
        position: {
          positionType: data.positionType,
          existingPositionId: data.existingPositionId,
          newPositionTitle: data.newPositionTitle,
          newPositionDescription: data.newPositionDescription,
        },
        application: {
          totalRounds: data.totalRounds,
          note: data.applicationNote,
        },
        interviewRound: {
          roundNumber: 1,
          status: data.interviewStatus,
          feedback: data.interviewFeedback,
          note: data.interviewNote,
        },
      }

      // Submit the data
      await createApplication(formattedData)

      toast({
        title: "Application created!",
        description: "Your interview has been successfully tracked.",
      })

      // Reset the form and go back to first step
      form.reset()
      setCurrentStep(0)

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem creating your application.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyStep form={form} mockCompanies={mockCompanies} />
      case 1:
        return <PositionStep form={form} filteredPositions={getFilteredPositions()} />
      case 2:
        return <ApplicationStep form={form} />
      case 3:
        return <ReviewStep form={form} mockCompanies={mockCompanies} mockPositions={mockPositions} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-background border-foreground/10 text-[#cccccc]">
        <CardContent className="pt-6">
          {/* Progress bar and steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-xs font-medium ${
                    index === currentStep ? "text-primary" : index < currentStep ? "text-[#cccccc]" : "text-[#8a8a8a]"
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {renderStep()}

              {/* Navigation buttons */}
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
                      disabled={!isValid}
                      className="bg-primary hover:bg-primary-hover"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="bg-[#0e639c] hover:bg-[#1177bb]">
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
  )
}

