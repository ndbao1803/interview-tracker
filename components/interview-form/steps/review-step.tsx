import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"

type FormValues = z.infer<typeof formSchema>

interface Company {
  id: string
  name: string
}

interface Position {
  id: string
  companyId: string
  title: string
}

export function ReviewStep({ 
  form, 
  mockCompanies, 
  mockPositions 
}: { 
  form: UseFormReturn<FormValues>
  mockCompanies: Company[]
  mockPositions: Position[]
}) {
  const formValues = form.getValues()

  // Get company name
  const getCompanyName = () => {
    if (formValues.companyType === "existing") {
      const company = mockCompanies.find((c) => c.id === formValues.existingCompanyId)
      return company ? company.name : "Unknown Company"
    } else {
      return formValues.newCompanyName || "New Company"
    }
  }

  // Get position title
  const getPositionTitle = () => {
    if (formValues.positionType === "existing") {
      const position = mockPositions.find((p) => p.id === formValues.existingPositionId)
      return position ? position.title : "Unknown Position"
    } else {
      return formValues.newPositionTitle || "New Position"
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review Your Application</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Company</h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{getCompanyName()}</p>
                {formValues.companyType === "new" && (
                  <>
                    <p className="text-sm text-[#8a8a8a] mt-1">
                      {formValues.newCompanyIndustry || "No industry specified"}
                    </p>
                    <p className="text-sm text-[#8a8a8a]">{formValues.newCompanyLocation || "No location specified"}</p>
                  </>
                )}
              </div>
              <Badge variant="outline" className="bg-[#252526] text-[#cccccc] border-[#3c3c3c]">
                {formValues.companyType === "existing" ? "Existing" : "New"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3c3c3c]" />

        <div>
          <h3 className="text-lg font-medium mb-2">Position</h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{getPositionTitle()}</p>
                {formValues.positionType === "new" && formValues.newPositionDescription && (
                  <p className="text-sm text-[#8a8a8a] mt-1">{formValues.newPositionDescription}</p>
                )}
              </div>
              <Badge variant="outline" className="bg-[#252526] text-[#cccccc] border-[#3c3c3c]">
                {formValues.positionType === "existing" ? "Existing" : "New"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3c3c3c]" />

        <div>
          <h3 className="text-lg font-medium mb-2">Application Details</h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8a8a8a]">Total Rounds:</span>
                <span>{formValues.totalRounds}</span>
              </div>
              {formValues.applicationNote && (
                <div>
                  <span className="text-[#8a8a8a] block mb-1">Notes:</span>
                  <p className="text-sm">{formValues.applicationNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {(formValues.interviewStatus !== "Scheduled" || formValues.interviewFeedback || formValues.interviewNote) && (
          <>
            <Separator className="bg-[#3c3c3c]" />

            <div>
              <h3 className="text-lg font-medium mb-2">First Interview</h3>
              <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8a8a8a]">Status:</span>
                    <Badge
                      className={`
                        ${formValues.interviewStatus === "Completed" ? "bg-green-900 text-green-100" : ""}
                        ${formValues.interviewStatus === "Scheduled" ? "bg-blue-900 text-blue-100" : ""}
                        ${formValues.interviewStatus === "Pending" ? "bg-yellow-900 text-yellow-100" : ""}
                        ${formValues.interviewStatus === "Cancelled" ? "bg-red-900 text-red-100" : ""}
                      `}
                    >
                      {formValues.interviewStatus}
                    </Badge>
                  </div>
                  {formValues.interviewFeedback && (
                    <div>
                      <span className="text-[#8a8a8a] block mb-1">Feedback:</span>
                      <p className="text-sm">{formValues.interviewFeedback}</p>
                    </div>
                  )}
                  {formValues.interviewNote && (
                    <div>
                      <span className="text-[#8a8a8a] block mb-1">Notes:</span>
                      <p className="text-sm">{formValues.interviewNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

