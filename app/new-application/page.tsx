"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import SharedLayout from "@/components/SharedLayout"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createApplication } from "./action/action"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Form schema for the entire form
const formSchema = z.object({
  // Company section
  companyType: z.enum(["existing", "new"]),
  existingCompanyId: z.string().optional(),
  newCompanyName: z.string().optional(),
  newCompanyIndustry: z.string().optional(),
  newCompanyLocation: z.string().optional(),

  // Position section
  positionType: z.enum(["existing", "new"]),
  existingPositionId: z.string().optional(),
  newPositionTitle: z.string().min(1, "Position title is required").optional(),
  newPositionDescription: z.string().optional(),

  // Application section
  totalRounds: z.coerce.number().min(1, "At least one round is required"),
  applicationNote: z.string().optional(),

  // Interview round section
  interviewStatus: z.string().default("Scheduled"),
  interviewFeedback: z.string().optional(),
  interviewNote: z.string().optional(),
})

// Mock data for companies and positions
// In a real app, you would fetch this from your database
const mockCompanies = [
  { id: "1", name: "Google" },
  { id: "2", name: "Microsoft" },
  { id: "3", name: "Amazon" },
]

const mockPositions = [
  { id: "1", companyId: "1", title: "Software Engineer" },
  { id: "2", companyId: "1", title: "Product Manager" },
  { id: "3", companyId: "2", title: "Frontend Developer" },
  { id: "4", companyId: "3", title: "Data Scientist" },
]

export default function InterviewForm() {
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
  })

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

      // Reset the form
      form.reset()

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

  return (
    <SharedLayout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Company Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Selection</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="existing">Select an existing company</SelectItem>
                              <SelectItem value="new">Add a new company</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("companyType") === "existing" && (
                      <FormField
                        control={form.control}
                        name="existingCompanyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Company</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mockCompanies.map((company) => (
                                  <SelectItem key={company.id} value={company.id}>
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("companyType") === "new" && (
                      <>
                        <FormField
                          control={form.control}
                          name="newCompanyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newCompanyIndustry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Technology, Healthcare" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newCompanyLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. San Francisco, CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Position Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Position Information</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="positionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position Selection</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="existing">Select an existing position</SelectItem>
                              <SelectItem value="new">Add a new position</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("positionType") === "existing" && (
                      <FormField
                        control={form.control}
                        name="existingPositionId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Position</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getFilteredPositions().map((position) => (
                                  <SelectItem key={position.id} value={position.id}>
                                    {position.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("positionType") === "new" && (
                      <>
                        <FormField
                          control={form.control}
                          name="newPositionTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position Title</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="newPositionDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter job description and requirements"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Application Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Application Information</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="totalRounds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Interview Rounds</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>How many interview rounds do you expect for this position?</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applicationNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional notes about your application"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Interview Round Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">First Interview Round</h2>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="interviewStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interview Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interviewFeedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback (if completed)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any feedback received from the interview"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interviewNote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interview Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your personal notes about the interview (questions asked, your responses, etc.)"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </SharedLayout>
  )
}

