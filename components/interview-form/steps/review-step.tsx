import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UseFormReturn } from "react-hook-form"
import { formSchema } from "../schema"
import { z } from "zod"
import { useEffect, useState } from "react"

type FormValues = z.infer<typeof formSchema>

interface Company {
  id: string
  name: string
  industry?: {
    name: string
  }
  location?: string
  website?: string
  logo_url?: string
}

interface Position {
  id: string
  title: string
  description?: string
  company_id: string
}

export function ReviewStep({
  form,
  onConfirm
}: {
  form: UseFormReturn<FormValues>
  onConfirm: () => void
}) {
  const formValues = form.getValues()
  const [company, setCompany] = useState<Company | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch company data if it's an existing company
        if (formValues.companyType === "existing" && formValues.existingCompanyId) {
          const companyResponse = await fetch(`/api/companies/${formValues.existingCompanyId}`)
          if (!companyResponse.ok) {
            throw new Error("Failed to fetch company data")
          }
          const companyData = await companyResponse.json()
          setCompany(companyData)
        }

        // Fetch position data if it's an existing position
        if (formValues.positionType === "existing" && formValues.existingPositionId) {
          const positionResponse = await fetch(`/api/positions/${formValues.existingPositionId}`)
          if (!positionResponse.ok) {
            throw new Error("Failed to fetch position data")
          }
          const positionData = await positionResponse.json()
          setPosition(positionData)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [formValues.companyType, formValues.existingCompanyId, formValues.positionType, formValues.existingPositionId])

  if (loading) {
    return <div className="text-center py-8">Loading review data...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review Your Application</h2>
      <p className="text-[#8a8a8a] mb-6">Please review all the information below before submitting your application.</p>

      <div className="space-y-6">
        {/* Company Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="mr-2">1.</span>
            Company Information
          </h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="flex justify-between items-start ">
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-start w-full pr-4">
                  <div>
                    <span className="text-[#8a8a8a]">Company Name:</span>
                    <p className="font-medium">
                      {formValues.companyType === "existing" && company
                        ? company.name
                        : formValues.newCompanyName}
                    </p>
                  </div>
                  <div>
                    <img src={formValues.companyType === "existing" ? company?.logo_url : formValues.newCompanyLogo} alt={company?.name} className="w-10 h-10 rounded-full" />
                  </div>
                </div>
                <div>
                  <span className="text-[#8a8a8a]">Industry:</span>
                  <p>
                    {formValues.companyType === "existing" && company?.industry
                      ? company.industry.name
                      : formValues.newCompanyIndustry}
                  </p>
                </div>
                <div>
                  <span className="text-[#8a8a8a]">Location:</span>
                  <p>
                    {formValues.companyType === "existing" && company
                      ? company.location || "Not specified"
                      : formValues.newCompanyLocation}
                  </p>
                </div>
                {formValues.companyType === "new" && formValues.newCompanyWebsite && (
                  <div>
                    <span className="text-[#8a8a8a]">Website:</span>
                    <p>{formValues.newCompanyWebsite}</p>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="bg-[#252526] text-[#cccccc] border-[#3c3c3c]">
                {formValues.companyType === "existing" ? "Existing" : "New"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3c3c3c]" />

        {/* Position Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="mr-2">2.</span>
            Position Details
          </h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div>
                  <span className="text-[#8a8a8a]">Position Title:</span>
                  <p className="font-medium">
                    {formValues.positionType === "existing" && position
                      ? position.title
                      : formValues.newPositionTitle}
                  </p>
                </div>
                {(formValues.positionType === "new" && formValues.newPositionDescription) && (
                  <div>
                    <span className="text-[#8a8a8a]">Description:</span>
                    <p className="text-sm">{formValues.newPositionDescription}</p>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="bg-[#252526] text-[#cccccc] border-[#3c3c3c]">
                {formValues.positionType === "existing" ? "Existing" : "New"}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-[#3c3c3c]" />

        {/* Application Section */}
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="mr-2">3.</span>
            Application Details
          </h3>
          <div className="bg-[#1e1e1e] rounded-md p-4 border border-[#3c3c3c]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">

                {formValues.source_channel && (
                  <div>
                    <span className="text-[#8a8a8a]">Source Channel:</span>
                    <p className="font-medium">{formValues.source_channel}</p>
                  </div>
                )}
                {formValues.applied_date && (
                  <div>
                    <span className="text-[#8a8a8a]">Applied Date:</span>
                    <p className="font-medium">{new Date(formValues.applied_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
              </div>
              {formValues.applicationNote && (
                <div>
                  <span className="text-[#8a8a8a]">Additional Notes:</span>
                  <p className="text-sm mt-1">{formValues.applicationNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

